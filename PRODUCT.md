# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web: public commercial website and a separate application workspace.

## Users

- Finance and operations teams introducing purchasing agents into existing financial workflows.
- Developers integrating agent actions, human approvals and purchase evidence.
- Teams using one financial provider or several, such as Brex alone or Brex and Ramp together.

## Product Purpose

TRUSTY.bot is building an intent authorization layer: verify that an agent's proposed purchase matches the person's confirmed instruction before execution. Quantity, specifications, delivery and budget all matter; staying within budget does not establish consent to a different purchase.

## Positioning

A layer that validates, supports and strengthens existing financial workflows. Brex, Ramp and Slash are target platforms, not announced partners or currently shipped connectors. Customers should be able to begin with one supported provider and add others. Becoming a broader financial platform is a long-term ambition, not a current capability.

## Capabilities and Constraints

Implemented public surface:

- `/`: commercial explanation of intent authorization, workflow, provider scenarios and pilot.
- `/demo`: local illustrative purchase checks for quantity, RAM, delivery and total, with an example JSON decision record. No payment is submitted.
- `/contact`: pilot discussion through `paulo@trusty.bot` using the visitor's email application; no server-side lead collection.
- `/docs`: integration approach and explicit current availability.
- `/app`: existing agent exploration, crawler/discovery, repository scanner, ranking, scoring, authentication interface and legacy decision simulator.

The workspace retains public exploration and existing authentication behavior. Moving it to `/app` does not introduce a secure multi-tenant authorization backend. Legacy simulator output is not proof of an executed financial transaction.

Planned work includes confirmed mandates, durable evidence, authenticated policy decisions, human review, purchase-bound approvals, provider execution controls and observed-outcome reconciliation. See [the implementation plan](specs/06_AUTHORIZATION_LAYER_IMPLEMENTATION_PLAN.md).

## Brand Commitments

- Clear, precise financial software language with visible boundaries between example, plan and available capability.
- A commercial website with the clarity and confidence of established financial platforms, using TRUSTY's own identity.
- Technical exploration belongs in the application; the public website explains customer value and the first workflow.

## Product Principles

1. Verify the human instruction against the actual proposed purchase.
2. Explain each criterion and disclose missing evidence.
3. Bind future authorization to the reviewed action; financial provider controls still apply.
4. Support one or multiple providers without suggesting integrations already exist.
5. Distinguish authorization, execution and observed outcome.
