"use client";

import { useState } from "react";
import { FiInstagram } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";

function Footer({ ibmPlexSerif, font2 }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSubscribe() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setMessage("Danke! Du wirst über Updates informiert.");
    setEmail("");
  }

  return (
    <footer className="min-h-screen w-full bg-[url('/footerlogo.png')] bg-cover bg-center">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-16 px-6 pt-20 pb-12 text-white lg:grid-cols-[0.95fr_0.75fr] lg:px-15 lg:pb-15">
        <div className="flex min-h-full flex-col justify-between">
          <div>
            <h1 className="text-[clamp(64px,7vw,308px)] leading-[0.95] uppercase">
              Deevee
            </h1>

            <ul
              className={`${ibmPlexSerif.className} mt-14 space-y-[25px] text-sm leading-[100%] tracking-[6%] uppercase`}
            >
              <li className="cursor-pointer transition hover:text-[#FFD281]">
                Home
              </li>
              <li className="cursor-pointer transition hover:text-[#FFD281]">
                The World
              </li>
              <li className="cursor-pointer transition hover:text-[#FFD281]">
                Characters
              </li>
              <li className="cursor-pointer transition hover:text-[#FFD281]">
                About
              </li>
            </ul>
          </div>

          <div className="mt-16 space-y-10">
            <div className="flex items-center gap-4">
              <FiInstagram className="cursor-pointer text-lg transition hover:text-[#FFD281]" />
              <SiTiktok className="cursor-pointer text-lg transition hover:text-[#FFD281]" />
            </div>

            <div className={`${ibmPlexSerif.className} text-lg uppercase`}>
              © 2026. All Rights Reserved.
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
                onClick={handleSubscribe}
                className={`${ibmPlexSerif.className} rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm uppercase transition hover:border-white/40 hover:bg-white/15`}
              >
                Anmelden
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