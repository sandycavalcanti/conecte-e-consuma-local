"use client"

import { useState, useEffect } from "react"
import {
  getAllEmpreendedores,
  getAllCategorias,
  searchEmpreendedores,
  getEmpreendedoresByCategoria,
} from "@/app/server-actions"
import type { Empreendedor, Categoria } from "@/lib/types"
import { EmpreendedorCard } from "@/components/empreendedor-card"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { LoadingGrid } from "@/components/loading-skeleton"

export default function EmpreendedoresPage() {
  const [empreendedores, setEmpreendedores] = useState<(Empreendedor & { categorias: Categoria[] })[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Carrega categorias na montagem
  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    try {
      const cats = await getAllCategorias()
      setCategorias(cats)
    } catch (error) {
      console.error("[v0] Erro ao carregar categorias:", error)
    }
  }

  // Carrega empreendedores quando mudam os filtros
  useEffect(() => {
    loadEmpreendedores()
  }, [selectedCategories, searchQuery])

  const loadEmpreendedores = async () => {
    setLoading(true)
    try {
      let result

      if (searchQuery.trim()) {
        result = await searchEmpreendedores(searchQuery)
      } else if (selectedCategories.length > 0) {
        // Busca empreendedores de múltiplas categorias
        const allResults = await Promise.all(selectedCategories.map((catId) => getEmpreendedoresByCategoria(catId)))

        // Remove duplicatas
        const seen = new Set<number>()
        result = allResults.flat().filter((emp) => {
          if (seen.has(emp.TB_EMPREENDEDOR_ID)) return false
          seen.add(emp.TB_EMPREENDEDOR_ID)
          return true
        })
      } else {
        result = await getAllEmpreendedores()
      }

      setEmpreendedores(result)
    } catch (error) {
      console.error("[v0] Erro ao carregar empreendedores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleClearAll = () => {
    setSelectedCategories([])
    setSearchQuery("")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-balance">Descubra Empreendedores Locais</h1>
        <p className="text-xl text-muted-foreground mt-3 max-w-2xl">
          Conecte-se com negócios locais que transformam a comunidade
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <SearchBar onSearch={setSearchQuery} />
            {categorias.length > 0 && (
              <div className="card">
                <CategoryFilter
                  categories={categorias}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  onClearAll={handleClearAll}
                />
              </div>
            )}
          </div>
        </aside>

        {/* Grid de Empreendedores */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingGrid />
          ) : empreendedores.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {empreendedores.length} empreendedor{empreendedores.length !== 1 ? "es" : ""} encontrado
                {empreendedores.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {empreendedores.map((emp) => (
                  <EmpreendedorCard key={emp.TB_EMPREENDEDOR_ID} empreendedor={emp} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">Nenhum empreendedor encontrado</p>
              <button onClick={handleClearAll} className="btn-primary">
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
