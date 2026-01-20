import { ArrowRightIcon, ArrowLeftIcon, ClockIcon, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { supabase } from "@/lib/supabase";
import { useAttribution } from "@/hooks/useAttribution";
import { useToast } from "@/hooks/use-toast";

import logoArtsPortas from "@assets/Logo_branco_e_amarelo_1766593059522.png";
import logoWallTravel from "@assets/Logo_Branco_1766593059522.png";
import logoTimbo from "@assets/logo_timbo_1766593059523.png";
import logoRainha from "@assets/Logo_rainha_1766593059523.png";
import logoLuzianaLanna from "@assets/logo_LL_1766593059523.png";
import logoHidrogyn from "@assets/Logo_Hg_1766593059522.png";
import logoGranMoney from "@assets/Logo_Gran_Money_Branco_1766593059522.png";
import logoCenter from "@assets/Group_2_1766593059521.png";
import logoMansaoMaromba from "@assets/logotipo_MM-PA_horizontal_1766593332339.png";

import logoArtsPortasLight from "@assets/Mask_group_1767051532408.png";
import logoWallTravelLight from "@assets/Mask_groupw_1767051532408.png";
import logoTimboLight from "@assets/ewe_1767051532407.png";
import logoRainhaLight from "@assets/argaa_1767051532407.png";
import logoLuzianaLannaLight from "@assets/logo_LL_1767051532407.png";
import logoHidrogynLight from "@assets/aerfgf_1767051532406.png";
import logoGranMoneyLight from "@assets/aegfv_1767051532406.png";
import logoCenterLight from "@assets/ghsrdtg_1767051532407.png";
import logoMansaoMarombaLight from "@assets/agerg_1767051532407.png";
import sidebarBgLight from "@assets/Frame_3_1767052037501.png";
import container1Bg1 from "@assets/1_1767891534544.png";
import container1Bg2 from "@assets/2_1767892144873.png";
import container1Bg3 from "@assets/3_1767894721025.png";
import container1Bg4 from "@assets/4_1767894721025.png";
import container1Bg5 from "@assets/5_1767895408099.png";
import container1Bg6 from "@assets/6_1767897192141.png";
import container1Bg8 from "@assets/8_1767899140293.png";

const CustomCheck = ({ checked, onClick, className, isLightMode }: { checked: boolean; onClick: () => void; className?: string; isLightMode?: boolean }) => (
  <div className={`custom-check ${checked ? 'checked' : ''} ${isLightMode ? 'light-mode' : ''} ${className || ''}`} onClick={onClick}>
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
  "Preparação personalizada. Zero papo genérico.",
  "Estrutura escalável para qualquer tamanho de operação",
  "Metodologia testada em 60+ empresas de diversos mercados",
  "Cada mês sem estrutura é receita que você nunca mais recupera",
  "Dados que alinham sócios",
  "Você está a 24 horas de ter clareza total sobre sua receita"
];

export const Element = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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
  const attribution = useAttribution();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme colors
  const theme = {
    bg: isDarkMode ? '#08090B' : '#FFFFFF',
    bgSecondary: isDarkMode ? '#1B1B20' : '#F5F5F7',
    bgGradient: isDarkMode 
      ? 'linear-gradient(163deg, #1B1B20 -0.04%, #0C0D0F 90.1%)' 
      : 'linear-gradient(163deg, #F5F5F7 -0.04%, #E8E8EA 90.1%)',
    text: isDarkMode ? '#FFFFFF' : '#08090B',
    textSecondary: isDarkMode ? '#b7b7b7' : '#666666',
    textGradient: isDarkMode 
      ? 'linear-gradient(92deg, #F6F6F8 3.96%, #5D656C 136.52%)' 
      : 'linear-gradient(92deg, #08090B 3.96%, #4A4A4A 136.52%)',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
    inputBg: isDarkMode ? '#131316' : '#F0F0F2',
    inputBorder: isDarkMode ? '#1c1d21' : '#D0D0D5',
    cardBg: isDarkMode ? '#1A1A1F' : '#F8F8FA',
    cardBorder: isDarkMode ? '#27272F' : '#E0E0E5',
    optionBg: isDarkMode ? '#131316' : '#FFFFFF',
    optionBorder: isDarkMode ? '#222' : '#E0E0E5',
    optionHoverBg: isDarkMode ? '#222' : '#F0F0F2',
  };

  
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
    
    // Instant transition
    setStep(newStep);
    setDisplayStep(newStep);
    
    setIsTransitioning(false);
  };

  const handleNext = async () => {
    if (step < 9) {
      transitionToStep(step + 1);
    } else {
      if (hasSubmitted) {
        console.log("Form already submitted, skipping duplicate submission");
        return;
      }
      
      console.log("Starting form submission...");
      console.log("Form data:", formData);
      console.log("Attribution data:", attribution);
      
      setIsSubmitting(true);
      try {
        // Save to Supabase
        const insertData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          bottleneck: formData.bottleneck,
          revenue: formData.revenue,
          team_size: formData.teamSize,
          segment: formData.segment,
          urgency: formData.urgency,
          has_partner: formData.hasPartner,
          social_media: formData.socialMedia,
          utm_source: attribution.utm_source || null,
          utm_medium: attribution.utm_medium || null,
          utm_campaign: attribution.utm_campaign || null,
          utm_content: attribution.utm_content || null,
          utm_term: attribution.utm_term || null,
          referrer: attribution.referrer || null,
          first_page: attribution.first_page || null,
          current_page: attribution.current_page || null,
          device: attribution.device || null
        };
        
        console.log("Inserting data to Supabase:", insertData);
        
        const { data, error } = await supabase.from('leads').insert(insertData).select();
        
        console.log("Supabase response - data:", data);
        console.log("Supabase response - error:", error);
        
        if (error) {
          console.error("Error saving to Supabase:", error);
          toast({
            title: "Erro ao enviar",
            description: error.message || "Ocorreu um erro ao enviar seus dados. Tente novamente.",
            variant: "destructive"
          });
          throw error;
        }
        
        // Send all data to webhook directly
        const webhookData = {
          ...insertData,
          submitted_at: new Date().toISOString()
        };
        
        try {
          // Try direct call first (works if webhook has CORS enabled)
          const webhookResponse = await fetch('https://webhook-agencia.lucasfelix.com/webhook/dfcd0293-86ea-4d13-9d41-8c09efaae495', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          });
          console.log("Webhook sent successfully, status:", webhookResponse.status);
        } catch (webhookError) {
          // Fallback: use no-cors mode (request still sent, just can't read response)
          try {
            await fetch('https://webhook-agencia.lucasfelix.com/webhook/dfcd0293-86ea-4d13-9d41-8c09efaae495', {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain',
              },
              body: JSON.stringify(webhookData),
              mode: 'no-cors'
            });
            console.log("Webhook sent via no-cors mode");
          } catch (fallbackError) {
            console.error("Webhook error (non-blocking):", fallbackError);
          }
        }
        
        setHasSubmitted(true);
        console.log("Form submitted successfully:", formData);
        
        // Push lead event to GTM dataLayer
        if (typeof window !== 'undefined') {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: 'generate_lead',
            lead_source: 'form_submission',
            form_name: 'grupo_rugido_lead_form',
            user_role: formData.role,
            user_bottleneck: formData.bottleneck,
            user_revenue: formData.revenue,
            user_team_size: formData.teamSize,
            user_segment: formData.segment,
            user_urgency: formData.urgency,
            user_partner_status: formData.hasPartner
          });
          console.log("GTM dataLayer push: generate_lead event");
        }
        
        // Redirect to /obrigado2 for qualified leads (revenue >= R$50k)
        const qualifiedRevenues = [
          "Entre R$40 mil e R$70 mil",
          "Entre R$70 mil e R$150 mil",
          "Entre R$150 mil e R$300 mil",
          "Entre R$300 mil e R$1 milhão",
          "Acima de R$1 milhão"
        ];
        const isQualifiedLead = qualifiedRevenues.includes(formData.revenue);
        setLocation(isQualifiedLead ? "/obrigado2" : "/obrigado");
      } catch (error: any) {
        console.error("Failed to submit form:", error);
        toast({
          title: "Erro ao enviar",
          description: error?.message || "Ocorreu um erro ao enviar seus dados. Tente novamente.",
          variant: "destructive"
        });
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
    <div className="w-full h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 relative" style={{ backgroundColor: theme.bg }}>
      {/* Theme Toggle Button */}
      <Button
        onClick={() => setIsDarkMode(!isDarkMode)}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50"
        style={{ color: theme.textSecondary }}
        data-testid="button-theme-toggle"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>
      <div 
        className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-[690px]"
      >
        {isDarkMode ? (
          <img
            className="w-[44.26px] h-16"
            alt="Logo"
            src="/figmaAssets/logo.png"
          />
        ) : (
          <img
            className="w-[44.26px] h-16"
            alt="Logo"
            src="/figmaAssets/logo-light-mode.svg"
          />
        )}
        <h1 
          className="font-['Inter'] font-medium text-[24px] sm:text-[32px] lg:text-[39.278px] text-center leading-[110%]"
          style={{
            backgroundImage: theme.textGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Obrigado pelo interesse em estruturar a receita da sua empresa!
        </h1>
        <p className="font-['Inter'] font-normal text-base sm:text-lg text-center leading-[1.3]" style={{ color: theme.textSecondary }}>
          Antes de agendar sua reunião estratégica, responda algumas perguntas para personalizarmos nossa conversa.
        </p>
        <div className="flex flex-col gap-1 items-center">
          <ClockIcon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: theme.textSecondary }} />
          <p className="font-['Inter'] font-normal text-base sm:text-lg text-center leading-[1.3]" style={{ color: theme.textSecondary }}>
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
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden" style={{ backgroundColor: theme.bg }}>
      {/* Mobile Header with back button and logo */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3" style={{ backgroundColor: theme.bg }}>
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          disabled={isTransitioning}
          className="hover:bg-transparent hover:opacity-30"
          style={{ color: theme.textSecondary }}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant="ghost"
            size="icon"
            style={{ color: theme.textSecondary }}
            data-testid="button-theme-toggle-mobile"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          {isDarkMode ? (
            <img
              className="w-[20px] h-[29px]"
              alt="Logo"
              src="/figmaAssets/logo.png"
            />
          ) : (
            <img
              className="w-[20px] h-[29px]"
              alt="Logo"
              src="/figmaAssets/logo-light-mode.svg"
            />
          )}
        </div>
      </div>
      
      {/* Container 1 - Left Sidebar (Desktop only) - Always Dark Mode with background image */}
      <div 
        className="hidden lg:flex w-[46.7%] flex-col relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #17151C 0%, #211F26 50%, #141118 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Background images with crossfade transition */}
        <img 
          src={container1Bg1} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 1 ? 1 : 0 }}
        />
        <img 
          src={container1Bg2} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 2 ? 1 : 0 }}
        />
        <img 
          src={container1Bg3} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 3 ? 1 : 0 }}
        />
        <img 
          src={container1Bg8} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 4 ? 1 : 0 }}
        />
        <img 
          src={container1Bg4} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 5 ? 1 : 0 }}
        />
        <img 
          src={container1Bg5} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 6 ? 1 : 0 }}
        />
        <img 
          src={container1Bg6} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 7 ? 1 : 0 }}
        />
        <img 
          src={container1Bg1} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 8 ? 1 : 0 }}
        />
        <img 
          src={container1Bg8} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out"
          style={{ opacity: displayStep === 9 ? 1 : 0 }}
        />
        <div className={`relative z-10 p-[120px] flex-1 flex flex-col justify-end transition-opacity duration-200 ease-in-out ${
          container1Visible ? 'opacity-100' : 'opacity-0'
        }`}>
          <h2 
            className="font-['Inter'] font-medium text-[39.278px] leading-[110%] mb-4"
            style={{ 
              width: displayStep === 1 ? '379px' :
                     displayStep === 4 ? '505px' :
                     displayStep === 6 ? '611px' : 
                     displayStep === 7 ? '638px' : 
                     displayStep === 8 ? '490px' : 
                     displayStep === 9 ? '573px' : '591px',
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {sidebarMessages[displayStep]}
          </h2>
          {displayStep === 1 && (
            <>
              <div className="w-[418px] h-[1px] mt-[17px] mb-[17px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
              <p className="font-['Inter'] font-normal text-[18px] leading-[1.3] w-[417px] mb-6" style={{ color: '#858585' }}>
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
        className="flex-1 flex flex-col h-full lg:h-screen overflow-hidden relative"
        style={{ backgroundColor: theme.bg }}
      >
        {/* Desktop Back button positioned at top left */}
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          disabled={isTransitioning}
          className="hidden lg:flex absolute top-[20px] left-[20px] hover:bg-transparent hover:opacity-30 z-10"
          style={{ color: theme.textSecondary }}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        
        {/* Desktop Theme Toggle button positioned at top right */}
        <Button
          onClick={() => setIsDarkMode(!isDarkMode)}
          variant="ghost"
          size="icon"
          className="hidden lg:flex absolute top-[20px] right-[20px] z-10"
          style={{ color: theme.textSecondary }}
          data-testid="button-theme-toggle-desktop"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        
        {/* Desktop centered logo */}
        <div className="hidden lg:flex justify-center pt-[16px]">
          {isDarkMode ? (
            <img
              className="w-[40px] h-14"
              alt="Logo"
              src="/figmaAssets/logo.png"
            />
          ) : (
            <img
              className="w-[40px] h-14"
              alt="Logo"
              src="/figmaAssets/logo-light-mode.svg"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col items-center pt-[16px] lg:pt-[20px] px-4 sm:px-8 overflow-y-auto">
          <div className="w-full max-w-[290px] sm:max-w-[450px]">
            {children}
          </div>
        </div>
        {/* Testimonial - Visible on lg screens with reduced padding for smaller displays */}
        <div className="hidden lg:block absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[90%] lg:w-[85%] xl:w-auto xl:max-w-[540px]">
          <div className="relative">
            {/* Desktop: quotes positioned to the left of the box */}
            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="50" viewBox="0 0 58 50" fill="none" className="absolute -left-[39px] top-[21px] w-[58px] h-[50px]">
              <path d="M33.5597 24.6227L33.5597 1.75022e-05L58 1.96389e-05L58 6.38367C58 16.3543 57.2704 23.7715 55.8113 28.6352C54.2306 33.6206 50.1572 40.673 43.5912 49.7925L33.195 43.956C38.6667 34.5933 41.8281 28.1489 42.6792 24.6227L33.5597 24.6227ZM0.364778 24.6227L0.36478 1.46002e-05L24.805 1.67369e-05L24.805 6.38367C24.805 16.3543 24.0755 23.7715 22.6163 28.6352C21.0356 33.6206 16.9623 40.673 10.3962 49.7925L-4.87465e-06 43.956C5.47169 34.5933 8.63312 28.1489 9.48427 24.6227L0.364778 24.6227Z" fill={isDarkMode ? "#292830" : "#D0D0D5"}/>
            </svg>
            <div className="rounded-[10px] px-[12px] lg:px-[16px] xl:px-[20px] py-[8px] lg:py-[10px] w-full" style={{ backgroundColor: isDarkMode ? '#0C0D0F' : '#F5F5F7', border: `1px solid ${theme.border}` }}>
              <p className="font-['Inter'] font-normal text-[12px] lg:text-[13px] xl:text-[15px] leading-[1.25] mb-1" style={{ color: theme.textSecondary }}>
                {testimonials[testimonialIndex]?.quote}
              </p>
              <p className="font-['Inter'] italic text-[10px] lg:text-[11px] xl:text-[12px] leading-[1.25]" style={{ color: isDarkMode ? '#504E5D' : '#999999' }}>
                {testimonials[testimonialIndex]?.author}
              </p>
            </div>
          </div>
        </div>
        <footer className="absolute bottom-[16px] sm:bottom-[20px] left-0 right-0 text-center px-4">
          <p className="font-['Inter'] font-normal text-[10px] sm:text-[11px] leading-[1.3] mb-[8px]" style={{ color: theme.textSecondary }}>
            Ao PROSSEGUIR você automaticamente concordo com os <span className="underline">termos de uso</span> e <span className="underline">politica de privacidade</span>
          </p>
          <p className="font-['Inter'] font-normal text-[8px] sm:text-[9px] leading-[1.3]" style={{ color: isDarkMode ? '#565656' : '#999999' }}>
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
      }, 0);
    };
    
    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            backgroundImage: theme.textGradient,
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
                className={`flex items-start gap-[9px] cursor-pointer py-[4px] ${
                  formData.role && formData.role !== option ? 'opacity-50' : 'opacity-100'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <CustomCheck 
                  checked={formData.role === option}
                  onClick={() => {}}
                  className="mt-[4px]"
                  isLightMode={!isDarkMode}
                />
                <span className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px]" style={{ color: formData.role === option ? theme.text : theme.textSecondary }}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] my-[6px]" style={{ backgroundColor: theme.border }} />
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
      }, 0);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            backgroundImage: theme.textGradient,
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
                className={`flex items-start gap-[9px] cursor-pointer py-[4px] ${
                  formData.bottleneck && formData.bottleneck !== option ? 'opacity-50' : 'opacity-100'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <CustomCheck 
                  checked={formData.bottleneck === option}
                  onClick={() => {}}
                  className="mt-[4px]"
                  isLightMode={!isDarkMode}
                />
                <span className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px]" style={{ color: formData.bottleneck === option ? theme.text : theme.textSecondary }}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] my-[6px]" style={{ backgroundColor: theme.border }} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRevenueQuestion = () => {
    const options = [
      "Até R$40 mil",
      "Entre R$40 mil e R$70 mil",
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
      }, 0);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            backgroundImage: theme.textGradient,
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
                className={`flex items-start gap-[9px] cursor-pointer py-[4px] ${
                  formData.revenue && formData.revenue !== option ? 'opacity-50' : 'opacity-100'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <CustomCheck 
                  checked={formData.revenue === option}
                  onClick={() => {}}
                  className="mt-[4px]"
                  isLightMode={!isDarkMode}
                />
                <span className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px]" style={{ color: formData.revenue === option ? theme.text : theme.textSecondary }}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] my-[6px]" style={{ backgroundColor: theme.border }} />
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
      }, 0);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            backgroundImage: theme.textGradient,
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
                className={`flex items-start gap-[9px] cursor-pointer py-[4px] ${
                  formData.teamSize && formData.teamSize !== option ? 'opacity-50' : 'opacity-100'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <CustomCheck 
                  checked={formData.teamSize === option}
                  onClick={() => {}}
                  className="mt-[4px]"
                  isLightMode={!isDarkMode}
                />
                <span className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px]" style={{ color: formData.teamSize === option ? theme.text : theme.textSecondary }}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] my-[6px]" style={{ backgroundColor: theme.border }} />
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
      }, 0);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            backgroundImage: theme.textGradient,
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
            className="flex items-center justify-between gap-[9px] cursor-pointer py-[12px] px-[16px] rounded-[8px] transition-all duration-200 hover:border-[#A646E6]"
            style={{ border: `1px solid ${theme.border}` }}
            onClick={() => setIsSegmentDropdownOpen(!isSegmentDropdownOpen)}
          >
            <div className="flex items-center gap-[9px]">
              <CustomCheck 
                checked={!!formData.segment}
                onClick={() => {}}
                className="mt-0"
                isLightMode={!isDarkMode}
              />
              <span className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3]" style={{ color: formData.segment ? theme.text : theme.textSecondary }}>
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
            className={`absolute top-full left-0 right-0 mt-2 rounded-[8px] overflow-hidden z-20 transition-all duration-200 ${
              isSegmentDropdownOpen ? 'opacity-100 max-h-[300px] overflow-y-auto' : 'opacity-0 max-h-0 pointer-events-none'
            }`}
            style={{ backgroundColor: isDarkMode ? '#0C0D0F' : '#FFFFFF', border: `1px solid ${theme.border}` }}
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
                    isLightMode={!isDarkMode}
                  />
                  <span className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3]" style={{ color: formData.segment === option ? theme.text : theme.textSecondary }}>
                    {option}
                  </span>
                </div>
                {index < options.length - 1 && (
                  <div className="h-[1px] mx-[16px]" style={{ backgroundColor: theme.border }} />
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
      }, 0);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            backgroundImage: theme.textGradient,
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
                className={`flex items-start gap-[9px] cursor-pointer py-[4px] ${
                  formData.urgency && formData.urgency !== option ? 'opacity-50' : 'opacity-100'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <CustomCheck 
                  checked={formData.urgency === option}
                  onClick={() => {}}
                  className="mt-[4px]"
                  isLightMode={!isDarkMode}
                />
                <span className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px]" style={{ color: formData.urgency === option ? theme.text : theme.textSecondary }}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] my-[6px]" style={{ backgroundColor: theme.border }} />
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
      }, 0);
    };

    return (
      <div className="flex flex-col gap-6 sm:gap-[37px]">
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            backgroundImage: theme.textGradient,
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
                className={`flex items-start gap-[9px] cursor-pointer py-[4px] ${
                  formData.hasPartner && formData.hasPartner !== option ? 'opacity-50' : 'opacity-100'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <CustomCheck 
                  checked={formData.hasPartner === option}
                  onClick={() => {}}
                  className="mt-[4px]"
                  isLightMode={!isDarkMode}
                />
                <span className="font-['Inter'] font-normal text-[16px] sm:text-[18px] leading-[1.3] pt-[1px]" style={{ color: formData.hasPartner === option ? theme.text : theme.textSecondary }}>
                  {option}
                </span>
              </div>
              {index < options.length - 1 && (
                <div className="h-[1px] my-[6px]" style={{ backgroundColor: theme.border }} />
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
          <p className="font-['Inter'] font-normal text-[14px] sm:text-[18px] leading-[1.3]" style={{ color: theme.textSecondary }}>
            Para conhecermos melhor sua empresa, nos informe:
          </p>
          <h2 
            className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
            style={{
              backgroundImage: theme.textGradient,
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
        <p className="font-['Inter'] font-normal text-[14px] sm:text-[18px] leading-[1.3]" style={{ color: theme.textSecondary }}>
          Perfeito! Agora vamos agendar sua Reunião Estratégica.
        </p>
        <h2 
          className="font-['Inter'] font-medium text-[22px] sm:text-[28px] leading-[110%] max-w-[420px]"
          style={{
            backgroundImage: theme.textGradient,
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
          disabled={!formData.name || !formData.email || !formData.phone || emailError !== "" || isTransitioning || isSubmitting}
          className="green-animated-button w-full disabled:opacity-50"
          data-testid="button-prosseguir"
        >
          <span>
            {isSubmitting ? 'ENVIANDO...' : 'PROSSEGUIR'}
            {!isSubmitting && <ArrowRightIcon className="arrow-icon w-[18px] h-[18px]" />}
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
        return renderSocialMediaQuestion();
      case 5:
        return renderTeamSizeQuestion();
      case 6:
        return renderSegmentQuestion();
      case 7:
        return renderUrgencyQuestion();
      case 8:
        return renderPartnerQuestion();
      case 9:
        return renderContactForm();
      default:
        return null;
    }
  };

  if (step === 0) {
    return (
      <div className={!isDarkMode ? 'light-mode' : ''}>
        {renderWelcomeScreen()}
      </div>
    );
  }
  
  return (
    <div className={!isDarkMode ? 'light-mode' : ''}>
      {renderFormLayout(stepContent(), step - 1)}
    </div>
  );
};
