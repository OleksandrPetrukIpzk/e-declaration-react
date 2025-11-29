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
import { AnalyticsDaoService, NetworkAnalysisResponse } from '../../services/analyticsDaoService';

export const NetworkAnalysisChart: React.FC = () => {
  const [networkData, setNetworkData] = useState<NetworkAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'barChart' | 'table'>('barChart');

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getNetworkAnalysis();
      setNetworkData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані аналізу мережі');
      console.error('Error fetching network data:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseCentrality = (centrality: string): number => {
    return parseFloat(centrality);
  };

  const parseAvgConnections = (avgConnections: string): number => {
    return parseFloat(avgConnections);
  };

  const getInfluenceColor = (influence: "Високий вплив" | "Середній вплив" | "Низький вплив"): string => {
    const colors = {
      'Високий вплив': '#4caf50',
      'Середній вплив': '#ff9800',
      'Низький вплив': '#f44336'
    };
    return colors[influence];
  };

  const getBarChartOption = () => {
    if (!networkData || !networkData.centrality.length) {
      return {};
    }

    const influenceGroups = {
      'Високий вплив': networkData.centrality.filter(d => d.influence === 'Високий вплив'),
      'Середній вплив': networkData.centrality.filter(d => d.influence === 'Середній вплив'),
      'Низький вплив': networkData.centrality.filter(d => d.influence === 'Низький вплив')
    };

    const sortedDoctors = [...networkData.centrality].sort((a, b) => b.connections - a.connections);
    const topDoctors = sortedDoctors.slice(0, 20);

    const doctorNames = topDoctors.map(d => d.doctorName);
    const connections = topDoctors.map(d => d.connections);
    const influences = topDoctors.map(d => d.influence);

    return {
      title: {
        text: 'Топ-20 лікарів за кількістю зв\'язків (пацієнтів)',
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
          const centralityValue = parseCentrality(doctor.centrality);
          return `
            <strong>${doctor.doctorName}</strong><br/>
            <strong>Зв'язків (пацієнтів):</strong> ${doctor.connections}<br/>
            <strong>Centrality:</strong> ${centralityValue.toFixed(3)}<br/>
            <strong>Рівень впливу:</strong> ${doctor.influence}
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
        name: 'Кількість зв\'язків'
      },
      series: [
        {
          name: 'Зв\'язки',
          type: 'bar',
          data: connections.map((conn, idx) => ({
            value: conn,
            itemStyle: {
              color: getInfluenceColor(influences[idx])
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

  if (!networkData || !networkData.centrality.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Аналіз мережі взаємодій
          </Typography>
          <Alert severity="info">Немає даних для аналізу мережі взаємодій</Alert>
        </CardContent>
      </Card>
    );
  }

  const influenceCounts = {
    'Високий вплив': networkData.centrality.filter(d => d.influence === 'Високий вплив').length,
    'Середній вплив': networkData.centrality.filter(d => d.influence === 'Середній вплив').length,
    'Низький вплив': networkData.centrality.filter(d => d.influence === 'Низький вплив').length
  };

  const avgConnections = parseAvgConnections(networkData.summary.avgConnections);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Аналіз мережі взаємодій
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="barChart">Bar Chart</ToggleButton>
            <ToggleButton value="table">Таблиця</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, border: '2px solid #2196f3' }}>
              <Typography variant="h4" color="primary">
                {networkData.summary.totalDoctors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всього лікарів
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, border: '2px solid #2196f3' }}>
              <Typography variant="h4" color="primary">
                {avgConnections.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Середня к-ть зв'язків
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e9', borderRadius: 1, border: '2px solid #4caf50' }}>
              <Typography variant="h4" sx={{ color: '#4caf50' }}>
                {influenceCounts['Високий вплив']}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Високий вплив
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 1, border: '2px solid #ff9800' }}>
              <Typography variant="h4" sx={{ color: '#ff9800' }}>
                {influenceCounts['Середній вплив']}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Середній вплив
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffebee', borderRadius: 1, border: '2px solid #f44336' }}>
              <Typography variant="h4" sx={{ color: '#f44336' }}>
                {influenceCounts['Низький вплив']}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Низький вплив
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Charts */}
        {viewMode === 'barChart' && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getBarChartOption()}
              style={{ height: '600px' }}
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
                    <TableCell align="center"><strong>Кількість зв'язків</strong></TableCell>
                    <TableCell align="center"><strong>Degree Centrality</strong></TableCell>
                    <TableCell align="center"><strong>Рівень впливу</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...networkData.centrality]
                    .sort((a, b) => b.connections - a.connections)
                    .map((doctor, index) => {
                      const centralityValue = parseCentrality(doctor.centrality);

                      return (
                        <TableRow
                          key={doctor.doctorId}
                          sx={{
                            backgroundColor: doctor.influence === 'Високий вплив' ? '#e8f5e9' :
                                            doctor.influence === 'Середній вплив' ? '#fff3e0' : '#ffebee',
                            '&:hover': {
                              backgroundColor: doctor.influence === 'Високий вплив' ? '#c8e6c9' :
                                              doctor.influence === 'Середній вплив' ? '#ffe0b2' : '#ffcdd2'
                            }
                          }}
                        >
                          <TableCell>{doctor.doctorId}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {doctor.doctorName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {doctor.connections}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {centralityValue.toFixed(3)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={doctor.influence}
                              size="small"
                              sx={{
                                backgroundColor: getInfluenceColor(doctor.influence),
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
          </Box>
        )}

        {/* Information */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Пояснення метрик:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Зв'язки:</strong> Кількість унікальних пацієнтів, з якими працює лікар
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Degree Centrality:</strong> Міра центральності лікаря в мережі (0-1)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Рівень впливу:</strong> Визначається на основі кількості зв'язків та centrality (високий, середній, низький)
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
