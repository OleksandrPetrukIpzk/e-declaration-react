import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
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
import { AnalyticsDaoService, DoctorRecommendationsResponse } from '../../services/analyticsDaoService';

export const DoctorRecommendationsChart: React.FC = () => {
  const [recommendationsData, setRecommendationsData] = useState<DoctorRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    fetchRecommendationsData();
  }, []);

  const fetchRecommendationsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getRecommendationsDoctors();
      setRecommendationsData(data);
    } catch (err) {
      setError('Не вдалося завантажити рекомендації лікарів');
      console.error('Error fetching recommendations data:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseSuccessRate = (rate: string): number => {
    return parseFloat(rate.replace('%', ''));
  };

  const parseAvgProcessingHours = (hours: string): number => {
    return parseFloat(hours);
  };

  const parseRecommendationScore = (score: string): number => {
    return parseFloat(score);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#8bc34a';
    if (score >= 40) return '#ff9800';
    return '#f44336';
  };

  const getBarChartOption = () => {
    if (!recommendationsData || !recommendationsData.recommendations.length) {
      return {};
    }

    const sortedDoctors = [...recommendationsData.recommendations].sort((a, b) => {
      return parseRecommendationScore(b.recommendationScore) - parseRecommendationScore(a.recommendationScore);
    });

    const topDoctors = sortedDoctors.slice(0, 15);

    const doctorNames = topDoctors.map(d => d.doctorName);
    const scores = topDoctors.map(d => parseRecommendationScore(d.recommendationScore));

    return {
      title: {
        text: 'Топ рекомендованих лікарів (за оцінкою)',
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
          const doctor = topDoctors[index];
          return `
            <strong>${doctor.doctorName}</strong><br/>
            <strong>Оцінка:</strong> ${doctor.recommendationScore}/100<br/>
            <strong>Success Rate:</strong> ${doctor.successRate}<br/>
            <strong>Середній час обробки:</strong> ${doctor.avgProcessingHours} год<br/>
            <strong>Всього декларацій:</strong> ${doctor.totalDeclarations}<br/>
            <strong>Причина:</strong> ${doctor.reason}
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
        data: doctorNames,
        axisLabel: {
          rotate: 45,
          interval: 0,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: 'Оцінка рекомендації',
        min: 0,
        max: 100
      },
      series: [
        {
          name: 'Рекомендаційна оцінка',
          type: 'bar',
          data: scores.map(score => ({
            value: score,
            itemStyle: {
              color: getScoreColor(score)
            }
          })),
          barWidth: '60%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
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

  if (!recommendationsData || !recommendationsData.recommendations.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Рекомендації лікарів
          </Typography>
          <Alert severity="info">Немає даних про рекомендовані лікарів</Alert>
        </CardContent>
      </Card>
    );
  }

  const sortedDoctors = [...recommendationsData.recommendations].sort((a, b) => {
    return parseRecommendationScore(b.recommendationScore) - parseRecommendationScore(a.recommendationScore);
  });

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Рекомендації лікарів
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

        {/* Bar Chart */}
        {viewMode === 'chart' && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getBarChartOption()}
              style={{ height: '600px' }}
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
                    <TableCell align="center"><strong>#</strong></TableCell>
                    <TableCell><strong>Ім'я лікаря</strong></TableCell>
                    <TableCell align="center"><strong>Success Rate</strong></TableCell>
                    <TableCell align="center"><strong>Середній час обробки (год)</strong></TableCell>
                    <TableCell align="center"><strong>Всього декларацій</strong></TableCell>
                    <TableCell align="center"><strong>Оцінка рекомендації</strong></TableCell>
                    <TableCell><strong>Причина рекомендації</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedDoctors.map((doctor, index) => {
                    const successRate = parseSuccessRate(doctor.successRate);
                    const avgHours = parseAvgProcessingHours(doctor.avgProcessingHours);
                    const score = parseRecommendationScore(doctor.recommendationScore);

                    return (
                      <TableRow
                        key={doctor.doctorId}
                        sx={{
                          backgroundColor: index < 3 ? '#e8f5e9' :
                                          index < 10 ? '#f5f5f5' : '#fff',
                          '&:hover': {
                            backgroundColor: index < 3 ? '#c8e6c9' :
                                            index < 10 ? '#e0e0e0' : '#f5f5f5'
                          }
                        }}
                      >
                        <TableCell align="center">
                          <Chip
                            label={index + 1}
                            size="small"
                            color={index < 3 ? 'success' : 'default'}
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {doctor.doctorName}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={successRate >= 90 ? 'success.main' :
                                   successRate >= 75 ? 'primary.main' : 'warning.main'}
                          >
                            {doctor.successRate}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            color={avgHours < 24 ? 'success.main' :
                                   avgHours < 48 ? 'primary.main' : 'warning.main'}
                          >
                            {avgHours.toFixed(1)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {doctor.totalDeclarations}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              sx={{ color: getScoreColor(score) }}
                            >
                              {score.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              / 100
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {doctor.reason}
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

        {/* Information */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Критерії рекомендації:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Оцінка рекомендації розраховується на основі наступних факторів:
          </Typography>
          <Box sx={{ mt: 1, ml: 2 }}>
            <Typography variant="body2" color="text.secondary">
              • <strong>Success Rate:</strong> Відсоток успішно оброблених декларацій (вища оцінка за вищий відсоток)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Середній час обробки:</strong> Швидкість обробки декларацій (вища оцінка за менший час)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Кількість декларацій:</strong> Досвід роботи з деклараціями (вища оцінка за більшу кількість)
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Кольорове кодування оцінки:</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
              <Chip label="80-100: Відмінно" size="small" sx={{ backgroundColor: '#4caf50', color: '#fff' }} />
              <Chip label="60-80: Добре" size="small" sx={{ backgroundColor: '#8bc34a', color: '#fff' }} />
              <Chip label="40-60: Задовільно" size="small" sx={{ backgroundColor: '#ff9800', color: '#fff' }} />
              <Chip label="0-40: Потребує покращення" size="small" sx={{ backgroundColor: '#f44336', color: '#fff' }} />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};