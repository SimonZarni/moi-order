import React from 'react';

import { LegalDocumentLayout } from '@/features/legal/components/LegalDocumentLayout';
import { PDPA_EFFECTIVE_DATE, PDPA_SECTIONS } from '@/features/legal/content/pdpaNotice';
import { usePdpaNoticeScreen } from '@/features/legal/hooks/usePdpaNoticeScreen';
import { editorialPalette } from '@/shared/theme/editorialPalette';

export function PdpaNoticeScreen(): React.JSX.Element {
  const { handleBack } = usePdpaNoticeScreen();

  return (
    <LegalDocumentLayout
      accentColor={editorialPalette.teal}
      emoji="🛡️"
      eyebrow="Legal"
      title="Personal Data Protection"
      effectiveDate={PDPA_EFFECTIVE_DATE}
      sections={PDPA_SECTIONS}
      onBack={handleBack}
    />
  );
}
