/**
 * Flerte Chat Subscription Plans
 * 
 * Define all subscription products and prices here.
 * These should match the products created in Stripe Dashboard.
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceWeekly: number; // in cents (BRL)
  priceMonthly: number; // in cents (BRL)
  stripePriceIdWeekly: string;
  stripePriceIdMonthly: string;
  features: string[];
  credits: number; // -1 for unlimited
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: "free",
    name: "Grátis",
    description: "Para testar",
    priceWeekly: 0,
    priceMonthly: 0,
    stripePriceIdWeekly: "",
    stripePriceIdMonthly: "",
    features: [
      "10 mensagens grátis",
      "Todos os tons de voz",
      "Upload de imagem",
    ],
    credits: 10,
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Para uso regular",
    priceWeekly: 990, // R$ 9,90
    priceMonthly: 2990, // R$ 29,90
    stripePriceIdWeekly: "price_1SUDL5GYEWk0KjWQPBVgRk5A",
    stripePriceIdMonthly: "price_1SUDLbGYEWk0KjWQUYJqOuR3",
    features: [
      "50 mensagens/semana ou 200/mês",
      "Histórico ilimitado",
      "Favoritos ilimitados",
    ],
    credits: 200, // For monthly
    popular: true,
  },
  premium: {
    id: "premium",
    name: "Premium",
    description: "Para uso intenso",
    priceWeekly: 1990, // R$ 19,90
    priceMonthly: 5990, // R$ 59,90
    stripePriceIdWeekly: "price_1SUDLzGYEWk0KjWQWXZuCKv0",
    stripePriceIdMonthly: "price_1SUDMMGYEWk0KjWQc0iOPAfh",
    features: [
      "Mensagens ilimitadas",
      "Prioridade na geração",
      "Suporte prioritário",
      "Novos recursos primeiro",
    ],
    credits: -1, // Unlimited
  },
};

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS[planId];
}

export function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}
