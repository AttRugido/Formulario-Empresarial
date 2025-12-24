import { ArrowRightIcon, ClockIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export const Element = (): JSX.Element => {
  return (
    <div className="bg-[#090909] w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-[690px] px-4">
        <img
          className="w-[44.26px] h-16"
          alt="Logo"
          src="/figmaAssets/logo.png"
        />

        <h1 className="[font-family:'Inter',Helvetica] font-medium text-white text-[39.3px] text-center tracking-[0] leading-[43.2px]">
          Obrigado pelo interesse em estruturar a receita da sua empresa!
        </h1>

        <p className="[font-family:'Inter',Helvetica] font-normal text-[#b7b7b7] text-lg text-center tracking-[0] leading-[23.4px]">
          Antes de agendar sua reunião estratégica, responda algumas
          <br />
          perguntas para personalizarmos nossa conversa.
        </p>

        <div className="flex flex-col gap-1 items-center">
          <ClockIcon className="w-7 h-7 text-[#b7b7b7]" />
          <p className="[font-family:'Inter',Helvetica] font-normal text-[#b7b7b7] text-lg text-center tracking-[0] leading-[23.4px]">
            Isso leva apenas 2 minutos
          </p>
        </div>

        <Button className="h-12 bg-[#0b9a1b] hover:bg-[#0b9a1b]/90 rounded-lg px-10 py-[15px] gap-2.5">
          <span className="[font-family:'Inter',Helvetica] font-normal text-[#ffffffb2] text-lg tracking-[0] leading-[23.4px]">
            AVANÇAR
          </span>
          <ArrowRightIcon className="w-[18px] h-[18px] text-[#ffffffb2]" />
        </Button>
      </div>
    </div>
  );
};
