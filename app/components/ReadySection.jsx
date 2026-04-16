"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ReadySection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(textRef.current, {
        opacity: 0,
        y: 45,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          scrub: 1.4,
          pin: true,
        },
      });

      tl.to(
        bgRef.current,
        {
          scale: 1.1,
          ease: "none",
        },
        0
      ).to(
        textRef.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
        },
        0.22
      );

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 scale-100 bg-[url('/gaze.png')] bg-cover bg-center"
        aria-hidden
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center">
        <h2
          ref={textRef}
          className="mb-8 text-[clamp(40px,6vw,108px)] leading-[1.02] uppercase text-white"
        >
          Bist du bereit
          <br />
          Für die andere Seite?
        </h2>
      </div>
    </section>
  );
}