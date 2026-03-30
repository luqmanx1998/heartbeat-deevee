import Image from "next/image";
import "../globals.css";

function CharacterCard({ name, image, isActive }) {
  return (
    <div
      className={`relative h-[490px] min-w-[340px] overflow-hidden rounded-[28px] transition duration-500 ${
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"
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
