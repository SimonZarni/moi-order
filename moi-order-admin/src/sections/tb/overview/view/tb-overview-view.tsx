import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fNumber , fShortenNumber } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AnalyticsNews } from 'src/sections/overview/analytics-news';
import { AnalyticsCurrentVisits } from 'src/sections/overview/analytics-current-visits';
import { AnalyticsOrderTimeline } from 'src/sections/overview/analytics-order-timeline';
import { AnalyticsWebsiteVisits } from 'src/sections/overview/analytics-website-visits';
import { AnalyticsWidgetSummary } from 'src/sections/overview/analytics-widget-summary';
import { AnalyticsConversionRates } from 'src/sections/overview/analytics-conversion-rates';

import {
  TB_MONTHS,
  TB_SUMMARY,
  TB_TOP_SERVICES,
  TB_ORDER_STATUS,
  TB_RECENT_ORDERS,
  TB_MONTHLY_REVENUE,
  TB_PAYMENT_TIMELINE,
  exportTBOverviewCSV,
  TB_ORDERS_BY_SERVICE,
  TB_ORDER_STATUS_COLORS,
} from '../tb-analytics-mock';

// ----------------------------------------------------------------------

export function TBOverviewView() {
  const handleExport = useCallback(() => {
    exportTBOverviewCSV();
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
            <Typography variant="h4">Trusted Brothers — Operations Overview</Typography>
            <Chip
              size="small"
              label="Historical / Pre-App"
              sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 600, fontSize: 11 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Manual order history from before the Moi Order app. Separate from app-driven data.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:trending-up-fill" width={18} />}
          onClick={handleExport}
          sx={{ flexShrink: 0 }}
        >
          Export CSV
        </Button>
      </Stack>

      <Grid container spacing={3}>

        {/* ── Row 1: KPI widgets ── */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Manual Orders"
            percent={TB_SUMMARY.totalOrdersChange}
            total={TB_SUMMARY.totalOrders}
            icon={<img alt="Total Orders" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{ categories: TB_MONTHS, series: TB_SUMMARY.totalOrdersMonthly }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Revenue (THB)"
            percent={TB_SUMMARY.totalRevenueChange}
            total={TB_SUMMARY.totalRevenueTHB}
            color="secondary"
            formatTotal={(v) => `฿${fShortenNumber(v)}`}
            icon={<img alt="Revenue" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{ categories: TB_MONTHS, series: TB_SUMMARY.totalRevenueMonthly }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Active Clients"
            percent={TB_SUMMARY.activeClientsChange}
            total={TB_SUMMARY.activeClients}
            color="warning"
            icon={<img alt="Active Clients" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{ categories: TB_MONTHS, series: TB_SUMMARY.activeClientsMonthly }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Services Completed"
            percent={TB_SUMMARY.servicesCompletedChange}
            total={TB_SUMMARY.servicesCompleted}
            color="error"
            icon={<img alt="Services Completed" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{ categories: TB_MONTHS, series: TB_SUMMARY.servicesCompletedMonthly }}
          />
        </Grid>

        {/* ── Row 2: Pie + Monthly Revenue bar ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCurrentVisits
            title="Orders by Service Type"
            chart={{ series: TB_ORDERS_BY_SERVICE }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsWebsiteVisits
            title="Monthly Revenue (THB 000s)"
            subheader={`(+${TB_SUMMARY.totalRevenueChange}%) compared to last year`}
            chart={{
              categories: TB_MONTHS,
              series: [
                { name: 'This Year', data: TB_MONTHLY_REVENUE.thisYear },
                { name: 'Last Year', data: TB_MONTHLY_REVENUE.lastYear },
              ],
              options: {
                tooltip: {
                  y: { formatter: (v: number) => `฿${fNumber(v)}k` },
                },
              },
            }}
          />
        </Grid>

        {/* ── Row 3: Top services horizontal bar + Status breakdown pie ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsConversionRates
            title="Top Services"
            subheader="Orders by service type — this month vs last month"
            chart={{
              categories: TB_TOP_SERVICES.categories,
              series: TB_TOP_SERVICES.series,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCurrentVisits
            title="Order Status Breakdown"
            chart={{
              series: TB_ORDER_STATUS,
              colors: TB_ORDER_STATUS_COLORS,
            }}
          />
        </Grid>

        {/* ── Row 4: Recent orders feed + Payment timeline ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsNews title="Recent Manual Orders" list={TB_RECENT_ORDERS} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsOrderTimeline
            title="Payment Timeline"
            subheader="Latest manual invoices"
            list={TB_PAYMENT_TIMELINE}
          />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
