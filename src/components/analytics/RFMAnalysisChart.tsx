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
  Chip
} from '@mui/material';
import { AnalyticsDaoService, RFMAnalysisResponse, DoctorRFM } from '../../services/analyticsDaoService';

export const RFMAnalysisChart: React.FC = () => {
  const [rfmData, setRfmData] = useState<RFMAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'scatter' | 'pie' | 'table'>('scatter');

  useEffect(() => {
    fetchRFMData();
  }, []);

  const fetchRFMData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getRFMAnalysis();
      setRfmData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані RFM аналізу');
      console.error('Error fetching RFM data:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseRecency = (recency: string): number => {
    const match = recency.match(/(\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  const getSegmentColor = (segment: string): string => {
    const colors: Record<string, string> = {
      'Champions': '#4caf50',
      'Loyal': '#8bc34a',
      'Potential Loyalists': '#ffeb3b',
      'At Risk': '#ff9800',
      "Can't Lose Them": '#f44336',
      'Hibernating': '#9e9e9e',
      'Need Attention': '#ff5722'
    };
    return colors[segment] || '#2196f3';
  };

  const getScatterOption = () => {
    if (!rfmData || !rfmData.doctors.length) {
      return {};
    }

    const segmentGroups: Record<string, DoctorRFM[]> = {};
    rfmData.doctors.forEach(doctor => {
      if (!segmentGroups[doctor.segment]) {
        segmentGroups[doctor.segment] = [];
      }
      segmentGroups[doctor.segment].push(doctor);
    });

    const series = Object.entries(segmentGroups).map(([segment, doctors]) => ({
      name: segment,
      type: 'scatter',
      data: doctors.map(d => [d.R, d.F, d.M, d.doctorName]),
      symbolSize: function (data: any) {
        return Math.sqrt(data[2]) * 5;
      },
      itemStyle: {
        color: getSegmentColor(segment),
        opacity: 0.7
      },
      emphasis: {
        itemStyle: {
          opacity: 1
        }
      }
    }));

    return {
      title: {
        text: 'RFM Scatter Plot (R vs F, розмір = M)',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const doctorName = params.data[3];
          const R = params.data[0];
          const F = params.data[1];
          const M = params.data[2];
          return `
            <strong>${doctorName}</strong><br/>
            <strong>Сегмент:</strong> ${params.seriesName}<br/>
            <strong>R (Recency):</strong> ${R}<br/>
            <strong>F (Frequency):</strong> ${F}<br/>
            <strong>M (Monetary):</strong> ${M}
          `;
        }
      },
      legend: {
        data: Object.keys(segmentGroups),
        top: 30,
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        top: 100,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Recency (R)',
        min: 0,
        max: 6,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Frequency (F)',
        min: 0,
        max: 6,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: series
    };
  };

  const getPieOption = () => {
    if (!rfmData || !rfmData.segments) {
      return {};
    }

    const pieData = Object.entries(rfmData.segments).map(([segment, count]) => ({
      name: segment,
      value: count,
      itemStyle: {
        color: getSegmentColor(segment)
      }
    }));

    return {
      title: {
        text: 'Розподіл лікарів по сегментах',
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
          name: 'Сегменти',
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

  if (!rfmData || !rfmData.doctors.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            RFM Аналіз лікарів
          </Typography>
          <Alert severity="info">Немає даних для RFM аналізу</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            RFM Аналіз лікарів
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="scatter">Scatter Plot</ToggleButton>
            <ToggleButton value="pie">Pie Chart</ToggleButton>
            <ToggleButton value="table">Таблиця</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Загальна статистика по сегментах */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(rfmData.segments).map(([segment, count]) => (
            <Grid item xs={12} sm={6} md={3} key={segment}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 2,
                  backgroundColor: getSegmentColor(segment) + '20',
                  borderRadius: 1,
                  border: `2px solid ${getSegmentColor(segment)}`
                }}
              >
                <Typography variant="h4" sx={{ color: getSegmentColor(segment) }}>
                  {count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {segment}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {viewMode === 'scatter' && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getScatterOption()}
              style={{ height: '500px' }}
              notMerge={true}
              lazyUpdate={true}
            />
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Інтерпретація:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    • <strong>R (Recency):</strong> Як давно лікар був активний (вищий = недавно)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    • <strong>F (Frequency):</strong> Як часто лікар обробляє декларації
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    • <strong>M (Monetary):</strong> Кількість активних декларацій (розмір точки)
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {viewMode === 'pie' && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getPieOption()}
              style={{ height: '400px' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Box>
        )}

        {viewMode === 'table' && (
          <Box sx={{ mt: 3 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Ім'я лікаря</strong></TableCell>
                    <TableCell align="center"><strong>Остання активність</strong></TableCell>
                    <TableCell align="center"><strong>Частота</strong></TableCell>
                    <TableCell align="center"><strong>Монетарна</strong></TableCell>
                    <TableCell align="center"><strong>R</strong></TableCell>
                    <TableCell align="center"><strong>F</strong></TableCell>
                    <TableCell align="center"><strong>M</strong></TableCell>
                    <TableCell align="center"><strong>RFM Score</strong></TableCell>
                    <TableCell><strong>Сегмент</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rfmData.doctors.map((doctor, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <TableCell>{doctor.doctorId}</TableCell>
                      <TableCell><strong>{doctor.doctorName}</strong></TableCell>
                      <TableCell align="center">{doctor.recency}</TableCell>
                      <TableCell align="center">{doctor.frequency}</TableCell>
                      <TableCell align="center">{doctor.monetary}</TableCell>
                      <TableCell align="center">
                        <Chip label={doctor.R} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={doctor.F} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={doctor.M} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          {doctor.rfmScore}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={doctor.segment}
                          size="small"
                          sx={{
                            backgroundColor: getSegmentColor(doctor.segment),
                            color: '#fff'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Пояснення сегментів */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Опис RFM сегментів:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Champions:</strong> Найкращі лікарі, активні та продуктивні
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Loyal:</strong> Стабільно активні лікарі
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Potential Loyalists:</strong> Перспективні лікарі
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>At Risk:</strong> Раніше активні, але зараз менше працюють
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Can't Lose Them:</strong> Важливі лікарі, потребують уваги
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Hibernating:</strong> Неактивні лікарі
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Need Attention:</strong> Потребують додаткової уваги
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};