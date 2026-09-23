# Citra Supplier & Procurement Governance Prototype — Phase 1

## Purpose
This is a professional interactive proof-of-concept for a proposed Citra Supplier, Procurement, Contract Governance and Community Development Management System.

It demonstrates the agreed Phase 1 workflow from CSD-based supplier onboarding through hidden category-specific compliance, community-first sourcing, procurement, approvals, contract management, eight-department contractor performance ratings and governance/audit controls.

## Prototype URL
`https://gavs280.github.io/citra-procurement/`

## Phase 1 safety boundary
This repository is public and therefore contains **demo data only**. It does not store real Citra procurement information, contractor personal information, banking details, IDs, confidential budgets, credentials or production documents.

The following are represented as workflow simulations in Phase 1 and require a secure backend in production:
- real authentication and MFA/OTP delivery;
- CSD/CIPC/SARS/other regulatory API verification;
- production document storage and malware scanning;
- confidential internal budget storage;
- immutable database audit logs;
- real role/permission enforcement;
- encrypted storage of IDs, banking, criminal or other sensitive information;
- real email/SMS notifications;
- production approval signatures;
- legal-hold/retention automation;
- backups/disaster recovery;
- Mission Control and Citra document-repository integration.

## Core governance model
1. CSD confirmation.
2. Base supplier verification.
3. Community/geographic classification.
4. CSD industry/commodity mapping.
5. Category request and Citra screening.
6. Hidden category-specific compliance pack.
7. Approved supplier category.
8. Blue Downs community-first sourcing.
9. Controlled expansion when local capacity cannot satisfy the requirement.
10. RFI/RFQ/RFP/Tender workflow.
11. Secure submission and bid integrity controls.
12. Technical and commercial evaluation.
13. Major decision narrative and approval chain.
14. Contract, variation, invoice and close-out controls.
15. Eight-department rating model: 8 × 12.5% = 100%.
16. Quality Index and material performance events.
17. Supplier-development and community-development reporting.
18. Immutable audit history and silent governance alerts.

## Material decision approval model
For major Procurement-originated decisions the prototype represents:

**Procurement recommendation → Construction Manager → Development Manager → Development Director → CEO**

Each material decision requires a meaningful written motivation. Each approver must approve, reject or return for clarification with a comment.

Routine administrative actions are logged but do not require the full executive chain.

## Community-first procurement
The prototype uses the following configurable sourcing hierarchy:

**Blue Downs → Cape Town → Western Cape → South Africa → Specialist / International**

Moving outside the community supplier pool requires recorded evidence of the community search, a compulsory reason and prescribed approval.

The exact Blue Downs/community geographic definition remains a Citra policy setting and is intentionally not hard-coded.

## Budget confidentiality
The internal procurement estimate is restricted commercial information. Technical evaluators ordinarily see only whether funding is approved. Contractors never see Citra's confidential internal estimate unless Citra expressly elects to publish a ceiling/range for a specific procurement.

## Contractor rating
Every relevant Citra department contributes up to **12.5 percentage points** to the contractor's overall score. Eight departmental contributions produce a maximum of 100%. Quality is embedded as a mandatory core criterion and is also surfaced separately as a Quality Index.

## Phase 2
Phase 2 should replace the demo-data and browser-only workflow with a secure production architecture, database, authentication, OTP/email/SMS, integration APIs, encrypted document storage, server-side access controls, audit persistence and Mission Control integration.
