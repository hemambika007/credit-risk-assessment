export interface Customer {
  id: string;
  name: string;
  age: number;
  income: number;
  creditScore: number;
  accountBalance: number;
  transactionCount: number;
  avgTransactionAmount: number;
  riskScore: number;
  riskCategory: 'Low' | 'Medium' | 'High';
  segment: string;
  city: string;
  state: string;
  joinDate: string;
  lastTransactionDate: string;
  fraudAlerts: number;
  paymentHistory: number; // percentage
  utilizationRate: number; // percentage
  accountAge: number; // months
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  timestamp: string;
  fraudScore: number;
  isApproved: boolean;
}

export interface BusinessMetrics {
  totalCustomers: number;
  totalRevenue: number;
  averageRiskScore: number;
  fraudRate: number;
  approvalRate: number;
  portfolioGrowth: number;
  averageCreditUtilization: number;
  defaultRate: number;
}

export interface RiskDistribution {
  category: string;
  count: number;
  percentage: number;
  revenue: number;
}

export interface SegmentAnalysis {
  segment: string;
  customers: number;
  avgIncome: number;
  avgRiskScore: number;
  revenue: number;
  growthRate: number;
  percentage?: number;
}

// New interfaces for advanced analytics
export interface RiskFactors {
  creditScore: number;
  income: number;
  paymentHistory: number;
  utilizationRate: number;
  accountAge: number;
  fraudAlerts: number;
  transactionPattern: number;
  avgTransactionAmount: number;
}

export interface AnalyticsResult {
  totalCustomers: number;
  highRiskCount: number;
  fraudSuspects: number;
  premiumOpportunities: number;
  averageRiskScore: number;
  portfolioValue: number;
  recommendations: Recommendation[];
  riskDistribution: RiskDistribution[];
  monthlyTrends: MonthlyTrend[];
}

export interface Recommendation {
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

export interface MonthlyTrend {
  month: string;
  newCustomers: number;
  totalRevenue: number;
  avgRiskScore: number;
}