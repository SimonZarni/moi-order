import type { LegalSection } from '@/features/legal/types';

export const PDPA_EFFECTIVE_DATE = '17 April 2026';

export const PDPA_SECTIONS: LegalSection[] = [
  {
    heading: '1. Data Controller',
    body: 'Trusted Brothers Company Limited ("Company") is the Data Controller under the Personal Data Protection Act B.E. 2562 (PDPA). We are responsible for determining the purposes and means of processing your personal data collected through the Moi Order application.\n\nContact: hello@moiorder.com\n\nNote: As Moi Order primarily serves Myanmar nationals, we provide key consent communications in both English and Burmese. If you did not fully understand any consent you provided, please contact us immediately.',
  },
  {
    heading: '2. Legal Basis for Processing',
    body: 'We process your personal data under the following legal bases as prescribed by PDPA:\n\n• Contractual Necessity (Section 24(3)) — processing required to deliver the services you have requested and to fulfil our obligations to you under our service agreement.\n\n• Legal Obligation (Section 24(6)) — processing required to comply with applicable Thai law, including tax, accounting, and immigration record-keeping obligations.\n\n• Legitimate Interests (Section 24(5)) — processing for fraud prevention, system security, and service improvement, where these interests are not overridden by your rights.\n\n• Explicit Consent (Section 26) — processing of sensitive personal data, including passport photographs and biometric-adjacent documents, undertaken only with your freely given, specific, informed, and unambiguous consent.',
  },
  {
    heading: '3. Sensitive Personal Data (Section 26)',
    body: 'The following data we collect may be classified as sensitive personal data under PDPA Section 26:\n\n• Passport photographs — may qualify as biometric data when used for identity verification purposes.\n• National identity card numbers and information.\n• Immigration status, visa category, and residency information.\n\nWe collect and process this data only with your explicit consent, provided at the time of each service submission.\n\n⚠ Right to Withdraw: You may withdraw this consent at any time by contacting hello@moiorder.com. Withdrawal does not affect the lawfulness of processing based on consent before its withdrawal. However, withdrawal may mean we are unable to continue processing your service application.',
  },
  {
    heading: '4. What We Collect & Why',
    body: 'Identity Data (name, date of birth, nationality)\nPurpose: Identity verification and preparation of accurate government applications.\nLegal basis: Contractual necessity.\n\nContact Data (email address)\nPurpose: Account management and service status communications.\nLegal basis: Contractual necessity.\n\nResidential Data (address, TM30 document)\nPurpose: Services requiring address verification (e.g. residential embassy letters).\nLegal basis: Contractual necessity / Legal obligation.\n\nDocument Copies (passport, visa, ID card, TM30, photograph)\nPurpose: Required by relevant Thai government authorities and embassies to process your applications.\nLegal basis: Contractual necessity + Explicit consent.\n\nPayment Data\nPurpose: To charge and confirm payment for services via Stripe.\nLegal basis: Contractual necessity.\n\nUsage & Technical Data\nPurpose: App security, crash diagnosis, and service improvement.\nLegal basis: Legitimate interests.',
  },
  {
    heading: '5. International Data Transfers',
    body: 'Your payment data is transferred to Stripe, Inc., headquartered in the United States. The United States has not been designated by Thailand\'s Personal Data Protection Committee (PDPC) as a country with an equivalent level of personal data protection.\n\nWe mitigate this risk by:\n\n• Relying on Stripe\'s compliance with international data protection standards, including PCI DSS certification.\n• Ensuring that Stripe is contractually bound to protect your payment data.\n• Limiting the data transferred to only what is necessary for payment processing.\n\nNo other personal data — including your identity documents, photographs, or application data — is transferred outside the Kingdom of Thailand.',
  },
  {
    heading: '6. Data Retention Schedule',
    body: 'We retain personal data only for as long as necessary for the stated purpose or as required by law:\n\n• Account & Identity Data — retained for the duration of your account plus 5 years after account closure (Thai accounting regulations).\n\n• Identity Documents & Service Submissions — retained for 2 years after service completion or application closure.\n\n• Payment Transaction Records — retained for 7 years (Thai Revenue Code B.E. 2481, as amended).\n\n• Application Usage Logs — retained for 1 year.\n\nUpon expiry of the applicable retention period, data is securely and permanently deleted or rendered irreversibly anonymous. You may request early deletion subject to our legal retention obligations.',
  },
  {
    heading: '7. Your Rights as a Data Subject',
    body: 'Under the Personal Data Protection Act B.E. 2562, you have the following rights:\n\n• Right to Be Informed (Section 23) — to know how your personal data is collected and used. Satisfied by this notice.\n\n• Right of Access (Section 30) — to request confirmation that we hold your data and to receive a copy.\n\n• Right to Data Portability (Section 31) — to receive your data in a structured, commonly used, machine-readable electronic format.\n\n• Right to Object (Section 32) — to object to processing based on our legitimate interests.\n\n• Right to Erasure (Section 33) — to request deletion of your data when it is no longer necessary, subject to legal retention obligations.\n\n• Right to Restriction of Processing (Section 34) — to request that we temporarily suspend processing of your data.\n\n• Right to Rectification (Section 35) — to have inaccurate or incomplete data corrected without undue delay.\n\n• Right to Withdraw Consent (Section 19(3)) — to withdraw consent for sensitive data processing at any time without penalty.',
  },
  {
    heading: '8. How to Exercise Your Rights',
    body: 'To exercise any of your rights under PDPA, submit a written request to:\n\nEmail: hello@moiorder.com\n\nYour request must include:\n• Your full name and registered email address.\n• The specific right you wish to exercise.\n• A copy of a valid identity document (for verification purposes).\n\nWe will acknowledge your request within 7 days and respond in full within 30 days. In complex cases, we may extend this period by a further 30 days with notification.\n\nThere is no charge for exercising your rights. However, where requests are manifestly unfounded or excessive, we reserve the right to charge a reasonable administrative fee or decline the request, with written explanation.',
  },
  {
    heading: '9. Lodging a Complaint',
    body: 'If you believe we have processed your personal data in a manner that violates the PDPA, you have the right to lodge a formal complaint with the supervisory authority:\n\nOffice of the Personal Data Protection Committee (PDPC)\n120 Moo 3, The Government Complex\nChaengwattana Road, Lak Si\nBangkok 10210, Thailand\nWebsite: pdpc.or.th\n\nWe respectfully ask that you contact us first at hello@moiorder.com so that we have the opportunity to address your concern directly and promptly before a formal complaint is filed.',
  },
  {
    heading: '10. Updates to This Notice',
    body: 'We review and update this PDPA Data Privacy Notice periodically to reflect changes in our practices or in applicable law. Material changes will be communicated via in-app notification with reasonable advance notice.\n\nWhere a change requires a new consent (e.g. a new category of sensitive data), we will seek your explicit consent before processing under the revised terms.\n\nContinued use of Moi Order following notification of any update constitutes acknowledgement that you have reviewed the revised notice.',
  },
];
