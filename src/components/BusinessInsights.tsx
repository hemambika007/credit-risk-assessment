import React from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign, Users, AlertCircle } from 'lucide-react';
import { Customer, SegmentAnalysis } from '../types/analytics';

interface BusinessInsightsProps {
  customers: Customer[];
  segments: SegmentAnalysis[];
}

export const BusinessInsights: React.FC<BusinessInsightsProps> = ({ customers, segments }) => {
  // Calculate key insights
  const totalRevenue = segments.reduce((sum, s) => sum + s.revenue, 0);
  const highValueCustomers = customers.filter(c => c.income > 500000).length;
  const averageRisk = customers.reduce((sum, c) => sum + c.riskScore, 0) / customers.length;
  const premiumSegmentGrowth = segments.find(s => s.segment === 'Premium')?.growthRate || 0;
  
  const recommendations = [
    {
      title: "Focus on Premium Segment",
      description: `Premium customers show ${premiumSegmentGrowth}% growth rate with lowest risk scores. Increase acquisition in this segment.`,
      priority: "High",
      impact: "Revenue Growth",
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      title: "Risk Management Optimization",
      description: `${customers.filter(c => c.riskCategory === 'High').length} high-risk customers need immediate attention. Implement stricter monitoring.`,
      priority: "Critical",
      impact: "Risk Reduction",
      icon: AlertCircle,
      color: "text-red-400"
    },
    {
      title: "Cross-selling Opportunities",
      description: `${highValueCustomers} customers with income >₹5L show potential for premium products. Target them for upselling.`,
      priority: "Medium",
      impact: "Revenue Growth",
      icon: Target,
      color: "text-blue-400"
    },
    {
      title: "Fraud Prevention Enhancement",
      description: `Current fraud rate at 2.8%. Implement advanced ML models to reduce it to <2% industry benchmark.`,
      priority: "High",
      impact: "Cost Reduction",
      icon: TrendingDown,
      color: "text-orange-400"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-green-400">+15.2%</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">₹{(totalRevenue / 10000000).toFixed(1)}Cr</p>
            <p className="text-sm text-blue-200">Total Portfolio Value</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/30 rounded-lg">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-sm font-medium text-green-400">+8.5%</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{highValueCustomers}</p>
            <p className="text-sm text-green-200">High-Value Customers</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/30 rounded-lg">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-green-400">-5.2%</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{averageRisk.toFixed(1)}</p>
            <p className="text-sm text-purple-200">Average Risk Score</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-sm font-medium text-green-400">+{premiumSegmentGrowth}%</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">87.3%</p>
            <p className="text-sm text-orange-200">Approval Rate</p>
          </div>
        </div>
      </div>

      {/* Business Recommendations */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Strategic Recommendations</h3>
          <p className="text-sm text-gray-400 mt-1">Data-driven insights for business growth and risk optimization</p>
        </div>
        
        <div className="p-6 space-y-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-600 rounded-lg">
                  <rec.icon className={`h-5 w-5 ${rec.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{rec.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                        {rec.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
        <div className="p-6 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Executive Summary</h3>
        </div>
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Our credit portfolio analysis reveals strong performance with <strong className="text-white">₹{(totalRevenue / 10000000).toFixed(1)} crores</strong> in 
              total portfolio value and a healthy <strong className="text-white">87.3% approval rate</strong>. The Premium customer segment 
              demonstrates exceptional growth at <strong className="text-green-400">{premiumSegmentGrowth}%</strong>, significantly outperforming other segments.
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              Risk management metrics show an average risk score of <strong className="text-white">{averageRisk.toFixed(1)}</strong>, 
              with <strong className="text-white">{((customers.filter(c => c.riskCategory === 'Low').length / customers.length) * 100).toFixed(1)}%</strong> of 
              customers classified as low-risk. However, <strong className="text-red-400">{customers.filter(c => c.riskCategory === 'High').length}</strong> high-risk 
              customers require immediate attention to prevent potential defaults.
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              Strategic focus should be placed on <strong className="text-blue-400">Premium segment expansion</strong> and 
              <strong className="text-orange-400"> fraud prevention enhancement</strong> to achieve sustainable growth while maintaining 
              risk controls. Cross-selling opportunities exist with <strong className="text-white">{highValueCustomers} high-income customers</strong> 
              showing potential for premium product adoption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};