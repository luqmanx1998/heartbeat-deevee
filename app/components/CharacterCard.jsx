import Image from "next/image";
import "../globals.css";
import { IBM_Plex_Serif } from "next/font/google";
import localFont from "next/font/local";

// const ibmPlexSerif = IBM_Plex_Serif({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const segamoriz = localFont({
//   src: "../fonts/Segamoriz.woff2",
// });

// const font2 = localFont({
//   src: "../fonts/NeueMontreal-Regular.woff2",
// });


function CharacterCard({ name, image, isActive }) {
  return (
    <div
      className={`relative h-[490px] min-w-[340px] overflow-hidden rounded-[28px] transition duration-500 ${
        isActive ? "scale-100 opacity-100 shadow-[0px_-30px_80px_-40px_rgba(239,217,131,0.85)]" : "scale-95 opacity-70"
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
  <div className="relative w-[137px] h-[50px]">
    <Image 
      src="/name.svg"
      alt="nametag"
      fill
      className="object-contain"
    />

    <span className="absolute inset-0 translate-y-1 flex items-center justify-center text-black text-[20px] font-medium leading-[119px] tracking-[-5%]">
      {name}
    </span>
  </div>
</div>
    </div>
  );
}

export default CharacterCard;
