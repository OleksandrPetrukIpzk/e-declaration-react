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
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import { AnalyticsDaoService, SentimentAnalysisResponse } from '../../services/analyticsDaoService';

interface SentimentAnalysisChartProps {
  defaultLookbackDays?: string;
}

export const SentimentAnalysisChart: React.FC<SentimentAnalysisChartProps> = ({ defaultLookbackDays = '30' }) => {
  const [sentimentData, setSentimentData] = useState<SentimentAnalysisResponse | null>(null);
  const [lookbackDays, setLookbackDays] = useState<string>(defaultLookbackDays);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'donut'>('donut');

  useEffect(() => {
    fetchSentimentData();
  }, [lookbackDays]);

  const fetchSentimentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsDaoService.getSentimentAnalysis(lookbackDays);
      setSentimentData(data);
    } catch (err) {
      setError('Не вдалося завантажити дані аналізу настрою');
      console.error('Error fetching sentiment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseScore = (score: string): number => {
    return parseFloat(score);
  };

  const getSentimentColor = (sentiment: "positive" | "neutral" | "negative"): string => {
    const colors = {
      positive: '#4caf50',
      neutral: '#ff9800',
      negative: '#f44336'
    };
    return colors[sentiment];
  };

  const getSentimentLabel = (sentiment: "positive" | "neutral" | "negative"): string => {
    const labels = {
      positive: 'Позитивний',
      neutral: 'Нейтральний',
      negative: 'Негативний'
    };
    return labels[sentiment];
  };

  const getDonutOption = () => {
    if (!sentimentData || !sentimentData.distribution) {
      return {};
    }

    const donutData = Object.entries(sentimentData.distribution).map(([category, count]) => ({
      name: category,
      value: count
    }));

    return {
      title: {
        text: 'Розподіл категорій',
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
          name: 'Категорії',
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
          data: donutData
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

  if (!sentimentData) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Аналіз настрою системи
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
          <Alert severity="info">Немає даних для аналізу настрою</Alert>
        </CardContent>
      </Card>
    );
  }

  const score = parseScore(sentimentData.score);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Аналіз настрою системи
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="donut">Donut Chart</ToggleButton>
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

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                backgroundColor: getSentimentColor(sentimentData.sentiment) + '20',
                borderRadius: 1,
                border: `2px solid ${getSentimentColor(sentimentData.sentiment)}`
              }}
            >
              <Typography variant="h4" sx={{ color: getSentimentColor(sentimentData.sentiment) }}>
                {score.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Оцінка тональності
              </Typography>
              <Chip
                label={getSentimentLabel(sentimentData.sentiment)}
                size="small"
                sx={{
                  mt: 1,
                  backgroundColor: getSentimentColor(sentimentData.sentiment),
                  color: '#fff'
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e9', borderRadius: 1, border: '2px solid #4caf50' }}>
              <Typography variant="h4" color="#4caf50">
                {sentimentData.summary.positive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Позитивних
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 1, border: '2px solid #ff9800' }}>
              <Typography variant="h4" color="#ff9800">
                {sentimentData.summary.neutral}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Нейтральних
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffebee', borderRadius: 1, border: '2px solid #f44336' }}>
              <Typography variant="h4" color="#f44336">
                {sentimentData.summary.negative}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Негативних
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {viewMode === 'donut' && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts
              option={getDonutOption()}
              style={{ height: '500px' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Box>
        )}

        {/* Distribution Details */}
        {sentimentData.distribution && Object.keys(sentimentData.distribution).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Детальний розподіл категорій:
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(sentimentData.distribution).map(([category, count], index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {category}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {count}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Information */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Інтерпретація оцінки:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Позитивний (0.3 - 1.0):</strong> Переважно позитивні події та активності
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Нейтральний (-0.3 - 0.3):</strong> Збалансовані позитивні та негативні події
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Негативний (-1.0 - -0.3):</strong> Переважно негативні події (відхилення, проблеми)
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};