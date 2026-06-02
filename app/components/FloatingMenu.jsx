"use client";

import { useEffect, useRef, useState } from "react";
import { FiInstagram } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
import { gsap } from "gsap";
import Link from "next/link";

export default function FloatingMenu({
  ibmPlexSerif,
  font2,
  visible,
  scrollToId,
  open,
  setOpen,
}) {
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const overlayRef = useRef(null);
  const topBlindRef = useRef(null);
  const bottomBlindRef = useRef(null);
  const topPaintRef = useRef(null);
  const bottomPaintRef = useRef(null);
  const contentBgRef = useRef(null);

  const leftBlockRef = useRef(null);
  const subscribeBlockRef = useRef(null);
  const rightFooterRef = useRef(null);

  const navLineRefs = useRef([]);
  const footerLineRefs = useRef([]);

  const toggleTopRef = useRef(null);
  const toggleBottomRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    navLineRefs.current = navLineRefs.current.slice(0, 5);
    footerLineRefs.current = footerLineRefs.current.slice(0, 5);
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
      autoAlpha: 0,
      scale: 1,
    });

    gsap.set(
      [leftBlockRef.current, subscribeBlockRef.current, rightFooterRef.current],
      {
        autoAlpha: 0,
        y: 24,
      },
    );

    gsap.set(navLineRefs.current, {
      yPercent: 110,
      opacity: 1,
    });

    gsap.set(footerLineRefs.current, {
      yPercent: 110,
      opacity: 1,
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
        duration: 0.8,
        ease: "power3.out",
      },
      0,
    )
      .to(
        toggleBottomRef.current,
        {
          y: -3.25,
          rotation: -45,
          scaleX: 0.75,
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      )
      .to(
        topPaintRef.current,
        {
          scaleY: 1,
          duration: 0.85,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        bottomPaintRef.current,
        {
          scaleY: 1,
          duration: 0.85,
          ease: "power3.inOut",
        },
        0,
      )
      .set(
        contentBgRef.current,
        {
          autoAlpha: 1,
        },
        0.5,
      )
      .to(
        topBlindRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
        },
        0.5,
      )
      .to(
        bottomBlindRef.current,
        {
          yPercent: 100,
          duration: 0.85,
          ease: "power4.inOut",
        },
        0.5,
      )
      .to(
        [
          leftBlockRef.current,
          subscribeBlockRef.current,
          rightFooterRef.current,
        ],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.04,
        },
        0.82,
      )
      .to(
        navLineRefs.current,
        {
          yPercent: 0,
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.78,
      )
      .to(
        footerLineRefs.current,
        {
          yPercent: 0,
          duration: 0.65,
          stagger: 0.05,
          ease: "power3.out",
        },
        0.88,
      );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!timelineRef.current) return;

    if (open) timelineRef.current.play();
    else timelineRef.current.reverse();
  }, [open]);

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubscribe() {
    setEmailError("");
    setEmailMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          source: "footer",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || "Anmeldung fehlgeschlagen.");
        return;
      }

      setEmailMessage("Danke! Du wirst über Updates informiert.");
      setEmail("");
    } catch (err) {
      setError("Etwas ist schiefgelaufen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const navItems = [
    ["Home", "home"],
    ["Die Welt", "map"],
    ["Charaktere", "characters"],
    ["Autor", "about"],
    ["Shop", "store"],
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
          <div
            ref={leftBlockRef}
            className="absolute left-8 top-7 md:left-12 md:top-10"
          >
            <div className="overflow-hidden">
              <p className="text-[37px] uppercase tracking-[-5%] text-white">
                <span
                  ref={(el) => (footerLineRefs.current[0] = el)}
                  className="inline-block will-change-transform"
                >
                  Deevee
                </span>
              </p>
            </div>

            <div className="mt-5 flex flex-col items-start gap-3">
              <div className="overflow-hidden">
                <a
                  href="https://instagram.com/xdeeveee"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram link"
                  className="inline-flex items-center gap-3 text-white/85 transition hover:text-[#FFD281]"
                >
                  <FiInstagram className="text-[18px]" />
                  <span
                    ref={(el) => (footerLineRefs.current[1] = el)}
                    className={`${font2.className} inline-block text-[12px] uppercase tracking-[0.25em] will-change-transform`}
                  >
                    Instagram
                  </span>
                </a>
              </div>

              <div className="overflow-hidden">
                <a
                  href="https://www.tiktok.com/@xdeeveee"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Tiktok link"
                  className="inline-flex items-center gap-3 text-white/85 transition hover:text-[#FFD281]"
                >
                  <SiTiktok className="text-[16px]" />
                  <span
                    ref={(el) => (footerLineRefs.current[2] = el)}
                    className={`${font2.className} inline-block text-[12px] uppercase tracking-[0.25em] will-change-transform`}
                  >
                    TikTok
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-1 md:gap-3 lg:mb-4">
            {navItems.map(([label, id], index) => {
              const sharedClass =
              "menu-link group relative inline-block cursor-pointer text-center text-[clamp(56px,7vw,128px)] uppercase leading-[0.9] tracking-[-0.04em] text-white/95";

              return (
                <div key={id} className="overflow-hidden">
                  {id === "store" ? (
                    <Link href="/store" className={sharedClass}>
                      <span
                        ref={(el) => (navLineRefs.current[index] = el)}
                        className="block will-change-transform"
                      >
                        <span className="menu-link-label relative inline-block">
                          {label}
                          <span className="menu-link-underline" />
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToId(id)}
                      className={sharedClass}
                    >
                      <span
                        ref={(el) => (navLineRefs.current[index] = el)}
                        className="block will-change-transform"
                      >
                        <span className="menu-link-label relative inline-block">
                          {label}
                          <span className="menu-link-underline" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div
            ref={subscribeBlockRef}
            className="absolute bottom-8 left-8 w-[min(320px,calc(100vw-4rem))] md:bottom-10 md:left-12"
          >
            <div className="rounded-[20px] border border-white/10 bg-black/25 p-4 text-left backdrop-blur-[3px]">
              <div className="overflow-hidden">
                <p
                  ref={(el) => (footerLineRefs.current[3] = el)}
                  className={`${font2.className} inline-block text-[10px] uppercase tracking-[0.28em] text-white/50 will-change-transform`}
                >
                  Updates
                </p>
              </div>

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
                  disabled={isSubmitting}
                  onClick={handleSubscribe}
                  className={`${ibmPlexSerif.className} rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm uppercase transition hover:border-white/40 hover:bg-white/15 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <span className="flex items-center justify-center gap-2 text-white/82">
                    {isSubmitting && (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/25 border-t-white" />
                    )}

                    {isSubmitting ? "Wird gesendet..." : "Anmelden"}
                  </span>
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

          <div
            ref={rightFooterRef}
            className="absolute bottom-8 right-8 overflow-hidden md:bottom-10 md:right-12"
          >
            <p
              ref={(el) => (footerLineRefs.current[4] = el)}
              className={`${font2.className} inline-block text-[10px] uppercase tracking-[0.28em] text-white will-change-transform`}
            >
              Official Author Site
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
