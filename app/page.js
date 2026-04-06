"use client";

import Image from "next/image";
import "./globals.css";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import AlbumLightbox from "./components/AlbumLightbox";
import Map from "./components/Map";
import Characters from "./components/Characters";
import { AnimatePresence, motion } from "framer-motion";

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
  const [introDone, setIntroDone] = useState(false);
  const [aboutView, setAboutView] = useState("author");

  const introOverlayRef = useRef(null);
  const introLine1Ref = useRef(null);
  const introLine2Ref = useRef(null);
  const introLine3Ref = useRef(null);

  const heroSectionRef = useRef(null);
  const heroNavRef = useRef(null);
  const heroTitleWrapRef = useRef(null);
  const heroButtonWrapRef = useRef(null);
  const heroCaptionRef = useRef(null);

   const aboutContent = {
  author: {
    titleTop: "About",
    titleBottom: "The Author",
    paragraphs: [
      "Deevee ist Autorin im Genre Dark Romantasy und Romantasy und erschafft Geschichten, in denen sich Liebe und Dunkelheit auf faszinierende Weise begegnen.",
      "Schon seit ihrem 14. Lebensjahr widmet sie sich dem Schreiben und hat seither ihre Leidenschaft für das Erzählen intensiver, emotionaler und geheimnisvoller Welten stetig vertieft.",
      "Ihre Geschichten laden Leserinnen und Leser dazu ein, in neue magische Welten einzutauchen, in denen nichts ganz so ist, wie es scheint.",
      "Wenn sie nicht schreibt, sammelt Deevee neue Inspirationen für ihre nächsten Projekte und ist immer auf der Suche nach Geschichten, die berühren, fesseln und lange im Gedächtnis bleiben.",
    ],
  },
  story: {
    titleTop: "About",
    titleBottom: "The Story",
    paragraphs: [
      "Kylie glaubte, sie sei ein ganz normales Mädchen. Bis zu dem Tag, an dem ihre Schwester spurlos verschwindet und die Wahrheit ihre Welt zerreißt.",
      "Magische Wesen sind real. Und Kylie ist tiefer in ihrer Welt verstrickt, als sie je hätte ahnen können. Auf der Suche nach ihrer Schwester betritt sie die andere Seite, ein Reich aus tödlicher Magie, uralten Bündnissen und Intrigen, die niemals in Vergessenheit geraten sind.",
      "Doch je näher sie der Wahrheit kommt, desto mehr beginnt alles zu zerbrechen. An der Seite eines Feenprinzen gerät Kylie in einen Strudel aus Machtkämpfen und dunklen Entscheidungen, die der Auslöser eines apokalyptischen Krieges werden. Und während Schatten näher rücken, muss Kylie sich fragen:",
      "Wie viel ist sie bereit zu opfern, um die zu retten, die sie liebt?",
    ],
  },
};


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
          duration: 1.1,
          ease: "power3.out",
        },
        "-=0.08",
            )
      .fromTo(
        introLine3Ref.current,
        {
          scale: 0.96,
          filter: "blur(6px)",
        },
        {
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=1",
      )
            .to(
  introLine3Ref.current,
  {
    textShadow: "0 0 28px rgba(255,255,255,0.9)",
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  },
  "+=0.2",
)
.to(
  introLine3Ref.current,
  {
    opacity: 0,
    y: -18,
    duration: 0.35,
    ease: "power2.inOut",
  },
  "+=0.05",
)
.to(
  introOverlayRef.current,
  {
    opacity: 0,
    duration: 0.85,
    ease: "power2.out",
  },
  "+=0.02",
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

        <Characters />
        {/* <div className="absolute inset-x-0 top-0 z-[30] h-32.5 bg-gradient-to-b from-black to-transparent" /> */}

      <section className="h-screen bg-[url('/bgauthor1.png')] bg-cover bg-center bg-no-repeat contrast-130 relative overflow-hidden">
  <div className="absolute inset-x-0 top-0 z-[20] h-30 bg-gradient-to-b from-black to-transparent pointer-events-none" />
  <div className="absolute inset-x-0 bottom-0 z-[20] h-30 bg-gradient-to-t from-black to-transparent pointer-events-none" />
  <div className="absolute top-0 right-0 h-full w-[15%] z-[20] bg-gradient-to-l from-black to-transparent pointer-events-none" />
  <div className="absolute top-0 left-0 h-full w-[15%] z-[20] bg-gradient-to-r from-black to-transparent pointer-events-none" />

  <div className="absolute top-0 right-[-5%] h-full z-10 pointer-events-none overflow-visible">
    <Image
      src="/rippedpaper_colored3.png"
      alt=""
      width={900}
      height={900}
      className="h-full w-auto max-w-[62.5vw] contrast-200"
    />
  </div>

  <div className="flex z-25 w-full h-full items-center">
    <div className="max-w-[1440px] w-[75%] mx-auto grid grid-cols-2 items-center gap-[15%]">
      
      {/* static image */}
      <div className="justify-self-end">
        <Image
          src="/g39.svg"
          alt="Author image"
          width={430}
          height={730}
          className="h-auto w-[280px] object-contain brightness-110 contrast-75 sm:w-[340px] lg:w-[400px] xl:w-[430px]"
        />
      </div>

      {/* text side */}
      <div className="relative text-white z-25 justify-self-start translate-x-[20%]">
        {/* absolute toggle, won't affect layout */}
        <div className={`absolute ${
              aboutView === "author"
                ? "top-[clamp(24%,10vw,370px)] right-[clamp(49%,10vw,370px)]"
                : "top-[clamp(23%,9vw,380px)] right-[clamp(50%,10vw,370px)]"
            } z-30 inline-flex rounded-full border border-white/15 bg-black/20 p-1 backdrop-blur-sm z-150 transition`}>
          <button
            onClick={() => setAboutView("author")}
            className={`cursor-pointer rounded-full px-5 py-2 text-[12px] uppercase tracking-[0.18em] transition z-150 ${
              aboutView === "author"
                ? "bg-white text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            Author
          </button>

          <button
            onClick={() => setAboutView("story")}
            className={`cursor-pointer rounded-full px-5 py-2 text-[12px] uppercase tracking-[0.18em] transition z-150 ${
              aboutView === "story"
                ? "bg-white text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            Story
          </button>
        </div>

        <h2 className="text-[clamp(48px,6vw,70px)] leading-[0.92] tracking-[-0.05em]">
          {aboutContent[aboutView].titleTop}
          <br />
          {aboutContent[aboutView].titleBottom}
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={aboutView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-10"
          >
            <div
              className={`${ibmPlexSerif.className} max-w-[600px] text-[clamp(14px,1.2vw,16px)] leading-[1.55] tracking-normal space-y-3 translate-y-4`}
            >
              {aboutContent[aboutView].paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
</section>
<div className="w-full h-10 bg-black">
  &nbsp;
</div>
<section className="h-screen bg-[url('/gaze.png')] bg-cover bg-center bg-no-repeat relative text-center flex justify-center items-center">
  <div className="absolute inset-x-0 top-0 z-[20] h-20 bg-gradient-to-b from-black to-transparent pointer-events-none" />
  <div className="absolute inset-x-0 bottom-0 z-[20] h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
</section>
{/* <div className="w-full h-10 bg-black">
  &nbsp;
</div> */}
<section className="h-screen bg-[url('/fieryy.png')] bg-cover bg-center bg-no-repeat relative">
  <div className="absolute inset-x-0 top-0 z-[20] h-20 bg-gradient-to-b from-black to-transparent pointer-events-none" />
  <div className="absolute inset-x-0 bottom-0 z-[20] h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
</section>
      </main>
    </>
  );
}