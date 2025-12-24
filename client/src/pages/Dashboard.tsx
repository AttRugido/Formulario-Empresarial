import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Users, TrendingUp, CalendarDays, Percent, Search, Filter, ArrowRight, BarChart3 } from "lucide-react";
import type { FormSubmission } from "@shared/schema";
import { useState } from "react";

interface FunnelData {
  step: number;
  count: number;
}

const stepLabels: Record<number, string> = {
  1: "Cargo/Função",
  2: "Gargalo",
  3: "Faturamento",
  4: "Tamanho Equipe",
  5: "Segmento",
  6: "Urgência",
  7: "Sócio",
  8: "Redes Sociais",
  9: "Dados de Contato"
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: submissions = [], isLoading: loadingSubmissions } = useQuery<FormSubmission[]>({
    queryKey: ["/api/submissions"]
  });

  const { data: funnelData = [], isLoading: loadingFunnel } = useQuery<FunnelData[]>({
    queryKey: ["/api/analytics/funnel"]
  });

  const handleExportCSV = () => {
    window.open("/api/submissions/export", "_blank");
  };

  const todaySubmissions = submissions.filter(s => {
    if (!s.createdAt) return false;
    const today = new Date();
    const subDate = new Date(s.createdAt);
    return subDate.toDateString() === today.toDateString();
  }).length;

  const completionRate = (() => {
    const step1 = funnelData.find(f => f.step === 1)?.count || 0;
    const step9 = funnelData.find(f => f.step === 9)?.count || 0;
    if (step1 === 0) return 0;
    return Math.round((step9 / step1) * 100);
  })();

  const totalVisitors = funnelData.find(f => f.step === 1)?.count || 0;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (sub.name?.toLowerCase().includes(term)) ||
      (sub.email?.toLowerCase().includes(term)) ||
      (sub.phone?.includes(term))
    );
  });

  const stepBreakdown = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => ({
    step,
    label: stepLabels[step],
    count: funnelData.find(f => f.step === step)?.count || 0
  }));

  const maxStepCount = Math.max(...stepBreakdown.map(s => s.count), 1);

  const generateChartPath = () => {
    if (stepBreakdown.every(s => s.count === 0)) return "";
    
    const width = 400;
    const height = 150;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = stepBreakdown.map((item, index) => {
      const x = padding + (index / 8) * chartWidth;
      const y = height - padding - (item.count / maxStepCount) * chartHeight;
      return { x, y, count: item.count };
    });
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpx2 = prev.x + 2 * (curr.x - prev.x) / 3;
      path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    return { path, points };
  };

  const chartData = generateChartPath();

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-[240px] min-h-screen bg-[#111111] border-r border-[#1e1e1e] p-4">
          <div className="flex items-center gap-2 mb-8">
            <img 
              src="/figmaAssets/logo.png" 
              alt="Grupo Rugido" 
              className="h-10 w-auto"
            />
          </div>
          
          <nav className="flex-1">
            <div className="text-xs text-[#666] uppercase tracking-wider mb-3">Menu Principal</div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1a1a1a] rounded-lg text-white">
                <BarChart3 className="w-4 h-4 text-[#8b5cf6]" />
                <span className="text-sm">Dashboard</span>
              </div>
            </div>
          </nav>

          <div className="mt-auto pt-4 border-t border-[#1e1e1e]">
            <div className="px-3 py-2">
              <p className="text-sm text-white font-medium">Grupo Rugido</p>
              <p className="text-xs text-[#666]">Painel Administrativo</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <img 
                src="/figmaAssets/logo.png" 
                alt="Grupo Rugido" 
                className="lg:hidden h-8 w-auto"
              />
              <h1 className="text-xl lg:text-2xl font-semibold text-white">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleExportCSV} 
                variant="outline"
                className="border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#222]"
                data-testid="button-export-csv"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2 mb-6">
            <Button size="sm" className="bg-[#1a1a1a] text-white hover:bg-[#222] border-0">
              30 Dias
            </Button>
            <Button size="sm" variant="ghost" className="text-[#666] hover:text-white hover:bg-[#1a1a1a]">
              3 Meses
            </Button>
            <Button size="sm" variant="ghost" className="text-[#666] hover:text-white hover:bg-[#1a1a1a]">
              1 Ano
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#141414] border-[#1e1e1e]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-[#888]">Total de Leads</span>
                  <Users className="w-4 h-4 text-[#666]" />
                </div>
                <p className="text-2xl font-bold text-white" data-testid="text-total-submissions">
                  {loadingSubmissions ? "..." : submissions.length}
                </p>
                <p className="text-xs text-[#8b5cf6] mt-1">
                  +{todaySubmissions} hoje
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-[#1e1e1e]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-[#888]">Visitantes</span>
                  <TrendingUp className="w-4 h-4 text-[#666]" />
                </div>
                <p className="text-2xl font-bold text-white" data-testid="text-visitors">
                  {loadingFunnel ? "..." : totalVisitors}
                </p>
                <p className="text-xs text-[#888] mt-1">
                  Iniciaram o formulário
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-[#1e1e1e]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-[#888]">Leads Novos</span>
                  <CalendarDays className="w-4 h-4 text-[#666]" />
                </div>
                <p className="text-2xl font-bold text-white" data-testid="text-new-leads">
                  {loadingSubmissions ? "..." : todaySubmissions}
                </p>
                <p className="text-xs text-[#888] mt-1">
                  Últimas 24 horas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-[#1e1e1e]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-[#888]">Taxa de Conversão</span>
                  <Percent className="w-4 h-4 text-[#666]" />
                </div>
                <p className="text-2xl font-bold text-white" data-testid="text-completion-rate">
                  {loadingFunnel ? "..." : `${completionRate}%`}
                </p>
                <p className="text-xs text-[#888] mt-1">
                  Visitantes para leads
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Funnel Line Chart */}
            <Card className="bg-[#141414] border-[#1e1e1e] lg:col-span-2">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-[#8b5cf6]" />
                      <span className="text-sm text-[#888]">Fluxo de Visitantes</span>
                    </div>
                    <p className="text-3xl font-bold text-white" data-testid="text-total-visitors-chart">
                      {totalVisitors.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-[#888]">Total de Acessos</p>
                    <p className="text-xs text-[#8b5cf6] mt-1">
                      +{completionRate}% taxa de conversão
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-[#666]">
                    <span className="text-lg">...</span>
                  </Button>
                </div>

                {/* Info Card */}
                <div className="bg-[#1a1a1a] rounded-lg p-3 mb-4 mt-4">
                  <p className="text-sm font-semibold text-white mb-1">Funil de Conversão</p>
                  <p className="text-xs text-[#888]">
                    Acompanhe quantas pessoas passaram por cada etapa do formulário.
                  </p>
                </div>
                
                {loadingFunnel ? (
                  <div className="h-[180px] flex items-center justify-center">
                    <p className="text-[#666]">Carregando...</p>
                  </div>
                ) : funnelData.length === 0 ? (
                  <div className="h-[180px] flex items-center justify-center">
                    <p className="text-[#666]">Nenhum dado disponível ainda</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-[150px] flex flex-col justify-between text-xs text-[#666] pr-2">
                      <span>{maxStepCount}</span>
                      <span>{Math.round(maxStepCount * 0.75)}</span>
                      <span>{Math.round(maxStepCount * 0.5)}</span>
                      <span>{Math.round(maxStepCount * 0.25)}</span>
                      <span>0</span>
                    </div>
                    
                    {/* Chart */}
                    <div className="ml-8">
                      <svg viewBox="0 0 400 170" className="w-full h-[170px]">
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                          <line
                            key={i}
                            x1="20"
                            y1={150 - ratio * 130}
                            x2="380"
                            y2={150 - ratio * 130}
                            stroke="#1e1e1e"
                            strokeWidth="1"
                          />
                        ))}
                        
                        {/* Area fill */}
                        {chartData && typeof chartData === 'object' && chartData.path && (
                          <>
                            <defs>
                              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path
                              d={`${chartData.path} L ${chartData.points[chartData.points.length - 1].x} 150 L ${chartData.points[0].x} 150 Z`}
                              fill="url(#areaGradient)"
                            />
                            <path
                              d={chartData.path}
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="2"
                            />
                            {/* Data points */}
                            {chartData.points.map((point, i) => (
                              <g key={i}>
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="4"
                                  fill="#8b5cf6"
                                />
                                {i === chartData.points.length - 1 && point.count > 0 && (
                                  <g>
                                    <rect
                                      x={point.x - 40}
                                      y={point.y - 35}
                                      width="80"
                                      height="28"
                                      rx="4"
                                      fill="#1a1a1a"
                                      stroke="#2a2a2a"
                                    />
                                    <text
                                      x={point.x}
                                      y={point.y - 17}
                                      textAnchor="middle"
                                      className="text-xs fill-white font-medium"
                                    >
                                      {point.count} leads
                                    </text>
                                  </g>
                                )}
                              </g>
                            ))}
                          </>
                        )}
                      </svg>
                      
                      {/* X-axis labels */}
                      <div className="flex justify-between text-xs text-[#666] mt-1 px-4">
                        <span>Etapa 1</span>
                        <span>Etapa 5</span>
                        <span>Etapa 9</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step Breakdown */}
            <Card className="bg-[#141414] border-[#1e1e1e]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#8b5cf6]" />
                    <span className="text-sm font-medium text-white">Detalhes por Etapa</span>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="12" />
                      <circle 
                        cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="12"
                        strokeDasharray={`${completionRate * 2.51} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{submissions.length}</span>
                      <span className="text-[10px] text-[#666]">Total Leads</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {stepBreakdown.slice(0, 4).map((item, index) => (
                    <div key={item.step} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: `hsl(${263 - index * 10}, 84%, ${60 + index * 5}%)` }}
                        />
                        <span className="text-xs text-[#888] truncate max-w-[120px]">{item.label}</span>
                      </div>
                      <span className="text-xs text-white font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-xs text-[#8b5cf6] hover:text-[#a78bfa] hover:bg-[#1a1a1a]"
                  data-testid="button-more-details"
                >
                  Mais detalhes <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Submissions Table */}
          <Card className="bg-[#141414] border-[#1e1e1e]">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-white">{submissions.length}</span>
                  <span className="text-sm text-[#888]">Leads Cadastrados</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <Input
                      placeholder="Buscar lead..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-[200px] bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#666] text-sm"
                      data-testid="input-search"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-[#2a2a2a] bg-[#1a1a1a] text-[#888]">
                    <Filter className="w-4 h-4 mr-1" />
                    Filtrar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#2a2a2a] bg-[#1a1a1a] text-[#888]"
                    onClick={handleExportCSV}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>

              {loadingSubmissions ? (
                <p className="text-[#666] py-8 text-center">Carregando...</p>
              ) : filteredSubmissions.length === 0 ? (
                <p className="text-[#666] py-8 text-center">
                  {searchTerm ? "Nenhum resultado encontrado" : "Nenhum lead cadastrado ainda"}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1e1e1e]">
                        <th className="text-left py-3 px-2 text-[#666] font-medium text-xs">ID</th>
                        <th className="text-left py-3 px-2 text-[#666] font-medium text-xs">Nome</th>
                        <th className="text-left py-3 px-2 text-[#666] font-medium text-xs">Email</th>
                        <th className="text-left py-3 px-2 text-[#666] font-medium text-xs">Status</th>
                        <th className="text-left py-3 px-2 text-[#666] font-medium text-xs">Data</th>
                        <th className="text-left py-3 px-2 text-[#666] font-medium text-xs">Cargo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub, index) => (
                        <tr 
                          key={sub.id} 
                          className="border-b border-[#1e1e1e] hover:bg-[#1a1a1a] transition-colors"
                          data-testid={`row-submission-${sub.id}`}
                        >
                          <td className="py-3 px-2 text-[#666] text-xs">{String(index + 1).padStart(3, '0')}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] text-xs font-medium">
                                {(sub.name || "?")[0].toUpperCase()}
                              </div>
                              <span className="text-white text-sm">{sub.name || "-"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-[#888] text-sm">{sub.email || "-"}</td>
                          <td className="py-3 px-2">
                            <Badge className="bg-[#8b5cf6]/20 text-[#8b5cf6] border-0 text-xs">
                              Cadastrado
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-[#888] text-sm">{formatDate(sub.createdAt)}</td>
                          <td className="py-3 px-2 text-[#8b5cf6] text-sm">{sub.role || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
