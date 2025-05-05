
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, LineChart, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SupabaseSetupGuide from '@/components/SupabaseSetupGuide';

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
        <title>Vendah+ - Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Supabase Setup Guide */}
        <SupabaseSetupGuide />
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="vendah-card group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-text-muted">Leads Ativos</p>
                  <h2 className="text-2xl font-bold text-white mt-2">124</h2>
                </div>
                <div className="h-10 w-10 rounded-full bg-vendah-purple/20 flex items-center justify-center">
                  <Users className="text-vendah-neon h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-vendah-neon">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>12% aumento</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="vendah-card group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-text-muted">Conversões</p>
                  <h2 className="text-2xl font-bold text-white mt-2">35</h2>
                </div>
                <div className="h-10 w-10 rounded-full bg-vendah-purple/20 flex items-center justify-center">
                  <BarChart className="text-vendah-neon h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-vendah-neon">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>8% aumento</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="vendah-card group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-text-muted">Taxa de Conversão</p>
                  <h2 className="text-2xl font-bold text-white mt-2">28.2%</h2>
                </div>
                <div className="h-10 w-10 rounded-full bg-vendah-purple/20 flex items-center justify-center">
                  <LineChart className="text-vendah-neon h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-vendah-purple">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>3% queda</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart */}
        <Card className="vendah-card">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4 text-white">Leads por Canal</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#1C1C22', borderColor: '#5D2E8C', color: '#fff' }} />
                  <Bar dataKey="leads" fill="#5D2E8C" />
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
