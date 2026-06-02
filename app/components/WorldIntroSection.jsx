"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const worldImages = [
  "/taletopia.png",
  "/eldarun.jpg",
  "/aridryan2.png",
  "/dammerfels.jpeg",
];

export default function WorldIntroSection({
  ibmPlexSerif,
  font2,
  handleStoreTransition,
  scrollToId,
}) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const buttonsWrapRef = useRef(null);
  const intervalRef = useRef(null);
  const slideRefs = useRef([]);
  const activeIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;

  gsap.set([headingRef.current, buttonsWrapRef.current], {
    opacity: 0,
    y: 34,
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;

      const ctx = gsap.context(() => {
        gsap.to([headingRef.current, buttonsWrapRef.current], {
          opacity: 1,
          y: 0,
          duration: 1.15,
          stagger: 0.18,
          ease: "power3.out",
        });
      }, section);

      observer.disconnect();

      return () => ctx.revert();
    },
    {
      threshold: 0.35,
    }
  );

  observer.observe(section);

  return () => observer.disconnect();
}, []);

  useEffect(() => {
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;

      gsap.set(slide, {
        opacity: index === 0 ? 1 : 0,
        scale: 1,
      });
    });

    const firstSlide = slideRefs.current[0];

    if (firstSlide) {
      gsap.to(firstSlide, {
        scale: 1.12,
        duration: 8,
        ease: "none",
      });
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % worldImages.length);
    }, 6200);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const prevIndex = activeIndexRef.current;
    if (prevIndex === activeIndex) return;

    const prevSlide = slideRefs.current[prevIndex];
    const nextSlide = slideRefs.current[activeIndex];

    if (nextSlide) {
      gsap.killTweensOf(nextSlide);

      gsap.set(nextSlide, {
        opacity: 0,
        scale: 1,
      });

      gsap.to(nextSlide, {
        opacity: 1,
        duration: 2.8,
        ease: "none",
      });

      gsap.to(nextSlide, {
        scale: 1.12,
        duration: 8,
        ease: "none",
      });
    }

    if (prevSlide) {
      gsap.killTweensOf(prevSlide, "opacity");

      gsap.to(prevSlide, {
        opacity: 0,
        duration: 2.8,
        ease: "none",
      });
    }

    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative z-[2] flex min-h-screen justify-center overflow-hidden bg-black text-center"
    >
      <div className="absolute inset-0">
        {worldImages.map((src, index) => (
          <div
            key={src}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-x-0 top-0 z-[1] h-48 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <h1
          ref={headingRef}
          className="w-[min(90vw,782px)] text-[clamp(72px,8vw,120px)] leading-[0.95] tracking-[-0.05em] text-white"
        >
          Eine neue Welt
          <br />
          wartet auf dich.
        </h1>

        <div
          ref={buttonsWrapRef}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <button
            onClick={() => scrollToId("map")}
            className={`${ibmPlexSerif.className} cursor-pointer border border-white/30 bg-black/20 px-10 py-4 text-[15px] uppercase tracking-[0.18em] text-white backdrop-blur-[2px] transition duration-300 hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]`}
          >
            die Welt betreten
          </button>

          <button
            onClick={handleStoreTransition}
            className={`${font2.className} cursor-pointer rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-[12px] uppercase tracking-[0.24em] text-white/90 transition duration-300 hover:-translate-y-[1px] hover:border-white/40 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.16)]`}
          >
            Jetzt eintauchen
          </button>
        </div>
      </div>
    </section>
  );
}