"use client";

import Link from "next/link";
import { useState } from "react";
import { FiInstagram } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";

function Footer({ ibmPlexSerif, font2, scrollToId, setOpen, open }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubscribe() {
  setError("");
  setMessage("");

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    setError("Bitte gib deine E-Mail-Adresse ein.");
    return;
  }

  if (!validateEmail(trimmedEmail)) {
    setError("Bitte gib eine gültige E-Mail-Adresse ein.");
    return;
  }

  try {
    setIsSubmitting(true);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: trimmedEmail,
        source: "footer",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Anmeldung fehlgeschlagen.");
      return;
    }

    setMessage("Danke! Du wirst über Updates informiert.");
    setEmail("");
  } catch (err) {
    setError("Etwas ist schiefgelaufen.");
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <footer className="min-h-screen w-full bg-black">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-16 px-6 pt-20 pb-12 text-white lg:grid-cols-[0.95fr_0.75fr] lg:px-15 lg:pb-15">
        <div className="flex min-h-full flex-col justify-between">
          <div>
            <h1 className="text-[clamp(64px,7vw,308px)] leading-[0.95] uppercase">
              Deevee
            </h1>

            <ul
              className={`${ibmPlexSerif.className} mt-14 space-y-[25px] text-sm leading-[100%] tracking-[6%] uppercase`}
            >
              <li 
              onClick={() => scrollToId("home")}
              className="cursor-pointer transition hover:text-[#FFD281]">
                Home
              </li>
              <li 
              onClick={() => scrollToId("map")}
              className="cursor-pointer transition hover:text-[#FFD281]">
                Die Welt
              </li>
              <li 
              onClick={() => scrollToId("characters")}
              className="cursor-pointer transition hover:text-[#FFD281]">
                Charaktere
              </li>
              <li 
              onClick={() => scrollToId("about")}
              className="cursor-pointer transition hover:text-[#FFD281]">
                About
              </li>
            </ul>
          </div>

          <div className="mt-16 space-y-10">
            <div className="flex items-center gap-4">
              <a
            href="https://instagram.com/xdeeveee"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center justify-center p-1 text-white transition-colors duration-300 hover:text-[#FFD281]"
          >
            <FiInstagram className="text-[20px] text-white hover:text-[#FFD281] transition-colors duration-300 cursor-pointer" />
          </a>
              <a
            href="https://www.tiktok.com/@xdeeveee"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center justify-center p-1 text-white transition-colors duration-300 hover:text-[#FFD281]"
          >
            <SiTiktok className="text-[18px] text-white hover:text-[#FFD281] transition-colors duration-300 cursor-pointer" />
          </a>
            </div>

            <div className="space-y-4">
  <div className={`${ibmPlexSerif.className} text-lg uppercase`}>
    © 2026. All Rights Reserved.
  </div>

  <div
    className={`${font2.className} flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-white/60`}
  >
    <Link
      href="/impressum"
      className="transition hover:text-[#FFD281]"
    >
      Impressum
    </Link>

    <Link
      href="/datenschutz"
      className="transition hover:text-[#FFD281]"
    >
      Datenschutz
    </Link>

    <Link
      href="/agb"
      className="transition hover:text-[#FFD281]"
    >
      AGB
    </Link>

    <Link
      href="/widerrufsrecht"
      className="transition hover:text-[#FFD281]"
    >
      Widerrufsrecht
    </Link>

    <Link
      href="/zahlung-und-versand"
      className="transition hover:text-[#FFD281]"
    >
      Zahlung und Versand
    </Link>
    <Link href="/cookie-einstellungen"
    className="transition hover:text-[#FFD281]"
    >Cookie-Einstellungen</Link>
  </div>
</div>
          </div>
        </div>

        <div className="flex items-end lg:justify-end">
          <div className="w-full max-w-[460px] rounded-[28px] border border-white/10 bg-black/25 p-6 backdrop-blur-[3px]">
            <p
              className={`${font2.className} text-[11px] uppercase tracking-[0.3em] text-[#f1d3a5]/60`}
            >
              Newsletter
            </p>

            <h2 className={`${ibmPlexSerif.className} mt-4 text-[clamp(30px,3vw,48px)] leading-[1.02] uppercase`}>
              Bleib auf dem Laufenden
            </h2>

            <p
              className={`${ibmPlexSerif.className} mt-4 text-[16px] leading-[1.7] text-white/72`}
            >
              Erhalte Updates zu neuen Büchern, Presales und besonderen
              Heartbeat-News.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Deine E-Mail-Adresse"
                className={`${font2.className} w-full rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/35 focus:bg-white/[0.07]`}
              />

              <button
              disabled={isSubmitting}
              onClick={handleSubscribe}
              className={`${ibmPlexSerif.className} rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm uppercase transition hover:border-white/40 hover:bg-white/15 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/25 border-t-white" />
                )}

                {isSubmitting ? "Wird gesendet..." : "Anmelden"}
              </span>
            </button>
            </div>

            {error && (
              <p className={`${font2.className} mt-3 text-sm text-red-300`}>
                {error}
              </p>
            )}

            {message && (
              <p className={`${font2.className} mt-3 text-sm text-[#FFD281]`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;