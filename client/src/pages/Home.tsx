import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Sparkles, MessageCircle, Zap, Heart, Check, Star, TrendingUp } from "lucide-react";
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
      <header className="bg-black/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
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

      {/* Hero Section com Chat Demo */}
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Headline + CTA */}
          <div className="text-white">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-semibold">✨ Mais de 10.000 mensagens geradas</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black mb-6 drop-shadow-2xl leading-tight">
              Nunca Mais Fique Sem Resposta
            </h1>
            <p className="text-2xl mb-8 opacity-95">
              IA que gera respostas <span className="font-bold underline">irresistíveis</span> para suas conversas de flerte. 
              Escolha o tom e impressione!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-rose-600 hover:bg-gray-100 text-xl px-12 py-7 font-bold shadow-2xl"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Começar Grátis - 10 Mensagens
              </Button>
              <Button
                onClick={() => setLocation("/plans")}
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 text-xl px-8 py-7 font-bold"
              >
                Ver Planos
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-300" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-300" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Right: Chat Demo */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  J
                </div>
                <div>
                  <div className="font-bold text-gray-900">Julia</div>
                  <div className="text-sm text-green-500 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Online agora
                  </div>
                </div>
              </div>

              {/* Mensagem recebida */}
              <div className="mb-6">
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 inline-block max-w-[80%]">
                  <p className="text-gray-800 text-sm">
                    Oi! Sumiu né? Tava com saudade de conversar com você 😊
                  </p>
                  <div className="text-xs text-gray-500 mt-1">14:23</div>
                </div>
              </div>

              {/* Mensagem gerada pela IA */}
              <div className="flex justify-end mb-4">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl rounded-tr-sm p-4 inline-block max-w-[80%]">
                  <p className="text-white text-sm">
                    Saudade eu também tava sentindo... e confesso que de você inteirinha 😏
                  </p>
                  <div className="text-xs text-white/80 mt-1 text-right">14:24</div>
                </div>
              </div>

              {/* Badge IA */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gradient-to-r from-rose-50 to-pink-50 rounded-full px-4 py-2 w-fit mx-auto">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span className="font-semibold">Gerado por IA em 2 segundos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-20 border border-white/20">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-black mb-2">10.000+</div>
              <div className="text-lg opacity-90">Mensagens Geradas</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">4.9/5</div>
              <div className="text-lg opacity-90 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                Avaliação Média
              </div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">95%</div>
              <div className="text-lg opacity-90">Taxa de Sucesso</div>
            </div>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-white text-center mb-12 drop-shadow-xl">
            Como Funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cole a Mensagem</h3>
              <p className="text-gray-600 text-lg">
                Copie a mensagem que você recebeu e cole no app
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Escolha o Tom</h3>
              <p className="text-gray-600 text-lg">
                Normal, Safado ou Engraçado - você decide o estilo
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Copie e Envie</h3>
              <p className="text-gray-600 text-lg">
                Escolha entre 3 opções e mande a melhor resposta
              </p>
            </div>
          </div>
        </div>

        {/* Features com Imagens */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-white text-center mb-12 drop-shadow-xl">
            Por Que Escolher o Flerte Chat?
          </h2>
          
          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <img 
                src="/couple-flirting.jpg" 
                alt="Casal flertando" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="text-white order-1 lg:order-2">
              <div className="inline-block bg-rose-600 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-bold">🔥 MAIS POPULAR</span>
              </div>
              <h3 className="text-4xl font-black mb-6">Respostas que Funcionam de Verdade</h3>
              <p className="text-xl mb-6 opacity-95">
                Nossa IA foi treinada com milhares de conversas reais. Ela entende o contexto e gera 
                respostas naturais que parecem escritas por você.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg">100% brasileiro - com gírias e expressões autênticas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg">3 opções diferentes para cada situação</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg">Geração instantânea em menos de 3 segundos</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block bg-orange-600 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-bold">⚡ SUPER RÁPIDO</span>
              </div>
              <h3 className="text-4xl font-black mb-6">Nunca Mais Deixe no Vácuo</h3>
              <p className="text-xl mb-6 opacity-95">
                Acabou aquela ansiedade de não saber o que responder. Com o Flerte Chat, 
                você sempre tem a resposta perfeita na ponta dos dedos.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg">Responda em segundos, não em horas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg">Mantenha a conversa sempre fluindo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg">Impressione com respostas criativas</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="/couple-texting.jpg" 
                alt="Casal usando celular" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Depoimentos */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-white text-center mb-12 drop-shadow-xl">
            O Que Nossos Usuários Dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                "Cara, esse app salvou minha vida! Tava travado numa conversa e o Flerte Chat 
                me deu UMA resposta que fez ela rir demais. Agora a gente tá saindo 😂"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <div className="font-bold text-gray-900">Rafael, 25</div>
                  <div className="text-sm text-gray-500">São Paulo, SP</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                "Melhor investimento que fiz! As respostas são tão naturais que ninguém 
                percebe que foi IA. Já consegui 3 dates esse mês 🔥"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-bold text-gray-900">Marcos, 28</div>
                  <div className="text-sm text-gray-500">Rio de Janeiro, RJ</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                "Eu sou péssima pra flertar por texto, mas com esse app eu pareço 
                profissional! Recomendo demais ❤️"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <div className="font-bold text-gray-900">Carolina, 23</div>
                  <div className="text-sm text-gray-500">Belo Horizonte, MG</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-16 border-2 border-white/30 shadow-2xl">
          <h2 className="text-5xl font-black text-white mb-6 drop-shadow-xl">
            Pronto para Impressionar?
          </h2>
          <p className="text-2xl text-white/95 mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de pessoas que já estão conquistando com mensagens irresistíveis. 
            <span className="font-bold"> Comece grátis agora!</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-rose-600 hover:bg-gray-100 text-2xl px-16 py-8 font-black shadow-2xl"
            >
              <Sparkles className="w-7 h-7 mr-3" />
              Começar Grátis - 10 Mensagens
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 text-white text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-300" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-300" />
              <span>10 mensagens grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-300" />
              <span>Cancele quando quiser</span>
            </div>
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
