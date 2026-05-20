import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import {
  tbStore,
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
        height: 24,
        fontSize: 12,
        fontWeight: 600,
        bgcolor: STATUS_BG[level],
        color: STATUS_TEXT[level],
        border: `1px solid ${STATUS_COLORS[level]}40`,
      }}
    />
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography
        variant="overline"
        color="text.disabled"
        sx={{ display: 'block', mb: 2, letterSpacing: 1 }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ color: valueColor }}>{value}</Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function DirectorVisaStatus(director: TBClient['directors'][number]): StatusLevel | null {
  if (!director.visaExpiry) return null;
  const daysLeft = Math.ceil((new Date(director.visaExpiry).getTime() - Date.now()) / 86_400_000);
  if (daysLeft < 0) return 'critical';
  if (daysLeft <= 60) return 'warning';
  return 'good';
}

// ----------------------------------------------------------------------

export function TBClientDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const company = tbStore.clients.find((c) => c.id === id);

  if (!company) {
    return (
      <DashboardContent maxWidth="xl">
        <Stack alignItems="center" justifyContent="center" sx={{ py: 12 }}>
          <Typography variant="h5" color="text.secondary">Company not found.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => router.push('/tb/clients')}>
            Back to Companies
          </Button>
        </Stack>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      {/* Back nav */}
      <Button
        color="inherit"
        onClick={() => router.push('/tb/clients')}
        startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ transform: 'rotate(180deg)' }} />}
        sx={{ mb: 2, ml: -1, alignSelf: 'flex-start' }}
      >
        Companies Overview
      </Button>

      {/* Page header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>{company.companyName}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 1.5 }}>
            {company.thaiRegNumber}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <StatusChip label="Tax" level={company.taxStatus} />
            <StatusChip label="Company" level={company.companyStatus} />
            <StatusChip label="Director Visa" level={company.directorVisaStatus} />
          </Stack>
        </Box>

        <Link href={company.dbdUrl} target="_blank" rel="noopener noreferrer" underline="none">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="solar:share-bold" width={16} />}
          >
            DBD Portal
          </Button>
        </Link>
      </Stack>

      <Grid container spacing={3}>

        {/* ── Left column ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>

            {/* Company info */}
            <SectionCard title="Company Information">
              <Stack divider={<Divider />}>
                <InfoRow label="Registration Date" value={fDate(company.registrationDate)} />
                <InfoRow
                  label="VAT Registered"
                  value={company.vatRegistered ? 'Yes' : 'No'}
                  valueColor={company.vatRegistered ? '#10B981' : undefined}
                />
                <InfoRow
                  label="Monthly Accounting"
                  value={company.monthlyAccounting ? 'Active' : 'Inactive'}
                  valueColor={company.monthlyAccounting ? '#10B981' : undefined}
                />
              </Stack>
              {company.notes && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">{company.notes}</Typography>
                </Box>
              )}
            </SectionCard>

            {/* Client info */}
            <SectionCard title="Client Details">
              <Stack divider={<Divider />}>
                <InfoRow label="Client Name" value={company.clientName} />
                <InfoRow label="Phone" value={company.clientPhone} />
              </Stack>
            </SectionCard>

            {/* Client app access */}
            <SectionCard title="Client App Access">
              {company.clientAppAccess ? (
                <Stack divider={<Divider />}>
                  <InfoRow
                    label="Access Status"
                    value="Enabled"
                    valueColor="#10B981"
                  />
                  {company.clientEmail && (
                    <InfoRow label="Login Email" value={company.clientEmail} />
                  )}
                  <InfoRow
                    label="Password"
                    value={company.clientPasswordSet ? '••••••••' : 'Not set'}
                    valueColor={company.clientPasswordSet ? 'text.primary' : '#EF4444'}
                  />
                </Stack>
              ) : (
                <Typography variant="body2" color="text.disabled">
                  Client app access is not enabled for this company.
                </Typography>
              )}
            </SectionCard>

          </Stack>
        </Grid>

        {/* ── Right column ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>

            {/* Directors */}
            <SectionCard title={`Directors (${company.directors.length})`}>
              {company.directors.length === 0 && (
                <Typography variant="body2" color="text.disabled">No directors on record.</Typography>
              )}
              <Stack spacing={2}>
                {company.directors.map((director) => {
                  const visaStatus = DirectorVisaStatus(director);
                  const hasVisa = !!(director.visaType || director.visaExpiry);
                  return (
                    <Paper
                      key={director.id}
                      elevation={0}
                      sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
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
                              bgcolor: STATUS_BG[visaStatus],
                              color: STATUS_TEXT[visaStatus],
                            }}
                          />
                        )}
                      </Stack>

                      {hasVisa && (
                        <Stack direction="row" spacing={3} sx={{ mt: 1.5 }} flexWrap="wrap">
                          {director.visaType && (
                            <Box>
                              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Visa Type</Typography>
                              <Typography variant="caption" fontWeight="fontWeightMedium">{director.visaType}</Typography>
                            </Box>
                          )}
                          {director.visaExpiry && (
                            <Box>
                              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Expiry</Typography>
                              <Typography
                                variant="caption"
                                fontWeight="fontWeightMedium"
                                sx={{ color: visaStatus ? STATUS_COLORS[visaStatus] : 'text.primary' }}
                              >
                                {fDate(director.visaExpiry)}
                              </Typography>
                            </Box>
                          )}
                          {director.workPermit !== undefined && (
                            <Box>
                              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Work Permit</Typography>
                              <Typography
                                variant="caption"
                                fontWeight="fontWeightMedium"
                                sx={{ color: director.workPermit ? '#10B981' : '#EF4444' }}
                              >
                                {director.workPermit ? 'Yes' : 'No'}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            </SectionCard>

            {/* Documents */}
            <SectionCard title={`Documents (${company.documents.length})`}>
              {company.documents.length === 0 && (
                <Typography variant="body2" color="text.disabled">No documents uploaded.</Typography>
              )}
              <Stack spacing={1.5}>
                {company.documents.map((doc) => (
                  <Stack key={doc.id} direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                      <Iconify
                        icon="solar:check-circle-bold"
                        width={18}
                        sx={{ color: '#10B981', flexShrink: 0 }}
                      />
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
            </SectionCard>

          </Stack>
        </Grid>

        {/* ── Full-width History ── */}
        <Grid size={{ xs: 12 }}>
          <SectionCard title="History">
            {company.history.length === 0 && (
              <Typography variant="body2" color="text.disabled">No history recorded.</Typography>
            )}
            <Stack spacing={0}>
              {company.history.map((entry, idx) => (
                <Stack key={entry.id} direction="row" spacing={2} alignItems="flex-start">
                  <Stack alignItems="center" sx={{ flexShrink: 0, width: 16 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981', mt: 0.4 }} />
                    {idx < company.history.length - 1 && (
                      <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', minHeight: 28 }} />
                    )}
                  </Stack>
                  <Box sx={{ pb: 2, minWidth: 0 }}>
                    <Typography variant="body2">{entry.action}</Typography>
                    <Typography variant="caption" color="text.disabled">
                      {fDate(entry.date)} · {entry.by}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
