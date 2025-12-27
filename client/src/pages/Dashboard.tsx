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
        className={`hidden lg:flex flex-col ${sidebarCollapsed ? 'w-[60px]' : 'w-[309px]'} min-h-screen transition-all duration-300 relative`}
        style={{ 
          background: '#0C0D0F',
          borderRight: '1px solid rgba(255, 255, 255, 0.03)',
          padding: '20px 20px 25px 20px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Background SVG */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 309 1080" 
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M0 0H309V1080H0V0Z" fill="url(#paint0_radial_sidebar)"/>
          <defs>
            <radialGradient id="paint0_radial_sidebar" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-27.7035 -11) rotate(56.2312) scale(532.909 316.999)">
              <stop stopColor="#3B3951"/>
              <stop offset="1" stopColor="#3B3951" stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>
        
        {/* Logo */}
        <div className="pb-4 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <svg className="flex-shrink-0" width="24" height="35" viewBox="0 0 24 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.715211 26.9572C2.27321 31.2693 2.36903 32.9023 1.73224 35C3.05303 33.3616 3.85068 32.463 6.01446 31.1173C14.8215 25.4572 13.8477 17.9698 13.6154 5.71315C10.0479 12.0987 7.29932 13.7005 2.05363 18.5261C-0.676304 21.1886 -0.194604 24.8494 0.715211 26.9572Z" fill="url(#paint0_linear_34_442)"/>
              <path d="M14.3651 5.71315C15.3795 18.8074 14.6317 24.8607 8.20937 30.6735C16.2185 27.7496 18.8098 20.4357 19.9855 0C18.3199 0.802974 17.6045 1.56356 16.6132 3.32805C15.84 4.57114 15.3313 5.04601 14.3651 5.71315Z" fill="url(#paint1_linear_34_442)"/>
              <path d="M20.4672 0.610144C20.2539 15.4637 19.2621 21.1362 15.6497 25.6815C20.7329 22.8117 22.7788 19.0732 24 5.99049C22.7569 5.5036 22.3942 5.26942 21.9659 3.71633C21.7518 2.49604 21.2389 1.64194 20.4672 0.610144Z" fill="url(#paint2_linear_34_442)"/>
              <path d="M0.941215 26.8871C2.20261 30.9278 3.02453 32.8817 2.35309 34.7869C3.63621 33.3346 4.06978 31.7881 6.11779 30.642C14.4611 25.8088 13.823 17.8096 14.1038 6.50642C10.559 12.2353 7.38097 15.061 2.3528 19.2799C-0.270034 21.6147 0.188036 24.9056 0.941215 26.8871Z" fill="white" fillOpacity="0.82"/>
              <path d="M14.7946 6.53893C15.2005 18.6478 14.5758 25.0769 8.42364 30.1543C16.3766 27.2772 18.8237 19.5725 19.9531 0.213138C18.386 0.880766 17.8789 2.43395 16.8943 4.01674C16.1316 5.12859 15.7118 5.96613 14.7946 6.53893Z" fill="white" fillOpacity="0.82"/>
              <path d="M20.5645 1.23717C19.7681 14.9138 18.9941 21.1491 15.4821 25.1804C20.4981 22.2467 22.588 20.1089 23.9056 6.35741C22.7799 5.85488 22.261 5.51506 21.9291 4.06549C21.7811 2.93185 21.2338 2.22132 20.5645 1.23717Z" fill="white" fillOpacity="0.82"/>
              <defs>
                <linearGradient id="paint0_linear_34_442" x1="22.678" y1="2.91667" x2="11.5899" y2="40.0818" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FE2EFD" stopOpacity="0"/>
                  <stop offset="0.404724" stopColor="#FE30FD"/>
                  <stop offset="0.586755" stopColor="#FE30FD"/>
                  <stop offset="0.860624" stopColor="#00FFD2"/>
                </linearGradient>
                <linearGradient id="paint1_linear_34_442" x1="22.6511" y1="1.4557" x2="15.9156" y2="35.8766" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FED1"/>
                  <stop offset="0.34" stopColor="#FE30FD"/>
                  <stop offset="0.68" stopColor="#FE30FD"/>
                  <stop offset="1" stopColor="#00FED1"/>
                </linearGradient>
                <linearGradient id="paint2_linear_34_442" x1="15.4823" y1="0.0774335" x2="12.9859" y2="33.1428" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FED1"/>
                  <stop offset="0.225" stopColor="#00FED1"/>
                  <stop offset="0.55" stopColor="#7331FF"/>
                  <stop offset="0.79" stopColor="#7331FF"/>
                  <stop offset="1" stopColor="#00FED1"/>
                </linearGradient>
              </defs>
            </svg>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span 
                  className="font-medium text-[18px] leading-[20.409px]"
                  style={{
                    background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Grupo Rugido
                </span>
                <span className="text-[#6E707C] text-[13px] font-normal leading-[23.4px]">
                  Estruturação de empresas
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User Greeting */}
        {!sidebarCollapsed && (
          <div className="py-6 border-b border-white/5 relative z-10">
            <p 
              className="text-[28px] font-medium leading-[30.8px]"
              style={{
                width: '208px',
                background: 'linear-gradient(88deg, #F6F6F8 6.29%, #A8B2BC 87%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Bem vindo<br />de volta, User.
            </p>
            <p className="text-[#6E707C] text-[13px] font-normal leading-[23.4px] mt-1">
              Último Login: {new Date().getDate()} de {new Date().toLocaleDateString('pt-BR', { month: 'long' })}, {new Date().getFullYear()}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 relative z-10">
          {!sidebarCollapsed && (
            <p className="text-[#6E707C] text-[13px] font-normal leading-[23.4px] mb-3">Overview</p>
          )}
          <div 
            className="relative rounded-lg" 
            style={{ 
              width: '269px', 
              height: '44px',
              background: '#1E1E26',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <svg 
              className="absolute inset-0 w-full h-full rounded-lg"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 269 44" 
              fill="none"
              preserveAspectRatio="none"
            >
              <path d="M0 8C0 3.58172 3.58172 0 8 0H261C265.418 0 269 3.58172 269 8V36C269 40.4183 265.418 44 261 44H8.00001C3.58173 44 0 40.4183 0 36V8Z" fill="url(#paint0_radial_nav)"/>
              <path d="M8 0.5H261C265.142 0.5 268.5 3.85786 268.5 8V36C268.5 40.1421 265.142 43.5 261 43.5H8C3.85787 43.5 0.5 40.1421 0.5 36V8C0.5 3.85786 3.85786 0.5 8 0.5Z" stroke="url(#paint1_radial_nav)" strokeOpacity="0.25"/>
              <defs>
                <radialGradient id="paint0_radial_nav" cx="0" cy="0" r="1" gradientTransform="matrix(15.0239 29.9444 -54.8494 20.0794 221.067 -1.71381e-06)" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#40404C"/>
                  <stop offset="1" stopColor="#1E1E26" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="paint1_radial_nav" cx="0" cy="0" r="1" gradientTransform="matrix(12.1622 22 -89.4282 36.0725 223.928 -1.619e-07)" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="white" stopOpacity="0"/>
                </radialGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center gap-3 px-4 text-white z-10">
              <svg className="flex-shrink-0" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="6" height="6" rx="1" fill="white" fillOpacity="0.8"/>
                <rect x="9.5" y="0.5" width="6" height="6" rx="1" fill="white" fillOpacity="0.8"/>
                <rect x="0.5" y="9.5" width="6" height="6" rx="1" fill="white" fillOpacity="0.8"/>
                <rect x="9.5" y="9.5" width="6" height="6" rx="1" fill="white" fillOpacity="0.8"/>
              </svg>
              {!sidebarCollapsed && <span className="text-[14px] font-medium">Dashboard</span>}
              {!sidebarCollapsed && <div className="ml-auto w-[1px] h-[13px] bg-white" />}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-white/5 relative z-10">
          {!sidebarCollapsed && (
            <p className="text-[#6E707C] text-[13px] font-normal leading-[23.4px]">Painel Administrativo</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-white/5 p-4" style={{ background: '#08090B' }}>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-[#666]"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
              <path d="M20.487 9.26216L11.737 0.512158C11.4089 0.184217 10.9639 0 10.5 0C10.0361 0 9.59114 0.184217 9.26298 0.512158L0.51298 9.26216C0.349688 9.42424 0.220247 9.61716 0.132184 9.82972C0.0441203 10.0423 -0.000807906 10.2702 1.0996e-05 10.5003V21.0003C1.0996e-05 21.2323 0.0921984 21.4549 0.256293 21.619C0.420387 21.7831 0.642947 21.8753 0.875011 21.8753H20.125C20.3571 21.8753 20.5796 21.7831 20.7437 21.619C20.9078 21.4549 21 21.2323 21 21.0003V10.5003C21.0008 10.2702 20.9559 10.0423 20.8678 9.82972C20.7798 9.61716 20.6503 9.42424 20.487 9.26216ZM19.25 20.1253H1.75001V10.5003L10.5 1.75028L19.25 10.5003V20.1253Z" fill="#6E707C"/>
            </svg>
            <span style={{ color: '#6E707C', fontFamily: 'Inter', fontSize: '20px', fontWeight: 400, lineHeight: '23.4px' }}>Overview</span>
            <span style={{ color: '#6E707C', fontFamily: 'Inter', fontSize: '20px', fontWeight: 400 }}>/</span>
            <span style={{ color: '#FFF', fontFamily: 'Inter', fontSize: '18px', fontWeight: 400, lineHeight: '30.8px' }}>Dashboard</span>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {/* Update Time */}
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7Z" fill="white" fillOpacity="0.1"/>
              <path d="M10 7C10 8.65685 8.65685 10 7 10C5.34315 10 4 8.65685 4 7C4 5.34315 5.34315 4 7 4C8.65685 4 10 5.34315 10 7Z" fill="white"/>
            </svg>
            <span style={{ color: '#6E707C', fontFamily: 'Inter', fontSize: '13px', fontWeight: 400, lineHeight: '23.4px' }}>Último Update: <span style={{ color: '#FFF' }}>2 minutos</span></span>
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
