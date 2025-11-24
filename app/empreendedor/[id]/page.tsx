"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getEmpreendedorById } from "@/app/server-actions"
import type { Empreendedor, Categoria } from "@/lib/types"
import { Mail, MessageCircle, ArrowLeft, Loader } from "lucide-react"
import { useParams } from "next/navigation"

export default function EmpreendedorDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  const [empreendedor, setEmpreendedor] = useState<(Empreendedor & { categorias: Categoria[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEmpreendedor()
  }, [id])

  const loadEmpreendedor = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getEmpreendedorById(id)
      if (!data) {
        setError("Empreendedor não encontrado")
      } else {
        setEmpreendedor(data)
      }
    } catch (err) {
      console.error("[v0] Error loading empreendedor:", err)
      setError("Erro ao carregar informações do empreendedor")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error || !empreendedor) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <Link href="/empreendedores" className="flex items-center gap-2 text-accent hover:underline mb-8">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">{error || "Empreendedor não encontrado"}</p>
          <Link href="/empreendedores" className="btn-primary">
            Explorar Outros
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = empreendedor.TB_EMPREENDEDOR_FOTO
    ? `data:image/jpeg;base64,${Buffer.from(empreendedor.TB_EMPREENDEDOR_FOTO).toString("base64")}`
    : "/placeholder.svg?key=detail-photo"

  const whatsappUrl = `https://wa.me/55${empreendedor.TB_EMPREENDEDOR_CONTATO_WHATSAPP}`
  const emailUrl = `mailto:${empreendedor.TB_EMPREENDEDOR_CONTATO_EMAIL}`

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Back Button */}
      <Link
        href="/empreendedores"
        className="flex items-center gap-2 text-accent hover:underline mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Empreendedores
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden border border-border">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={empreendedor.TB_EMPREENDEDOR_NOME}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Botões de Contato */}
          <div className="flex gap-3 flex-col">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Enviar WhatsApp
            </a>
            <a href={emailUrl} className="btn-secondary flex items-center justify-center gap-2 group">
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Enviar Email
            </a>
          </div>
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-6">
          {/* Header Info */}
          <div>
            <h1 className="mb-2">{empreendedor.TB_EMPREENDEDOR_NOME}</h1>
            <p className="text-lg text-muted-foreground">{empreendedor.TB_EMPREENDEDOR_DESCRICAO_CURTA}</p>
          </div>

          {/* Categorias */}
          {empreendedor.categorias && empreendedor.categorias.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {empreendedor.categorias.map((cat) => (
                  <span
                    key={cat.TB_CATEGORIA_ID}
                    className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cat.TB_CATEGORIA_NOME}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Descrição Completa */}
          {empreendedor.TB_EMPREENDEDOR_DESCRICAO_COMPLETA && (
            <div>
              <h3 className="font-semibold mb-3">Sobre</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {empreendedor.TB_EMPREENDEDOR_DESCRICAO_COMPLETA}
              </p>
            </div>
          )}

          {/* Informações de Contato Card */}
          <div className="bg-card border border-border rounded-lg p-6 mt-auto">
            <h3 className="font-semibold mb-4">Informações de Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">
                    {empreendedor.TB_EMPREENDEDOR_CONTATO_WHATSAPP.toString().replace(/(\d)(?=(\d{2})+(?!\d))/g, "$1 ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="flex-1 break-all">
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{empreendedor.TB_EMPREENDEDOR_CONTATO_EMAIL}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
