"use client";

import { X, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReferralBanner() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mt-6 mb-6">
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/90 rounded-3xl p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-orange-400/10 to-orange-500/5 rounded-full blur-2xl -ml-24 -mb-24" />

        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-300 p-1.5 rounded-full hover:bg-white/5 transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">
                Ganhe R$ 40,00 por indicação!
              </h3>
              <p className="text-sm text-zinc-300">
                Indique seus amigos e Ganhe R$ 40,00 quando eles fizerem o primeiro depósito.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/referral')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            Começar a Indicar
            <Users className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="bg-black/20 rounded-2xl p-4 transition-all duration-300 hover:bg-black/30">
              <p className="text-sm text-zinc-400 mb-1">Bônus por Indicação</p>
              <p className="text-xl font-semibold text-white">R$ 40,00</p>
            </div>
            <div className="bg-black/20 rounded-2xl p-4 transition-all duration-300 hover:bg-black/30">
              <p className="text-sm text-zinc-400 mb-1">Depósito Mínimo</p>
              <p className="text-xl font-semibold text-white">R$ 30,00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}