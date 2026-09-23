# Citra Supplier & Procurement Governance Prototype — Phase 1

## Purpose
This is a professional interactive proof-of-concept for a proposed **Citra Supplier, Procurement, Contract Governance and Community Development Management System**.

The purpose of this README is to explain, in management language, **what each of the 143 Phase 1 controls does and why it is included**. The numbered items below match the Phase 1 Acceptance Register exactly.

## Prototype URL
`https://gavs280.github.io/citra-procurement/`

## Important Phase 1 boundary
This is a public front-end prototype and therefore uses demo data only. It does **not** store real Citra procurement information, contractor personal information, banking details, IDs, confidential budgets, credentials or production documents.

Items marked as production-dependent in the acceptance register are represented in the interface but require a secure backend, database, authentication service or external integration before operational use.

---

# 143-Point Design Rationale

## Foundation, access and identity

### 1. Create GitHub project path
**Reason:** Provides a controlled, versioned location for the prototype without interfering with existing projects and gives management a stable demonstration link.

### 2. Application foundation
**Reason:** Establishes the technical structure, navigation, responsive layout and reusable components required for the rest of the system.

### 3. Demo-data layer
**Reason:** Allows realistic demonstrations without exposing genuine contractor, employee, budget or procurement information in a public prototype.

### 4. System configuration layer represented
**Reason:** Key policy values such as thresholds, SLAs, sourcing boundaries and approval levels should be configurable rather than permanently hard-coded.

### 5. User-role architecture
**Reason:** Different users require different responsibilities and visibility, such as contractor, Procurement, Finance, H&S, management, executive and administrator roles.

### 6. Role-based permissions represented
**Reason:** Prevents users from seeing or changing information outside their authority and supports confidentiality and segregation of duties.

### 7. Segregation-of-duties rules
**Reason:** Reduces fraud, error and inappropriate self-approval by separating initiation, evaluation, verification and approval responsibilities.

### 8. Main landing page
**Reason:** Gives users a clear professional entry point and routes suppliers and internal Citra users into the correct workflows.

### 9. Supplier login/registration workflow represented
**Reason:** Provides controlled access to supplier records and ensures submissions can be attributed to an identified account.

### 10. Primary Supplier Administrator model
**Reason:** Gives each supplier one accountable person who manages authorised company users instead of allowing uncontrolled shared access.

### 11. Contact verification / OTP simulation
**Reason:** Confirms that the user controls the registered email address or phone number and reduces fraudulent account creation or takeover.

### 12. Phone-number change workflow
**Reason:** Sensitive contact changes should be verified through an existing trusted channel and the new number before becoming active.

### 13. Email-address change workflow
**Reason:** Prevents unauthorised redirection of supplier communications, password resets, tender notices and account-recovery messages.

### 14. Enhanced recovery workflow represented
**Reason:** If both normal contact channels are lost, recovery should require stronger identity and company verification rather than a weak reset process.

### 15. Suspicious contact-change controls
**Reason:** Multiple or unusual contact changes can indicate attempted account takeover and should trigger additional scrutiny.

## Supplier onboarding and verification

### 16. Gate 0 — CSD Confirmation
**Reason:** Establishes a consistent supplier identity baseline and provides a recognised source of core supplier information before Citra performs deeper verification.

### 17. CSD exception route
**Reason:** Allows legitimate specialist, foreign, emergency or in-progress suppliers to be handled without bypassing governance or creating an uncontrolled workaround.

### 18. Base Supplier Verification
**Reason:** Confirms the legal entity, tax, ownership, banking, addresses and other core information before the supplier is considered for work.

### 19. Sensitive supplier-master controls
**Reason:** Changes to directors, ownership, legal entity details or authorised representatives can materially affect risk and must trigger re-verification.

### 20. Bank-change enhanced verification
**Reason:** Banking-detail fraud is a major payment risk, so bank changes require stronger validation and an auditable history.

### 21. Annual supplier re-certification
**Reason:** Prevents suppliers from remaining indefinitely approved using outdated ownership, banking, contact or compliance information.

### 22. Inactivity / reverification status
**Reason:** Dormant or materially outdated suppliers should be rechecked before being treated as actively approved.

### 23. Community Supplier Classification
**Reason:** Allows Citra to identify genuine community suppliers and support local economic participation using verifiable criteria.

### 24. Geographic sourcing tiers
**Reason:** Creates a structured sourcing hierarchy from Blue Downs outward, rather than allowing arbitrary external sourcing.

### 25. Contractor-category taxonomy
**Reason:** Organises the wide range of contractor disciplines into manageable categories with appropriate rules and opportunities.

### 26. CSD activity mapping
**Reason:** Helps compare what a supplier declares it does with the categories it requests, reducing unrelated or opportunistic registrations.

### 27. Category Request
**Reason:** Requires suppliers to deliberately request specific work categories instead of automatically gaining access to every discipline.

### 28. Citra Category Screening
**Reason:** Allows Citra to assess whether a category request is credible before requesting specialist compliance documentation.

### 29. Hidden category requirements
**Reason:** Suppliers should only see compliance requirements relevant to categories they are pursuing, keeping the portal simpler and protecting internal screening logic.

### 30. Trade-specific compliance rules architecture
**Reason:** Different services carry different legal, safety and professional requirements; a single generic supplier checklist would be inadequate.

### 31. Requirement classification
**Reason:** Clearly distinguishes statutory requirements, Citra policy, tender-specific conditions and preferred criteria so internal policy is not incorrectly presented as law.

### 32. Regulatory-rule versioning
**Reason:** Laws, standards and professional requirements change; the system must record which rule version applied at a particular time.

### 33. Document-expiry monitoring
**Reason:** Gives suppliers and Citra advance warning before important compliance documents expire and disrupt eligibility or work.

## Supplier usability, errors and corrections

### 34. Contractor error and correction framework
**Reason:** Distinguishes genuine correctable mistakes from compliance failures or material tender defects so suppliers are treated consistently and fairly.

### 35. Save Draft
**Reason:** Allows suppliers, especially smaller businesses, to complete applications over time without losing progress.

### 36. Completeness validation architecture
**Reason:** Detects missing information, invalid formats and obvious document problems before submissions enter Procurement for manual review.

### 37. Action Required workflow
**Reason:** Gives suppliers a precise explanation of what is wrong, what must be corrected and by when.

### 38. Document replacement history
**Reason:** Preserves the original and replacement versions so corrections cannot erase the historical record.

### 39. Request Assistance
**Reason:** Gives suppliers a formal help channel linked to the exact registration, document or tender instead of fragmented email exchanges.

### 40. Staff-assisted community onboarding
**Reason:** Supports less digitally capable local suppliers while recording which Citra employee assisted and what was captured on the supplier's behalf.

### 41. Approved Supplier Database model
**Reason:** Creates one structured source for supplier identity, approved categories, compliance, community status and history.

### 42. Supplier work-capacity tracking
**Reason:** Helps Citra avoid overloading a small contractor with more simultaneous work than it can reasonably deliver.

## Procurement initiation and commercial governance

### 43. Internal procurement requisition
**Reason:** Ensures every sourcing exercise starts with a documented business need, scope, project, estimated value, requester and required delivery date.

### 44. Confidential budget controls
**Reason:** Protects internal estimates from bidders and unnecessary internal exposure, reducing price anchoring and information leakage.

### 45. Budget version history
**Reason:** Prevents budgets from being silently altered after a procurement begins and preserves the original approved amount and reasons for changes.

### 46. Procurement Method selection
**Reason:** Ensures the correct process—RFI, RFQ, RFP, Tender, Framework, Sole Source or Emergency—is chosen deliberately and recorded.

### 47. Anti-contract-splitting detection
**Reason:** Flags repeated smaller procurements that could be structured to avoid approval or competition thresholds.

### 48. Scope/specification approval
**Reason:** Requires the BOQ, specification, criteria and mandatory requirements to be settled before suppliers compete, reducing post-publication manipulation.

### 49. Available-contract dashboard
**Reason:** Gives eligible suppliers a clear view of current opportunities relevant to their approved categories.

### 50. Opportunity details
**Reason:** Standardises the information bidders receive about scope, site, dates, briefings, requirements and supporting documents.

## Community-first sourcing

### 51. Community-first sourcing engine
**Reason:** Gives practical effect to Citra's objective of first considering capable and compliant Blue Downs suppliers.

### 52. Community-search evidence record
**Reason:** Records which local suppliers were identified, invited and assessed so any decision to move outward is evidence-based.

### 53. Sourcing-area expansion decision
**Reason:** Requires a formal reason and approval before Citra moves beyond the community pool where local capacity cannot meet the requirement.

### 54. Procurement-document repository link
**Reason:** Connects the workflow to a structured document repository so records are stored consistently instead of being scattered across personal folders and email.

### 55. Briefing/site-inspection functionality represented
**Reason:** Records mandatory or optional briefings and site visits, including attendance where it affects eligibility.

### 56. Bidder questions and clarifications represented
**Reason:** Gives bidders a controlled channel for questions and helps ensure material clarifications are handled consistently.

### 57. Tender addenda
**Reason:** Provides an auditable method of changing or clarifying tender information after issue.

### 58. Addendum acknowledgement
**Reason:** Confirms that bidders received and acknowledged material changes before submitting their bids.

## Bid submission and tender integrity

### 59. Secure submission workflow
**Reason:** Protects bid confidentiality, timing and integrity and ensures submissions are associated with the correct tender and supplier.

### 60. Authorised signatory declaration model
**Reason:** Confirms that the person submitting the bid is authorised to act for the supplier and accepts responsibility for the submission.

### 61. Submission receipt
**Reason:** Gives both Citra and the bidder objective proof of what was submitted and when.

### 62. Tender closing control
**Reason:** Prevents normal bid changes after the closing deadline and protects equal treatment among bidders.

### 63. Bid withdrawal model
**Reason:** Allows controlled withdrawal while preserving evidence of who withdrew the bid and when.

### 64. Portal-outage contingency
**Reason:** Provides a fair, documented response if a genuine system outage affects bidder access near closing time.

### 65. File-security validation architecture
**Reason:** Reduces the risk of malicious, corrupt or unreadable files entering Citra's environment.

## Evaluation controls

### 66. Technical evaluation stage
**Reason:** Assesses capability and compliance against pre-approved technical criteria before inappropriate commercial influence occurs.

### 67. Commercial evaluation stage
**Reason:** Separates pricing and commercial assessment from technical assessment and restricts sensitive price information to authorised users.

### 68. VAT/commercial normalisation
**Reason:** Ensures bids are compared on a consistent basis when suppliers present VAT, exclusions, provisional sums or alternatives differently.

### 69. Financial-capacity checks
**Reason:** Helps determine whether a supplier can financially sustain higher-risk or higher-value work without unnecessarily burdening small low-risk contractors.

### 70. Reference verification
**Reason:** Distinguishes verified prior performance from unconfirmed claims and records who checked each reference.

### 71. Subcontractor/JV disclosure
**Reason:** Gives Citra visibility over the actual parties that will perform work rather than assessing only the main bidder.

### 72. Regulated-subcontractor verification
**Reason:** Prevents contractors from bypassing specialist legal or professional requirements by subcontracting regulated work to unverified parties.

### 73. Conflict-of-interest declarations
**Reason:** Requires bidders and Citra participants to disclose relationships or interests that could affect impartial decision-making.

### 74. Recusal workflow
**Reason:** Removes conflicted personnel from the affected decision while preserving a formal record of the recusal and replacement.

### 75. Gifts/hospitality declaration
**Reason:** Increases transparency around benefits that could create or appear to create procurement influence.

### 76. Related-supplier detection
**Reason:** Flags suppliers with shared ownership, directors, banking or other links for review without automatically assuming misconduct.

### 77. Collusion/fraud indicators
**Reason:** Surfaces unusual bidding patterns or relationships for investigation while leaving the final determination to authorised reviewers.

## Major decisions and approvals

### 78. Major-decision object
**Reason:** Creates a structured record for every material procurement decision, including its reason, evidence, originator, status and required approvals.

### 79. Mandatory major-decision comments
**Reason:** Prevents unexplained material decisions and requires decision-makers to state the basis for their actions.

### 80. Approval workflow
**Reason:** Routes major decisions through the defined management hierarchy rather than allowing informal or undocumented approvals.

### 81. Approve / Reject / Return actions
**Reason:** Gives approvers clear controlled outcomes and requires explanatory comments for each decision.

### 82. Decision version history
**Reason:** Prevents historical reasons and decisions from being silently rewritten after the fact.

### 83. Policy-exception workflow
**Reason:** Allows legitimate deviations such as emergency procurement or sole source while ensuring the exception is explicitly motivated and approved.

### 84. Silent governance-alert engine
**Reason:** Notifies designated oversight personnel when the system detects possible workflow bypassing without prematurely accusing the user involved.

### 85. Alert triggers
**Reason:** Defines measurable risk events such as repeated overrides, unusual access, late-bid exceptions, contract splitting or major variations.

### 86. Governance-alert investigation
**Reason:** Provides a structured way to review, clear, correct or escalate alerts and record the final outcome.

### 87. Confidential ethics/reporting channel represented
**Reason:** Gives employees or authorised users a protected route to report suspected corruption, collusion, falsification or other serious concerns.

## Award and contractor outcome

### 88. Award recommendation model
**Reason:** Records the evaluation conclusion, recommended supplier, value and supporting reasoning before approval.

### 89. Unsuccessful-supplier classifications
**Reason:** Separates registration failure, category failure, tender-specific failure and competitive loss so outcomes are accurate and understandable.

### 90. Contractor-facing outcome reason
**Reason:** Gives suppliers useful feedback while protecting competitor pricing, confidential deliberations and sensitive internal information.

### 91. Appeal/reconsideration request
**Reason:** Provides a controlled mechanism for reviewing material rejection, suspension or disqualification decisions.

### 92. Award approval
**Reason:** Prevents a recommendation from becoming an award until the prescribed approval authority has completed the decision.

## Contract management

### 93. Contract-preparation stage
**Reason:** Separates tender award from the later point at which a legally and operationally complete contract is ready to commence.

### 94. Contract record
**Reason:** Creates one authoritative record of scope, supplier, value, dates, responsible manager and contractual obligations.

### 95. Contract financial controls
**Reason:** Tracks advances, retention, guarantees, milestones, payment terms and final account obligations throughout delivery.

### 96. Contract variation workflow
**Reason:** Ensures changes to price, scope or time are motivated, approved and version-controlled instead of being informally agreed.

### 97. Major-variation governance alerts
**Reason:** Flags large or repeated post-award changes that could materially alter the original competitive procurement outcome.

### 98. Invoice/payment workflow
**Reason:** Links certified work, invoice evidence, approval and payment status to reduce duplicate, unsupported or premature payments.

### 99. Contractor live tracker
**Reason:** Shows suppliers where their registration, tender, contract or required action currently sits and reduces unnecessary follow-up enquiries.

### 100. Internal SLA tracking
**Reason:** Shows where Citra actions are delayed and which team is responsible, improving accountability and turnaround times.

## Performance and rating

### 101. Contractor performance events
**Reason:** Records serious defects, NCRs, safety incidents, regulatory breaches and similar events separately from a simple percentage score.

### 102. 8-department rating framework
**Reason:** Gives all eight Citra departments an equal maximum contribution of 12.5%, producing a balanced overall contractor score out of 100%.

### 103. Independent departmental assessments
**Reason:** Departments submit their scores independently so one department's opinion does not influence another before submission.

### 104. Department-specific criteria architecture
**Reason:** Each department should assess the aspects it actually observes rather than providing an unsupported general score.

### 105. Quality core measurement
**Reason:** Ensures workmanship and service quality remain central to contractor assessment and cannot be hidden by strong administration alone.

### 106. Quality Index
**Reason:** Provides management with a separate cross-department view of quality performance even where the overall contractor score is high.

### 107. Compulsory rating comments rule
**Reason:** Requires evidence and explanation for materially low, exceptionally high or serious ratings, reducing arbitrary scoring.

### 108. Performance evidence links model
**Reason:** Links ratings to NCRs, photographs, inspections, meeting records, defects, invoices and other evidence.

### 109. Consolidated contractor score calculator
**Reason:** Automatically converts eight departmental assessments into the final contractor score using the approved weighting model.

### 110. Contractor rating history model
**Reason:** Shows performance across multiple contracts rather than relying only on the most recent experience.

### 111. Contractor rating review
**Reason:** Allows suppliers to acknowledge or challenge a final assessment without deleting or overwriting the original rating.

## Supplier development and close-out

### 112. Supplier-development workflow
**Reason:** Helps Citra distinguish between fatal compliance gaps and developmental gaps that local suppliers can realistically improve through support.

### 113. Community-development reporting
**Reason:** Measures community participation, spend, supplier development and progression instead of treating local sourcing as an unmeasured intention.

### 114. Contract close-out
**Reason:** Confirms final inspection, defects, warranties, manuals, as-built information, final account and other completion obligations before closure.

### 115. Final performance assessment
**Reason:** Ensures the required departments complete contractor ratings while the project evidence and experience are still current.

### 116. Supplier history
**Reason:** Preserves a long-term view of opportunities, contracts, ratings, variations, incidents, corrective actions and development interventions.

## Dashboards, audit and security

### 117. Management dashboard
**Reason:** Gives management a consolidated view of procurement activity, compliance risks, contract status and supplier performance.

### 118. Procurement/HOD dashboard
**Reason:** Gives Procurement leadership access to the commercial, sourcing, exception and approval information needed to manage the function.

### 119. CEO governance dashboard
**Reason:** Gives executive oversight of major approvals, community procurement outcomes, exceptions and significant governance alerts.

### 120. Contractor dashboard
**Reason:** Gives suppliers one place to view registration, categories, opportunities, tenders, contracts, required actions and performance results.

### 121. Audit log
**Reason:** Records who performed material actions, when they occurred and what changed so transactions can be reconstructed later.

### 122. Administrator-action log
**Reason:** Ensures privileged system administrators are also accountable and cannot make sensitive changes without a trace.

### 123. Privacy/access controls
**Reason:** Protects banking information, IDs and other sensitive records from users who do not require access to perform their roles.

### 124. Data-retention rules
**Reason:** Allows records to be retained according to legal, contractual and business requirements rather than deleted arbitrarily.

### 125. Backup/disaster-recovery representation
**Reason:** Recognises that procurement and contract records are business-critical and must be recoverable after technical failure or data loss.

### 126. Employee/supplier offboarding
**Reason:** Removes access when people leave or change roles while preserving historical attribution of their previous actions.

### 127. Procurement-policy versioning
**Reason:** Ensures historical tenders remain linked to the rules, thresholds and approval matrix that applied when they were conducted.

### 128. Regulatory-source register
**Reason:** Records the source and review date of compliance requirements so Citra can validate and update them responsibly.

## Demonstration, assurance and deployment

### 129. Demo scenarios
**Reason:** Allows management to see realistic end-to-end examples rather than reviewing an empty interface.

### 130. Governance bypass demo
**Reason:** Demonstrates how the system detects and silently escalates an attempted deviation from the normal process.

### 131. Contractor-error demo
**Reason:** Shows how an ordinary supplier mistake is identified, corrected and re-verified without unnecessary disqualification.

### 132. OTP-change demo
**Reason:** Demonstrates the security process for changing sensitive supplier contact information.

### 133. Rating demo
**Reason:** Shows how eight departments independently contribute to the final score and how the Quality Index is derived.

### 134. Responsive UI quality pass
**Reason:** Ensures the prototype remains usable and presentable on desktop, laptop, tablet and mobile screen sizes.

### 135. Legal/compliance wording pass
**Reason:** Prevents the prototype from incorrectly presenting Citra policy as legislation or overstating statutory requirements.

### 136. Security boundary pass
**Reason:** Confirms that no genuine credentials, confidential procurement information or sensitive personal data are embedded in the public prototype.

### 137. User-experience pass
**Reason:** Ensures the system is understandable to contractors, including smaller community suppliers that may have limited tender-administration resources.

### 138. Management usability pass
**Reason:** Ensures strong governance does not make routine work unnecessarily bureaucratic or force executives to approve minor administrative actions.

### 139. Final prototype functional pass
**Reason:** Confirms that navigation, simulations, calculations, workflow demonstrations and major controls operate as intended before presentation.

### 140. GitHub Pages deployment path prepared
**Reason:** Provides a stable professional web address that can be demonstrated without requiring local software installation.

### 141. Demo walkthrough embedded in navigation/workflow
**Reason:** Allows management to understand the proposed operating model by following the system from supplier onboarding to contract history.

### 142. Phase 1 scope frozen in README
**Reason:** Establishes a clear baseline so new ideas do not continually expand the first prototype and can instead be controlled as later enhancements.

### 143. Phase 2 backlog boundary established
**Reason:** Separates what can safely be demonstrated now from production capabilities that require secure infrastructure, integrations and formal implementation decisions.

---

# Overall Design Intent

The 143 controls work together as one governance model rather than 143 unrelated features. The intended operating sequence is:

**Supplier identity → verification → category approval → community-first sourcing → opportunity → secure bid → evaluation → governed decision → award → contract → payment/variation control → departmental performance rating → close-out → permanent supplier history.**

The design is intended to achieve five objectives simultaneously:

1. **Improve contractor access and usability**, particularly for local and developing suppliers.
2. **Protect Citra's procurement integrity** through evidence, approvals, auditability and segregation of duties.
3. **Support Blue Downs/community economic participation** without compromising statutory compliance, safety, capability or quality.
4. **Create management visibility** across supplier performance, procurement activity, risk and community outcomes.
5. **Build a scalable foundation** that can later connect to Citra's Mission Control environment, document repositories and secure production services.

## Phase 2 production boundary
Phase 2 should replace the browser-only simulations with secure production services, including real authentication and MFA/OTP, approved integrations, encrypted storage, server-side permissions, database persistence, real document controls, notification services, production audit logging, backup/recovery and Mission Control integration.

This README explains the design rationale. `ACCEPTANCE.md` remains the concise technical acceptance register for confirming that all 143 Phase 1 requirements are represented in the prototype.
