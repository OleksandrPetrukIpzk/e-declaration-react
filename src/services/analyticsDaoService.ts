import api from "../constants/axiosInterceptor";

export interface TrackEventDto {
  eventType: string;
  metadata?: any;
}

export interface UserProfileUpdateDto {
  changedFields: string[];
}

export interface DeclarationStatusChangeDto {
  declarationId: string;
  oldStatus: string;
  newStatus: string;
}

export interface ClinicEventDto {
  eventType: string;
  clinicId: number;
  metadata?: any;
}

export interface SystemOverview {
  users: {
    total: number;
    active: number;
    new?: number;
  };
  declarations: {
    total: number;
    active: number;
    pending: number;
    approved?: number;
    rejected?: number;
    allTime: {
      total: number;
      active: number;
      pending: number;
    };
  };
  clinics: {
    total: number;
    active: number;
  };
  doctors?: {
    total: number;
    active: number;
  };
}

export interface UserActivityStats {
  dailyActiveUsers: Array<{
    activeUsers: string;
    date: string;
  }>;
  loginStats: {
    totalLogins: number;
    totalUsers: number;
    uniqueUsers: number;
  };
}

export interface DeclarationWorkflowStats {
  statusStats: {
    count: string;
    status: string;
  }[];
  processingTimes: {
    avgProcessingHours: string;
    count: string;
    status: string;
  }[];
  workflowSummary: {
    completed: string;
    pending: string;
    rejected: string;
    totalDeclarations: string;
  };
}

export interface DoctorPerformanceStats {
  doctorStats: Array<{
    doctorId: number;
    doctorName: string;
    totalDeclarations: string;
    activeDeclarations: string;
    rejectedDeclarations: string;
    avgProcessingHours: string;
  }>;
}

export interface ClinicStats {
  clinicStats: {
    totalClinics: string;
    activeClinics: string;
  };
  clinicGrowth: Array<{
    date: string;
    newClinics: string;
    totalClinics: string;
  }>;
}

export interface NotificationEngagementStats {
  metrics: {
    openRate: string;
    totalRead: number;
    totalSent: number;
  };
  dailyNotifications: Array<{
    date: string;
    read: string;
    sent: string;
  }>;
}

export interface DashboardData {
  period: 'day' | 'week' | 'month' | 'quarter' | 'all';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  overview: SystemOverview;
  userActivity: UserActivityStats;
  declarationWorkflow: DeclarationWorkflowStats;
  doctorPerformance: DoctorPerformanceStats;
  clinicStats: ClinicStats;
  notificationEngagement: NotificationEngagementStats;
}

export interface MetricsSummary {
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalDeclarations: number;
    successRate: string;
    notificationOpenRate: string;
    activeClinics: number;
  };
  declarationWorkflow: DeclarationWorkflowStats;
  period: string;
  lastUpdated: string;
}

export interface Anomaly {
  date: string;
  type: "spike" | "drop" | "high_rejection_rate";
  severity: "warning" | "critical";
  metric: string;
  value: number | string;
  expected: number | string;
  deviation: string;
  zScore: string;
  description: string;
}

export interface AnomalyDetectionResponse {
  anomalies: Anomaly[];
  summary: {
    total: number;
    critical: number;
    warning: number;
  };
  stats?: {
    mean: number;
    stdDev: number;
    avgRejectionRate: string;
  };
}

export interface DoctorAnomaly {
  doctorId: number;
  doctorName: string;
  type: "high_rejection_rate" | "slow_processing" | "low_activity";
  severity: "warning" | "critical";
  value: string;
  expected: string;
  description: string;
}

export interface DoctorAnomaliesResponse {
  anomalies: DoctorAnomaly[];
  stats: {
    avgRejectionRate: string;
    avgProcessingTime: string;
    totalDoctors: number;
  };
}

export interface Cohort {
  cohort: string;
  patientCount: number;
  declarationCount: number;
  activeCount: number;
  retentionRate: string;
}

export interface CohortAnalysisResponse {
  cohorts: Cohort[];
  summary: {
    totalCohorts: number;
    avgRetentionRate: string;
  };
}

export interface FunnelStage {
  stage: string;
  count: number;
  conversion: string;
  dropOff: string;
}

export interface FunnelAnalysisResponse {
  stages: FunnelStage[];
  overallConversion: string;
  totalDeclarations: number;
  bottleneck: string;
}

export interface DoctorRFM {
  doctorId: number;
  doctorName: string;
  recency: string;
  frequency: number;
  monetary: number;
  R: number;
  F: number;
  M: number;
  rfmScore: number;
  segment: "Champions" | "Loyal" | "Potential Loyalists" | "At Risk" |
           "Can't Lose Them" | "Hibernating" | "Need Attention";
}

export interface RFMAnalysisResponse {
  doctors: DoctorRFM[];
  segments: {
    [segmentName: string]: number;
  };
}

export interface PatternData {
  day?: string;
  hour?: string;
  count: number;
  rejectionRate?: string;
}

export interface Pattern {
  pattern: string;
  data: PatternData[];
}

export interface Correlation {
  metric1: string;
  metric2: string;
  correlation: string;
  interpretation: "Сильна кореляція" | "Помірна кореляція" | "Слабка кореляція";
}

export interface PatternAnalysisResponse {
  patterns: Pattern[];
  correlations: Correlation[];
}

export interface SentimentAnalysisResponse {
  sentiment: "positive" | "neutral" | "negative";
  score: string;
  distribution: {
    [category: string]: number;
  };
  summary: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface PatientAtRisk {
  patientEmail: string;
  lastActivity: string;
  daysSinceActivity: number;
  declarationCount: number;
  rejectionRate: string;
  churnRisk: string;
  riskLevel: "low" | "medium" | "high";
}

export interface ChurnPredictionResponse {
  atRisk: PatientAtRisk[];
  summary: {
    totalPatients: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
}

export interface DoctorRecommendation {
  doctorId: number;
  doctorName: string;
  successRate: string;
  avgProcessingHours: string;
  totalDeclarations: number;
  recommendationScore: string;
  reason: string;
}

export interface DoctorRecommendationsResponse {
  recommendations: DoctorRecommendation[];
}

export interface DoctorCentrality {
  doctorId: number;
  doctorName: string;
  connections: number;
  centrality: string;
  influence: "Високий вплив" | "Середній вплив" | "Низький вплив";
}

export interface NetworkAnalysisResponse {
  centrality: DoctorCentrality[];
  summary: {
    totalDoctors: number;
    avgConnections: string;
  };
}

const trackEvent = async (dto: TrackEventDto) => {
  const response = await api.post('/analytics/track', dto);
  return response.data;
};

const trackUserProfileUpdate = async (dto: UserProfileUpdateDto) => {
  const response = await api.post('/analytics/track/user-profile-update', dto);
  return response.data;
};

const trackDeclarationStatusChange = async (dto: DeclarationStatusChangeDto) => {
  const response = await api.post('/analytics/track/declaration-status-change', dto);
  return response.data;
};

const trackClinicEvent = async (dto: ClinicEventDto) => {
  const response = await api.post('/analytics/track/clinic-event', dto);
  return response.data;
};

const getSystemOverview = async (startDate?: string, endDate?: string): Promise<SystemOverview> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/analytics/overview?${params.toString()}`);
  return response.data;
};

const getUserActivity = async (startDate?: string, endDate?: string): Promise<UserActivityStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/analytics/users/activity?${params.toString()}`);
  return response.data;
};

const getDeclarationWorkflow = async (startDate?: string, endDate?: string): Promise<DeclarationWorkflowStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/analytics/declarations/workflow?${params.toString()}`);
  return response.data;
};

const getDoctorPerformance = async (startDate?: string, endDate?: string): Promise<DoctorPerformanceStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/analytics/doctors/performance?${params.toString()}`);
  return response.data;
};

const getClinicStats = async (startDate?: string, endDate?: string): Promise<ClinicStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/analytics/clinics/stats?${params.toString()}`);
  return response.data;
};

const getNotificationEngagement = async (startDate?: string, endDate?: string): Promise<NotificationEngagementStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/analytics/notifications/engagement?${params.toString()}`);
  return response.data;
};

const getDashboardData = async (period: 'day' | 'week' | 'month' | 'quarter' | 'all' = 'month'): Promise<DashboardData> => {
  const response = await api.get(`/analytics/dashboard?period=${period}`);
  return response.data;
};

const getMetricsSummary = async (): Promise<MetricsSummary> => {
  const response = await api.get('/analytics/metrics/summary');
  return response.data;
};

const debug = async () => {
  const res = await api.get('/analytics/debug/counts ');
  console.log(res.data);
}

const getSystemAnomalies = async (lookbackDays?: string): Promise<AnomalyDetectionResponse> => {
  const params = new URLSearchParams();
  if (lookbackDays) params.append('lookbackDays', lookbackDays);

  const response = await api.get(`/analytics/anomalies/system?${params.toString()}`);
  return response.data;
};

const getDoctorAnomalies = async (lookbackDays?: string): Promise<DoctorAnomaliesResponse> => {
  const params = new URLSearchParams();
  if (lookbackDays) params.append('lookbackDays', lookbackDays);

  const response = await api.get(`/analytics/anomalies/doctors?${params.toString()}`);
  return response.data;
};

const getCohortAnalysis = async (cohortBy?: 'month' | 'week'): Promise<CohortAnalysisResponse> => {
  const params = new URLSearchParams();
  if (cohortBy) params.append('cohortBy', cohortBy);

  const response = await api.get(`/analytics/cohort/patients?${params.toString()}`);
  return response.data;
};

const getDeclarationFunnel = async (startDate?: string, endDate?: string): Promise<FunnelAnalysisResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/analytics/funnel/declarations?${params.toString()}`);
  return response.data;
};

const getRFMAnalysis = async (): Promise<RFMAnalysisResponse> => {
  const response = await api.get('/analytics/rfm/doctors');
  return response.data;
};

const getPatternAnalysis = async (lookbackDays?: string): Promise<PatternAnalysisResponse> => {
  const params = new URLSearchParams();
  if (lookbackDays) params.append('lookbackDays', lookbackDays);

  const response = await api.get(`/analytics/patterns/analysis?${params.toString()}`);
  return response.data;
};

const getSentimentAnalysis = async (lookbackDays?: string): Promise<SentimentAnalysisResponse> => {
  const params = new URLSearchParams();
  if (lookbackDays) params.append('lookbackDays', lookbackDays);

  const response = await api.get(`/analytics/sentiment/analysis?${params.toString()}`);
  return response.data;
};

const getChurnPrediction = async (): Promise<ChurnPredictionResponse> => {
  const response = await api.get('/analytics/churn/predict');
  return response.data;
};

const getRecommendationsDoctors = async (): Promise<DoctorRecommendationsResponse> => {
  const response = await api.get('/analytics/recommendations/doctors');
  return response.data;
};

const getNetworkAnalysis = async (): Promise<NetworkAnalysisResponse> => {
  const response = await api.get('/analytics/network/analysis');
  return response.data;
};

export const AnalyticsDaoService = {
  trackEvent,
  trackUserProfileUpdate,
  trackDeclarationStatusChange,
  trackClinicEvent,
  getSystemOverview,
  getUserActivity,
  getDeclarationWorkflow,
  getDoctorPerformance,
  getClinicStats,
  getNotificationEngagement,
  getDashboardData,
  getMetricsSummary,
  getSystemAnomalies,
  getDoctorAnomalies,
  getCohortAnalysis,
  getDeclarationFunnel,
  getRFMAnalysis,
  getPatternAnalysis,
  getSentimentAnalysis,
  getChurnPrediction,
  getRecommendationsDoctors,
  getNetworkAnalysis,
  debug
};