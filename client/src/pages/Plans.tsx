import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Check, Loader2, ArrowLeft, Flame } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Plans() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const subscriptionQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const currentPlan = subscriptionQuery.data?.plan || "free";

  const createCheckoutMutation = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecionando para o checkout...");
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      toast.error("Erro ao criar checkout: " + error.message);
    },
  });

  const handleSubscribe = async (plan: string, interval: "weekly" | "monthly") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    createCheckoutMutation.mutate({ plan, interval });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/20">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation(isAuthenticated ? "/app" : "/")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-pulse">{APP_LOGO}</span>
              <span className="font-bold text-2xl text-white drop-shadow-lg">{APP_TITLE}</span>
            </div>
          </div>
          {isAuthenticated && user && (
            <div className="text-sm text-white/90">
              Olá, {user.name || "Usuário"}!
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16 text-white">
          <h1 className="text-6xl font-black mb-4 drop-shadow-2xl">
            Escolha Seu Plano
          </h1>
          <p className="text-2xl opacity-95 max-w-3xl mx-auto">
            Comece grátis e faça upgrade quando quiser
          </p>
          {isAuthenticated && (
            <Badge className="mt-4 bg-white/20 text-white border-white/40 text-lg px-4 py-2">
              Plano Atual: <span className="font-bold ml-2 capitalize">{currentPlan}</span>
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-white/60 shadow-2xl bg-white hover:scale-105 transition-all">
            <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
              <CardTitle className="text-3xl font-bold">Grátis</CardTitle>
              <CardDescription className="text-lg">Para testar</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-black">R$ 0</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">10 mensagens grátis</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Todos os tons de voz</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Upload de imagem</span>
              </div>
              <Button
                className="w-full mt-6 bg-gray-600 hover:bg-gray-700"
                onClick={() => (window.location.href = isAuthenticated ? "/app" : getLoginUrl())}
                disabled={currentPlan === "free"}
              >
                {currentPlan === "free" ? "Plano Atual" : "Começar Grátis"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-4 border-rose-500 shadow-2xl bg-white hover:scale-105 transition-all relative">
            <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-sm px-4 py-1">
              <Flame className="w-4 h-4 mr-1 inline" />
              POPULAR
            </Badge>
            <CardHeader className="bg-gradient-to-br from-rose-50 to-pink-50 border-b">
              <CardTitle className="text-3xl font-bold text-rose-600">Pro</CardTitle>
              <CardDescription className="text-lg">Para uso regular</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-semibold">50 mensagens/semana</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-semibold">200 mensagens/mês</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Histórico ilimitado</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Favoritos ilimitados</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600 text-lg font-bold"
                  onClick={() => handleSubscribe("pro", "weekly")}
                  disabled={currentPlan === "pro_weekly" || subscriptionQuery.isLoading}
                >
                  {subscriptionQuery.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentPlan === "pro_weekly" ? (
                    "Plano Atual"
                  ) : (
                    <>R$ 9,90/semana</>
                  )}
                </Button>
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700 text-lg font-bold"
                  onClick={() => handleSubscribe("pro", "monthly")}
                  disabled={currentPlan === "pro_monthly" || subscriptionQuery.isLoading}
                >
                  {subscriptionQuery.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentPlan === "pro_monthly" ? (
                    "Plano Atual"
                  ) : (
                    <>R$ 29,90/mês</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-4 border-orange-500 shadow-2xl bg-white hover:scale-105 transition-all">
            <CardHeader className="bg-gradient-to-br from-orange-50 to-yellow-50 border-b">
              <CardTitle className="text-3xl font-bold text-orange-600">Premium</CardTitle>
              <CardDescription className="text-lg">Para uso intenso</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 font-semibold">Mensagens ilimitadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Prioridade na geração</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Suporte prioritário</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Novos recursos primeiro</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg font-bold"
                  onClick={() => handleSubscribe("premium", "weekly")}
                  disabled={currentPlan === "premium_weekly" || subscriptionQuery.isLoading}
                >
                  {subscriptionQuery.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentPlan === "premium_weekly" ? (
                    "Plano Atual"
                  ) : (
                    <>R$ 19,90/semana</>
                  )}
                </Button>
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-lg font-bold"
                  onClick={() => handleSubscribe("premium", "monthly")}
                  disabled={currentPlan === "premium_monthly" || subscriptionQuery.isLoading}
                >
                  {subscriptionQuery.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentPlan === "premium_monthly" ? (
                    "Plano Atual"
                  ) : (
                    <>R$ 59,90/mês</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center text-white max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4 text-left bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div>
              <h3 className="font-bold text-xl mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="opacity-90">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem custos adicionais.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Como funciona o teste grátis?</h3>
              <p className="opacity-90">
                Você recebe 10 créditos gratuitos para testar o serviço. Não é necessário cartão de crédito.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Os créditos expiram?</h3>
              <p className="opacity-90">
                Créditos gratuitos não expiram. Créditos de planos pagos são renovados semanalmente ou mensalmente.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
