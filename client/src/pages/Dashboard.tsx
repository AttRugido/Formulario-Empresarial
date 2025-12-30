import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, TrendingDown, Search, ChevronRight, LayoutDashboard, PanelLeft, Settings, LogOut, Trash2, Filter, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { supabase, type Lead } from "@/lib/supabase";

interface FunnelData {
  step: number;
  count: number;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    device: '',
    has_partner: '',
    revenue: '',
    urgency: '',
    segment: '',
    utm_source: '',
  });

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setLocation("/login");
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = (leads: Lead[]) => {
    if (selectedLeads.size === leads.length && leads.length > 0) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(s => s.id).filter((id): id is string => !!id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLeads.size === 0) return;
    
    const confirmDelete = window.confirm(`Deseja excluir ${selectedLeads.size} lead(s) selecionado(s)?`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .in('id', Array.from(selectedLeads));
      
      if (error) throw error;
      
      setSelectedLeads(new Set());
      window.location.reload();
    } catch (error) {
      console.error('Erro ao excluir leads:', error);
      alert('Erro ao excluir leads. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const { data: submissions = [], isLoading: loadingSubmissions } = useQuery<Lead[]>({
    queryKey: ["supabase-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const { data: funnelData = [], isLoading: loadingFunnel } = useQuery<FunnelData[]>({
    queryKey: ["supabase-funnel"],
    queryFn: async () => {
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      return [
        { step: 1, count: count || 0 },
        { step: 9, count: count || 0 }
      ];
    }
  });

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    
    const headers = ['Data', 'Nome', 'Email', 'Telefone', 'Cargo', 'Gargalo', 'Faturamento', 'Tamanho do Time', 'Segmento', 'Urgência', 'Tem Sócio', 'Rede Social', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'UTM Term', 'Referrer', 'Página Inicial', 'Página Atual', 'Dispositivo'];
    const rows = submissions.map(s => [
      formatDate(s.created_at),
      s.name || '',
      s.email || '',
      s.phone || '',
      s.role || '',
      s.bottleneck || '',
      s.revenue || '',
      s.team_size || '',
      s.segment || '',
      s.urgency || '',
      s.has_partner || '',
      s.social_media || '',
      s.utm_source || '',
      s.utm_medium || '',
      s.utm_campaign || '',
      s.utm_content || '',
      s.utm_term || '',
      s.referrer || '',
      s.first_page || '',
      s.current_page || '',
      s.device || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const todaySubmissions = submissions.filter(s => {
    if (!s.created_at) return false;
    const today = new Date();
    const subDate = new Date(s.created_at);
    return subDate.toDateString() === today.toDateString();
  }).length;

  const completionRate = (() => {
    const step1 = funnelData.find(f => f.step === 1)?.count || 0;
    const step9 = funnelData.find(f => f.step === 9)?.count || 0;
    if (step1 === 0) return 0;
    return Math.round((step9 / step1) * 100);
  })();

  const totalVisitors = funnelData.find(f => f.step === 1)?.count || 0;

  const formatDate = (date: Date | string | null | undefined) => {
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

  const getTimeSinceLastSubmission = () => {
    if (submissions.length === 0) return "Sem cadastros";
    const lastSubmission = submissions.reduce((latest, current) => {
      if (!current.created_at) return latest;
      if (!latest.created_at) return current;
      return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
    });
    if (!lastSubmission.created_at) return "Sem cadastros";
    
    const now = new Date();
    const lastDate = new Date(lastSubmission.created_at);
    const diffMs = now.getTime() - lastDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = (
        (sub.name?.toLowerCase().includes(term)) ||
        (sub.email?.toLowerCase().includes(term)) ||
        (sub.phone?.includes(term))
      );
      if (!matchesSearch) return false;
    }
    if (filters.device && sub.device !== filters.device) return false;
    if (filters.has_partner && sub.has_partner !== filters.has_partner) return false;
    if (filters.revenue && sub.revenue !== filters.revenue) return false;
    if (filters.urgency && sub.urgency !== filters.urgency) return false;
    if (filters.segment && sub.segment !== filters.segment) return false;
    if (filters.utm_source && sub.utm_source !== filters.utm_source) return false;
    return true;
  });

  const getUniqueValues = (key: keyof Lead) => {
    const values = submissions.map(s => s[key]).filter((v): v is string => !!v);
    return Array.from(new Set(values));
  };

  const clearFilters = () => {
    setFilters({
      device: '',
      has_partner: '',
      revenue: '',
      urgency: '',
      segment: '',
      utm_source: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  const getUrgencyBadge = (urgency: string | null) => {
    if (!urgency) return null;
    if (urgency.toLowerCase().includes("urgente") || urgency.toLowerCase().includes("agora")) {
      return (
        <span 
          className="whitespace-nowrap px-[20px] py-[10px]"
          style={{ 
            fontSize: '16px', 
            color: '#D91E35', 
            background: '#27080C', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '60px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          É urgente - preciso começar AGORA
        </span>
      );
    }
    if (urgency.includes("30")) {
      return (
        <span 
          className="whitespace-nowrap px-[20px] py-[10px]"
          style={{ 
            fontSize: '16px', 
            color: '#F2D11A', 
            background: '#1A1606', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '60px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Nos próximos 30 dias
        </span>
      );
    }
    if (urgency.includes("3 meses") || urgency.includes("90")) {
      return (
        <span 
          className="whitespace-nowrap px-[20px] py-[10px]"
          style={{ 
            fontSize: '16px', 
            color: '#6CEB7B', 
            background: '#122214', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '60px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Em até 3 meses
        </span>
      );
    }
    return (
      <span 
        className="whitespace-nowrap px-[20px] py-[10px]"
        style={{ 
          fontSize: '16px', 
          color: '#B9B9B9', 
          background: '#171717', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '60px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        Ainda estou pesquisando
      </span>
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#08090B' }}>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed lg:hidden top-0 left-0 h-full w-[280px] z-50 flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ 
          background: '#0C0D0F',
          borderRight: '1px solid rgba(255, 255, 255, 0.03)',
          padding: '20px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg className="flex-shrink-0" width="24" height="35" viewBox="0 0 24 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.715211 26.9572C2.27321 31.2693 2.36903 32.9023 1.73224 35C3.05303 33.3616 3.85068 32.463 6.01446 31.1173C14.8215 25.4572 13.8477 17.9698 13.6154 5.71315C10.0479 12.0987 7.29932 13.7005 2.05363 18.5261C-0.676304 21.1886 -0.194604 24.8494 0.715211 26.9572Z" fill="white" fillOpacity="0.82"/>
              <path d="M14.3651 5.71315C15.3795 18.8074 14.6317 24.8607 8.20937 30.6735C16.2185 27.7496 18.8098 20.4357 19.9855 0C18.3199 0.802974 17.6045 1.56356 16.6132 3.32805C15.84 4.57114 15.3313 5.04601 14.3651 5.71315Z" fill="white" fillOpacity="0.82"/>
            </svg>
            <span 
              className="font-medium text-[16px]"
              style={{
                background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Grupo Rugido
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#666]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div className="mt-auto pt-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[#6E707C] hover:text-white hover:bg-white/5 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
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
            <p className="text-[#6E707C] text-[13px] font-normal leading-[23.4px] mb-3">Painel Administrativo</p>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[#6E707C] hover:text-white hover:bg-white/5 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 p-3 md:p-4" style={{ background: '#08090B' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-[#666]"
              onClick={() => setMobileMenuOpen(true)}
              data-testid="button-mobile-menu"
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
            <svg className="hidden md:block" xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
              <path d="M20.487 9.26216L11.737 0.512158C11.4089 0.184217 10.9639 0 10.5 0C10.0361 0 9.59114 0.184217 9.26298 0.512158L0.51298 9.26216C0.349688 9.42424 0.220247 9.61716 0.132184 9.82972C0.0441203 10.0423 -0.000807906 10.2702 1.0996e-05 10.5003V21.0003C1.0996e-05 21.2323 0.0921984 21.4549 0.256293 21.619C0.420387 21.7831 0.642947 21.8753 0.875011 21.8753H20.125C20.3571 21.8753 20.5796 21.7831 20.7437 21.619C20.9078 21.4549 21 21.2323 21 21.0003V10.5003C21.0008 10.2702 20.9559 10.0423 20.8678 9.82972C20.7798 9.61716 20.6503 9.42424 20.487 9.26216ZM19.25 20.1253H1.75001V10.5003L10.5 1.75028L19.25 10.5003V20.1253Z" fill="#6E707C"/>
            </svg>
            <span className="hidden md:inline" style={{ color: '#6E707C', fontFamily: 'Inter', fontSize: '20px', fontWeight: 400, lineHeight: '23.4px' }}>Overview</span>
            <span className="hidden md:inline" style={{ color: '#6E707C', fontFamily: 'Inter', fontSize: '20px', fontWeight: 400 }}>/</span>
            <span style={{ color: '#FFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: 400 }} className="md:text-[18px]">Dashboard</span>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {/* Update Time */}
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7Z" fill="white" fillOpacity="0.1"/>
              <path d="M10 7C10 8.65685 8.65685 10 7 10C5.34315 10 4 8.65685 4 7C4 5.34315 5.34315 4 7 4C8.65685 4 10 5.34315 10 7Z" fill="white"/>
            </svg>
            <span style={{ color: '#6E707C', fontFamily: 'Inter', fontSize: '13px', fontWeight: 400, lineHeight: '23.4px' }}>Último Lead Cadastrado: <span style={{ color: '#FFF' }}>{getTimeSinceLastSubmission()}</span></span>
          </div>

          {/* Leads Section */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span 
                  className="text-white text-[48px] md:text-[77px]" 
                  style={{ fontFamily: 'Inter', fontWeight: 500 }}
                  data-testid="text-total-submissions"
                >
                  {loadingSubmissions ? "..." : submissions.length}
                </span>
                <span 
                  className="text-[24px] md:text-[38px]"
                  style={{ 
                    fontFamily: 'Inter', 
                    fontWeight: 500, 
                    lineHeight: '1.1',
                    width: '233px',
                    background: 'linear-gradient(88deg, #F6F6F8 6.29%, #A8B2BC 87%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Leads Cadastrados
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <div className="relative group flex-1 lg:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7F85] group-hover:text-white transition-colors" />
                  <input
                    placeholder="Buscar lead..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-[356px] pl-10 pr-4 text-[#7A7F85] placeholder:text-[#7A7F85] hover:text-white hover:placeholder:text-white focus:text-white focus:placeholder:text-white transition-colors"
                    style={{
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      background: '#0E0F12',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    data-testid="input-search"
                  />
                </div>
                {selectedLeads.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                    style={{
                      background: '#27080C',
                      border: '1px solid #E03232',
                      color: '#E03232',
                      fontFamily: 'Inter',
                      fontSize: '14px'
                    }}
                    data-testid="button-delete-selected"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Excluindo...' : `Excluir (${selectedLeads.size})`}
                  </button>
                )}
                <button 
                  onClick={handleExportCSV}
                  className="Documents-btn"
                  data-testid="button-export-csv"
                >
                  <span className="folderContainer">
                    <svg
                      className="fileBack"
                      width="146"
                      height="113"
                      viewBox="0 0 146 113"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                        fill="url(#paint0_linear_117_4)"
                      ></path>
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_4"
                          x1="0"
                          y1="0"
                          x2="72.93"
                          y2="95.4804"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#8F88C2"></stop>
                          <stop offset="1" stopColor="#5C52A2"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className="filePage"
                      width="88"
                      height="99"
                      viewBox="0 0 88 99"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="88" height="99" fill="url(#paint0_linear_117_6)"></rect>
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_6"
                          x1="0"
                          y1="0"
                          x2="81"
                          y2="160.5"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="white"></stop>
                          <stop offset="1" stopColor="#686868"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg
                      className="fileFront"
                      width="160"
                      height="79"
                      viewBox="0 0 160 79"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                        fill="url(#paint0_linear_117_5)"
                      ></path>
                      <defs>
                        <linearGradient
                          id="paint0_linear_117_5"
                          x1="38.7619"
                          y1="8.71323"
                          x2="66.9106"
                          y2="82.8317"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#C3BBFF"></stop>
                          <stop offset="1" stopColor="#51469A"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <p className="text">Exportar</p>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#979BA2' }}
                  data-testid="button-toggle-filters"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-[#A646E6] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-1 text-[#979BA2] hover:text-white"
                    data-testid="button-clear-filters"
                  >
                    <X className="w-4 h-4" />
                    Limpar filtros
                  </Button>
                )}
              </div>
              
              {showFilters && (
                <div className="mt-3 p-4 rounded-lg flex flex-wrap gap-3" style={{ background: '#101115', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <select
                    value={filters.device}
                    onChange={(e) => setFilters({ ...filters, device: e.target.value })}
                    className="px-3 py-2 rounded-md text-sm"
                    style={{ background: '#1A1A1F', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#979BA2' }}
                    data-testid="select-filter-device"
                  >
                    <option value="">Dispositivo</option>
                    {getUniqueValues('device').map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filters.has_partner}
                    onChange={(e) => setFilters({ ...filters, has_partner: e.target.value })}
                    className="px-3 py-2 rounded-md text-sm"
                    style={{ background: '#1A1A1F', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#979BA2' }}
                    data-testid="select-filter-partner"
                  >
                    <option value="">Tem Sócio</option>
                    {getUniqueValues('has_partner').map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filters.revenue}
                    onChange={(e) => setFilters({ ...filters, revenue: e.target.value })}
                    className="px-3 py-2 rounded-md text-sm"
                    style={{ background: '#1A1A1F', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#979BA2' }}
                    data-testid="select-filter-revenue"
                  >
                    <option value="">Faturamento</option>
                    {getUniqueValues('revenue').map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filters.urgency}
                    onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                    className="px-3 py-2 rounded-md text-sm"
                    style={{ background: '#1A1A1F', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#979BA2' }}
                    data-testid="select-filter-urgency"
                  >
                    <option value="">Urgência</option>
                    {getUniqueValues('urgency').map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filters.segment}
                    onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
                    className="px-3 py-2 rounded-md text-sm"
                    style={{ background: '#1A1A1F', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#979BA2' }}
                    data-testid="select-filter-segment"
                  >
                    <option value="">Segmento</option>
                    {getUniqueValues('segment').map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filters.utm_source}
                    onChange={(e) => setFilters({ ...filters, utm_source: e.target.value })}
                    className="px-3 py-2 rounded-md text-sm"
                    style={{ background: '#1A1A1F', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#979BA2' }}
                    data-testid="select-filter-utm"
                  >
                    <option value="">UTM Source</option>
                    {getUniqueValues('utm_source').map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto custom-scrollbar" style={{ background: '#0B0C0E', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
              <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                <thead>
                  <tr style={{ background: '#101115', borderBottom: '1px solid rgba(255, 255, 255, 0.03)', height: '63px' }}>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px', width: '50px' }}></th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Data</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Nome</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>E-mail</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Urgência</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Whatsapp</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Rede Social</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Cargo</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Gargalo</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Faturamento</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Tamanho do Time</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Segmento</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Tem Sócio</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>UTM Source</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>UTM Medium</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>UTM Campaign</th>
                    <th className="text-center px-4 whitespace-nowrap font-medium" style={{ color: '#979BA2', fontSize: '16px' }}>Dispositivo</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSubmissions ? (
                    <tr style={{ height: '53px' }}>
                      <td colSpan={17} className="text-center" style={{ color: '#979BA2', fontSize: '16px' }}>Carregando...</td>
                    </tr>
                  ) : filteredSubmissions.length === 0 ? (
                    <tr style={{ height: '53px' }}>
                      <td colSpan={17} className="text-center" style={{ color: '#979BA2', fontSize: '16px' }}>Nenhum lead encontrado</td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub, index) => (
                      <tr key={sub.id || index} className={`hover:bg-[#101115] ${sub.id && selectedLeads.has(sub.id) ? 'lead-row-selected' : ''}`} style={{ height: '53px', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                        <td className="text-center px-4">
                          <label className="cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="lead-checkbox"
                              checked={sub.id ? selectedLeads.has(sub.id) : false}
                              onChange={() => sub.id && toggleSelectLead(sub.id)}
                              data-testid={`checkbox-lead-${sub.id}`}
                            />
                            <span className="custom-checkbox-red"></span>
                          </label>
                        </td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{formatDate(sub.created_at)}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.name || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.email || "-"}</td>
                        <td className="text-center px-4">{getUrgencyBadge(sub.urgency)}</td>
                        <td className="text-center px-4">
                          {sub.phone ? (
                            <button
                              onClick={() => openWhatsApp(sub.phone)}
                              className="underline hover:opacity-80 whitespace-nowrap"
                              style={{ color: 'white', fontSize: '16px' }}
                              data-testid={`button-whatsapp-${sub.id}`}
                            >
                              {formatPhone(sub.phone)}
                            </button>
                          ) : (
                            <span style={{ color: '#979BA2', fontSize: '16px' }}>-</span>
                          )}
                        </td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.social_media || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.role || "-"}</td>
                        <td className="text-center px-4" style={{ color: '#979BA2', fontSize: '16px', minWidth: '200px', maxWidth: '250px' }}>
                          <span style={{ 
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden'
                          }}>
                            {sub.bottleneck || "-"}
                          </span>
                        </td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: 'white', fontSize: '16px' }}>{sub.revenue || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.team_size || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.segment || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.has_partner || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.utm_source || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.utm_medium || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.utm_campaign || "-"}</td>
                        <td className="text-center px-4 whitespace-nowrap" style={{ color: '#979BA2', fontSize: '16px' }}>{sub.device || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fluxo de Visitantes Section */}
          <div className="mt-8">
            <div className="flex items-start gap-2 mb-4">
              <svg className="mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7Z" fill="white" fillOpacity="0.1"/>
                <path d="M10 7C10 8.65685 8.65685 10 7 10C5.34315 10 4 8.65685 4 7C4 5.34315 5.34315 4 7 4C8.65685 4 10 5.34315 10 7Z" fill="white"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ color: '#6E707C', fontFamily: 'Inter', fontSize: '13px', fontWeight: 400, lineHeight: '23.4px' }}>Taxa de progresso</span>
                <span 
                  className="text-[24px] md:text-[38px]"
                  style={{ 
                    fontFamily: 'Inter', 
                    fontWeight: 500, 
                    lineHeight: '1.1',
                    background: 'linear-gradient(88deg, #F6F6F8 6.29%, #A8B2BC 87%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Fluxo de visitantes
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Visitantes Card */}
              <div 
                className="p-4 flex flex-col w-[calc(50%-8px)] md:w-[200px] h-[160px] md:h-[200px]"
                style={{ 
                  background: '#101115', 
                  border: '1px solid rgba(255, 255, 255, 0.03)', 
                  borderRadius: '12px'
                }}
              >
                <p style={{ color: '#979BA2', fontFamily: 'Inter', fontWeight: 500, marginBottom: '8px', fontSize: '14px' }}>Visitantes</p>
                <span className="text-[32px] md:text-[48px]" style={{ fontFamily: 'Inter', fontWeight: 500, color: 'white' }} data-testid="text-visitors">
                  {loadingFunnel ? "..." : totalVisitors}
                </span>
                <div className="flex items-center gap-1 mt-auto">
                  <span 
                    className="inline-flex items-center gap-1"
                    style={{ 
                      background: 'rgba(224, 50, 50, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '60px',
                      fontSize: '14px',
                      fontFamily: 'Inter',
                      color: '#E03232'
                    }}
                  >
                    <TrendingDown className="w-3 h-3" />
                    +1.06%
                  </span>
                </div>
              </div>

              {/* Taxa de Conversão Card */}
              <div 
                className="p-4 flex flex-col w-[calc(50%-8px)] md:w-[200px] h-[160px] md:h-[200px]"
                style={{ 
                  background: '#101115', 
                  border: '1px solid rgba(255, 255, 255, 0.03)', 
                  borderRadius: '12px'
                }}
              >
                <p style={{ color: '#979BA2', fontFamily: 'Inter', fontWeight: 500, marginBottom: '8px', fontSize: '14px' }}>Taxa de conversão</p>
                <span className="text-[32px] md:text-[48px]" style={{ fontFamily: 'Inter', fontWeight: 500, color: 'white' }} data-testid="text-conversion-rate">
                  {loadingFunnel ? "..." : `${completionRate}%`}
                </span>
                <div className="flex items-center gap-1 mt-auto">
                  <span 
                    className="inline-flex items-center gap-1"
                    style={{ 
                      background: 'rgba(224, 50, 50, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '60px',
                      fontSize: '14px',
                      fontFamily: 'Inter',
                      color: '#E03232'
                    }}
                  >
                    <TrendingDown className="w-3 h-3" />
                    +1.06%
                  </span>
                </div>
              </div>

              {/* Leads Novos Card */}
              <div 
                className="p-4 flex flex-col w-full md:w-[200px] h-[160px] md:h-[200px]"
                style={{ 
                  background: '#101115', 
                  border: '1px solid rgba(255, 255, 255, 0.03)', 
                  borderRadius: '12px'
                }}
              >
                <p style={{ color: '#979BA2', fontFamily: 'Inter', fontWeight: 500, marginBottom: '0', fontSize: '14px' }}>Leads novos</p>
                <p style={{ color: '#979BA2', fontSize: '12px', fontFamily: 'Inter', marginBottom: '8px' }}>Últimas 24h</p>
                <span className="text-[32px] md:text-[48px]" style={{ fontFamily: 'Inter', fontWeight: 500, color: 'white' }} data-testid="text-new-leads">
                  {loadingSubmissions ? "..." : todaySubmissions}
                </span>
                <div className="flex items-center gap-1 mt-auto">
                  <span 
                    className="inline-flex items-center gap-1"
                    style={{ 
                      background: 'rgba(16, 185, 129, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '60px',
                      fontSize: '14px',
                      fontFamily: 'Inter',
                      color: '#10B981'
                    }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    +1.06%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
