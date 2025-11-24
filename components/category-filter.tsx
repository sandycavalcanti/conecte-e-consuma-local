"use client"

import type { Categoria } from "@/lib/types"

interface CategoryFilterProps {
  categories: Categoria[]
  selectedCategories: number[]
  onCategoryChange: (categoryId: number) => void
  onClearAll: () => void
}

export function CategoryFilter({ categories, selectedCategories, onCategoryChange, onClearAll }: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Categorias</h3>
        {selectedCategories.length > 0 && (
          <button onClick={onClearAll} className="text-xs text-accent hover:underline transition-colors">
            Limpar tudo
          </button>
        )}
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category.TB_CATEGORIA_ID}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.TB_CATEGORIA_ID)}
              onChange={() => onCategoryChange(category.TB_CATEGORIA_ID)}
              className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
            />
            <span className="text-foreground group-hover:text-accent transition-colors">
              {category.TB_CATEGORIA_NOME}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
