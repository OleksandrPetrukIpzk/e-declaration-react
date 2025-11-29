import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  TablePagination
} from '@mui/material';
import { AnalyticsDaoService, ChurnPredictionResponse } from '../../services/analyticsDaoService';

export const ChurnPredictionChart: React.FC = () => {
  const [churnData, setChurnData] = useState<ChurnPredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchChurnData();
  }, []);

  const fetchChurnData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getChurnPrediction();
      setChurnData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані прогнозу відтоку');
      console.error('Error fetching churn data:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseChurnRisk = (risk: string): number => {
    return parseFloat(risk);
  };

  const parseRejectionRate = (rate: string): number => {
    return parseFloat(rate.replace('%', ''));
  };

  const getRiskLevelColor = (level: "low" | "medium" | "high"): string => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336'
    };
    return colors[level];
  };

  const getRiskLevelLabel = (level: "low" | "medium" | "high"): string => {
    const labels = {
      low: 'Низький',
      medium: 'Середній',
      high: 'Високий'
    };
    return labels[level];
  };

  const getPieOption = () => {
    if (!churnData || !churnData.summary) {
      return {};
    }

    const pieData = [
      {
        name: 'Високий ризик',
        value: churnData.summary.highRisk,
        itemStyle: { color: getRiskLevelColor('high') }
      },
      {
        name: 'Середній ризик',
        value: churnData.summary.mediumRisk,
        itemStyle: { color: getRiskLevelColor('medium') }
      },
      {
        name: 'Низький ризик',
        value: churnData.summary.lowRisk,
        itemStyle: { color: getRiskLevelColor('low') }
      }
    ];

    return {
      title: {
        text: 'Розподіл пацієнтів по рівнях ризику відтоку',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 60
      },
      series: [
        {
          name: 'Рівень ризику',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          data: pieData
        }
      ]
    };
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!churnData || !churnData.atRisk.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Прогноз відтоку пацієнтів
          </Typography>
          <Alert severity="info">Немає даних про пацієнтів з ризиком відтоку</Alert>
        </CardContent>
      </Card>
    );
  }

  const paginatedPatients = churnData.atRisk.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Прогноз відтоку пацієнтів
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="chart">Графік</ToggleButton>
            <ToggleButton value="table">Таблиця</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, border: '2px solid #2196f3' }}>
              <Typography variant="h4" color="primary">
                {churnData.summary.totalPatients}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всього пацієнтів
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffebee', borderRadius: 1, border: `2px solid ${getRiskLevelColor('high')}` }}>
              <Typography variant="h4" sx={{ color: getRiskLevelColor('high') }}>
                {churnData.summary.highRisk}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Високий ризик
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 1, border: `2px solid ${getRiskLevelColor('medium')}` }}>
              <Typography variant="h4" sx={{ color: getRiskLevelColor('medium') }}>
                {churnData.summary.mediumRisk}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Середній ризик
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e9', borderRadius: 1, border: `2px solid ${getRiskLevelColor('low')}` }}>
              <Typography variant="h4" sx={{ color: getRiskLevelColor('low') }}>
                {churnData.summary.lowRisk}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Низький ризик
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Charts */}
        {viewMode === 'chart' && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getPieOption()}
              style={{ height: '500px' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Box>
        )}

        {/* Table */}
        {viewMode === 'table' && (
          <Box sx={{ mt: 3 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Email пацієнта</strong></TableCell>
                    <TableCell align="center"><strong>Остання активність</strong></TableCell>
                    <TableCell align="center"><strong>Днів неактивності</strong></TableCell>
                    <TableCell align="center"><strong>Кількість декларацій</strong></TableCell>
                    <TableCell align="center"><strong>Rejection Rate</strong></TableCell>
                    <TableCell align="center"><strong>Ризик відтоку</strong></TableCell>
                    <TableCell align="center"><strong>Рівень ризику</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPatients.map((patient, index) => {
                    const churnRiskValue = parseChurnRisk(patient.churnRisk);
                    const rejectionRateValue = parseRejectionRate(patient.rejectionRate);

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: patient.riskLevel === 'high' ? '#ffebee' :
                                          patient.riskLevel === 'medium' ? '#fff3e0' : '#f5f5f5',
                          '&:hover': {
                            backgroundColor: patient.riskLevel === 'high' ? '#ffcdd2' :
                                            patient.riskLevel === 'medium' ? '#ffe0b2' : '#e0e0e0'
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {patient.patientEmail}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {new Date(patient.lastActivity).toLocaleDateString('uk-UA')}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={patient.daysSinceActivity > 60 ? 'error.main' :
                                   patient.daysSinceActivity > 30 ? 'warning.main' : 'text.secondary'}
                          >
                            {patient.daysSinceActivity}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {patient.declarationCount}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            color={rejectionRateValue > 30 ? 'error.main' :
                                   rejectionRateValue > 15 ? 'warning.main' : 'text.secondary'}
                          >
                            {patient.rejectionRate}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="bold">
                            {churnRiskValue.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getRiskLevelLabel(patient.riskLevel)}
                            size="small"
                            sx={{
                              backgroundColor: getRiskLevelColor(patient.riskLevel),
                              color: '#fff'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={churnData.atRisk.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Рядків на сторінці:"
            />
          </Box>
        )}

        {/* Information */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Інтерпретація ризику відтоку:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Високий ризик (70-100%):</strong> Пацієнти з високою ймовірністю відтоку, потребують негайної уваги
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Середній ризик (40-70%):</strong> Пацієнти з помірною ймовірністю відтоку, рекомендується моніторинг
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Низький ризик (0-40%):</strong> Пацієнти з низькою ймовірністю відтоку
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Фактори ризику:</strong> тривалість неактивності, кількість відхилених декларацій, загальна кількість декларацій
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};