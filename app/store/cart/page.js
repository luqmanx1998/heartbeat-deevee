"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { ShoppingBag, Trash2 } from "lucide-react";

const font2 = localFont({
  src: "../../fonts/NeueMontreal-Regular.woff2",
});

export default function Page() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartNotice, setCartNotice] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("heartbeat_cart") || "[]");
    setCart(storedCart);
    setLoading(false);
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const shipping = cart.length > 0 ? 0 : 0;

  const total = subtotal + shipping;

  function saveCart(nextCart) {
    setCart(nextCart);
    localStorage.setItem("heartbeat_cart", JSON.stringify(nextCart));
  }

  function increaseQuantity(id) {
    const nextCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Number(item.quantity || 0) + 1 } : item
    );

    saveCart(nextCart);
  }

  function decreaseQuantity(id) {
    const nextCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Number(item.quantity || 1) - 1) }
          : item
      );

    saveCart(nextCart);
  }

  function removeItem(id) {
    const nextCart = cart.filter((item) => item.id !== id);
    saveCart(nextCart);
  }

  function clearCart() {
  saveCart([]);
  showNotice("Cart cleared");
}

  function showNotice(message) {
  setCartNotice(message);

  setTimeout(() => {
    setCartNotice("");
  }, 2200);
}

  return (   
    <main className={`${font2.className} min-h-screen bg-[#090909] text-white`}>
        {cartNotice && (
        <div className="fixed left-1/2 top-6 z-[9999] -translate-x-1/2">
            <div className="rounded-full border border-[#f3d4a2]/18 bg-[#111113]/95 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#fff4de] shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            {cartNotice} ✦
            </div>
        </div>
        )}
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(132,33,64,0.18),transparent_26%),linear-gradient(to_bottom,#0b0b0d,#090909)]">
        <div className="absolute inset-0 bg-[url('/book4.jpeg')] bg-cover bg-center opacity-[0.06]" />

        <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/store"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur transition hover:border-[#f3d4a2]/35 hover:bg-white/[0.08] hover:text-[#fff4de]"
            >
              ← Zurück zum Store
            </Link>
          </div>

          <header className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#f3d4a2]/18 bg-white/[0.05] text-[#fff4de]">
              <ShoppingBag size={22} strokeWidth={1.7} />
            </div>

            <p className="text-[11px] uppercase tracking-[0.38em] text-white/45">
              Heartbeat Shop
            </p>

            <h1 className="mt-4 text-[clamp(42px,5vw,72px)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
              
            Ihr Warenkorb

            </h1>

            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-7 text-white/58">
              Überprüfen Sie Ihre Artikel, bevor Sie zur Kasse gehen.
            </p>
          </header>

          {loading ? (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
              <p className="text-[12px] uppercase tracking-[0.18em] text-white/50">
                Loading cart...
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl shadow-black/30 backdrop-blur">
              <h2 className="text-[32px] font-semibold tracking-tight text-white">
                Your bag is empty
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-[16px] leading-7 text-white/58">
                Add Heartbeat or the limited Buchbox to your bag before checkout.
              </p>

              <div className="mt-8">
                <Link
                  href="/store"
                  className="inline-flex items-center justify-center rounded-full bg-[#f2e6d7] px-6 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-5 rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/25 backdrop-blur md:grid-cols-[140px_1fr_auto]"
                  >
                    <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/30">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={260}
                          height={260}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-[140px] w-full bg-white/5" />
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#f3d4a2]/55">
                        {item.type || "item"}
                      </p>

                      <h2 className="mt-2 text-[26px] font-semibold leading-[1.1] text-white">
                        {item.name}
                      </h2>

                      <p className="mt-3 text-[20px] text-white/72">
                        €{Number(item.price || 0).toFixed(2)}
                      </p>

                      <div className="mt-5 flex w-fit items-center rounded-full border border-white/10 bg-black/20">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-10 w-10 cursor-pointer rounded-full text-lg text-white/70 transition hover:bg-white/10 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center text-[15px] text-white">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="h-10 w-10 cursor-pointer rounded-full text-lg text-white/70 transition hover:bg-white/10 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">
                      <p className="text-[24px] font-semibold text-white">
                        €
                        {(
                          Number(item.price || 0) * Number(item.quantity || 0)
                        ).toFixed(2)}
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-100"
                        aria-label="Remove item"
                      >
                        <Trash2 size={17} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="h-fit rounded-[32px] border border-[#f3d4a2]/15 bg-[linear-gradient(180deg,rgba(109,59,17,0.30),rgba(20,13,9,0.78))] p-6 shadow-2xl shadow-black/35 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#f1d3a5]/55">
                  Order Summary
                </p>

                <div className="mt-6 space-y-4 border-b border-[#f3d4a2]/12 pb-6">
                  <SummaryRow label="Subtotal" value={`€${subtotal.toFixed(2)}`} />

                  <SummaryRow
                    label="Shipping"
                    value={shipping > 0 ? `€${shipping.toFixed(2)}` : "Free"}
                  />

                  <SummaryRow
                    label="VAT"
                    value="Included"
                  />
                                  </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-[15px] uppercase tracking-[0.2em] text-white/55">
                    Total
                  </p>
                  <p className="text-[34px] font-semibold text-white">
                    €{total.toFixed(2)}
                  </p>
                </div>

                <Link
                  href="/store/checkout"
                  className="mt-8 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#f2e6d7] px-6 py-3 text-sm font-medium text-black shadow-[0_10px_30px_rgba(242,230,215,0.18)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Checkout
                </Link>

                {cart.length > 0 && (
                <button
                    onClick={clearCart}
                    className="mt-3 inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white/60 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-100"
                >
                    Clear Cart
                </button>
                )}

                <p className="mt-5 text-center text-[12px] leading-6 text-white/45">
                  Secure checkout powered by Stripe.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-[14px] text-white/55">{label}</p>
      <p className="text-[15px] text-white/82">{value}</p>
    </div>
  );
}