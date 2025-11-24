"use client"

import type React from "react"

import { useState } from "react"
import type { Categoria } from "@/lib/types"
import { ImageUploader } from "@/components/image-uploader"
import { Loader } from "lucide-react"

interface EmpreendedorFormProps {
  isEditing?: boolean
  initialData?: {
    nome: string
    descricaoCurta: string
    descricaoCompleta: string
    whatsapp: number
    email: string
    foto: Buffer | null
    categorias: number[]
  }
  categories: Categoria[]
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function EmpreendedorForm({
  isEditing = false,
  initialData,
  categories,
  onSubmit,
  onCancel,
  submitLabel = "Cadastrar",
}: EmpreendedorFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || "",
    descricaoCurta: initialData?.descricaoCurta || "",
    descricaoCompleta: initialData?.descricaoCompleta || "",
    whatsapp: initialData?.whatsapp.toString() || "",
    email: initialData?.email || "",
    senha: "", // add password field
    foto: null as File | null,
  })

  const [selectedCategories, setSelectedCategories] = useState<number[]>(initialData?.categorias || [])

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!formData.descricaoCurta.trim()) newErrors.descricaoCurta = "Descrição curta é obrigatória"
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp é obrigatório"
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
    if (!isEditing && !formData.senha.trim()) newErrors.senha = "Senha é obrigatória"
    if (!isEditing && formData.senha && formData.senha.length < 6)
      newErrors.senha = "Senha deve ter pelo menos 6 caracteres"
    if (selectedCategories.length === 0) newErrors.categorias = "Selecione pelo menos uma categoria"
    if (!isEditing && !formData.foto) newErrors.foto = "Foto é obrigatória"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      const submitFormData = new FormData()
      submitFormData.append("nome", formData.nome)
      submitFormData.append("descricaoCurta", formData.descricaoCurta)
      submitFormData.append("descricaoCompleta", formData.descricaoCompleta)
      submitFormData.append("whatsapp", formData.whatsapp)
      submitFormData.append("email", formData.email)
      submitFormData.append("categorias", JSON.stringify(selectedCategories))
      if (!isEditing) {
        submitFormData.append("senha", formData.senha)
      }

      if (formData.foto) {
        submitFormData.append("foto", formData.foto)
      }

      await onSubmit(submitFormData)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Nome do Empreendimento</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className={`input ${errors.nome ? "border-destructive focus:ring-destructive/20" : ""}`}
          placeholder="Digite o nome do seu negócio"
        />
        {errors.nome && <p className="text-destructive text-sm mt-1">{errors.nome}</p>}
      </div>

      {/* Foto */}
      {!isEditing && (
        <ImageUploader
          onImageChange={(file) => setFormData({ ...formData, foto: file })}
          label="Foto do Empreendimento"
        />
      )}

      {isEditing && (
        <ImageUploader
          onImageChange={(file) => setFormData({ ...formData, foto: file })}
          defaultImage={initialData?.foto || null}
          label="Atualizar Foto (opcional)"
        />
      )}

      {errors.foto && <p className="text-destructive text-sm">{errors.foto}</p>}

      {/* Descrição Curta */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Descrição Curta <span className="text-xs text-muted-foreground">(máx 250 caracteres)</span>
        </label>
        <textarea
          value={formData.descricaoCurta}
          onChange={(e) => setFormData({ ...formData, descricaoCurta: e.target.value.slice(0, 250) })}
          maxLength={250}
          rows={2}
          className={`input resize-none ${errors.descricaoCurta ? "border-destructive focus:ring-destructive/20" : ""}`}
          placeholder="Breve descrição do seu negócio"
        />
        <p className="text-xs text-muted-foreground mt-1">{formData.descricaoCurta.length}/250</p>
        {errors.descricaoCurta && <p className="text-destructive text-sm mt-1">{errors.descricaoCurta}</p>}
      </div>

      {/* Descrição Completa */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Descrição Completa <span className="text-xs text-muted-foreground">(máx 999 caracteres)</span>
        </label>
        <textarea
          value={formData.descricaoCompleta}
          onChange={(e) => setFormData({ ...formData, descricaoCompleta: e.target.value.slice(0, 999) })}
          maxLength={999}
          rows={4}
          className="input resize-none"
          placeholder="Descrição detalhada do seu negócio, produtos, serviços..."
        />
        <p className="text-xs text-muted-foreground mt-1">{formData.descricaoCompleta.length}/999</p>
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
        <input
          type="tel"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, "").slice(0, 11) })}
          className={`input ${errors.whatsapp ? "border-destructive focus:ring-destructive/20" : ""}`}
          placeholder="11999999999"
        />
        {errors.whatsapp && <p className="text-destructive text-sm mt-1">{errors.whatsapp}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`input ${errors.email ? "border-destructive focus:ring-destructive/20" : ""}`}
          placeholder="seu@email.com"
        />
        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
      </div>

      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
          <input
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            className={`input ${errors.senha ? "border-destructive focus:ring-destructive/20" : ""}`}
            placeholder="••••••••"
          />
          <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres</p>
          {errors.senha && <p className="text-destructive text-sm mt-1">{errors.senha}</p>}
        </div>
      )}

      {/* Categorias */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Categorias <span className="text-xs text-muted-foreground">(selecione pelo menos uma)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <label
              key={category.TB_CATEGORIA_ID}
              className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.TB_CATEGORIA_ID)}
                onChange={() => toggleCategory(category.TB_CATEGORIA_ID)}
                className="w-4 h-4 cursor-pointer accent-accent rounded border-border"
              />
              <span className="text-foreground">{category.TB_CATEGORIA_NOME}</span>
            </label>
          ))}
        </div>
        {errors.categorias && <p className="text-destructive text-sm mt-2">{errors.categorias}</p>}
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {loading && <Loader className="w-5 h-5 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
