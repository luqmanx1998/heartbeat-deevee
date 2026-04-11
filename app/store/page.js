"use client";

import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const font2 = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
});

export default function HeartbeatStorePage() {
  const book = {
    title: "Heartbeat",
    subtitle: "Die andere Seite",
    author: "deevee",
    price: "€16.99",
    badge: "Band 1 der Reihe",
    description:
      "Ein düster-romantischer Fantasyroman über Geheimnisse, Intrigen und Drama. Folge Kylie in eine fremde Welt, in der Magie real ist, Vertrauen tödlich und Liebe dein Untergang sein kann.",
    longDescription: [
      "Kylie glaubte, sie sei ein ganz normales Mädchen. Bis zu dem Tag, an dem ihre Schwester spurlos verschwindet und die Wahrheit ihre Welt zerreißt. Magische Wesen sind real. Und Kylie ist tiefer in ihrer Welt verstrickt, als sie je hätte ahnen können.",
      "Auf der Suche nach ihrer Schwester betritt sie die andere Seite, ein Reich aus tödlicher Magie, uralten Bündnissen und Intrigen, die niemals in Vergessenheit geraten sind. Doch je näher sie der Wahrheit kommt, desto mehr beginnt alles zu zerbrechen.",
      "An der Seite eines Feenprinzen gerät Kylie in einen Strudel aus Machtkämpfen und dunklen Entscheidungen, die der Auslöser eines apokalyptischen Krieges werden. Und während Schatten näher rücken, muss Kylie sich fragen: Wie viel ist sie bereit zu opfern, um die zu retten, die sie liebt?",
    ],
    images: ["/book1.jpeg", "/book3.jpeg", "/book4.jpeg", "/backcover.jpg"],
    features: [
      "Slow Burn",
      "Magische Welt",
      "Betrayal",
      "Hidden Power",
      "Entführung",
      "Abenteuer",
      "Parallelwelten",
    ],
    details: [
      ["Format", "Taschenbuch"],
      ["Sprache", "Deutsch"],
      ["Reihe", "Heartbeat"],
      ["Band", "1"],
    ],
  };

  const [cursorGlow, setCursorGlow] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  function handleMouseMove(e) {
    setCursorGlow({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  }

  function handleMouseLeave() {
    setCursorGlow((prev) => ({ ...prev, visible: false }));
  }

  const primaryButton =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:-translate-y-0.5";

  return (
    <main 
    onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
    className="relative min-h-screen bg-[#090909] text-white">
      <div
        className="pointer-events-none fixed z-[9999] h-[280px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300"
        style={{
          left: `${cursorGlow.x}px`,
          top: `${cursorGlow.y}px`,
          opacity: cursorGlow.visible ? 0.65 : 0,
         background:
  "radial-gradient(circle, rgba(120,150,255,0.28) 0%, rgba(175,140,255,0.20) 35%, rgba(243,212,162,0.14) 58%, transparent 74%)",
        }}
      />
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(132,33,64,0.18),transparent_26%),linear-gradient(to_bottom,#0b0b0d,#090909)] py-10">
        <div className="mb-10 text-center">
          <p
            className={`${font2.className} text-[11px] uppercase tracking-[0.38em] text-white/45`}
          >
            Offizieller Book Shop
          </p>

          <h1
            className={`${ibmPlexSerif.className} mt-4 text-[clamp(42px,5vw,72px)] leading-[0.92] tracking-[-0.04em] text-white`}
          >
            Heartbeat Shop
          </h1>

          <p
            className={`${font2.className} mt-3 text-[13px] uppercase tracking-[0.32em] text-white/55`}
          >
            Heartbeat · Die andere Seite
          </p>

          <div className="mx-auto mt-5 h-px w-[220px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        <div className="absolute inset-0 bg-[url('/book4.jpeg')] bg-cover bg-center opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div
            id="buchbox"
            className="mb-12 rounded-[34px] border border-[#f3d4a2]/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center rounded-full border border-[#ffcf88]/20 bg-[#8c4e17]/18 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#ffdca8]">
                Exklusiver Vorverkauf
              </div>
              <div className="inline-flex items-center rounded-full border border-[#ffcf88]/20 bg-[#a7521d] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white shadow-[0_0_25px_rgba(167,82,29,0.35)]">
                Verkauft sich schnell
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                <div className="relative aspect-[1/1] w-full">
                  <Image
                    src="/buchbox2.jpg"
                    alt="Heartbeat Buchbox"
                    fill
                    priority
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
                  Limitierte Buchbox
                </p>

                <h1
                  className={`${ibmPlexSerif.className} mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl`}
                >
                  Heartbeat I
                  <br />
                  Buchbox
                </h1>

                <p
                  className={`${ibmPlexSerif.className} mt-6 max-w-[640px] text-[20px] leading-[1.55] text-white/88 sm:text-[24px]`}
                >
                  Die besondere Presale-Edition für alle, die mehr als nur das
                  Buch wollen.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/72">
                    Limitierte Stückzahl
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/72">
                    Auf Wunsch signiert
                  </span>
                </div>

                <div className="mt-8 rounded-[30px] border border-[#f3d4a2]/16 bg-[linear-gradient(180deg,rgba(109,59,17,0.38),rgba(41,19,6,0.2))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#f3d4a2]/12 pb-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#f1d3a5]/55">
                        Buchbox Preis
                      </p>
                      <div className="flex items-center gap-4">
                        <div
                          className={`${ibmPlexSerif.className} mt-3 text-4xl text-[#fff5e8] sm:text-5xl`}
                        >
                          €29.99
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                        Inhalt
                      </p>
                      <p
                        className={`${ibmPlexSerif.className} mt-2 text-[17px] text-white/90`}
                      >
                        Buchbox Bundle
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                        Status
                      </p>
                      <p
                        className={`${ibmPlexSerif.className} mt-2 text-[17px] text-white/90`}
                      >
                        Presale
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                        Verfügbarkeit
                      </p>
                      <p
                        className={`${ibmPlexSerif.className} mt-2 text-[17px] text-white/90`}
                      >
                        Fast ausverkauft
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#f3d4a2]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#f1d3a5]/55">
                      Was ist in der Buchbox?
                    </p>
                    <ul
                      className={`${ibmPlexSerif.className} mt-3 text-[18px] leading-[1.65] text-[#f7ead8] flex flex-wrap gap-x-4 gap-y-2`}
                    >
                      {[
                        "Taschenbuch",
                        "Metall-Lesezeichen",
                        "4 Charakterkarten (beidseitig bedruckt)",
                        "Acryl-Aufsteller",
                      ].map((item, i) => (
                        <li key={item} className="flex items-center">
                          <span className="mx-3 text-white/40">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      className={`${primaryButton} ${font2.className} bg-[#f2e6d7] text-black hover:bg-white shadow-[0_10px_30px_rgba(242,230,215,0.18)] flex-1 transition duration-200 cursor-pointer`}
                    >
                      Buchbox sichern
                    </button>
                  </div>

                  <p className="mt-5 text-center text-[12px] uppercase tracking-[0.24em] text-[#f1d3a5]/50">
                    Exklusiv für den Presale
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl shadow-black/40">
                <img
                  src={book.images[1]}
                  alt={`${book.title} cover`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-1">
                {book.images
                  .filter((_, idx) => idx !== 1)
                  .map((src, index) => (
                    <div
                      key={src}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    >
                      <img
                        src={src}
                        alt={`${book.title} preview ${index + 2}`}
                        className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-8">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.22em] text-white/70">
                {book.badge}
              </div>

              <h1
                className={`${ibmPlexSerif.className} mt-5 text-4xl tracking-tight sm:text-5xl`}
              >
                {book.title}
              </h1>
              <p
                className={`${ibmPlexSerif.className} mt-2 text-xl text-white/75 sm:text-2xl`}
              >
                {book.subtitle}
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/45">
                by {book.author}
              </p>

              <p
                className={`${ibmPlexSerif.className} mt-6 max-w-xl text-base leading-7 text-white/76 sm:text-lg`}
              >
                {book.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {book.features.map((feature) => (
                  <span
                    key={feature}
                    className={`${font2.className} rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75`}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.28em]">
                  Buch Preis
                </p>
                <div
                  className={`${ibmPlexSerif.className} text-3xl sm:text-4xl mt-4`}
                >
                  {book.price}
                </div>

                <div className="mt-6">
                  <button
                    className={`${primaryButton} ${font2.className} w-full bg-white text-black`}
                  >
                    Jetzt kaufen
                  </button>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
                  Sicherer Checkout mit Stripe oder PayPal. Versand- und
                  Formatoptionen kannst du später leicht ergänzen.
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p
                  className={`${font2.className} text-[11px] uppercase tracking-[0.26em] text-white/45`}
                >
                  Triggerwarnungen
                </p>

                <p
                  className={`${ibmPlexSerif.className} mt-3 flex flex-wrap text-[16px] leading-[1.6] text-white/78`}
                >
                  Dieses Buch enthält Extreme Gewalt, Tod, psychische
                  Erkrankungen, Entführung, Stalking, Mord, Panikattacken,
                  emotionaler Missbrauch, Gaslighting, Vernachlässigung von
                  Kindern, Tod eines Elternteils, blutige oder grafische Gewalt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full relative overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(132,33,64,0.18),transparent_26%),linear-gradient(to_bottom,#0b0b0d,#090909)] py-10">
        <section className="relative mx-auto grid max-w-7xl items-start gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
          <div className="absolute inset-0 bg-[url('/book1.jpeg')] bg-cover bg-center opacity-[0.05] scale-120" />

          <div className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
            <p
              className={`${font2.className} text-sm uppercase tracking-[0.25em] text-white/45`}
            >
              Über das Buch
            </p>

            <div
              className={`${ibmPlexSerif.className} mt-5 space-y-5 text-base leading-8 text-white/78 sm:text-lg`}
            >
              {book.longDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
            <p
              className={`${font2.className} text-sm uppercase tracking-[0.25em] text-white/45`}
            >
              Details
            </p>

            <div className="mt-5 divide-y divide-white/10">
              {book.details.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 py-4 text-sm sm:text-base"
                >
                  <span className={`${font2.className} text-white/48`}>
                    {label}
                  </span>
                  <span
                    className={`${ibmPlexSerif.className} text-right text-white/84`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10 lg:pb-20">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
            <div className="grid gap-0">
              <div className="p-6 sm:p-8 lg:p-10 lg:flex lg:flex-col lg:items-center lg:w-full lg:text-center">
                <div className="lg:flex lg:flex-col lg:items-center">
                  <p
                    className={`${font2.className} text-sm uppercase tracking-[0.25em] text-white/45`}
                  >
                    Für wen ist es?
                  </p>
                  <h2
                    className={`${ibmPlexSerif.className} mt-4 text-3xl tracking-tight sm:text-4xl`}
                  >
                    Für Leserinnen und Leser, die düstere Romantasy lieben.
                  </h2>
                  <p
                    className={`${ibmPlexSerif.className} mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg lg:text-center`}
                  >
                    Wenn du emotionale Spannung, geheimnisvolle Magie und eine
                    Atmosphäre suchst, die sich gleichzeitig gefährlich und
                    romantisch anfühlt, ist Heartbeat genau der richtige
                    Einstieg in diese Reihe. Bitte beachte die Triggerwarnung.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Dunkle Atmosphäre",
                      text: "Geheimnisvolle Welten und eine Stimmung, die sofort fesselt.",
                    },
                    {
                      title: "Romantische Spannung",
                      text: "Kein hektisches Tempo – sondern langsames Knistern mit echtem Sog.",
                    },
                    {
                      title: "Starker Reihenauftakt",
                      text: "Perfekt, um die Welt und ihre Konflikte kennenzulernen, bevor der nächste Band folgt.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="group relative rounded-2xl border border-white/10 bg-black/20 p-6 transition duration-300 hover:border-white/20 hover:bg-white/[0.04]"
                    >
                      {/* subtle glow */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />

                      <h3 className={`${ibmPlexSerif.className} text-lg`}>
                        {item.title}
                      </h3>

                      <p
                        className={`${font2.className} mt-2 text-sm leading-7 text-white/66`}
                      >
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              
              </div>
            </div>
            <div className="m-4 lg:m-10 flex justify-center">
  <div className="m-4 lg:m-16 flex justify-center">
  <div
    className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-[#f3d4a2]/20 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
  >
    {/* forest */}
    <div className="absolute inset-0">
      <img
        src="/forest.jpg"
        alt=""
        className="h-full w-full object-cover opacity-70"
      />
    </div>

    {/* darker overlay for readability */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.1)_60%,rgba(0,0,0,0.3)_100%)]" />

    {/* mouse-follow glow */}
    <div
      className="pointer-events-none absolute h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300"
    />

    {/* edge glow */}
    <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#f3d4a2]/20 shadow-[0_0_40px_rgba(243,212,162,0.12),0_0_90px_rgba(120,150,255,0.08)]" />

    {/* content */}
    <div className="relative z-10">
      <p
        className={`${font2.className} text-[11px] uppercase tracking-[0.3em] text-[#f1d3a5]/70`}
      >
        Bist du bereit?
      </p>

      <h2
        className={`${ibmPlexSerif.className} mt-4 text-3xl sm:text-4xl leading-[1.1]`}
      >
        Für die andere Seite?
      </h2>

      <p
        className={`${ibmPlexSerif.className} mt-4 text-white/80 text-[17px] leading-[1.6]`}
      >
        Tauche ein in eine Welt voller Magie, Dunkelheit und Entscheidungen,
        die alles verändern können.
      </p>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            document.getElementById("buchbox")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`${primaryButton} ${font2.className} bg-[#f2e6d7] text-black hover:bg-white shadow-[0_10px_30px_rgba(242,230,215,0.18)] cursor-pointer w-[50%] btn btn-background-slide`}
        >
          Jetzt eintauchen
        </button>
      </div>
    </div>
  </div>
</div>
</div>
          </div>
        </section>
      </div>
    </main>
  );
}
