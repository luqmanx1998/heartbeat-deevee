import Image from "next/image";
import { IBM_Plex_Serif } from "next/font/google";
import localFont from "next/font/local";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// const segamoriz = localFont({
//   src: "../fonts/Segamoriz.woff2",
// });

const font2 = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
});

function Map( { openLocation, setAlbumLocation, setOpenLocation }) {
  return <section className="relative bg-black pt-20">
        
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
                      Die märchenhafte Stadt der Feen
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Über die Stadt
</h3>
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
                      Bergstadt des Zwergenvolkes
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Über die Stadt
</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                   
Erzklamm ist die Stadt der Zwerge und liegt tief verborgen in einem riesigen Berg. Die Stadt erstreckt sich durch gewaltige Höhlen, verbunden durch Brücken, Tunnel und Wasserläufe.
Überall arbeiten Zwerge an Kristallen, Erz und Stein. Feuerstellen und Schmieden leuchten in der Dunkelheit.
Die Zwerge sind fleißig, aber auch vorsichtig. Fremden begegnen sie mit Misstrauen und halten sich lieber unter sich.

                  </p>


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
                      Die leuchtende Stadt der Elfen
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>
Über die Stadt</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Eldarun ist die Stadt der Elfen und von einer riesigen Mauer umgeben, die seit tausenden Jahren steht. Deshalb nennt man sie auch „die Stadt, die niemals fällt“.
Die Stadt ist geprägt von hohen, eleganten Gebäuden und einem großen Schloss im Zentrum.
Elfen halten sich für überlegen und bleiben meist unter sich. Fremden begegnen sie kühl und abweisend.
                  </p>


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
                      Die magische Stadt der Hexen
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Über die Stadt</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    
Witraliria ist die Stadt der Hexen und Hexenmeister. Sie liegt auf einem Hügel und ist von Wasserfällen und Flüssen umgeben.
Die Stadt ist lebendig und offen. Neben Hexen leben auch viele andere Wesen hier friedlich zusammen.
Hexen halten sich meist aus Konflikten heraus und bleiben neutral.
                  </p>


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
                    src="/aridryan2.png"
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
                      Die blühende Stadt der Dryaden
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Über die Stadt</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Aridryan ist die Stadt der Dryaden und von blühenden Gärten und Wasserfällen umgeben.
Dort leben nur Frauen, ein eigentlich friedliches Volk, das eng mit der Natur verbunden ist.
Die Königin jedoch gilt als unberechenbar. Sie hasst die Feen und lässt fremde Späher oft verfolgen oder töten.
                  </p>


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
                      Das Schloss der Vampire
                    </p>
                  </div>
                </div>

                <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
                  <h3 className={`${ibmPlexSerif.className} text-2xl`}>Über die Stadt</h3>

                  <p
                    className={`${font2.className} mt-4 text-[15px] leading-7 text-white/85 normal-case`}
                  >
                    Dämmerfels ist die Stadt der Vampire und liegt im verbotenen Distrikt, eingeschlossen von einer magischen Mauer.
Die Stadt besteht aus einer düsteren Burg hoch auf einem Felsen, umgeben von Nebel und toten Wäldern.
Vampire leben zurückgezogen und gefährlich. Fremde verirren sich selten hierher und noch seltener kehren sie zurück.
                  </p>

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
          <div className="relative w-full max-w-[1440px]">
            <div className="relative w-full max-w-[1440px] aspect-[16/10]">
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
              <div className="absolute inset-0 z-10 flex items-center justify-center transform-gpu">
                <span className="text-[14px] font-semibold text-[#2b1605] transition duration-100">
                  View Taletopia
                </span>
              </div>
              <Image
                src="/scroll-plate.svg"
                alt=""
                fill
                className="object-contain transition duration-100 group-hover:brightness-110"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </button>

              <button
            className="group absolute left-[20%] top-[13%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
            onClick={() => setOpenLocation("witraliria")}
          >
            <div className="relative h-[44px] w-[193px] transition duration-100 group-hover:scale-105">
              <div className="absolute inset-0 z-10 flex items-center justify-center transform-gpu">
                <span className="text-[14px] font-semibold text-[#2b1605] transition duration-100">
                  View Witraliria
                </span>
              </div>
              <Image
                src="/scroll-plate.svg"
                alt=""
                fill
                className="object-contain transition duration-100 group-hover:brightness-110"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </button>

              <button
            className="group absolute left-[9%] top-[78%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
            onClick={() => setOpenLocation("erzklamm")}
          >
            <div className="relative h-[44px] w-[193px] transition duration-100 group-hover:scale-105">
              <div className="absolute inset-0 z-10 flex items-center justify-center transform-gpu">
                <span className="text-[14px] font-semibold text-[#2b1605] transition duration-100">
                  View Erzklamm
                </span>
              </div>
              <Image
                src="/scroll-plate.svg"
                alt=""
                fill
                className="object-contain transition duration-100 group-hover:brightness-110"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </button>


              <button
            className="group absolute left-[34%] top-[67%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
            onClick={() => setOpenLocation("eldarun")}
          >
            <div className="relative h-[44px] w-[193px] transition duration-100 group-hover:scale-105">
              <div className="absolute inset-0 z-10 flex items-center justify-center transform-gpu">
                <span className="text-[14px] font-semibold text-[#2b1605] transition duration-100">
                  View Eldarun
                </span>
              </div>
              <Image
                src="/scroll-plate.svg"
                alt=""
                fill
                className="object-contain transition duration-100 group-hover:brightness-110"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </button>


              <button
            className="group absolute left-[72%] top-[79.5%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
            onClick={() => setOpenLocation("dammerfels")}
          >
            <div className="relative h-[44px] w-[193px] transition duration-100 group-hover:scale-105">
              <div className="absolute inset-0 z-10 flex items-center justify-center transform-gpu">
                <span className="text-[14px] font-semibold text-[#2b1605] transition duration-100">
                  View Dämmerfels
                </span>
              </div>
              <Image
                src="/scroll-plate.svg"
                alt=""
                fill
                className="object-contain transition duration-100 group-hover:brightness-110"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </button>


              <button
            className="group absolute left-[68%] top-[8%] cursor-pointer animate-[float_3s_ease-in-out_infinite]"
            onClick={() => setOpenLocation("aridryan")}
          >
            <div className="relative h-[44px] w-[193px] transition duration-100 group-hover:scale-105">
              <div className="absolute inset-0 z-10 flex items-center justify-center transform-gpu">
                <span className="text-[14px] font-semibold text-[#2b1605] transition duration-100">
                  View Aridryan
                </span>
              </div>
              <Image
                src="/scroll-plate.svg"
                alt=""
                fill
                className="object-contain transition duration-100 group-hover:brightness-110"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </button>
            </div>
          </div>
        </div>
      </section>
}

export default Map
