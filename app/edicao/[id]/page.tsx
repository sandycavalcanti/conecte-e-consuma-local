"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getEmpreendedorById, getAllCategorias, updateEmpreendedor, deleteEmpreendedor } from "@/app/server-actions"
import { EmpreendedorForm } from "@/components/empreendedor-form"
import { Modal } from "@/components/modal"
import type { Categoria, Empreendedor } from "@/lib/types"
import { AlertCircle, CheckCircle, Trash2, Loader } from "lucide-react"

export default function EdicaoPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [empreendedor, setEmpreendedor] = useState<(Empreendedor & { categorias: Categoria[] }) | null>(null)
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [emp, cats] = await Promise.all([getEmpreendedorById(id), getAllCategorias()])

      if (!emp) {
        setMessage({ type: "error", text: "Empreendedor não encontrado" })
        setTimeout(() => router.push("/empreendedores"), 2000)
        return
      }

      setEmpreendedor(emp)
      setCategories(cats)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      setMessage({ type: "error", text: "Erro ao carregar dados" })
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
      const categorias = JSON.parse(formData.get("categorias") as string)

      let fotoBuffer: Buffer | null = null
      const fotoFile = formData.get("foto") as File
      if (fotoFile) {
        const arrayBuffer = await fotoFile.arrayBuffer()
        fotoBuffer = Buffer.from(arrayBuffer)
      }

      await updateEmpreendedor(id, nome, descricaoCurta, descricaoCompleta, whatsapp, email, fotoBuffer, categorias)

      setMessage({ type: "success", text: "Empreendedor atualizado com sucesso!" })
      setTimeout(() => {
        router.push(`/empreendedor/${id}`)
      }, 1500)
    } catch (error) {
      console.error("[v0] Error updating empreendedor:", error)
      setMessage({ type: "error", text: "Erro ao atualizar empreendedor" })
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteEmpreendedor(id)
      setMessage({ type: "success", text: "Empreendedor deletado com sucesso!" })
      setTimeout(() => {
        router.push("/empreendedores")
      }, 1500)
    } catch (error) {
      console.error("[v0] Error deleting empreendedor:", error)
      setMessage({ type: "error", text: "Erro ao deletar empreendedor" })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!empreendedor) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
              message.type === "success" ? "bg-success/10" : "bg-error/10"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <p>{message.text}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <h1 className="mb-3">Editar Empreendedor</h1>
        <p className="text-lg text-muted-foreground">{empreendedor.TB_EMPREENDEDOR_NOME}</p>
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

      <div className="space-y-6">
        <div className="card">
          <EmpreendedorForm
            isEditing
            initialData={{
              nome: empreendedor.TB_EMPREENDEDOR_NOME,
              descricaoCurta: empreendedor.TB_EMPREENDEDOR_DESCRICAO_CURTA,
              descricaoCompleta: empreendedor.TB_EMPREENDEDOR_DESCRICAO_COMPLETA || "",
              whatsapp: empreendedor.TB_EMPREENDEDOR_CONTATO_WHATSAPP,
              email: empreendedor.TB_EMPREENDEDOR_CONTATO_EMAIL,
              foto: empreendedor.TB_EMPREENDEDOR_FOTO,
              categorias: empreendedor.categorias.map((c) => c.TB_CATEGORIA_ID),
            }}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/empreendedor/${id}`)}
            submitLabel="Salvar Alterações"
          />
        </div>

        {/* Delete Section */}
        <div className="card border-error/20 bg-error/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Deletar Empreendedor</h3>
              <p className="text-sm text-muted-foreground">Esta ação é irreversível</p>
            </div>
            <button
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeleting}
              className="btn-danger flex items-center gap-2"
            >
              {isDeleting && <Loader className="w-5 h-5 animate-spin" />}
              <Trash2 className="w-5 h-5" />
              Deletar
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Deleção"
        confirmText="Deletar"
        cancelText="Cancelar"
        isDangerous
        onConfirm={handleDelete}
      >
        <p className="text-foreground mb-4">
          Tem certeza que deseja deletar este empreendedor? Esta ação não pode ser desfeita.
        </p>
        <p className="text-sm text-muted-foreground font-medium">{empreendedor.TB_EMPREENDEDOR_NOME}</p>
      </Modal>
    </div>
  )
}
