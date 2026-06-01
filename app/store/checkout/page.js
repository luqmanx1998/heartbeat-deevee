"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/app/lib/stripe/client";
import CheckoutForm from "./CheckoutForm";
import { createClient } from "@/app/lib/supabase/client";

const font2 = localFont({
  src: "../../fonts/NeueMontreal-Regular.woff2",
});
const mainFont = localFont({
  src: "../../fonts/Segamoriz.woff2",
});

export default function CustomCheckoutPage() {
  const [cart, setCart] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [serverTotal, setServerTotal] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [signatureRequest, setSignatureRequest] = useState("");

  const [shipping, setShipping] = useState({
    fullName: "",
    line1: "",
    line2: "",
    postalCode: "",
    city: "",
  });

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(
      localStorage.getItem("heartbeat_cart") || "[]",
    );
    setCart(storedCart);
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [cart]);

  async function createPaymentIntent() {
    setOrderLoading(true);
    setErrorMessage("");

    const res = await fetch("/api/elements-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, shipping, guestEmail, signatureRequest }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMessage(data.error || "Failed to prepare checkout.");
      setOrderLoading(false);
      return;
    }

    setClientSecret(data.clientSecret);
    setServerTotal(data.total ?? subtotal);
    setOrderLoading(false);
  }

  const inputClass =
    "w-full rounded-md border border-white/10 bg-[#cfe0ff] px-4 py-3 text-[#14121c] outline-none transition placeholder:text-[#5d6070] focus:border-[#9b80ff] focus:ring-2 focus:ring-[#7c5cff]/40";

  const appearance = {
    theme: "night",
    labels: "above",
    variables: {
      colorPrimary: "#8b6cff",
      colorBackground: "#302c42",
      colorText: "#ffffff",
      colorDanger: "#ffb4a8",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSizeBase: "15px",
      spacingUnit: "5px",
      borderRadius: "8px",
    },
    rules: {
      ".Input": {
        border: "1px solid rgba(255,255,255,0.14)",
        backgroundColor: "#cfe0ff",
        color: "#14121c",
        boxShadow: "none",
        padding: "14px 16px",
      },
      ".Input:focus": {
        border: "1px solid #8b6cff",
        boxShadow: "0 0 0 3px rgba(139,108,255,0.28)",
      },
      ".Label": {
        color: "rgba(255,255,255,0.72)",
        fontSize: "13px",
        fontWeight: "500",
      },
      ".Tab": {
        border: "1px solid rgba(255,255,255,0.12)",
        backgroundColor: "rgba(255,255,255,0.04)",
        boxShadow: "none",
        padding: "14px",
      },
      ".Tab--selected": {
        borderColor: "#8b6cff",
        boxShadow: "0 0 0 3px rgba(139,108,255,0.22)",
      },
      ".AccordionItem": {
        border: "1px solid rgba(255,255,255,0.12)",
        backgroundColor: "rgba(255,255,255,0.04)",
        boxShadow: "none",
      },
    },
  };

  return (
    <main className={`${font2.className} min-h-screen bg-[#090909] text-white`}>
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative overflow-hidden bg-[#070707] px-6 py-8 sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(243,212,162,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(124,92,255,0.18),transparent_32%),linear-gradient(135deg,#080808,#13111c_55%,#080808)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />

          <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-xl flex-col">
            <Link
              href="/store/cart"
              className="inline-flex w-fit items-center gap-3 text-white/50 transition hover:text-white"
            >
              ←{" "}
              <span className="text-[12px] uppercase tracking-[0.22em]">
                Back to bag
              </span>
            </Link>

            <div className="mt-10">
              <div className="relative h-[60px] w-[220px] -translate-x-6">
                <Image
                  src="/DeeveeLogo4.png"
                  alt="Deevee logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <p className="mt-8 text-[12px] uppercase tracking-[0.34em] text-[#f3d4a2]/55">
                Deevee Store
              </p>

              <h2 className="mt-5 text-[clamp(42px,5vw,76px)] font-semibold leading-[0.9] tracking-[-0.02em]">
                Complete your order
              </h2>

              <p className="mt-5 max-w-md text-[16px] leading-7 text-white/52">
                Secure checkout for your selected Deevee products.
              </p>
            </div>

            <div className="mt-12 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-4 rounded-[24px] border border-white/8 bg-white/[0.035] p-4 backdrop-blur"
                >
                  <div className="relative h-24 w-20 overflow-hidden rounded-[18px] border border-white/10 bg-white/5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title || item.name || "Cart item"}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[18px] font-medium text-white">
                      {item.title || item.name}
                    </p>
                    <p className="mt-1 text-[13px] text-white/42">
                      Quantity {item.quantity}
                    </p>
                  </div>

                  <p className="text-[17px] text-white/82">
                    €
                    {(
                      Number(item.price || 0) * Number(item.quantity || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-auto border-t border-white/10 pt-7">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">
                    Total
                  </p>
                  <p className="mt-2 text-[13px] text-white/38">
                    Shipping calculated separately later
                  </p>
                </div>

                <p className="text-[42px] font-semibold tracking-[-0.02em]">
                  €{Number(serverTotal ?? subtotal).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#343047] px-6 py-8 text-white sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,92,255,0.24),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(243,212,162,0.12),transparent_30%)]" />

          <div className="relative mx-auto max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">
              Secure checkout
            </p>

            <h2 className="mt-4 text-[42px] font-semibold leading-none tracking-[-0.02em]">
              Shipping & Payment
            </h2>

            <div className="mt-8 rounded-[30px] border border-[#7c5cff]/55 bg-[#302c42]/95 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur">
              {!user && (
                <div className="mb-6 rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#f3d4a2]/55">
                    Guest checkout
                  </p>

                  <p className="mt-3 text-[15px] leading-6 text-white/58">
                    Enter your email to receive your receipt and shipping
                    updates.
                  </p>

                  <input
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Email address"
                    type="email"
                    className={`${inputClass} mt-4`}
                  />
                </div>
              )}

              <h3 className="text-[18px] font-semibold">
                Shipping information
              </h3>

              <div className="mt-5 space-y-3">
                <input
                  value={shipping.fullName}
                  onChange={(e) =>
                    setShipping((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Full name"
                  className={inputClass}
                />

                <input
                  value={shipping.line1}
                  onChange={(e) =>
                    setShipping((prev) => ({ ...prev, line1: e.target.value }))
                  }
                  placeholder="Address"
                  className={inputClass}
                />

                <input
                  value={shipping.line2}
                  onChange={(e) =>
                    setShipping((prev) => ({ ...prev, line2: e.target.value }))
                  }
                  placeholder="Address line 2"
                  className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#9b80ff] focus:ring-2 focus:ring-[#7c5cff]/40"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={shipping.postalCode}
                    onChange={(e) =>
                      setShipping((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                    placeholder="Postal code"
                    className={inputClass}
                  />

                  <input
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="City"
                    className={inputClass}
                  />
                </div>

                <div className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white/45">
                  Germany
                </div>
              </div>


              <div className="mt-5">
                <label className="text-[12px] uppercase tracking-[0.24em] text-white/45">
                  Signierwunsch optional
                </label>

                <p className="mt-2 text-[13px] leading-6 text-white/45">
                  Wenn du eine persönliche Signatur möchtest, schreibe hier den
                  Namen oder kurzen Wunsch hinein. Dana signiert auf der ersten
                  Seite des Buches.
                </p>

                <textarea
                  value={signatureRequest}
                  onChange={(e) => setSignatureRequest(e.target.value)}
                  maxLength={220}
                  placeholder="Zum Beispiel: Für Lena, alles Liebe"
                  className="mt-4 min-h-[120px] w-full resize-y rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#9b80ff] focus:ring-2 focus:ring-[#7c5cff]/40"
                />

                <p className="mt-2 text-right text-[11px] text-white/32">
                  {signatureRequest.length}/220
                </p>
              </div>

              {!clientSecret && (
                <>
                  {errorMessage && (
                    <p className="mt-4 rounded-md bg-red-400/10 px-4 py-3 text-sm text-red-200">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    onClick={createPaymentIntent}
                    disabled={orderLoading || cart.length === 0}
                    className="mt-6 w-full rounded-md bg-[#cfe0ff] px-6 py-4 text-sm font-semibold text-[#17120f] shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {orderLoading
                      ? "Preparing checkout..."
                      : `Continue to payment — €${subtotal.toFixed(2)}`}
                  </button>
                </>
              )}

              <div className="mt-7 rounded-[24px] border border-[#f3d4a2]/18 bg-white/[0.045] p-5">
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#f3d4a2]/62">
                  Hinweis zu deiner Bestellung
                </p>


                <p className="mt-4 text-[14px] leading-7 text-white/62">
                  Bücher können durch den Transport kleine Macken und
                  abgestoßene Ecken aufweisen. Diese kleinen optischen Mängel
                  sind von der Reklamation ausgeschlossen.
                </p>

                <p className="mt-3 text-[14px] leading-7 text-white/62">
                  Mit Abgabe der Bestellung erklärst du dich damit
                  einverstanden.{" "}
                  <Link
                    href="/agb"
                    className="text-[#f3d4a2]/80 underline underline-offset-4 transition hover:text-[#f3d4a2]"
                  >
                    AGB
                  </Link>
                </p>
              </div>

              {clientSecret && (
                <div className="mt-8 border-t border-white/10 pt-7">
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance }}
                  >
                    <CheckoutForm total={serverTotal ?? subtotal} />
                  </Elements>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-[12px] leading-6 text-white/42">
              Payments are processed securely by Stripe. Your card details never
              touch Deevee servers.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}