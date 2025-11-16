import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  LogOut,
  Copy,
  Check,
  Sparkles,
  Send,
  CreditCard,
  Mail,
  Phone,
  User,
  MessageSquare,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[]; // For AI generated options
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [tone, setTone] = useState<"natural" | "bold" | "funny">("bold");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const toneOptions = [
    { id: "bold", label: "Safado", icon: "😏", color: "from-rose-500 to-pink-600" },
    { id: "natural", label: "Normal", icon: "🙂", color: "from-blue-500 to-cyan-600" },
    { id: "funny", label: "Engraçado", icon: "😄", color: "from-yellow-500 to-orange-600" },
  ];

  const creditsQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const conversationsQuery = trpc.flerte.listConversations.useQuery(undefined, {
    enabled: isAuthenticated && showHistoryModal,
  });

  const generateMutation = trpc.flerte.generateMessage.useMutation({
    onSuccess: (data: any) => {
      const generatedOptions = data.messages || [];
      const optionsContent = generatedOptions.map((m: any) => m.content);
      
      // Add assistant message with options
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "",
          options: optionsContent,
        }
      ]);
      
      creditsQuery.refetch();
      toast.success("3 respostas geradas!");
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error: any) => {
      if (error.message === "NO_CREDITS") {
        toast.error("Seus créditos acabaram!");
        setLocation("/plans");
      } else {
        toast.error("Erro ao gerar mensagem: " + error.message);
      }
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleGenerate = () => {
    if (!context.trim()) {
      toast.error("Digite a mensagem que você recebeu");
      return;
    }

    // Add user message to chat
    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: context.trim(),
      }
    ]);

    // Clear input
    setContext("");

    // Generate responses
    generateMutation.mutate({
      context: context.trim(),
      tone,
    });
  };

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message);
    setCopied(message);
    toast.success("Mensagem copiada!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleLogout = () => {
    const logoutMutation = trpc.auth.logout.useMutation();
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Até logo!");
        setLocation("/");
      },
    });
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link
    const subject = encodeURIComponent(`Contato de ${contactForm.name}`);
    const body = encodeURIComponent(
      `Nome: ${contactForm.name}\nTelefone: ${contactForm.phone}\nEmail: ${contactForm.email}\n\nMensagem:\n${contactForm.message}`
    );
    
    window.location.href = `mailto:pauloromulo2000k@gmail.com?subject=${subject}&body=${body}`;
    
    toast.success("Abrindo seu cliente de email...");
    setShowContactModal(false);
    setContactForm({ name: "", phone: "", email: "", message: "" });
  };

  const credits = creditsQuery.data?.creditsRemaining ?? 0;
  const plan = creditsQuery.data?.plan || "free";

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-bold text-xl text-gray-800 block app-title">{APP_TITLE}</span>
              <span className="text-xs text-gray-500 italic">"Sua arma secreta para quebrar o gelo"</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              onClick={() => setShowHistoryModal(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </Button>
            <Button
              onClick={() => setLocation("/plans")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span className="font-bold text-rose-600">{credits} créditos</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 flex flex-col">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="mb-8">
              <img src={APP_LOGO} alt="Logo" className="w-24 h-24 object-contain mb-4 animate-pulse" />
              <h1 className="text-4xl font-black text-gray-800 mb-4">
                Nunca Mais Fique Sem Resposta
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Cole a mensagem que você recebeu, escolha o tom e receba 3 respostas irresistíveis!
              </p>
            </div>
            
            {/* Tone Selector */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">Escolha o tom:</p>
              <div className="flex gap-3">
                {toneOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTone(option.id as any)}
                    className={`px-6 py-3 rounded-2xl font-bold text-white transition-all ${
                      tone === option.id
                        ? `bg-gradient-to-r ${option.color} scale-110 shadow-lg`
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    <span className="text-2xl mr-2">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-4 space-y-6">
            {messages.map((message, index) => (
              <div key={index}>
                {message.role === "user" && (
                  <div className="flex justify-start mb-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl rounded-tl-sm px-6 py-4 max-w-[80%] shadow-md border border-gray-200">
                      <p className="text-gray-800 italic text-lg">"{message.content}"</p>
                    </div>
                  </div>
                )}
                
                {message.role === "assistant" && message.options && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1"></div>
                      <span className="text-rose-600 font-bold text-lg">Responda:</span>
                      <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1"></div>
                    </div>
                    
                    {message.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className="bg-white rounded-3xl px-6 py-5 shadow-lg border-2 border-rose-100 hover:border-rose-300 transition-all hover:scale-[1.02] group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-gray-800 text-lg flex-1">{option}</p>
                          <button
                            onClick={() => handleCopy(option)}
                            className="flex-shrink-0 p-3 rounded-full bg-rose-50 hover:bg-rose-100 transition-colors"
                            title="Copiar"
                          >
                            {copied === option ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-rose-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handleGenerate}
                        disabled={!context.trim() || generateMutation.isPending}
                        className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-8 py-6 rounded-full font-bold text-lg shadow-xl"
                      >
                        {generateMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Gerar mais
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-6">
          {messages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Tom:</p>
              <div className="flex gap-3">
                {toneOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTone(option.id as any)}
                    className={`px-4 py-2 rounded-xl font-bold text-white transition-all text-sm ${
                      tone === option.id
                        ? `bg-gradient-to-r ${option.color} scale-105 shadow-md`
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    <span className="text-lg mr-1">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Cole aqui a mensagem que você recebeu..."
              className="flex-1 min-h-[80px] resize-none border-2 border-gray-200 focus:border-rose-400 rounded-2xl text-lg"
            />
            <Button
              onClick={handleGenerate}
              disabled={!context.trim() || generateMutation.isPending || credits === 0}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-6 rounded-2xl font-bold shadow-lg"
            >
              {generateMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </Button>
          </div>
          
          {credits === 0 && (
            <div className="mt-4 text-center">
              <p className="text-red-600 font-semibold mb-2">
                Você não tem mais créditos!
              </p>
              <Button
                onClick={() => setLocation("/plans")}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              >
                Ver Planos
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Créditos restantes: <span className="font-bold text-rose-600">{credits}</span>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      <div ref={reviewsRef} className="bg-gradient-to-r from-rose-100 to-orange-100 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-gray-800 mb-12">
            O Que Nossos Usuários Dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Cara, esse app salvou minha vida! Tava travado numa conversa e o Flerte Chat me deu UMA resposta que fez ela rir demais. Agora a gente tá saindo!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <p className="font-bold text-gray-800">Rafael, 25</p>
                  <p className="text-sm text-gray-500">São Paulo, SP</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Melhor investimento que fiz! As respostas são naturais que ninguém percebe que foi IA. Já consegui sair com 3 pessoas esse mês 😍"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-bold text-gray-800">Marcia, 28</p>
                  <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Eu sou péssima pra flertar por texto, mas com o Flerte Chat eu pareço profissional! Recomendo demais ❤️"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <p className="font-bold text-gray-800">Carolina, 23</p>
                  <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-xl app-title">{APP_TITLE}</span>
              </div>
              <p className="text-gray-400 text-sm italic mb-4">
                "Sua arma secreta para quebrar o gelo"
              </p>
              <p className="text-gray-400 text-sm">
                © 2025 FlerteChat. Todos os direitos reservados.
              </p>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="mailto:pauloromulo2000k@gmail.com"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email de Suporte
                  </a>
                </li>
                <li>
                  <button
                    onClick={scrollToReviews}
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Avaliações
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contate-nos
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => setLocation("/privacy")}
                    className="hover:text-white transition-colors"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/terms")}
                    className="hover:text-white transition-colors"
                  >
                    Termos e Condições
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/faq")}
                    className="hover:text-white transition-colors"
                  >
                    Perguntas Frequentes
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-lg mb-4">Empresa</h3>
              <p className="text-gray-400 text-sm mb-2">FlerteChat</p>
              <p className="text-gray-400 text-sm">
                Transformando conversas em conexões reais desde 2025.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Entre em Contato
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Preencha o formulário abaixo e entraremos em contato em breve!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Seu nome"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  required
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Mensagem
              </label>
              <Textarea
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Como podemos ajudar?"
                className="min-h-[120px]"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-6"
            >
              <Send className="w-5 h-5 mr-2" />
              Enviar Mensagem
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Histórico de Conversas
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Veja todas as suas conversas anteriores
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {conversationsQuery.isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              </div>
            )}
            
            {conversationsQuery.data && conversationsQuery.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma conversa ainda</p>
                <p className="text-sm">Comece gerando sua primeira mensagem!</p>
              </div>
            )}
            
            {conversationsQuery.data?.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  // Carregar conversa
                  trpc.flerte.getConversation.useQuery({ id: conversation.id });
                  setShowHistoryModal(false);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(conversation.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-gray-700 font-medium line-clamp-2">
                      {conversation.context}
                    </p>
                  </div>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 ml-2">
                    {conversation.tone === 'bold' ? '😏 Safado' : conversation.tone === 'funny' ? '😄 Engraçado' : '🙂 Normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
