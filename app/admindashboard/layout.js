
export default function AdminDashboardLayout({ children }) {
  return (
    <main className="relative min-h-screen overflow-hidden text-[#f3e7d3]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(68,48,22,0.42),transparent_26%),radial-gradient(circle_at_top_right,rgba(40,64,98,0.22),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(120,74,20,0.18),transparent_20%),linear-gradient(to_bottom,#0a0910,#0d0a12_35%,#120d12_70%,#0a090d)]" />

      <div className="pointer-events-none absolute inset-0 bg-[url('/bgimage2.png')] bg-cover bg-center opacity-[0.75] mix-blend-screen" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,235,200,0.8)_0.7px,transparent_0.7px)] [background-size:22px_22px]" />

      <div className="pointer-events-none absolute inset-3 rounded-[30px] border border-[#8f6a37]/55 shadow-[inset_0_0_0_1px_rgba(217,182,115,0.16),0_0_40px_rgba(0,0,0,0.35)] sm:inset-5 lg:inset-6" />

      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        {children}
      </div>
    </main>
  );
}