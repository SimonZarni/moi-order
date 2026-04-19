import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _tasks, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

const _recentActivity = [
  { id: '1', title: 'Booking #B-1042 — Vientiane City Tour', description: 'Confirmed · 2 guests', postedAt: new Date(Date.now() - 1000 * 60 * 20) },
  { id: '2', title: 'Booking #B-1041 — Luang Prabang Day Trip', description: 'Pending payment · 3 guests', postedAt: new Date(Date.now() - 1000 * 60 * 55) },
  { id: '3', title: 'New place listed — Phosy Night Market', description: 'Awaiting review', postedAt: new Date(Date.now() - 1000 * 60 * 90) },
  { id: '4', title: 'Booking #B-1040 — Mekong Sunset Cruise', description: 'Completed · 4 guests', postedAt: new Date(Date.now() - 1000 * 60 * 180) },
  { id: '5', title: 'New partner joined — Lao Green Travel', description: 'Partner verified', postedAt: new Date(Date.now() - 1000 * 60 * 300) },
];

const _adminTasks = [
  { id: '1', name: 'Review pending place submissions (8)' },
  { id: '2', name: 'Respond to partner onboarding requests' },
  { id: '3', name: 'Update Vang Vieng category listings' },
  { id: '4', name: 'Verify new user KYC documents' },
  { id: '5', name: "Publish this week's featured destinations" },
];

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome back 👋 Moi Order Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Bookings"
            percent={8.2}
            total={3842}
            icon={<img alt="Total Bookings" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{ categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], series: [120, 185, 210, 260, 310, 390, 420, 480] }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Active Users"
            percent={5.4}
            total={12560}
            color="secondary"
            icon={<img alt="Active Users" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{ categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], series: [800, 1200, 1500, 1900, 2400, 2800, 3100, 3600] }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Listed Places"
            percent={12.1}
            total={648}
            color="warning"
            icon={<img alt="Listed Places" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{ categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], series: [40, 80, 120, 200, 310, 420, 530, 648] }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Revenue (USD)"
            percent={3.6}
            total={52480}
            color="error"
            icon={<img alt="Revenue" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{ categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], series: [3200, 4100, 5200, 6300, 7100, 8400, 9200, 9900] }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Bookings by Category"
            chart={{
              series: [
                { label: 'Tours & Sightseeing', value: 1540 },
                { label: 'Accommodation', value: 980 },
                { label: 'Food & Dining', value: 720 },
                { label: 'Transport', value: 380 },
                { label: 'Activities', value: 222 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Monthly Bookings"
            subheader="(+8.2%) compared to last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'This Year', data: [120, 185, 210, 260, 310, 390, 420, 480, 540] },
                { name: 'Last Year', data: [95, 140, 170, 200, 240, 290, 330, 380, 430] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Top Destinations"
            subheader="Bookings by city this month"
            chart={{
              categories: ['Vientiane', 'Luang Prabang', 'Vang Vieng', 'Pakse', 'Savannakhet'],
              series: [
                { name: 'This Month', data: [320, 280, 210, 145, 98] },
                { name: 'Last Month', data: [290, 250, 195, 130, 85] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Feature Usage"
            chart={{
              categories: ['Search', 'Booking', 'Reviews', 'Wishlist', 'Chat', 'Map'],
              series: [
                { name: 'Mobile App', data: [90, 75, 60, 55, 45, 80] },
                { name: 'Web', data: [70, 65, 50, 40, 30, 60] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsNews title="Recent Activity" list={_recentActivity as any} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsOrderTimeline title="Booking Timeline" list={_timeline} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsTasks title="Admin Tasks" list={_adminTasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
