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
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import { AnalyticsDaoService, PatternAnalysisResponse } from '../../services/analyticsDaoService';

interface PatternAnalysisChartProps {
  defaultLookbackDays?: string;
}

export const PatternAnalysisChart: React.FC<PatternAnalysisChartProps> = ({ defaultLookbackDays = '30' }) => {
  const [patternData, setPatternData] = useState<PatternAnalysisResponse | null>(null);
  const [lookbackDays, setLookbackDays] = useState<string>(defaultLookbackDays);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'dayChart' | 'hourChart' | 'table'>('dayChart');

  useEffect(() => {
    fetchPatternData();
  }, [lookbackDays]);

  const fetchPatternData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getPatternAnalysis(lookbackDays);
      setPatternData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані аналізу патернів');
      console.error('Error fetching pattern data:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseRejectionRate = (rate?: string): number => {
    if (!rate) return 0;
    return parseFloat(rate.replace('%', ''));
  };

  const parseCorrelation = (correlation: string): number => {
    return parseFloat(correlation);
  };

  const getCorrelationColor = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return '#4caf50';
    if (abs >= 0.4) return '#ff9800';
    return '#f44336';
  };

  const getDayBarChartOption = () => {
    if (!patternData || !patternData.patterns.length) {
      return {};
    }

    const dayPattern = patternData.patterns.find(p =>
      p.pattern === "Активність по днях тижня"
    );

    if (!dayPattern || !dayPattern.data.length) {
      return {};
    }

    const days = dayPattern.data.map(d => d.day || '');
    const counts = dayPattern.data.map(d => d.count);
    const rejectionRates = dayPattern.data.map(d => parseRejectionRate(d.rejectionRate));

    return {
      title: {
        text: 'Активність по днях тижня',
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
        }
      },
      legend: {
        data: ['Кількість', 'Rejection Rate (%)'],
        top: 40
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 100,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: days,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Кількість',
          position: 'left'
        },
        {
          type: 'value',
          name: 'Rejection Rate (%)',
          position: 'right',
          min: 0,
          max: 100
        }
      ],
      series: [
        {
          name: 'Кількість',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#2196f3'
          },
          barWidth: '50%'
        },
        {
          name: 'Rejection Rate (%)',
          type: 'line',
          yAxisIndex: 1,
          data: rejectionRates,
          itemStyle: {
            color: '#f44336'
          },
          lineStyle: {
            width: 2
          },
          symbol: 'circle',
          symbolSize: 8
        }
      ]
    };
  };

  const getHourLineChartOption = () => {
    if (!patternData || !patternData.patterns.length) {
      return {};
    }

    const hourPattern = patternData.patterns.find(p =>
      p.pattern === "Активність по годинах"
    );

    if (!hourPattern || !hourPattern.data.length) {
      return {};
    }

    const hours = hourPattern.data.map(d => `${d.hour}:00`);
    const counts = hourPattern.data.map(d => d.count);

    return {
      title: {
        text: 'Активність по годинах',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const hour = params[0].axisValue;
          const count = params[0].data;
          return `
            <strong>Година:</strong> ${hour}<br/>
            <strong>Кількість:</strong> ${count}
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 80,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        axisLabel: {
          rotate: 45,
          interval: 1
        }
      },
      yAxis: {
        type: 'value',
        name: 'Кількість'
      },
      series: [
        {
          name: 'Активність',
          type: 'line',
          data: counts,
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(33, 150, 243, 0.5)' },
                { offset: 1, color: 'rgba(33, 150, 243, 0.1)' }
              ]
            }
          },
          itemStyle: {
            color: '#2196f3'
          },
          lineStyle: {
            width: 3
          },
          symbol: 'circle',
          symbolSize: 6
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

  if (!patternData || !patternData.patterns.length) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Аналіз патернів активності
            </Typography>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Період</InputLabel>
              <Select
                value={lookbackDays}
                label="Період"
                onChange={(e) => setLookbackDays(e.target.value)}
              >
                <MenuItem value="7">7 днів</MenuItem>
                <MenuItem value="14">14 днів</MenuItem>
                <MenuItem value="30">30 днів</MenuItem>
                <MenuItem value="60">60 днів</MenuItem>
                <MenuItem value="90">90 днів</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Alert severity="info">Немає даних для аналізу патернів</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Аналіз патернів активності
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="dayChart">По днях</ToggleButton>
              <ToggleButton value="hourChart">По годинах</ToggleButton>
              <ToggleButton value="table">Таблиця</ToggleButton>
            </ToggleButtonGroup>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Період</InputLabel>
              <Select
                value={lookbackDays}
                label="Період"
                onChange={(e) => setLookbackDays(e.target.value)}
                size="small"
              >
                <MenuItem value="7">7 днів</MenuItem>
                <MenuItem value="14">14 днів</MenuItem>
                <MenuItem value="30">30 днів</MenuItem>
                <MenuItem value="60">60 днів</MenuItem>
                <MenuItem value="90">90 днів</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Кореляції */}
        {patternData.correlations && patternData.correlations.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {patternData.correlations.map((corr, index) => {
              const corrValue = parseCorrelation(corr.correlation);
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      border: `2px solid ${getCorrelationColor(corrValue)}`
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {corr.metric1} ↔ {corr.metric2}
                    </Typography>
                    <Typography variant="h5" sx={{ color: getCorrelationColor(corrValue), mb: 1 }}>
                      {corrValue.toFixed(3)}
                    </Typography>
                    <Chip
                      label={corr.interpretation}
                      size="small"
                      sx={{
                        backgroundColor: getCorrelationColor(corrValue),
                        color: '#fff'
                      }}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}

        {viewMode === 'dayChart' && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getDayBarChartOption()}
              style={{ height: '500px' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Box>
        )}

        {viewMode === 'hourChart' && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getHourLineChartOption()}
              style={{ height: '500px' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Box>
        )}

        {viewMode === 'table' && (
          <Box sx={{ mt: 3 }}>
            {patternData.patterns.map((pattern, patternIndex) => (
              <Box key={patternIndex} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  {pattern.pattern}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        {pattern.data[0]?.day && <TableCell><strong>День</strong></TableCell>}
                        {pattern.data[0]?.hour && <TableCell><strong>Година</strong></TableCell>}
                        <TableCell align="right"><strong>Кількість</strong></TableCell>
                        {pattern.data[0]?.rejectionRate && (
                          <TableCell align="right"><strong>Rejection Rate</strong></TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pattern.data.map((item, itemIndex) => (
                        <TableRow
                          key={itemIndex}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            }
                          }}
                        >
                          {item.day && <TableCell>{item.day}</TableCell>}
                          {item.hour && <TableCell>{item.hour}:00</TableCell>}
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {item.count}
                            </Typography>
                          </TableCell>
                          {item.rejectionRate && (
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color={parseRejectionRate(item.rejectionRate) > 30 ? 'error.main' : 'text.secondary'}
                              >
                                {item.rejectionRate}
                              </Typography>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </Box>
        )}

        {/* Інформація */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Інтерпретація кореляцій:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>|r| ≥ 0.7:</strong> Сильна кореляція (зелений)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>0.4 ≤ |r| &lt; 0.7:</strong> Помірна кореляція (помаранчевий)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>|r| &lt; 0.4:</strong> Слабка кореляція (червоний)
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};