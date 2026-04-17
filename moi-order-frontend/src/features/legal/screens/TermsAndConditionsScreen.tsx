import React from 'react';

import { LegalDocumentLayout } from '@/features/legal/components/LegalDocumentLayout';
import { TERMS_EFFECTIVE_DATE, TERMS_SECTIONS } from '@/features/legal/content/termsAndConditions';
import { useTermsScreen } from '@/features/legal/hooks/useTermsScreen';
import { editorialPalette } from '@/shared/theme/editorialPalette';

export function TermsAndConditionsScreen(): React.JSX.Element {
  const { handleBack } = useTermsScreen();

  return (
    <LegalDocumentLayout
      accentColor={editorialPalette.gold}
      emoji="📜"
      eyebrow="Legal"
      title="Terms & Conditions"
      effectiveDate={TERMS_EFFECTIVE_DATE}
      sections={TERMS_SECTIONS}
      onBack={handleBack}
    />
  );
}
