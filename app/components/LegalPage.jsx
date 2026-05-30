import localFont from "next/font/local";
import Link from "next/link";

    const font2 = localFont({
    src: "../fonts/NeueMontreal-Regular.woff2",
    });

export default function LegalPage({ title, children }) {

  return (
    <main className={`${font2.className} min-h-screen bg-black px-6 py-24 text-white`}>
      <div className="mx-auto max-w-[920px]">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.25em] text-white/45 transition hover:text-[#FFD281]"
        >
          Zurück zur Startseite
        </Link>

        <header className="mt-12 border-b border-white/10 pb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[#FFD281]/70">
            Rechtliches
          </p>

          <h1 className="mt-4 text-[clamp(42px,7vw,96px)] leading-[0.95] uppercase">
            {title}
          </h1>
        </header>

       <section
  className="
    mt-12 max-w-none text-white/70

    [&_h2]:mt-0
    [&_h2]:mb-6
    [&_h2]:text-3xl
    [&_h2]:font-semibold
    [&_h2]:text-white

    [&_h3]:mt-10
    [&_h3]:mb-3
    [&_h3]:text-xl
    [&_h3]:font-semibold
    [&_h3]:text-[#FFD281]

    [&_h4]:mt-8
    [&_h4]:mb-3
    [&_h4]:text-lg
    [&_h4]:font-medium
    [&_h4]:text-white

    [&_p]:mb-5
    [&_p]:text-[16px]
    [&_p]:leading-8
    [&_p]:text-white/70

    [&_ul]:mb-6
    [&_ul]:list-disc
    [&_ul]:space-y-2
    [&_ul]:pl-6

    [&_li]:text-white/70
    [&_li]:leading-7

    [&_a]:text-[#FFD281]
    [&_strong]:text-white
  "
>
  {children}
</section>
      </div>
    </main>
  );
}