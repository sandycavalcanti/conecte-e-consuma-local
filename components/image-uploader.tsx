"use client"

import { type ChangeEvent, useRef, useState } from "react"
import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  onImageChange: (file: File) => void
  defaultImage?: Buffer | null
  label?: string
}

export function ImageUploader({ onImageChange, defaultImage, label = "Foto" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(
    defaultImage ? `data:image/jpeg;base64,${Buffer.from(defaultImage).toString("base64")}` : null,
  )

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageChange(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">{label}</label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null)
              if (inputRef.current) inputRef.current.value = ""
            }}
            className="absolute top-2 right-2 p-2 bg-error text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remover imagem"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group"
        >
          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-accent mx-auto mb-3 transition-colors" />
          <p className="text-sm font-medium text-foreground mb-1">Clique para upload</p>
          <p className="text-xs text-muted-foreground">PNG, JPG (máx. 5MB)</p>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
