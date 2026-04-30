import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  process.env.NEXT_STRIPE_PUBLISHABLE_KEY
);