"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function StickyStorySection({ font2 }) {
  const sectionRef = useRef(null);
  const introTextRef = useRef([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const paragraphs = introTextRef.current.filter(Boolean);

      paragraphs.forEach((p) => {
        const text = p.textContent || "";

        p.innerHTML = text
          .split(/(\s+)/)
          .map((part) =>
            part.trim() === ""
              ? part
              : part
                  .split("")
                  .map(
                    (char) =>
                      `<span style="opacity:0;display:inline-block;">${char}</span>`,
                  )
                  .join(""),
          )
          .join("");
      });
    }, section);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;

        gsap.to(".sticky-intro p span", {
          opacity: 1,
          duration: 0.05,
          stagger: { amount: 0.35, from: "random" },
          overwrite: true,
        });

        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <Image
          src="/misty.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-black/25" />

      <div className="sticky-intro pointer-events-none absolute inset-0 z-20">
        <p
          ref={(el) => (introTextRef.current[0] = el)}
          className={`${font2.className} absolute top-[14%] left-[7%] text-[11px] uppercase tracking-[0.32em] text-white/75`}
        >
          Magie ist real
        </p>

        <p
          ref={(el) => (introTextRef.current[1] = el)}
          className={`${font2.className} absolute top-[58%] right-[8%] text-right text-[11px] uppercase tracking-[0.32em] text-white/75`}
        >
          Vertrauen ist tödlich
        </p>

        <p
          ref={(el) => (introTextRef.current[2] = el)}
          className={`${font2.className} absolute bottom-[12%] left-1/2 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.32em] text-white/75`}
        >
          Und die andere Seite kennt deinen Namen
        </p>
      </div>
    </section>
  );
}