export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif font-bold mb-4">Conecte Local</h3>
            <p className="text-muted-foreground">Plataforma que conecta consumidores com empreendedores locais.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="/" className="hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/empreendedores" className="hover:text-accent transition-colors">
                  Empreendedores
                </a>
              </li>
              <li>
                <a href="/sobre" className="hover:text-accent transition-colors">
                  Sobre
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <p className="text-muted-foreground">Email: contato@conectelocal.com</p>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Conecte Local. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
