"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, CheckCircle2, Clock, Wallet, Copy } from "lucide-react";
import { toast } from "sonner";
import { getUserBalance } from "@/lib/api/wallet";
import { requestBalanceWithdraw } from "@/lib/api/withdraw/service";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

export function WithdrawModal({ open, onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [pixKeyType, setPixKeyType] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  useState(() => {
    async function loadBalance() {
      try {
        const { balance } = await getUserBalance();
        setCurrentBalance(balance);
      } catch (error) {
        console.error("Failed to load balance:", error);
      }
    }
    loadBalance();
  }, []);

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Por favor, insira um valor válido");
      return;
    }

    if (numAmount < 30) {
      toast.error("Valor mínimo para saque: R$ 30,00");
      return;
    }

    if (numAmount > currentBalance) {
      toast.error("Saldo insuficiente");
      return;
    }

    if (!pixKeyType || !pixKey) {
      toast.error("Por favor, preencha os dados da chave PIX");
      return;
    }

    setLoading(true);
    try {
      await requestBalanceWithdraw(numAmount);
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar saque");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-b from-gray-900 to-gray-950 text-white border-gray-800 sm:max-w-md">
          <div className="p-8 text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 mx-auto bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Saque Solicitado!
              </h3>
              <p className="text-gray-300">
                Sua solicitação de saque foi registrada com sucesso e será processada em breve.
              </p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-orange-400" />
                <p className="text-sm">Prazo de processamento: até 24h úteis</p>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium py-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-orange-500/20"
              onClick={onClose}
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-gray-900 to-gray-950 text-white border-gray-800 sm:max-w-md">
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200 shadow-lg">
              <ArrowDown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Realizar Saque
              </h3>
              <p className="text-sm text-gray-400">Saldo mínimo: R$ 30,00</p>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-gray-300">Saldo disponível</span>
              </div>
              <span className="font-medium text-lg">
                R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Valor do Saque</label>
              <div className="relative group">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="pl-8 bg-gray-800/40 border-gray-700 text-white placeholder-gray-500 rounded-xl h-12 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Tipo de Chave PIX</label>
              <Select value={pixKeyType} onValueChange={setPixKeyType}>
                <SelectTrigger className="bg-gray-800/40 border-gray-700 text-white rounded-xl h-12">
                  <SelectValue placeholder="Selecione o tipo de chave" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                  <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Chave PIX</label>
              <div className="relative">
                <Input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Digite sua chave PIX"
                  className="bg-gray-800/40 border-gray-700 text-white placeholder-gray-500 rounded-xl h-12 pr-10 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                  onClick={() => {
                    if (pixKey) {
                      navigator.clipboard.writeText(pixKey);
                      toast.success("Chave PIX copiada!");
                    }
                  }}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium py-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleWithdraw}
            disabled={loading || !amount || !pixKeyType || !pixKey}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Processando...</span>
              </div>
            ) : (
              "Solicitar Saque"
            )}
          </Button>

         
        </div>
      </DialogContent>
    </Dialog>
  );
}