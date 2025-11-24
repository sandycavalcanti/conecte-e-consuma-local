import Link from "next/link"
import { ArrowRight, Store, Users, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-balance mb-6">Conecte e Consuma Local</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Descubra uma comunidade vibrante de empreendedores locais. Apoie negócios da sua região e fortaleça a
              economia local.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/empreendedores" className="btn-primary flex items-center justify-center gap-2">
                Explorar <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/sobre" className="btn-secondary flex items-center justify-center gap-2">
                Saber Mais
              </Link>
            </div>
          </div>
          <div className="h-96 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg border border-border flex items-center justify-center">
            <Store className="w-32 h-32 text-accent/30" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center mb-12">Por Que Conecte Local?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Comunidade Forte",
                description: "Conecte-se com empreendedores que compartilham sua visão de economia local.",
              },
              {
                icon: Store,
                title: "Produtos Únicos",
                description: "Descubra produtos e serviços exclusivos que só você encontra na sua região.",
              },
              {
                icon: TrendingUp,
                title: "Economia Local",
                description: "Seu consumo gera impacto direto no desenvolvimento econômico da comunidade.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="card text-center">
                  <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-serif font-bold mb-3 text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-8 md:p-12 text-center">
          <h2 className="mb-6">Você é um Empreendedor?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cadastre seu negócio e conecte-se com consumidores que buscam exatamente o que você oferece.
          </p>
          <Link href="/cadastro" className="btn-primary inline-flex items-center gap-2">
            Cadastrar Meu Negócio <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
