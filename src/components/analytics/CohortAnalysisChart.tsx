import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  ToggleButtonGroup
} from '@mui/material';
import { AnalyticsDaoService, CohortAnalysisResponse } from '../../services/analyticsDaoService';

interface CohortAnalysisChartProps {
  defaultCohortBy?: 'month' | 'week';
}

export const CohortAnalysisChart: React.FC<CohortAnalysisChartProps> = ({ defaultCohortBy = 'month' }) => {
  const [cohortData, setCohortData] = useState<CohortAnalysisResponse | null>(null);
  const [cohortBy, setCohortBy] = useState<'month' | 'week'>(defaultCohortBy);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    fetchCohortData();
  }, [cohortBy]);

  const fetchCohortData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getCohortAnalysis(cohortBy);
      setCohortData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані когортного аналізу');
      console.error('Error fetching cohort data:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseRetentionRate = (rate: string): number => {
    return parseFloat(rate.replace('%', ''));
  };

  const getBarChartOption = () => {
    if (!cohortData || !cohortData.cohorts.length) {
      return {};
    }

    const cohorts = cohortData.cohorts.map(c => c.cohort);
    const retentionRates = cohortData.cohorts.map(c => parseRetentionRate(c.retentionRate));

    return {
      title: {
        text: 'Retention Rate по когортах',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const index = params[0].dataIndex;
          const cohort = cohortData.cohorts[index];
          return `
            <strong>Когорта:</strong> ${cohort.cohort}<br/>
            <strong>Retention Rate:</strong> ${cohort.retentionRate}<br/>
            <strong>Пацієнтів:</strong> ${cohort.patientCount}<br/>
            <strong>Декларацій:</strong> ${cohort.declarationCount}<br/>
            <strong>Активних:</strong> ${cohort.activeCount}
          `;
        }
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        top: 80,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: cohorts,
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Retention Rate (%)',
        min: 0,
        max: 100
      },
      series: [
        {
          name: 'Retention Rate',
          type: 'bar',
          data: retentionRates.map(rate => ({
            value: rate,
            itemStyle: {
              color: rate >= 75 ? '#4caf50' : rate >= 50 ? '#ff9800' : '#f44336'
            }
          })),
          barWidth: '60%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%'
          },
          markLine: {
            data: [
              {
                name: 'Середнє',
                yAxis: parseRetentionRate(cohortData.summary.avgRetentionRate),
                lineStyle: {
                  color: '#1976d2',
                  type: 'dashed',
                  width: 2
                },
                label: {
                  formatter: `Середнє: ${cohortData.summary.avgRetentionRate}`
                }
              }
            ]
          }
        }
      ]
    };
  };

  const getHeatmapOption = () => {
    if (!cohortData || !cohortData.cohorts.length) {
      return {};
    }

    const cohorts = cohortData.cohorts.map(c => c.cohort);
    const heatmapData = cohortData.cohorts.map((cohort, index) => {
      return [index, 0, parseRetentionRate(cohort.retentionRate)];
    });

    return {
      title: {
        text: 'Cohort Retention Matrix',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        position: 'top',
        formatter: function(params: any) {
          const cohortIndex = params.data[0];
          const cohort = cohortData.cohorts[cohortIndex];
          return `
            <strong>Когорта:</strong> ${cohort.cohort}<br/>
            <strong>Retention Rate:</strong> ${cohort.retentionRate}<br/>
            <strong>Пацієнтів:</strong> ${cohort.patientCount}<br/>
            <strong>Активних:</strong> ${cohort.activeCount}
          `;
        }
      },
      grid: {
        height: '50%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: cohorts,
        splitArea: {
          show: true
        },
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'category',
        data: ['Retention'],
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: {
          color: ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50']
        },
        text: ['Високий', 'Низький'],
        textStyle: {
          color: '#000'
        }
      },
      series: [
        {
          name: 'Retention Rate',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: function(params: any) {
              return params.data[2].toFixed(1) + '%';
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
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

  if (!cohortData || !cohortData.cohorts.length) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Когортний аналіз пацієнтів
            </Typography>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Тип когорти</InputLabel>
              <Select
                value={cohortBy}
                label="Тип когорти"
                onChange={(e) => setCohortBy(e.target.value as 'month' | 'week')}
              >
                <MenuItem value="month">По місяцях</MenuItem>
                <MenuItem value="week">По тижнях</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Alert severity="info">Немає даних для когортного аналізу</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Когортний аналіз пацієнтів
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="chart">Графіки</ToggleButton>
              <ToggleButton value="table">Таблиця</ToggleButton>
            </ToggleButtonGroup>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Тип когорти</InputLabel>
              <Select
                value={cohortBy}
                label="Тип когорти"
                onChange={(e) => setCohortBy(e.target.value as 'month' | 'week')}
              >
                <MenuItem value="month">По місяцях</MenuItem>
                <MenuItem value="week">По тижнях</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Статистика */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h4" color="primary">
                {cohortData.summary.totalCohorts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всього когорт
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="h4" color="primary">
                {cohortData.summary.avgRetentionRate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Середній Retention Rate
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {viewMode === 'chart' ? (
          <>
            {/* Heatmap */}
            <Box sx={{ mb: 3 }}>
              <ReactECharts
                option={getHeatmapOption()}
                style={{ height: '300px' }}
                notMerge={true}
                lazyUpdate={true}
              />
            </Box>

            {/* Bar Chart */}
            <Box sx={{ mb: 3 }}>
              <ReactECharts
                option={getBarChartOption()}
                style={{ height: '400px' }}
                notMerge={true}
                lazyUpdate={true}
              />
            </Box>
          </>
        ) : (
          /* Таблиця */
          <Box sx={{ mt: 3 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Когорта</strong></TableCell>
                    <TableCell align="right"><strong>Кількість пацієнтів</strong></TableCell>
                    <TableCell align="right"><strong>Кількість декларацій</strong></TableCell>
                    <TableCell align="right"><strong>Активних</strong></TableCell>
                    <TableCell align="right"><strong>Retention Rate</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cohortData.cohorts.map((cohort, index) => {
                    const retentionRate = parseRetentionRate(cohort.retentionRate);
                    const bgColor = retentionRate >= 75 ? '#e8f5e9' : retentionRate >= 50 ? '#fff3e0' : '#ffebee';

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: bgColor,
                          '&:hover': {
                            backgroundColor: retentionRate >= 75 ? '#c8e6c9' : retentionRate >= 50 ? '#ffe0b2' : '#ffcdd2'
                          }
                        }}
                      >
                        <TableCell><strong>{cohort.cohort}</strong></TableCell>
                        <TableCell align="right">{cohort.patientCount}</TableCell>
                        <TableCell align="right">{cohort.declarationCount}</TableCell>
                        <TableCell align="right">{cohort.activeCount}</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={retentionRate >= 75 ? 'success.main' : retentionRate >= 50 ? 'warning.main' : 'error.main'}
                          >
                            {cohort.retentionRate}
                          </Typography>
                        </TableCell>
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