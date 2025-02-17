"use client";

import { Card } from "@/components/ui/card";
import { Users, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="bg-gradient-to-br from-[#FF6B2C] to-[#FF8F50] p-6 mt-6 mb-6 relative overflow-hidden border-none">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl -ml-24 -mb-24" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon and Text */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/15 backdrop-blur-xl rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-lg">
              Ganhe R$ 40,00 por indicação!
            </h3>
            <p className="text-white/90 text-sm">
              Indique seus amigos e Ganhe R$ 40,00 quando eles fizerem o primeiro depósito.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="mt-4 bg-white/15 hover:bg-white/25 text-white border-white/15 backdrop-blur-sm w-full flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
          variant="outline"
          onClick={() => router.push('/referral')}
        >
          Começar a Indicar
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:bg-white/20">
            <p className="text-white/70 text-xs">Bônus por Indicação</p>
            <p className="text-white font-bold text-lg">R$ 40,00</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:bg-white/20">
            <p className="text-white/70 text-xs">Depósito Mínimo</p>
            <p className="text-white font-bold text-lg">R$ 30,00</p>
          </div>
        </div>
      </div>
    </Card>
  );
}