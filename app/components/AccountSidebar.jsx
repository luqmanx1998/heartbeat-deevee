"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import { createClient } from "../lib/supabase/client";
;

const font2 = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
});

export default function AccountSidebar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!ignore) setUser(user ?? null);
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  return (
    <aside className="h-fit rounded-[28px] border border-[#e4dbcf] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
      <p className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8a7f73]`}>
        My Account
      </p>

      <div className="mt-5">
        <p className="break-all text-[18px] font-medium text-[#1b1714]">
          {user?.email || "Guest"}
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        <NavItem href="/store/orders" label="Orders" pathname={pathname} />
        <NavItem href="/store/profile" label="Profile" pathname={pathname} />
        <NavItem href="/store/addresses" label="Addresses" pathname={pathname} />
      </nav>

      <div className="mt-8 border-t border-[#eee5da] pt-5">
        <Link
          href="/store"
          className={`${font2.className} inline-flex items-center justify-center rounded-full border border-[#d9d1c7] bg-white px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#2a211d] transition hover:border-[#c8beb3] hover:bg-[#f6f2ec]`}
        >
          Back to Store
        </Link>
      </div>
    </aside>
  );
}

function NavItem({ href, label, pathname }) {
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`${font2.className} block rounded-2xl border px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition ${
        active
          ? "border-[#d9d0c4] bg-[#f7f3ed] text-[#1f1a17]"
          : "border-transparent text-[#8a7f73] hover:bg-[#f7f3ed]"
      }`}
    >
      {label}
    </Link>
  );
}