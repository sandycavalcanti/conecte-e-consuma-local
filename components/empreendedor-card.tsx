"use client"

import Link from "next/link"
import type { Empreendedor } from "@/lib/types"
import { Tag } from "lucide-react"

interface EmpreendedorCardProps {
  empreendedor: Empreendedor & { categorias?: { TB_CATEGORIA_NOME: string }[] }
}

export function EmpreendedorCard({ empreendedor }: EmpreendedorCardProps) {
  const imageUrl = empreendedor.TB_EMPREENDEDOR_FOTO
    ? `data:image/jpeg;base64,${Buffer.from(empreendedor.TB_EMPREENDEDOR_FOTO).toString("base64")}`
    : "/empreendedor.jpg"

  return (
    <Link href={`/empreendedor/${empreendedor.TB_EMPREENDEDOR_ID}`}>
      <div className="card group overflow-hidden cursor-pointer h-full">
        <div className="relative w-full h-48 bg-muted overflow-hidden rounded-lg mb-4">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={empreendedor.TB_EMPREENDEDOR_NOME}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-serif font-bold text-lg mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {empreendedor.TB_EMPREENDEDOR_NOME}
        </h3>

        {empreendedor.categorias && empreendedor.categorias.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {empreendedor.categorias.slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded"
              >
                <Tag className="w-3 h-3" />
                {cat.TB_CATEGORIA_NOME}
              </span>
            ))}
          </div>
        )}

        <p className="text-muted-foreground text-sm line-clamp-2">{empreendedor.TB_EMPREENDEDOR_DESCRICAO_CURTA}</p>
      </div>
    </Link>
  )
}
