import { ArrowRightIcon, ArrowLeftIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CustomCheck = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
  <div className={`custom-check ${checked ? 'checked' : ''}`} onClick={onClick}>
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

  const handleNext = () => {
    if (step < 9) {
      setStep(step + 1);
    } else {
      console.log("Form submitted:", formData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderWelcomeScreen = () => (
    <div className="bg-[#090909] w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-[690px] px-4">
        <img
          className="w-[44.26px] h-16"
          alt="Logo"
          src="/figmaAssets/logo.png"
        />
        <h1 className="font-['Inter'] font-medium text-white text-[39.278px] text-center leading-[110%] w-[690px]">
          Obrigado pelo interesse em estruturar a receita da sua empresa!
        </h1>
        <p className="font-['Inter'] font-normal text-[#b7b7b7] text-lg text-center leading-[23.4px]">
          Antes de agendar sua reunião estratégica, responda algumas
          <br />
          perguntas para personalizarmos nossa conversa.
        </p>
        <div className="flex flex-col gap-1 items-center">
          <ClockIcon className="w-7 h-7 text-[#b7b7b7]" />
          <p className="font-['Inter'] font-normal text-[#b7b7b7] text-lg text-center leading-[23.4px]">
            Isso leva apenas 2 minutos
          </p>
        </div>
        <Button 
          onClick={handleNext}
          className="h-12 bg-[#0b9a1b] hover:bg-[#0b9a1b]/90 rounded-lg px-10 py-[15px] gap-2.5"
        >
          <span className="font-['Inter'] font-normal text-[#ffffffb2] text-lg leading-[23.4px]">
            AVANÇAR
          </span>
          <ArrowRightIcon className="w-[18px] h-[18px] text-[#ffffffb2]" />
        </Button>
      </div>
    </div>
  );

  const renderFormLayout = (children: React.ReactNode, testimonialIndex: number) => (
    <div className="bg-[#0a0a0a] w-full min-h-screen flex">
      <div className="hidden lg:flex w-[46.7%] bg-[#121212] flex-col relative overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 897 836" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d="M2.03444 808.821C17.1929 965.5 32.4734 1043.01 -7.87744 1106.45C51.8152 1064.45 80.3883 1012.04 166.337 987.444C517.783 881.289 557.512 586.451 658.012 179.582C479.437 357.736 337.732 433.82 115.533 545.076C-1.43885 607.964 -10.4482 730.877 2.03444 808.821Z" fill="white" fillOpacity="0.01"/>
          <path d="M683.665 186.454C602.518 628.153 527.914 855.741 256.717 988.806C577.955 950.246 731.073 691.51 927.523 0C863.423 11.244 832.038 63.2881 782.505 112.466C745.047 146.426 722.632 173.283 683.665 186.454Z" fill="white" fillOpacity="0.01"/>
          <path d="M942.308 42.1156C803.582 530.653 724.92 749.992 561.09 866.963C772.603 802.13 868.013 741.977 1026.89 255.029C988.662 227.553 971.901 210.971 970.99 155.758C974.461 113.499 959.585 83.2633 942.308 42.1156Z" fill="white" fillOpacity="0.01"/>
        </svg>
        <div className="relative z-10 px-[121px] pt-[626px]">
          <h2 className="font-['Inter'] font-medium text-white text-[39.278px] leading-[110%] w-[379px] mb-4">
            {sidebarMessages[step]}
          </h2>
          {step === 1 && (
            <>
              <div className="w-[418px] h-[1px] bg-white/20 mt-[17px] mb-[17px]" />
              <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[18px] leading-[1.3] w-[417px] mb-6">
                Veja abaixo algumas empresas que multiplicaram as vendas com a nossa ajuda:
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <img src="/attached_assets/Logo_branco_e_amarelo_1766593059522.png" alt="Arts Portas" className="h-8 w-auto" />
                  <img src="/attached_assets/Logo_Branco_1766593059522.png" alt="Wall Travel" className="h-4 w-auto" />
                  <img src="/attached_assets/logo_timbo_1766593059523.png" alt="Timbo" className="h-6 w-auto" />
                  <img src="/attached_assets/Logo_rainha_1766593059523.png" alt="Rainha" className="h-10 w-auto" />
                </div>
                <div className="flex items-center gap-4">
                  <img src="/attached_assets/logo_LL_1766593059523.png" alt="Luziana Lanna" className="h-5 w-auto" />
                  <img src="/attached_assets/Logo_Hg_1766593059522.png" alt="Hidrogyn" className="h-12 w-auto" />
                  <img src="/attached_assets/Logo_Gran_Money_Branco_1766593059522.png" alt="Gran Money" className="h-7 w-auto" />
                  <img src="/attached_assets/Group_2_1766593059521.png" alt="Center" className="h-10 w-auto" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-screen bg-[#0a0a0a] overflow-hidden relative">
        <div className="flex justify-center pt-[53px]">
          <img
            className="w-[44.263px] h-16"
            alt="Logo"
            src="/figmaAssets/logo.png"
          />
        </div>
        <div className="flex-1 flex flex-col items-center pt-[133px] px-8">
          <div className="w-full max-w-[290px]">
            {children}
          </div>
        </div>
        <div className="absolute bottom-[129px] left-1/2 -translate-x-1/2">
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
        <footer className="absolute bottom-0 left-0 right-0 text-center pb-[43px]">
          <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[11px] leading-[1.3] mb-[51px]">
            Ao clicar em PROSSEGUIR você automaticamente concordo com os <span className="underline">termos de uso</span> e <span className="underline">politica de privacidade</span>
          </p>
          <p className="font-['Inter'] font-normal text-[#565656] text-[9px] leading-[1.3]">
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
      setFormData({ ...formData, role: option });
      setTimeout(() => {
        handleNext();
      }, 500);
    };
    
    return (
      <div className="flex flex-col gap-[37px]">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-['Inter']">Voltar</span>
        </Button>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Primeiro, qual é a sua função na empresa?
        </h2>
        <div className="flex flex-col gap-[10px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-center gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.role && formData.role !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.role === option}
                onClick={() => {}}
              />
              <span className={`font-['Inter'] font-normal text-[18px] leading-[1.3] ${
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
      setFormData({ ...formData, bottleneck: option });
      setTimeout(() => {
        handleNext();
      }, 500);
    };

    return (
      <div className="flex flex-col gap-[37px]">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-['Inter']">Voltar</span>
        </Button>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Qual é o PRINCIPAL gargalo que está limitando a receita da sua empresa hoje?
        </h2>
        <div className="flex flex-col gap-[10px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-center gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.bottleneck && formData.bottleneck !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.bottleneck === option}
                onClick={() => {}}
              />
              <span className={`font-['Inter'] font-normal text-[18px] leading-[1.3] ${
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
      setFormData({ ...formData, revenue: option });
      setTimeout(() => {
        handleNext();
      }, 500);
    };

    return (
      <div className="flex flex-col gap-[37px]">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-['Inter']">Voltar</span>
        </Button>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Qual é o faturamento MENSAL aproximado da sua empresa?
        </h2>
        <div className="flex flex-col gap-[10px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-center gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.revenue && formData.revenue !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.revenue === option}
                onClick={() => {}}
              />
              <span className={`font-['Inter'] font-normal text-[18px] leading-[1.3] ${
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
      setFormData({ ...formData, teamSize: option });
      setTimeout(() => {
        handleNext();
      }, 500);
    };

    return (
      <div className="flex flex-col gap-[37px]">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-['Inter']">Voltar</span>
        </Button>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Quantas pessoas trabalham na sua empresa hoje?
        </h2>
        <div className="flex flex-col gap-[10px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-center gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.teamSize && formData.teamSize !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.teamSize === option}
                onClick={() => {}}
              />
              <span className={`font-['Inter'] font-normal text-[18px] leading-[1.3] ${
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
      setFormData({ ...formData, segment: option });
      setTimeout(() => {
        handleNext();
      }, 500);
    };

    return (
      <div className="flex flex-col gap-[37px]">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-['Inter']">Voltar</span>
        </Button>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Em qual segmento sua empresa atua?
        </h2>
        <div className="flex flex-col gap-[10px] max-h-[400px] overflow-y-auto">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-center gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.segment && formData.segment !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.segment === option}
                onClick={() => {}}
              />
              <span className={`font-['Inter'] font-normal text-[18px] leading-[1.3] ${
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
      setFormData({ ...formData, urgency: option });
      setTimeout(() => {
        handleNext();
      }, 500);
    };

    return (
      <div className="flex flex-col gap-[37px]">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-['Inter']">Voltar</span>
        </Button>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Para quando você precisa estruturar a receita da empresa?
        </h2>
        <div className="flex flex-col gap-[10px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-center gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.urgency && formData.urgency !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.urgency === option}
                onClick={() => {}}
              />
              <span className={`font-['Inter'] font-normal text-[18px] leading-[1.3] ${
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
      setFormData({ ...formData, hasPartner: option });
      setTimeout(() => {
        handleNext();
      }, 500);
    };

    return (
      <div className="flex flex-col gap-[37px]">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-['Inter']">Voltar</span>
        </Button>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Você tem sócio(s) na empresa?
        </h2>
        <div className="flex flex-col gap-[10px]">
          {options.map((option) => (
            <div 
              key={option} 
              className={`flex items-center gap-[9px] cursor-pointer transition-opacity duration-200 ${
                formData.hasPartner && formData.hasPartner !== option ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <CustomCheck 
                checked={formData.hasPartner === option}
                onClick={() => {}}
              />
              <span className={`font-['Inter'] font-normal text-[18px] leading-[1.3] ${
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
    <div className="flex flex-col gap-[37px]">
      <Button
        onClick={handleBack}
        variant="ghost"
        className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="font-['Inter']">Voltar</span>
      </Button>
      <div className="flex flex-col gap-4">
        <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[18px] leading-[1.3]">
          Para conhecermos melhor sua empresa, nos informe:
        </p>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Qual o Instagram ou LinkedIn da empresa?
        </h2>
      </div>
      <Input
        value={formData.socialMedia}
        onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
        placeholder="@suaempresa ou URL do LinkedIn"
        className="h-[45px] bg-transparent border-[#333] text-white placeholder:text-[#666] font-['Inter'] text-[18px]"
      />
      <Button
        onClick={handleNext}
        className="h-12 bg-[#0b9a1c] hover:bg-[#0b9a1c]/90 rounded-[8px] px-[40px] py-[15px] gap-[10px] w-full"
      >
        <span className="font-['Inter'] font-normal text-white/70 text-[18px] leading-[1.3] uppercase">
          Avançar
        </span>
        <ArrowRightIcon className="w-[18px] h-[18px] text-white/70" />
      </Button>
    </div>
  );

  const renderContactForm = () => (
    <div className="flex flex-col gap-[37px]">
      <Button
        onClick={handleBack}
        variant="ghost"
        className="self-start text-[#b7b7b7] hover:text-white gap-2 px-0"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="font-['Inter']">Voltar</span>
      </Button>
      <div className="flex flex-col gap-4">
        <p className="font-['Inter'] font-normal text-[#b8b8b8] text-[18px] leading-[1.3]">
          Perfeito! Agora vamos agendar sua Reunião Estratégica.
        </p>
        <h2 className="font-['Inter'] font-medium text-white text-[28px] leading-[110%]">
          Por favor, confirme seus dados de contato:
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-['Inter'] text-[#b8b8b8] text-sm">
            Seu nome completo <span className="text-[#0b9a1c]">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite seu nome"
            className="h-[45px] bg-transparent border-[#333] text-white placeholder:text-[#666] font-['Inter'] text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-['Inter'] text-[#b8b8b8] text-sm">
            Seu melhor e-mail <span className="text-[#0b9a1c]">*</span>
          </label>
          <Input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Digite seu e-mail profissional"
            type="email"
            className="h-[45px] bg-transparent border-[#333] text-white placeholder:text-[#666] font-['Inter'] text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-['Inter'] text-[#b8b8b8] text-sm">
            WhatsApp (com DDD) <span className="text-[#0b9a1c]">*</span>
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Digite seu WhatsApp"
            type="tel"
            className="h-[45px] bg-transparent border-[#333] text-white placeholder:text-[#666] font-['Inter'] text-[18px]"
          />
        </div>
      </div>
      <Button
        onClick={handleNext}
        disabled={!formData.name || !formData.email || !formData.phone}
        className="h-12 bg-[#0b9a1c] hover:bg-[#0b9a1c]/90 rounded-[8px] px-[40px] py-[15px] gap-[10px] w-full disabled:opacity-50"
      >
        <span className="font-['Inter'] font-normal text-white/70 text-[18px] leading-[1.3] uppercase">
          Avançar
        </span>
        <ArrowRightIcon className="w-[18px] h-[18px] text-white/70" />
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
