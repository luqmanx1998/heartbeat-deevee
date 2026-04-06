export default function Page() {
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
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(132,33,64,0.18),transparent_26%),linear-gradient(to_bottom,#0b0b0d,#090909)]">
        <div className="absolute inset-0 bg-[url('/book4.jpeg')] bg-cover bg-center opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
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

              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                {book.title}
              </h1>
              <p className="mt-2 text-xl text-white/75 sm:text-2xl">{book.subtitle}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/45">
                by {book.author}
              </p>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/76 sm:text-lg">
                {book.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {book.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur">
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-semibold sm:text-4xl">{book.price}</div>
                  <div className="pb-1 text-base text-white/35 line-through">{book.originalPrice}</div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button className={`${primaryButton} bg-white text-black`}>
                    Jetzt kaufen
                  </button>
                  <button
                    className={`${primaryButton} border border-white/15 bg-white/5 text-white hover:bg-white/10`}
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
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Über das Buch</p>
          <p className="mt-5 text-base leading-8 text-white/78 sm:text-lg">
            {book.longDescription}
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Details</p>
          <div className="mt-5 divide-y divide-white/10">
            {book.details.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-4 text-sm sm:text-base">
                <span className="text-white/48">{label}</span>
                <span className="text-right text-white/84">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Blick ins Buch</p>
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
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Für Leserinnen und Leser, die düstere Romantasy lieben.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
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
                //   {
                //     title: "Shop-ready Layout",
                //     text: "Später leicht erweiterbar für Hardcover, E-Book, signierte Exemplare oder Bundles.",
                //   },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/66">{item.text}</p>
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
