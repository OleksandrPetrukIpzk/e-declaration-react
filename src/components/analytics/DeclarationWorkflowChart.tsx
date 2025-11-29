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
import { DeclarationWorkflowStats } from '../../services/analyticsDaoService';

interface DeclarationWorkflowChartProps {
  data: DeclarationWorkflowStats;
}

export const DeclarationWorkflowChart: React.FC<DeclarationWorkflowChartProps> = ({ data }) => {
  const total = Number(data?.workflowSummary?.totalDeclarations) || 0;
  const getPercentage = (value: number) => total > 0 ? (value / total) * 100 : 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Процес обробки декларацій
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Очікуючі"
              value={Number(data?.workflowSummary?.pending) || 0}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Завершені"
              value={Number(data?.workflowSummary?.completed) || 0}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Відхилені"
              value={Number(data?.workflowSummary?.rejected) || 0}
              color="error"
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Розподіл статусів декларацій
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Очікуючі ({getPercentage(Number(data?.workflowSummary?.pending) || 0).toFixed(1)}%)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getPercentage(Number(data?.workflowSummary?.pending) || 0)}
              color="warning"
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Завершені ({getPercentage(Number(data?.workflowSummary?.completed) || 0).toFixed(1)}%)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getPercentage(Number(data?.workflowSummary?.completed) || 0)}
              color="success"
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Відхилені ({getPercentage(Number(data?.workflowSummary?.rejected) || 0).toFixed(1)}%)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getPercentage(Number(data?.workflowSummary?.rejected) || 0)}
              color="error"
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>

        {data?.statusStats && data.statusStats.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Детальна статистика по статусах
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Статус</TableCell>
                    <TableCell align="right">Кількість</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.statusStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell>{stat.status}</TableCell>
                      <TableCell align="right">{stat.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {data?.processingTimes && data.processingTimes.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Час обробки за статусами
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Статус</TableCell>
                    <TableCell align="right">Кількість</TableCell>
                    <TableCell align="right">Середній час (год)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.processingTimes.map((time, index) => (
                    <TableRow key={index}>
                      <TableCell>{time.status}</TableCell>
                      <TableCell align="right">{time.count}</TableCell>
                      <TableCell align="right">{Number(time.avgProcessingHours).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};