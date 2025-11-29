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
  Chip,
  Stack,
  Grid
} from '@mui/material';
import { AnalyticsDaoService, AnomalyDetectionResponse } from '../../services/analyticsDaoService';

interface AnomaliesChartProps {
  defaultLookbackDays?: string;
}

export const AnomaliesChart: React.FC<AnomaliesChartProps> = ({ defaultLookbackDays = '30' }) => {
  const [anomalyData, setAnomalyData] = useState<AnomalyDetectionResponse | null>(null);
  const [lookbackDays, setLookbackDays] = useState<string>(defaultLookbackDays);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnomalyData();
  }, [lookbackDays]);

  const fetchAnomalyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getSystemAnomalies(lookbackDays);
      setAnomalyData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані аномалій');
      console.error('Error fetching anomaly data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChartOption = () => {
    if (!anomalyData || !anomalyData.anomalies.length) {
      return {};
    }

    const sortedAnomalies = [...anomalyData.anomalies].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dates = sortedAnomalies.map(a => a.date);
    const values = sortedAnomalies.map(a => {
      const value = typeof a.value === 'string' ? parseFloat(a.value) : a.value;
      return isNaN(value) ? 0 : value;
    });
    const expected = sortedAnomalies.map(a => {
      const exp = typeof a.expected === 'string' ? parseFloat(a.expected) : a.expected;
      return isNaN(exp) ? 0 : exp;
    });

    const criticalMarkers = sortedAnomalies
      .map((a, index) => a.severity === 'critical' ? {
        xAxis: dates[index],
        yAxis: values[index],
        value: a.description,
        symbol: 'pin',
        symbolSize: 50,
        itemStyle: { color: '#d32f2f' }
      } : null)
      .filter(m => m !== null);

    const warningMarkers = sortedAnomalies
      .map((a, index) => a.severity === 'warning' ? {
        xAxis: dates[index],
        yAxis: values[index],
        value: a.description,
        symbol: 'pin',
        symbolSize: 40,
        itemStyle: { color: '#ff9800' }
      } : null)
      .filter(m => m !== null);

    return {
      title: {
        text: 'Виявлення аномалій в системі',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params: any) {
          const date = params[0].axisValue;
          const anomaly = sortedAnomalies.find(a => a.date === date);

          if (!anomaly) return '';

          return `
            <strong>Дата:</strong> ${date}<br/>
            <strong>Тип:</strong> ${anomaly.type}<br/>
            <strong>Метрика:</strong> ${anomaly.metric}<br/>
            <strong>Значення:</strong> ${anomaly.value}<br/>
            <strong>Очікуване:</strong> ${anomaly.expected}<br/>
            <strong>Відхилення:</strong> ${anomaly.deviation}<br/>
            <strong>Z-оцінка:</strong> ${anomaly.zScore}<br/>
            <strong>Опис:</strong> ${anomaly.description}
          `;
        }
      },
      legend: {
        data: ['Фактичне значення', 'Очікуване значення', 'Критичні аномалії', 'Попередження'],
        top: 30
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
        data: dates,
        boundaryGap: false,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'Значення'
      },
      series: [
        {
          name: 'Фактичне значення',
          type: 'line',
          data: values,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#1976d2'
          },
          itemStyle: {
            color: '#1976d2'
          },
          areaStyle: {
            color: 'rgba(25, 118, 210, 0.1)'
          }
        },
        {
          name: 'Очікуване значення',
          type: 'line',
          data: expected,
          smooth: true,
          lineStyle: {
            width: 2,
            type: 'dashed',
            color: '#4caf50'
          },
          itemStyle: {
            color: '#4caf50'
          }
        },
        {
          name: 'Критичні аномалії',
          type: 'scatter',
          data: criticalMarkers,
          symbolSize: 15,
          itemStyle: {
            color: '#d32f2f'
          }
        },
        {
          name: 'Попередження',
          type: 'scatter',
          data: warningMarkers,
          symbolSize: 12,
          itemStyle: {
            color: '#ff9800'
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

  if (!anomalyData || !anomalyData.anomalies.length) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Виявлення аномалій
            </Typography>
            <FormControl sx={{ minWidth: 120 }}>
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
          <Alert severity="info">Аномалій не виявлено за обраний період</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2">
            Виявлення аномалій
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
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

        {/* Статистика */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h4" color="primary">
                {anomalyData.summary.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всього аномалій
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffebee', borderRadius: 1 }}>
              <Typography variant="h4" color="error">
                {anomalyData.summary.critical}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Критичних
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
              <Typography variant="h4" color="warning.main">
                {anomalyData.summary.warning}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Попереджень
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Додаткова статистика */}
        {anomalyData.stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Середнє значення: <strong>{anomalyData.stats.mean.toFixed(2)}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Стандартне відхилення: <strong>{anomalyData.stats.stdDev.toFixed(2)}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Середній % відхилень: <strong>{anomalyData.stats.avgRejectionRate}</strong>
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* Графік */}
        <ReactECharts
          option={getChartOption()}
          style={{ height: '400px' }}
          notMerge={true}
          lazyUpdate={true}
        />

        {/* Список аномалій */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Деталі аномалій:
          </Typography>
          <Stack spacing={1}>
            {anomalyData.anomalies.map((anomaly, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: anomaly.severity === 'critical' ? 'error.main' : 'warning.main',
                  borderRadius: 1,
                  backgroundColor: anomaly.severity === 'critical' ? '#ffebee' : '#fff3e0'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">
                    {new Date(anomaly.date).toLocaleDateString('uk-UA')}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={anomaly.severity === 'critical' ? 'Критично' : 'Попередження'}
                      color={anomaly.severity === 'critical' ? 'error' : 'warning'}
                      size="small"
                    />
                    <Chip
                      label={anomaly.type}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {anomaly.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Метрика: <strong>{anomaly.metric}</strong> |
                  Значення: <strong>{anomaly.value}</strong> |
                  Очікуване: <strong>{anomaly.expected}</strong> |
                  Відхилення: <strong>{anomaly.deviation}</strong>
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};