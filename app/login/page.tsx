"use client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, loginSchema, type LoginData } from "@/lib/auth/api";
import { toast } from "sonner";
import { useUTMContext } from '@/components/UTMProvider';

export default function LoginPage() {
  const utmData = useUTMContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);
      await login(validatedData);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Partial<LoginData> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0] as keyof LoginData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error(error.message || "Falha ao fazer login");
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
            Entre na sua conta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              error={errors.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              error={errors.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium disabled:opacity-50 disabled:hover:scale-100 text-lg"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
              <ArrowRight className="ml-1 h-5 w-5" />
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-400">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-orange-500 hover:text-orange-400 font-medium">
              Cadastre-se
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