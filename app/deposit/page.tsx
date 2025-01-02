"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AmountSelector } from "@/components/deposit/amount-selector";
import { PixQRCode } from "@/components/deposit/pix-qr-code";
import { PaymentStatusDisplay } from "@/components/deposit/payment-status";
import { generatePix, checkPaymentStatus } from "@/lib/api/payment/service";
import { toast } from "sonner";
import type { PaymentStatus } from "@/lib/api/payment/types";

export default function DepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Track page view
  useEffect(() => {
    if (window.utmify) {
      window.utmify('track', 'page_view', {
        page: 'deposit',
        url: window.location.href
      });
    }
  }, []);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    // Track amount selection
    if (window.utmify) {
      window.utmify('track', 'amount_selected', {
        value: value
      });
    }
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
        "user@example.com" // TODO: Get user email from context/storage
      );
      
      setQrCode(qrCode);
      setTransactionId(transactionId);

      // Track PIX generation
      window.dispatchEvent(new CustomEvent('pix_generated', {
        detail: {
          amount: amount,
          transactionId: transactionId,
          timestamp: new Date().toISOString()
        }
      }));

      // Track in utmify directly
      if (window.utmify) {
        window.utmify('track', 'pix_generated', {
          value: amount,
          transaction_id: transactionId,
          currency: 'BRL'
        });
      }
    } catch (error) {
      toast.error("Erro ao gerar PIX. Tente novamente.");
      console.error("Error generating PIX:", error);
      
      // Track error
      if (window.utmify) {
        window.utmify('track', 'pix_generation_error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          amount: amount
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Track back button click
              if (window.utmify) {
                window.utmify('track', 'deposit_cancelled', {
                  stage: qrCode ? 'pix_generated' : 'amount_selection'
                });
              }
              router.back();
            }}
            className="hover:bg-gray-800 text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">Depositar</h1>
        </div>

        {!qrCode ? (
          <Card className="bg-gray-900 p-6 border-gray-800">
            <h2 className="text-lg font-semibold mb-6 text-white">
              Adicione saldo em sua carteira
            </h2>
            
            <AmountSelector
              selectedAmount={amount}
              onAmountSelect={handleAmountSelect}
            />

            <Button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleGeneratePix}
              disabled={loading || amount <= 0}
            >
              {loading ? "Gerando PIX..." : "Continuar"}
            </Button>
          </Card>
        ) : paymentStatus ? (
          <PaymentStatusDisplay
            status={paymentStatus}
            onClose={() => {
              // Track completion
              if (window.utmify) {
                window.utmify('track', 'deposit_flow_completed', {
                  status: paymentStatus.status,
                  amount: amount,
                  transaction_id: transactionId
                });
              }
              router.push("/dashboard");
            }}
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