"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { register, registerSchema, type RegisterData } from "@/lib/auth";
import { validateReferralCode, processReferral } from "@/lib/api/referral/service";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [validatingReferral, setValidatingReferral] = useState(false);
  const [referralValid, setReferralValid] = useState(false);
  const [referrerId, setReferrerId] = useState<string | undefined>();
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    cpf: "",
    password: "",
  });

  const referralCode = searchParams?.get('ref');

  useEffect(() => {
    async function validateReferral() {
      if (!referralCode) return;

      setValidatingReferral(true);
      try {
        const validation = await validateReferralCode(referralCode);
        setReferralValid(validation.isValid);
        if (validation.referrerId) {
          setReferrerId(validation.referrerId);
        }
      } catch (error) {
        console.error("Error validating referral code:", error);
        toast.error("Erro ao validar código de indicação");
      } finally {
        setValidatingReferral(false);
      }
    }

    validateReferral();
  }, [referralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = registerSchema.parse(formData);
      const registerResponse = await register(validatedData);
      
      if (registerResponse.success && referralValid && referralCode && registerResponse.data.userId) {
        try {
          await processReferral({
            newUserId: registerResponse.data.userId,
            referralCode: referralCode
          });
          
          toast.success("Conta criada com sucesso! Bônus de indicação será aplicado após seu primeiro depósito!");
        } catch (referralError) {
          console.error("Error processing referral:", referralError);
          toast.error("Erro ao processar indicação, mas sua conta foi criada!");
        }
      } else {
        toast.success("Conta criada com sucesso!");
      }
      
      router.push("/login");
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Partial<RegisterData> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0] as keyof RegisterData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error(error.message || "Falha ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/20 to-orange-600/5 rounded-full blur-3xl -mr-52 -mt-52" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-400/20 to-orange-500/5 rounded-full blur-3xl -ml-52 -mb-52" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="block text-center mb-8">
          <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Pico Invest
          </div>
        </Link>

        <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-orange-500/10">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Cadastre-se agora!
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Nome Completo"
              placeholder="Seu nome completo"
              value={formData.name}
              error={errors.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormInput
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              error={errors.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormInput
              label="CPF"
              placeholder="Apenas números"
              value={formData.cpf}
              error={errors.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            />
            <FormInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              error={errors.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            {referralCode && (
              <div className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                validatingReferral 
                  ? "bg-orange-500/10 border border-orange-500/20" 
                  : referralValid
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
              }`}>
                <p className={`text-sm font-medium ${
                  validatingReferral 
                    ? "text-orange-400" 
                    : referralValid 
                      ? "text-green-400"
                      : "text-red-400"
                }`}>
                  {validatingReferral 
                    ? "Validando código de indicação..." 
                    : referralValid
                      ? "Código de indicação válido!"
                      : "Código de indicação inválido"}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium disabled:opacity-50 disabled:hover:scale-100 text-lg"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Cadastrar"}
              <ArrowRight className="ml-1 h-5 w-5" />
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-400">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium">
              Faça login
            </Link>
          </p>
        </div>

        <div className="text-center mt-8 space-x-6">
          <Link href="/terms" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
            Termos
          </Link>
          <Link href="/privacy" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
            Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
}