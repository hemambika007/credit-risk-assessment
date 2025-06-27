import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { SegmentAnalysis } from '../types/analytics';

interface SegmentChartProps {
  data: SegmentAnalysis[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const SegmentChart: React.FC<SegmentChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Customer Segments</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ segment, percentage }) => `${segment} (${((percentage || 0) * 100).toFixed(1)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="customers"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F9FAFB'
            }}
            formatter={(value) => [value, 'Customers']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};