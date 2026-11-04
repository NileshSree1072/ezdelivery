import {mongooseConnect} from "@/lib/mongoose";
import Product from "@/models/Product";
import {Order} from "@/models/Order";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Setting} from "@/models/Setting";
const stripe = require('stripe')(process.env.STRIPE_SK);

// The site's own address, taken from the request so Stripe returns the shopper to the domain
// they checked out on (localhost in development, the Vercel domain in production).
function baseUrl(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host).split(',')[0].trim();
  return `${proto}://${host}`;
}

export default async function handler(req,res) {
  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return;
  }
  const {
    name,email,city,
    postalCode,streetAddress,country,
    cartProducts,
  } = req.body;
  await mongooseConnect();
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({_id:uniqueIds});

  
  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) 
    {
      const unitAmount = Math.round(productInfo.price * 100);
      line_items.push({
        quantity,
        price_data: {
          currency: 'INR',
          product_data: {name:productInfo.title},
          unit_amount:unitAmount,
        },
      });
    }
  }

  const session = await getServerSession(req,res,authOptions);

  const orderDoc = await Order.create({
    line_items,name,email,city,postalCode,
    streetAddress,country,paid:false,
    userEmail: session?.user?.email,
  });

  const shippingFeeSetting = await Setting.findOne({name:'shippingFee'});
  const shippingFeeCents = parseInt(shippingFeeSetting.value || '0') * 100;

  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    customer_email: email,
    // Stripe replaces {CHECKOUT_SESSION_ID} so the cart page can confirm the payment.
    success_url: baseUrl(req) + '/cart?success=1&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: baseUrl(req) + '/cart?canceled=1',
    metadata: {orderId:orderDoc._id.toString()},
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'shipping fee',
          type: 'fixed_amount',
          fixed_amount: {amount: shippingFeeCents, currency: 'INR'},
        },
      }
    ],
  });

  res.json({
    url:stripeSession.url,
  })

}