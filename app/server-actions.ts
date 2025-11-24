"use server"

import { getDBConnection } from "@/lib/db"
import { setAuthCookie, getAuthCookie, clearAuthCookie } from "@/lib/auth"
import type { Empreendedor, Categoria } from "@/lib/types"

export async function getAllEmpreendedores(): Promise<(Empreendedor & { categorias: Categoria[] })[]> {
  try {
    const connection = await getDBConnection()

    const [empreendedores] = (await connection.execute(
      "SELECT * FROM TB_EMPREENDEDOR ORDER BY TB_EMPREENDEDOR_NOME ASC",
    )) as any[]

    const result = []
    for (const emp of empreendedores) {
      const [categorias] = (await connection.execute(
        `SELECT c.TB_CATEGORIA_ID, c.TB_CATEGORIA_NOME 
         FROM TB_CATEGORIA c
         INNER JOIN TB_EMPREENDEDOR_CATEGORIA ec ON c.TB_CATEGORIA_ID = ec.TB_CATEGORIA_ID
         WHERE ec.TB_EMPREENDEDOR_ID = ?`,
        [emp.TB_EMPREENDEDOR_ID],
      )) as any[]

      result.push({ ...emp, categorias })
    }

    return result
  } catch (error) {
    console.error("[v0] Error fetching empreendedores:", error)
    throw error
  }
}

export async function getAllCategorias(): Promise<Categoria[]> {
  try {
    const connection = await getDBConnection()
    const [categorias] = (await connection.execute(
      "SELECT * FROM TB_CATEGORIA ORDER BY TB_CATEGORIA_NOME ASC",
    )) as any[]
    return categorias
  } catch (error) {
    console.error("[v0] Error fetching categorias:", error)
    throw error
  }
}

export async function searchEmpreendedores(query: string): Promise<(Empreendedor & { categorias: Categoria[] })[]> {
  try {
    const connection = await getDBConnection()
    const searchTerm = `%${query}%`

    const [empreendedores] = (await connection.execute(
      `SELECT * FROM TB_EMPREENDEDOR 
       WHERE TB_EMPREENDEDOR_NOME LIKE ? OR TB_EMPREENDEDOR_DESCRICAO_CURTA LIKE ?
       ORDER BY TB_EMPREENDEDOR_NOME ASC`,
      [searchTerm, searchTerm],
    )) as any[]

    const result = []
    for (const emp of empreendedores) {
      const [categorias] = (await connection.execute(
        `SELECT c.TB_CATEGORIA_ID, c.TB_CATEGORIA_NOME 
         FROM TB_CATEGORIA c
         INNER JOIN TB_EMPREENDEDOR_CATEGORIA ec ON c.TB_CATEGORIA_ID = ec.TB_CATEGORIA_ID
         WHERE ec.TB_EMPREENDEDOR_ID = ?`,
        [emp.TB_EMPREENDEDOR_ID],
      )) as any[]

      result.push({ ...emp, categorias })
    }

    return result
  } catch (error) {
    console.error("[v0] Error searching empreendedores:", error)
    throw error
  }
}

export async function getEmpreendedorById(id: number): Promise<(Empreendedor & { categorias: Categoria[] }) | null> {
  try {
    const connection = await getDBConnection()

    const [empreendedores] = (await connection.execute("SELECT * FROM TB_EMPREENDEDOR WHERE TB_EMPREENDEDOR_ID = ?", [
      id,
    ])) as any[]

    if (!empreendedores || empreendedores.length === 0) {
      return null
    }

    const emp = empreendedores[0]

    const [categorias] = (await connection.execute(
      `SELECT c.TB_CATEGORIA_ID, c.TB_CATEGORIA_NOME 
       FROM TB_CATEGORIA c
       INNER JOIN TB_EMPREENDEDOR_CATEGORIA ec ON c.TB_CATEGORIA_ID = ec.TB_CATEGORIA_ID
       WHERE ec.TB_EMPREENDEDOR_ID = ?`,
      [id],
    )) as any[]

    return { ...emp, categorias }
  } catch (error) {
    console.error("[v0] Error fetching empreendedor:", error)
    throw error
  }
}

export async function getEmpreendedoresByCategoria(
  categoryId: number,
): Promise<(Empreendedor & { categorias: Categoria[] })[]> {
  try {
    const connection = await getDBConnection()

    const [empreendedores] = (await connection.execute(
      `SELECT DISTINCT e.* FROM TB_EMPREENDEDOR e
       INNER JOIN TB_EMPREENDEDOR_CATEGORIA ec ON e.TB_EMPREENDEDOR_ID = ec.TB_EMPREENDEDOR_ID
       WHERE ec.TB_CATEGORIA_ID = ?
       ORDER BY e.TB_EMPREENDEDOR_NOME ASC`,
      [categoryId],
    )) as any[]

    const result = []
    for (const emp of empreendedores) {
      const [categorias] = (await connection.execute(
        `SELECT c.TB_CATEGORIA_ID, c.TB_CATEGORIA_NOME 
         FROM TB_CATEGORIA c
         INNER JOIN TB_EMPREENDEDOR_CATEGORIA ec ON c.TB_CATEGORIA_ID = ec.TB_CATEGORIA_ID
         WHERE ec.TB_EMPREENDEDOR_ID = ?`,
        [emp.TB_EMPREENDEDOR_ID],
      )) as any[]

      result.push({ ...emp, categorias })
    }

    return result
  } catch (error) {
    console.error("[v0] Error fetching empreendedores by category:", error)
    throw error
  }
}

export async function loginEmpreendedor(email: string, password: string): Promise<Empreendedor | null> {
  try {
    const connection = await getDBConnection()

    const [result] = (await connection.execute(
      "SELECT * FROM TB_EMPREENDEDOR WHERE TB_EMPREENDEDOR_CONTATO_EMAIL = ?",
      [email],
    )) as any[]

    if (!result || result.length === 0) {
      return null
    }

    const empreendedor = result[0]

    // Verificar senha (comparação simples - em produção use bcrypt)
    if (empreendedor.TB_EMPREENDEDOR_SENHA !== password) {
      return null
    }

    // Definir cookie de autenticação
    await setAuthCookie(empreendedor)

    return empreendedor
  } catch (error) {
    console.error("[v0] Error logging in:", error)
    throw error
  }
}

export async function logoutEmpreendedor(): Promise<void> {
  try {
    await clearAuthCookie()
  } catch (error) {
    console.error("[v0] Error logging out:", error)
    throw error
  }
}

export async function getCurrentEmpreendedor(): Promise<Empreendedor | null> {
  try {
    const auth = await getAuthCookie()
    if (!auth) return null

    const connection = await getDBConnection()
    const [result] = (await connection.execute("SELECT * FROM TB_EMPREENDEDOR WHERE TB_EMPREENDEDOR_ID = ?", [
      auth.id,
    ])) as any[]

    if (!result || result.length === 0) {
      return null
    }

    return result[0]
  } catch (error) {
    console.error("[v0] Error getting current empreendedor:", error)
    return null
  }
}

export async function createEmpreendedor(
  nome: string,
  descricaoCurta: string,
  descricaoCompleta: string,
  whatsapp: number,
  email: string,
  senha: string,
  fotoBase64: string | null,
  categorias: number[],
): Promise<number> {
  try {
    const connection = await getDBConnection()

    // Converter base64 em Buffer
    let foto: Buffer | null = null
    if (fotoBase64) {
      foto = Buffer.from(fotoBase64, "base64")
    }

    // Obter próximo ID
    const [result] = (await connection.execute("SELECT MAX(TB_EMPREENDEDOR_ID) as maxId FROM TB_EMPREENDEDOR")) as any[]
    const nextId = (result[0]?.maxId || 0) + 1

    // Inserir empreendedor com senha
    await connection.execute(
      `INSERT INTO TB_EMPREENDEDOR 
       (TB_EMPREENDEDOR_ID, TB_EMPREENDEDOR_NOME, TB_EMPREENDEDOR_FOTO, 
        TB_EMPREENDEDOR_DESCRICAO_CURTA, TB_EMPREENDEDOR_DESCRICAO_COMPLETA, 
        TB_EMPREENDEDOR_CONTATO_WHATSAPP, TB_EMPREENDEDOR_CONTATO_EMAIL, TB_EMPREENDEDOR_SENHA)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nextId, nome, foto, descricaoCurta, descricaoCompleta, whatsapp, email, senha],
    )

    // Inserir categorias
    for (const catId of categorias) {
      const [catResult] = (await connection.execute(
        "SELECT MAX(TB_EMPREENDEDOR_CATEGORIA_ID) as maxId FROM TB_EMPREENDEDOR_CATEGORIA",
      )) as any[]
      const nextCatId = (catResult[0]?.maxId || 0) + 1

      await connection.execute(
        `INSERT INTO TB_EMPREENDEDOR_CATEGORIA 
         (TB_EMPREENDEDOR_CATEGORIA_ID, TB_CATEGORIA_ID, TB_EMPREENDEDOR_ID)
         VALUES (?, ?, ?)`,
        [nextCatId, catId, nextId],
      )
    }

    const empreendedor = {
      TB_EMPREENDEDOR_ID: nextId,
      TB_EMPREENDEDOR_NOME: nome,
      TB_EMPREENDEDOR_CONTATO_EMAIL: email,
    } as any
    await setAuthCookie(empreendedor)

    console.log("[v0] Empreendedor criado com ID:", nextId)
    return nextId
  } catch (error) {
    console.error("[v0] Error creating empreendedor:", error)
    throw error
  }
}

export async function updateEmpreendedor(
  id: number,
  nome: string,
  descricaoCurta: string,
  descricaoCompleta: string,
  whatsapp: number,
  email: string,
  fotoBase64: string | null,
  categorias: number[],
): Promise<void> {
  try {
    const connection = await getDBConnection()

    // Converter base64 para Buffer se fornecido
    let foto: Buffer | null = null
    if (fotoBase64) {
      foto = Buffer.from(fotoBase64, "base64")
    }

    // Atualizar empreendedor
    await connection.execute(
      `UPDATE TB_EMPREENDEDOR 
       SET TB_EMPREENDEDOR_NOME = ?, 
           TB_EMPREENDEDOR_FOTO = COALESCE(?, TB_EMPREENDEDOR_FOTO),
           TB_EMPREENDEDOR_DESCRICAO_CURTA = ?,
           TB_EMPREENDEDOR_DESCRICAO_COMPLETA = ?,
           TB_EMPREENDEDOR_CONTATO_WHATSAPP = ?,
           TB_EMPREENDEDOR_CONTATO_EMAIL = ?
       WHERE TB_EMPREENDEDOR_ID = ?`,
      [nome, foto, descricaoCurta, descricaoCompleta, whatsapp, email, id],
    )

    // Atualizar categorias
    await connection.execute("DELETE FROM TB_EMPREENDEDOR_CATEGORIA WHERE TB_EMPREENDEDOR_ID = ?", [id])

    for (const catId of categorias) {
      const [catResult] = (await connection.execute(
        "SELECT MAX(TB_EMPREENDEDOR_CATEGORIA_ID) as maxId FROM TB_EMPREENDEDOR_CATEGORIA",
      )) as any[]
      const nextCatId = (catResult[0]?.maxId || 0) + 1

      await connection.execute(
        `INSERT INTO TB_EMPREENDEDOR_CATEGORIA 
         (TB_EMPREENDEDOR_CATEGORIA_ID, TB_CATEGORIA_ID, TB_EMPREENDEDOR_ID)
         VALUES (?, ?, ?)`,
        [nextCatId, catId, id],
      )
    }

    console.log("[v0] Empreendedor atualizado:", id)
  } catch (error) {
    console.error("[v0] Error updating empreendedor:", error)
    throw error
  }
}

export async function deleteEmpreendedor(id: number): Promise<void> {
  try {
    const connection = await getDBConnection()

    // Deletar categorias associadas
    await connection.execute("DELETE FROM TB_EMPREENDEDOR_CATEGORIA WHERE TB_EMPREENDEDOR_ID = ?", [id])

    // Deletar empreendedor
    await connection.execute("DELETE FROM TB_EMPREENDEDOR WHERE TB_EMPREENDEDOR_ID = ?", [id])

    console.log("[v0] Empreendedor deletado:", id)
  } catch (error) {
    console.error("[v0] Error deleting empreendedor:", error)
    throw error
  }
}
