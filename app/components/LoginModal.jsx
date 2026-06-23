import Image from "next/image"
import { createClient } from "../lib/supabase/client";

function LoginModal({ ibmPlexSerif, font2, setShowLoginModal, showLoginModal }) {

const handleOAuthLogin = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login failed:", error.message);
    }
  };

  return (
    <div
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
        onClick={() => setShowLoginModal(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(18,18,22,0.96),rgba(10,10,12,0.96))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(132,33,64,0.14),transparent_22%)]" />
    
          <button
            onClick={() => setShowLoginModal(false)}
            className={`${font2.className} absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white cursor-pointer z-20`}
            aria-label="Close login modal"
          >
            ✕
          </button>
    
          <div className="relative z-10">
            <p
              className={`${font2.className} text-[11px] uppercase tracking-[0.3em] text-[#f1d3a5]/65`}
            >
              Account
            </p>
    
            <h2
              className={`${ibmPlexSerif.className} mt-4 text-3xl leading-[1.02] text-white`}
            >
              Willkommen zurück
            </h2>
    
            <p
              className={`${ibmPlexSerif.className} mt-3 text-[17px] leading-[1.6] text-white/74`}
            >
              Melde dich an, um zukünftige Bestellungen einfacher zu verwalten.
            </p>
    
            <div className="mt-8 flex flex-col gap-3">
              <button
              onClick={handleOAuthLogin}
                className={`${font2.className} inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/12 bg-white px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-black transition duration-300 hover:-translate-y-[1px] hover:bg-[#f7f1e7]`}
              >
                <Image
                  src="/google-icon-logo-svgrepo-com.svg"
                  alt="Google"
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px]"
                />
                Mit Google anmelden
              </button>
    
              {/* <button
                className={`${font2.className} inline-flex w-full items-center justify-center rounded-full border border-[#f3d4a2]/22 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white transition duration-300 hover:-translate-y-[1px] hover:border-[#f3d4a2]/38 hover:bg-white/[0.08] hover:text-[#fff4de]`}
              >
                Mit E-Mail anmelden
              </button> */}
            </div>
    
            <p
              className={`${font2.className} mt-5 text-center text-[10px] uppercase tracking-[0.2em] text-white/38`}
            >
              Sicherer Login für Deevee Leser:innen
            </p>
          </div>
        </div>
      </div>
  )
}

export default LoginModal
