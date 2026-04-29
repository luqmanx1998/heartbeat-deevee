import AccountSidebar from "@/app/components/AccountSidebar";
import localFont from "next/font/local";

const font2 = localFont({
  src: "../../fonts/NeueMontreal-Regular.woff2",
});

export default function Layout({ children }) {
  return (
    <main className={`${font2.className} min-h-screen bg-[#f6f2ec] text-[#1b1714]`}>
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <AccountSidebar />
          {children}
        </div>
      </div>
    </main>
  );
}