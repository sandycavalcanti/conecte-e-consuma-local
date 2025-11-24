"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllCategorias, createEmpreendedor } from "@/app/server-actions"
import { EmpreendedorForm } from "@/components/empreendedor-form"
import type { Categoria } from "@/lib/types"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function CadastroPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const cats = await getAllCategorias()
      setCategories(cats)
    } catch (error) {
      console.error("[v0] Error loading categories:", error)
      setMessage({ type: "error", text: "Erro ao carregar categorias" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const nome = formData.get("nome") as string
      const descricaoCurta = formData.get("descricaoCurta") as string
      const descricaoCompleta = formData.get("descricaoCompleta") as string
      const whatsapp = Number.parseInt(formData.get("whatsapp") as string)
      const email = formData.get("email") as string
      const senha = formData.get("senha") as string
      const categorias = JSON.parse(formData.get("categorias") as string)

      let fotoBuffer: Buffer | null = null
      const fotoFile = formData.get("foto") as File
      if (fotoFile) {
        const arrayBuffer = await fotoFile.arrayBuffer()
        fotoBuffer = Buffer.from(arrayBuffer)
      }

      const newId = await createEmpreendedor(
        nome,
        descricaoCurta,
        descricaoCompleta,
        whatsapp,
        email,
        senha,
        fotoBuffer,
        categorias,
      )

      setMessage({ type: "success", text: "Empreendedor cadastrado com sucesso!" })

      window.dispatchEvent(new CustomEvent("loginSuccess"))

      setTimeout(() => {
        router.push(`/empreendedor/${newId}`)
      }, 1500)
    } catch (error) {
      console.error("[v0] Error creating empreendedor:", error)
      setMessage({ type: "error", text: "Erro ao cadastrar empreendedor" })
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        <p className="text-center text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <h1 className="mb-3">Cadastro de Empreendedor</h1>
        <p className="text-lg text-muted-foreground">Registre seu negócio e conecte-se com consumidores locais</p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
            message.type === "success"
              ? "bg-success/10 border border-success/20 text-success"
              : "bg-error/10 border border-error/20 text-error"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      <div className="card">
        <EmpreendedorForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => window.history.back()}
          submitLabel="Cadastrar"
        />
      </div>
    </div>
  )
}
