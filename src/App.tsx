import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  Shield, 
  TrendingUp, 
  CreditCard,
  AlertTriangle,
  DollarSign,
  Activity,
  Database
} from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { RiskScoreChart } from './components/RiskScoreChart';
import { SegmentChart } from './components/SegmentChart';
import { CustomerTable } from './components/CustomerTable';
import { FraudMonitoring } from './components/FraudMonitoring';
import { BusinessInsights } from './components/BusinessInsights';
import { DataManagement } from './components/DataManagement';
import { generateCustomers, businessMetrics, riskDistribution, segmentAnalysis } from './data/mockData';
import { Customer } from './types/analytics';
import { CreditAnalyticsEngine } from './utils/analyticsEngine';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [customers, setCustomers] = useState<Customer[]>(() => generateCustomers());
  
  // Recalculate metrics when customer data changes
  const currentMetrics = useMemo(() => {
    return {
      totalCustomers: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + (c.income * 0.15), 0),
      averageRiskScore: Math.round((customers.reduce((sum, c) => sum + c.riskScore, 0) / customers.length) * 10) / 10,
      fraudRate: Math.round((customers.filter(c => c.fraudAlerts > 0).length / customers.length) * 100 * 10) / 10,
      approvalRate: 87.3,
      portfolioGrowth: 15.2,
      defaultRate: Math.round((customers.filter(c => c.riskCategory === 'High').length / customers.length) * 100 * 0.6 * 10) / 10
    };
  }, [customers]);

  const currentRiskDistribution = useMemo(() => [
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
  ], [customers]);

  const currentSegmentAnalysis = useMemo(() => {
    return CreditAnalyticsEngine.performSegmentAnalysis(customers);
  }, [customers]);

  const handleDataUpdate = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'fraud', label: 'Fraud Monitor', icon: Shield },
    { id: 'insights', label: 'Business Insights', icon: TrendingUp },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Customers"
                value={currentMetrics.totalCustomers.toLocaleString()}
                change="+12.5%"
                changeType="positive"
                icon={Users}
                description="Active customer base"
              />
              <MetricCard
                title="Portfolio Value"
                value={`₹${(currentMetrics.totalRevenue / 10000000).toFixed(1)}Cr`}
                change="+15.2%"
                changeType="positive"
                icon={DollarSign}
                description="Total credit portfolio"
              />
              <MetricCard
                title="Average Risk Score"
                value={currentMetrics.averageRiskScore}
                change="-3.8%"
                changeType="positive"
                icon={Activity}
                description="Lower is better"
              />
              <MetricCard
                title="Fraud Rate"
                value={`${currentMetrics.fraudRate}%`}
                change="-0.4%"
                changeType="positive"
                icon={AlertTriangle}
                description="Monthly fraud incidents"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskScoreChart data={currentRiskDistribution} />
              <SegmentChart data={currentSegmentAnalysis} />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Approval Rate"
                value={`${currentMetrics.approvalRate}%`}
                change="+2.1%"
                changeType="positive"
                icon={CreditCard}
                description="Credit approval success rate"
              />
              <MetricCard
                title="Portfolio Growth"
                value={`${currentMetrics.portfolioGrowth}%`}
                change="+1.8%"
                changeType="positive"
                icon={TrendingUp}
                description="Year-over-year growth"
              />
              <MetricCard
                title="Default Rate"
                value={`${currentMetrics.defaultRate}%`}
                change="-0.6%"
                changeType="positive"
                icon={Shield}
                description="Customer default percentage"
              />
            </div>
          </div>
        );
      
      case 'customers':
        return <CustomerTable customers={customers} />;
      
      case 'fraud':
        return <FraudMonitoring customers={customers} />;
      
      case 'insights':
        return <BusinessInsights customers={customers} segments={currentSegmentAnalysis} />;
      
      case 'data':
        return <DataManagement customers={customers} onDataUpdate={handleDataUpdate} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Credit Risk Analytics</h1>
                <p className="text-sm text-gray-400">Advanced Credit Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white font-medium">Analytics Dashboard</p>
                <p className="text-xs text-gray-400">Real-time Credit Intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Credit Risk Analytics Platform. Advanced Data Analytics Solution.
            </div>
            <div className="text-gray-400 text-sm mt-2 md:mt-0">
              Last updated: {new Date().toLocaleDateString()} | Data refreshed every 15 minutes
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;