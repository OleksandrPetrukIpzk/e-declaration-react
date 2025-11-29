import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from '@mui/material';
import { StatsCard } from '../StatsCard';
import { UserActivityStats } from '../../services/analyticsDaoService';

interface UserActivityChartProps {
  data: UserActivityStats;
}

export const UserActivityChart: React.FC<UserActivityChartProps> = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Активність користувачів
        </Typography>

        {/* Інформація про щоденну активність */}
        {data?.dailyActiveUsers && data.dailyActiveUsers.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Щоденна активність
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StatsCard
                  title="Активні користувачі"
                  value={Number(data.dailyActiveUsers[0]?.activeUsers) || 0}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Дата: {data.dailyActiveUsers[0]?.date ? new Date(data.dailyActiveUsers[0].date).toLocaleDateString('uk-UA') : 'Н/Д'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Статистика входів */}
        {data?.loginStats && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Статистика входів
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <StatsCard
                  title="Загальні входи"
                  value={data.loginStats.totalLogins || 0}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatsCard
                  title="Всього користувачів"
                  value={data.loginStats.totalUsers || 0}
                  color="info"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatsCard
                  title="Унікальні користувачі"
                  value={data.loginStats.uniqueUsers || 0}
                  color="warning"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Якщо немає даних */}
        {(!data?.dailyActiveUsers || data.dailyActiveUsers.length === 0) && !data?.loginStats && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Немає даних для відображення
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};