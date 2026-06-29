import { supabaseAdmin } from "@/app/lib/supabase/admin";
import localFont from "next/font/local";

const font2 = localFont({
  src: "../../fonts/NeueMontreal-Regular.woff2",
});

export default async function Page() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: views = [], error } = await supabaseAdmin
    .from("page_views")
    .select("*")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-white">Failed: {error.message}</div>;
  }

  const homepageViews = views.filter((v) => v.page_type === "homepage");
  const storeViews = views.filter((v) => v.page_type === "store");

  const homepageVisitors = new Set(
    homepageViews.map((v) => v.visitor_id).filter(Boolean),
  ).size;

  const storeVisitors = new Set(
    storeViews.map((v) => v.visitor_id).filter(Boolean),
  ).size;

  const sources = views.reduce((acc, view) => {
    const source = view.utm_source || "direct / unknown";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const sourceRows = Object.entries(sources).sort((a, b) => b[1] - a[1]);

  return (
    <main className={`${font2.className} min-h-screen bg-[#090909] p-8 text-white`}>
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#f3d4a2]/60">
          Deevee Analytics
        </p>

        <h1 className="mt-4 text-5xl font-semibold">Metrics</h1>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard title="Homepage views" value={homepageViews.length} />
          <MetricCard title="Homepage visitors" value={homepageVisitors} />
          <MetricCard title="Store views" value={storeViews.length} />
          <MetricCard title="Store visitors" value={storeVisitors} />
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-semibold">Traffic sources</h2>

          <div className="mt-5 space-y-3">
            {sourceRows.map(([source, count]) => (
              <div key={source} className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/70">{source}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-semibold">Recent views</h2>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/45">
                <tr>
                  <th className="py-3">Page</th>
                  <th className="py-3">Source</th>
                  <th className="py-3">Campaign</th>
                  <th className="py-3">Time</th>
                </tr>
              </thead>

              <tbody>
                {views.slice(0, 30).map((view) => (
                  <tr key={view.id} className="border-t border-white/10">
                    <td className="py-3">{view.page_type}</td>
                    <td className="py-3">{view.utm_source || "direct / unknown"}</td>
                    <td className="py-3">{view.utm_campaign || "-"}</td>
                    <td className="py-3 text-white/55">
                      {new Date(view.created_at).toLocaleString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-white/45">{title}</p>
      <p className="mt-3 text-4xl font-semibold">{value}</p>
    </div>
  );
}