# Casey's Memory — Domain Expert

## Product Context
- Campaign types in use: Trunk Show, End of Year Benefits, Mid Year Benefits, Custom
- AI suggestions should surface patients with unused/expiring benefits

## Integration Decisions
- **Clearinghouse: Stedi** — chosen for both eligibility (270/271) and claims (837P + 835 remittance)
  - Modern REST API, HIPAA compliant, one vendor for eligibility + claims
  - Avoids legacy EDI complexity of Change Healthcare / Availity
