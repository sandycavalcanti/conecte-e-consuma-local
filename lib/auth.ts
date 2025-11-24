import { cookies } from "next/headers"
import type { Empreendedor } from "./types"

const TOKEN_NAME = "empreendedor_token"
const TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000 // 30 dias

interface AuthToken {
  id: number
  email: string
  nome: string
  exp: number
}

export async function setAuthCookie(empreendedor: Empreendedor): Promise<void> {
  const cookieStore = await cookies()
  const token: AuthToken = {
    id: empreendedor.TB_EMPREENDEDOR_ID,
    email: empreendedor.TB_EMPREENDEDOR_CONTATO_EMAIL,
    nome: empreendedor.TB_EMPREENDEDOR_NOME,
    exp: Date.now() + TOKEN_EXPIRES_IN,
  }

  cookieStore.set(TOKEN_NAME, JSON.stringify(token), {
    maxAge: TOKEN_EXPIRES_IN / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function getAuthCookie(): Promise<AuthToken | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_NAME)

  if (!token?.value) return null

  try {
    const parsed: AuthToken = JSON.parse(token.value)
    if (parsed.exp < Date.now()) {
      await clearAuthCookie()
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_NAME)
}
