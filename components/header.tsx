"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon, LogOut, User } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { logoutEmpreendedor, getCurrentEmpreendedor } from "@/app/server-actions"
import type { Empreendedor } from "@/lib/types"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<Empreendedor | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition() // add useTransition for real-time updates
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const current = await getCurrentEmpreendedor()
      setUser(current)
    } catch (error) {
      console.error("[v0] Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      startTransition(async () => {
        await logoutEmpreendedor()
        setUser(null)
        router.push("/")
        router.refresh()
      })
    } catch (error) {
      console.error("[v0] Error logging out:", error)
    }
  }

  useEffect(() => {
    const handleLoginSuccess = () => {
      loadUser()
    }

    window.addEventListener("loginSuccess", handleLoginSuccess)
    return () => window.removeEventListener("loginSuccess", handleLoginSuccess)
  }, [])

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-accent via-secondary to-tertiary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition-all">
            L
          </div>
          <div className="hidden sm:block">
            <p className="font-serif font-bold text-foreground text-lg">Conecte Local</p>
            <p className="text-xs text-muted-foreground">Comércio Local</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/empreendedores"
            className="text-foreground hover:text-accent transition-colors font-medium text-sm md:text-base"
          >
            Empreendedores
          </Link>

          {!user && (
            <>
              <Link
                href="/login"
                className="text-foreground hover:text-accent transition-colors font-medium text-sm md:text-base"
              >
                Login
              </Link>
              <Link
                href="/cadastro"
                className="text-foreground hover:text-secondary transition-colors font-medium text-sm md:text-base"
              >
                Cadastro
              </Link>
            </>
          )}

          <Link
            href="/sobre"
            className="text-foreground hover:text-accent transition-colors font-medium text-sm md:text-base"
          >
            Sobre
          </Link>

          {mounted && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-muted hover:bg-border transition-colors"
                aria-label="Alternar tema"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user && !loading && (
                <div className="flex items-center gap-3 pl-3 border-l border-border">
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline truncate max-w-[100px]">
                      {user.TB_EMPREENDEDOR_NOME}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive disabled:opacity-50"
                    aria-label="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
