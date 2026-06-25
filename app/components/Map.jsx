import Image from "next/image";
import { IBM_Plex_Serif } from "next/font/google";
import localFont from "next/font/local";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const font2 = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
});

function MapButton({ className, label, onClick }) {
  return (
    <button
      className={`group absolute z-20 cursor-pointer animate-[float_3s_ease-in-out_infinite] ${className}`}
      onClick={onClick}
    >
      {/* Mobile / tablet CSS button */}
      <div className="flex h-[22px] min-w-[96px] items-center justify-center rounded-full border border-[#c79c52]/70 bg-[#e7c982]/90 px-3 shadow-[0_6px_16px_rgba(0,0,0,0.35)] backdrop-blur-sm md:h-[34px] md:min-w-[120px] lg:hidden">
        <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.04em] text-[#2b1605] md:text-[11px]">
          {label}
        </span>
      </div>

      {/* Desktop original SVG button */}
      <div className="relative hidden h-[44px] w-[193px] transition duration-100 group-hover:scale-105 lg:block">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="text-[14px] font-semibold text-[#2b1605] transition duration-100">
            {label}
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
  );
}

function LocationModal({
  location,
  image,
  title,
  subtitle,
  description,
  albumKey,
  setOpenLocation,
  setAlbumLocation,
  imageClassName = "object-cover",
  gridClassName = "md:grid-cols-[1.1fr_0.9fr]",
  maxWidthClassName = "max-w-[900px]",
}) {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      onClick={() => setOpenLocation(null)}
    >
      <div
        className={`relative w-full ${maxWidthClassName} animate-[modalIn_0.35s_ease-out] overflow-hidden rounded-[24px] border border-amber-200/20 bg-[#1a120d] shadow-[0_20px_80px_rgba(0,0,0,0.6)] scale-80 lg:scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpenLocation(null)}
          className="absolute right-5 top-5 z-10 cursor-pointer text-white/70 transition hover:text-white"
        >
          ✕
        </button>

        <div className={`grid ${gridClassName}`}>
          <div className="relative min-h-[320px]">
            {image ? (
              <Image src={image} alt={title} fill className={imageClassName} />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-6 left-6">
              <h2 className="text-5xl uppercase text-white">{title}</h2>
              <p
                className={`${font2.className} mt-2 uppercase tracking-[0.25em] text-white/80`}
              >
                {subtitle}
              </p>
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,#2d1c12_0%,#1c120d_100%)] p-8 text-white">
            <h3 className={`${ibmPlexSerif.className} text-2xl`}>
              Über die Stadt
            </h3>

            <p
              className={`${font2.className} mt-4 whitespace-pre-line text-[15px] leading-7 text-white/85 normal-case`}
            >
              {description}
            </p>

            <div className="mt-8 flex gap-4">
              <button
                className={`${ibmPlexSerif.className} cursor-pointer border border-white/30 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-white/15`}
                onClick={() => {
                  setOpenLocation(null);
                  setAlbumLocation(albumKey);
                }}
              >
                View Album
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Map({ openLocation, setAlbumLocation, setOpenLocation }) {
  return (
    <section className="relative bg-black pt-20">
      {openLocation === "taletopia" && (
        <LocationModal
          title="Taletopia"
          subtitle="Die märchenhafte Stadt der Feen"
          image="/taletopia.png"
          albumKey="taletopia"
          setOpenLocation={setOpenLocation}
          setAlbumLocation={setAlbumLocation}
          description={`Taletopia ist die Stadt der Feen und gilt als ihr Herz. Die Stadt liegt auf einem Hügel und wird von einem großen Schloss überragt. Ein Wasserfall fließt mitten durch die Stadt und fließt den Fluss, der durch die vielen Häuser und Brücken führt.
Überall ist es ruhig und harmonisch. Es gibt wunderschöne Märkte und die Natur ist magisch.
Regiert wird Taletopia von einem König, der über das Gleichgewicht der Feen und der anderen Seite wacht.`}
        />
      )}

      {openLocation === "erzklamm" && (
        <LocationModal
          title="Erzklamm"
          subtitle="Bergstadt des Zwergenvolkes"
          image="/erzklamm.jpg"
          albumKey="erzklamm"
          setOpenLocation={setOpenLocation}
          setAlbumLocation={setAlbumLocation}
          description={`Erzklamm ist die Stadt der Zwerge und liegt tief verborgen in einem riesigen Berg. Die Stadt erstreckt sich durch gewaltige Höhlen, verbunden durch Brücken, Tunnel und Wasserläufe.
Überall arbeiten Zwerge an Kristallen, Erz und Stein. Feuerstellen und Schmieden leuchten in der Dunkelheit.
Die Zwerge sind fleißig, aber auch vorsichtig. Fremden begegnen sie mit Misstrauen und halten sich lieber unter sich.`}
        />
      )}

      {openLocation === "eldarun" && (
        <LocationModal
          title="Eldarun"
          subtitle="Die leuchtende Stadt der Elfen"
          image="/eldarun.jpg"
          albumKey="eldarun"
          setOpenLocation={setOpenLocation}
          setAlbumLocation={setAlbumLocation}
          description={`Eldarun ist die Stadt der Elfen und von einer riesigen Mauer umgeben, die seit tausenden Jahren steht. Deshalb nennt man sie auch „die Stadt, die niemals fällt“.
Die Stadt ist geprägt von hohen, eleganten Gebäuden und einem großen Schloss im Zentrum.
Elfen halten sich für überlegen und bleiben meist unter sich. Fremden begegnen sie kühl und abweisend.`}
        />
      )}

      {openLocation === "witraliria" && (
        <LocationModal
          title="Witraliria"
          subtitle="Die magische Stadt der Hexen"
          image="/witraliria.jpeg"
          albumKey="witraliria"
          setOpenLocation={setOpenLocation}
          setAlbumLocation={setAlbumLocation}
          imageClassName="object-cover object-top"
          description={`Witraliria ist die Stadt der Hexen und Hexenmeister.
            Sie liegt auf einem Hügel und ist von Wasserfällen und Flüssen umgeben.
            Neben Hexen leben auch viele andere Wesen hier friedlich zusammen.
            Hexen halten sich meist aus Konflikten heraus und
            bleiben neutral.`}
        />
      )}

      {openLocation === "aridryan" && (
        <LocationModal
          title="Aridryan"
          subtitle="Die blühende Stadt der Dryaden"
          image="/aridryan2.png"
          albumKey="aridryan"
          setOpenLocation={setOpenLocation}
          setAlbumLocation={setAlbumLocation}
          description={`Aridryan ist die Stadt der Dryaden und von blühenden Gärten und Wasserfällen umgeben.
Dort leben nur Frauen, ein eigentlich friedliches Volk, das eng mit der Natur verbunden ist.
Die Königin jedoch gilt als unberechenbar. Sie hasst die Feen und lässt fremde Späher oft verfolgen oder töten.`}
        />
      )}

      {openLocation === "dammerfels" && (
        <LocationModal
          title="Dämmerfels"
          subtitle="Das Schloss der Vampire"
          image="/dammerfels.jpeg"
          albumKey="dammerfels"
          setOpenLocation={setOpenLocation}
          setAlbumLocation={setAlbumLocation}
          gridClassName="md:grid-cols-[0.9fr_1.1fr]"
          maxWidthClassName="lg:max-w-[800px]"
          description={`Dämmerfels ist die Stadt der Vampire und liegt im verbotenen Distrikt, eingeschlossen von einer magischen Mauer.
          Die Stadt besteht aus einer düsteren Burg hoch auf einem Felsen, umgeben von Nebel und toten Wäldern.
          Fremde verirren sich selten hierher und noch seltener kehren sie zurück.`}
                  />
      )}

      <div className="mx-auto w-full max-w-[1440px]">
        <div className="relative w-full max-w-[1440px]">
          <div className="relative aspect-[16/10] w-full max-w-[1440px]">
            <Image
              src="/map.jpeg"
              alt="Fantasy world map"
              fill
              className="object-cover"
              priority
            />

            <MapButton
              label="View Taletopia"
              className="left-[1%] top-[57.5%] md:left-[6%] md:top-[57%] lg:left-[7%] lg:top-[46%]"
              onClick={() => setOpenLocation("taletopia")}
            />

            <MapButton
              label="View Witraliria"
              className="left-[14%] top-[14.5%] md:left-[19%] md:top-[13%] lg:left-[20%] lg:top-[13%]"
              onClick={() => setOpenLocation("witraliria")}
            />

            <MapButton
              label="View Erzklamm"
              className="left-[4%] top-[90%] md:left-[8%] md:top-[89%] lg:left-[9%] lg:top-[78%]"
              onClick={() => setOpenLocation("erzklamm")}
            />

            <MapButton
              label="View Eldarun"
              className="left-[29.5%] top-[79%] md:left-[33%] md:top-[78%] lg:left-[34%] lg:top-[67%]"
              onClick={() => setOpenLocation("eldarun")}
            />

            <MapButton
              label="View Dämmerfels"
              className="left-[66%] top-[91%] md:left-[71%] md:top-[90%] lg:left-[72%] lg:top-[79.5%]"
              onClick={() => setOpenLocation("dammerfels")}
            />

            <MapButton
              label="View Aridryan"
              className="left-[63%] top-[10%] md:left-[66.5%] md:top-[8.5%] lg:left-[68%] lg:top-[8%]"
              onClick={() => setOpenLocation("aridryan")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Map;