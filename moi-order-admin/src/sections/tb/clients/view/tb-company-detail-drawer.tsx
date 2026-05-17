import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import {
  STATUS_BG,
  STATUS_TEXT,
  STATUS_COLORS,
  STATUS_LABELS,
  DOCUMENT_CATEGORY_LABELS,
} from '../../shared/tb-mock-store';

import type { TBClient, StatusLevel } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

function StatusChip({ label, level }: { label: string; level: StatusLevel }) {
  return (
    <Chip
      size="small"
      label={`${label}: ${STATUS_LABELS[level]}`}
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 600,
        bgcolor: STATUS_BG[level],
        color: STATUS_TEXT[level],
        border: `1px solid ${STATUS_COLORS[level]}30`,
      }}
    />
  );
}

// ----------------------------------------------------------------------

function SectionHeading({ title }: { title: string }) {
  return (
    <Typography
      variant="overline"
      color="text.disabled"
      sx={{ display: 'block', mb: 1.5, letterSpacing: 1 }}
    >
      {title}
    </Typography>
  );
}

// ----------------------------------------------------------------------

function DirectorCard({ director }: { director: TBClient['directors'][number] }) {
  const hasVisa = !!(director.visaType || director.visaExpiry);

  const getVisaStatus = (): StatusLevel | null => {
    if (!director.visaExpiry) return null;
    const daysLeft = Math.ceil(
      (new Date(director.visaExpiry).getTime() - Date.now()) / 86_400_000
    );
    if (daysLeft < 0) return 'critical';
    if (daysLeft <= 60) return 'warning';
    return 'good';
  };

  const visaStatus = getVisaStatus();

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight="fontWeightSemiBold">
            {director.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {[director.position, director.nationality].filter(Boolean).join(' · ')}
          </Typography>
        </Box>

        {visaStatus && (
          <Chip
            size="small"
            label={STATUS_LABELS[visaStatus]}
            sx={{
              height: 20,
              fontSize: 10,
              flexShrink: 0,
              bgcolor: STATUS_BG[visaStatus],
              color: STATUS_TEXT[visaStatus],
            }}
          />
        )}
      </Stack>

      {hasVisa && (
        <Stack direction="row" spacing={2} sx={{ mt: 1.5 }} flexWrap="wrap">
          {director.visaType && (
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Visa Type</Typography>
              <Typography variant="caption" fontWeight="fontWeightMedium">{director.visaType}</Typography>
            </Box>
          )}
          {director.visaExpiry && (
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Expiry</Typography>
              <Typography variant="caption" fontWeight="fontWeightMedium" sx={{ color: visaStatus ? STATUS_COLORS[visaStatus] : 'text.primary' }}>
                {fDate(director.visaExpiry)}
              </Typography>
            </Box>
          )}
          {director.workPermit !== undefined && (
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Work Permit</Typography>
              <Typography variant="caption" fontWeight="fontWeightMedium" sx={{ color: director.workPermit ? '#10B981' : '#EF4444' }}>
                {director.workPermit ? 'Yes' : 'No'}
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </Paper>
  );
}

// ----------------------------------------------------------------------

export type TBCompanyDetailDrawerProps = {
  company: TBClient | null;
  onClose: () => void;
};

export function TBCompanyDetailDrawer({ company, onClose }: TBCompanyDetailDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={!!company}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 560 } } }}
    >
      {company && (
        <>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Box sx={{ minWidth: 0, pr: 1 }}>
              <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                {company.companyName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {company.thaiRegNumber}
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
                <StatusChip label="Tax" level={company.taxStatus} />
                <StatusChip label="Company" level={company.companyStatus} />
                <StatusChip label="Visa" level={company.directorVisaStatus} />
              </Stack>
            </Box>
            <IconButton onClick={onClose} sx={{ flexShrink: 0, mt: -0.5 }}>
              <Iconify icon="mingcute:close-line" width={20} />
            </IconButton>
          </Stack>

          <Scrollbar sx={{ flex: 1 }}>
            <Stack spacing={3} sx={{ p: 3 }}>

              {/* Company Info */}
              <Box>
                <SectionHeading title="Company Information" />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Registration Date</Typography>
                    <Typography variant="body2">{fDate(company.registrationDate)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">VAT Registered</Typography>
                    <Typography variant="body2" sx={{ color: company.vatRegistered ? '#10B981' : 'text.disabled' }}>
                      {company.vatRegistered ? 'Yes' : 'No'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Monthly Accounting</Typography>
                    <Typography variant="body2" sx={{ color: company.monthlyAccounting ? '#10B981' : 'text.disabled' }}>
                      {company.monthlyAccounting ? 'Active' : 'Inactive'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">DBD Portal</Typography>
                    <Link href={company.dbdUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                      Open DBD ↗
                    </Link>
                  </Stack>
                  {company.notes && (
                    <Box sx={{ mt: 1, p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {company.notes}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Divider />

              {/* Client Info */}
              <Box>
                <SectionHeading title="Client Details" />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Client Name</Typography>
                    <Typography variant="body2">{company.clientName}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body2">{company.clientPhone}</Typography>
                  </Stack>
                </Stack>
              </Box>

              <Divider />

              {/* Directors */}
              <Box>
                <SectionHeading title={`Directors (${company.directors.length})`} />
                {company.directors.length === 0 && (
                  <Typography variant="body2" color="text.disabled">No directors on record.</Typography>
                )}
                <Stack spacing={1.5}>
                  {company.directors.map((d) => (
                    <DirectorCard key={d.id} director={d} />
                  ))}
                </Stack>
              </Box>

              <Divider />

              {/* Documents */}
              <Box>
                <SectionHeading title="Documents" />
                {company.documents.length === 0 && (
                  <Typography variant="body2" color="text.disabled">No documents uploaded.</Typography>
                )}
                <Stack spacing={1}>
                  {company.documents.map((doc) => (
                    <Stack key={doc.id} direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        <Iconify icon="solar:check-circle-bold" width={16} sx={{ color: '#10B981', flexShrink: 0 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {DOCUMENT_CATEGORY_LABELS[doc.category]}
                          </Typography>
                          <Typography variant="body2" noWrap>{doc.fileName}</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, ml: 2 }}>
                        {fDate(doc.uploadedAt)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Divider />

              {/* History */}
              <Box>
                <SectionHeading title="History" />
                <Stack spacing={0}>
                  {company.history.map((entry, idx) => (
                    <Stack key={entry.id} direction="row" spacing={2} alignItems="flex-start">
                      <Stack alignItems="center" sx={{ flexShrink: 0, width: 16 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981', mt: 0.5 }} />
                        {idx < company.history.length - 1 && (
                          <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', minHeight: 28 }} />
                        )}
                      </Stack>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="body2">{entry.action}</Typography>
                        <Typography variant="caption" color="text.disabled">
                          {fDate(entry.date)} · {entry.by}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>

            </Stack>
          </Scrollbar>
        </>
      )}
    </Drawer>
  );
}
