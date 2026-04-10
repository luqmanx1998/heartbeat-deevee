import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import Image from "next/image";


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
    price: "€19.99",
    originalPrice: "€24.99",
    badge: "Band 1 der Reihe",
    description:
      "Ein düster-romantischer Fantasyroman über Geheimnisse, Magie, Verrat und Liebe. Tauche ein in eine Welt, in der Vertrauen gefährlich ist und jede Entscheidung alles verändern kann.",
    longDescription:
      "Kylie glaubte, sie sei ein ganz normales Mädchen. Bis zu dem Tag, an dem ihre Schwester spurlos verschwindet und die Wahrheit ihre Welt zerreißt. Magische Wesen sind real, und Kylie ist tiefer in ihrer Welt verstrickt, als sie je hätte ahnen können. Auf der Suche nach ihrer Schwester betritt sie die andere Seite – ein Reich aus tödlicher Magie, uralten Bündnissen und Intrigen.",
    images: [
      "/book1.jpeg",
      "/book2.jpeg",
      "/book3.jpeg",
      "/book4.jpeg",
    ],
    features: [
      "Slow Burn",
      "Magische Welt",
      "Betrayal",
      "Hidden Power",
    ],
    details: [
      ["Format", "Taschenbuch"],
      ["Sprache", "Deutsch"],
      ["Reihe", "Heartbeat"],
      ["Band", "1"],
    ],
  };

  const primaryButton =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:-translate-y-0.5";

  return (
    <div className="min-h-screen bg-[#090909] text-white">

      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(132,33,64,0.18),transparent_26%),linear-gradient(to_bottom,#0b0b0d,#090909)] py-10">
      <div className="mb-10 text-center">
  <p
    className={`${font2.className} text-[11px] uppercase tracking-[0.38em] text-white/45`}
  >
    Official Book Shop
  </p>

  <h1
    className={`${ibmPlexSerif.className} mt-4 text-[clamp(42px,5vw,72px)] leading-[0.92] tracking-[-0.04em] text-white`}
  >
    Heartbeat Store
  </h1>

  <p
    className={`${font2.className} mt-3 text-[13px] uppercase tracking-[0.32em] text-white/55`}
  >
    Heartbeat · Die andere Seite
  </p>

  <div
    className="mx-auto mt-5 h-px w-[220px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
  />
</div>
        <div className="absolute inset-0 bg-[url('/book4.jpeg')] bg-cover bg-center opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="mb-12 rounded-[34px] border border-[#f3d4a2]/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center rounded-full border border-[#ffcf88]/20 bg-[#8c4e17]/18 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#ffdca8]">
                Featured Presale
              </div>
              <div className="inline-flex items-center rounded-full border border-[#ffcf88]/20 bg-[#a7521d] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white shadow-[0_0_25px_rgba(167,82,29,0.35)]">
                Selling Fast
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                <div className="relative aspect-[1/1] w-full">
                  <Image
                    src="/buchbox.jpg"
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
                  Buch wollen — emotional, sammelwürdig und perfekt als
                  Geschenk.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/72">
                    Presale Exclusive
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/72">
                    Limitierte Stückzahl
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/72">
                    Geschenkidee
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
                          €30.99
                        </div>
                        {/* <div className="items-center rounded-full border border-[#ffcf88]/20 bg-[#a7521d] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white shadow-[0_0_25px_rgba(167,82,29,0.35)] self-center">
                Selling Fast
              </div> */}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                        statt
                      </p>
                      <p className="mt-2 text-lg text-white/35 line-through">
                        €39.99
                      </p>
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
                    <ul className={`${ibmPlexSerif.className} mt-3 text-[18px] leading-[1.65] text-[#f7ead8] flex flex-wrap gap-x-4 gap-y-2`}>
                  {["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7"].map((item, i) => (
                    <li key={item} className="flex items-center">
                      <span>{item}</span>
                      {i !== 6  && <span className="mx-3 text-white/40">•</span>}
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
                    {/* <button
                      className={`${primaryButton} border border-white/15 bg-white/5 text-white hover:bg-white/10 sm:flex-1`}
                    >
                      Inhalt ansehen
                    </button> */}
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
                  src={book.images[0]}
                  alt={`${book.title} cover`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-1">
                {book.images.slice(1).map((src, index) => (
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

              <h1 className={`${ibmPlexSerif.className} mt-5 text-4xl tracking-tight sm:text-5xl`}>
                {book.title}
              </h1>
              <p className={`${ibmPlexSerif.className} mt-2 text-xl text-white/75 sm:text-2xl`}>{book.subtitle}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/45">
                by {book.author}
              </p>

              <p className={`${ibmPlexSerif.className} mt-6 max-w-xl text-base leading-7 text-white/76 sm:text-lg`}>
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
                <div className="flex items-end gap-3">
                  <div className={`${ibmPlexSerif.className} text-3xl sm:text-4xl`}>{book.price}</div>
                  <div className="pb-1 text-base text-white/35 line-through">{book.originalPrice}</div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button className={`${primaryButton} ${font2.className} bg-white text-black`}>
                    Jetzt kaufen
                  </button>
                  <button
                    className={`${primaryButton} ${font2.className} border border-white/15 bg-white/5 text-white hover:bg-white/10`}
                  >
                    Leseprobe ansehen
                  </button>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
                  Sicherer Checkout mit Stripe oder PayPal. Versand- und Formatoptionen kannst du später leicht ergänzen.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
          <p className={`${font2.className} text-sm uppercase tracking-[0.25em] text-white/45`}>Über das Buch</p>
          <p className={`${ibmPlexSerif.className} mt-5 text-base leading-8 text-white/78 sm:text-lg`}>
            {book.longDescription}
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Details</p>
          <div className="mt-5 divide-y divide-white/10">
            {book.details.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-4 text-sm sm:text-base">
                <span className={`${font2.className} text-white/48`}>{label}</span>
                <span className={`${ibmPlexSerif.className} text-right text-white/84`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Was dich erwartet</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {book.images.map((src, index) => (
                  <div
                    key={src}
                    className={`overflow-hidden rounded-2xl border border-white/10 bg-black/20 ${
                      index === 3 ? "col-span-2" : ""
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${book.title} gallery ${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Für wen ist es?</p>
              <h2 className={`${ibmPlexSerif.className} mt-4 text-3xl tracking-tight sm:text-4xl`}>
                Für Leserinnen und Leser, die düstere Romantasy lieben.
              </h2>
              <p className={`${ibmPlexSerif.className} mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg`}>
                Wenn du emotionale Spannung, geheimnisvolle Magie und eine Atmosphäre suchst,
                die sich gleichzeitig elegant und gefährlich anfühlt, ist Heartbeat genau der
                richtige Einstieg in diese Reihe.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Dunkle Atmosphäre",
                    text: "Kühle Farben, geheimnisvolle Welten und eine Stimmung, die sofort fesselt.",
                  },
                  {
                    title: "Romantische Spannung",
                    text: "Kein hektisches Tempo – sondern langsames Knistern mit echtem Sog.",
                  },
                  {
                    title: "Starker Reihenauftakt",
                    text: "Perfekt, um die Welt und ihre Konflikte kennenzulernen, bevor weitere Bände folgen.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className={`${font2.className} mt-2 text-sm leading-7 text-white/66`}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
