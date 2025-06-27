import React, { useState } from 'react';
import { Upload, Database, FileText, BarChart3, Download, RefreshCw } from 'lucide-react';
import { Customer } from '../types/analytics';
import { CreditAnalyticsEngine } from '../utils/analyticsEngine';

interface DataManagementProps {
  customers: Customer[];
  onDataUpdate: (newCustomers: Customer[]) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ customers, onDataUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStats, setUploadStats] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const newCustomers: Customer[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const customer = parseCustomerFromCSV(headers, values, i);
          if (customer) {
            newCustomers.push(customer);
          }
        }
      }
      
      // Process through analytics engine
      const processedCustomers = CreditAnalyticsEngine.processNewCustomerData(newCustomers);
      
      setUploadStats({
        totalRecords: newCustomers.length,
        validRecords: processedCustomers.length,
        highRisk: processedCustomers.filter(c => c.riskCategory === 'High').length,
        avgRiskScore: processedCustomers.reduce((sum, c) => sum + c.riskScore, 0) / processedCustomers.length
      });
      
      onDataUpdate(processedCustomers);
      
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCustomerFromCSV = (headers: string[], values: string[], index: number): Customer | null => {
    try {
      const getField = (fieldName: string) => {
        const headerIndex = headers.findIndex(h => 
          h.toLowerCase().includes(fieldName.toLowerCase())
        );
        return headerIndex >= 0 ? values[headerIndex] : '';
      };

      return {
        id: getField('id') || `CUST-${String(index).padStart(4, '0')}`,
        name: getField('name') || `Customer ${index}`,
        age: parseInt(getField('age')) || 30,
        income: parseInt(getField('income')) || 300000,
        creditScore: parseInt(getField('credit')) || 650,
        accountBalance: parseInt(getField('balance')) || 50000,
        transactionCount: parseInt(getField('transactions')) || 25,
        avgTransactionAmount: parseInt(getField('avg_transaction')) || 5000,
        riskScore: 0, // Will be calculated
        riskCategory: 'Medium', // Will be determined
        segment: '', // Will be assigned
        city: getField('city') || 'Mumbai',
        state: getField('state') || 'Maharashtra',
        joinDate: getField('join_date') || new Date().toISOString().split('T')[0],
        lastTransactionDate: getField('last_transaction') || new Date().toISOString().split('T')[0],
        fraudAlerts: parseInt(getField('fraud_alerts')) || 0,
        paymentHistory: parseInt(getField('payment_history')) || 85,
        utilizationRate: parseInt(getField('utilization')) || 45,
        accountAge: parseInt(getField('account_age')) || 24
      };
    } catch (error) {
      return null;
    }
  };

  const generateSampleData = () => {
    const sampleCSV = `id,name,age,income,credit_score,balance,transactions,avg_transaction,city,state,payment_history,utilization,account_age,fraud_alerts
CUST-0001,John Doe,32,450000,720,75000,45,8500,Mumbai,Maharashtra,92,35,36,0
CUST-0002,Jane Smith,28,380000,680,42000,32,6200,Delhi,Delhi,88,42,24,1
CUST-0003,Raj Patel,45,750000,780,120000,67,12000,Bangalore,Karnataka,95,28,60,0
CUST-0004,Priya Singh,35,520000,650,68000,38,7800,Chennai,Tamil Nadu,85,55,42,2`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_customer_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCurrentData = () => {
    const headers = ['id', 'name', 'age', 'income', 'creditScore', 'riskScore', 'riskCategory', 'segment', 'city', 'fraudAlerts'];
    const csvContent = [
      headers.join(','),
      ...customers.map(customer => 
        headers.map(header => customer[header as keyof Customer]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_customer_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Data Pipeline Overview */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Data Pipeline Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
            <Upload className="h-8 w-8 text-blue-400 mb-2" />
            <h4 className="font-semibold text-white">1. Data Ingestion</h4>
            <p className="text-sm text-blue-200">CSV/Excel upload with validation</p>
          </div>
          <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
            <Database className="h-8 w-8 text-green-400 mb-2" />
            <h4 className="font-semibold text-white">2. Data Processing</h4>
            <p className="text-sm text-green-200">Cleaning, validation, enrichment</p>
          </div>
          <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
            <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
            <h4 className="font-semibold text-white">3. Analytics Engine</h4>
            <p className="text-sm text-purple-200">Risk scoring, segmentation, ML</p>
          </div>
          <div className="bg-orange-500/20 rounded-lg p-4 border border-orange-500/30">
            <FileText className="h-8 w-8 text-orange-400 mb-2" />
            <h4 className="font-semibold text-white">4. Insights Generation</h4>
            <p className="text-sm text-orange-200">Reports, recommendations, alerts</p>
          </div>
        </div>
      </div>

      {/* Data Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upload Customer Data</h3>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Upload CSV File</p>
              <p className="text-sm text-gray-400 mb-4">
                Supports customer data with fields: ID, Name, Age, Income, Credit Score, etc.
              </p>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isProcessing}
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </>
                )}
              </label>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={generateSampleData}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                Download Sample CSV
              </button>
              <button
                onClick={exportCurrentData}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                Export Current Data
              </button>
            </div>
          </div>
        </div>

        {/* Current Dataset Info */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Dataset</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-2xl font-bold text-white">{customers.length}</p>
                <p className="text-sm text-gray-400">Total Records</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-2xl font-bold text-white">
                  {(customers.reduce((sum, c) => sum + c.riskScore, 0) / customers.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-400">Avg Risk Score</p>
              </div>
            </div>

            {uploadStats && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Last Upload Results</h4>
                <div className="text-sm text-green-200 space-y-1">
                  <p>• Processed: {uploadStats.validRecords}/{uploadStats.totalRecords} records</p>
                  <p>• High Risk Customers: {uploadStats.highRisk}</p>
                  <p>• Average Risk Score: {uploadStats.avgRiskScore.toFixed(1)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Methodology */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Analytics Methodology</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-400 mb-3">Risk Scoring Algorithm</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Credit Score Impact:</span>
                <span className="text-blue-400">35%</span>
              </div>
              <div className="flex justify-between">
                <span>Payment History:</span>
                <span className="text-blue-400">35%</span>
              </div>
              <div className="flex justify-between">
                <span>Credit Utilization:</span>
                <span className="text-blue-400">15%</span>
              </div>
              <div className="flex justify-between">
                <span>Income Stability:</span>
                <span className="text-blue-400">10%</span>
              </div>
              <div className="flex justify-between">
                <span>Account Age:</span>
                <span className="text-blue-400">3%</span>
              </div>
              <div className="flex justify-between">
                <span>Fraud Indicators:</span>
                <span className="text-blue-400">2%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-400 mb-3">Segmentation Logic</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="bg-gray-700 rounded p-2">
                <span className="text-yellow-400">Premium:</span> Income &gt;₹6L + Risk &lt;40
              </div>
              <div className="bg-gray-700 rounded p-2">
                <span className="text-blue-400">Gold:</span> Income &gt;₹4L + Risk &lt;60
              </div>
              <div className="bg-gray-700 rounded p-2">
                <span className="text-green-400">Silver:</span> Income &gt;₹2.5L + Risk &lt;80
              </div>
              <div className="bg-gray-700 rounded p-2">
                <span className="text-gray-400">Basic:</span> All other customers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};