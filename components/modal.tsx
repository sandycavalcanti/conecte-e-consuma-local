"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  isDangerous?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  isDangerous = false,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors" aria-label="Fechar modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">{children}</div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.()
              onClose()
            }}
            className={`flex-1 ${isDangerous ? "btn-danger" : "btn-primary"}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
