export interface Empreendedor {
  TB_EMPREENDEDOR_ID: number
  TB_EMPREENDEDOR_NOME: string
  TB_EMPREENDEDOR_FOTO: Buffer | null
  TB_EMPREENDEDOR_DESCRICAO_CURTA: string
  TB_EMPREENDEDOR_DESCRICAO_COMPLETA: string | null
  TB_EMPREENDEDOR_CONTATO_WHATSAPP: number
  TB_EMPREENDEDOR_CONTATO_EMAIL: string
  TB_EMPREENDEDOR_SENHA: string
  categorias?: number[]
}

export interface Categoria {
  TB_CATEGORIA_ID: number
  TB_CATEGORIA_NOME: string
}

export interface EmpreendedorComCategorias extends Empreendedor {
  categorias: Categoria[]
}
