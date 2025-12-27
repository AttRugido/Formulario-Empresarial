import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, TrendingDown, Search, Filter, ChevronRight, LayoutDashboard, PanelLeft, Settings } from "lucide-react";
import type { FormSubmission } from "@shared/schema";
import { useState } from "react";

interface FunnelData {
  step: number;
  count: number;
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
    if (!date) return "00/00/0000";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,3)}.${cleaned.slice(3,7)}-${cleaned.slice(7)}`;
    }
    return phone;
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

  const getUrgencyBadge = (urgency: string | null) => {
    if (!urgency) return null;
    if (urgency.toLowerCase().includes("urgente") || urgency.toLowerCase().includes("agora")) {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-0 text-[10px] whitespace-nowrap">
          É urgente - preciso começar AGORA
        </Badge>
      );
    }
    if (urgency.includes("30")) {
      return (
        <Badge className="bg-orange-500/20 text-orange-400 border-0 text-[10px] whitespace-nowrap">
          Nos próximos 30 dias
        </Badge>
      );
    }
    if (urgency.includes("90")) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-[10px] whitespace-nowrap">
          Nos próximos 90 dias
        </Badge>
      );
    }
    return (
      <Badge className="bg-[#1a1a1a] text-[#888] border-0 text-[10px]">
        {urgency}
      </Badge>
    );
  };

  const getFaturamentoBadge = (revenue: string | null) => {
    if (!revenue) return "-";
    return (
      <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px] whitespace-nowrap">
        {revenue}
      </Badge>
    );
  };

  const openWhatsApp = (phone: string | null) => {
    if (!phone) return;
    const cleaned = phone.replace(/\D/g, "");
    const whatsappNumber = cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  const MiniChart = ({ trend }: { trend: "up" | "down" }) => (
    <svg viewBox="0 0 120 40" className="w-full h-10 mt-2">
      <defs>
        <linearGradient id={`gradient-${trend}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={trend === "up" ? "#22c55e" : "#ef4444"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={trend === "up" ? "#22c55e" : "#ef4444"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={trend === "up" 
          ? "M0,35 Q20,30 40,25 T80,15 T120,10" 
          : "M0,10 Q20,15 40,20 T80,30 T120,35"}
        fill="none"
        stroke={trend === "up" ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
      />
      <path
        d={trend === "up" 
          ? "M0,35 Q20,30 40,25 T80,15 T120,10 L120,40 L0,40 Z" 
          : "M0,10 Q20,15 40,20 T80,30 T120,35 L120,40 L0,40 Z"}
        fill={`url(#gradient-${trend})`}
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#08090B' }}>
      {/* Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col ${sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'} min-h-screen transition-all duration-300`}
        style={{ 
          background: 'radial-gradient(86.83% 104.27% at -8.97% -1.02%, #3B3951 0%, #0C0D0F 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.03)',
          padding: '20px 20px 25px 20px'
        }}
      >
        {/* Logo */}
        <div className="pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="logo">
                <g id="front">
                  <path d="M38.2818 68.5629C40.1863 74.4504 41.4273 77.2975 40.4135 80.0734C42.3509 77.9572 43.0055 75.7039 46.0977 74.0339C58.695 66.9916 57.7315 55.3364 58.1556 38.8668C52.8033 47.2142 48.005 51.3315 40.4131 57.4787C36.4529 60.8806 37.1446 65.6757 38.2818 68.5629Z" fill="white" fillOpacity="0.82"/>
                  <path d="M59.1986 38.9142C59.8115 56.5576 58.8683 65.9253 49.5793 73.3234C61.5873 69.1313 65.282 57.905 66.9872 29.6971C64.6211 30.6699 63.8554 32.9329 62.3688 35.2392C61.2173 36.8592 60.5835 38.0796 59.1986 38.9142Z" fill="white" fillOpacity="0.82"/>
                  <path d="M67.9102 31.189C66.7079 51.1168 65.5393 60.202 60.2366 66.0759C67.8101 61.8013 70.9655 58.6864 72.9549 38.6495C71.2553 37.9173 70.4718 37.4222 69.9707 35.3101C69.7473 33.6583 68.9209 32.623 67.9102 31.189Z" fill="white" fillOpacity="0.82"/>
                </g>
              </g>
            </svg>
            {!sidebarCollapsed && (
              <div>
                <span className="font-semibold text-white text-sm">Grupo Rugido</span>
                <p className="text-[10px] text-[#666]">Estruturação de empresas</p>
              </div>
            )}
          </div>
        </div>

        {/* User Greeting */}
        {!sidebarCollapsed && (
          <div className="py-4 border-b border-white/5">
            <p className="text-white text-sm font-medium">Bem vindo de volta,</p>
            <p className="text-white text-lg font-semibold">User</p>
            <p className="text-[10px] text-[#666] mt-1">Último Login: XX de Mês, Ano</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {!sidebarCollapsed && (
            <p className="text-[10px] text-[#666] uppercase tracking-wider mb-3 px-2">Overview</p>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1a1a1a] rounded-lg text-white">
              <LayoutDashboard className="w-4 h-4 text-[#8b5cf6] flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm">Dashboard</span>}
              {!sidebarCollapsed && <div className="ml-auto w-1.5 h-1.5 bg-[#8b5cf6] rounded-full" />}
            </div>
          </div>
          
          {!sidebarCollapsed && (
            <p className="text-[10px] text-[#666] uppercase tracking-wider mt-6 mb-3 px-2">Account</p>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 text-[#666] hover:text-white hover:bg-[#1a1a1a] rounded-lg cursor-pointer transition-colors">
              <Settings className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm">Configurações</span>}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-white/5">
          {!sidebarCollapsed && (
            <p className="text-[10px] text-[#666]">Painel Administrativo</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-white/5 p-4" style={{ background: '#08090B' }}>
          <div className="flex items-center gap-2 text-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-[#666]"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
            <span className="text-[#666]">Overview</span>
            <ChevronRight className="w-4 h-4 text-[#666]" />
            <span className="text-white font-medium">Dashboard</span>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {/* Update Time */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-[#666]">Último Update: <span className="text-white">2 minutos</span></span>
          </div>

          {/* Leads Section */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white" data-testid="text-total-submissions">
                  {loadingSubmissions ? "..." : submissions.length}
                </span>
                <div>
                  <span className="text-lg font-semibold text-white">Leads</span>
                  <p className="text-lg font-semibold text-white">Cadastrados</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <Input
                    placeholder="Buscar lead..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[180px] bg-[#111] border-[#1a1a1a] text-white placeholder:text-[#666] text-sm"
                    data-testid="input-search"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-[#1a1a1a] bg-[#111] text-[#888]">
                  <Filter className="w-4 h-4 mr-1" />
                  Filtrar
                </Button>
                <Button 
                  onClick={handleExportCSV}
                  variant="outline" 
                  size="sm" 
                  className="border-[#1a1a1a] bg-[#111] text-[#888]"
                  data-testid="button-export-csv"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto rounded-lg border border-[#1a1a1a]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0f0f0f] border-b border-[#1a1a1a]">
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Data</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Nome</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">E-mail</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Urgência</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Whatsapp</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Rede Social</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Cargo</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Gargalo</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Faturamento</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Tamanho do Time</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Segmento</th>
                    <th className="text-left p-3 text-[#666] font-medium whitespace-nowrap">Tem Sócio</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSubmissions ? (
                    <tr>
                      <td colSpan={12} className="text-center p-8 text-[#666]">Carregando...</td>
                    </tr>
                  ) : filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="text-center p-8 text-[#666]">Nenhum lead encontrado</td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub, index) => (
                      <tr key={sub.id || index} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                        <td className="p-3 text-[#888] whitespace-nowrap">{formatDate(sub.createdAt)}</td>
                        <td className="p-3 text-white whitespace-nowrap">{sub.name || "-"}</td>
                        <td className="p-3 text-[#888] whitespace-nowrap">{sub.email || "-"}</td>
                        <td className="p-3">{getUrgencyBadge(sub.urgency)}</td>
                        <td className="p-3">
                          {sub.phone ? (
                            <button
                              onClick={() => openWhatsApp(sub.phone)}
                              className="text-green-400 hover:text-green-300 whitespace-nowrap"
                              data-testid={`button-whatsapp-${sub.id}`}
                            >
                              {formatPhone(sub.phone)}
                            </button>
                          ) : (
                            <span className="text-[#666]">-</span>
                          )}
                        </td>
                        <td className="p-3 text-[#888] whitespace-nowrap">{sub.socialMedia || "-"}</td>
                        <td className="p-3 text-[#888] whitespace-nowrap">{sub.role || "-"}</td>
                        <td className="p-3 text-[#888] max-w-[200px] truncate" title={sub.bottleneck || ""}>
                          {sub.bottleneck || "-"}
                        </td>
                        <td className="p-3">{getFaturamentoBadge(sub.revenue)}</td>
                        <td className="p-3 text-[#888] whitespace-nowrap">{sub.teamSize || "-"}</td>
                        <td className="p-3 text-[#888] whitespace-nowrap">{sub.segment || "-"}</td>
                        <td className="p-3 text-[#888] whitespace-nowrap">{sub.hasPartner || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fluxo de Visitantes Section */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
              <div>
                <p className="text-xs text-[#666]">Taxa de progresso</p>
                <p className="text-lg font-semibold text-white">Fluxo de visitantes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Visitantes Card */}
              <Card className="bg-[#111] border-[#1a1a1a]">
                <CardContent className="p-4">
                  <p className="text-xs text-[#666] mb-2">Visitantes</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white" data-testid="text-visitors">
                      {loadingFunnel ? "..." : totalVisitors}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400">+1.06%</span>
                    </div>
                  </div>
                  <MiniChart trend="down" />
                </CardContent>
              </Card>

              {/* Taxa de Conversão Card */}
              <Card className="bg-[#111] border-[#1a1a1a]">
                <CardContent className="p-4">
                  <p className="text-xs text-[#666] mb-2">Taxa de conversão</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white" data-testid="text-conversion-rate">
                      {loadingFunnel ? "..." : `${completionRate}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400">+1.06%</span>
                    </div>
                  </div>
                  <MiniChart trend="down" />
                </CardContent>
              </Card>

              {/* Leads Novos Card */}
              <Card className="bg-[#111] border-[#1a1a1a]">
                <CardContent className="p-4">
                  <p className="text-xs text-[#666] mb-1">Leads novos</p>
                  <p className="text-[10px] text-[#666] mb-2">Últimas 24h</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white" data-testid="text-new-leads">
                      {loadingSubmissions ? "..." : todaySubmissions}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">+1.06%</span>
                    </div>
                  </div>
                  <MiniChart trend="up" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
