import { ArrowRightIcon, ArrowLeftIcon, ClockIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { apiRequest } from "@/lib/queryClient";

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

const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const Element = (): JSX.Element => {
  const [step, setStep] = useState(1);
  const [displayStep, setDisplayStep] = useState(1);
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
  const [isSegmentDropdownOpen, setIsSegmentDropdownOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const sessionIdRef = useRef<string>("");
  const trackedStepsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }
  }, []);

  const trackStepEvent = async (stepNumber: number) => {
    if (trackedStepsRef.current.has(stepNumber)) return;
    trackedStepsRef.current.add(stepNumber);
    try {
      await apiRequest("POST", "/api/step-events", {
        sessionId: sessionIdRef.current,
        step: stepNumber
      });
    } catch (error) {
      console.error("Failed to track step:", error);
    }
  };

  useEffect(() => {
    if (step >= 1) {
      trackStepEvent(step);
    }
  }, [step]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    if (value && !validateEmail(value)) {
      setEmailError("Por favor, insira um e-mail válido");
    } else {
      setEmailError("");
    }
  };

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

  const handleNext = async () => {
    if (step < 9) {
      transitionToStep(step + 1);
    } else {
      if (hasSubmitted) {
        console.log("Form already submitted, skipping duplicate submission");
        return;
      }
      setIsSubmitting(true);
      try {
        // Send directly to Google Sheets webhook (works on Vercel and Replit)
        const googleSheetsWebhook = "https://script.google.com/macros/s/AKfycbz5-Eeil0hsVpTes5FE7CaCJaBRVxzex_PutQZ5WiBU8J3TE1y2-o9TiBvrVjrvBDUH/exec";
        
        // Use URLSearchParams for form-encoded data (works with no-cors)
        const formBody = new URLSearchParams();
        Object.entries(formData).forEach(([key, value]) => {
          formBody.append(key, String(value || ''));
        });
        
        await fetch(googleSheetsWebhook, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody.toString(),
        });
        
        // Also try to save to local API (will work on Replit, fail silently on Vercel)
        try {
          await apiRequest("POST", "/api/submissions", formData);
        } catch {
          // Silently ignore - this is expected on Vercel
        }
        
        setHasSubmitted(true);
        console.log("Form submitted successfully:", formData);
      } catch (error) {
        console.error("Failed to submit form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      transitionToStep(step - 1);
    }
  };

  const renderWelcomeScreen = () => (
    <div className="bg-[#08090B] w-full h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
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
        <h1 
          className="font-['Inter'] font-medium text-[24px] sm:text-[32px] lg:text-[39.278px] text-center leading-[110%]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
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
          className="green-animated-button"
          data-testid="button-avancar"
        >
          <span>
            AVANÇAR
            <ArrowRightIcon className="arrow-icon w-[18px] h-[18px]" />
          </span>
        </button>
      </div>
    </div>
  );

  const renderFormLayout = (children: React.ReactNode, testimonialIndex: number) => (
    <div className="bg-[#08090B] w-full h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header with back button and logo */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#08090B]">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          disabled={isTransitioning}
          className="text-[#b7b7b7] hover:text-white hover:bg-transparent hover:opacity-30"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <img
          className="w-[20px] h-[29px]"
          alt="Logo"
          src="/figmaAssets/logo.png"
        />
      </div>
      
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
        <div className={`relative z-10 p-[120px] flex-1 flex flex-col justify-end transition-opacity duration-200 ease-in-out ${
          container1Visible ? 'opacity-100' : 'opacity-0'
        }`}>
          <h2 
            className="font-['Inter'] font-medium text-[39.278px] leading-[110%] mb-4"
            style={{ 
              width: displayStep === 1 ? '379px' :
                     displayStep === 5 ? '611px' : 
                     displayStep === 6 ? '638px' : 
                     displayStep === 7 ? '490px' : 
                     displayStep === 8 ? '505px' : 
                     displayStep === 9 ? '573px' : '591px',
              background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
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
        className={`flex-1 flex flex-col h-full lg:h-screen bg-[#08090B] overflow-hidden relative transition-opacity duration-200 ease-in-out ${
          container2Visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Desktop Back button positioned at top left */}
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          disabled={isTransitioning}
          className="hidden lg:flex absolute top-[20px] left-[20px] text-[#b7b7b7] hover:text-white hover:bg-transparent hover:opacity-30 z-10"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        
        {/* Desktop centered logo */}
        <div className="hidden lg:flex justify-center pt-[53px]">
          <img
            className="w-[44.263px] h-16"
            alt="Logo"
            src="/figmaAssets/logo.png"
          />
        </div>
        <div className="flex-1 flex flex-col items-center pt-[20px] lg:pt-[80px] px-4 sm:px-8 overflow-y-auto">
          <div className="w-full max-w-[290px] sm:max-w-[450px]">
            {children}
          </div>
        </div>
        {/* Testimonial - Responsive */}
        <div className="absolute bottom-[100px] sm:bottom-[130px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] sm:w-auto max-w-[592px]">
          <div className="relative">
            {/* Mobile: quotes above the box, aligned left */}
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="34" viewBox="0 0 58 50" fill="none" className="sm:hidden block mb-2 ml-0 w-[40px] h-[34px]">
              <path d="M33.5597 24.6227L33.5597 1.75022e-05L58 1.96389e-05L58 6.38367C58 16.3543 57.2704 23.7715 55.8113 28.6352C54.2306 33.6206 50.1572 40.673 43.5912 49.7925L33.195 43.956C38.6667 34.5933 41.8281 28.1489 42.6792 24.6227L33.5597 24.6227ZM0.364778 24.6227L0.36478 1.46002e-05L24.805 1.67369e-05L24.805 6.38367C24.805 16.3543 24.0755 23.7715 22.6163 28.6352C21.0356 33.6206 16.9623 40.673 10.3962 49.7925L-4.87465e-06 43.956C5.47169 34.5933 8.63312 28.1489 9.48427 24.6227L0.364778 24.6227Z" fill="#292830"/>
            </svg>
            {/* Desktop: quotes positioned to the left of the box */}
            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="50" viewBox="0 0 58 50" fill="none" className="hidden sm:block absolute -left-[39px] top-[21px] w-[58px] h-[50px]">
              <path d="M33.5597 24.6227L33.5597 1.75022e-05L58 1.96389e-05L58 6.38367C58 16.3543 57.2704 23.7715 55.8113 28.6352C54.2306 33.6206 50.1572 40.673 43.5912 49.7925L33.195 43.956C38.6667 34.5933 41.8281 28.1489 42.6792 24.6227L33.5597 24.6227ZM0.364778 24.6227L0.36478 1.46002e-05L24.805 1.67369e-05L24.805 6.38367C24.805 16.3543 24.0755 23.7715 22.6163 28.6352C21.0356 33.6206 16.9623 40.673 10.3962 49.7925L-4.87465e-06 43.956C5.47169 34.5933 8.63312 28.1489 9.48427 24.6227L0.364778 24.6227Z" fill="#292830"/>
            </svg>
            <div className="bg-[#0C0D0F] border border-white/5 rounded-[12px] px-[16px] sm:px-[30px] py-[12px] sm:py-[15px] w-full sm:w-[592px]">
              <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[14px] sm:text-[18px] leading-[1.3] mb-2">
                {testimonials[testimonialIndex]?.quote}
              </p>
              <p className="font-['Inter'] italic text-[#504E5D] text-[12px] sm:text-[14px] leading-[1.3]">
                {testimonials[testimonialIndex]?.author}
              </p>
            </div>
          </div>
        </div>
        <footer className="absolute bottom-[16px] sm:bottom-[20px] left-0 right-0 text-center px-4">
          <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[10px] sm:text-[11px] leading-[1.3] mb-[8px]">
            Ao PROSSEGUIR você automaticamente concordo com os <span className="underline">termos de uso</span> e <span className="underline">politica de privacidade</span>
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
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Primeiro, qual é a sua função na empresa?
        </h2>
        <div className="flex flex-col max-w-[450px]">
          {options.map((option, index) => (
            <div key={option}>
              <div 
                className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 py-[4px] ${
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
                  formData.role === option ? 'text-white' : 'text-[#6B717F]'
                }`}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] bg-white/5 my-[6px]" />
              )}
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
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Qual é o PRINCIPAL gargalo que está limitando a receita da sua empresa hoje?
        </h2>
        <div className="flex flex-col max-w-[450px]">
          {options.map((option, index) => (
            <div key={option}>
              <div 
                className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 py-[4px] ${
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
                  formData.bottleneck === option ? 'text-white' : 'text-[#6B717F]'
                }`}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] bg-white/5 my-[6px]" />
              )}
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
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Qual é o faturamento MENSAL aproximado da sua empresa?
        </h2>
        <div className="flex flex-col max-w-[450px]">
          {options.map((option, index) => (
            <div key={option}>
              <div 
                className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 py-[4px] ${
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
                  formData.revenue === option ? 'text-white' : 'text-[#6B717F]'
                }`}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] bg-white/5 my-[6px]" />
              )}
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
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Quantas pessoas trabalham na sua empresa hoje?
        </h2>
        <div className="flex flex-col max-w-[450px]">
          {options.map((option, index) => (
            <div key={option}>
              <div 
                className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 py-[4px] ${
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
                  formData.teamSize === option ? 'text-white' : 'text-[#6B717F]'
                }`}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] bg-white/5 my-[6px]" />
              )}
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
      setIsSegmentDropdownOpen(false);
      setTimeout(() => {
        transitionToStep(step + 1);
      }, 500);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Em qual segmento sua empresa atua?
        </h2>
        <div className="relative max-w-[450px]">
          {/* Dropdown trigger */}
          <div 
            className="flex items-center justify-between gap-[9px] cursor-pointer py-[12px] px-[16px] border border-white/10 rounded-[8px] transition-all duration-200 hover:border-[#A646E6]"
            onClick={() => setIsSegmentDropdownOpen(!isSegmentDropdownOpen)}
          >
            <div className="flex items-center gap-[9px]">
              <CustomCheck 
                checked={!!formData.segment}
                onClick={() => {}}
                className="mt-0"
              />
              <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] ${
                formData.segment ? 'text-white' : 'text-[#6B717F]'
              }`}>
                {formData.segment || "Selecione o segmento"}
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-[#b8b8b8] transition-transform duration-200 ${isSegmentDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Dropdown options */}
          <div 
            className={`absolute top-full left-0 right-0 mt-2 bg-[#0C0D0F] border border-white/10 rounded-[8px] overflow-hidden z-20 transition-all duration-200 ${
              isSegmentDropdownOpen ? 'opacity-100 max-h-[300px] overflow-y-auto' : 'opacity-0 max-h-0 pointer-events-none'
            }`}
          >
            {options.map((option, index) => (
              <div key={option}>
                <div 
                  className={`flex items-center gap-[9px] cursor-pointer py-[10px] px-[16px] transition-all duration-200 hover:bg-[#A646E6]/10 ${
                    formData.segment === option ? 'bg-[#A646E6]/10' : ''
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <CustomCheck 
                    checked={formData.segment === option}
                    onClick={() => {}}
                    className="mt-0"
                  />
                  <span className={`font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] ${
                    formData.segment === option ? 'text-white' : 'text-[#6B717F]'
                  }`}>
                    {option}
                  </span>
                </div>
                {index < options.length - 1 && (
                  <div className="h-[1px] bg-white/5 mx-[16px]" />
                )}
              </div>
            ))}
          </div>
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
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Para quando você precisa estruturar a receita da empresa?
        </h2>
        <div className="flex flex-col max-w-[450px]">
          {options.map((option, index) => (
            <div key={option}>
              <div 
                className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 py-[4px] ${
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
                  formData.urgency === option ? 'text-white' : 'text-[#6B717F]'
                }`}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] bg-white/5 my-[6px]" />
              )}
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
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Você tem sócio(s) na empresa?
        </h2>
        <div className="flex flex-col max-w-[450px]">
          {options.map((option, index) => (
            <div key={option}>
              <div 
                className={`flex items-start gap-[9px] cursor-pointer transition-opacity duration-200 py-[4px] ${
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
                  formData.hasPartner === option ? 'text-white' : 'text-[#6B717F]'
                }`}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] bg-white/5 my-[6px]" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getSocialMediaType = (url: string): 'instagram' | 'linkedin' | null => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com') || lowerUrl.startsWith('@')) {
      return 'instagram';
    }
    if (lowerUrl.includes('linkedin.com')) {
      return 'linkedin';
    }
    return null;
  };

  const getSocialMediaUsername = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('@')) {
      return url.substring(1);
    }
    if (url.includes('instagram.com/')) {
      const match = url.match(/instagram\.com\/([^/?]+)/);
      return match ? match[1] : '';
    }
    if (url.includes('linkedin.com/')) {
      const match = url.match(/linkedin\.com\/(?:company|in)\/([^/?]+)/);
      return match ? match[1] : '';
    }
    return url;
  };

  const renderSocialMediaQuestion = () => {
    const socialType = getSocialMediaType(formData.socialMedia);
    const username = getSocialMediaUsername(formData.socialMedia);

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <div className="flex flex-col gap-3 sm:gap-4">
          <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[14px] sm:text-[18px] leading-[1.3]">
            Para conhecermos melhor sua empresa, nos informe:
          </p>
          <h2 
            className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
            style={{
              background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Qual o Instagram ou LinkedIn da empresa?
          </h2>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="custom-input-group">
            <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="custom-input-icon">
              <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
            <input
              value={formData.socialMedia}
              onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
              placeholder="@suaempresa ou URL do LinkedIn"
              className="custom-input"
              data-testid="input-social"
            />
          </div>
          
          {socialType && username && (
            <div className="mt-2 p-4 bg-[#1a1a1a] rounded-[10px] border border-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                {socialType === 'instagram' ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#833AB4] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-white font-['Inter'] font-medium text-sm">
                    {socialType === 'instagram' ? 'Instagram' : 'LinkedIn'}
                  </span>
                  <span className="text-[#b8b8b8] font-['Inter'] text-xs">
                    @{username}
                  </span>
                </div>
                <div className="ml-auto">
                  <svg className="w-4 h-4 text-[#0b9a1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="green-animated-button w-full"
            data-testid="button-avancar"
          >
            <span>
              AVANÇAR
              <ArrowRightIcon className="arrow-icon w-[18px] h-[18px]" />
            </span>
          </button>
        </div>
      </div>
    );
  };

  const renderContactForm = () => (
    <div className="flex flex-col gap-6 sm:gap-[37px]">
      <div className="flex flex-col gap-3 sm:gap-4">
        <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[14px] sm:text-[18px] leading-[1.3]">
          Perfeito! Agora vamos agendar sua Reunião Estratégica.
        </p>
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            background: 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Por favor, confirme seus dados de contato:
        </h2>
      </div>
      <div className="flex flex-col gap-[8px]">
        <div className="custom-input-group">
          <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="custom-input-icon">
            <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinejoin="round" strokeLinecap="round"></path>
          </svg>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite seu nome"
            className="custom-input"
            data-testid="input-name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className={`custom-input-group ${emailError ? 'has-error' : ''}`}>
            <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="custom-input-icon">
              <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
            <input
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Digite seu e-mail profissional"
              type="email"
              className={`custom-input ${emailError ? 'input-error' : ''}`}
              data-testid="input-email"
            />
          </div>
          {emailError && (
            <span className="text-red-500 text-xs font-['Inter'] ml-1">{emailError}</span>
          )}
        </div>
        <div className="custom-input-group">
          <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="custom-input-icon">
            <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" strokeLinejoin="round" strokeLinecap="round"></path>
          </svg>
          <InputMask
            mask="(99) 9.9999-9999"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          >
            {(inputProps: any) => (
              <input
                {...inputProps}
                placeholder="(00) 9.0000-0000"
                type="tel"
                className="custom-input"
                data-testid="input-phone"
              />
            )}
          </InputMask>
        </div>
        <button
          onClick={handleNext}
          disabled={!formData.name || !formData.email || !formData.phone || emailError !== "" || isTransitioning}
          className="green-animated-button w-full disabled:opacity-50"
          data-testid="button-prosseguir"
        >
          <span>
            PROSSEGUIR
            <ArrowRightIcon className="arrow-icon w-[18px] h-[18px]" />
          </span>
        </button>
      </div>
    </div>
  );

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
