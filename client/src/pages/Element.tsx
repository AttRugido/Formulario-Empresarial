import { ArrowRightIcon, ArrowLeftIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import logoArtsPortas from "@assets/Logo_branco_e_amarelo_1766593059522.png";
import logoWallTravel from "@assets/Logo_Branco_1766593059522.png";
import logoTimbo from "@assets/logo_timbo_1766593059523.png";
import logoRainha from "@assets/Logo_rainha_1766593059523.png";
import logoLuzianaLanna from "@assets/logo_LL_1766593059523.png";
import logoHidrogyn from "@assets/Logo_Hg_1766593059522.png";
import logoGranMoney from "@assets/Logo_Gran_Money_Branco_1766593059522.png";
import logoCenter from "@assets/Group_2_1766593059521.png";
import logoMansaoMaromba from "@assets/logotipo_MM-PA_horizontal_1766593332339.png";

const CustomCheck = ({ checked, onClick, className }: { checked: boolean; onClick: () => void; className?: string }) => (
  <div className={`custom-check ${checked ? 'checked' : ''} ${className || ''}`} onClick={onClick}>
    <svg viewBox="0 0 18 18" height="18px" width="18px">
      <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
      <polyline points="1 9 7 14 15 4" />
    </svg>
  </div>
);

interface FormData {
  role: string;
  bottleneck: string;
  revenue: string;
  teamSize: string;
  segment: string;
  urgency: string;
  hasPartner: string;
  socialMedia: string;
  name: string;
  email: string;
  phone: string;
}

const testimonials = [
  {
    quote: "Antes eu ficava apagando incêndios. Depois do Grupo Rugido, montei um sistema que vende sem depender de mim.",
    author: "-Kalil Jordy, CEO da Mansão Maromba"
  },
  {
    quote: "Descobrimos que nosso gargalo não era marketing, era follow-up. Corrigimos isso e dobramos em 60 dias.",
    author: "-Adriano Francisco, Diretor da GranMoney"
  },
  {
    quote: "Fiquei 8 meses enrolando porque achava caro. Quando calculei quanto perdi procrastinando, vi que era 4x o investimento.",
    author: "-Wallace Correia, Fundador da WallTravel"
  },
  {
    quote: "Eu era refém do comercial. Se o vendedor saísse, eu quebrava. Hoje tenho um sistema que funciona sem depender de 'estrelas'.",
    author: "-Wemerson Jabour, Diretor da Arts Portas"
  },
  {
    quote: "No nosso segmento, ninguém tinha processo. Fomos os primeiros a estruturar e viramos referência de crescimento.",
    author: "-Rosana Silva, CEO da Rainha Motel"
  },
  {
    quote: "Estava procrastinando há 6 meses. Quando finalmente estruturei, me perguntei: por que não fiz isso antes?",
    author: "-Lívia Fagundes, Fundadora da Hidrogyn"
  },
  {
    quote: "Eu e minha sócia sempre discordávamos. O diagnóstico do Grupo Rugido nos mostrou os números reais e alinhou tudo.",
    author: "-Kenya e Luzia, Sócias da Luziana Lanna"
  },
  {
    quote: "Quando vi que eles tinham estudado nosso Instagram antes da call, percebi que não era um papo genérico. Era personalizado.",
    author: "-Marcos Silva, Diretor da Timbo Bike"
  },
  {
    quote: "O formulário já foi um diagnóstico. Quando chegou a ligação, o consultor sabia EXATAMENTE do que eu precisava.",
    author: "-Walter, CEO da Center Cidade Nova"
  }
];

const sidebarMessages = [
  "",
  "Junte-se a quem já estruturou receita",
  "87% das empresas perdem dinheiro sem saber onde",
  "Receita previsível não é sorte. É sistema.",
  "Estrutura escalável para qualquer tamanho de operação",
  "Metodologia testada em 60+ empresas de diversos mercados",
  "Cada mês sem estrutura é receita que você nunca mais recupera",
  "Dados que alinham sócios",
  "Preparação personalizada. Zero papo genérico.",
  "Você está a 24 horas de ter clareza total sobre sua receita"
];

export const Element = (): JSX.Element => {
  const [step, setStep] = useState(0);
  const [displayStep, setDisplayStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [container1Visible, setContainer1Visible] = useState(true);
  const [container2Visible, setContainer2Visible] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    role: "",
    bottleneck: "",
    revenue: "",
    teamSize: "",
    segment: "",
    urgency: "",
    hasPartner: "",
    socialMedia: "",
    name: "",
    email: "",
    phone: ""
  });

  const transitionToStep = (newStep: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Fade out both containers
    setContainer1Visible(false);
    setContainer2Visible(false);
    
    setTimeout(() => {
      // Update step and fade in both containers together
      setStep(newStep);
      setDisplayStep(newStep);
      setContainer1Visible(true);
      setContainer2Visible(true);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }, 200);
  };

  const handleNext = () => {
    if (step < 9) {
      transitionToStep(step + 1);
    } else {
      console.log("Form submitted:", formData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      transitionToStep(step - 1);
    }
  };

  const renderWelcomeScreen = () => (
    <div className="bg-[#090909] w-full h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
      <div 
        className={`flex flex-col items-center gap-4 sm:gap-6 w-full max-w-[690px] transition-opacity duration-200 ease-in-out ${
          container2Visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          className="w-[44.26px] h-16"
          alt="Logo"
          src="/figmaAssets/logo.png"
        />
        <h1 className="font-['Inter'] font-medium text-white text-[24px] sm:text-[32px] lg:text-[39.278px] text-center leading-[110%]">
          Obrigado pelo interesse em estruturar a receita da sua empresa!
        </h1>
        <p className="font-['Inter'] font-normal text-[#b7b7b7] text-base sm:text-lg text-center leading-[1.3]">
          Antes de agendar sua reunião estratégica, responda algumas perguntas para personalizarmos nossa conversa.
        </p>
        <div className="flex flex-col gap-1 items-center">
          <ClockIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#b7b7b7]" />
          <p className="font-['Inter'] font-normal text-[#b7b7b7] text-base sm:text-lg text-center leading-[1.3]">
            Isso leva apenas 2 minutos
          </p>
        </div>
        <button 
          onClick={handleNext}
          disabled={isTransitioning}
          className="green-3d-button w-full sm:w-auto"
          data-testid="button-avancar"
        >
          <span className="uppercase">AVANÇAR</span>
          <ArrowRightIcon className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );

  const renderFormLayout = (children: React.ReactNode, testimonialIndex: number) => (
    <div className="bg-[#0a0a0a] w-full h-screen flex overflow-hidden">
      {/* Container 1 - Left Sidebar */}
      <div 
        className={`hidden lg:flex w-[46.7%] bg-[#121212] flex-col relative overflow-hidden transition-opacity duration-200 ease-in-out ${
          container1Visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 897 836" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M2.03444 808.821C17.1929 965.5 32.4734 1043.01 -7.87744 1106.45C51.8152 1064.45 80.3883 1012.04 166.337 987.444C517.783 881.289 557.512 586.451 658.012 179.582C479.437 357.736 337.732 433.82 115.533 545.076C-1.43885 607.964 -10.4482 730.877 2.03444 808.821Z" fill="white" fillOpacity="0.01"/>
          <path d="M683.665 186.454C602.518 628.153 527.914 855.741 256.717 988.806C577.955 950.246 731.073 691.51 927.523 0C863.423 11.244 832.038 63.2881 782.505 112.466C745.047 146.426 722.632 173.283 683.665 186.454Z" fill="white" fillOpacity="0.01"/>
          <path d="M942.308 42.1156C803.582 530.653 724.92 749.992 561.09 866.963C772.603 802.13 868.013 741.977 1026.89 255.029C988.662 227.553 971.901 210.971 970.99 155.758C974.461 113.499 959.585 83.2633 942.308 42.1156Z" fill="white" fillOpacity="0.01"/>
        </svg>
        <div className="relative z-10 p-[120px] flex-1 flex flex-col justify-end">
          <h2 className="font-['Inter'] font-medium text-white text-[39.278px] leading-[110%] w-[379px] mb-4">
            {sidebarMessages[displayStep]}
          </h2>
          {displayStep === 1 && (
            <>
              <div className="w-[418px] h-[1px] bg-white/20 mt-[17px] mb-[17px]" />
              <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[18px] leading-[1.3] w-[417px] mb-6">
                Veja abaixo algumas empresas que multiplicaram as vendas com a nossa ajuda:
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <img src={logoArtsPortas} alt="Arts Portas" className="h-8 w-auto" />
                  <img src={logoWallTravel} alt="Wall Travel" className="h-4 w-auto" />
                  <img src={logoTimbo} alt="Timbo" className="h-6 w-auto" />
                  <img src={logoRainha} alt="Rainha" className="h-10 w-auto" />
                </div>
                <div className="flex items-center gap-4">
                  <img src={logoMansaoMaromba} alt="Mansão Maromba" className="h-5 w-auto" />
                  <img src={logoLuzianaLanna} alt="Luziana Lanna" className="h-6 w-auto" />
                </div>
                <div className="flex items-center gap-4">
                  <img src={logoGranMoney} alt="Gran Money" className="h-7 w-auto" />
                  <img src={logoHidrogyn} alt="Hidrogyn" className="h-12 w-auto" />
                  <img src={logoCenter} alt="Center" className="h-10 w-auto" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Container 2 - Right Content */}
      <div 
        className={`flex-1 flex flex-col h-screen bg-[#0a0a0a] overflow-hidden relative transition-opacity duration-200 ease-in-out ${
          container2Visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Back button positioned at top left */}
        <Button
          onClick={handleBack}
          variant="ghost"
          disabled={isTransitioning}
          className="absolute top-[16px] left-[16px] sm:top-[20px] sm:left-[20px] text-[#b7b7b7] hover:text-white gap-2 px-0 z-10"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-['Inter'] text-sm sm:text-base">Voltar</span>
        </Button>
        <div className="flex justify-center pt-[40px] sm:pt-[53px]">
          <img
            className="w-[36px] h-[52px] sm:w-[44.263px] sm:h-16"
            alt="Logo"
            src="/figmaAssets/logo.png"
          />
        </div>
        <div className="flex-1 flex flex-col items-center pt-[40px] sm:pt-[80px] px-4 sm:px-8 overflow-y-auto">
          <div className="w-full max-w-[290px] sm:max-w-[450px]">
            {children}
          </div>
        </div>
        {/* Testimonial - Hidden on mobile */}
        <div className="hidden md:block absolute bottom-[100px] left-1/2 -translate-x-1/2">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="50" viewBox="0 0 58 50" fill="none" className="absolute -left-[39px] top-[21px]">
              <path d="M33.5597 24.6227L33.5597 1.75022e-05L58 1.96389e-05L58 6.38367C58 16.3543 57.2704 23.7715 55.8113 28.6352C54.2306 33.6206 50.1572 40.673 43.5912 49.7925L33.195 43.956C38.6667 34.5933 41.8281 28.1489 42.6792 24.6227L33.5597 24.6227ZM0.364778 24.6227L0.36478 1.46002e-05L24.805 1.67369e-05L24.805 6.38367C24.805 16.3543 24.0755 23.7715 22.6163 28.6352C21.0356 33.6206 16.9623 40.673 10.3962 49.7925L-4.87465e-06 43.956C5.47169 34.5933 8.63312 28.1489 9.48427 24.6227L0.364778 24.6227Z" fill="#222222"/>
            </svg>
            <div className="bg-[#151515] border border-white/5 rounded-[12px] px-[30px] py-[15px] w-[592px]">
              <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[18px] leading-[1.3] w-[532px] mb-2">
                {testimonials[testimonialIndex]?.quote}
              </p>
              <p className="font-['Inter'] italic text-[#5e5e5e] text-[14px] leading-[1.3] w-[532px]">
                {testimonials[testimonialIndex]?.author}
              </p>
            </div>
          </div>
        </div>
        <footer className="absolute bottom-[16px] sm:bottom-[20px] left-0 right-0 text-center px-4">
          <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[10px] sm:text-[11px] leading-[1.3] mb-[8px]">
            Ao clicar em PROSSEGUIR você automaticamente concordo com os <span className="underline">termos de uso</span> e <span className="underline">politica de privacidade</span>
          </p>
          <p className="font-['Inter'] font-normal text-[#565656] text-[8px] sm:text-[9px] leading-[1.3]">
            © 2025 Grupo Rugido. CNPJ: 39.617.248/0001-31 Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  );

  const renderRoleQuestion = () => {
    const options = [
      "Fundador(a) ou CEO",
      "Sócio(a)",
      "Diretor(a) Comercial/Vendas",
      "Gerente Comercial",
      "Analista/Coordenador",
      "Outro cargo"
    ];

    const handleOptionClick = (option: string) => {
      if (isTransitioning) return;
      setFormData({ ...formData, role: option });
      setTimeout(() => {
        transitionToStep(step + 1);
      }, 500);
    };
    
    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Primeiro, qual é a sua função na empresa?
        </h2>
        <div className="flex flex-col gap-[10px] max-w-[450px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.role && formData.role !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.role === option}
                onClick={() => {}}
                className="mt-[4px]"
              />
              <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px] ${
                formData.role === option ? 'text-white' : 'text-[#b8b8b8]'
              }`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBottleneckQuestion = () => {
    const options = [
      "Não tenho volume suficiente de oportunidades",
      "Tenho leads, mas a conversão é baixa",
      "Vendas dependem 100% de mim (fundador)",
      "Time comercial não performa consistentemente",
      "Não sei meus números reais de vendas",
      "Tenho todos esses problemas"
    ];

    const handleOptionClick = (option: string) => {
      if (isTransitioning) return;
      setFormData({ ...formData, bottleneck: option });
      setTimeout(() => {
        transitionToStep(step + 1);
      }, 500);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Qual é o PRINCIPAL gargalo que está limitando a receita da sua empresa hoje?
        </h2>
        <div className="flex flex-col gap-[10px] max-w-[450px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.bottleneck && formData.bottleneck !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.bottleneck === option}
                onClick={() => {}}
                className="mt-[4px]"
              />
              <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px] ${
                formData.bottleneck === option ? 'text-white' : 'text-[#b8b8b8]'
              }`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRevenueQuestion = () => {
    const options = [
      "Até R$30 mil",
      "Entre R$30 mil e R$70 mil",
      "Entre R$70 mil e R$150 mil",
      "Entre R$150 mil e R$300 mil",
      "Entre R$300 mil e R$1 milhão",
      "Acima de R$1 milhão"
    ];

    const handleOptionClick = (option: string) => {
      if (isTransitioning) return;
      setFormData({ ...formData, revenue: option });
      setTimeout(() => {
        transitionToStep(step + 1);
      }, 500);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Qual é o faturamento MENSAL aproximado da sua empresa?
        </h2>
        <div className="flex flex-col gap-[10px] max-w-[450px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.revenue && formData.revenue !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.revenue === option}
                onClick={() => {}}
                className="mt-[4px]"
              />
              <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px] ${
                formData.revenue === option ? 'text-white' : 'text-[#b8b8b8]'
              }`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTeamSizeQuestion = () => {
    const options = [
      "Só eu (solopreneur)",
      "2 a 5 pessoas",
      "6 a 15 pessoas",
      "16 a 30 pessoas",
      "31 a 50 pessoas",
      "Mais de 50 pessoas"
    ];

    const handleOptionClick = (option: string) => {
      if (isTransitioning) return;
      setFormData({ ...formData, teamSize: option });
      setTimeout(() => {
        transitionToStep(step + 1);
      }, 500);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Quantas pessoas trabalham na sua empresa hoje?
        </h2>
        <div className="flex flex-col gap-[10px] max-w-[450px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.teamSize && formData.teamSize !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.teamSize === option}
                onClick={() => {}}
                className="mt-[4px]"
              />
              <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px] ${
                formData.teamSize === option ? 'text-white' : 'text-[#b8b8b8]'
              }`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSegmentQuestion = () => {
    const options = [
      "Serviços B2B",
      "Serviços B2C",
      "E-commerce",
      "Indústria",
      "Saúde e Bem-estar",
      "Educação e Treinamentos",
      "SaaS / Tecnologia",
      "Construção / Imobiliário",
      "Agência / Marketing",
      "Varejo Físico",
      "Outro"
    ];

    const handleOptionClick = (option: string) => {
      if (isTransitioning) return;
      setFormData({ ...formData, segment: option });
      setTimeout(() => {
        transitionToStep(step + 1);
      }, 500);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Em qual segmento sua empresa atua?
        </h2>
        <div className="flex flex-col gap-[10px] max-w-[450px] max-h-[300px] sm:max-h-[400px] overflow-y-auto">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.segment && formData.segment !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.segment === option}
                onClick={() => {}}
                className="mt-[4px]"
              />
              <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px] ${
                formData.segment === option ? 'text-white' : 'text-[#b8b8b8]'
              }`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUrgencyQuestion = () => {
    const options = [
      "É urgente - preciso começar AGORA",
      "Próximos 30 dias",
      "Em até 3 meses",
      "Ainda estou pesquisando"
    ];

    const handleOptionClick = (option: string) => {
      if (isTransitioning) return;
      setFormData({ ...formData, urgency: option });
      setTimeout(() => {
        transitionToStep(step + 1);
      }, 500);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Para quando você precisa estruturar a receita da empresa?
        </h2>
        <div className="flex flex-col gap-[10px] max-w-[450px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.urgency && formData.urgency !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.urgency === option}
                onClick={() => {}}
                className="mt-[4px]"
              />
              <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px] ${
                formData.urgency === option ? 'text-white' : 'text-[#b8b8b8]'
              }`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPartnerQuestion = () => {
    const options = [
      "Sim",
      "Não"
    ];

    const handleOptionClick = (option: string) => {
      if (isTransitioning) return;
      setFormData({ ...formData, hasPartner: option });
      setTimeout(() => {
        transitionToStep(step + 1);
      }, 500);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Você tem sócio(s) na empresa?
        </h2>
        <div className="flex flex-col gap-[10px] max-w-[450px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.hasPartner && formData.hasPartner !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.hasPartner === option}
                onClick={() => {}}
                className="mt-[4px]"
              />
              <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px] ${
                formData.hasPartner === option ? 'text-white' : 'text-[#b8b8b8]'
              }`}>
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSocialMediaQuestion = () => (
    <div className="flex flex-col gap-6 sm:gap-[37px]">
      <div className="flex flex-col gap-3 sm:gap-4">
        <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[14px] sm:text-[18px] leading-[1.3]">
          Para conhecermos melhor sua empresa, nos informe:
        </p>
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Qual o Instagram ou LinkedIn da empresa?
        </h2>
      </div>
      <Input
        value={formData.socialMedia}
        onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
        placeholder="@suaempresa ou URL do LinkedIn"
        className="h-[42px] sm:h-[45px] bg-transparent border-[#333] text-white placeholder:text-[#666] font-['Inter'] text-[16px] sm:text-[18px]"
      />
      <Button
        onClick={handleNext}
        disabled={isTransitioning}
        className="h-11 sm:h-12 bg-[#0b9a1c] hover:bg-[#0b9a1c]/90 rounded-[8px] px-6 sm:px-[40px] py-[12px] sm:py-[15px] gap-[10px] w-full"
      >
        <span className="font-['Inter'] font-normal text-white/70 text-[16px] sm:text-[18px] leading-[1.3] uppercase">
          Avançar
        </span>
        <ArrowRightIcon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-white/70" />
      </Button>
    </div>
  );

  const renderContactForm = () => (
    <div className="flex flex-col gap-6 sm:gap-[37px]">
      <div className="flex flex-col gap-3 sm:gap-4">
        <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[14px] sm:text-[18px] leading-[1.3]">
          Perfeito! Agora vamos agendar sua Reunião Estratégica.
        </p>
        <h2 className="font-['Inter'] font-medium text-white text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]">
          Por favor, confirme seus dados de contato:
        </h2>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-['Inter'] text-[#b8b8b8] text-xs sm:text-sm">
            Seu nome completo <span className="text-[#0b9a1c]">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite seu nome"
            className="h-[42px] sm:h-[45px] bg-transparent border-[#333] text-white placeholder:text-[#666] font-['Inter'] text-[16px] sm:text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-['Inter'] text-[#b8b8b8] text-xs sm:text-sm">
            Seu melhor e-mail <span className="text-[#0b9a1c]">*</span>
          </label>
          <Input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Digite seu e-mail profissional"
            type="email"
            className="h-[42px] sm:h-[45px] bg-transparent border-[#333] text-white placeholder:text-[#666] font-['Inter'] text-[16px] sm:text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-['Inter'] text-[#b8b8b8] text-xs sm:text-sm">
            WhatsApp (com DDD) <span className="text-[#0b9a1c]">*</span>
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Digite seu WhatsApp"
            type="tel"
            className="h-[42px] sm:h-[45px] bg-transparent border-[#333] text-white placeholder:text-[#666] font-['Inter'] text-[16px] sm:text-[18px]"
          />
        </div>
      </div>
      <Button
        onClick={handleNext}
        disabled={!formData.name || !formData.email || !formData.phone || isTransitioning}
        className="h-11 sm:h-12 bg-[#0b9a1c] hover:bg-[#0b9a1c]/90 rounded-[8px] px-6 sm:px-[40px] py-[12px] sm:py-[15px] gap-[10px] w-full disabled:opacity-50"
      >
        <span className="font-['Inter'] font-normal text-white/70 text-[16px] sm:text-[18px] leading-[1.3] uppercase">
          Avançar
        </span>
        <ArrowRightIcon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-white/70" />
      </Button>
    </div>
  );

  if (step === 0) {
    return renderWelcomeScreen();
  }

  const stepContent = () => {
    switch (step) {
      case 1:
        return renderRoleQuestion();
      case 2:
        return renderBottleneckQuestion();
      case 3:
        return renderRevenueQuestion();
      case 4:
        return renderTeamSizeQuestion();
      case 5:
        return renderSegmentQuestion();
      case 6:
        return renderUrgencyQuestion();
      case 7:
        return renderPartnerQuestion();
      case 8:
        return renderSocialMediaQuestion();
      case 9:
        return renderContactForm();
      default:
        return null;
    }
  };

  return renderFormLayout(stepContent(), step - 1);
};
