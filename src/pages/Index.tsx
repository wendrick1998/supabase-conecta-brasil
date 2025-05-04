
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, LineChart, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const data = [
  { name: 'Jan', leads: 40 },
  { name: 'Feb', leads: 30 },
  { name: 'Mar', leads: 45 },
  { name: 'Apr', leads: 55 },
  { name: 'May', leads: 60 },
  { name: 'Jun', leads: 48 },
];

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ResolveClick - Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-blue-100 border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-blue-700/70">Leads Ativos</p>
                  <h2 className="text-2xl font-bold text-blue-700 mt-2">124</h2>
                </div>
                <Users className="text-blue-700/70" />
              </div>
              <div className="flex items-center mt-4 text-sm text-blue-700/70">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>12% aumento</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-pink-100 border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-pink-700/70">Conversões</p>
                  <h2 className="text-2xl font-bold text-pink-700 mt-2">35</h2>
                </div>
                <BarChart className="text-pink-700/70" />
              </div>
              <div className="flex items-center mt-4 text-sm text-pink-700/70">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>8% aumento</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-100 border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-blue-700/70">Taxa de Conversão</p>
                  <h2 className="text-2xl font-bold text-blue-700 mt-2">28.2%</h2>
                </div>
                <LineChart className="text-blue-700/70" />
              </div>
              <div className="flex items-center mt-4 text-sm text-blue-700/70">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>3% queda</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Leads por Canal</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#1E3A8A" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Index;
