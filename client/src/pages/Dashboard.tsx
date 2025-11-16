import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { APP_LOGO, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  LogOut,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [context, setContext] = useState("");
  const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [tone, setTone] = useState<"natural" | "bold" | "funny">("natural");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toneOptions = [
    { id: "bold", label: "Safado", icon: "😏" },
    { id: "natural", label: "Normal", icon: "🙂" },
    { id: "funny", label: "Engraçado", icon: "😄" },
  ];

  const creditsQuery = trpc.subscription.get.useQuery();

  const generateMutation = trpc.flerte.generateMessage.useMutation({
    onSuccess: (data: any) => {
      const messages = data.messages || [];
      setGeneratedMessages(messages.map((m: any) => m.content));
      creditsQuery.refetch();
      toast.success("3 mensagens geradas!");
    },
    onError: (error: any) => {
      if (error.message === "NO_CREDITS") {
        toast.error("Seus créditos acabaram!");
        setLocation("/plans");
      } else {
        toast.error("Erro ao gerar mensagem.");
      }
    },
  });

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleGenerate = () => {
    if (!context.trim()) {
      toast.error("Digite um contexto");
      return;
    }

    generateMutation.mutate({
      context: context.trim(),
      tone,
    });
  };

  const handleCopy = (message: string, index: number) => {
    navigator.clipboard.writeText(message);
    setCopied(index);
    toast.success("Mensagem copiada!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleNewChat = () => {
    setContext("");
    setGeneratedMessages([]);
    setTone("natural");
    textareaRef.current?.focus();
  };

  const handleLogout = () => {
    trpc.auth.logout.useMutation().mutate(undefined, {
      onSuccess: () => {
        toast.success("Até logo!");
        setLocation("/");
      },
    });
  };

  const credits = creditsQuery.isError || !creditsQuery.data
    ? undefined
    : creditsQuery.data.creditsRemaining;
  const creditsLabel = credits ?? "-";
  const hasMessages = generatedMessages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-orange-200 flex flex-col">
      {/* Header Minimalista */}
      <header className="p-6 flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo com chama estilizada */}
          <div className="flex items-center gap-2">
            {/* Chama com gradiente */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <defs>
                  <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ff6b6b', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#ff5252', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#e63946', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                {/* Chama principal */}
                <path
                  d="M50 10 C40 10, 35 20, 35 30 C35 35, 37 40, 40 45 C30 48, 25 55, 25 65 C25 80, 35 90, 50 90 C65 90, 75 80, 75 65 C75 55, 70 48, 60 45 C63 40, 65 35, 65 30 C65 20, 60 10, 50 10 Z"
                  fill="url(#flameGrad)"
                />
                {/* Centro brilhante */}
                <ellipse cx="50" cy="65" rx="12" ry="15" fill="#ffcccb" opacity="0.7"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent tracking-tight">
              Flerte Chat
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700 font-medium">
            Créditos: <span className="text-rose-600 font-bold">{creditsLabel}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-3xl w-full mx-auto">
        {/* Input Area - Sempre visível */}
        <div className="w-full mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 space-y-4">
            <Textarea
              ref={textareaRef}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="(OI MEU LINDO QUERIA TE VER HJ...)"
              className="min-h-[100px] bg-gray-50 border-gray-200 rounded-2xl resize-none text-sm"
            />

            {/* Tone Selection */}
            <div className="flex gap-2 justify-center flex-wrap">
              {toneOptions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as typeof tone)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    tone === t.id
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-1">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Messages */}
        {hasMessages ? (
          <div className="w-full space-y-6">
            <h2 className="text-center text-2xl font-bold text-rose-600">
              Responda:
            </h2>

            <div className="space-y-3">
              {generatedMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">{msg}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(msg, idx)}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    {copied === idx ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleNewChat}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-full font-medium shadow-lg"
              >
                Gerar mais
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Créditos restantes: <span className="font-bold text-rose-600">{creditsLabel}</span>
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={!context.trim() || generateMutation.isPending}
              className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-6 rounded-full font-medium text-lg shadow-lg disabled:opacity-50"
            >
              {generateMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Gerar respostas
                </span>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
