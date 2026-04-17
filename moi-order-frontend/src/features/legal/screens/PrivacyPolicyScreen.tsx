import React from 'react';

import { LegalDocumentLayout } from '@/features/legal/components/LegalDocumentLayout';
import { PRIVACY_POLICY_EFFECTIVE_DATE, PRIVACY_POLICY_SECTIONS } from '@/features/legal/content/privacyPolicy';
import { usePrivacyPolicyScreen } from '@/features/legal/hooks/usePrivacyPolicyScreen';
import { editorialPalette } from '@/shared/theme/editorialPalette';

export function PrivacyPolicyScreen(): React.JSX.Element {
  const { handleBack } = usePrivacyPolicyScreen();

  return (
    <LegalDocumentLayout
      accentColor={editorialPalette.sage}
      emoji="🔏"
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate={PRIVACY_POLICY_EFFECTIVE_DATE}
      sections={PRIVACY_POLICY_SECTIONS}
      onBack={handleBack}
    />
  );
}
