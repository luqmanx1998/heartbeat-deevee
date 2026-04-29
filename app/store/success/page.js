"use client";

import { useEffect } from "react";
import Link from "next/link";
import localFont from "next/font/local";
import { CheckCircle2, PackageCheck, ArrowRight } from "lucide-react";

const font2 = localFont({
  src: "../../fonts/NeueMontreal-Regular.woff2",
});

export default function Page() {
  useEffect(() => {
    localStorage.removeItem("heartbeat_cart");
  }, []);

  return (
    <main
      className={`${font2.className} min-h-screen bg-[#090909] text-white`}
    >
      <section className="relative overflow-hidden">
        {/* ambient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,214,140,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(108,86,255,0.12),transparent_28%),linear-gradient(to_bottom,#0b0b0d,#090909)]" />

        <div className="absolute inset-0 opacity-[0.06] bg-[url('/book4.jpeg')] bg-cover bg-center" />

        <div className="relative mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16 sm:px-8">
          <div className="w-full rounded-[38px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-12">
            {/* top icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#f3d4a2]/20 bg-[#f3d4a2]/10 shadow-[0_0_40px_rgba(243,212,162,0.08)]">
              <CheckCircle2
                size={38}
                strokeWidth={1.8}
                className="text-[#f6deb6]"
              />
            </div>

            {/* heading */}
            <div className="mt-8 text-center">
              <p className="text-[11px] uppercase tracking-[0.38em] text-[#f3d4a2]/60">
                Payment Successful
              </p>

              <h1 className="mt-5 text-[clamp(42px,6vw,72px)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
                Thank You
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-8 text-white/62 sm:text-[18px]">
                Your order has been received and securely processed.
                We&apos;ll prepare everything and keep you updated along the way.
              </p>
            </div>

            {/* status cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <PackageCheck
                    size={18}
                    strokeWidth={1.8}
                    className="text-[#f3d4a2]"
                  />
                  <p className="text-[12px] uppercase tracking-[0.24em] text-white/55">
                    Order Confirmed
                  </p>
                </div>

                <p className="mt-4 text-[15px] leading-7 text-white/70">
                  Your purchase is now visible in your account orders page.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.8}
                    className="text-[#f3d4a2]"
                  />
                  <p className="text-[12px] uppercase tracking-[0.24em] text-white/55">
                    Next Steps
                  </p>
                </div>

                <p className="mt-4 text-[15px] leading-7 text-white/70">
                  We&apos;ll package your order and begin shipment soon.
                </p>
              </div>
            </div>

            {/* buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/store/orders"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2e6d7] px-7 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-white"
              >
                View Orders
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/store"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-medium text-white/82 transition hover:border-[#f3d4a2]/30 hover:bg-white/[0.06] hover:text-white"
              >
                Return to Shop
              </Link>
            </div>

            {/* footer */}
            <div className="mt-10 border-t border-white/8 pt-6 text-center">
              <p className="text-[12px] uppercase tracking-[0.28em] text-white/35">
                Deevee Official Store
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}