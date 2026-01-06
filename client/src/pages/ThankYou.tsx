import { CheckCircle, AlertTriangle, Clock, Phone, ArrowRightIcon, Sun, Moon } from "lucide-react";
import { useState } from "react";

import sidebarBgLight from "@assets/Frame_3_1767052037501.png";

export const ThankYou = (): JSX.Element => {
  const whatsappNumber = "554197184915";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    bg: isDarkMode ? '#08090B' : '#FFFFFF',
    bgGradient: isDarkMode 
      ? 'linear-gradient(163deg, #1B1B20 -0.04%, #0C0D0F 90.1%)' 
      : 'linear-gradient(163deg, #F5F5F7 -0.04%, #E8E8EA 90.1%)',
    text: isDarkMode ? '#FFFFFF' : '#08090B',
    textSecondary: isDarkMode ? '#b8b8b8' : '#666666',
    textTertiary: isDarkMode ? '#565656' : '#888888',
    textGradient: isDarkMode 
      ? 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)' 
      : 'linear-gradient(92deg, #08090B 3.96%, #4A4A4A 136.52%)',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
    cardBg: isDarkMode ? '#101115' : '#F5F5F7',
    divider: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    logo: isDarkMode ? '/figmaAssets/logo.png' : '/figmaAssets/logo-light-mode.svg',
  };

  return (
    <div style={{ backgroundColor: theme.bg }} className="h-screen flex overflow-hidden">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full transition-all duration-200"
        style={{
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          border: `1px solid ${theme.border}`
        }}
        data-testid="button-theme-toggle"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" style={{ color: theme.text }} />
        ) : (
          <Moon className="w-5 h-5" style={{ color: theme.text }} />
        )}
      </button>

      {/* Container 1 - Left (Fixed, 50% width) */}
      <div 
        className="hidden lg:flex w-1/2 h-screen flex-col relative overflow-hidden flex-shrink-0"
        style={{
          background: theme.bgGradient,
          borderRight: `1px solid ${theme.border}`
        }}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 897 836" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M2.03444 808.821C17.1929 965.5 32.4734 1043.01 -7.87744 1106.45C51.8152 1064.45 80.3883 1012.04 166.337 987.444C517.783 881.289 557.512 586.451 658.012 179.582C479.437 357.736 337.732 433.82 115.533 545.076C-1.43885 607.964 -10.4482 730.877 2.03444 808.821Z" fill="white" fillOpacity="0.01"/>
            <path d="M683.665 186.454C602.518 628.153 527.914 855.741 256.717 988.806C577.955 950.246 731.073 691.51 927.523 0C863.423 11.244 832.038 63.2881 782.505 112.466C745.047 146.426 722.632 173.283 683.665 186.454Z" fill="white" fillOpacity="0.01"/>
            <path d="M942.308 42.1156C803.582 530.653 724.92 749.992 561.09 866.963C772.603 802.13 868.013 741.977 1026.89 255.029C988.662 227.553 971.901 210.971 970.99 155.758C974.461 113.499 959.585 83.2633 942.308 42.1156Z" fill="white" fillOpacity="0.01"/>
          </svg>
        ) : (
          <img 
            src={sidebarBgLight} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="relative z-10 p-[120px] flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-12 h-12 text-[#10B981]" />
            <h2 
              className="font-['Inter'] font-medium text-[39.278px] leading-[110%]"
              style={{
                backgroundImage: theme.textGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Parabéns!
            </h2>
          </div>
          <p className="font-['Inter'] font-normal text-[18px] leading-[1.4] max-w-[450px]" style={{ color: theme.textSecondary }}>
            Você deu o primeiro passo para estruturar a receita da sua empresa de forma previsível e escalável.
          </p>
        </div>
      </div>

      {/* Container 2 - Right (Scrollable, 50% width) */}
      <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto h-screen custom-scrollbar" style={{ backgroundColor: theme.bg }}>
        {/* Logo */}
        <div className="flex justify-center pt-6 lg:pt-[53px]">
          <img
            className="w-[44.263px] h-16"
            alt="Logo"
            src={theme.logo}
          />
        </div>

        <div className="flex-1 flex flex-col items-center px-4 sm:px-8 py-8 lg:py-12">
          <div className="w-full max-w-[600px] flex flex-col gap-8">
            
            {/* Section 1: Success Message */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
                <CheckCircle className="w-8 h-8 text-[#10B981]" />
              </div>
              <h1 
                className="font-['Inter'] font-medium text-[24px] sm:text-[32px] leading-[110%] mb-4"
                style={{
                  backgroundImage: theme.textGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Pré-inscrição confirmada com sucesso!
              </h1>
              <p className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.4]" style={{ color: theme.textSecondary }}>
                Um especialista da Rugido entrará em contato em até 24 horas para agendar sua Reunião Estratégica.
              </p>
            </div>

            {/* CTA: Skip the line */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[#FFA500]">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-['Inter'] font-medium text-[16px]">Não quer esperar?</span>
              </div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button 
                  className="green-animated-button w-full sm:w-auto"
                  data-testid="button-urgent-cta-top"
                >
                  <span>
                    QUERO SER ATENDIDO AGORA
                    <ArrowRightIcon className="arrow-icon w-[18px] h-[18px]" />
                  </span>
                </button>
              </a>
              <p className="font-['Inter'] font-normal text-[12px]" style={{ color: theme.textTertiary }}>
                aperte o botão caso precise pular a fila
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px]" style={{ backgroundColor: theme.divider }} />

            {/* Section 2: What you'll receive */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2">
                  <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 17l-5-5-4 4-3-3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="font-['Inter'] font-medium text-[18px] sm:text-[20px]" style={{ color: theme.text }}>
                  O QUE VOCÊ VAI RECEBER NA REUNIÃO:
                </h2>
              </div>
              <div className="flex flex-col gap-3 pl-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-[14px] sm:text-[16px]" style={{ color: theme.textSecondary }}>
                    <span className="font-semibold" style={{ color: theme.text }}>Matriz 4R Personalizada</span> (mapeamento completo da sua receita)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-[14px] sm:text-[16px]" style={{ color: theme.textSecondary }}>
                    <span className="font-semibold" style={{ color: theme.text }}>Diagnóstico dos Gargalos Invisíveis</span> (análise com IA)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-[14px] sm:text-[16px]" style={{ color: theme.textSecondary }}>
                    <span className="font-semibold" style={{ color: theme.text }}>Protocolo Caixa Rápido</span> (como fazer R$ 50-150k nos próximos 30 dias)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-[14px] sm:text-[16px]" style={{ color: theme.textSecondary }}>
                    <span className="font-semibold" style={{ color: theme.text }}>Plano de Ação 6 Meses</span> (roadmap de crescimento previsível)
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-[12px]" style={{ background: theme.cardBg, border: `1px solid ${theme.border}` }}>
                <p className="font-['Inter'] text-[14px] line-through" style={{ color: theme.textTertiary }}>Valor total desta consultoria: R$ 8.000</p>
                <p className="font-['Inter'] text-[#10B981] text-[18px] font-semibold">Seu investimento hoje: R$ 0</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px]" style={{ backgroundColor: theme.divider }} />

            {/* Section 3: What happens now */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" style={{ color: theme.text }} />
                <h2 className="font-['Inter'] font-medium text-[18px] sm:text-[20px]" style={{ color: theme.text }}>
                  O QUE ACONTECE AGORA:
                </h2>
              </div>
              <div className="flex flex-col gap-3 pl-2">
                <div className="flex items-center gap-3">
                  <span className="font-['Inter'] font-semibold text-[#A646E6] text-[16px]">1.</span>
                  <p className="font-['Inter'] text-[14px] sm:text-[16px]" style={{ color: theme.textSecondary }}>Nosso time analisa seu perfil</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-['Inter'] font-semibold text-[#A646E6] text-[16px]">2.</span>
                  <p className="font-['Inter'] text-[14px] sm:text-[16px]" style={{ color: theme.textSecondary }}>Se você se qualificar, recebe WhatsApp confirmando vaga</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-['Inter'] font-semibold text-[#A646E6] text-[16px]">3.</span>
                  <p className="font-['Inter'] text-[14px] sm:text-[16px]" style={{ color: theme.textSecondary }}>Agendamos sua Reunião de Diagnóstico</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-['Inter'] font-semibold text-[#A646E6] text-[16px]">4.</span>
                  <p className="font-['Inter'] text-[14px] sm:text-[16px]" style={{ color: theme.textSecondary }}>Você recebe os 4 entregáveis na própria reunião</p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-[12px] flex items-start gap-3" style={{ background: 'rgba(255, 165, 0, 0.1)', border: '1px solid rgba(255, 165, 0, 0.3)' }}>
                <AlertTriangle className="w-5 h-5 text-[#FFA500] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-['Inter'] text-[#FFA500] text-[14px] font-semibold">IMPORTANTE: Temos apenas 7 vagas disponíveis este mês.</p>
                  <p className="font-['Inter'] text-[13px] mt-1" style={{ color: theme.textSecondary }}>
                    Se não houver vaga, você entra na fila de espera (próximas vagas: 45-60 dias)
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px]" style={{ backgroundColor: theme.divider }} />

            {/* Section 5: Urgent CTA */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                  <path d="M12 2L8 10h8l-4 12 8-14h-8l4-6z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="font-['Inter'] font-medium text-[18px] sm:text-[20px]" style={{ color: theme.text }}>
                  PRECISA DE ATENDIMENTO URGENTE?
                </h2>
              </div>
              <p className="font-['Inter'] font-normal text-[14px] sm:text-[16px] mb-4" style={{ color: theme.textSecondary }}>
                Se sua situação é crítica e você não pode esperar 24h:
              </p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                <button 
                  className="green-animated-button"
                  data-testid="button-urgent-cta-bottom"
                >
                  <span>
                    QUERO SER ATENDIDO AGORA
                    <ArrowRightIcon className="arrow-icon w-[18px] h-[18px]" />
                  </span>
                </button>
              </a>
              <p className="font-['Inter'] font-normal text-[12px] mt-2" style={{ color: theme.textTertiary }}>
                aperte o botão caso precise pular a fila
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px]" style={{ backgroundColor: theme.divider }} />

            {/* Footer message */}
            <div className="text-center pb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Phone className="w-5 h-5" style={{ color: theme.textSecondary }} />
                <p className="font-['Inter'] font-medium text-[16px]" style={{ color: theme.textSecondary }}>
                  Fique atento ao WhatsApp e e-mail!
                </p>
              </div>
              <p className="font-['Inter'] font-normal text-[14px]" style={{ color: theme.textTertiary }}>
                Equipe Grupo Rugido
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="text-center px-4 py-4" style={{ borderTop: `1px solid ${theme.border}` }}>
          <p className="font-['Inter'] font-normal text-[9px] leading-[1.3]" style={{ color: theme.textTertiary }}>
            © 2025 Grupo Rugido. CNPJ: 39.617.248/0001-31 Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ThankYou;
