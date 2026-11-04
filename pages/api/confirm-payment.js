import {markOrderPaidFromSession} from "@/lib/payments";
const stripe = require('stripe')(process.env.STRIPE_SK);

// Called by the cart page after Stripe redirects back with ?session_id=...
// The payment status is read from Stripe with the secret key, so a shopper cannot
// mark an order as paid by editing the URL.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'POST only'});
    return;
  }
  const {sessionId} = req.body || {};
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    res.status(400).json({error: 'Invalid session id'});
    return;
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    res.status(404).json({error: 'Checkout session not found'});
    return;
  }

  const paid = await markOrderPaidFromSession(session);
  res.json({paid});
}
