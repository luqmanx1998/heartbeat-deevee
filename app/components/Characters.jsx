import { useEffect, useState } from "react";
import CharacterCard from "./CharacterCard"


function Characters() {
     const [currentCharacter, setCurrentCharacter] = useState(0);

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
      image: "/characters/livmia.jpg",
    },
    {
      name: "Zac",
      image: "/characters/zac.jpg",
    },
    {
      name: "Chloe",
      image: "/characters/chloe.jpg",
    },
    {
      name: "Sofia",
      image: "/characters/sofia.jpg",
    },
  ];


    const visibleCharacters = [
    ...characters.slice(currentCharacter),
    ...characters.slice(0, currentCharacter),
  ];


  return (
    <section className="relative min-h-screen bg-[#1A0C01] pt-14 pb-20">
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
          <div className="mt-10">
            <div className="flex justify-center gap-6 transition-transform duration-500 ease-in-out">
              {visibleCharacters.map((char, index) => (
                <CharacterCard
                  key={char.name}
                  name={char.name}
                  image={char.image}
                  isActive={index === 3}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-[1] h-30 bg-gradient-to-t from-black to-transparent" />
        </section>
  )
}

export default Characters
