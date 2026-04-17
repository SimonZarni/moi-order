import type { LegalSection } from '@/features/legal/types';

export const PRIVACY_POLICY_EFFECTIVE_DATE = '17 April 2026';

export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    heading: '1. Who We Are',
    body: 'Moi Order is operated by Trusted Brothers Company Limited ("Company", "we", "us", "our"), a company registered in the Kingdom of Thailand. We provide a mobile platform that helps Myanmar nationals residing in Thailand manage and submit government and administrative service applications.\n\nData Controller: Trusted Brothers Company Limited\nContact: hello@moiorder.com',
  },
  {
    heading: '2. Data We Collect',
    body: 'We collect the following categories of personal data when you use Moi Order:\n\n• Account Data — your full name, email address, date of birth, and encrypted password.\n\n• Profile & Service Data — your residential address, nationality, and other details required for your service applications.\n\n• Identity Documents — passport copies, visa pages, national or identity card copies, TM30 (foreigner house registration), and passport-size photographs.\n\n• Payment Data — payment details processed exclusively by Stripe, Inc. We do not store full card numbers on our servers.\n\n• Usage Data — app interaction logs, device identifiers, IP address, and crash reports used solely to improve the app.',
  },
  {
    heading: '3. How We Use Your Data',
    body: 'We use your personal data for the following purposes:\n\n• Service Delivery — to process your applications for embassy services, company registration, 90-day reports, airport fast track, visa recommendations, and other administrative services.\n\n• Account Management — to create and maintain your account, authenticate your identity, and send service status updates.\n\n• Payment Processing — to charge and confirm payments via Stripe.\n\n• Legal Compliance — to meet obligations under applicable Thai laws, including record-keeping requirements under the Thai Revenue Code.\n\n• Service Improvement — to analyse usage patterns and improve app features and reliability.',
  },
  {
    heading: '4. Sensitive Personal Data',
    body: 'Moi Order processes sensitive personal data as defined under the Personal Data Protection Act B.E. 2562 (PDPA) Section 26, including passport photographs (which may qualify as biometric data) and national identity information.\n\nWe process such data only with your explicit consent, given at the time of each service submission. You may withdraw consent at any time by contacting hello@moiorder.com. Withdrawal does not affect the lawfulness of prior processing, but may prevent us from completing your requested service.',
  },
  {
    heading: '5. Sharing Your Data',
    body: 'We share your personal data only where strictly necessary:\n\n• Internal Administration — authorised Moi Order staff who process and manage your service applications.\n\n• Stripe, Inc. — for secure payment processing. Stripe operates under its own Privacy Policy and is PCI DSS compliant. Stripe may process payment data in the United States.\n\n• Thai Government Authorities — where required to fulfil the specific service you have requested (e.g. immigration offices, embassies, Department of Business Development).\n\n• Legal Requirements — where required by a valid Thai court order or lawful request from Thai law enforcement.\n\nWe do not sell, rent, or trade your personal data to any third party.',
  },
  {
    heading: '6. International Transfers',
    body: 'Your payment data is processed by Stripe, Inc., headquartered in the United States. We ensure appropriate safeguards are in place for this transfer in accordance with PDPA requirements for cross-border data transfers, including ensuring the recipient maintains adequate data protection standards equivalent to those required under Thai law.\n\nNo other personal data — including your identity documents — is transferred outside the Kingdom of Thailand.',
  },
  {
    heading: '7. How Long We Keep Your Data',
    body: 'We retain your personal data only as long as necessary:\n\n• Account & Identity Data — for the duration of your active account, plus 5 years after closure, as required by Thai accounting regulations.\n\n• Identity Documents & Submission Data — for 2 years after your service application is completed or closed.\n\n• Payment Records — for 7 years in accordance with the Thai Revenue Code.\n\n• Usage Logs — for 1 year.\n\nAfter the applicable retention period, your data is securely deleted or irreversibly anonymised.',
  },
  {
    heading: '8. Your Rights Under PDPA',
    body: 'Under the Personal Data Protection Act B.E. 2562, you have the following rights:\n\n• Right of Access — to request a copy of the personal data we hold about you.\n\n• Right to Rectification — to request correction of inaccurate or incomplete data.\n\n• Right to Erasure — to request deletion of your data (subject to legal retention obligations).\n\n• Right to Restriction — to request that we limit processing of your data.\n\n• Right to Data Portability — to receive your data in a structured, machine-readable format.\n\n• Right to Object — to object to processing based on our legitimate interests.\n\n• Right to Withdraw Consent — to withdraw consent for sensitive data processing at any time.\n\nTo exercise any right, email us at hello@moiorder.com. We will respond within 30 days.',
  },
  {
    heading: '9. Data Security',
    body: 'We implement technical and organisational security measures including encrypted data storage, strict access controls, and secure HTTPS connections for all data in transit. Sensitive documents are stored outside public directories and accessible only via time-limited signed URLs.\n\nNo method of electronic storage or transmission is completely secure. While we take all reasonable steps to protect your data, we cannot guarantee absolute security.',
  },
  {
    heading: '10. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of material changes via in-app notification or email to your registered address. The effective date at the top of this document indicates when it was last revised.\n\nYour continued use of Moi Order after notification of changes constitutes your acceptance of the updated policy.',
  },
  {
    heading: '11. Contact Us',
    body: 'For any questions, concerns, or to exercise your data rights under PDPA, please contact us:\n\nTrusted Brothers Company Limited\nEmail: hello@moiorder.com\n\nWe aim to respond to all privacy-related enquiries within 30 days of receipt.',
  },
];
