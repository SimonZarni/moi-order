import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { useDashboardStats, getLastEightMonthLabels } from '../hooks/useDashboardStats';

// ----------------------------------------------------------------------

const EMPTY_EIGHT = [0, 0, 0, 0, 0, 0, 0, 0];
const MONTH_LABELS = getLastEightMonthLabels();


export function OverviewAnalyticsView() {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent maxWidth="xl">
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </DashboardContent>
    );
  }

  const summary = stats!.summary;
  const ordersChange = summary.total_orders_change;
  const changeSign = ordersChange !== null && ordersChange > 0 ? '+' : '';

  const recentActivity = stats!.recent_activity.map((item) => ({
    id: item.id,
    title: item.title,
    coverUrl: item.cover_url,
    description: item.description,
    postedAt: item.posted_at,
  }));

  const topServices = stats!.top_services_comparison;
  const topServicesChart = {
    categories: topServices.categories,
    series: [
      { name: 'This Month', data: topServices.this_month },
      { name: 'Last Month', data: topServices.last_month },
    ],
  };

  const statusBreakdown = stats!.submission_status_breakdown;

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome back 👋 Moi Order Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Orders"
            percent={summary.total_orders_change}
            total={summary.total_orders}
            current={summary.orders_this_month}
            previous={summary.orders_last_month}
            icon={<img alt="Total Orders" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{ categories: MONTH_LABELS, series: summary.total_orders_monthly.length ? summary.total_orders_monthly : EMPTY_EIGHT }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Active Users"
            percent={summary.active_users_change}
            total={summary.active_users}
            current={summary.users_this_month}
            previous={summary.users_last_month}
            color="secondary"
            icon={<img alt="Active Users" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{ categories: MONTH_LABELS, series: summary.active_users_monthly.length ? summary.active_users_monthly : EMPTY_EIGHT }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Listed Places"
            percent={summary.listed_places_change}
            total={summary.listed_places}
            current={summary.places_this_month}
            previous={summary.places_last_month}
            color="warning"
            icon={<img alt="Listed Places" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{ categories: MONTH_LABELS, series: summary.listed_places_monthly.length ? summary.listed_places_monthly : EMPTY_EIGHT }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Revenue (THB)"
            percent={summary.revenue_change}
            total={summary.total_revenue}
            current={summary.total_revenue}
            previous={summary.revenue_last_month}
            formatTotal={(value) => fNumber(value / 100)}
            formatCount={(value) => fNumber(value / 100)}
            color="error"
            icon={<img alt="Revenue" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{ categories: MONTH_LABELS, series: summary.revenue_monthly.length ? summary.revenue_monthly : EMPTY_EIGHT }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Orders by Service"
            chart={{ series: stats!.orders_by_service }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Monthly Orders"
            subheader={ordersChange !== null ? `(${changeSign}${ordersChange}%) compared to last month` : 'No prior month data'}
            chart={{
              categories: stats!.monthly_orders.labels,
              series: [
                { name: 'This Year', data: stats!.monthly_orders.this_year },
                { name: 'Last Year', data: stats!.monthly_orders.last_year },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Top Services"
            subheader="Orders by service — this month vs last month"
            chart={topServicesChart}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Submission Status"
            subheader="This year vs last year"
            chart={statusBreakdown}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsNews title="Recent Activity" list={recentActivity} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsOrderTimeline title="Payment Timeline" list={stats!.payment_timeline} />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
