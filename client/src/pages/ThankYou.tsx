import { CheckCircle, AlertTriangle, Download, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThankYou = (): JSX.Element => {
  const whatsappLink = "https://wa.me/5511999999999";
  const checklistLink = "#";

  return (
    <div className="bg-[#08090B] min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Container 1 - Left Sidebar (Desktop only) */}
      <div 
        className="hidden lg:flex w-[46.7%] flex-col relative overflow-hidden"
        style={{
          background: 'linear-gradient(163deg, #1B1B20 -0.04%, #0C0D0F 90.1%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 897 836" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M2.03444 808.821C17.1929 965.5 32.4734 1043.01 -7.87744 1106.45C51.8152 1064.45 80.3883 1012.04 166.337 987.444C517.783 881.289 557.512 586.451 658.012 179.582C479.437 357.736 337.732 433.82 115.533 545.076C-1.43885 607.964 -10.4482 730.877 2.03444 808.821Z" fill="white" fillOpacity="0.01"/>
          <path d="M683.665 186.454C602.518 628.153 527.914 855.741 256.717 988.806C577.955 950.246 731.073 691.51 927.523 0C863.423 11.244 832.038 63.2881 782.505 112.466C745.047 146.426 722.632 173.283 683.665 186.454Z" fill="white" fillOpacity="0.01"/>
          <path d="M942.308 42.1156C803.582 530.653 724.92 749.992 561.09 866.963C772.603 802.13 868.013 741.977 1026.89 255.029C988.662 227.553 971.901 210.971 970.99 155.758C974.461 113.499 959.585 83.2633 942.308 42.1156Z" fill="white" fillOpacity="0.01"/>
        </svg>
        <div className="relative z-10 p-[120px] flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-12 h-12 text-[#10B981]" />
            <h2 
              className="font-['Inter'] font-medium text-[39.278px] leading-[110%]"
              style={{
                background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Parabéns!
            </h2>
          </div>
          <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[18px] leading-[1.4] max-w-[450px]">
            Você deu o primeiro passo para estruturar a receita da sua empresa de forma previsível e escalável.
          </p>
        </div>
      </div>

      {/* Container 2 - Right Content */}
      <div className="flex-1 flex flex-col bg-[#08090B] overflow-y-auto">
        {/* Logo */}
        <div className="flex justify-center pt-6 lg:pt-[53px]">
          <img
            className="w-[44.263px] h-16"
            alt="Logo"
            src="/figmaAssets/logo.png"
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
                  background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Pré-inscrição confirmada com sucesso!
              </h1>
              <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[16px] sm:text-[18px] leading-[1.4]">
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
                <Button 
                  className="w-full sm:w-auto px-8 py-6 text-[16px] font-semibold"
                  style={{ 
                    background: '#DC2626', 
                    color: 'white',
                    borderRadius: '8px'
                  }}
                  data-testid="button-urgent-cta-top"
                >
                  QUERO SER ATENDIDO AGORA
                </Button>
              </a>
              <p className="font-['Inter'] font-normal text-[#565656] text-[12px]">
                aperte o botão caso precise pular a fila
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10" />

            {/* Section 2: What you'll receive */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[20px]" role="img" aria-label="chart">📊</span>
                <h2 className="font-['Inter'] font-medium text-white text-[18px] sm:text-[20px]">
                  O QUE VOCÊ VAI RECEBER NA REUNIÃO:
                </h2>
              </div>
              <div className="flex flex-col gap-3 pl-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-[#b8b8b8] text-[14px] sm:text-[16px]">
                    <span className="font-semibold text-white">Matriz 4R Personalizada</span> (mapeamento completo da sua receita)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-[#b8b8b8] text-[14px] sm:text-[16px]">
                    <span className="font-semibold text-white">Diagnóstico dos Gargalos Invisíveis</span> (análise com IA)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-[#b8b8b8] text-[14px] sm:text-[16px]">
                    <span className="font-semibold text-white">Protocolo Caixa Rápido</span> (como fazer R$ 50-150k nos próximos 30 dias)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p className="font-['Inter'] text-[#b8b8b8] text-[14px] sm:text-[16px]">
                    <span className="font-semibold text-white">Plano de Ação 6 Meses</span> (roadmap de crescimento previsível)
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-[12px]" style={{ background: '#101115', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <p className="font-['Inter'] text-[#565656] text-[14px] line-through">Valor total desta consultoria: R$ 8.000</p>
                <p className="font-['Inter'] text-[#10B981] text-[18px] font-semibold">Seu investimento hoje: R$ 0</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10" />

            {/* Section 3: Download material */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[20px]" role="img" aria-label="gift">🎁</span>
                <h2 className="font-['Inter'] font-medium text-white text-[18px] sm:text-[20px]">
                  ENQUANTO AGUARDA A CONFIRMAÇÃO...
                </h2>
              </div>
              <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[14px] sm:text-[16px] mb-4">
                Preparamos um material exclusivo para você começar a entender onde sua receita está travada:
              </p>
              <a href={checklistLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  variant="outline"
                  className="w-full py-6 text-[14px] sm:text-[16px] font-medium flex items-center justify-center gap-2"
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    background: 'transparent'
                  }}
                  data-testid="button-download-checklist"
                >
                  <Download className="w-5 h-5" />
                  BAIXAR CHECKLIST: 7 SINAIS DE QUE SUA EMPRESA PRECISA DE ENGENHARIA DE RECEITA
                </Button>
              </a>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10" />

            {/* Section 4: What happens now */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-white" />
                <h2 className="font-['Inter'] font-medium text-white text-[18px] sm:text-[20px]">
                  O QUE ACONTECE AGORA:
                </h2>
              </div>
              <div className="flex flex-col gap-3 pl-2">
                <div className="flex items-center gap-3">
                  <span className="font-['Inter'] font-semibold text-[#A646E6] text-[16px]">1.</span>
                  <p className="font-['Inter'] text-[#b8b8b8] text-[14px] sm:text-[16px]">Nosso time analisa seu perfil</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-['Inter'] font-semibold text-[#A646E6] text-[16px]">2.</span>
                  <p className="font-['Inter'] text-[#b8b8b8] text-[14px] sm:text-[16px]">Se você se qualificar, recebe WhatsApp confirmando vaga</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-['Inter'] font-semibold text-[#A646E6] text-[16px]">3.</span>
                  <p className="font-['Inter'] text-[#b8b8b8] text-[14px] sm:text-[16px]">Agendamos sua Reunião de Diagnóstico</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-['Inter'] font-semibold text-[#A646E6] text-[16px]">4.</span>
                  <p className="font-['Inter'] text-[#b8b8b8] text-[14px] sm:text-[16px]">Você recebe os 4 entregáveis na própria reunião</p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-[12px] flex items-start gap-3" style={{ background: 'rgba(255, 165, 0, 0.1)', border: '1px solid rgba(255, 165, 0, 0.3)' }}>
                <AlertTriangle className="w-5 h-5 text-[#FFA500] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-['Inter'] text-[#FFA500] text-[14px] font-semibold">IMPORTANTE: Temos apenas 7 vagas disponíveis este mês.</p>
                  <p className="font-['Inter'] text-[#b8b8b8] text-[13px] mt-1">
                    Se não houver vaga, você entra na fila de espera (próximas vagas: 45-60 dias)
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10" />

            {/* Section 5: Urgent CTA */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-[20px]" role="img" aria-label="fire">🔥</span>
                <h2 className="font-['Inter'] font-medium text-white text-[18px] sm:text-[20px]">
                  PRECISA DE ATENDIMENTO URGENTE?
                </h2>
              </div>
              <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[14px] sm:text-[16px] mb-4">
                Se sua situação é crítica e você não pode esperar 24h:
              </p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button 
                  className="px-8 py-6 text-[16px] font-semibold flex items-center gap-2"
                  style={{ 
                    background: '#DC2626', 
                    color: 'white',
                    borderRadius: '8px'
                  }}
                  data-testid="button-urgent-cta-bottom"
                >
                  <Phone className="w-5 h-5" />
                  QUERO SER ATENDIDO AGORA
                </Button>
              </a>
              <p className="font-['Inter'] font-normal text-[#565656] text-[12px] mt-2">
                aperte o botão caso precise pular a fila
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10" />

            {/* Footer message */}
            <div className="text-center pb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-[#b8b8b8]" />
                <p className="font-['Inter'] font-medium text-[#b8b8b8] text-[16px]">
                  Fique atento ao WhatsApp e e-mail!
                </p>
              </div>
              <p className="font-['Inter'] font-normal text-[#565656] text-[14px]">
                Equipe Grupo Rugido
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="text-center px-4 py-4 border-t border-white/5">
          <p className="font-['Inter'] font-normal text-[#565656] text-[9px] leading-[1.3]">
            © 2025 Grupo Rugido. CNPJ: 39.617.248/0001-31 Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ThankYou;
