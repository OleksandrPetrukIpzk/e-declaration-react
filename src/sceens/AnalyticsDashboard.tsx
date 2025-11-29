import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { LandingScreenHeader } from "../components/LandingScreenHeader";
import { StatsCard } from "../components/StatsCard";
import { AnalyticsDaoService, DashboardData } from '../services/analyticsDaoService';
import { useNavigate } from 'react-router-dom';
import { AnomaliesChart } from '../components/analytics/AnomaliesChart';
import { DoctorAnomaliesChart } from '../components/analytics/DoctorAnomaliesChart';
import { CohortAnalysisChart } from '../components/analytics/CohortAnalysisChart';
import { DeclarationFunnelChart } from '../components/analytics/DeclarationFunnelChart';
import { RFMAnalysisChart } from '../components/analytics/RFMAnalysisChart';
import { PatternAnalysisChart } from '../components/analytics/PatternAnalysisChart';
import { SentimentAnalysisChart } from '../components/analytics/SentimentAnalysisChart';
import { ChurnPredictionChart } from '../components/analytics/ChurnPredictionChart';
import { DoctorRecommendationsChart } from '../components/analytics/DoctorRecommendationsChart';
import { NetworkAnalysisChart } from '../components/analytics/NetworkAnalysisChart';

export const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'quarter' | 'all'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      await AnalyticsDaoService.debug();
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getDashboardData(period);
      setDashboardData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані аналітики');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
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

  if (!dashboardData) {
    return (
      <div>
        <LandingScreenHeader />
        <Container sx={{ mt: 4 }}>
          <Alert severity="info">Немає даних для відображення</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <LandingScreenHeader />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Card sx={{mb: 3}}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Період аналізу
            </Typography>
            <Typography variant="body2" color="text.secondary">
              З {dashboardData.dateRange?.startDate ? new Date(dashboardData.dateRange.startDate).toLocaleDateString('uk-UA') : 'Н/Д'} по {dashboardData.dateRange?.endDate ? new Date(dashboardData.dateRange.endDate).toLocaleDateString('uk-UA') : 'Н/Д'}
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Аналітика системи
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/analytics/detailed')}
            >
              Детальна аналітика
            </Button>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Період</InputLabel>
              <Select
                value={period}
                label="Період"
                onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month' | 'quarter' | 'all')}
              >
                <MenuItem value="day">День</MenuItem>
                <MenuItem value="week">Тиждень</MenuItem>
                <MenuItem value="month">Місяць</MenuItem>
                <MenuItem value="quarter">Квартал</MenuItem>
                <MenuItem value="all">Весь час</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Загальна кількість користувачів"
              value={dashboardData.overview?.users?.total || 0}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Активні користувачі"
              value={dashboardData.overview?.users?.active || 0}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Загальна кількість декларацій"
              value={dashboardData.overview?.declarations?.total || 0}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Активні клініки"
              value={dashboardData.overview?.clinics?.active || 0}
              color="success"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Статистика декларацій
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <StatsCard
                      title="Очікуючі"
                      value={Number(dashboardData.declarationWorkflow?.workflowSummary?.pending) || 0}
                      color="warning"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatsCard
                      title="Завершені"
                      value={Number(dashboardData.declarationWorkflow?.workflowSummary?.completed) || 0}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatsCard
                      title="Відхилені"
                      value={Number(dashboardData.declarationWorkflow?.workflowSummary?.rejected) || 0}
                      color="error"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatsCard
                      title="Активні"
                      value={dashboardData.overview?.declarations?.active || 0}
                      color="primary"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Активність користувачів
                </Typography>

                {dashboardData.userActivity?.dailyActiveUsers && dashboardData.userActivity.dailyActiveUsers.length > 0 && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <StatsCard
                        title="Активні користувачі сьогодні"
                        value={Number(dashboardData.userActivity.dailyActiveUsers[0]?.activeUsers) || 0}
                        color="success"
                      />
                    </Grid>
                  </Grid>
                )}

                {dashboardData.userActivity?.loginStats && (
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <StatsCard
                        title="Загальні входи"
                        value={dashboardData.userActivity.loginStats?.totalLogins || 0}
                        color="primary"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <StatsCard
                        title="Всього користувачів"
                        value={dashboardData.userActivity.loginStats?.totalUsers || 0}
                        color="warning"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <StatsCard
                        title="Унікальні користувачі"
                        value={dashboardData.userActivity.loginStats?.uniqueUsers || 0}
                        color="warning"
                      />
                    </Grid>
                  </Grid>
                )}

                {(!dashboardData.userActivity?.dailyActiveUsers) && !dashboardData.userActivity?.loginStats && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Немає даних про активність користувачів
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Продуктивність лікарів
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Загальна кількість лікарів: {dashboardData.doctorPerformance?.doctorStats?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Загальна кількість декларацій: {dashboardData.doctorPerformance?.doctorStats?.reduce((total, doctor) => total + Number(doctor.totalDeclarations), 0) || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Взаємодія з повідомленнями
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <StatsCard
                      title="Відправлено"
                      value={Number(dashboardData.notificationEngagement?.metrics.totalSent) || 0}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StatsCard
                      title="Відкрито"
                      value={Number(dashboardData.notificationEngagement?.metrics.totalRead) || 0}
                      color="success"
                    />
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Відсоток відкриттів: {dashboardData.notificationEngagement?.metrics?.openRate || '0%'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Виявлення аномалій в системі */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <AnomaliesChart defaultLookbackDays="30" />
          </Grid>
        </Grid>

        {/* Виявлення аномалій у лікарів */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <DoctorAnomaliesChart defaultLookbackDays="30" />
          </Grid>
        </Grid>

        {/* Когортний аналіз пацієнтів */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <CohortAnalysisChart defaultCohortBy="month" />
          </Grid>
        </Grid>

        {/* Воронка декларацій */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <DeclarationFunnelChart />
          </Grid>
        </Grid>

        {/* RFM Аналіз лікарів */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <RFMAnalysisChart />
          </Grid>
        </Grid>

        {/* Аналіз патернів активності */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <PatternAnalysisChart defaultLookbackDays="30" />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <SentimentAnalysisChart defaultLookbackDays="30" />
          </Grid>
        </Grid>

        {/* Прогноз відтоку пацієнтів */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <ChurnPredictionChart />
          </Grid>
        </Grid>

        {/* Рекомендації лікарів */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <DoctorRecommendationsChart />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <NetworkAnalysisChart />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};