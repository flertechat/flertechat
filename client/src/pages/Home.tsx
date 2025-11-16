import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Sparkles, MessageCircle, Zap, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation("/app");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/20">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-pulse">{APP_LOGO}</span>
            <span className="font-bold text-2xl text-white drop-shadow-lg">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/plans")}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              Planos
            </Button>
            <Button
              onClick={handleGetStarted}
              className="bg-white text-rose-600 hover:bg-gray-100 font-bold"
            >
              {isAuthenticated ? "Ir para o App" : "Começar Grátis"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black text-white mb-6 drop-shadow-2xl">
            Nunca Mais Fique Sem Resposta
          </h1>
          <p className="text-2xl text-white/95 mb-8 max-w-3xl mx-auto">
            Use inteligência artificial para gerar respostas perfeitas para suas conversas de flerte.
            Escolha o tom ideal e impressione!
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-rose-600 hover:bg-gray-100 text-xl px-12 py-6 font-bold shadow-2xl"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Começar Agora - 10 Mensagens Grátis
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">3 Opções por Vez</h3>
            <p className="text-white/90">
              Gere 3 respostas diferentes e escolha a que mais combina com você
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Tons Personalizados</h3>
            <p className="text-white/90">
              Escolha entre Normal, Safado ou Engraçado para cada situação
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">100% Brasileiro</h3>
            <p className="text-white/90">
              Respostas naturais com gírias e expressões brasileiras autênticas
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pronto para Impressionar?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Comece grátis agora com 10 mensagens. Sem cartão de crédito necessário.
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-rose-600 hover:bg-gray-100 text-xl px-12 py-6 font-bold shadow-2xl"
            >
              Começar Grátis Agora
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-8 text-center text-white/80">
          <p>© 2024 {APP_TITLE}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
