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
        scale: 0.7,
        rotationY: 60,
        y: 30,
        filter: "blur(10px)",
        transformOrigin: "center center",
      });

      gsap.set(".sticky-img-2 img", {
        scale: 1.18,
        transformOrigin: "center center",
      });

      gsap.set(".sticky-img-3 img", {
        scale: 2.8,
        transformOrigin: "bottom center",
      });

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
                      `<span style="opacity:0;display:inline-block;">${char}</span>`
                  )
                  .join("")
          )
          .join("");
      });

      function flickerAnimation(targets, toOpacity) {
        gsap.to(targets, {
          opacity: toOpacity,
          duration: 0.05,
          stagger: { amount: 0.35, from: "random" },
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

      tl.to(".sticky-img-1 img", { scale: 1.1, ease: "none" }, 0);

      tl.to(
        ".sticky-img-2",
        {
          ease: "none",
          onUpdate: function () {
            const p = this.progress();
            gsap.set(".sticky-img-2", {
              clipPath: `circle(${gsap.utils.interpolate(0, 85, p)}% at 50% 50%)`,
            });
          },
        },
        1
      );

      tl.to(".sticky-img-2 img", { scale: 1.05, ease: "none" }, 1);

      tl.to(
  ".sticky-img-3",
  {
    ease: "none",
    onUpdate: function () {
      const p = this.progress();
      gsap.set(".sticky-img-3", {
        clipPath: `polygon(
          0% 0%,
          100% 0%,
          100% ${gsap.utils.interpolate(0, 100, p)}%,
          0% ${gsap.utils.interpolate(0, 100, p)}%
        )`,
      });
    },
  },
  2
);

      tl.to(".sticky-img-3 img", { scale: 1.15, ease: "none" }, 2);
      tl.to(".sticky-img-2 img", { scale: 1.12, ease: "none" }, 3);

      tl.to(
        copyRef.current,
        {
          rotationY: 0,
          scale: 1,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power2.out",
        },
        3.02
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

        <div className="sticky-img-1 absolute inset-0 overflow-hidden">
          <Image src="/misty.png" alt="" fill className="object-cover" priority />
        </div>

        <div
          className="sticky-img-2 absolute inset-0 overflow-hidden"
          style={{ clipPath: "circle(0% at 50% 50%)" }}
        >
          <Image src="/elegant.png" alt="" fill className="object-cover" />
        </div>

        <div
          className="sticky-img-3 absolute inset-0 overflow-hidden"
          style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
        >
          <Image src="/desperate.png" alt="" fill className="object-cover" />
        </div>

        <div className="absolute top-1/2 left-1/2 z-30 w-[min(78vw,900px)] -translate-x-1/2 -translate-y-1/2">
          <div ref={copyRef} className="text-center opacity-0">
            <h2
              className={`text-[clamp(34px,5vw,80px)] leading-[120%] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6),0_0_15px_rgba(0,0,0,0.4)] uppercase lg:w-[900px]`}
            >
              Manche Welten findet <br />
              man nicht.
              <br />
              Sie finden dich.
            </h2>
          </div>
        </div>
      </section>

      {/* <section className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6 text-center">
        <h2
          className={`${ibmPlexSerif.className} text-[clamp(52px,8vw,120px)] leading-[0.95] text-white`}
        >
          Bist du bereit
          <br />
          für die andere Seite?
        </h2>
      </section> */}
       
    </>
  );
}