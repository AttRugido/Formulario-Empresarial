import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const validUser = import.meta.env.VITE_ADMIN_USER;
    const validPass = import.meta.env.VITE_ADMIN_PASS;

    setTimeout(() => {
      if (username === validUser && password === validPass) {
        localStorage.setItem("isLoggedIn", "true");
        setLocation("/dashboard");
      } else {
        setError("Usuário ou senha incorretos");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#08090B' }}>
      <div 
        className="w-full max-w-md p-8 rounded-xl"
        style={{ 
          background: '#0C0D0F',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <svg className="mb-4" width="24" height="35" viewBox="0 0 24 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.715211 26.9572C2.27321 31.2693 2.36903 32.9023 1.73224 35C3.05303 33.3616 3.85068 32.463 6.01446 31.1173C14.8215 25.4572 13.8477 17.9698 13.6154 5.71315C10.0479 12.0987 7.29932 13.7005 2.05363 18.5261C-0.676304 21.1886 -0.194604 24.8494 0.715211 26.9572Z" fill="url(#paint0_linear_login)"/>
            <path d="M14.3651 5.71315C15.3795 18.8074 14.6317 24.8607 8.20937 30.6735C16.2185 27.7496 18.8098 20.4357 19.9855 0C18.3199 0.802974 17.6045 1.56356 16.6132 3.32805C15.84 4.57114 15.3313 5.04601 14.3651 5.71315Z" fill="url(#paint1_linear_login)"/>
            <path d="M20.4672 0.610144C20.2539 15.4637 19.2621 21.1362 15.6497 25.6815C20.7329 22.8117 22.7788 19.0732 24 5.99049C22.7569 5.5036 22.3942 5.26942 21.9659 3.71633C21.7518 2.49604 21.2389 1.64194 20.4672 0.610144Z" fill="url(#paint2_linear_login)"/>
            <path d="M0.941215 26.8871C2.20261 30.9278 3.02453 32.8817 2.35309 34.7869C3.63621 33.3346 4.06978 31.7881 6.11779 30.642C14.4611 25.8088 13.823 17.8096 14.1038 6.50642C10.559 12.2353 7.38097 15.061 2.3528 19.2799C-0.270034 21.6147 0.188036 24.9056 0.941215 26.8871Z" fill="white" fillOpacity="0.82"/>
            <path d="M14.7946 6.53893C15.2005 18.6478 14.5758 25.0769 8.42364 30.1543C16.3766 27.2772 18.8237 19.5725 19.9531 0.213138C18.386 0.880766 17.8789 2.43395 16.8943 4.01674C16.1316 5.12859 15.7118 5.96613 14.7946 6.53893Z" fill="white" fillOpacity="0.82"/>
            <path d="M20.5645 1.23717C19.7681 14.9138 18.9941 21.1491 15.4821 25.1804C20.4981 22.2467 22.588 20.1089 23.9056 6.35741C22.7799 5.85488 22.261 5.51506 21.9291 4.06549C21.7811 2.93185 21.2338 2.22132 20.5645 1.23717Z" fill="white" fillOpacity="0.82"/>
            <defs>
              <linearGradient id="paint0_linear_login" x1="22.678" y1="2.91667" x2="11.5899" y2="40.0818" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FE2EFD" stopOpacity="0"/>
                <stop offset="0.404724" stopColor="#FE30FD"/>
                <stop offset="0.586755" stopColor="#FE30FD"/>
                <stop offset="0.860624" stopColor="#00FFD2"/>
              </linearGradient>
              <linearGradient id="paint1_linear_login" x1="22.6511" y1="1.4557" x2="15.9156" y2="35.8766" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FED1"/>
                <stop offset="0.34" stopColor="#FE30FD"/>
                <stop offset="0.68" stopColor="#FE30FD"/>
                <stop offset="1" stopColor="#00FED1"/>
              </linearGradient>
              <linearGradient id="paint2_linear_login" x1="15.4823" y1="0.0774335" x2="12.9859" y2="33.1428" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FED1"/>
                <stop offset="0.225" stopColor="#00FED1"/>
                <stop offset="0.55" stopColor="#7331FF"/>
                <stop offset="0.79" stopColor="#7331FF"/>
                <stop offset="1" stopColor="#00FED1"/>
              </linearGradient>
            </defs>
          </svg>
          <h1 
            className="text-2xl font-semibold"
            style={{
              fontFamily: 'Inter, sans-serif',
              background: 'linear-gradient(88deg, #F6F6F8 6.29%, #A8B2BC 87%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Área Administrativa
          </h1>
          <p style={{ color: '#6E707C', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginTop: '8px' }}>
            Faça login para acessar o dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E707C]" />
            <Input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              style={{
                background: '#0E0F12',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                height: '44px'
              }}
              data-testid="input-username"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E707C]" />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              style={{
                background: '#0E0F12',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                height: '44px'
              }}
              data-testid="input-password"
            />
          </div>

          {error && (
            <p style={{ color: '#D91E35', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            style={{
              background: '#A646E6',
              height: '44px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 500
            }}
            data-testid="button-login"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
