import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Users, TrendingUp, CalendarDays, Percent, Search, Filter, MessageCircle, BarChart3 } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-[280px] min-h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] p-6">
          <div className="flex items-center gap-3 mb-12">
            <svg className="w-10 h-10" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="logo">
                <g id="logo-centro">
                  <g id="back">
                    <path className="animate-[vibrate_3s_linear_infinite]" d="M37.9402 68.6649C40.2926 74.9479 40.4373 77.3273 39.4758 80.3838C41.47 77.9965 42.6744 76.6873 45.9414 74.7264C59.2389 66.4794 57.7686 55.5697 57.4178 37.7109C52.0314 47.0151 47.8814 49.349 39.9611 56.3803C35.8392 60.2597 36.5665 65.5938 37.9402 68.6649Z" fill="url(#paint0_linear_167_280)"/>
                    <path className="animate-[vibrate_1s_linear_infinite]" d="M58.5501 37.711C60.0818 56.7902 58.9528 65.6103 49.2559 74.0799C61.3486 69.8195 65.2611 59.1627 67.0362 29.3865C64.5214 30.5565 63.4413 31.6647 61.9446 34.2357C60.7771 36.047 60.0091 36.7389 58.5501 37.711Z" fill="url(#paint1_linear_167_280)"/>
                    <path className="animate-[vibrate_2s_linear_infinite]" d="M67.7631 30.2754C67.441 51.918 65.9436 60.1833 60.4893 66.806C68.1643 62.6245 71.2533 57.1773 73.0972 38.1149C71.2203 37.4055 70.6726 37.0643 70.026 34.8013C69.7027 33.0233 68.9282 31.7788 67.7631 30.2754Z" fill="url(#paint2_linear_167_280)"/>
                  </g>
                  <g id="front">
                    <path d="M38.2818 68.5629C40.1863 74.4504 41.4273 77.2975 40.4135 80.0734C42.3509 77.9572 43.0055 75.7039 46.0977 74.0339C58.695 66.9916 57.7315 55.3364 58.1556 38.8668C52.8033 47.2142 48.005 51.3315 40.4131 57.4787C36.4529 60.8806 37.1446 65.6757 38.2818 68.5629Z" fill="white" fillOpacity="0.82"/>
                    <path d="M59.1986 38.9142C59.8115 56.5576 58.8683 65.9253 49.5793 73.3234C61.5873 69.1313 65.282 57.905 66.9872 29.6971C64.6211 30.6699 63.8554 32.9329 62.3688 35.2392C61.2173 36.8592 60.5835 38.0796 59.1986 38.9142Z" fill="white" fillOpacity="0.82"/>
                    <path d="M67.9102 31.189C66.7079 51.1168 65.5393 60.202 60.2366 66.0759C67.8101 61.8013 70.9655 58.6864 72.9549 38.6495C71.2553 37.9173 70.4718 37.4222 69.9707 35.3101C69.7473 33.6583 68.9209 32.623 67.9102 31.189Z" fill="white" fillOpacity="0.82"/>
                  </g>
                </g>
              </g>
              <defs>
                <linearGradient id="paint0_linear_167_280" x1="56.4996" y1="41.267" x2="38.8809" y2="83.2125" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FE2EFD" stopOpacity="0"/>
                  <stop offset="0.404724" stopColor="#FE30FD"/>
                  <stop offset="0.586755" stopColor="#FE30FD"/>
                  <stop offset="0.860624" stopColor="#00FFD2"/>
                </linearGradient>
                <linearGradient id="paint1_linear_167_280" x1="66.0369" y1="31.2454" x2="52.2167" y2="72.2211" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FED1"/>
                  <stop offset="0.34" stopColor="#FE30FD"/>
                  <stop offset="0.68" stopColor="#FE30FD"/>
                  <stop offset="1" stopColor="#00FED1"/>
                </linearGradient>
                <linearGradient id="paint2_linear_167_280" x1="68.6226" y1="30.3562" x2="63.5309" y2="64.3006" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FED1"/>
                  <stop offset="0.225" stopColor="#00FED1"/>
                  <stop offset="0.55" stopColor="#7331FF"/>
                  <stop offset="0.79" stopColor="#7331FF"/>
                  <stop offset="1" stopColor="#00FED1"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-semibold text-white text-xl">Rugido</span>
          </div>

          <nav className="flex-1 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#141414] rounded-xl text-white border border-[#1a1a1a]">
              <BarChart3 className="w-5 h-5 text-[#8b5cf6]" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
          </nav>

          <div className="mt-auto pt-6 border-t border-[#1a1a1a]">
            <div className="px-4 py-3 bg-[#0f0f0f] rounded-xl border border-[#1a1a1a]">
              <p className="text-sm text-white font-medium mb-1">Grupo Rugido</p>
              <p className="text-xs text-[#666]">Admin Dashboard</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-sm text-[#888]">Acompanhe suas métricas e leads</p>
            </div>

            <Button 
              onClick={handleExportCSV} 
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white border-0"
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#0f0f0f] border-[#1a1a1a] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent rounded-full blur-3xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#8b5cf6]/10 rounded-xl">
                    <Users className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                </div>
                <p className="text-sm text-[#888] mb-1">Total de Leads</p>
                <p className="text-3xl font-bold text-white" data-testid="text-total-submissions">
                  {loadingSubmissions ? "..." : submissions.length}
                </p>
                <p className="text-xs text-[#8b5cf6] mt-2">
                  +{todaySubmissions} hoje
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-[#1a1a1a] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-sm text-[#888] mb-1">Visitantes</p>
                <p className="text-3xl font-bold text-white" data-testid="text-visitors">
                  {loadingFunnel ? "..." : totalVisitors}
                </p>
                <p className="text-xs text-[#888] mt-2">
                  Iniciaram formulário
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-[#1a1a1a] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <CalendarDays className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <p className="text-sm text-[#888] mb-1">Leads Novos</p>
                <p className="text-3xl font-bold text-white" data-testid="text-new-leads">
                  {loadingSubmissions ? "..." : todaySubmissions}
                </p>
                <p className="text-xs text-[#888] mt-2">
                  Últimas 24 horas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-[#1a1a1a] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/10 rounded-xl">
                    <Percent className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <p className="text-sm text-[#888] mb-1">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-white" data-testid="text-completion-rate">
                  {loadingFunnel ? "..." : `${completionRate}%`}
                </p>
                <p className="text-xs text-[#888] mt-2">
                  Visitantes → Leads
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Funnel Chart */}
            <Card className="bg-[#0f0f0f] border-[#1a1a1a] lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Funil de Conversão</h3>
                    <p className="text-sm text-[#888]">Jornada dos visitantes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white" data-testid="text-total-visitors-chart">
                      {totalVisitors.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-[#888]">Total de acessos</p>
                  </div>
                </div>

                {loadingFunnel ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-[#666]">Carregando...</p>
                  </div>
                ) : funnelData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-[#666]">Nenhum dado disponível</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="ml-8">
                      <svg viewBox="0 0 400 200" className="w-full h-[200px]">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                          <line
                            key={i}
                            x1="20"
                            y1={180 - ratio * 160}
                            x2="380"
                            y2={180 - ratio * 160}
                            stroke="#1a1a1a"
                            strokeWidth="1"
                          />
                        ))}

                        {chartData && typeof chartData === 'object' && chartData.path && (
                          <>
                            <path
                              d={`${chartData.path} L ${chartData.points[chartData.points.length - 1].x} 180 L ${chartData.points[0].x} 180 Z`}
                              fill="url(#chartGradient)"
                            />
                            <path
                              d={chartData.path}
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="3"
                            />
                            {chartData.points.map((point, i) => (
                              <circle
                                key={i}
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                fill="#8b5cf6"
                              />
                            ))}
                          </>
                        )}
                      </svg>

                      <div className="flex justify-between text-xs text-[#666] mt-2 px-4">
                        <span>Etapa 1</span>
                        <span>Etapa 5</span>
                        <span>Etapa 9</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conversion Rate Card */}
            <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Taxa de Conversão</h3>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="40" fill="none" stroke="url(#circleGradient)" strokeWidth="8"
                        strokeDasharray={`${completionRate * 2.51} 251`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{completionRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">Visitantes</span>
                    <span className="text-white font-medium">{totalVisitors}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">Leads gerados</span>
                    <span className="text-white font-medium">{submissions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Funnel Breakdown */}
          <Card className="bg-[#0f0f0f] border-[#1a1a1a] mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Análise por Etapa</h3>

              <div className="space-y-4">
                {stepBreakdown.map((item, index) => {
                  const step1Count = stepBreakdown[0]?.count || 1;
                  const percentageFromStart = step1Count > 0 ? Math.round((item.count / step1Count) * 100) : 0;

                  return (
                    <div key={item.step}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-[#8b5cf6]">{item.step}</span>
                          </div>
                          <span className="text-sm text-white font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-white">{item.count}</span>
                          <Badge className={`text-xs ${
                            percentageFromStart >= 70 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            percentageFromStart >= 40 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                            {percentageFromStart}%
                          </Badge>
                        </div>
                      </div>

                      <div className="ml-11 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-full transition-all duration-500"
                          style={{ width: `${percentageFromStart}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Leads Cadastrados</h3>
                  <p className="text-sm text-[#888]">{submissions.length} leads no total</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <Input
                      placeholder="Buscar lead..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[250px] bg-[#141414] border-[#1a1a1a] text-white placeholder:text-[#666]"
                      data-testid="input-search"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-[#1a1a1a] bg-[#141414] text-[#888] hover:bg-[#1a1a1a] hover:text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>

              {loadingSubmissions ? (
                <p className="text-[#666] py-8 text-center">Carregando...</p>
              ) : filteredSubmissions.length === 0 ? (
                <p className="text-[#666] py-8 text-center">
                  {searchTerm ? "Nenhum resultado encontrado" : "Nenhum lead cadastrado"}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1a1a1a]">
                        <th className="text-left py-4 px-4 text-[#888] font-medium text-sm">Lead</th>
                        <th className="text-left py-4 px-4 text-[#888] font-medium text-sm">Contato</th>
                        <th className="text-left py-4 px-4 text-[#888] font-medium text-sm">Urgência</th>
                        <th className="text-left py-4 px-4 text-[#888] font-medium text-sm">Data</th>
                        <th className="text-left py-4 px-4 text-[#888] font-medium text-sm">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub) => {
                        const formatPhoneForWhatsApp = (phone: string | null) => {
                          if (!phone) return "";
                          return phone.replace(/\D/g, "");
                        };

                        const getUrgencyBadge = (urgency: string | null) => {
                          if (!urgency) return { color: "bg-[#666]/20 text-[#666] border-[#666]/30", label: "-" };
                          if (urgency.toLowerCase().includes("imediato") || urgency.toLowerCase().includes("urgente")) {
                            return { color: "bg-red-500/20 text-red-400 border-red-500/30", label: urgency };
                          }
                          if (urgency.toLowerCase().includes("30 dias") || urgency.toLowerCase().includes("1 mês")) {
                            return { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: urgency };
                          }
                          if (urgency.toLowerCase().includes("90 dias") || urgency.toLowerCase().includes("3 meses")) {
                            return { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: urgency };
                          }
                          return { color: "bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30", label: urgency };
                        };

                        const urgencyInfo = getUrgencyBadge(sub.urgency);

                        return (
                          <tr 
                            key={sub.id} 
                            className="border-b border-[#1a1a1a] hover:bg-[#141414] transition-colors"
                            data-testid={`row-submission-${sub.id}`}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white text-sm font-semibold">
                                  {(sub.name || "?")[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-white font-medium text-sm">{sub.name || "-"}</p>
                                  <p className="text-[#888] text-xs">{sub.role || "-"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-white text-sm">{sub.email || "-"}</p>
                                <p className="text-[#888] text-xs">{sub.phone || "-"}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={`${urgencyInfo.color} text-xs font-medium`}>
                                {urgencyInfo.label}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-[#888] text-sm">{formatDate(sub.createdAt)}</td>
                            <td className="py-4 px-4">
                              {sub.phone ? (
                                <a
                                  href={`https://wa.me/55${formatPhoneForWhatsApp(sub.phone)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                  data-testid={`button-whatsapp-${sub.id}`}
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  WhatsApp
                                </a>
                              ) : (
                                <span className="text-[#666] text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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