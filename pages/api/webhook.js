import {markOrderPaidFromSession} from "@/lib/payments";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {buffer} from 'micro';

// Signing secret of the webhook endpoint (Stripe Dashboard > Developers > Webhooks).
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req,res) {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await markOrderPaidFromSession(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('ok');
}

export const config = {
  api: {bodyParser:false,}
};
