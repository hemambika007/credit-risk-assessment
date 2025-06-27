import { Customer, Transaction, BusinessMetrics, RiskDistribution, SegmentAnalysis } from '../types/analytics';
import { CreditAnalyticsEngine } from '../utils/analyticsEngine';

// Generate mock customer data with realistic analytics
export const generateCustomers = (): Customer[] => {
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Gujarat'];
  
  return Array.from({ length: 500 }, (_, i) => {
    // Generate realistic customer attributes with correlations
    const age = Math.floor(Math.random() * 40) + 25;
    const income = generateRealisticIncome(age);
    const creditScore = generateCreditScore(income, age);
    const accountBalance = Math.floor(income * (0.1 + Math.random() * 0.4));
    const accountAge = Math.floor(Math.random() * 60) + 6;
    const transactionCount = Math.floor((accountAge / 12) * (10 + Math.random() * 20));
    const avgTransactionAmount = Math.floor(income * (0.01 + Math.random() * 0.05));
    const paymentHistory = generatePaymentHistory(creditScore);
    const utilizationRate = generateUtilizationRate(creditScore, income);
    const fraudAlerts = generateFraudAlerts(creditScore, utilizationRate);
    
    // Create base customer object
    const baseCustomer: Customer = {
      id: `CUST-${String(i + 1).padStart(4, '0')}`,
      name: `Customer ${i + 1}`,
      age,
      income,
      creditScore,
      accountBalance,
      transactionCount,
      avgTransactionAmount,
      riskScore: 0, // Will be calculated
      riskCategory: 'Low', // Will be determined
      segment: '', // Will be assigned
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      joinDate: generateJoinDate(accountAge),
      lastTransactionDate: generateLastTransactionDate(),
      fraudAlerts,
      paymentHistory,
      utilizationRate,
      accountAge
    };
    
    // Calculate risk score using analytics engine
    baseCustomer.riskScore = CreditAnalyticsEngine.calculateRiskScore(baseCustomer);
    baseCustomer.riskCategory = baseCustomer.riskScore < 30 ? 'Low' : 
                               baseCustomer.riskScore < 70 ? 'Medium' : 'High';
    
    return baseCustomer;
  });
};

// Generate realistic income based on age (career progression)
const generateRealisticIncome = (age: number): number => {
  const baseIncome = 200000;
  const experienceMultiplier = Math.min(2.5, 1 + (age - 25) * 0.08);
  const randomFactor = 0.7 + Math.random() * 0.6; // ±30% variation
  return Math.floor(baseIncome * experienceMultiplier * randomFactor);
};

// Generate credit score correlated with income and age
const generateCreditScore = (income: number, age: number): number => {
  let baseScore = 600;
  
  // Income impact
  if (income > 500000) baseScore += 100;
  else if (income > 300000) baseScore += 50;
  
  // Age/experience impact
  if (age > 35) baseScore += 50;
  else if (age > 30) baseScore += 25;
  
  // Add randomness
  const randomVariation = (Math.random() - 0.5) * 100;
  
  return Math.max(400, Math.min(850, Math.floor(baseScore + randomVariation)));
};

// Generate payment history correlated with credit score
const generatePaymentHistory = (creditScore: number): number => {
  const baseHistory = Math.floor((creditScore - 400) / 450 * 40) + 60;
  const randomVariation = (Math.random() - 0.5) * 20;
  return Math.max(60, Math.min(100, Math.floor(baseHistory + randomVariation)));
};

// Generate utilization rate inversely correlated with credit score
const generateUtilizationRate = (creditScore: number, income: number): number => {
  let baseUtilization = 90 - Math.floor((creditScore - 400) / 450 * 60);
  
  // High income people tend to have lower utilization
  if (income > 600000) baseUtilization -= 20;
  else if (income > 400000) baseUtilization -= 10;
  
  const randomVariation = (Math.random() - 0.5) * 30;
  return Math.max(5, Math.min(95, Math.floor(baseUtilization + randomVariation)));
};

// Generate fraud alerts based on risk factors
const generateFraudAlerts = (creditScore: number, utilizationRate: number): number => {
  let fraudProbability = 0.05; // Base 5% chance
  
  if (creditScore < 500) fraudProbability += 0.1;
  if (utilizationRate > 80) fraudProbability += 0.05;
  
  return Math.random() < fraudProbability ? Math.floor(Math.random() * 3) + 1 : 0;
};

// Generate realistic join dates
const generateJoinDate = (accountAge: number): string => {
  const now = new Date();
  const joinDate = new Date(now.getTime() - accountAge * 30 * 24 * 60 * 60 * 1000);
  return joinDate.toISOString().split('T')[0];
};

// Generate recent transaction dates
const generateLastTransactionDate = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const lastTransaction = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return lastTransaction.toISOString().split('T')[0];
};

// Calculate business metrics from generated data
export const calculateBusinessMetrics = (customers: Customer[]): BusinessMetrics => {
  const totalRevenue = customers.reduce((sum, c) => sum + (c.income * 0.15), 0);
  const averageRiskScore = customers.reduce((sum, c) => sum + c.riskScore, 0) / customers.length;
  const fraudRate = (customers.filter(c => c.fraudAlerts > 0).length / customers.length) * 100;
  const highRiskCustomers = customers.filter(c => c.riskCategory === 'High').length;
  const defaultRate = (highRiskCustomers / customers.length) * 100 * 0.6; // Assumption: 60% of high-risk default
  
  return {
    totalCustomers: customers.length,
    totalRevenue,
    averageRiskScore: Math.round(averageRiskScore * 10) / 10,
    fraudRate: Math.round(fraudRate * 10) / 10,
    approvalRate: 87.3,
    portfolioGrowth: 15.2,
    averageCreditUtilization: customers.reduce((sum, c) => sum + c.utilizationRate, 0) / customers.length,
    defaultRate: Math.round(defaultRate * 10) / 10
  };
};

// Generate customers and calculate metrics
const customers = generateCustomers();
export const businessMetrics = calculateBusinessMetrics(customers);

// Perform segment analysis using analytics engine
export const segmentAnalysis = CreditAnalyticsEngine.performSegmentAnalysis(customers);

// Calculate risk distribution
export const riskDistribution: RiskDistribution[] = [
  {
    category: 'Low Risk',
    count: customers.filter(c => c.riskCategory === 'Low').length,
    percentage: customers.filter(c => c.riskCategory === 'Low').length / customers.length,
    revenue: customers.filter(c => c.riskCategory === 'Low').reduce((sum, c) => sum + (c.income * 0.15), 0)
  },
  {
    category: 'Medium Risk',
    count: customers.filter(c => c.riskCategory === 'Medium').length,
    percentage: customers.filter(c => c.riskCategory === 'Medium').length / customers.length,
    revenue: customers.filter(c => c.riskCategory === 'Medium').reduce((sum, c) => sum + (c.income * 0.15), 0)
  },
  {
    category: 'High Risk',
    count: customers.filter(c => c.riskCategory === 'High').length,
    percentage: customers.filter(c => c.riskCategory === 'High').length / customers.length,
    revenue: customers.filter(c => c.riskCategory === 'High').reduce((sum, c) => sum + (c.income * 0.15), 0)
  }
];

// Assign segments to customers based on analytics
customers.forEach(customer => {
  const segment = segmentAnalysis.find(s => {
    if (s.segment === 'Premium') return customer.income > 600000 && customer.riskScore < 40;
    if (s.segment === 'Gold') return customer.income > 400000 && customer.riskScore < 60;
    if (s.segment === 'Silver') return customer.income > 250000 && customer.riskScore < 80;
    return true;
  });
  customer.segment = segment?.segment || 'Basic';
});

// Export the enhanced customers array
export { customers };