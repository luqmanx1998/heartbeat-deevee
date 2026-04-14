"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RotateCcw } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function BookRevealSection({
  ibmPlexSerif,
  font2,
  handleStoreTransition,
  isTransitioning,
}) {
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  const bookWrapRef = useRef(null);
  const bookGlowRef = useRef(null);
  const flipButtonRef = useRef(null);
  const bookFloatRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".book-reveal-visual",
        {
          opacity: 0,
          y: 80,
          scale: 0.94,
          rotateZ: -2,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateZ: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".book-reveal-visual",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".reveal-line",
        {
          opacity: 0,
          y: 26,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".book-reveal-copy",
            start: "top 84%",
            once: true,
          },
        }
      );

      gsap.to(bookGlowRef.current, {
        opacity: 0.92,
        scale: 1.05,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(bookFloatRef.current, {
            y: -14,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!bookWrapRef.current) return;

    gsap.to(bookWrapRef.current, {
      rotateY: isFlipped ? 180 : 0,
      duration: 0.75,
      ease: "power3.inOut",
    });

    gsap.to(flipButtonRef.current, {
      y: isFlipped ? -1 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isFlipped]);

  function handleBookMouseMove(e) {
    if (!bookWrapRef.current) return;

    const rect = bookWrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 18 + (isFlipped ? 180 : 0);
    const rotateX = -((y / rect.height) - 0.5) * 18;

    gsap.to(bookWrapRef.current, {
        rotateY,
        rotateX,
        duration: 0.35,
        ease: "power2.out",
        transformPerspective: 1200,
        transformOrigin: "center center",
        });

    gsap.to(bookGlowRef.current, {
      x: ((x / rect.width) - 0.5) * 18,
      y: -((y / rect.height) - 0.5) * 18,
      duration: 0.35,
      ease: "power2.out",
    });
  }

  function handleBookMouseLeave() {
    if (!bookWrapRef.current) return;

    gsap.to(bookWrapRef.current, {
        rotateX: 0,
        rotateY: isFlipped ? 180 : 0,
        duration: 0.45,
        ease: "power3.out",
        });

    gsap.to(bookGlowRef.current, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
    });
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black min-h-screen py-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(90,110,210,0.16),transparent_28%),radial-gradient(circle_at_78%_40%,rgba(255,190,120,0.10),transparent_24%),linear-gradient(to_bottom,#040404,#090909,#040404)]" />

      {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[20] h-15 bg-gradient-to-t from-black to-transparent" /> */}

      <div className="pointer-events-none absolute inset-0 bg-[url('/book1.jpeg')] bg-cover bg-center opacity-[0.25]" />

      {/* <div className="absolute inset-0 bg-black/55" /> */}

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div className="book-reveal-visual relative flex flex-col items-center lg:items-center xl:items-start">
          <div
            ref={bookGlowRef}
            className="pointer-events-none absolute left-1/2 top-[42%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(243,212,162,0.18),rgba(130,150,255,0.10),transparent_68%)] opacity-75 blur-3xl"
          />
        <div ref={bookFloatRef} className="relative">
          <div className="relative [perspective:1200px]">
  <div className="pointer-events-none absolute inset-x-[10%] bottom-[-18px] h-16 rounded-full bg-black/70 blur-2xl" />

  <div
    ref={bookFloatRef}
    onMouseMove={handleBookMouseMove}
    onMouseLeave={handleBookMouseLeave}
    className="relative"
  >
    <div
      ref={bookWrapRef}
      className="relative h-[430px] w-[285px] [transform-style:preserve-3d] sm:h-[495px] sm:w-[330px] lg:h-[555px] lg:w-[370px]"
    >
      <div className="absolute inset-0 [backface-visibility:hidden]">
        <img
          src="/book1.jpeg"
          alt="Heartbeat – Die andere Seite Vorderseite"
          draggable="false"
          className="h-full w-full select-none object-contain drop-shadow-[0_28px_48px_rgba(0,0,0,0.55)]"
        />
      </div>

      <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
        <img
          src="/backcover.jpg"
          alt="Heartbeat – Die andere Seite Rückseite"
          draggable="false"
          className="h-full w-full select-none object-contain drop-shadow-[0_28px_48px_rgba(0,0,0,0.55)]"
        />
      </div>
    </div>
  </div>
</div>
        </div>

          <button
            ref={flipButtonRef}
            onClick={() => setIsFlipped((prev) => !prev)}
            className={`${font2.className} mt-6 cursor-pointer rounded-full border border-white/12 bg-white/[0.05] px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-white/72 transition duration-300 hover:border-white/24 hover:bg-white/[0.08] hover:text-white lg:ml-20 flex gap-2 items-center`}
          >
            {isFlipped ? "Vorderseite ansehen" : "Rückseite ansehen"}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>

        <div className="book-reveal-copy text-center lg:text-left">
          <p
            className={`${font2.className} reveal-line text-[11px] uppercase tracking-[0.34em] text-[#f1d3a5]/65`}
          >
            Jetzt erhältlich
          </p>

          <h2 className="mt-5 text-[clamp(44px,5vw,84px)] leading-[0.92] tracking-[-0.05em] text-white">
            <span className="reveal-line block">Bereit für die</span>
            <span className="reveal-line block">ganze Geschichte?</span>
          </h2>

          <p
            className={`${ibmPlexSerif.className} reveal-line mt-6 max-w-[620px] text-[18px] leading-[1.75] text-white/76 lg:max-w-[560px]`}
          >
            <span className="text-white">Heartbeat – Die andere Seite</span> ist
            der Auftakt einer düsteren, magischen Reise voller Geheimnisse,
            Intrigen und Entscheidungen, die alles verändern können.
          </p>

          <p
            className={`${ibmPlexSerif.className} reveal-line mt-4 max-w-[620px] text-[18px] leading-[1.75] text-white/70 lg:max-w-[560px]`}
          >
            Wenn dich die andere Seite ruft, beginnt die Reise genau hier.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            {["Dark Romantasy", "Magische Welt", "Slow Burn"].map((tag) => (
              <span
                key={tag}
                className={`${font2.className} reveal-line rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70 transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/90`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 flex justify-center lg:justify-start">
            <button
              ref={ctaRef}
              onClick={() => handleStoreTransition(ctaRef)}
              disabled={isTransitioning}
              className={`${ibmPlexSerif.className} reveal-line cursor-pointer border border-white/30 bg-black/20 px-10 py-4 text-[15px] tracking-[0.18em] text-white uppercase backdrop-blur-[2px] transition duration-200 hover:-translate-y-[1px] hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] disabled:cursor-default`}
            >
              Zum Buch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}