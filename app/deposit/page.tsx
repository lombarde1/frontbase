"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AmountSelector } from "@/components/deposit/amount-selector";
import { PixQRCode } from "@/components/deposit/pix-qr-code";
import { PaymentStatusDisplay } from "@/components/deposit/payment-status";
import { generatePix, checkPaymentStatus } from "@/lib/api/payment/service";
import { toast } from "sonner";
import type { PaymentStatus } from "@/lib/api/payment/types";
import { useUTMNavigation } from '@/hooks/useUTMNavigation';
import { useUTMContext } from '@/components/UTMProvider';


export default function DepositPage() {
  const { navigateWithUTMs } = useUTMNavigation();
  const utmData = useUTMContext();
  const [amount, setAmount] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Track page view with UTMs
  useEffect(() => {
    if (window.utmify) {
      window.utmify('track', 'page_view', {
        page: 'deposit',
        url: window.location.href,
        ...utmData // Inclui os dados de UTM no tracking
      });
    }
  }, [utmData]);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    if (window.utmify) {
      window.utmify('track', 'amount_selected', {
        value: value,
        ...utmData
      });
    }
  };

  const handleBack = () => {
    if (window.utmify) {
      window.utmify('track', 'deposit_cancelled', {
        stage: qrCode ? 'pix_generated' : 'amount_selection',
        ...utmData
      });
    }
    navigateWithUTMs('/dashboard');
  };

  const handleGeneratePix = async () => {
    if (amount <= 0) {
      toast.error("Selecione um valor para depósito");
      return;
    }

    setLoading(true);
    try {
      const { qrCode, transactionId } = await generatePix(
        amount,
        "user@example.com"
      );
      
      setQrCode(qrCode);
      setTransactionId(transactionId);

      window.dispatchEvent(new CustomEvent('pix_generated', {
        detail: {
          amount: amount,
          transactionId: transactionId,
          timestamp: new Date().toISOString(),
          ...utmData
        }
      }));

      if (window.utmify) {
        window.utmify('track', 'pix_generated', {
          value: amount,
          transaction_id: transactionId,
          currency: 'BRL',
          ...utmData
        });
      }
    } catch (error) {
      toast.error("Erro ao gerar PIX. Tente novamente.");
      console.error("Error generating PIX:", error);
      
      if (window.utmify) {
        window.utmify('track', 'pix_generation_error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          amount: amount,
          ...utmData
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!transactionId) return;

    let checkCount = 0;
    const maxChecks = 60; // 5 minutos (60 * 5 segundos)

    const checkInterval = setInterval(async () => {
      try {
        checkCount++;
        const status = await checkPaymentStatus(transactionId);
        setPaymentStatus(status);

        if (status.status === "completed") {
          clearInterval(checkInterval);
          // Track successful payment
          if (window.utmify) {
            window.utmify('track', 'pix_paid', {
              value: amount,
              transaction_id: transactionId,
              currency: 'BRL',
              time_to_payment: checkCount * 5 // segundos até o pagamento
            });
          }
        } else if (status.status === "failed" || checkCount >= maxChecks) {
          clearInterval(checkInterval);
          // Track failed payment
          if (window.utmify) {
            window.utmify('track', 'pix_failed', {
              value: amount,
              transaction_id: transactionId,
              reason: status.status === "failed" ? "payment_failed" : "timeout"
            });
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        // Track error in status check
        if (window.utmify) {
          window.utmify('track', 'status_check_error', {
            transaction_id: transactionId,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }, 5000);

    // Initial check
    const initialStatus = await checkPaymentStatus(transactionId);
    setPaymentStatus(initialStatus);

    // Cleanup
    return () => clearInterval(checkInterval);
  };

  const handlePaymentComplete = () => {
    if (window.utmify) {
      window.utmify('track', 'deposit_flow_completed', {
        status: paymentStatus?.status,
        amount: amount,
        transaction_id: transactionId,
        ...utmData
      });
    }
    navigateWithUTMs('/dashboard');
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-black/20 text-white transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">Depositar</h1>
        </div>

        {!qrCode ? (
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800/90 p-6 border-none rounded-2xl relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-orange-400/10 to-orange-500/5 rounded-full blur-2xl -ml-24 -mb-24" />
            
            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Adicione saldo em sua carteira
              </h2>
              
              <AmountSelector
                selectedAmount={amount}
                onAmountSelect={handleAmountSelect}
              />

              <button
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium disabled:opacity-50 disabled:hover:scale-100"
                onClick={handleGeneratePix}
                disabled={loading || amount <= 0}
              >
                {loading ? "Gerando PIX..." : "Continuar"}
              </button>
            </div>
          </Card>
        ) : paymentStatus ? (
          <PaymentStatusDisplay
            status={paymentStatus}
            onClose={handlePaymentComplete}
          />
        ) : (
          <PixQRCode
            qrCode={qrCode}
            amount={amount}
            onPaymentConfirm={handlePaymentConfirm}
          />
        )}
      </div>
    </div>
  );
}