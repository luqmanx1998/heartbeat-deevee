"use client";

import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
import LoginModal from "../components/LoginModal";
import { createClient } from "../lib/supabase/client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const font2 = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
});

const PRODUCT_SLUGS = {
  buchbox: "heartbeat_1_buchbox",
  book: "heartbeat_die_andere_seite",
};

function formatPrice(value) {
  const number = Number(value ?? 0);
  return `€${number.toFixed(2)}`;
}

export default function HeartbeatStorePage() {
  const book = {
    title: "Heartbeat",
    subtitle: "Die andere Seite",
    author: "deevee",
    price: "€16.99",
    badge: "Band 1 der Reihe",
    description:
      "Ein düster-romantischer Fantasyroman über Geheimnisse, Intrigen und Drama. Folge Kylie in eine fremde Welt, in der Magie real ist, Vertrauen tödlich und Liebe dein Untergang sein kann.",
    longDescription: [
      "Kylie glaubte, sie sei ein ganz normales Mädchen. Bis zu dem Tag, an dem ihre Schwester spurlos verschwindet und die Wahrheit ihre Welt zerreißt. Magische Wesen sind real. Und Kylie ist tiefer in ihrer Welt verstrickt, als sie je hätte ahnen können.",
      "Auf der Suche nach ihrer Schwester betritt sie die andere Seite, ein Reich aus tödlicher Magie, uralten Bündnissen und Intrigen, die niemals in Vergessenheit geraten sind. Doch je näher sie der Wahrheit kommt, desto mehr beginnt alles zu zerbrechen.",
      "An der Seite eines Feenprinzen gerät Kylie in einen Strudel aus Machtkämpfen und dunklen Entscheidungen, die der Auslöser eines apokalyptischen Krieges werden. Und während Schatten näher rücken, muss Kylie sich fragen: Wie viel ist sie bereit zu opfern, um die zu retten, die sie liebt?",
    ],
    images: ["/book1.jpeg", "/book.jpg", "/book4.jpeg", "/backcover.jpg"],
    features: [
      "Slow Burn",
      "Magische Welt",
      "Betrayal",
      "Hidden Power",
      "Entführung",
      "Abenteuer",
      "Parallelwelten",
      "2 Charakterkarten"
    ],
    details: [
      ["Format", "Taschenbuch"],
      ["Sprache", "Deutsch"],
      ["Reihe", "Heartbeat"],
      ["Band", "1"],
    ],
  };

  const [cursorGlow, setCursorGlow] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSignOutOverlay, setShowSignOutOverlay] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartToast, setCartToast] = useState(false);
  const [productsBySlug, setProductsBySlug] = useState({});
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartIsFloating, setCartIsFloating] = useState(false);

  const userMenuRef = useRef(null);
  const isSigningOutRef = useRef(false);
  const isInitialLoad = useRef(true);
  const toastTimerRef = useRef(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setProductsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, type, price, stock, image, active")
        .in("slug", Object.values(PRODUCT_SLUGS))
        .eq("active", true);

      if (error) {
        console.error("Failed to load store products:", error.message);
        if (!ignore) setProductsBySlug({});
        setProductsLoading(false);
        return;
      }

      const map = {};

      for (const product of data ?? []) {
        map[product.slug] = product;
      }

      if (!ignore) {
        setProductsBySlug(map);
        setProductsLoading(false);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  useEffect(() => {
    function handleScroll() {
      setCartIsFloating(window.scrollY > window.innerHeight * 0.75);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setShowLoginModal(false);
    }

    if (showLoginModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLoginModal]);

  function syncCartCount() {
    const cart = JSON.parse(localStorage.getItem("heartbeat_cart") || "[]");

    const count = cart.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );

    setCartCount(count);
  }

  function showCartToast() {
    setCartToast(true);

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    toastTimerRef.current = setTimeout(() => {
      setCartToast(false);
    }, 2400);
  }

  function addProductBySlug(slug) {
    const product = productsBySlug[slug];

    if (!product) {
      console.error(`Product not found for slug: ${slug}`);
      return;
    }

    if (!product.active) {
      console.error(`${product.name} is not active.`);
      return;
    }

    if (Number(product.stock ?? 0) <= 0) {
      console.error(`${product.name} is out of stock.`);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: Number(product.price),
      type: product.type,
    });
  }

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("heartbeat_cart") || "[]");

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("heartbeat_cart", JSON.stringify(cart));

    syncCartCount();
    showCartToast();
  }

  useEffect(() => {
    syncCartCount();

    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  async function hydrateAuthState(showSpinner = true) {
    if (isSigningOutRef.current) return;

    if (showSpinner) setAuthLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Failed to get user:", error.message);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setAuthLoading(false);
      return;
    }

    if (!user) {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setAuthLoading(false);
      return;
    }

    setUser(user);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role, display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Failed to load profile:", profileError.message);
      setProfile(null);
      setIsAdmin(false);
      setAuthLoading(false);
      return;
    }

    setProfile(profileData ?? null);
    setIsAdmin(profileData?.role === "admin");
    setAuthLoading(false);
  }

  useEffect(() => {
    hydrateAuthState(true);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isSigningOutRef.current) return;

      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setAuthLoading(false);
      } else if (event === "SIGNED_IN") {
        const isBackground = !isInitialLoad.current;
        hydrateAuthState(!isBackground);
        isInitialLoad.current = false;
      } else if (event === "TOKEN_REFRESHED") {
        hydrateAuthState(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  function handleMouseMove(e) {
    setCursorGlow({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  }

  function handleMouseLeave() {
    setCursorGlow((prev) => ({ ...prev, visible: false }));
  }

  async function handleSignOut() {
    isSigningOutRef.current = true;
    setShowUserMenu(false);

    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      console.error("Sign out failed:", error.message);
      isSigningOutRef.current = false;
      return;
    }

    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setShowSignOutOverlay(true);

    setTimeout(() => {
      setShowSignOutOverlay(false);
      setAuthLoading(false);
      isSigningOutRef.current = false;
    }, 2200);
  }

  const primaryButton =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:-translate-y-0.5";

  const buchboxProduct = productsBySlug[PRODUCT_SLUGS.buchbox];
  const bookProduct = productsBySlug[PRODUCT_SLUGS.book];

  const isBuchboxSoldOut =
    !!buchboxProduct && Number(buchboxProduct.stock ?? 0) <= 0;
  const isBookSoldOut = !!bookProduct && Number(bookProduct.stock ?? 0) <= 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center gap-4">
        <div className="relative w-[72px] h-[72px] flex items-center justify-center">
          <div
            className="absolute w-[72px] h-[72px] rounded-full border border-[#f3d4a2]/25 border-t-[#f3d4a2]/70 animate-spin"
            style={{ animationDuration: "2.8s" }}
          />
          <div
            className="absolute w-[52px] h-[52px] rounded-full border border-[#af8cff]/20 border-r-[#af8cff]/60 animate-spin"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          />
          <div
            className="absolute w-[34px] h-[34px] rounded-full border border-[#f3d4a2]/50 border-l-transparent animate-spin"
            style={{ animationDuration: "1.4s" }}
          />
          <div className="w-[5px] h-[5px] rounded-full bg-[#f3d4a2]/90" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#f3d4a2]/55">
          Entering the realm
        </p>
      </div>
    );
  }

  return (
    <>
      {showLoginModal && (
        <LoginModal
          ibmPlexSerif={ibmPlexSerif}
          font2={font2}
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
        />
      )}

      <main
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen bg-[#090909] text-white"
      >
        {cartToast && (
          <div className="fixed left-1/2 top-6 z-[9999] -translate-x-1/2 animate-[fadeIn_0.25s_ease-out]">
            <div
              className={`${font2.className} rounded-full border border-[#f3d4a2]/18 bg-[#111113]/95 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#fff4de] shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl`}
            >
              Added to bag!
            </div>
          </div>
        )}

        {showSignOutOverlay && (
          <div className="fixed inset-0 z-[9999] bg-[#07060f]/97 flex flex-col items-center justify-center gap-4 animate-[fadeIn_0.5s_ease-out]">
            <span className="text-[#f3d4a2]/50 text-[13px] tracking-[0.2em] font-serif">
              — ✦ —
            </span>
            <div className="w-[120px] h-px bg-gradient-to-r from-transparent via-[#f3d4a2]/35 to-transparent" />
            <p className="text-[22px] text-[#fff4de]/92 font-serif tracking-tight">
              Bis zur anderen Seite
            </p>
            <div className="w-[120px] h-px bg-gradient-to-r from-transparent via-[#f3d4a2]/35 to-transparent" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/28">
              Bis zum nächsten Mal
            </span>
          </div>
        )}

        <div
          className="pointer-events-none fixed z-[9999] h-[280px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300"
          style={{
            left: `${cursorGlow.x}px`,
            top: `${cursorGlow.y}px`,
            opacity: cursorGlow.visible ? 0.65 : 0,
            background:
              "radial-gradient(circle, rgba(120,150,255,0.28) 0%, rgba(175,140,255,0.20) 35%, rgba(243,212,162,0.14) 58%, transparent 74%)",
          }}
        />

        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(132,33,64,0.18),transparent_26%),linear-gradient(to_bottom,#0b0b0d,#090909)] py-10">
          <div className="relative mb-10">
            <div
              className="absolute right-[13.5%] top-0 z-20"
              ref={userMenuRef}
            >
              {authLoading ? (
                <div
                  className={`${font2.className} inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] text-white/45 backdrop-blur-[6px]`}
                >
                  Loading...
                </div>
              ) : !user ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`${font2.className} inline-flex cursor-pointer items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] text-white/88 backdrop-blur-[6px] transition duration-300 hover:-translate-y-[1px] hover:border-[#f3d4a2]/35 hover:bg-white/[0.08] hover:text-[#fff4de] hover:shadow-[0_0_24px_rgba(243,212,162,0.14)]`}
                >
                  Login
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className={`${font2.className} inline-flex max-w-[260px] cursor-pointer items-center gap-3 rounded-full border border-[#f3d4a2]/18 bg-white/[0.05] px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-[#fff4de] backdrop-blur-[8px] transition duration-300 hover:-translate-y-[1px] hover:border-[#f3d4a2]/35 hover:bg-white/[0.08] hover:shadow-[0_0_24px_rgba(243,212,162,0.14)]`}
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-[#f3d4a2]" />
                    <span className="truncate normal-case tracking-normal text-[12px]">
                      {profile.display_name ?? profile.email}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-[220px] overflow-hidden rounded-[22px] border border-white/10 bg-[#111113]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                      {isAdmin && (
                        <Link
                          href="/admindashboard"
                          className={`${font2.className} flex w-full cursor-pointer items-center rounded-2xl px-4 py-3 text-left text-[11px] uppercase tracking-[0.2em] text-[#f1d3a5] transition hover:bg-white/[0.06] hover:text-white`}
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/store/orders"
                        className={`${font2.className} flex w-full cursor-pointer items-center rounded-2xl px-4 py-3 text-left text-[11px] uppercase tracking-[0.2em] text-white/82 transition hover:bg-white/[0.06] hover:text-[#fff4de]`}
                      >
                        Orders
                      </Link>

                      <Link
                        href="/store/profile"
                        className={`${font2.className} flex w-full cursor-pointer items-center rounded-2xl px-4 py-3 text-left text-[11px] uppercase tracking-[0.2em] text-white/82 transition hover:bg-white/[0.06] hover:text-[#fff4de]`}
                      >
                        Profile
                      </Link>

                      <div className="my-1 h-px bg-white/8" />

                      <button
                        onClick={handleSignOut}
                        className={`${font2.className} flex w-full cursor-pointer items-center rounded-2xl px-4 py-3 text-left text-[11px] uppercase tracking-[0.2em] text-[#f1d3a5] transition hover:bg-white/[0.06] hover:text-white`}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div
                className={`${
                  cartIsFloating
                    ? "fixed bottom-6 right-6 z-[9998]"
                    : "absolute -top-0.25 -right-12"
                } transition-all duration-500`}
              >
                <Link
                  href="/store/cart"
                  className={`relative inline-flex items-center justify-center rounded-full border border-[#f3d4a2]/18 bg-white/[0.05] text-[#fff4de] backdrop-blur-[8px] transition duration-300 hover:-translate-y-[1px] hover:border-[#f3d4a2]/35 hover:bg-white/[0.08] hover:shadow-[0_0_24px_rgba(243,212,162,0.14)] ${
                    cartIsFloating
                      ? "h-[54px] w-[54px] bg-[#111113]/80 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                      : "h-[42px] w-[42px]"
                  }`}
                  aria-label="Open cart"
                >
                  <ShoppingBag size={18} strokeWidth={1.8} />

                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f3d4a2] px-1 text-[10px] font-semibold leading-none text-black">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <div className="text-center">
              <p
                className={`${font2.className} text-[11px] uppercase tracking-[0.38em] text-white/45`}
              >
                Offizieller Book Shop
              </p>

              <h1
                className={`${ibmPlexSerif.className} mt-4 text-[clamp(42px,5vw,72px)] leading-[0.92] tracking-[-0.04em] text-white`}
              >
                Heartbeat Shop
              </h1>

              <p
                className={`${font2.className} mt-3 text-[13px] uppercase tracking-[0.32em] text-white/55`}
              >
                Heartbeat · Die andere Seite
              </p>

              <div className="mx-auto mt-5 h-px w-[220px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>

          <div className="absolute inset-0 bg-[url('/book4.jpeg')] bg-cover bg-center opacity-[0.08]" />

          <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
            {buchboxProduct && (
              <div
                id="buchbox"
                className={`relative mb-12 overflow-hidden rounded-[34px] border border-[#f3d4a2]/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-xl shadow-black/30 sm:p-8 ${
                  isBuchboxSoldOut ? "opacity-85" : ""
                }`}
              >
                {isBuchboxSoldOut && (
                  <>
                    <div className="pointer-events-none absolute inset-0 z-20 rounded-[34px] bg-black/70" />

                    <div className="pointer-events-none absolute left-[52%] top-[45%] z-40 w-[400px] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] opacity-85 mix-blend-luminosity">
                      <Image
                        src="/circlestamp5.png"
                        alt="Ausverkauft stamp"
                        width={900}
                        height={900}
                        className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
                        priority
                      />
                    </div>
                  </>
                )}

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-full border border-[#ffcf88]/20 bg-[#8c4e17]/18 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#ffdca8]">
                    Exklusiver Vorverkauf
                  </div>
                  {!isBuchboxSoldOut && (
                    <div className="inline-flex items-center rounded-full border border-[#ffcf88]/20 bg-[#a7521d] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white shadow-[0_0_25px_rgba(167,82,29,0.35)]">
                      Verkauft sich schnell
                    </div>
                  )}
                </div>

                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                    <div className="relative aspect-[1/1] w-full">
                      <Image
                        src="/buchbox4.jpg"
                        alt="Heartbeat Buchbox"
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
                      Limitierte Buchbox
                    </p>

                    <h1
                      className={`${ibmPlexSerif.className} mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl`}
                    >
                      Heartbeat I
                      <br />
                      Buchbox
                    </h1>

                    <p
                      className={`${ibmPlexSerif.className} mt-6 max-w-[640px] text-[20px] leading-[1.55] text-white/88 sm:text-[24px]`}
                    >
                      Die besondere Presale-Edition für alle, die mehr als nur
                      das Buch wollen.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/72">
                        Limitierte Stückzahl
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/72">
                        Auf Wunsch signiert
                      </span>
                    </div>

                    <div className="mt-8 rounded-[30px] border border-[#f3d4a2]/16 bg-[linear-gradient(180deg,rgba(109,59,17,0.38),rgba(41,19,6,0.2))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
                      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#f3d4a2]/12 pb-5">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.28em] text-[#f1d3a5]/55">
                            Buchbox Preis
                          </p>
                          <div className="flex items-center gap-4">
                            <div
                              className={`${ibmPlexSerif.className} mt-3 text-4xl text-[#fff5e8] sm:text-5xl`}
                            >
                              {formatPrice(buchboxProduct.price)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                            Inhalt
                          </p>
                          <p
                            className={`${ibmPlexSerif.className} mt-2 text-[17px] text-white/90`}
                          >
                            Buchbox Bundle
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                            Status
                          </p>
                          <p
                            className={`${ibmPlexSerif.className} mt-2 text-[17px] text-white/90`}
                          >
                            {isBuchboxSoldOut ? "Ausverkauft" : "Presale"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                            Verfügbarkeit
                          </p>
                          <p
                            className={`${ibmPlexSerif.className} mt-2 text-[17px] text-white/90`}
                          >
                            {isBuchboxSoldOut ? "Nicht verfügbar" : "Verfügbar"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl border border-[#f3d4a2]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#f1d3a5]/55">
                          Was ist in der Buchbox?
                        </p>
                        <ul
                          className={`${ibmPlexSerif.className} mt-3 text-[18px] leading-[1.65] text-[#f7ead8] flex flex-wrap gap-x-4 gap-y-2`}
                        >
                          {[
                            "Taschenbuch",
                            "Metall-Lesezeichen",
                            "4 Charakterkarten (beidseitig bedruckt)",
                            "Acryl-Aufsteller",
                          ].map((item) => (
                            <li key={item} className="flex items-center">
                              <span className="mx-3 text-white/40">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
  <p
    className={`${font2.className} text-[11px] uppercase tracking-[0.26em] text-white/45`}
  >
    Triggerwarnungen
  </p>

  <p
    className={`${ibmPlexSerif.className} mt-3 text-[16px] leading-[1.7] text-white/78`}
  >
    Dieses Buch enthält extreme Gewalt, Tod, psychische Erkrankungen,
    Entführung, Stalking, Mord, Panikattacken, emotionalen Missbrauch,
    Gaslighting, Vernachlässigung von Kindern sowie blutige oder grafische
    Gewalt.
  </p>
</div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() =>
                            addProductBySlug(PRODUCT_SLUGS.buchbox)
                          }
                          disabled={
                            productsLoading ||
                            !buchboxProduct ||
                            isBuchboxSoldOut
                          }
                          className={`${primaryButton} ${font2.className} bg-[#f2e6d7] text-black hover:bg-white shadow-[0_10px_30px_rgba(242,230,215,0.18)] flex-1 transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {isBuchboxSoldOut ? "Ausverkauft" : "Buchbox sichern"}
                        </button>
                      </div>

                      <p className="mt-5 text-center text-[12px] uppercase tracking-[0.24em] text-[#f1d3a5]/50">
                        Exklusiv für den Presale
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {bookProduct && (
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start relative">
                {isBookSoldOut && (
                  <>
                    <div className="pointer-events-none absolute inset-0 z-20 rounded-[34px] bg-black/70" />

                    <div className="pointer-events-none absolute left-[52%] top-[45%] z-40 w-[340px] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] opacity-85 mix-blend-luminosity">
                      <Image
                        src="/circlestamp5.png"
                        alt="Ausverkauft stamp"
                        width={900}
                        height={900}
                        className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
                        priority
                      />
                    </div>
                  </>
                )}
                <div
                  className={`grid gap-4 sm:grid-cols-[1fr] ${
                    isBookSoldOut ? "grayscale-[0.35]" : ""
                  }`}
                >
                  <div className="relative aspect-[1/1] w-full rounded-[28px] overflow-hidden">
                    <Image
                      src={book.images[1]}
                      alt={`${book.title} cover`}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                <div className="lg:sticky lg:top-8">
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.22em] text-white/70">
                    {book.badge}
                  </div>

                  <h1
                    className={`${ibmPlexSerif.className} mt-5 text-4xl tracking-tight sm:text-5xl`}
                  >
                    {book.title}
                  </h1>
                  <p
                    className={`${ibmPlexSerif.className} mt-2 text-xl text-white/75 sm:text-2xl`}
                  >
                    {book.subtitle}
                  </p>
                  <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/45">
                    by {book.author}
                  </p>

                  <p
                    className={`${ibmPlexSerif.className} mt-6 max-w-xl text-base leading-7 text-white/76 sm:text-lg`}
                  >
                    {book.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {book.features.map((feature) => (
                      <span
                        key={feature}
                        className={`${font2.className} rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em]">
                      Buch Preis
                    </p>
                    <div
                      className={`${ibmPlexSerif.className} text-3xl sm:text-4xl mt-4`}
                    >
                      {formatPrice(bookProduct.price)}
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => addProductBySlug(PRODUCT_SLUGS.book)}
                        disabled={
                          productsLoading || !bookProduct || isBookSoldOut
                        }
                        className={`${primaryButton} ${font2.className} w-full bg-white text-black cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {isBookSoldOut ? "Ausverkauft" : "Jetzt kaufen"}
                      </button>
                    </div>

                    <div className={`${font2.className} mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65`}>
                      Sicherer Checkout mit Stripe oder PayPal.
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p
                      className={`${font2.className} text-[11px] uppercase tracking-[0.26em] text-white/45`}
                    >
                      Triggerwarnungen
                    </p>

                    <p
                      className={`${ibmPlexSerif.className} mt-3 flex flex-wrap text-[16px] leading-[1.6] text-white/78`}
                    >
                      Dieses Buch enthält Extreme Gewalt, Tod, psychische
                      Erkrankungen, Entführung, Stalking, Mord, Panikattacken,
                      emotionaler Missbrauch, Gaslighting, Vernachlässigung von
                      Kindern, Tod eines Elternteils, blutige oder grafische
                      Gewalt.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="w-full relative overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(132,33,64,0.18),transparent_26%),linear-gradient(to_bottom,#0b0b0d,#090909)] py-10">
          <section className="relative mx-auto grid max-w-7xl items-start gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
            <div className="absolute inset-0 bg-[url('/book1.jpeg')] bg-cover bg-center opacity-[0.05] scale-120" />

            <div className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
              <p
                className={`${font2.className} text-sm uppercase tracking-[0.25em] text-white/45`}
              >
                Über das Buch
              </p>

              <div
                className={`${ibmPlexSerif.className} mt-5 space-y-5 text-base leading-8 text-white/78 sm:text-lg`}
              >
                {book.longDescription.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
              <p
                className={`${font2.className} text-sm uppercase tracking-[0.25em] text-white/45`}
              >
                Details
              </p>

              <div className="mt-5 divide-y divide-white/10">
                {book.details.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-4 text-sm sm:text-base"
                  >
                    <span className={`${font2.className} text-white/48`}>
                      {label}
                    </span>
                    <span
                      className={`${ibmPlexSerif.className} text-right text-white/84`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10 lg:pb-20">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
              <div className="grid gap-0">
                <div className="p-6 sm:p-8 lg:p-10 lg:flex lg:flex-col lg:items-center lg:w-full lg:text-center">
                  <div className="lg:flex lg:flex-col lg:items-center">
                    <p
                      className={`${font2.className} text-sm uppercase tracking-[0.25em] text-white/45`}
                    >
                      Für wen ist es?
                    </p>
                    <h2
                      className={`${ibmPlexSerif.className} mt-4 text-3xl tracking-tight sm:text-4xl`}
                    >
                      Für Leserinnen und Leser, die düstere Romantasy lieben.
                    </h2>
                    <p
                      className={`${ibmPlexSerif.className} mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg lg:text-center`}
                    >
                      Wenn du emotionale Spannung, geheimnisvolle Magie und eine
                      Atmosphäre suchst, die sich gleichzeitig gefährlich und
                      romantisch anfühlt, ist Heartbeat genau der richtige
                      Einstieg in diese Reihe. Bitte beachte die Triggerwarnung.
                    </p>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        title: "Dunkle Atmosphäre",
                        text: "Geheimnisvolle Welten und eine Stimmung, die sofort fesselt.",
                      },
                      {
                        title: "Romantische Spannung",
                        text: "Kein hektisches Tempo – sondern langsames Knistern mit echtem Sog.",
                      },
                      {
                        title: "Starker Reihenauftakt",
                        text: "Perfekt, um die Welt und ihre Konflikte kennenzulernen, bevor der nächste Band folgt.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="group relative rounded-2xl border border-white/10 bg-black/20 p-6 transition duration-300 hover:border-white/20 hover:bg-white/[0.04]"
                      >
                        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />

                        <h3 className={`${ibmPlexSerif.className} text-lg`}>
                          {item.title}
                        </h3>

                        <p
                          className={`${font2.className} mt-2 text-sm leading-7 text-white/66`}
                        >
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="m-4 lg:m-10 flex justify-center">
                <div className="m-4 lg:m-16 flex justify-center">
                  <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-[#f3d4a2]/20 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <div className="absolute inset-0">
                      <img
                        src="/forest.jpg"
                        alt=""
                        className="h-full w-full object-cover opacity-70"
                      />
                    </div>

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.1)_60%,rgba(0,0,0,0.3)_100%)]" />

                    <div className="pointer-events-none absolute h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300" />

                    <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#f3d4a2]/20 shadow-[0_0_40px_rgba(243,212,162,0.12),0_0_90px_rgba(120,150,255,0.08)]" />

                    <div className="relative z-10">
                      <p
                        className={`${font2.className} text-[11px] uppercase tracking-[0.3em] text-[#f1d3a5]/70`}
                      >
                        Bist du bereit?
                      </p>

                      <h2
                        className={`${ibmPlexSerif.className} mt-4 text-3xl sm:text-4xl leading-[1.1]`}
                      >
                        Für die andere Seite?
                      </h2>

                      <p
                        className={`${ibmPlexSerif.className} mt-4 text-white/80 text-[17px] leading-[1.6]`}
                      >
                        Tauche ein in eine Welt voller Magie, Dunkelheit und
                        Entscheidungen, die alles verändern können.
                      </p>

                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => {
                            document
                              .getElementById("buchbox")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          disabled={!buchboxProduct}
                          className={`${primaryButton} ${font2.className} bg-[#f2e6d7] text-black hover:bg-white shadow-[0_10px_30px_rgba(242,230,215,0.18)] cursor-pointer w-[50%] btn btn-background-slide disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          Jetzt eintauchen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
