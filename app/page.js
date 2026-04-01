"use client";

import Image from "next/image";
import "./globals.css";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import AlbumLightbox from "./components/AlbumLightbox";
import CharacterCard from "./components/CharacterCard";
import Map from "./components/Map";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const segamoriz = localFont({
  src: "./fonts/Segamoriz.woff2",
});

const font2 = localFont({
  src: "./fonts/NeueMontreal-Regular.woff2",
});

export default function Home() {
  const [openLocation, setOpenLocation] = useState(null);
  const [albumLocation, setAlbumLocation] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  const introOverlayRef = useRef(null);
  const introLine1Ref = useRef(null);
  const introLine2Ref = useRef(null);
  const introLine3Ref = useRef(null);

  const heroSectionRef = useRef(null);
  const heroNavRef = useRef(null);
  const heroTitleWrapRef = useRef(null);
  const heroButtonWrapRef = useRef(null);
  const heroCaptionRef = useRef(null);

  const handlePrevCharacter = () => {
    setCurrentCharacter(
      (prev) => (prev - 1 + characters.length) % characters.length,
    );
  };

  const handleNextCharacter = () => {
    setCurrentCharacter((prev) => (prev + 1) % characters.length);
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") {
        handlePrevCharacter();
      }

      if (e.key === "ArrowRight") {
        handleNextCharacter();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const seenIntro = sessionStorage.getItem("heartbeat_intro_seen");

    if (seenIntro) {
      setIntroDone(true);

      gsap.set(
        [
          heroSectionRef.current,
          heroNavRef.current,
          heroTitleWrapRef.current,
          heroButtonWrapRef.current,
          heroCaptionRef.current,
        ],
        { clearProps: "opacity,transform" },
      );

      return;
    }

    gsap.set(heroSectionRef.current, { opacity: 0 });
    gsap.set(heroNavRef.current, { opacity: 0, y: -20 });
    gsap.set(heroTitleWrapRef.current, { opacity: 0, y: 40 });
    gsap.set(heroButtonWrapRef.current, { opacity: 0, y: 30 });
    gsap.set(heroCaptionRef.current, { opacity: 0, y: 20 });

    gsap.set(
      [introLine1Ref.current, introLine2Ref.current, introLine3Ref.current],
      {
        opacity: 0,
        y: 26,
      },
    );

    gsap.set(introLine3Ref.current, {
      scale: 1,
      textShadow: "0 0 0px rgba(255,255,255,0)",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("heartbeat_intro_seen", "true");
        setIntroDone(true);
      },
    });

    tl.to(introLine1Ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    })
      .to(introLine1Ref.current, {
        opacity: 0,
        y: -24,
        duration: 0.65,
        ease: "power2.inOut",
        delay: 0.6,
      })
      .to(
        introLine2Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
        },
        "-=0.08",
      )
      .to(introLine2Ref.current, {
        opacity: 0,
        y: -24,
        duration: 0.65,
        ease: "power2.inOut",
        delay: 0.7,
      })
      .to(
        introLine3Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
        },
        "-=0.08",
      )
      .to(
        introLine3Ref.current,
        {
          scale: 1.04,
          textShadow: "0 0 24px rgba(255,255,255,0.85)",
          duration: 0.22,
          ease: "power2.out",
        },
        "+=0.2",
      )
      .to(introLine3Ref.current, {
        opacity: 0,
        y: -30,
        scale: 1,
        textShadow: "0 0 0px rgba(255,255,255,0)",
        duration: 0.75,
        ease: "power2.inOut",
        delay: 0.18,
      })
      .to(
        introOverlayRef.current,
        {
          opacity: 0,
          duration: 0.85,
          ease: "power2.out",
        },
        "-=0.12",
      )
      .to(
        heroSectionRef.current,
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.45",
      )
      .to(
        heroNavRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.42",
      )
      .to(
        heroTitleWrapRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.32",
      )
      .to(
        heroButtonWrapRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5",
      )
      .to(
        heroCaptionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.42",
      );

    return () => {
      tl.kill();
    };
  }, []);

  const albumImages = {
    taletopia: [
      "/albums/taletopia/taletopia.png",
      "/albums/taletopia/taletopia2.jpeg",
      "/albums/taletopia/taletopia3.jpeg",
      "/albums/taletopia/taletopia4.jpeg",
      "/albums/taletopia/taletopia5.jpeg",
      "/albums/taletopia/taletopia6.jpeg",
      "/albums/taletopia/taletopia7.jpeg",
      "/albums/taletopia/taletopia8.jpeg",
    ],
    witraliria: [
      "/albums/witraliria/witraliria.jpeg",
      "/albums/witraliria/witraliria2.jpeg",
      "/albums/witraliria/witraliria3.jpeg",
      "/albums/witraliria/witraliria4.jpeg",
    ],
    eldarun: [
      "/albums/eldarun/eldarun.jpeg",
      "/albums/eldarun/eldarun1.jpeg",
      "/albums/eldarun/eldarun2.jpeg",
      "/albums/eldarun/eldarun3.jpeg",
      "/albums/eldarun/eldarun4.jpeg",
      "/albums/eldarun/eldarun5.jpeg",
    ],
    erzklamm: [
      "/albums/erzklamm/erzklamm.jpg",
      "/albums/erzklamm/erzklamm2.jpeg",
      "/albums/erzklamm/erzklamm3.jpeg",
      "/albums/erzklamm/erzklamm4.jpeg",
    ],
    aridryan: [
      "/albums/aridryan/aridryan.jpg",
      "/albums/aridryan/aridryan2.jpeg",
    ],
    dammerfels: [
      "/albums/dammerfels/dammerfels.jpeg",
      "/albums/dammerfels/dammerfels2.jpeg",
      "/albums/dammerfels/dammerfels3.jpeg",
      "/albums/dammerfels/dammerfels4.jpeg",
    ],
  };

  const characters = [
    {
      name: "Jason",
      image: "/characters/jason.png",
    },
    {
      name: "Jake",
      image: "/characters/jake.jpg",
    },
    {
      name: "Kylie",
      image: "/characters/kylie.jpg",
    },
    {
      name: "Liv & Mia",
      image: "/characters/livmia.png",
    },
    {
      name: "Zac",
      image: "/characters/zac.jpg",
    },
    {
      name: "Chloe",
      image: "/characters/chloe.jpg",
    },
  ];

  const visibleCharacters = [
    ...characters.slice(currentCharacter),
    ...characters.slice(0, currentCharacter),
  ];

  return (
    <>
      {!introDone && (
        <div
          ref={introOverlayRef}
          className="fixed inset-0 z-[5000] bg-black text-white"
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-6 text-center">
            <h2
              ref={introLine1Ref}
              className={`${segamoriz.className} absolute text-[clamp(64px,9vw,140px)] leading-[0.9] tracking-[-0.02em]`}
            >
              Was, Wenn...
            </h2>

            <h2
              ref={introLine2Ref}
              className={`${segamoriz.className} absolute text-[clamp(54px,7.8vw,120px)] leading-[0.92] tracking-[-0.02em]`}
            >
              Es noch eine
              <br />
              andere Welt gibt?
            </h2>

            <h2
              ref={introLine3Ref}
              className={`${segamoriz.className} absolute text-[clamp(70px,10vw,160px)] leading-[0.9] tracking-[-0.02em]`}
            >
              Die andere Seite
            </h2>
          </div>
        </div>
      )}

      <main className="overflow-x-hidden">
        <section
          ref={heroSectionRef}
          className="relative flex h-screen items-center justify-center"
        >
          <nav
            ref={heroNavRef}
            className="absolute top-6 left-1/2 z-10 flex w-full max-w-[1320px] -translate-x-1/2 items-center justify-between px-6"
          >
            <h1 className="cursor-pointer text-[37px] leading-[31px] tracking-[-5%] text-white uppercase">
              Deevee
            </h1>
            <div>
              <ul
                className={`ml-14 flex gap-6.25 text-[14px] leading-[100%] tracking-[6%] text-white uppercase ${ibmPlexSerif.className}`}
              >
                <li className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">
                  Home
                </li>
                <li className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">
                  The World
                </li>
                <li className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">
                  Characters
                </li>
                <li className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">
                  About
                </li>
              </ul>
            </div>
            <button
              className={`cursor-pointer rounded-2xl bg-amber-900 py-2 px-3 text-[14px] font-medium text-white uppercase ${ibmPlexSerif.className}`}
              style={{
                clipPath:
                  "polygon(8% 0, 92% 0, 100% 25%, 100% 75%, 92% 100%, 8% 100%, 0 75%, 0 25%)",
              }}
            >
              Join the journey
            </button>
          </nav>

          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/video/video2.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 top-0 z-[1] h-44 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-[1] h-44 bg-gradient-to-t from-black to-transparent" />

          <div
            ref={heroTitleWrapRef}
            className="relative z-10 text-center text-white uppercase"
          >
            <h1 className="text-[190px] leading-[159px] tracking-[-5%]">
              Heartbeat
            </h1>
            <span
              className={`mt-8 block text-[20px] tracking-[0.95em] ${font2.className}`}
            >
              Die andere Seite
            </span>
          </div>

          <div
            ref={heroButtonWrapRef}
            className="absolute left-1/2 top-[75.5%] z-100 -translate-x-1/2"
          >
            <button
              className={`${ibmPlexSerif.className} border border-white/30 bg-black/20 px-10 py-4 text-[15px] tracking-[0.18em] text-white uppercase backdrop-blur-[2px] transition duration-300 hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]`}
            >
              Jetzt eintauchen
            </button>
          </div>

          <div
            ref={heroCaptionRef}
            className="absolute left-1/2 top-[91.5%] z-2 -translate-x-1/2 space-y-1.5 text-center text-[16px] leading-[100%] tracking-[-3%] text-white uppercase"
          >
            <p>Magie ist real. Vertrauen ist tödlich.</p>
            <p className="text-[12px]">Und Liebe kann dein Untergang sein.</p>
          </div>
        </section>

        <section className="relative z-[2] flex h-screen justify-center bg-[url('/taletopia.png')] bg-cover bg-center bg-no-repeat text-center">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 top-0 z-[1] h-48 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute top-[27.5%] z-10 flex flex-col items-center">
            <h1 className="w-[min(90vw,782px)] text-[clamp(72px,8vw,120px)] leading-[0.95] tracking-[-0.05em] text-white">
              Eine neue Welt
              <br />
              wartet auf dich.
            </h1>
            <button
              className={`${ibmPlexSerif.className} mt-8 cursor-pointer border border-white/30 bg-black/20 px-10 py-4 text-[15px] tracking-[0.18em] text-white uppercase backdrop-blur-[2px] transition duration-300 hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]`}
            >
              Enter the World
            </button>

            <button
              className={`${font2.className} mt-5 inline-flex cursor-pointer items-center gap-2 text-[14px] tracking-[0.28em] text-white/85 uppercase transition duration-300 hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]`}
            >
              Jetzt eintauchen
            </button>
          </div>
        </section>

        <Map
          openLocation={openLocation}
          setAlbumLocation={setAlbumLocation}
          setOpenLocation={setOpenLocation}
        />

        <AlbumLightbox
          isOpen={!!albumLocation}
          onClose={() => setAlbumLocation(null)}
          title={albumLocation ? `${albumLocation} album` : ""}
          images={albumLocation ? albumImages[albumLocation] || [] : []}
        />

        <section className="relative min-h-screen bg-[#1A0C01] pt-14 pb-40">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between border-t-1 border-b-1 border-[#4e4318] text-white">
            <h2 className="text-[40px] leading-[119px] tracking-[-5%]">
              Meet The Characters
            </h2>
            <div className="translate-y-9 flex items-center gap-3">
              <button
                onClick={handlePrevCharacter}
                className="mb-16 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10"
                aria-label="Previous character"
              >
                ←
              </button>

              <button
                onClick={handleNextCharacter}
                className="mb-16 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10"
                aria-label="Next character"
              >
                →
              </button>
            </div>
          </div>
          <div className="mt-10 overflow-hidden">
            <div className="flex justify-center gap-6 transition-transform duration-500 ease-in-out">
              {visibleCharacters.map((char, index) => (
                <CharacterCard
                  key={char.name}
                  name={char.name}
                  image={char.image}
                  isActive={index === 2}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-[1] h-50 bg-gradient-to-t from-black to-transparent" />
        </section>

        <section className="relative z-10 h-[2062px] overflow-hidden bg-[#1A0C01]">
          <div className="absolute inset-0 z-2 bg-black/40" />
          <div className="absolute inset-0">
            <Image
              src="/bgauthor.png"
              alt="About the story background"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 top-0 z-[1] h-50 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black to-transparent" />

          <Image
            src="/g39.svg"
            alt="authorbg"
            width={450}
            height={700}
            className="absolute top-[220px] left-[10%]"
          />
          <div className="absolute top-[270px] right-[10%] z-100 w-[506px] space-y-16">
            <h1 className="text-[80px] leading-[80px] tracking-[-5%] text-white uppercase">
              About The Author
            </h1>
            <p className={`text-[18px] text-white ${ibmPlexSerif.className}`}>
              Deevee ist Autorin im Genre Dark Romantasy und Romantasy und
              erschafft Geschichten, in denen sich Liebe und Dunkelheit auf
              faszinierende Weise begegnen. Schon seit ihrem 14. Lebensjahr
              widmet sie sich dem Schreiben und hat seither ihre Leidenschaft
              für das Erzählen intensiver, emotionaler und geheimnisvoller
              Welten stetig vertieft. Ihre Geschichten laden Leserinnen und
              Leser dazu ein, in neue magische Welten einzutauchen, in denen
              nichts ganz so ist, wie es scheint. Wenn sie nicht schreibt,
              sammelt Deevee neue Inspirationen für ihre nächsten Projekte und
              ist immer auf der Suche nach Geschichten, die berühren, fesseln
              und lange im Gedächtnis bleiben.
            </p>
          </div>

          <div className="relative z-10">&nbsp;</div>
        </section>
      </main>
    </>
  );
}