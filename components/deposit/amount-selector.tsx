"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AmountSelectorProps {
  selectedAmount: number;
  onAmountSelect: (amount: number) => void;
}

const PRESET_AMOUNTS = [30, 40, 50, 70, 90, 100];

export function AmountSelector({ selectedAmount, onAmountSelect }: AmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState("");

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (numValue < 30) {
        toast.error("Valor mínimo para depósito: R$ 30,00");
        return;
      }
      onAmountSelect(numValue);
    }
  };

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#FF6B2C] to-[#FF8F50] rounded-3xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-500">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-2xl -ml-24 -mb-24 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-105">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white/90 text-sm font-medium tracking-wide">Saldo Atual</p>
              <p className="text-2xl font-bold text-white tracking-tight">R$ 0,00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Amount Input */}
      <div className="space-y-3">
        <label className="text-sm text-white/90 font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-orange-500" />
          Valor Personalizado
        </label>
        <div className="relative">
          <Input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder="Digite um valor"
            className="pl-8 bg-black/20 border-orange-500/20 h-12 text-white placeholder-white/40 rounded-xl focus:border-orange-500/40 transition-all duration-300 hover:bg-black/30"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 font-medium">R$</span>
        </div>
      </div>

      {/* Quick Amount Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-white/90 font-medium">Valores Sugeridos</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PRESET_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              className={`h-12 relative overflow-hidden rounded-xl transition-all duration-300 ${
                selectedAmount === amount 
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20" 
                  : "bg-black/20 hover:bg-black/30 border-orange-500/20 text-white hover:border-orange-500/40"
              }`}
              onClick={() => {
                onAmountSelect(amount);
                setCustomAmount("");
              }}
            >
              {selectedAmount === amount && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
              )}
              <span className="relative z-10 font-medium tracking-wide">R$ {amount.toFixed(2)}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="relative px-4 py-3 bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl">
        <p className="text-sm text-center text-white/70 font-medium">
          Valor mínimo para depósito: <span className="text-white">R$ 30,00</span>
        </p>
      </div>
    </div>
  );
}