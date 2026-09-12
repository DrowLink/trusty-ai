import { HumanMandate, ApprovalQueueItem, VerifiedDecisionRecord } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const MANDATES_FILE = path.join(DATA_DIR, 'intent_mandates.json');
const APPROVALS_FILE = path.join(DATA_DIR, 'intent_approvals.json');
const DECISIONS_FILE = path.join(DATA_DIR, 'intent_decisions.json');

function ensureDataDir() {
  if (typeof window === 'undefined' && !fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      // Ignored in read-only environments
    }
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`[IntentStore] Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile(filePath: string, data: any): void {
  try {
    if (typeof window === 'undefined') {
      ensureDataDir();
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn(`[IntentStore] Error writing to ${filePath}:`, err);
  }
}

// Timeout helper: prevents hanging when tables are not yet created in Supabase
function withTimeout<T = any>(promise: PromiseLike<T> | Promise<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Supabase request timed out')), ms)),
  ]);
}

class IntentStorageManager {
  private mandatesCache: HumanMandate[] = [];
  private approvalsCache: ApprovalQueueItem[] = [];
  private decisionsCache: VerifiedDecisionRecord[] = [];
  private isInitialized = false;
  private isSupabaseOnline = isSupabaseConfigured;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;
    this.mandatesCache = readJsonFile<HumanMandate[]>(MANDATES_FILE, []);
    this.approvalsCache = readJsonFile<ApprovalQueueItem[]>(APPROVALS_FILE, []);
    this.decisionsCache = readJsonFile<VerifiedDecisionRecord[]>(DECISIONS_FILE, []);
    this.isInitialized = true;
  }

  // ================= MANDATES =================

  public async getMandates(): Promise<HumanMandate[]> {
    this.init();
    if (this.isSupabaseOnline && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('mandates')
            .select('*')
            .order('created_at', { ascending: false })
        );

        if (!error && data && data.length > 0) {
          const mapped: HumanMandate[] = data.map((row: any) => ({
            id: row.id,
            title: row.title,
            version: row.version,
            status: row.status,
            principalName: row.principal_name,
            principalRole: row.principal_role,
            description: row.description,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
            budgetTotal: Number(row.budget_total),
            budgetSpent: Number(row.budget_spent),
            budgetReserved: Number(row.budget_reserved),
            currency: row.currency,
            clearingRail: row.clearing_rail,
            cardIdentifier: row.card_identifier,
            itemsConstraint: row.items_constraint,
            deliveryAddress: row.delivery_address,
            allowedVendors: row.allowed_vendors,
            approvers: row.approvers,
            autoApprovalMax: Number(row.auto_approval_max),
          }));
          this.mandatesCache = mapped;
          writeJsonFile(MANDATES_FILE, mapped);
          return mapped;
        }
      } catch (err) {
        // Fallback gracefully to local file cache
      }
    }
    return this.mandatesCache;
  }

  public async saveMandate(mandate: HumanMandate): Promise<HumanMandate> {
    this.init();
    this.mandatesCache = [mandate, ...this.mandatesCache.filter(m => m.id !== mandate.id)];
    writeJsonFile(MANDATES_FILE, this.mandatesCache);

    if (this.isSupabaseOnline && supabase) {
      try {
        const row = {
          id: mandate.id,
          title: mandate.title,
          version: mandate.version,
          status: mandate.status,
          principal_name: mandate.principalName,
          principal_role: mandate.principalRole,
          description: mandate.description,
          budget_total: mandate.budgetTotal,
          budget_spent: mandate.budgetSpent,
          budget_reserved: mandate.budgetReserved,
          currency: mandate.currency,
          clearing_rail: mandate.clearingRail,
          card_identifier: mandate.cardIdentifier,
          items_constraint: mandate.itemsConstraint,
          delivery_address: mandate.deliveryAddress,
          allowed_vendors: mandate.allowedVendors,
          approvers: mandate.approvers,
          auto_approval_max: mandate.autoApprovalMax,
          created_at: mandate.createdAt,
          expires_at: mandate.expiresAt,
        };
        await withTimeout(supabase.from('mandates').upsert(row, { onConflict: 'id' }));
      } catch (err) {
        // Preserved in local file cache
      }
    }

    return mandate;
  }

  // ================= APPROVAL QUEUE =================

  public async getApprovalQueue(): Promise<ApprovalQueueItem[]> {
    this.init();
    if (this.isSupabaseOnline && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('approval_queue')
            .select('*')
            .order('created_at', { ascending: false })
        );

        if (!error && data && data.length > 0) {
          const mapped: ApprovalQueueItem[] = data.map((row: any) => ({
            id: row.id,
            timestamp: row.created_at,
            agentId: row.agent_id,
            agentName: row.agent_name,
            mandateId: row.mandate_id,
            mandateTitle: row.mandate_title,
            requestedAmount: Number(row.requested_amount),
            budgetLimit: Number(row.budget_limit),
            clearingRail: row.clearing_rail,
            vendor: row.vendor,
            status: row.status,
            mismatchType: row.mismatch_type,
            mismatchSeverity: row.mismatch_severity,
            reason: row.reason,
            cartSnapshot: row.cart_snapshot,
            criteriaChecks: row.criteria_checks,
            resolutionNote: row.resolution_note,
            resolvedAt: row.resolved_at,
            resolvedBy: row.resolved_by,
          }));
          this.approvalsCache = mapped;
          writeJsonFile(APPROVALS_FILE, mapped);
          return mapped;
        }
      } catch (err) {
        // Fallback to local
      }
    }
    return this.approvalsCache;
  }

  public async saveApprovalItem(item: ApprovalQueueItem): Promise<ApprovalQueueItem> {
    this.init();
    this.approvalsCache = [item, ...this.approvalsCache.filter(i => i.id !== item.id)];
    writeJsonFile(APPROVALS_FILE, this.approvalsCache);

    if (this.isSupabaseOnline && supabase) {
      try {
        const row = {
          id: item.id,
          mandate_id: item.mandateId,
          mandate_title: item.mandateTitle,
          agent_id: item.agentId,
          agent_name: item.agentName,
          requested_amount: item.requestedAmount,
          budget_limit: item.budgetLimit,
          clearing_rail: item.clearingRail,
          vendor: item.vendor,
          status: item.status,
          mismatch_type: item.mismatchType,
          mismatch_severity: item.mismatchSeverity,
          reason: item.reason,
          cart_snapshot: item.cartSnapshot,
          criteria_checks: item.criteriaChecks,
          resolution_note: item.resolutionNote || '',
          resolved_at: item.resolvedAt || null,
          resolved_by: item.resolvedBy || '',
          created_at: item.timestamp,
        };
        await withTimeout(supabase.from('approval_queue').upsert(row, { onConflict: 'id' }));
      } catch (err) {
        // Preserved in local
      }
    }

    return item;
  }

  // ================= DECISIONS AUDIT =================

  public async getDecisions(): Promise<VerifiedDecisionRecord[]> {
    this.init();
    if (this.isSupabaseOnline && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('decisions')
            .select('*')
            .order('created_at', { ascending: false })
        );

        if (!error && data && data.length > 0) {
          const mapped: VerifiedDecisionRecord[] = data.map((row: any) => ({
            id: row.id,
            timestamp: row.created_at,
            agentId: row.agent_id,
            agentName: row.agent_name,
            mandateId: row.mandate_id,
            mandateTitle: row.mandate_title,
            decision: row.decision,
            amount: Number(row.amount),
            currency: row.currency,
            rail: row.rail,
            vendor: row.vendor,
            cartHash: row.cart_hash,
            intentMatchRatio: Number(row.intent_match_ratio),
            executionStatus: row.execution_status,
            criteria: row.criteria,
            proofJson: row.proof_json,
          }));
          this.decisionsCache = mapped;
          writeJsonFile(DECISIONS_FILE, mapped);
          return mapped;
        }
      } catch (err) {
        // Fallback to local
      }
    }
    return this.decisionsCache;
  }

  public async saveDecision(decision: VerifiedDecisionRecord): Promise<VerifiedDecisionRecord> {
    this.init();
    this.decisionsCache = [decision, ...this.decisionsCache.filter(d => d.id !== decision.id)];
    writeJsonFile(DECISIONS_FILE, this.decisionsCache);

    if (this.isSupabaseOnline && supabase) {
      try {
        const row = {
          id: decision.id,
          mandate_id: decision.mandateId,
          mandate_title: decision.mandateTitle,
          agent_id: decision.agentId,
          agent_name: decision.agentName,
          decision: decision.decision,
          amount: decision.amount,
          currency: decision.currency,
          rail: decision.rail,
          vendor: decision.vendor,
          cart_hash: decision.cartHash,
          intent_match_ratio: decision.intentMatchRatio,
          execution_status: decision.executionStatus,
          criteria: decision.criteria,
          proof_json: decision.proofJson,
          created_at: decision.timestamp,
        };
        await withTimeout(supabase.from('decisions').upsert(row, { onConflict: 'id' }));
      } catch (err) {
        // Preserved in local
      }
    }

    return decision;
  }

  // ================= DEMO SEEDING / RESET =================
  public async loadSampleData(mandates: HumanMandate[], approvals: ApprovalQueueItem[], decisions: VerifiedDecisionRecord[]) {
    this.init();
    this.mandatesCache = [...mandates];
    this.approvalsCache = [...approvals];
    this.decisionsCache = [...decisions];
    writeJsonFile(MANDATES_FILE, mandates);
    writeJsonFile(APPROVALS_FILE, approvals);
    writeJsonFile(DECISIONS_FILE, decisions);
  }

  public async clearAll() {
    this.mandatesCache = [];
    this.approvalsCache = [];
    this.decisionsCache = [];
    writeJsonFile(MANDATES_FILE, []);
    writeJsonFile(APPROVALS_FILE, []);
    writeJsonFile(DECISIONS_FILE, []);
  }
}

export const intentStore = new IntentStorageManager();
