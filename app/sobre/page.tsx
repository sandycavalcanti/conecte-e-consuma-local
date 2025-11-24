"use client"

import Link from "next/link"
import { Heart, Users, Lightbulb, ArrowRight, CheckCircle } from "lucide-react"

export default function SobrePage() {
  const values = [
    {
      icon: Heart,
      title: "Comunidade",
      description: "Fortalecemos os laços entre consumidores e empreendedores locais.",
    },
    {
      icon: Users,
      title: "Inclusão",
      description: "Garantimos acesso igualitário à oportunidade digital para todos.",
    },
    {
      icon: Lightbulb,
      title: "Inovação",
      description: "Promovemos soluções criativas para o comércio local.",
    },
  ]

  const benefits = [
    "Maior visibilidade para seu negócio",
    "Conexão direta com clientes locais",
    "Ferramenta de marketing poderosa",
    "Sem custos ou taxas escondidas",
    "Suporte e orientação contínua",
    "Comunidade de empreendedores",
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="mb-6">Sobre Conecte Local</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Uma plataforma dedicada a fortalecer o comércio local, conectando consumidores conscientes com
            empreendedores que fazem a diferença na comunidade.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-card border-y border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Conecte Local existe para democratizar o acesso ao comércio digital. Acreditamos que todo empreendedor
                local merece uma vitrine digital elegante e funcional, sem barreiras técnicas ou financeiras.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nosso objetivo é criar um ecossistema onde o consumo local gera impacto direto na economia das
                comunidades, fortalecendo negócios, criando empregos e promovendo prosperidade compartilhada.
              </p>
            </div>
            <div className="h-96 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg border border-border flex items-center justify-center">
              <Heart className="w-32 h-32 text-accent/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <h2 className="text-center mb-12">Nossos Valores</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <div key={idx} className="card text-center">
                <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif font-bold mb-3 text-lg">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-accent/10 border-y border-accent/20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center mb-12">O Impacto Local</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "500+", label: "Empreendedores Conectados" },
              { number: "10K+", label: "Consumidores Ativos" },
              { number: "Bilhões", label: "em Economia Local" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-serif font-bold text-accent mb-2">{stat.number}</p>
                <p className="text-lg text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Participate */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <h2 className="mb-4">Como Participar?</h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
          Conecte Local é aberta para todos. Se você é um empreendedor, cadastre seu negócio. Se é um consumidor,
          explore e apoie os negócios da sua comunidade.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Para Empreendedores */}
          <div className="card">
            <h3 className="font-serif font-bold mb-6 text-lg">Para Empreendedores</h3>
            <ul className="space-y-4">
              {[
                "Cadastro simples e gratuito",
                "Apresente seus produtos/serviços",
                "Conecte com clientes locais",
                "Receba contatos diretos",
                "Atualize suas informações",
                "Cresça com a comunidade",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/cadastro" className="btn-primary w-full mt-8">
              Cadastrar Meu Negócio
            </Link>
          </div>

          {/* Para Consumidores */}
          <div className="card">
            <h3 className="font-serif font-bold mb-6 text-lg">Para Consumidores</h3>
            <ul className="space-y-4">
              {[
                "Explore negócios locais",
                "Descubra produtos únicos",
                "Apoie a economia local",
                "Encontre o que procura",
                "Conecte direto com negócios",
                "Fortaleça a comunidade",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/empreendedores" className="btn-primary w-full mt-8">
              Explorar Negócios
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-card border-t border-border py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-center mb-12">Perguntas Frequentes</h2>

          <div className="space-y-6">
            {[
              {
                q: "O cadastro é realmente gratuito?",
                a: "Sim! Conecte Local é 100% gratuito. Não há taxas de cadastro, inscrição ou qualquer custo escondido. Queremos democratizar o acesso ao comércio digital.",
              },
              {
                q: "Como recebo contatos de clientes?",
                a: "Seu perfil exibe botões de contato direto via WhatsApp e Email. Os clientes interessados podem entrar em contato diretamente com você através desses canais.",
              },
              {
                q: "Posso atualizar meu perfil?",
                a: "Claro! Você pode editar suas informações, fotos, descrição e categorias a qualquer momento através da página de edição do seu perfil.",
              },
              {
                q: "Como faço para achar um empreendedor?",
                a: "Use a barra de busca para procurar por nome ou explore os filtros por categoria. Você também pode navegar pela lista completa de todos os empreendedores cadastrados.",
              },
              {
                q: "Quais dados preciso fornecer?",
                a: "Nome do negócio, foto, descrição curta e completa, categorias, WhatsApp e email. Todos esses dados ajudam clientes a conhecer melhor seu negócio.",
              },
              {
                q: "Posso deletar meu perfil?",
                a: "Sim, você pode deletar seu perfil a qualquer momento através da página de edição. Esta ação é irreversível.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
                <h3 className="font-semibold mb-3 text-foreground">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-8 md:p-12 text-center">
          <h2 className="mb-6">Pronto para Conectar?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a nossa comunidade de empreendedores e consumidores que acreditam no poder do comércio local.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro" className="btn-primary inline-flex items-center gap-2">
              Cadastrar Negócio <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/empreendedores" className="btn-secondary inline-flex items-center gap-2">
              Explorar <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
