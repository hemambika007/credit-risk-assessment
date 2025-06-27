import React from 'react';
import { AlertTriangle, Shield, Eye, TrendingUp } from 'lucide-react';
import { Customer } from '../types/analytics';

interface FraudMonitoringProps {
  customers: Customer[];
}

export const FraudMonitoring: React.FC<FraudMonitoringProps> = ({ customers }) => {
  const highRiskCustomers = customers.filter(c => c.riskCategory === 'High').length;
  const fraudAlerts = customers.reduce((sum, c) => sum + c.fraudAlerts, 0);
  const avgFraudScore = customers.reduce((sum, c) => sum + c.fraudAlerts, 0) / customers.length;
  
  const recentAlerts = customers
    .filter(c => c.fraudAlerts > 0)
    .sort((a, b) => b.fraudAlerts - a.fraudAlerts)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Fraud Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <span className="text-sm font-medium text-red-400">Critical</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{highRiskCustomers}</p>
            <p className="text-sm text-gray-400">High Risk Customers</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Eye className="h-6 w-6 text-orange-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{fraudAlerts}</p>
            <p className="text-sm text-gray-400">Total Fraud Alerts</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{avgFraudScore.toFixed(1)}</p>
            <p className="text-sm text-gray-400">Avg Fraud Score</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-green-400">-12%</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">2.8%</p>
            <p className="text-sm text-gray-400">Fraud Rate</p>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Recent Fraud Alerts</h3>
        </div>
        <div className="p-6">
          {recentAlerts.length > 0 ? (
            <div className="space-y-4">
              {recentAlerts.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-red-500/20">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{customer.id}</p>
                      <p className="text-sm text-gray-400">Risk Score: {customer.riskScore}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-semibold">{customer.fraudAlerts} Alert{customer.fraudAlerts > 1 ? 's' : ''}</p>
                    <p className="text-sm text-gray-400">{customer.city}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-white font-medium">All Clear</p>
              <p className="text-gray-400">No recent fraud alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};