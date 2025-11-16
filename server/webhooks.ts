import { Request, Response } from 'express';
import { stripe } from './stripe';
import { ENV } from './_core/env';
import { updateSubscription, createTransaction } from './db';
import { SUBSCRIPTION_PLANS } from '@shared/products';

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Missing stripe-signature header');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected, returning verification response');
    return res.json({ verified: true });
  }

  console.log('[Webhook] Event received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = parseInt(session.metadata.user_id);
        const plan = session.metadata.plan;
        const interval = session.metadata.interval;
        
        if (!userId || !plan || !interval) {
          console.error('[Webhook] Missing metadata in checkout session');
          break;
        }

        const planKey = `${plan}_${interval}`;
        const planConfig = SUBSCRIPTION_PLANS[plan];
        
        if (!planConfig) {
          console.error('[Webhook] Invalid plan:', plan);
          break;
        }

        const credits = interval === 'weekly' ? 50 : planConfig.credits;
        
        // Update subscription
        await updateSubscription(userId, {
          plan: planKey,
          status: 'active',
          creditsRemaining: credits,
          creditsTotal: credits,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          endDate: null, // Will be set based on subscription period
        });

        // Log transaction
        await createTransaction({
          userId,
          type: 'purchase',
          amount: session.amount_total,
          description: `Assinatura ${planConfig.name} - ${interval === 'weekly' ? 'Semanal' : 'Mensal'}`,
          stripePaymentIntentId: session.payment_intent,
        });

        console.log('[Webhook] Subscription updated for user:', userId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const userId = parseInt(subscription.metadata?.user_id);
        
        if (!userId) {
          console.log('[Webhook] No user_id in subscription metadata');
          break;
        }

        // Update subscription status
        const status = subscription.status === 'active' ? 'active' : 
                      subscription.status === 'canceled' ? 'cancelled' : 'expired';
        
        await updateSubscription(userId, {
          status,
          stripeSubscriptionId: subscription.id,
        });

        console.log('[Webhook] Subscription status updated for user:', userId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const userId = parseInt(subscription.metadata?.user_id);
        
        if (!userId) {
          console.log('[Webhook] No user_id in subscription metadata');
          break;
        }

        // Revert to free plan
        await updateSubscription(userId, {
          plan: 'free',
          status: 'cancelled',
          creditsRemaining: 0,
          creditsTotal: 10,
          stripeSubscriptionId: null,
        });

        console.log('[Webhook] Subscription cancelled for user:', userId);
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
