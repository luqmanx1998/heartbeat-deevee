"use client";

import Image from "next/image";
import "./globals.css";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import AlbumLightbox from "./components/AlbumLightbox";
import Map from "./components/Map";
import Characters from "./components/Characters";
import { AnimatePresence, motion } from "framer-motion";
import StickyStorySection from "./components/StickyStorySection";
import SmoothScroll from "./components/SmoothScroll";
import BookRevealSection from "./components/BookRevealSection";
import Footer from "./components/Footer";
import WorldIntroSection from "./components/WorldIntroSection";
import ReadySection from "./components/ReadySection";
import FloatingMenu from "./components/FloatingMenu";
import { FiInstagram } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
import PageViewTracker from "./components/PageViewTracker";

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
  const router = useRouter();

  const [openLocation, setOpenLocation] = useState(null);
  const [albumLocation, setAlbumLocation] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const [aboutView, setAboutView] = useState("author");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobileMenuMode, setIsMobileMenuMode] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  const introOverlayRef = useRef(null);
  const introLine1Ref = useRef(null);
  const introLine2Ref = useRef(null);
  const introLine3Ref = useRef(null);
  

  const heroSectionRef = useRef(null);
  const heroNavRef = useRef(null);
  const heroTitleWrapRef = useRef(null);
  const heroButtonWrapRef = useRef(null);
  const heroCaptionRef = useRef(null);

  const heroCtaRef = useRef(null);
  const pageFlashRef = useRef(null);
  const heroVideoRef = useRef(null);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const logoUrl = `${siteUrl}/deeveeemaildark2.png`;
  const heroUrl = `${siteUrl}/emailhero.jpg`;

  console.log("EMAIL SITE URL:", siteUrl);
  console.log("LOGO URL:", logoUrl);
  console.log("HERO URL:", heroUrl);


  const aboutContent = {
  author: {
    titleTop: "About",
    titleBottom: "The Author",
    paragraphs: [
      "Deevee schreibt Dark Romantasy und Romantasy und liebt Geschichten, in denen nichts so ist, wie es zunächst scheint. Bereits mit 14 Jahren begann sie zu schreiben und entdeckte dabei ihre Leidenschaft für geheimnisvolle Welten.",
      "Besonders am Herzen liegt ihr „Heartbeat“, ein Projekt, das sie seit inzwischen zehn Jahren begleitet und das sie bis heute weiterentwickelt.",
      "Neben diesem Herzensprojekt arbeitet sie stetig an neuen Büchern und Ideen.",
    ],
  },


  story: {
    titleTop: "About",
    titleBottom: "The Story",
    paragraphs: [
      "Kylie glaubte, sie sei ein ganz normales Mädchen. Bis zu dem Tag, an dem ihre Schwester spurlos verschwindet und die Wahrheit ihre Welt zerreißt.",
      "Magische Wesen sind real. Und Kylie ist tiefer in ihrer Welt verstrickt, als sie je hätte ahnen können. Auf der Suche nach ihrer Schwester betritt sie die andere Seite, ein Reich aus tödlicher Magie, uralten Bündnissen und Intrigen, die niemals in Vergessenheit geraten sind.",
      "Doch je näher sie der Wahrheit kommt, desto mehr beginnt alles zu zerbrechen. An der Seite eines Feenprinzen gerät Kylie in einen Strudel aus Machtkämpfen und dunklen Entscheidungen, die der Auslöser eines apokalyptischen Krieges werden. Und während Schatten näher rücken, muss Kylie sich fragen: Wie viel ist sie bereit zu opfern, um die zu retten, die sie liebt?",
    ],
  },
};

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;

    setOpen(false);

    setTimeout(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 350);
  }

  function handleStoreTransition(targetRef) {
  if (isTransitioning) return;
  setIsTransitioning(true);

  const targetEl = targetRef?.current ?? heroCtaRef.current;

  if (!targetEl) {
    router.push("/store");
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      router.push("/store");
    },
  });

  tl.to(targetEl, {
    boxShadow: "0 0 40px rgba(255,255,255,0.65)",
    borderColor: "rgba(255,255,255,0.95)",
    backgroundColor: "rgba(255,255,255,0.14)",
    scale: 1.04,
    duration: 0.18,
    ease: "power2.out",
  })
    .to(targetEl, {
      scale: 1,
      duration: 0.12,
      ease: "power2.inOut",
    })
    .to(
      pageFlashRef.current,
      {
        opacity: 1,
        duration: 0.28,
        ease: "power2.out",
      },
      "-=0.02"
    );
}

 useEffect(() => {
  function handleFloatingMenuVisibility() {
    const isMobileOrTablet = window.innerWidth < 1024;

    setIsMobileMenuMode(isMobileOrTablet);

    if (isMobileOrTablet) {
      setShowFloatingMenu(true);
      return;
    }

    const heroHeight = window.innerHeight * 0.8;
    setShowFloatingMenu(window.scrollY > heroHeight);
  }

  handleFloatingMenuVisibility();

  window.addEventListener("scroll", handleFloatingMenuVisibility);
  window.addEventListener("resize", handleFloatingMenuVisibility);

  return () => {
    window.removeEventListener("scroll", handleFloatingMenuVisibility);
    window.removeEventListener("resize", handleFloatingMenuVisibility);
  };
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
      "/albums/witraliria/witch1.jpg",
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
      "/albums/aridryan/aridryan3.png",
      "/albums/aridryan/aridryan2.jpeg",
      "/albums/aridryan/dryad3.jpg",
      "/albums/aridryan/dryad4.jpg",
      "/albums/aridryan/dryad5.jpg",
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
      <PageViewTracker pageType="homepage" />
      <SmoothScroll />
      <FloatingMenu
        ibmPlexSerif={ibmPlexSerif}
        font2={font2}
        visible={showFloatingMenu}
        scrollToId={scrollToId}
        open={open}
        setOpen={setOpen}
      />

      <div
        ref={pageFlashRef}
        className="pointer-events-none fixed inset-0 z-[9999] bg-white opacity-0"
      />

      {!introDone && (
        <div
          ref={introOverlayRef}
          className="fixed inset-0 z-[5000] bg-black text-white"
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-6 text-center">
            <h2
              ref={introLine1Ref}
              className={`${segamoriz.className} absolute text-[clamp(42px,14vw,140px)] leading-[0.9] tracking-[-0.02em]`}
            >
              Was, Wenn...
            </h2>

            <h2
              ref={introLine2Ref}
              className={`${segamoriz.className} absolute text-[clamp(34px,11vw,120px)] leading-[0.92] tracking-[-0.02em]`}
            >
              Es noch eine
              <br />
              andere Welt gibt?
            </h2>

            <h2
              ref={introLine3Ref}
              className={`${segamoriz.className} absolute text-[clamp(44px,15vw,160px)] leading-[0.9] tracking-[-0.02em]`}
            >
              Die andere Seite
            </h2>
          </div>
        </div>
      )}

      <main className="overflow-x-hidden">
        <section
          id="home"
          ref={heroSectionRef}
          className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
        >
          <nav
            ref={heroNavRef}
            className="absolute left-1/2 top-4 z-[100] flex w-full max-w-[1320px] -translate-x-1/2 px-4 sm:px-6 lg:justify-between lg:items-center"
          >
            {/* <h1 className="cursor-pointer text-[37px] leading-[31px] tracking-[-5%] text-white uppercase">
              Deevee
            </h1> */}
            <Image
              src="/deeveelogoclear.png"
              alt="Deevee Logo"
              className="translate-y-5 -translate-x-8 lg:translate-x-0 lg:translate-y-0 h-auto w-[200px] cursor-pointer sm:w-[220px] lg:w-[260px] lg:-translate-x-26 xl:w-[350px]r"
              width={350}
              height={300}
              priority
            />

            <div className="hidden lg:block lg:translate-x-8">
              <ul
                className={`ml-14 flex gap-6.25 text-[14px] leading-[100%] tracking-[6%] text-white uppercase ${ibmPlexSerif.className} lg:-translate-x-20`}
              >
                <li 
                onClick={() => scrollToId("home")}
                className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">
                  Home
                </li>
                <li 
                onClick={() => scrollToId("map")}
                className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">
                  Die Welt
                </li>
                <li 
                onClick={() => scrollToId("characters")}
                className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">
                  Charaktere
                </li>
                <li 
                onClick={() => scrollToId("about")}
                className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">
                  Autor
                </li>
              </ul>
            </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
            href="https://instagram.com/xdeeveee"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center justify-center p-1 text-white transition-colors duration-300 hover:text-[#FFD281]"
          >
            <FiInstagram className="text-[18px] text-white hover:text-[#FFD281] transition-colors duration-300 cursor-pointer" />
          </a>

          <a
            href="https://www.tiktok.com/@xdeeveee"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center justify-center p-1 text-white transition-colors duration-300 hover:text-[#FFD281]"
          >
            <SiTiktok className="text-[16px] text-white hover:text-[#FFD281] transition-colors duration-300 cursor-pointer" />
          </a>
            
            <button
              onClick={() => scrollToId("footer")}
              className={`cursor-pointer rounded-2xl bg-amber-900 py-2 px-3 text-[14px] font-medium text-white uppercase ${ibmPlexSerif.className}`}
              style={{
                clipPath:
                  "polygon(8% 0, 92% 0, 100% 25%, 100% 75%, 92% 100%, 8% 100%, 0 75%, 0 25%)",
              }}
            >
              Join the journey
            </button>
          </div>
          </nav>

          <Image
  src="/video/poster.jpg"
  alt=""
  fill
  priority
  className="absolute inset-0 h-full w-full object-cover"
/>

<video
  ref={heroVideoRef}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/video/poster.jpg"
  onCanPlay={() => setHeroVideoReady(true)}
  onPlaying={() => setHeroVideoReady(true)}
  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
    heroVideoReady ? "opacity-100" : "opacity-0"
  }`}
>
  <source src="/video/video4.mp4" type="video/mp4" />
</video>

          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 top-0 z-[1] h-44 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-[1] h-44 bg-gradient-to-t from-black to-transparent" />

          <div
            ref={heroTitleWrapRef}
            className="relative z-10 text-center text-white uppercase"
          >
            <h1 className="text-[clamp(58px,17vw,190px)] leading-[0.84] tracking-[-0.05em]">
              Heartbeat
            </h1>
            <span
              className={`mt-5 block text-[clamp(10px,2.8vw,20px)] tracking-[0.45em] sm:tracking-[0.75em] lg:mt-8 lg:tracking-[0.95em] ${font2.className}`}
            >
              Die andere Seite
            </span>
          </div>

          <div
            ref={heroButtonWrapRef}
            className="absolute left-1/2 top-[69%] z-[100] w-full -translate-x-1/2 px-6 text-center sm:top-[73%] lg:top-[75.5%]"
          >
            <button
              ref={heroCtaRef}
              onClick={handleStoreTransition}
              disabled={isTransitioning}
              className={`${ibmPlexSerif.className} cursor-pointer border border-white/30 bg-black/20 px-7 py-3 text-[12px] tracking-[0.16em] text-white uppercase backdrop-blur-[2px] transition duration-300 hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] disabled:cursor-default sm:px-10 sm:py-4 sm:text-[15px]`}
            >
              Jetzt eintauchen
            </button>
          </div>

          <div
            ref={heroCaptionRef}
            className="absolute bottom-8 left-1/2 z-[2] w-full max-w-[320px] -translate-x-1/2 space-y-1.5 px-6 text-center text-[12px] leading-[1.2] tracking-[-0.03em] text-white uppercase sm:max-w-none sm:text-[16px] lg:top-[91.5%] lg:bottom-auto"
          >
            <p>Magie ist real. Vertrauen ist tödlich.</p>
            <p className="text-[12px]">Und Liebe kann dein Untergang sein.</p>
          </div>
        </section>
        
        <div id="world">
          <WorldIntroSection ibmPlexSerif={ibmPlexSerif} font2={font2} handleStoreTransition={handleStoreTransition} scrollToId={scrollToId} setOpen={setOpen} open={open}/>
        </div>

        <div id="map">
          <Map
            openLocation={openLocation}
            setAlbumLocation={setAlbumLocation}
            setOpenLocation={setOpenLocation}
          />
        </div>

        <AlbumLightbox
          isOpen={!!albumLocation}
          onClose={() => setAlbumLocation(null)}
          title={albumLocation ? `${albumLocation}` : ""}
          images={albumLocation ? albumImages[albumLocation] || [] : []}
        />

        <div id="characters">
        <Characters />
        </div>

        <section
          id="about"
          className="relative min-h-[100svh] overflow-hidden bg-[url('/bgauthor1.png')] bg-cover bg-center bg-no-repeat py-20 contrast-130 lg:h-screen lg:py-0"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[20] h-24 bg-gradient-to-b from-black to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[20] h-30 bg-gradient-to-t from-black to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 z-[20] hidden h-full w-[15%] bg-gradient-to-l from-black to-transparent lg:block" />
          <div className="pointer-events-none absolute top-0 left-0 z-[20] hidden h-full w-[15%] bg-gradient-to-r from-black to-transparent lg:block" />
          <div className="absolute inset-0 bg-black/35 lg:bg-black/0" />

          <div className="relative z-[25] mx-auto flex min-h-[100svh] w-full max-w-[1600px] items-center px-5 sm:px-8 lg:h-full lg:min-h-0 lg:px-0">
            <div className="pointer-events-none absolute left-1/2 -top-18 z-10 h-[73%] w-[115%] md:h-[60%] md:w-[190%] -translate-x-1/2 opacity-85 lg:left-auto lg:right-[-5%] lg:-top-4 lg:h-full lg:w-auto lg:translate-x-0 lg:scale-y-180 lg:opacity-100 3xl:-top-2">
  <Image
    src="/rippedpaper_colored3.png"
    alt=""
    width={900}
    height={900}
    className="h-full w-full object-cover contrast-200 lg:w-auto lg:max-w-[62.5vw] lg:object-contain"
  />
</div>

            <div className="relative z-[30] mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 lg:w-[75%] lg:grid-cols-2 lg:gap-[15%]">
              <div className="order-2 flex justify-center lg:order-1 lg:justify-self-end lg:translate-x-6 lg:translate-y-4 translate-y-6">
                <Image
                  src="/authorframe2.png"
                  alt="Author image"
                  width={400}
                  height={720}
                  className="h-auto w-[230px] object-contain brightness-110 contrast-75 sm:w-[300px] md:w-[340px] lg:w-[400px] xl:w-[430px]"
                />
              </div>

              <div className="order-1 relative z-[35] mx-auto w-full max-w-[640px] text-center text-white lg:order-2 lg:mx-0 lg:translate-x-[20%] lg:justify-self-start lg:text-left">
                <div className="mb-6 inline-flex rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur-sm lg:absolute lg:-top-12 lg:left-0 lg:mb-0">
                  <button
                    onClick={() => setAboutView("author")}
                    className={`z-[150] cursor-pointer rounded-full px-5 py-2 text-[12px] uppercase tracking-[0.18em] transition ${
                      aboutView === "author"
                        ? "bg-white text-black"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Author
                  </button>

                  <button
                    onClick={() => setAboutView("story")}
                    className={`z-[150] cursor-pointer rounded-full px-5 py-2 text-[12px] uppercase tracking-[0.18em] transition ${
                      aboutView === "story"
                        ? "bg-white text-black"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Story
                  </button>
                </div>

                <h2 className="text-[clamp(44px,13vw,70px)] leading-[0.92] tracking-[-0.05em]">
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
                    className="mt-8 lg:mt-2"
                  >
                    <div
                      className={`${ibmPlexSerif.className} mx-auto max-w-[600px] space-y-3 text-[15px] leading-[1.55] tracking-normal text-white/90 sm:text-[16px] lg:mx-0 lg:translate-y-4 lg:leading-[1.35]`}
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
        
        <div id="story">
        <StickyStorySection ibmPlexSerif={ibmPlexSerif} font2={font2} />
        </div>

        {/* <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center">
        <div
          className="absolute inset-0 bg-[url('/gaze.png')] bg-cover bg-center opacity-[1]"
          aria-hidden
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-[clamp(40px,6vw,108px)] leading-[1.02] uppercase text-white mb-8">
            Bist du bereit <br/> Für die andere Seite?
          </h2>
        </div>
      </section> */}
       <ReadySection font2={font2}/>
        
        <div id="store">
        <BookRevealSection
            ibmPlexSerif={ibmPlexSerif}
            font2={font2}
            handleStoreTransition={handleStoreTransition}
            isTransitioning={isTransitioning}
          />
        </div>
        
        <div id="footer">
        <Footer ibmPlexSerif={ibmPlexSerif} font2={font2} scrollToId={scrollToId} setOpen={setOpen} open={open}/>
        </div>
      </main>
    </>
  );
}