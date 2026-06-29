"use client";

import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const segamoriz = localFont({
  src: "../fonts/Segamoriz.woff2",
});

const font2 = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
});

export default function AdminDashboardPage() {
  const [featuredSeries, setFeaturedSeries] = useState(null);
  const [products, setProducts] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setLoading(true);

      const { data: featuredData, error: featuredError } = await supabase
        .from("series")
        .select("*")
        .eq("featured", true)
        .single();

      if (featuredError) {
        console.error("Failed to load featured series:", featuredError.message);
        setLoading(false);
        return;
      }

      if (ignore) return;
      setFeaturedSeries(featuredData);

      const { data: allSeriesData, error: allSeriesError } = await supabase
        .from("series")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (allSeriesError) {
        console.error("Failed to load all series:", allSeriesError.message);
        setAllSeries([]);
      } else if (!ignore) {
        setAllSeries(allSeriesData ?? []);
      }

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("series_id", featuredData.id)
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (productError) {
        console.error("Failed to load products:", productError.message);
        setProducts([]);
        setLoading(false);
        return;
      }

      if (ignore) return;
      setProducts(productData ?? []);
      setLoading(false);
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock ?? 0),
    0
  );
  const activeSeriesCount = allSeries.length;

  return (
    <main>
     <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <header className="relative mb-10 text-center relative">
          <div className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-24 bg-gradient-to-r from-transparent to-[#b89154]/55 lg:block" />
          <div className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-24 bg-gradient-to-l from-transparent to-[#b89154]/55 lg:block" />
          <Link
            href="/store"
            className={`${font2.className} absolute top-0 left-0 inline-flex items-center justify-center rounded-[16px] border border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] px-5 py-3 text-[12px] uppercase tracking-[0.16em] text-[#f7e3bc] shadow-[0_10px_18px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.06)] transition hover:-translate-y-[1px] hover:brightness-110 z-20`}
          >
            ← Back to Store
          </Link>

          <h1
            className={`${segamoriz.className} text-[clamp(42px,5vw,72px)] leading-[0.96] tracking-[0.01em] text-[#f3dfb7] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]`}
          >
            Deevee Dashboard
          </h1>

          <div className="mx-auto mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b89154]/60" />
            <span className="text-[#d2aa6a]">☾</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b89154]/60" />
          </div>

          <p
            className={`${ibmPlexSerif.className} mt-5 text-[clamp(24px,2.3vw,36px)] italic text-[#f7ead6]`}
          >
            Willkommen zurück, Deevee.
          </p>

          <p
            className={`${ibmPlexSerif.className} mx-auto mt-4 max-w-3xl text-[18px] leading-[1.7] text-[#e4d4be]/82`}
          >
            Dein Universum wächst weiter. Behalte Serien, Produkte und Bestand
            an einem Ort im Blick.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.15fr]">
          <StatCard
            label="Serien"
            value={loading ? "-" : String(activeSeriesCount)}
            icon="❦"
            font2={font2}
            ibmPlexSerif={ibmPlexSerif}
          />
          <StatCard
            label="Produkte"
            value={loading ? "-" : String(totalProducts)}
            icon="✦"
            font2={font2}
            ibmPlexSerif={ibmPlexSerif}
          />
          <StatCard
            label="Gesamtbestand"
            value={loading ? "-" : String(totalStock)}
            icon="❁"
            font2={font2}
            ibmPlexSerif={ibmPlexSerif}
          />

          <div className="rounded-[28px] border border-[#8d693b]/60 bg-[linear-gradient(180deg,rgba(30,19,11,0.86),rgba(20,13,9,0.78))] p-5 shadow-[0_18px_35px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(191,151,89,0.08)]">
            <p
              className={`${ibmPlexSerif.className} text-[28px] leading-none text-[#f2dfba]`}
            >
              Aktionen
            </p>

            <div className="mt-5 grid gap-3">
              <ActionLink
                href="/admindashboard/heartbeatseries"
                label="Manage Heartbeat"
                font2={font2}
              />
              <ActionLink
                href="/store"
                label="Store öffnen"
                font2={font2}
              />
              <ActionLink
                href="/admindashboard/orders"
                label="Orders ansehen"
                font2={font2}
              />
              <ActionLink
                href="/admindashboard/emails"
                label="Emails"
                font2={font2}
              />
              <ActionLink 
                href="admindashboard/metrics"
                label="Metrics"
                font2={font2}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[32px] border border-[#8d693b]/60 bg-[linear-gradient(180deg,rgba(33,22,15,0.82),rgba(18,12,10,0.72))] p-4 shadow-[0_24px_55px_rgba(0,0,0,0.42),inset_0_0_0_1px_rgba(212,174,111,0.08)] sm:p-5">
            <div className="pointer-events-none absolute left-10 top-11 text-[#caa05f]/70 text-[40px]">
              ❦
            </div>

            <div className="rounded-[26px] border border-[#9b7644]/55 bg-[linear-gradient(180deg,rgba(225,202,164,0.88),rgba(177,145,103,0.78))] p-4 text-[#2e2016] shadow-[inset_0_0_0_1px_rgba(255,247,223,0.16)] sm:p-5">
              <div className="mb-4 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#8c6230]/55" />
                <p
                  className={`${ibmPlexSerif.className} text-[clamp(30px,3vw,44px)] italic text-[#352314]`}
                >
                  Featured Series
                </p>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#8c6230]/55" />
              </div>

              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative overflow-hidden rounded-[18px] border border-[#69431e]/55 shadow-[0_12px_24px_rgba(0,0,0,0.22)]">
                  {featuredSeries?.cover_image ? (
                    <Image
                      src={featuredSeries.cover_image}
                      alt={featuredSeries.name}
                      width={700}
                      height={900}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-[300px] w-full bg-[#d7c3a2]" />
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h2
                      className={`${segamoriz.className} text-[clamp(32px,3vw,52px)] leading-[0.98] text-[#2e1c11]`}
                    >
                      {loading
                        ? "Loading..."
                        : featuredSeries?.name ?? "No series"}
                    </h2>

                    <div className="mt-5 space-y-4 border-t border-[#7f5b31]/28 pt-4">
                      <SeriesMetricRow
                        label="Produkte"
                        value={loading ? "—" : String(totalProducts)}
                        font2={font2}
                        ibmPlexSerif={ibmPlexSerif}
                      />
                      <SeriesMetricRow
                        label="Gesamtbestand"
                        value={loading ? "—" : String(totalStock)}
                        font2={font2}
                        ibmPlexSerif={ibmPlexSerif}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/admindashboard/heartbeatseries"
                      className={`${font2.className} inline-flex items-center justify-center rounded-[16px] border border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-[#f7e3bc] shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.08)] transition hover:-translate-y-[1px] hover:brightness-110`}
                    >
                      Manage Series
                      <span className="ml-3 text-[#d8b06c]">↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] bg-transparent p-5">
              <p
                className={`${ibmPlexSerif.className} text-[30px] text-[#f1dcb8]`}
              >
                Gesamtbestand
              </p>

              <div className="mt-5 space-y-5">
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
                      className="flex items-start justify-between gap-5 border-b border-[#8c6a40]/22 pb-4"
                    >
                      <div>
                        <p
                          className={`${ibmPlexSerif.className} text-[18px] leading-[1.2] text-[#f5e4c5]`}
                        >
                          {prettyName(product.name)}
                        </p>
                        <p
                          className={`${font2.className} mt-1 text-[10px] uppercase tracking-[0.2em] text-[#d3bf9e]/55`}
                        >
                          {product.type}
                        </p>
                      </div>

                      <div className="text-center xl:mr-10">
                        <p
                          className={`${ibmPlexSerif.className} text-[24px] text-[#f0d29b]`}
                        >
                          {product.stock}
                        </p>
                        <p
                          className={`${font2.className} mt-1 text-[10px] uppercase tracking-[0.2em] text-[#d3bf9e]/55`}
                        >
                          Bestand
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 flex items-end justify-end">
                <div className="text-right text-[#e7d5ba]/70">
                  <div className="text-[42px] leading-none">✒</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#b89154]/55" />
            <h3
              className={`${ibmPlexSerif.className} text-[clamp(34px,3vw,48px)] italic text-[#f1ddb8]`}
            >
              Alle Serien
            </h3>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#b89154]/55" />
          </div>

          <div className="grid gap-6">
            {loading ? (
              <p className={`${font2.className} text-sm text-[#e1cfb6]/70`}>
                Lade Serien...
              </p>
            ) : allSeries.length === 0 ? (
              <p className={`${font2.className} text-sm text-[#e1cfb6]/70`}>
                Noch keine Serien vorhanden.
              </p>
            ) : (
              allSeries.map((series) => (
                <Link
                  key={series.id}
                  href={`/admindashboard/${series.slug}`}
                  className="group block"
                >
                  <div className="grid gap-6 rounded-[30px] border border-[#8d693b]/55 bg-[linear-gradient(180deg,rgba(19,13,12,0.78),rgba(11,8,10,0.7))] p-5 shadow-[0_22px_45px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(205,171,114,0.06)] md:grid-cols-[260px_1fr]">
                    <div className="overflow-hidden rounded-[18px] border border-[#6d4823]/45 shadow-[0_10px_22px_rgba(0,0,0,0.28)]">
                      {series.cover_image ? (
                        <Image
                          src={series.cover_image}
                          alt={series.name}
                          width={500}
                          height={650}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-[320px] w-full bg-[#1a1414]" />
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <h4
                        className={`${segamoriz.className} text-[clamp(30px,3vw,50px)] leading-[0.98] text-[#f1ddb8]`}
                      >
                        {series.name}
                      </h4>

                      <p
                        className={`${ibmPlexSerif.className} mt-3 max-w-2xl text-[20px] leading-[1.6] text-[#decbb0]/85`}
                      >
                        {series.description || "Noch keine Beschreibung verfügbar."}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-6">
                        <div>
                          <p
                            className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
                          >
                            Products
                          </p>
                          <p
                            className={`${ibmPlexSerif.className} mt-2 text-[22px] text-[#f4dfba]`}
                          >
                            {series.id === featuredSeries?.id ? totalProducts : "—"}
                          </p>
                        </div>

                        <div
  className={`${font2.className} inline-flex items-center justify-center rounded-[16px] border border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-[#f7e3bc] shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.08)] transition group-hover:-translate-y-[1px] group-hover:brightness-110`}
>
  Open Series
</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon, font2, ibmPlexSerif }) {
  return (
    <div className="rounded-[26px] border border-[#8d693b]/60 bg-[linear-gradient(180deg,rgba(222,198,160,0.9),rgba(173,140,96,0.78))] p-5 text-[#2f1f15] shadow-[0_16px_28px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(255,247,223,0.12)] lg:flex lg:flex-col">
      <div className="flex items-start gap-3">
        <span className="text-[26px] leading-none text-[#7a5328]">{icon}</span>
        <div>
          <p
            className={`${ibmPlexSerif.className} text-[22px] leading-[1.05] text-[#392518]`}
          >
            {label}
          </p>
        </div>
      </div>
                <p
            className={`${ibmPlexSerif.className} mt-4 text-[72px] leading-none text-[#23160f] text-center lg:mt-16`}
          >
            {value}
          </p>
    </div>
  );
}

function ActionLink({ href, label, font2 }) {
  return (
    <Link
      href={href}
      className={`${font2.className} flex items-center justify-between rounded-[16px] border border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-[#f7e3bc] shadow-[0_10px_18px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.06)] transition hover:-translate-y-[1px] hover:brightness-110`}
    >
      <span>{label}</span>
      <span className="text-[#d8b06c]">↗</span>
    </Link>
  );
}

function SeriesMetricRow({ label, value, font2, ibmPlexSerif }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p
        className={`${ibmPlexSerif.className} text-[20px] text-[#4a3121]`}
      >
        {label}
      </p>
      <p
        className={`${ibmPlexSerif.className} text-[24px] text-[#2c1c12]`}
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