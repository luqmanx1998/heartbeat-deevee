"use client";

import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm({ total }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const paymentElementOptions = {
    layout: {
      type: "accordion",
      defaultCollapsed: false,
      radios: "always",
      spacedAccordionItems: true,
    },
  };

  async function confirmPayment() {
    if (!stripe || !elements) return;

    setIsPaying(true);
    setMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/store/success`,
      },
    });

    if (error) {
      setMessage(error.message || "Die Zahlung ist fehlgeschlagen.");
      setIsPaying(false);
      return;
    }

    // Stripe will handle redirects automatically.
    // For card payments, success will redirect to return_url.
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await confirmPayment();
  }

  async function handleExpressConfirm() {
    await confirmPayment();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-5 text-[18px] font-semibold text-white">
        Zahlungsmethode
      </h3>

      <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-4">
        <ExpressCheckoutElement onConfirm={handleExpressConfirm} />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/35">
            oder anders bezahlen
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <PaymentElement options={paymentElementOptions} />
      </div>

      {message && (
        <p className="mt-4 rounded-md bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {message}
        </p>
      )}

      <button
        disabled={!stripe || !elements || isPaying}
        className="mt-6 w-full rounded-md bg-[#17120f] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPaying
          ? "Zahlung wird verarbeitet..."
          : `Kauf abschließen – €${Number(total || 0).toFixed(2)}`}
      </button>
    </form>
  );
}