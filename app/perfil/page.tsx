"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentEmpreendedor, logoutEmpreendedor } from "@/app/server-actions"
import type { Empreendedor } from "@/lib/types"
import Link from "next/link"
import { LogOut, Edit2, Trash2 } from "lucide-react"

export default function PerfilPage() {
  const [user, setUser] = useState<Empreendedor | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const current = await getCurrentEmpreendedor()
      if (!current) {
        router.push("/login")
        return
      }
      setUser(current)
    } catch (error) {
      console.error("[v0] Error loading user:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutEmpreendedor()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const fotoUrl = user.TB_EMPREENDEDOR_FOTO
    ? `data:image/jpeg;base64,${Buffer.from(user.TB_EMPREENDEDOR_FOTO).toString("base64")}`
    : "/default-profile-icon.jpg"

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-tertiary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Header com gradiente */}
          <div className="h-32 bg-gradient-to-r from-accent to-secondary"></div>

          {/* Conteúdo */}
          <div className="px-6 md:px-8 pb-8">
            {/* Foto de Perfil */}
            <div className="flex flex-col sm:flex-row gap-6 -mt-20 mb-8">
              <div className="flex-shrink-0">
                <img
                  src={fotoUrl || "/placeholder.svg"}
                  alt={user.TB_EMPREENDEDOR_NOME}
                  className="w-32 h-32 rounded-lg border-4 border-card bg-muted object-cover shadow-lg"
                />
              </div>

              <div className="flex-1 flex flex-col justify-end mb-2">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-1">{user.TB_EMPREENDEDOR_NOME}</h1>
                <p className="text-muted-foreground">{user.TB_EMPREENDEDOR_CONTATO_EMAIL}</p>
              </div>
            </div>

            {/* Informações */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
                <p className="text-sm font-medium text-muted-foreground mb-2">WhatsApp</p>
                <a
                  href={`https://wa.me/55${user.TB_EMPREENDEDOR_CONTATO_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-secondary hover:underline"
                >
                  +55 {user.TB_EMPREENDEDOR_CONTATO_WHATSAPP}
                </a>
              </div>

              <div className="bg-tertiary/10 rounded-lg p-4 border border-tertiary/20">
                <p className="text-sm font-medium text-muted-foreground mb-2">Email</p>
                <a
                  href={`mailto:${user.TB_EMPREENDEDOR_CONTATO_EMAIL}`}
                  className="text-lg font-semibold text-tertiary hover:underline break-all"
                >
                  {user.TB_EMPREENDEDOR_CONTATO_EMAIL}
                </a>
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-8">
              <h2 className="text-xl font-serif font-bold text-foreground mb-3">Sobre</h2>
              <p className="text-muted-foreground leading-relaxed">
                {user.TB_EMPREENDEDOR_DESCRICAO_COMPLETA || user.TB_EMPREENDEDOR_DESCRICAO_CURTA}
              </p>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 border-t border-border pt-6">
              <Link
                href={`/edicao/${user.TB_EMPREENDEDOR_ID}`}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-all duration-200 active:scale-95"
              >
                <Edit2 className="w-4 h-4" />
                Editar Perfil
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive/20 transition-all duration-200 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Deletar Conta
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-border transition-all duration-200 active:scale-95 ml-auto"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Deleção */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Deletar Conta?</h2>
            <p className="text-muted-foreground mb-6">
              Esta ação é irreversível. Sua conta e todos os seus dados serão removidos permanentemente.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-border transition-all duration-200"
              >
                Cancelar
              </button>

              <Link
                href={`/edicao/${user.TB_EMPREENDEDOR_ID}?delete=true`}
                className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-all duration-200 text-center"
              >
                Deletar
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
