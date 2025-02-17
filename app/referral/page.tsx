"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StatsCard } from "@/components/referral/stats-card";
import { ReferredUsersList } from "@/components/referral/referred-users-list";
import { getReferralStats, generateReferralCode } from "@/lib/api/referral/service";
import type { ReferralStats } from "@/lib/api/referral/types";

export default function ReferralPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralStats();
  }, []);

  const loadReferralStats = async () => {
    try {
      const data = await getReferralStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load referral stats:", error);
      toast.error("Erro ao carregar informações de indicação");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralLink = async () => {
    if (!stats?.referralCode) return;
    
    const referralLink = `${window.location.origin}/register?ref=${stats.referralCode}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Link de indicação copiado!");
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-48 bg-black/40 rounded-2xl animate-pulse" />
          <div className="h-96 bg-black/40 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-black/20 text-white transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">Programa de Indicação</h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Stats Card */}
          <StatsCard stats={stats} />

          {/* Share Button */}
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium"
            onClick={handleCopyReferralLink}
          >
            <Copy className="w-5 h-5" />
            Copiar Link de Indicação
          </button>

          {/* Referred Users Section */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800/90 border-none p-6 rounded-2xl relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-orange-400/10 to-orange-500/5 rounded-full blur-2xl -ml-24 -mb-24" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Usuários Indicados</h2>
              </div>
              <ReferredUsersList users={stats.referredUsers} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}