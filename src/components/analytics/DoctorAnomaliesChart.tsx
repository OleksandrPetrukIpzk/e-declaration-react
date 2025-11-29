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
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { AnalyticsDaoService, DoctorAnomaliesResponse } from '../../services/analyticsDaoService';

interface DoctorAnomaliesChartProps {
  defaultLookbackDays?: string;
}

export const DoctorAnomaliesChart: React.FC<DoctorAnomaliesChartProps> = ({ defaultLookbackDays = '30' }) => {
  const [anomalyData, setAnomalyData] = useState<DoctorAnomaliesResponse | null>(null);
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
      const data = await AnalyticsDaoService.getDoctorAnomalies(lookbackDays);
      setAnomalyData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані аномалій лікарів');
      console.error('Error fetching doctor anomaly data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      high_rejection_rate: 'Високий % відхилень',
      slow_processing: 'Повільна обробка',
      low_activity: 'Низька активність'
    };
    return labels[type] || type;
  };

  const getBarChartOption = () => {
    if (!anomalyData || !anomalyData.anomalies.length) {
      return {};
    }

    const doctorNames = anomalyData.anomalies.map(a => a.doctorName);
    const values = anomalyData.anomalies.map(a => {
      const val = parseFloat(a.value);
      return isNaN(val) ? 0 : val;
    });
    const expected = anomalyData.anomalies.map(a => {
      const exp = parseFloat(a.expected);
      return isNaN(exp) ? 0 : exp;
    });

    const colors = anomalyData.anomalies.map(a =>
      a.severity === 'critical' ? '#d32f2f' : '#ff9800'
    );

    return {
      title: {
        text: 'Порівняння лікарів з аномаліями',
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
          const anomaly = anomalyData.anomalies[index];

          return `
            <strong>${anomaly.doctorName}</strong><br/>
            <strong>Тип:</strong> ${getTypeLabel(anomaly.type)}<br/>
            <strong>Серйозність:</strong> ${anomaly.severity === 'critical' ? 'Критично' : 'Попередження'}<br/>
            <strong>Значення:</strong> ${anomaly.value}<br/>
            <strong>Очікуване:</strong> ${anomaly.expected}<br/>
            <strong>Опис:</strong> ${anomaly.description}
          `;
        }
      },
      legend: {
        data: ['Фактичне значення', 'Очікуване значення'],
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
        data: doctorNames,
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Значення'
      },
      series: [
        {
          name: 'Фактичне значення',
          type: 'bar',
          data: values.map((val, index) => ({
            value: val,
            itemStyle: { color: colors[index] }
          })),
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          }
        },
        {
          name: 'Очікуване значення',
          type: 'line',
          data: expected,
          lineStyle: {
            type: 'dashed',
            color: '#4caf50',
            width: 2
          },
          itemStyle: {
            color: '#4caf50'
          },
          symbol: 'circle',
          symbolSize: 8
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
              Аномалії у лікарів
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
          <Alert severity="info">Аномалій у лікарів не виявлено за обраний період</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2">
            Аномалії у лікарів
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
                {anomalyData.stats.totalDoctors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всього лікарів
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffebee', borderRadius: 1 }}>
              <Typography variant="h4" color="error">
                {anomalyData.anomalies.filter(a => a.severity === 'critical').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Критичних аномалій
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
              <Typography variant="h4" color="warning.main">
                {anomalyData.anomalies.filter(a => a.severity === 'warning').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Попереджень
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Додаткова статистика */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Середній % відхилень: <strong>{anomalyData.stats.avgRejectionRate}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Середній час обробки: <strong>{anomalyData.stats.avgProcessingTime}</strong>
            </Typography>
          </Grid>
        </Grid>

        {/* Bar Chart */}
        <Box sx={{ mb: 3 }}>
          <ReactECharts
            option={getBarChartOption()}
            style={{ height: '400px' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </Box>

        {/* Таблиця лікарів з проблемами */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Деталі аномалій лікарів:
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Ім'я лікаря</strong></TableCell>
                  <TableCell><strong>Тип проблеми</strong></TableCell>
                  <TableCell><strong>Серйозність</strong></TableCell>
                  <TableCell><strong>Значення</strong></TableCell>
                  <TableCell><strong>Очікуване</strong></TableCell>
                  <TableCell><strong>Опис</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {anomalyData.anomalies.map((anomaly, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: anomaly.severity === 'critical' ? '#ffebee' : '#fff3e0',
                      '&:hover': {
                        backgroundColor: anomaly.severity === 'critical' ? '#ffcdd2' : '#ffe0b2'
                      }
                    }}
                  >
                    <TableCell>{anomaly.doctorId}</TableCell>
                    <TableCell>
                      <strong>{anomaly.doctorName}</strong>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(anomaly.type)}
                        size="small"
                        variant="outlined"
                        color={
                          anomaly.type === 'high_rejection_rate' ? 'error' :
                          anomaly.type === 'slow_processing' ? 'warning' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={anomaly.severity === 'critical' ? 'Критично' : 'Попередження'}
                        size="small"
                        color={anomaly.severity === 'critical' ? 'error' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <strong>{anomaly.value}</strong>
                    </TableCell>
                    <TableCell>{anomaly.expected}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {anomaly.description}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};