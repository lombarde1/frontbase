"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, ArrowDownLeft } from "lucide-react";
import { CommissionWithdrawModal } from "@/components/withdraw/commission-withdraw-modal";
import type { ReferralStats } from "@/lib/api/referral/types";

interface StatsCardProps {
  stats: ReferralStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <>
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800/90 p-6 border-none relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-orange-400/10 to-orange-500/5 rounded-full blur-2xl -ml-24 -mb-24" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Carteira de Indicação</h2>
              <p className="text-sm text-zinc-300">Ganhe R$ 40,00 por indicação qualificada</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-2xl p-4 transition-all duration-300 hover:bg-black/30">
              <p className="text-sm text-zinc-400 mb-1">Total Ganho</p>
              <p className="text-xl font-semibold text-white">
                R$ {stats.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-black/20 rounded-2xl p-4 transition-all duration-300 hover:bg-black/30">
              <p className="text-sm text-zinc-400 mb-1">Total Indicados</p>
              <p className="text-xl font-semibold text-white">{stats.totalReferrals}</p>
            </div>
          </div>

          <div className="bg-orange-500/10 rounded-2xl p-4 transition-all duration-300 hover:bg-orange-500/15">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <p className="text-sm font-medium text-white">Seu código de indicação</p>
            </div>
            <p className="text-lg font-mono font-bold text-white">{stats.referralCode}</p>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            <ArrowDownLeft className="w-5 h-5" />
            Sacar Comissões
          </button>

          <p className="text-xs text-center text-zinc-400">
            Valor mínimo para saque: R$ 50,00
          </p>
        </div>
      </Card>

      <CommissionWithdrawModal
        open={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        currentBalance={stats.totalEarnings}
      />
    </>
  );
}