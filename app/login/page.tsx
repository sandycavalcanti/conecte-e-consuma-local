"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginEmpreendedor } from "@/app/server-actions"
import Link from "next/link"
import { Loader } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = await loginEmpreendedor(email, password)
      if (!user) {
        setError("Email ou senha incorretos")
        setLoading(false)
        return
      }

      window.dispatchEvent(new CustomEvent("loginSuccess"))

      router.push("/perfil")
      router.refresh()
    } catch (error) {
      console.error("[v0] Login error:", error)
      setError("Erro ao fazer login. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/5 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">Login</h1>
          <p className="text-muted-foreground text-center mb-8">Acesse sua conta de empreendedor</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm mb-3">Não tem uma conta?</p>
            <Link href="/cadastro" className="btn-secondary w-full inline-block text-center">
              Fazer cadastro
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
