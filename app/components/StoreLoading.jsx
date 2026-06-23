export default function StoreLoading({ text = "Bitte warten" }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#090909]">
      <div className="relative flex h-[72px] w-[72px] items-center justify-center">
        <div
          className="absolute h-[72px] w-[72px] animate-spin rounded-full border border-[#f3d4a2]/25 border-t-[#f3d4a2]/70"
          style={{ animationDuration: "2.8s" }}
        />
        <div
          className="absolute h-[52px] w-[52px] animate-spin rounded-full border border-[#af8cff]/20 border-r-[#af8cff]/60"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />
        <div
          className="absolute h-[34px] w-[34px] animate-spin rounded-full border border-[#f3d4a2]/50 border-l-transparent"
          style={{ animationDuration: "1.4s" }}
        />
        <div className="h-[5px] w-[5px] rounded-full bg-[#f3d4a2]/90" />
      </div>

      <p className="text-[11px] uppercase tracking-[0.28em] text-[#f3d4a2]/55">
        {text}
      </p>
    </div>
  );
}