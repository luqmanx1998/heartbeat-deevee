"use client";

import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const segamoriz = localFont({
  src: "../../fonts/Segamoriz.woff2",
});

const font2 = localFont({
  src: "../../fonts/NeueMontreal-Regular.woff2",
});

export default function HeartbeatSeriesPage() {
  const [series, setSeries] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let ignore = false;

    async function loadSeriesPage() {
      setLoading(true);

      const { data: seriesData, error: seriesError } = await supabase
        .from("series")
        .select("*")
        .eq("slug", "heartbeatseries")
        .maybeSingle();

      if (seriesError) {
        console.error("Failed to load Heartbeat series:", seriesError.message);
        setLoading(false);
        return;
        }

        if (!seriesData) {
        console.error("No Heartbeat series found.");
        setLoading(false);
        return;
        }

      if (ignore) return;
      setSeries(seriesData);

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("series_id", seriesData.id)
        .order("created_at", { ascending: true });

      if (productsError) {
        console.error("Failed to load series products:", productsError.message);
        setProducts([]);
        setLoading(false);
        return;
      }

      if (ignore) return;
      setProducts(productsData ?? []);
      setLoading(false);
    }

    loadSeriesPage();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock ?? 0),
    0
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-[#f3e7d3]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(68,48,22,0.42),transparent_26%),radial-gradient(circle_at_top_right,rgba(40,64,98,0.22),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(120,74,20,0.18),transparent_20%),linear-gradient(to_bottom,#0a0910,#0d0a12_35%,#120d12_70%,#0a090d)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.75] bg-[url('/bgimage2.png')] bg-cover bg-center mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,235,200,0.8)_0.7px,transparent_0.7px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute inset-3 rounded-[30px] border border-[#8f6a37]/55 shadow-[inset_0_0_0_1px_rgba(217,182,115,0.16),0_0_40px_rgba(0,0,0,0.35)] sm:inset-5 lg:inset-6" />

      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admindashboard"
            className={`${font2.className} inline-flex items-center justify-center rounded-[16px] border border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] px-5 py-3 text-[12px] uppercase tracking-[0.16em] text-[#f7e3bc] shadow-[0_10px_18px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.06)] transition hover:-translate-y-[1px] hover:brightness-110`}
          >
            ← Dashboard
          </Link>

          <Link
            href="/store"
            className={`${font2.className} inline-flex items-center justify-center rounded-[16px] border border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] px-5 py-3 text-[12px] uppercase tracking-[0.16em] text-[#f7e3bc] shadow-[0_10px_18px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.06)] transition hover:-translate-y-[1px] hover:brightness-110`}
          >
            Open Store ↗
          </Link>
        </div>

        <header className="mb-10 text-center">
          <h1
            className={`${segamoriz.className} text-[clamp(42px,5vw,72px)] leading-[0.96] tracking-[0.01em] text-[#f3dfb7] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]`}
          >
            Heartbeat Series
          </h1>

          <div className="mx-auto mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b89154]/60" />
            <span className="text-[#d2aa6a]">☾</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b89154]/60" />
          </div>

          <p
            className={`${ibmPlexSerif.className} mx-auto mt-5 max-w-3xl text-[18px] leading-[1.7] text-[#e4d4be]/82`}
          >
            Verwalte alle Produkte und den Bestand des Heartbeat-Universums an
            einem Ort.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[30px] border border-[#8d693b]/55 bg-[linear-gradient(180deg,rgba(19,13,12,0.78),rgba(11,8,10,0.7))] p-5 shadow-[0_22px_45px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(205,171,114,0.06)]">
            <div className="overflow-hidden rounded-[18px] border border-[#6d4823]/45 shadow-[0_10px_22px_rgba(0,0,0,0.28)]">
              {series?.cover_image ? (
                <Image
                  src={series.cover_image}
                  alt={series.name}
                  width={700}
                  height={900}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-[420px] w-full bg-[#1a1414]" />
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#8d693b]/55 bg-[linear-gradient(180deg,rgba(19,13,12,0.78),rgba(11,8,10,0.7))] p-6 shadow-[0_22px_45px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(205,171,114,0.06)] self-center">
            <div className="flex flex-wrap gap-3">
              {series?.featured && (
                <span className={`${font2.className} rounded-full border border-[#8d693b]/55 bg-[#2b1b12]/75 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#f4dfba]`}>
                  Featured
                </span>
              )}
              {series?.active && (
                <span className={`${font2.className} rounded-full border border-[#8d693b]/55 bg-[#2b1b12]/75 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#f4dfba]`}>
                  Active
                </span>
              )}
            </div>

            <h2
              className={`${segamoriz.className} mt-5 text-[clamp(34px,4vw,58px)] leading-[0.98] text-[#f1ddb8]`}
            >
              {loading ? "Loading..." : series?.name ?? "No series"}
            </h2>

            <p
              className={`${ibmPlexSerif.className} mt-5 text-[19px] leading-[1.75] text-[#decbb0]/85`}
            >
              {loading
                ? "Lade Serieninformationen..."
                : series?.description || "Noch keine Beschreibung verfügbar."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <SeriesStatCard
                label="Produkte"
                value={loading ? "—" : String(totalProducts)}
                font2={font2}
                ibmPlexSerif={ibmPlexSerif}
              />
              <SeriesStatCard
                label="Gesamtbestand"
                value={loading ? "—" : String(totalStock)}
                font2={font2}
                ibmPlexSerif={ibmPlexSerif}
              />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#b89154]/55" />
            <h3
              className={`${ibmPlexSerif.className} text-[clamp(34px,3vw,48px)] italic text-[#f1ddb8]`}
            >
              Produkte im Universum
            </h3>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#b89154]/55" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {loading ? (
              <p className={`${font2.className} text-sm text-[#e1cfb6]/70`}>
                Lade Produkte...
              </p>
            ) : products.length === 0 ? (
              <p className={`${font2.className} text-sm text-[#e1cfb6]/70`}>
                Noch keine Produkte vorhanden.
              </p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="grid gap-5 rounded-[30px] border border-[#8d693b]/55 bg-[linear-gradient(180deg,rgba(19,13,12,0.78),rgba(11,8,10,0.7))] p-5 shadow-[0_22px_45px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(205,171,114,0.06)] sm:grid-cols-[220px_1fr]"
                >
                  <div className="overflow-hidden rounded-[18px] border border-[#6d4823]/45 shadow-[0_10px_22px_rgba(0,0,0,0.28)]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={650}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`${font2.className} rounded-full border border-[#8d693b]/45 bg-[#2b1b12]/75 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#f4dfba]`}>
                        {product.type}
                      </span>
                      <span className={`${font2.className} rounded-full border border-[#8d693b]/45 bg-[#2b1b12]/75 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#f4dfba]`}>
                        {product.active ? "Active" : "Hidden"}
                      </span>
                    </div>

                    <h4
                      className={`${segamoriz.className} mt-5 text-[clamp(26px,3vw,42px)] leading-[0.98] text-[#f1ddb8]`}
                    >
                      {prettyName(product.name)}
                    </h4>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <SeriesStatCard
                        label="Preis"
                        value={`€${Number(product.price).toFixed(2)}`}
                        font2={font2}
                        ibmPlexSerif={ibmPlexSerif}
                      />
                      <SeriesStatCard
                        label="Bestand"
                        value={String(product.stock)}
                        font2={font2}
                        ibmPlexSerif={ibmPlexSerif}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function SeriesStatCard({ label, value, font2, ibmPlexSerif }) {
  return (
    <div className="rounded-[22px] border border-[#8d693b]/45 bg-[linear-gradient(180deg,rgba(31,20,15,0.82),rgba(18,12,10,0.72))] p-4 shadow-[0_14px_24px_rgba(0,0,0,0.22)]">
      <p
        className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/55`}
      >
        {label}
      </p>
      <p
        className={`${ibmPlexSerif.className} mt-3 text-[28px] text-[#f5dfb8]`}
      >
        {value}
      </p>
    </div>
  );
}

function prettyName(value) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}