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

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-[240px] min-h-screen bg-[#111111] border-r border-[#1e1e1e] p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#0b9a1b] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white text-lg">Rugido</span>
          </div>
          
          <nav className="flex-1">
            <div className="text-xs text-[#666] uppercase tracking-wider mb-3">Menu Principal</div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1a1a1a] rounded-lg text-white">
                <BarChart3 className="w-4 h-4" />
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
              <div className="lg:hidden w-8 h-8 bg-[#0b9a1b] rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
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
                <p className="text-xs text-[#0b9a1b] mt-1">
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
            {/* Funnel Chart */}
            <Card className="bg-[#141414] border-[#1e1e1e] lg:col-span-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#0b9a1b]" />
                    <span className="text-sm font-medium text-white">Funil de Conversão</span>
                  </div>
                </div>
                
                {loadingFunnel ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-[#666]">Carregando...</p>
                  </div>
                ) : funnelData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-[#666]">Nenhum dado disponível ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stepBreakdown.map((item) => {
                      const percentage = (item.count / maxStepCount) * 100;
                      return (
                        <div key={item.step} className="flex items-center gap-3">
                          <span className="text-xs text-[#666] w-6">{item.step}</span>
                          <div className="flex-1 h-6 bg-[#1a1a1a] rounded overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#0b9a1b] to-[#0d7a18] rounded transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-white font-medium w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step Breakdown */}
            <Card className="bg-[#141414] border-[#1e1e1e]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#0b9a1b]" />
                    <span className="text-sm font-medium text-white">Detalhes por Etapa</span>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="12" />
                      <circle 
                        cx="50" cy="50" r="40" fill="none" stroke="#0b9a1b" strokeWidth="12"
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
                  {stepBreakdown.slice(0, 4).map((item) => (
                    <div key={item.step} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#0b9a1b]" />
                        <span className="text-xs text-[#888] truncate max-w-[120px]">{item.label}</span>
                      </div>
                      <span className="text-xs text-white font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-xs text-[#0b9a1b] hover:text-[#0d7a18] hover:bg-[#1a1a1a]"
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
                              <div className="w-7 h-7 rounded-full bg-[#0b9a1b]/20 flex items-center justify-center text-[#0b9a1b] text-xs font-medium">
                                {(sub.name || "?")[0].toUpperCase()}
                              </div>
                              <span className="text-white text-sm">{sub.name || "-"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-[#888] text-sm">{sub.email || "-"}</td>
                          <td className="py-3 px-2">
                            <Badge className="bg-[#0b9a1b]/20 text-[#0b9a1b] border-0 text-xs">
                              Cadastrado
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-[#888] text-sm">{formatDate(sub.createdAt)}</td>
                          <td className="py-3 px-2 text-[#0b9a1b] text-sm">{sub.role || "-"}</td>
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
