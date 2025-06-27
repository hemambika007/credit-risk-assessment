import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { RiskDistribution } from '../types/analytics';

interface RiskScoreChartProps {
  data: RiskDistribution[];
}

export const RiskScoreChart: React.FC<RiskScoreChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="category" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F9FAFB'
            }}
            formatter={(value, name) => {
              if (name === 'count') {
                return [typeof value === 'number' ? value.toLocaleString() : value, 'Customers'];
              } else if (name === 'revenue') {
                return [typeof value === 'number' ? `₹${(value / 100000).toFixed(1)}L` : value, 'Revenue'];
              }
              return [value, name];
            }}
          />
          <Legend />
          <Bar 
            dataKey="count" 
            fill="#3B82F6" 
            name="Customers"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="revenue" 
            fill="#10B981" 
            name="Revenue"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};