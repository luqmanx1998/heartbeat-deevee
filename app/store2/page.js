import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const font2 = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
});

const segamoriz = localFont({
  src: "../fonts/Segamoriz.woff2",
});

const gallery = [
  "/book1.jpeg",
  "/book2.jpeg",
  "/book3.jpeg",
  "/book4.jpeg",
  "/backcover.jpg",
];

export default function StorePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(41,58,94,0.28),_transparent_38%),linear-gradient(180deg,#0a0a0a_0%,#050505_100%)]">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />

        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-14 px-6 pt-28 pb-16 lg:px-10 xl:grid xl:grid-cols-[1.05fr_0.95fr] xl:items-center xl:gap-20">
          <div className="order-2 xl:order-1">
            <p className={`${font2.className} mb-4 text-[12px] uppercase tracking-[0.38em] text-white/60`}>
              Buch I der Heartbeat-Reihe
            </p>

            <h1 className={`${segamoriz.className} text-[clamp(44px,7vw,96px)] leading-[0.9] tracking-[-0.03em]`}>
              Heartbeat
            </h1>

            <p className={`${font2.className} mt-3 text-[clamp(16px,1.6vw,22px)] uppercase tracking-[0.42em] text-white/75`}>
              Die andere Seite
            </p>

            <div className="mt-8 max-w-[620px] space-y-5">
              <p className={`${ibmPlexSerif.className} text-[clamp(18px,1.7vw,26px)] leading-[1.4] text-white/92`}>
                Dark romantasy, verborgene Kräfte, gefährliche Magie und eine Liebe,
                die alles zerstören könnte.
              </p>

              <p className={`${font2.className} max-w-[560px] text-[15px] leading-[1.8] text-white/70`}>
                Tauche ein in die Welt von Heartbeat und entdecke das erste Buch der Reihe.
                Diese Store-Seite ist bewusst klar, elegant und fokussiert auf ein einziges Ziel:
                das Buch wunderschön zu präsentieren.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                className={`${ibmPlexSerif.className} inline-flex items-center justify-center border border-white/20 bg-white px-7 py-4 text-[14px] uppercase tracking-[0.2em] text-black transition duration-300 hover:scale-[1.01] hover:bg-[#f4ede4] cursor-pointer`}
              >
                Jetzt kaufen
              </button>

              <button
                className={`${ibmPlexSerif.className} inline-flex items-center justify-center border border-white/20 bg-white/5 px-7 py-4 text-[14px] uppercase tracking-[0.2em] text-white backdrop-blur-sm transition duration-300 hover:border-white/40 hover:bg-white/10 cursor-pointer`}
              >
                Leseprobe ansehen
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8 text-white/70">
              <div>
                <p className={`${font2.className} text-[11px] uppercase tracking-[0.28em] text-white/45`}>
                  Format
                </p>
                <p className={`${ibmPlexSerif.className} mt-2 text-[18px] text-white`}>
                  Paperback
                </p>
              </div>
              <div>
                <p className={`${font2.className} text-[11px] uppercase tracking-[0.28em] text-white/45`}>
                  Sprache
                </p>
                <p className={`${ibmPlexSerif.className} mt-2 text-[18px] text-white`}>
                  Deutsch
                </p>
              </div>
              <div>
                <p className={`${font2.className} text-[11px] uppercase tracking-[0.28em] text-white/45`}>
                  Status
                </p>
                <p className={`${ibmPlexSerif.className} mt-2 text-[18px] text-white`}>
                  Jetzt erhältlich
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 xl:order-2">
            <div className="relative mx-auto max-w-[640px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(109,126,255,0.18),_transparent_58%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm md:p-5">
                <div className="relative aspect-[4/4.7] w-full overflow-hidden rounded-[24px] bg-black">
                  <Image
                    src="/book3.jpeg"
                    alt="Heartbeat book mockup"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-18 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className={`${font2.className} text-[11px] uppercase tracking-[0.32em] text-white/45`}>
              Galerie
            </p>
            <h2 className={`${ibmPlexSerif.className} mt-3 text-[clamp(30px,3vw,48px)]`}>
              Alle Ansichten des Buchs
            </h2>
          </div>
          <p className={`${font2.className} hidden max-w-[360px] text-right text-[14px] leading-[1.7] text-white/55 md:block`}>
            Cover, Buchmockup und Rückseite – alles an einem Ort, damit Besucher sofort einen Eindruck vom Produkt bekommen.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {gallery.map((src, index) => (
            <div
              key={src}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition duration-300 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="relative aspect-[4/4.7] w-full overflow-hidden bg-black">
                <Image
                  src={src}
                  alt={`Heartbeat gallery image ${index + 1}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-18 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div>
            <p className={`${font2.className} text-[11px] uppercase tracking-[0.32em] text-white/45`}>
              Klappentext
            </p>
            <h2 className={`${ibmPlexSerif.className} mt-3 text-[clamp(30px,3vw,48px)]`}>
              Worum geht es in Heartbeat?
            </h2>
          </div>

          <div className={`${ibmPlexSerif.className} max-w-[760px] space-y-6 text-[18px] leading-[1.8] text-white/82`}>
            <p>
              Kylie glaubte, sie sei ein ganz normales Mädchen. Bis zu dem Tag,
              an dem ihre Schwester spurlos verschwindet und die Wahrheit ihre Welt zerreißt.
            </p>
            <p>
              Magische Wesen sind real. Auf der Suche nach ihrer Schwester betritt Kylie die andere Seite,
              ein Reich aus tödlicher Magie, uralten Bündnissen und gefährlichen Intrigen.
            </p>
            <p>
              Doch je näher sie der Wahrheit kommt, desto mehr beginnt alles zu zerbrechen.
              Und während Schatten näher rücken, muss Kylie sich fragen, wie viel sie bereit ist zu opfern,
              um die zu retten, die sie liebt.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-18 lg:px-10">
        <div className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
          <div>
            <p className={`${font2.className} text-[11px] uppercase tracking-[0.32em] text-white/45`}>
              Details
            </p>
            <h2 className={`${ibmPlexSerif.className} mt-3 text-[clamp(30px,3vw,48px)]`}>
              Ein edler, klarer Kaufbereich
            </h2>
            <p className={`${font2.className} mt-5 max-w-[520px] text-[15px] leading-[1.8] text-white/65`}>
                Erlebe den Beginn einer düsteren, magischen Reise. 
                „Heartbeat – Die andere Seite“ ist der erste Band einer Welt voller Geheimnisse, 
                Leidenschaft und gefährlicher Entscheidungen.
                </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <p className={`${font2.className} text-[11px] uppercase tracking-[0.28em] text-white/45`}>
                  Produkt
                </p>
                <h3 className={`${ibmPlexSerif.className} mt-3 text-[32px]`}>
                  Heartbeat – Die andere Seite
                </h3>
              </div>
              <p className={`${ibmPlexSerif.className} text-[28px] text-white`}>
                €XX.XX
              </p>
            </div>

            <div className={`${font2.className} space-y-4 py-6 text-[14px] leading-[1.8] text-white/65`}>
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <span>Paperback</span>
                <span>1 Exemplar</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <span>Versand</span>
                <span>Wird beim Checkout berechnet</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verfügbarkeit</span>
                <span className="text-white">Auf Lager</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                className={`${ibmPlexSerif.className} inline-flex flex-1 items-center justify-center border border-white/15 bg-white px-6 py-4 text-[14px] uppercase tracking-[0.2em] text-black transition duration-300 hover:bg-[#f4ede4] cursor-pointer`}
              >
                Jetzt kaufen
              </button>
              <Link
                href="/"
                className={`${ibmPlexSerif.className} inline-flex flex-1 items-center justify-center border border-white/15 bg-white/5 px-6 py-4 text-[14px] uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-white/10`}
              >
                Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
