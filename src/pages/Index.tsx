
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, TrendingUp, TrendingDown, Users, ArrowUp, ArrowDown, Calendar, Activity } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { useDataCache } from '@/hooks/useDataCache';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';

// Sample data for the charts
const leadsData = [
  { name: 'Jan', leads: 40, conversions: 12 },
  { name: 'Feb', leads: 30, conversions: 10 },
  { name: 'Mar', leads: 45, conversions: 18 },
  { name: 'Apr', leads: 55, conversions: 24 },
  { name: 'May', leads: 60, conversions: 28 },
  { name: 'Jun', leads: 48, conversions: 20 },
];

const conversionByChannelData = [
  { name: 'Email', value: 35 },
  { name: 'Social', value: 25 },
  { name: 'Referral', value: 20 },
  { name: 'Direct', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#5D2E8C', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];

const Index = () => {
  // In a real app, this would fetch data from the backend
  const { data: recentLeadsData, isLoading } = useDataCache('dashboard-leads', 
    async () => leadsData, 
    { ttl: 5 * 60 * 1000 }
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Helmet>
        <title>Vendah+ - Dashboard</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Últimos 30 dias
          </Button>
          <Button variant="accent" size="sm">
            <ArrowDown className="h-4 w-4 mr-1" /> Exportar relatório
          </Button>
        </div>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Activity className="text-vendah-neon h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-vendah-purple">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>3% queda</span>
            </div>
          </CardContent>
        </Card>

        <Card className="vendah-card group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-muted">Receita Potencial</p>
                <h2 className="text-2xl font-bold text-white mt-2">R$ 85,4K</h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-vendah-purple/20 flex items-center justify-center">
                <LineChart className="text-vendah-neon h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-vendah-neon">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>15% aumento</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Chart */}
        <Card className="vendah-card col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-white text-lg">Leads e Conversões</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={recentLeadsData || leadsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1C1C22', 
                      borderColor: '#5D2E8C', 
                      color: '#fff' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    name="Leads" 
                    stroke="#8B5CF6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 2 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    name="Conversões" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 2 }} 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Channel Distribution */}
        <Card className="vendah-card">
          <CardHeader className="pb-0">
            <CardTitle className="text-white text-lg">Conversão por Canal</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="w-full h-64 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionByChannelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {conversionByChannelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ 
                      backgroundColor: '#1C1C22', 
                      borderColor: '#5D2E8C', 
                      color: '#fff' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Chart */}
      <Card className="vendah-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-white text-lg">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={leadsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <RechartsTooltip
                  contentStyle={{ 
                    backgroundColor: '#1C1C22', 
                    borderColor: '#5D2E8C', 
                    color: '#fff' 
                  }}
                />
                <Bar dataKey="leads" name="Leads" fill="#5D2E8C" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
