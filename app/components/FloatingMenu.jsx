"use client";

import { useEffect, useRef, useState } from "react";
import { FiInstagram } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
import { gsap } from "gsap";

export default function FloatingMenu({ ibmPlexSerif, font2, visible, scrollToId, open, setOpen }) {
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const overlayRef = useRef(null);
  const topBlindRef = useRef(null);
  const bottomBlindRef = useRef(null);
  const topPaintRef = useRef(null);
  const bottomPaintRef = useRef(null);
  const contentBgRef = useRef(null);
  const linkRefs = useRef([]);
  const footerRefs = useRef([]);
  const toggleTopRef = useRef(null);
  const toggleBottomRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    linkRefs.current = linkRefs.current.slice(0, 5);
    footerRefs.current = footerRefs.current.slice(0, 5);
  }, []);

  useEffect(() => {
    gsap.set(overlayRef.current, {
      autoAlpha: 0,
      pointerEvents: "none",
    });

    gsap.set(topPaintRef.current, {
      scaleY: 0,
      transformOrigin: "50% 100%",
    });

    gsap.set(bottomPaintRef.current, {
      scaleY: 0,
      transformOrigin: "50% 0%",
    });

    gsap.set([topBlindRef.current, bottomBlindRef.current], {
      yPercent: 0,
    });

    gsap.set(contentBgRef.current, {
      scale: 1,
      autoAlpha: 0,
    });

    gsap.set(linkRefs.current, {
      yPercent: 110,
      opacity: 0,
    });

    gsap.set(footerRefs.current, {
      yPercent: 110,
      opacity: 0,
    });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
      onStart: () => {
        gsap.set(overlayRef.current, {
          autoAlpha: 1,
          pointerEvents: "auto",
        });
      },
      onReverseComplete: () => {
        gsap.set(overlayRef.current, {
          autoAlpha: 0,
          pointerEvents: "none",
        });
      },
    });

    tl.to(
      toggleTopRef.current,
      {
        y: 3.25,
        rotation: 45,
        scaleX: 0.75,
        duration: 0.55,
        ease: "power3.out",
      },
      0
    )
      .to(
        toggleBottomRef.current,
        {
          y: -3.25,
          rotation: -45,
          scaleX: 0.75,
          duration: 0.55,
          ease: "power3.out",
        },
        0
      )
      .to(
        topPaintRef.current,
        {
          scaleY: 1,
          duration: 0.55,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        bottomPaintRef.current,
        {
          scaleY: 1,
          duration: 0.55,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        contentBgRef.current,
        {
          autoAlpha: 1,
          duration: 0.01,
          ease: "none",
        },
        0.56
      )
      .to(
        topBlindRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        },
        0.58
      )
      .to(
        bottomBlindRef.current,
        {
          yPercent: 100,
          duration: 0.8,
          ease: "power4.inOut",
        },
        0.58
      )
      .to(
        linkRefs.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.82
      )
      .to(
        footerRefs.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.05,
          ease: "power3.out",
        },
        0.92
      );

    timelineRef.current = tl;
  }, []);

  useEffect(() => {
    if (!timelineRef.current) return;
    if (open) timelineRef.current.play();
    else timelineRef.current.reverse();
  }, [open]);


  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSubscribe() {
    setEmailError("");
    setEmailMessage("");

    if (!email.trim()) {
      setEmailError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setEmailMessage("Danke! Du bist auf der Liste.");
    setEmail("");
  }

  const navItems = [
    ["Home", "home"],
    ["The World", "map"],
    ["Characters", "characters"],
    ["About", "about"],
    ["Store", "store"],
  ];

  return (
    <>
      <div
        className={`fixed top-6 right-6 z-[4002] transition-all duration-300 ${
          visible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`${font2.className} relative flex h-[60px] w-[60px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-white/15 bg-black/35 backdrop-blur-md transition duration-300 hover:border-white/30 hover:bg-black/55`}
          aria-label="Toggle menu"
        >
          <span
            ref={toggleTopRef}
            className="block h-[1.25px] w-[22px] bg-white"
          />
          <span
            ref={toggleBottomRef}
            className="block h-[1.25px] w-[22px] bg-white"
          />
        </button>
      </div>

      <div ref={overlayRef} className="fixed inset-0 z-[4001] overflow-hidden">
        <div className="absolute inset-0">
          <div
            ref={contentBgRef}
            className="absolute inset-0 bg-[url('/portalnav.png')] bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div
            ref={topBlindRef}
            className="absolute left-0 top-0 h-1/2 w-full overflow-hidden"
          >
            <div ref={topPaintRef} className="h-full w-full bg-black" />
          </div>

          <div
            ref={bottomBlindRef}
            className="absolute bottom-0 left-0 h-1/2 w-full overflow-hidden"
          >
            <div ref={bottomPaintRef} className="h-full w-full bg-black" />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <div className="absolute top-7 left-8 md:top-10 md:left-12">
            <div className="overflow-hidden">
              <p
                ref={(el) => (footerRefs.current[0] = el)}
                className="text-[37px] uppercase tracking-[-5%] text-white"
              >
                Deevee
              </p>
            </div>

            <div className="mt-5 flex flex-col items-start gap-3 overflow-hidden">
              <a
                ref={(el) => (footerRefs.current[1] = el)}
                href="https://instagram.com/xdeeveee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram link"
                className="inline-flex items-center gap-3 text-white/85 transition hover:text-[#FFD281]"
              >
                <FiInstagram className="text-[18px]" />
                <span
                  className={`${font2.className} text-[12px] uppercase tracking-[0.25em]`}
                >
                  Instagram
                </span>
              </a>

              <a
                ref={(el) => (footerRefs.current[2] = el)}
                href="https://www.tiktok.com/@xdeeveee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tiktok link"
                className="inline-flex items-center gap-3 text-white/85 transition hover:text-[#FFD281]"
              >
                <SiTiktok className="text-[16px]" />
                <span
                  className={`${font2.className} text-[12px] uppercase tracking-[0.25em]`}
                >
                  TikTok
                </span>
              </a>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-1 md:gap-4">
            {navItems.map(([label, id], index) => (
              <div key={id} className="overflow-hidden">
                <button
                  ref={(el) => (linkRefs.current[index] = el)}
                  onClick={() => scrollToId(id)}
                  className="cursor-pointer text-center text-[clamp(56px,7vw,128px)] uppercase leading-[0.9] tracking-[-0.04em] text-white/95 transition duration-300 hover:text-[#FFD281]"
                >
                  {label}
                </button>
              </div>
            ))}
          </div>

          <div className="absolute bottom-8 left-8 w-[min(320px,calc(100vw-4rem))] md:bottom-10 md:left-12">
            <div
              ref={(el) => (footerRefs.current[3] = el)}
              className="rounded-[20px] border border-white/10 bg-black/25 p-4 text-left backdrop-blur-[3px]"
            >
              <p
                className={`${font2.className} text-[10px] uppercase tracking-[0.28em] text-white/50`}
              >
                Updates
              </p>

              <p
                className={`${ibmPlexSerif.className} mt-2 text-[15px] leading-[1.5] text-white/82`}
              >
                Erhalte Neuigkeiten zu neuen Büchern, Presales und besonderen
                Heartbeat-News.
              </p>

              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Deine E-Mail"
                  className={`${font2.className} min-w-0 flex-1 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] text-white placeholder:text-white/32 outline-none transition focus:border-white/28 focus:bg-white/[0.07]`}
                />

                <button
                  onClick={handleSubscribe}
                  className={`${font2.className} shrink-0 rounded-full border border-white/18 bg-white/[0.06] px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white transition duration-300 hover:border-white/35 hover:bg-white/[0.1]`}
                >
                  Join
                </button>
              </div>

              {emailError && (
                <p
                  className={`${font2.className} mt-2 text-[11px] tracking-[0.02em] text-red-300`}
                >
                  {emailError}
                </p>
              )}

              {emailMessage && (
                <p
                  className={`${font2.className} mt-2 text-[11px] tracking-[0.02em] text-[#FFD281]`}
                >
                  {emailMessage}
                </p>
              )}
            </div>
          </div>

          <div className="absolute bottom-8 right-8 md:bottom-10 md:right-12 overflow-hidden">
            <p
              ref={(el) => (footerRefs.current[4] = el)}
              className={`${font2.className} text-[10px] uppercase tracking-[0.28em] text-white`}
            >
              Official Author Site
            </p>
          </div>
        </div>
      </div>
    </>
  );
}