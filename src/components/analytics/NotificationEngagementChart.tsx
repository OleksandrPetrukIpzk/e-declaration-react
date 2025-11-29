import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { StatsCard } from '../StatsCard';
import { NotificationEngagementStats } from '../../services/analyticsDaoService';

interface NotificationEngagementChartProps {
  data: NotificationEngagementStats;
}

export const NotificationEngagementChart: React.FC<NotificationEngagementChartProps> = ({ data }) => {
  const openRate = parseFloat((data?.metrics?.openRate || '0%').replace('%', ''));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Взаємодія з повідомленнями
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <StatsCard
              title="Відправлено"
              value={Number(data.metrics?.totalSent) || 0}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard
              title="Прочитано"
              value={Number(data?.metrics.totalRead) || 0}
              color="success"
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Показники ефективності
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Відсоток відкриттів: {data?.metrics?.openRate || '0%'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(openRate, 100)}
              color="success"
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/*<Box sx={{ mb: 2 }}>*/}
          {/*  <Typography variant="body2" color="text.secondary">*/}
          {/*    Відсоток кліків: {data?.metrics?.clickRate || '0%'}*/}
          {/*  </Typography>*/}
          {/*  <LinearProgress*/}
          {/*    variant="determinate"*/}
          {/*    value={Math.min(clickRate, 100)}*/}
          {/*    color="warning"*/}
          {/*    sx={{ height: 8, borderRadius: 4 }}*/}
          {/*  />*/}
          {/*</Box>*/}
        </Box>

        {data.dailyNotifications && data.dailyNotifications.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Статистика за період
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell align="right">Відправлено</TableCell>
                    <TableCell align="right">Відкрито</TableCell>
                    <TableCell align="right">% відкриттів</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.dailyNotifications?.map((engagement, index) => {
                    const dailyOpenRate = Number(engagement.sent) > 0
                      ? ((Number(engagement.read) / Number(engagement.sent)) * 100).toFixed(1)
                      : '0';

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(engagement.date).toLocaleDateString('uk-UA')}
                        </TableCell>
                        <TableCell align="right">{engagement.sent}</TableCell>
                        <TableCell align="right">{engagement.read}</TableCell>
                        <TableCell align="right">{dailyOpenRate}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};