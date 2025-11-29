import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { LandingScreenHeader } from "../components/LandingScreenHeader";
import { UserActivityChart } from "../components/analytics/UserActivityChart";
import { DeclarationWorkflowChart } from "../components/analytics/DeclarationWorkflowChart";
import { DoctorPerformanceTable } from "../components/analytics/DoctorPerformanceTable";
import { ClinicStatsTable } from "../components/analytics/ClinicStatsTable";
import { NotificationEngagementChart } from "../components/analytics/NotificationEngagementChart";
import {
  AnalyticsDaoService,
  UserActivityStats,
  DeclarationWorkflowStats,
  DoctorPerformanceStats,
  ClinicStats,
  NotificationEngagementStats
} from '../services/analyticsDaoService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const DetailedAnalytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'all'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userActivity, setUserActivity] = useState<UserActivityStats | null>(null);
  const [declarationWorkflow, setDeclarationWorkflow] = useState<DeclarationWorkflowStats | null>(null);
  const [doctorPerformance, setDoctorPerformance] = useState<DoctorPerformanceStats | null>(null);
  const [clinicStats, setClinicStats] = useState<ClinicStats | null>(null);
  const [notificationEngagement, setNotificationEngagement] = useState<NotificationEngagementStats | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      let startDate: string | undefined;
      let endDate: string | undefined;

      if (dateRange !== 'all') {
        endDate = new Date().toISOString();

        switch (dateRange) {
          case 'week':
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case 'month':
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case 'quarter':
            startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
            break;
        }
      }
      const [
        userActivityData,
        declarationWorkflowData,
        doctorPerformanceData,
        clinicStatsData,
        notificationEngagementData,
      ] = await Promise.all([
        AnalyticsDaoService.getUserActivity(startDate, endDate),
        AnalyticsDaoService.getDeclarationWorkflow(startDate, endDate),
        AnalyticsDaoService.getDoctorPerformance(startDate, endDate),
        AnalyticsDaoService.getClinicStats(startDate, endDate),
        AnalyticsDaoService.getNotificationEngagement(startDate, endDate),
      ]);

      setUserActivity(userActivityData);
      setDeclarationWorkflow(declarationWorkflowData);
      setDoctorPerformance(doctorPerformanceData);
      setClinicStats(clinicStatsData);
      setNotificationEngagement(notificationEngagementData);
    } catch (err) {
      setError('Не вдалося завантажити дані аналітики');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <div>
        <LandingScreenHeader />
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <LandingScreenHeader />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <LandingScreenHeader />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Детальна аналітика
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Період</InputLabel>
            <Select
              value={dateRange}
              label="Період"
              onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'quarter' | 'all')}
            >
              <MenuItem value="week">Тиждень</MenuItem>
              <MenuItem value="month">Місяць</MenuItem>
              <MenuItem value="quarter">Квартал</MenuItem>
              <MenuItem value="all">Весь час</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="Активність користувачів" />
            <Tab label="Процес декларацій" />
            <Tab label="Продуктивність лікарів" />
            <Tab label="Статистика клінік" />
            <Tab label="Повідомлення" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {userActivity && <UserActivityChart data={userActivity} />}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {declarationWorkflow && <DeclarationWorkflowChart data={declarationWorkflow} />}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {doctorPerformance && <DoctorPerformanceTable data={doctorPerformance} />}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {clinicStats && <ClinicStatsTable data={clinicStats} />}
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {notificationEngagement && <NotificationEngagementChart data={notificationEngagement} />}
        </TabPanel>
      </Container>
    </div>
  );
};