
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity, BarChartBig, LineChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PulsePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Pulse | Vendah+</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pulse</h1>
              <p className="text-muted-foreground mt-1">
                Acompanhe as métricas do seu negócio em tempo real
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="7d">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total de Leads</CardDescription>
                <CardTitle className="text-3xl">128</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Badge variant="success" className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Taxa de Conversão</CardDescription>
                <CardTitle className="text-3xl">24.3%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Badge variant="success" className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.1%
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Tempo Médio de Resposta</CardDescription>
                <CardTitle className="text-3xl">4.2h</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Badge variant="warning" className="flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    -5%
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Automações Ativas</CardDescription>
                <CardTitle className="text-3xl">7</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Badge variant="info" className="flex items-center">
                    <BarChartBig className="h-3 w-3 mr-1" />
                    +2
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main chart area */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Visão Geral de Desempenho</CardTitle>
              <CardDescription>Tendência de conversões e leads ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <LineChart className="h-16 w-16 mx-auto text-vendah-neon" />
                <p className="text-muted-foreground">O módulo Pulse está em desenvolvimento.</p>
                <p className="text-sm text-muted-foreground">
                  Em breve você terá acesso a gráficos detalhados e insights analíticos 
                  para acompanhar o desempenho do seu negócio.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PulsePage;
