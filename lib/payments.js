import {mongooseConnect} from "@/lib/mongoose";
import {Order} from "@/models/Order";

// Marks the order linked to a Stripe Checkout Session as paid, if Stripe says it was paid.
// Used by both the webhook and the post-checkout confirmation, so either one is enough.
// Safe to call more than once for the same session.
export async function markOrderPaidFromSession(session) {
  const orderId = session?.metadata?.orderId;
  const paid = session?.payment_status === 'paid';
  if (!orderId || !paid) {
    return false;
  }
  await mongooseConnect();
  await Order.findByIdAndUpdate(orderId, {paid: true});
  return true;
}
