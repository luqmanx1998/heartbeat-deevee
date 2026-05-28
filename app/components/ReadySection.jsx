"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ReadySection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.set(textRef.current, {
      opacity: 0,
      y: 45,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;

        gsap.to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.15,
          ease: "power3.out",
        });

        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        className="absolute inset-0 bg-[url('/gaze.png')] bg-cover bg-center"
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