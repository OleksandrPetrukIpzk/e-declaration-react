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
import { AnalyticsDaoService, FunnelAnalysisResponse } from '../../services/analyticsDaoService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { uk } from 'date-fns/locale';
import { subDays } from 'date-fns';

export const DeclarationFunnelChart: React.FC = () => {
  const [funnelData, setFunnelData] = useState<FunnelAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'funnel' | 'table'>('funnel');
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(() => {
    fetchFunnelData();
  }, [startDate, endDate]);

  const fetchFunnelData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDateStr = startDate ? startDate.toISOString().split('T')[0] : undefined;
      const endDateStr = endDate ? endDate.toISOString().split('T')[0] : undefined;

      const data = await AnalyticsDaoService.getDeclarationFunnel(startDateStr, endDateStr);
      setFunnelData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані воронки декларацій');
      console.error('Error fetching funnel data:', err);
    } finally {
      setLoading(false);
    }
  };

  const parsePercentage = (percentage: string): number => {
    return parseFloat(percentage.replace('%', ''));
  };

  const getFunnelOption = () => {
    if (!funnelData || !funnelData.stages.length) {
      return {};
    }

    const funnelChartData = funnelData.stages.map(stage => ({
      value: stage.count,
      name: stage.stage
    }));

    return {
      title: {
        text: 'Воронка декларацій',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const stage = funnelData.stages[params.dataIndex];
          return `
            <strong>${stage.stage}</strong><br/>
            Кількість: ${stage.count}<br/>
            Конверсія: ${stage.conversion}<br/>
            Відпад: ${stage.dropOff}<br/>
          `;
        }
      },
      legend: {
        show: false
      },
      series: [
        {
          name: 'Воронка',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: funnelData.stages[0]?.count || 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: function(params: any) {
              const stage = funnelData.stages[params.dataIndex];
              return `${stage.stage}\n${stage.count} (${stage.conversion})`;
            },
            fontSize: 14,
            color: '#fff'
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 16
            }
          },
          data: funnelChartData
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

  if (!funnelData || !funnelData.stages.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Воронка декларацій
          </Typography>
          <Alert severity="info">Немає даних для воронкового аналізу</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Воронка декларацій
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
              <DatePicker
                label="Початкова дата"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="Кінцева дата"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="funnel">Воронка</ToggleButton>
              <ToggleButton value="table">Таблиця</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Загальна статистика */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h4" color="primary">
                {funnelData.totalDeclarations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всього декларацій
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="h4" color="success.main">
                {funnelData.overallConversion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Загальна конверсія
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffebee', borderRadius: 1 }}>
              <Typography variant="h6" color="error.main">
                {funnelData.bottleneck}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Вузьке місце
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {viewMode === 'funnel' ? (
          /* Funnel Chart */
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getFunnelOption()}
              style={{ height: '500px' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Box>
        ) : (
          /* Таблиця */
          <Box sx={{ mt: 3 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Етап</strong></TableCell>
                    <TableCell align="right"><strong>Кількість</strong></TableCell>
                    <TableCell align="right"><strong>Конверсія</strong></TableCell>
                    <TableCell align="right"><strong>Відпад</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {funnelData.stages.map((stage, index) => {
                    const conversion = parsePercentage(stage.conversion);
                    const dropOff = parsePercentage(stage.dropOff);
                    const isBottleneck = stage.stage === funnelData.bottleneck;

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: isBottleneck ? '#ffebee' : index % 2 === 0 ? '#fafafa' : '#fff',
                          '&:hover': {
                            backgroundColor: isBottleneck ? '#ffcdd2' : '#f5f5f5'
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <strong>{stage.stage}</strong>
                            {isBottleneck && (
                              <Chip
                                label="Вузьке місце"
                                size="small"
                                color="error"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {stage.count}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={conversion >= 75 ? 'success.main' : conversion >= 50 ? 'warning.main' : 'error.main'}
                          >
                            {stage.conversion}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={dropOff > 25 ? 'error.main' : dropOff > 10 ? 'warning.main' : 'text.secondary'}
                          >
                            {stage.dropOff}
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

        {/* Додаткова інформація */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Інформація про воронку:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Загальна конверсія показує відсоток декларацій, що пройшли весь шлях
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Вузьке місце - етап з найбільшим відпадом
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Середній час показує, скільки годин в середньому декларації проводять на етапі
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Конверсія кожного етапу розраховується відносно попереднього етапу
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};