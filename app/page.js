"use client";

import Image from "next/image";
import "./globals.css";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import { useEffect, useState } from "react";
import AlbumLightbox from "./components/AlbumLightbox";
import CharacterCard from "./components/CharacterCard";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose what you need
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

  const handlePrevCharacter = () => {
  setCurrentCharacter((prev) => (prev - 1 + characters.length) % characters.length);
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
    <main className="overflow-x-hidden">
      <section className="relative h-screen flex items-center justify-center">
        <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center justify-between w-full max-w-[1320px] px-6">
          <h1 className="text-white uppercase text-[37px] tracking-[-5%] leading-[31px] cursor-pointer">
            Deevee
          </h1>
          <div>
            <ul
              className={`text-white flex gap-6.25 uppercase ${ibmPlexSerif.className} text-[14px] leading-[100%] tracking-[6%] ml-14`}
            >
              <li className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">Home</li>
              <li className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">The World</li>
              <li className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">Characters</li>
              <li className="cursor-pointer transition-colors duration-300 hover:text-[#FFD281]">About</li>
            </ul>
          </div>
          <button
            className={`text-white bg-amber-900 rounded-2xl py-2 px-3 text-[14px] uppercase ${ibmPlexSerif.className} font-medium cursor-pointer`}
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
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/video2.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent z-[1]" />

        <div className="relative z-10 text-center text-white uppercase">
          <h1 className="text-[190px] leading-[159px] tracking-[-5%]">
            Heartbeat
          </h1>
          <span
            className={`block text-[20px] tracking-[0.95em] ${font2.className} mt-8`}
          >
            Die andere Seite
          </span>
        </div>
        <button
          className={`${ibmPlexSerif.className}
          border border-white/30 bg-black/20 px-10 py-4 text-[15px]
          uppercase tracking-[0.18em] text-white
          backdrop-blur-[2px] transition duration-300
          hover:bg-white/10 hover:border-white/60
          hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] absolute left-1/2 -translate-x-1/2 top-[75.5%] z-100`}
        >
          Jetzt eintauchen
        </button>
        <div
          className="text-center absolute left-1/2 -translate-x-1/2 text-white top-[91.5%] text-[16px] uppercase tracking-[-3%] leading-[100%] space-y-1.5 z-2"
        >
          <p>Magie ist real. Vertrauen ist tödlich.</p>
          <p className="text-[12px]">Und Liebe kann dein Untergang sein.</p>
        </div>
      </section>
      {/* <section className="bg-black h-[15px] w-full">
      &nbsp;
    </section> */}
      <section className="relative bg-[url('/taletopia.png')] h-screen bg-cover bg-center bg-no-repeat text-center flex justify-center z-[2]">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent z-[1]" />
          <h1 className="text-[120px] leading-[119px] tracking-[-5%] text-white translate-y-[180px] w-[782px]">
            Eine neue Welt wartet auf dich.
          </h1>
        <div className="absolute top-[68.5%] flex flex-col items-center gap-5 z-10">
          <button
            className={`${ibmPlexSerif.className}
          border border-white/30 bg-black/20 px-10 py-4 text-[15px]
          uppercase tracking-[0.18em] text-white
          backdrop-blur-[2px] transition duration-300
          hover:bg-white/10 hover:border-white/60
          hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer`}
          >
            Enter the World
          </button>

          <button
            className={`${font2.className}
          inline-flex items-center gap-2 text-[14px] uppercase tracking-[0.28em]
          text-white/85 transition hover:bg-white/10 hover:border-white/60
            hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]
          transition duration-300 cursor-pointer`}
                    >
                      Jetzt eintauchen
          </button>
        </div>
      </section>
      <section className="relative bg-black pt-20">
        
        {openLocation === "taletopia" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setOpenLocation(null)}>
            <div className="relative w-full max-w-[900px] animate-[modalIn_0.35s_ease-out] overflow-hidden rounded-[24px] border border-amber-200/20 bg-[#1a120d] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenLocation(null)}
                className="absolute right-5 top-5 z-10 text-white/70 transition hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px]">
                  <Image
                    src="/taletopia.png"
                    alt="Taletopia"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2
                      className={`uppercase text-5xl text-white`}
                    >
                      Taletopia
                    </h2>
                    <p
                      className={`${font2.className} mt-2 uppercase tracking-[0.25em] text-white/80`}
                    >
                      Wonderous City of the Fairies
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Lore</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Taletopia ist die Stadt der Feen und gilt als ihr Herz. Die Stadt liegt auf einem Hügel und wird von einem großen Schloss überragt. Ein Wasserfall fließt mitten durch die Stadt und fließt den Fluss, der durch die vielen Häuser und Brücken führt.
                    Überall ist es ruhig und harmonisch. Es gibt wunderschöne Märkte und die Natur ist magisch.
                    Regiert wird Taletopia von einem König, der über das Gleichgewicht der Feen und der anderen Seite wacht.
                                      </p>

                  {/* <div className="mt-8">
                    <h4 className={`${ibmPlexSerif.className} text-xl`}>
                      Highlights
                    </h4>
                    <ul
                      className={`${font2.className} mt-4 space-y-3 text-white/80 normal-case`}
                    >
                      <li>• The great lake of mirrored skies</li>
                      <li>• Ruins hidden beneath the forest veil</li>
                      <li>• Castle roads watched by forgotten magic</li>
                    </ul>
                  </div> */}

                  <div className="mt-8 flex gap-4">
                    <button
                      className={`${ibmPlexSerif.className} border border-white/30 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-white/15 cursor-pointer`}     
                      onClick={() => {
                        setOpenLocation(null);
                        setAlbumLocation("taletopia");
                      }}
                    >
                      View Album
                    </button>
                    {/* <button
                      className={`${ibmPlexSerif.className} border border-amber-300/30 bg-amber-700/40 px-6 py-3 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-amber-600/50`}
                    >
                      Learn More
                    </button> */}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}

        {openLocation === "erzklamm" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setOpenLocation(null)}>
            <div className="relative w-full max-w-[900px] animate-[modalIn_0.35s_ease-out] overflow-hidden rounded-[24px] border border-amber-200/20 bg-[#1a120d] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenLocation(null)}
                className="absolute right-5 top-5 z-10 text-white/70 transition hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px]">
                  <Image
                    src="/erzklamm.jpg"
                    alt="Erzklamm"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2
                      className={`uppercase text-5xl text-white`}
                    >
                      Erzklamm
                    </h2>
                    <p
                      className={`${font2.className} mt-2 uppercase tracking-[0.25em] text-white/80`}
                    >
                      Mountain City of Dwarvenkind
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Lore</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Taletopia was once a peaceful land of stories, music, and
                    old magic. Beneath its beauty, however, ancient forces stir
                    again, threatening to drag its people into a fate they
                    cannot outrun.
                  </p>

                  <div className="mt-8">
                    <h4 className={`${ibmPlexSerif.className} text-xl`}>
                      Highlights
                    </h4>
                    <ul
                      className={`${font2.className} mt-4 space-y-3 text-white/80 normal-case`}
                    >
                      <li>• The great lake of mirrored skies</li>
                      <li>• Ruins hidden beneath the forest veil</li>
                      <li>• Castle roads watched by forgotten magic</li>
                    </ul>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      className={`${ibmPlexSerif.className} border border-white/30 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-white/15 cursor-pointer`}
                      onClick={() => {
                        setOpenLocation(null);
                        setAlbumLocation("erzklamm");
                      }}
                    >
                      View Album
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}

        {openLocation === "eldarun" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
           onClick={() => setOpenLocation(null)}>
            <div className="relative w-full max-w-[900px] animate-[modalIn_0.35s_ease-out] overflow-hidden rounded-[24px] border border-amber-200/20 bg-[#1a120d] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenLocation(null)}
                className="absolute right-5 top-5 z-10 text-white/70 transition hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px]">
                  <Image
                    src="/eldarun.jpg"
                    alt="Eldarun"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2
                      className={`uppercase text-5xl text-white`}
                    >
                      Eldarun
                    </h2>
                    <p
                      className={`${font2.className} mt-2 uppercase tracking-[0.25em] text-white/80`}
                    >
                      Hidden City of the Elves
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Lore</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Taletopia was once a peaceful land of stories, music, and
                    old magic. Beneath its beauty, however, ancient forces stir
                    again, threatening to drag its people into a fate they
                    cannot outrun.
                  </p>

                  <div className="mt-8">
                    <h4 className={`${ibmPlexSerif.className} text-xl`}>
                      Highlights
                    </h4>
                    <ul
                      className={`${font2.className} mt-4 space-y-3 text-white/80 normal-case`}
                    >
                      <li>• The great lake of mirrored skies</li>
                      <li>• Ruins hidden beneath the forest veil</li>
                      <li>• Castle roads watched by forgotten magic</li>
                    </ul>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      className={`${ibmPlexSerif.className} border border-white/30 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-white/15 cursor-pointer`}
                      onClick={() => {
                        setOpenLocation(null);
                        setAlbumLocation("eldarun");
                      }}
                    >
                      View Album
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}

        {openLocation === "witraliria" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setOpenLocation(null)}>
            <div className="relative w-full max-w-[900px] animate-[modalIn_0.35s_ease-out] overflow-hidden rounded-[24px] border border-amber-200/20 bg-[#1a120d] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
             onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenLocation(null)}
                className="absolute right-5 top-5 z-10 text-white/70 transition hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px] bg-[url('/witraliria.jpeg')] bg-cover bg-center bg-no-repeat bg-top">
                  {/* <Image
                    src="/witraliria.jpeg"
                    alt="Witraliria"
                    fill
                    className="object-cover scale-90"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2
                      className={`text-5xl text-white uppercase`}
                    >
                      Witraliria
                    </h2>
                    <p
                      className={`${font2.className} mt-2 uppercase tracking-[0.25em] text-white/80`}
                    >
                      Magical City of the Witches
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Lore</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Taletopia was once a peaceful land of stories, music, and
                    old magic. Beneath its beauty, however, ancient forces stir
                    again, threatening to drag its people into a fate they
                    cannot outrun.
                  </p>

                  <div className="mt-8">
                    <h4 className={`${ibmPlexSerif.className} text-xl`}>
                      Highlights
                    </h4>
                    <ul
                      className={`${font2.className} mt-4 space-y-3 text-white/80 normal-case`}
                    >
                      <li>• The great lake of mirrored skies</li>
                      <li>• Ruins hidden beneath the forest veil</li>
                      <li>• Castle roads watched by forgotten magic</li>
                    </ul>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      className={`${ibmPlexSerif.className} border border-white/30 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-white/15 cursor-pointer`}
                      onClick={() => {
                        setOpenLocation(null);
                        setAlbumLocation("witraliria");
                      }}
                    >
                      View Album
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}

        {openLocation === "aridryan" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setOpenLocation(null)}>
            <div className="relative w-full max-w-[900px] animate-[modalIn_0.35s_ease-out] overflow-hidden rounded-[24px] border border-amber-200/20 bg-[#1a120d] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenLocation(null)}
                className="absolute right-5 top-5 z-10 text-white/70 transition hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px]">
                  <Image
                    src="/aridryan.jpg"
                    alt="Aridryan"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2
                      className={`text-5xl text-white uppercase`}
                    >
                      Aridryan
                    </h2>
                    <p
                      className={`${font2.className} mt-2 uppercase tracking-[0.25em] text-white/80`}
                    >
                      Lush City of the Dryads
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Lore</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Taletopia was once a peaceful land of stories, music, and
                    old magic. Beneath its beauty, however, ancient forces stir
                    again, threatening to drag its people into a fate they
                    cannot outrun.
                  </p>

                  <div className="mt-8">
                    <h4 className={`${ibmPlexSerif.className} text-xl`}>
                      Highlights
                    </h4>
                    <ul
                      className={`${font2.className} mt-4 space-y-3 text-white/80 normal-case`}
                    >
                      <li>• The great lake of mirrored skies</li>
                      <li>• Ruins hidden beneath the forest veil</li>
                      <li>• Castle roads watched by forgotten magic</li>
                    </ul>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      className={`${ibmPlexSerif.className} border border-white/30 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-white/15 cursor-pointer`}
                      onClick={() => {
                        setOpenLocation(null);
                        setAlbumLocation("aridryan");
                      }}
                    >
                      View Album
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}

        {openLocation === "dammerfels" && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setOpenLocation(null)}>
            <div className="relative w-full max-w-[900px] animate-[modalIn_0.35s_ease-out] overflow-hidden rounded-[24px] border border-amber-200/20 bg-[#1a120d] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenLocation(null)}
                className="absolute right-5 top-5 z-10 text-white/70 transition hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px]">
                  <Image
                    src="/dammerfels.jpeg"
                    alt="Dämmerfels"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2
                      className={`uppercase text-5xl text-white uppercase`}
                    >
                      Dämmerfels
                    </h2>
                    <p
                      className={`${font2.className} mt-2 uppercase tracking-[0.25em] text-white/80`}
                    >
                      Castle of the Vampires
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Lore</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Taletopia was once a peaceful land of stories, music, and
                    old magic. Beneath its beauty, however, ancient forces stir
                    again, threatening to drag its people into a fate they
                    cannot outrun.
                  </p>

                  <div className="mt-8">
                    <h4 className={`${ibmPlexSerif.className} text-xl`}>
                      Highlights
                    </h4>
                    <ul
                      className={`${font2.className} mt-4 space-y-3 text-white/80 normal-case`}
                    >
                      <li>• The great lake of mirrored skies</li>
                      <li>• Ruins hidden beneath the forest veil</li>
                      <li>• Castle roads watched by forgotten magic</li>
                    </ul>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      className={`${ibmPlexSerif.className} border border-white/30 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-white/15 cursor-pointer`}
                      onClick={() => {
                        setOpenLocation(null);
                        setAlbumLocation("dammerfels");
                      }}
                    >
                      View Album
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto w-full max-w-[1440px]">
          <div className="relative overflow-auto">
            <div className="relative h-[900px] w-[1440px]">
              <Image
                src="/map.jpeg"
                alt="Fantasy world map"
                fill
                className="object-cover"
                priority
              />

              <button
                className="group absolute left-[7%] top-[46%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
                onClick={() => setOpenLocation("taletopia")}
              >
                <div className="relative h-[44px] w-[193px] transition duration-100 group-hover:scale-105">
                  <Image
                    src="/scroll-plate.svg"
                    alt=""
                    fill
                    className="object-contain transition duration-100 group-hover:brightness-110"
                  />

                  <span className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#2b1605] transition duration-100">
                    View Taletopia
                  </span>
                </div>
              </button>

              <div className="group absolute left-[20%] top-[12.5%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
               onClick={() => setOpenLocation("witraliria")}>
                <div className="relative h-[44px] w-[193px] transition duration-300 group-hover:scale-105">
                  <Image
                    src="/scroll-plate.svg"
                    alt=""
                    fill
                    className="object-contain transition duration-300 group-hover:brightness-110"
                  />

                  <span className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#2b1605] transition duration-300">
                    View Witraliria
                  </span>
                </div>
              </div>

              <div className="group absolute left-[9%] top-[78%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
              onClick={() => setOpenLocation("erzklamm")}>
                <div className="relative h-[44px] w-[193px] transition duration-300 group-hover:scale-105">
                  <Image
                    src="/scroll-plate.svg"
                    alt=""
                    fill
                    className="object-contain transition duration-300 group-hover:brightness-110"
                  />

                  <span className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#2b1605] transition duration-300">
                    View Erzklamm
                  </span>
                </div>
              </div>

              <div className="group absolute left-[34%] top-[66.5%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
              onClick={() => setOpenLocation("eldarun")}>
                <div className="relative h-[44px] w-[193px] transition duration-300 group-hover:scale-105">
                  <Image
                    src="/scroll-plate.svg"
                    alt=""
                    fill
                    className="object-contain transition duration-300 group-hover:brightness-110"
                  />

                  <span className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#2b1605] transition duration-300">
                    View Eldarun
                  </span>
                </div>
              </div>

              <div className="group absolute left-[72%] top-[79%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
              onClick={() => setOpenLocation("dammerfels")}>
                <div className="relative h-[44px] w-[193px] transition duration-300 group-hover:scale-105">
                  <Image
                    src="/scroll-plate.svg"
                    alt=""
                    fill
                    className="object-contain transition duration-300 group-hover:brightness-110"
                  />

                  <span className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#2b1605] transition duration-300">
                    View Dämmerfels
                  </span>
                </div>
              </div>

              <div className="group absolute left-[68%] top-[8%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
              onClick={() => setOpenLocation("aridryan")}>
                <div className="relative h-[44px] w-[193px] transition duration-300 group-hover:scale-105">
                  <Image
                    src="/scroll-plate.svg"
                    alt=""
                    fill
                    className="object-contain transition duration-300 group-hover:brightness-110"
                  />

                  <span className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#2b1605] transition duration-300">
                    View Aridryan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AlbumLightbox
        isOpen={!!albumLocation}
        onClose={() => setAlbumLocation(null)}
        title={albumLocation ? `${albumLocation} album` : ""}
        images={albumLocation ? albumImages[albumLocation] || [] : []}
      />
     <section className="bg-[#1A0C01] relative pt-14 pb-40 min-h-screen">
        <div className="text-white flex max-w-[1320px] mx-auto justify-between items-center border-t-1 border-b-1 border-[#4e4318]">
          <h2 className="text-[40px] leading-[119px] tracking-[-5%]">Meet The Characters</h2>
           <div className="flex items-center gap-3 translate-y-9">
  <button
    onClick={handlePrevCharacter}
    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 mb-16"
    aria-label="Previous character"
  >
    ←
  </button>

  <button
    onClick={handleNextCharacter}
    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 mb-16"
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
<div className="absolute inset-x-0 bottom-0 h-50 bg-gradient-to-t from-black to-transparent z-[1]" />
      
      </section>
      <section className="relative h-[2062px] overflow-hidden bg-[#1A0C01] z-10">

        <div className="absolute inset-0 bg-black/40 z-2" />
        <div className="absolute inset-0">
    <Image
      src="/bgauthor.png"
      alt="About the story background"
      fill
      priority
      className="object-cover object-center"
    />
  </div>
  {/* <div className="absolute top-0 right-0">
    <Image
      src="/rippedpaper.png"
      alt="About the story background"
      fill
      priority
      className="object-cover object-center opacity-[87%]"
    />
  </div> */}

  <div className="absolute inset-0 bg-black/20" />
  <div className="absolute inset-x-0 top-0 h-50 bg-gradient-to-b from-black to-transparent z-[1]" />
  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent z-[1]" />

      <Image 
      src="/g39.svg"
      alt="authorbg"
      width={450}
      height={700}
      className="absolute top-[220px] left-[180px]"
      />
      <div className="absolute top-[270px] right-[150px] z-100 w-[506px] space-y-16">
        <h1 className="text-white uppercase text-[80px] leading-[80px] tracking-[-5%]">About The Author</h1>
        <p className={`text-white ${ibmPlexSerif.className} text-[18px]`}>
          Deevee ist Autorin im Genre Dark Romantasy und Romantasy und erschafft Geschichten, in denen sich Liebe und Dunkelheit auf faszinierende Weise begegnen. 
          Schon seit ihrem 14. Lebensjahr widmet sie sich dem Schreiben und hat seither ihre Leidenschaft für das Erzählen intensiver, emotionaler und geheimnisvoller Welten stetig vertieft. Ihre Geschichten laden Leserinnen und Leser dazu ein, in neue magische Welten einzutauchen, in denen nichts ganz so ist, wie es scheint.
          Wenn sie nicht schreibt, sammelt Deevee neue Inspirationen für ihre nächsten Projekte und ist immer auf der Suche nach Geschichten, die berühren, fesseln und lange im Gedächtnis bleiben.</p>
      </div>
    

  <div className="relative z-10">
    &nbsp;
  </div>
</section>
    </main>
  );
}
