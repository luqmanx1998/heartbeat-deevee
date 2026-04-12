"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StickyStorySection({ ibmPlexSerif, font2 }) {
  const sectionRef = useRef(null);
  const introTextRef = useRef([]);
  const copyRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const totalStickyHeight = window.innerHeight * 4;
      const paragraphs = introTextRef.current.filter(Boolean);

      gsap.set(copyRef.current, {
        opacity: 0,
        scale: 0.6,
        rotationY: 75,
        transformOrigin: "top left",
      });

      paragraphs.forEach((paragraph) => {
        const text = paragraph.textContent || "";
        paragraph.innerHTML = text
          .split(/(\s+)/)
          .map((part) => {
            if (part.trim() === "") return part;
            return part
              .split("")
              .map(
                (char) =>
                  `<span style="opacity:0;display:inline-block;">${char}</span>`
              )
              .join("");
          })
          .join("");
      });

      function flickerAnimation(targets, toOpacity) {
        gsap.to(targets, {
          opacity: toOpacity,
          duration: 0.05,
          stagger: {
            amount: 0.3,
            from: "random",
          },
          overwrite: true,
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 3}`,
        onEnter: () => flickerAnimation(".sticky-intro p span", 1),
        onLeave: () => flickerAnimation(".sticky-intro p span", 0),
        onEnterBack: () => flickerAnimation(".sticky-intro p span", 1),
        onLeaveBack: () => flickerAnimation(".sticky-intro p span", 0),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalStickyHeight}`,
          scrub: true,
          pin: true,
        },
      });

      tl.to(".sticky-img-1 img", { scale: 1.125, ease: "none" }, 0);

      tl.to(
        ".sticky-img-2",
        {
          ease: "none",
          onUpdate: function () {
            const progress = this.progress();
            gsap.set(".sticky-img-2", {
              clipPath: `polygon(
                ${gsap.utils.interpolate(50, 0, progress)}% ${gsap.utils.interpolate(25, 0, progress)}%,
                ${gsap.utils.interpolate(50, 100, progress)}% ${gsap.utils.interpolate(25, 0, progress)}%,
                ${gsap.utils.interpolate(50, 100, progress)}% ${gsap.utils.interpolate(75, 100, progress)}%,
                ${gsap.utils.interpolate(50, 0, progress)}% ${gsap.utils.interpolate(75, 100, progress)}%
              )`,
            });
          },
        },
        1
      );

      tl.to(".sticky-img-2 img", { scale: 1.125, ease: "none" }, 1);

      tl.to(
        ".sticky-img-3",
        {
          ease: "none",
          onUpdate: function () {
            const progress = this.progress();
            gsap.set(".sticky-img-3", {
              clipPath: `polygon(
                ${gsap.utils.interpolate(50, 0, progress)}% ${gsap.utils.interpolate(25, 0, progress)}%,
                ${gsap.utils.interpolate(50, 100, progress)}% ${gsap.utils.interpolate(25, 0, progress)}%,
                ${gsap.utils.interpolate(50, 100, progress)}% ${gsap.utils.interpolate(75, 100, progress)}%,
                ${gsap.utils.interpolate(50, 0, progress)}% ${gsap.utils.interpolate(75, 100, progress)}%
              )`,
            });
          },
        },
        2
      );

      tl.to(".sticky-img-3 img", { scale: 1.125, ease: "none" }, 2);
      tl.to(".sticky-img-2 img", { scale: 1.25, ease: "none" }, 3);

      tl.to(
        copyRef.current,
        {
          rotationY: 0,
          scale: 1,
          opacity: 1,
          ease: "power2.out",
        },
        3.15
      );

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-screen overflow-hidden [perspective:1000px] [perspective-origin:left_center]"
      >

        <div className="sticky-intro absolute top-1/2 z-20 flex w-full -translate-y-1/2 px-6 lg:px-10">
        
          <div className="flex flex-1">
            
            <p
              ref={(el) => (introTextRef.current[0] = el)}
              className={`${font2.className} flex-1 text-[11px] uppercase tracking-[0.28em] text-white/75 sm:text-[13px]`}
            >
              Between mist and memory
            </p>
            <p
              ref={(el) => (introTextRef.current[1] = el)}
              className={`${font2.className} flex-1 text-center text-[11px] uppercase tracking-[0.28em] text-white/75 sm:text-[13px]`}
            >
              A truth she cannot escape
            </p>
          </div>

          <div className="flex flex-1 justify-end">
            <p
              ref={(el) => (introTextRef.current[2] = el)}
              className={`${font2.className} text-right text-[11px] uppercase tracking-[0.28em] text-white/75 sm:text-[13px]`}
            >
              The other side is calling
            </p>
          </div>
        </div>

        <div className="sticky-img-1 absolute inset-0 overflow-hidden">
          <Image
            src="/misty.png"
            alt="Misty scene"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div
          className="sticky-img-2 absolute inset-0 overflow-hidden"
          style={{ clipPath: "polygon(50% 25%, 50% 25%, 50% 75%, 50% 75%)" }}
        >
          <Image
            src="/desperate.png"
            alt="Desperate scene"
            fill
            className="object-cover"
          />
        </div>

        <div
          className="sticky-img-3 absolute inset-0 overflow-hidden"
          style={{ clipPath: "polygon(50% 25%, 50% 25%, 50% 75%, 50% 75%)" }}
        >
          <Image
            src="/elegant.png"
            alt="Fiery scene"
            fill
            className="object-cover [transform:scale(3)] [transform-origin:bottom_center]"
          />
        </div>

        <div className="absolute top-1/2 left-1/2 z-30 w-[min(78vw,900px)] -translate-x-1/2 -translate-y-1/2">
  <div ref={copyRef} className="text-center opacity-0">
    <h2
      className={`text-[clamp(34px,5vw,80px)] leading-[120%] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6),0_0_15px_rgba(0,0,0,0.4)] uppercase`}
    >
      Manche Welten findet man nicht.
      <br />
      Sie finden dich.
    </h2>
  </div>
</div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6 text-center">
        <h2
          className={`${ibmPlexSerif.className} text-[clamp(52px,8vw,120px)] leading-[0.95] text-white`}
        >
          Bist du bereit
          <br />
          für die andere Seite?
        </h2>
      </section>
    </>
  );
}