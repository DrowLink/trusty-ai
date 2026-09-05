import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, Firestore } from 'firebase/firestore';
import { AgentRecord } from '../types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseDb(): Firestore | null {
  if (!isFirebaseConfigured) return null;
  try {
    if (!app) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
    if (!db && app) {
      db = getFirestore(app);
    }
    return db;
  } catch (err) {
    console.warn('[Firebase] Firestore init error:', err);
    return null;
  }
}

const COLLECTION_NAME = 'trusty_agents';

/**
 * Fetch all custom audited agents from Firestore collection
 */
export async function fetchFirestoreAgents(): Promise<AgentRecord[]> {
  const firestore = getFirebaseDb();
  if (!firestore) return [];

  try {
    const colRef = collection(firestore, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    const agents: AgentRecord[] = [];
    snapshot.forEach(docSnap => {
      agents.push(docSnap.data() as AgentRecord);
    });
    return agents;
  } catch (err) {
    console.warn('[Firebase] Failed to fetch agents from Firestore:', err);
    return [];
  }
}

/**
 * Persist or update an agent record in Firestore
 */
export async function saveAgentToFirestore(agent: AgentRecord): Promise<boolean> {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docRef = doc(firestore, COLLECTION_NAME, agent.id);
    await setDoc(docRef, agent, { merge: true });
    return true;
  } catch (err) {
    console.warn(`[Firebase] Failed to save agent ${agent.id} to Firestore:`, err);
    return false;
  }
}

/**
 * Bulk persist agent records
 */
export async function bulkSaveAgentsToFirestore(agents: AgentRecord[]): Promise<number> {
  const firestore = getFirebaseDb();
  if (!firestore || agents.length === 0) return 0;

  let savedCount = 0;
  for (const agent of agents) {
    const ok = await saveAgentToFirestore(agent);
    if (ok) savedCount++;
  }
  return savedCount;
}

export function getFirebaseStatus() {
  return {
    configured: isFirebaseConfigured,
    projectId: firebaseConfig.projectId ? `${firebaseConfig.projectId.slice(0, 4)}***` : null,
  };
}
