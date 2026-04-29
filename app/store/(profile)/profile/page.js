"use client";

import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import { createClient } from "@/app/lib/supabase/client";

const font2 = localFont({
  src: "../../../fonts/NeueMontreal-Regular.woff2",
});

export default function Page() {
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    display_name: "",
    phone: "",
    marketing_emails: false,
  });

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Failed to get user:", userError.message);
        if (!ignore) setLoading(false);
        return;
      }

      if (!user) {
        if (!ignore) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (!ignore) setUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, phone, marketing_emails")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed to load profile:", error.message);
        if (!ignore) setLoading(false);
        return;
      }

      if (!ignore && data) {
        setForm({
          display_name: data.display_name || "",
          phone: data.phone || "",
          marketing_emails: Boolean(data.marketing_emails),
        });
      }

      if (!ignore) setLoading(false);
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: form.display_name,
        phone: form.phone,
        marketing_emails: form.marketing_emails,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Failed to save profile:", error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
  }

  return (
    <section>
      <header className="mb-8">
        <p
          className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8a7f73]`}
        >
          Profile
        </p>

        <h1 className="mt-3 text-[clamp(34px,5vw,56px)] font-semibold leading-none text-[#181311]">
          My Profile
        </h1>

        <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#6b625a]">
          Manage your account details and communication preferences.
        </p>
      </header>

      {loading ? (
        <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <p
            className={`${font2.className} text-[11px] uppercase tracking-[0.18em] text-[#8a7f73]`}
          >
            Loading profile...
          </p>
        </div>
      ) : !user ? (
        <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-[28px] font-semibold text-[#181311]">
            Please sign in
          </h2>
          <p className="mt-3 max-w-xl text-[16px] leading-7 text-[#6b625a]">
            You need to be logged in to view your profile.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-[#e6ddd2] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
          >
            <div className="grid gap-5">
              <Input
                label="Display Name"
                name="display_name"
                value={form.display_name}
                onChange={handleChange}
                placeholder="Your name"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+49 ..."
              />

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1b1714]">
                  Email
                </label>

                <input
                  value={user.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-[#e6ddd2] bg-[#eee8df] px-4 py-3 text-[16px] text-[#6b625a] outline-none"
                />

                <p className="mt-2 text-[13px] leading-6 text-[#8a7f73]">
                  Email changes are managed through your login provider.
                </p>
              </div>

              <label className="flex cursor-pointer gap-4 rounded-2xl border border-[#e6ddd2] bg-[#faf7f2] p-4">
                <input
                  type="checkbox"
                  name="marketing_emails"
                  checked={form.marketing_emails}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-[#181311]"
                />

                <span>
                  <span className="block text-[15px] font-medium text-[#1b1714]">
                    Email updates
                  </span>
                  <span className="mt-1 block text-[14px] leading-6 text-[#6b625a]">
                    Receive updates about new books, presales, and special
                    announcements.
                  </span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`${font2.className} mt-8 inline-flex items-center justify-center rounded-full border border-[#181311] bg-[#181311] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:opacity-50`}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <p
              className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8a7f73]`}
            >
              Account Summary
            </p>

            <div className="mt-6 space-y-5">
              <SummaryItem label="Email" value={user.email || "—"} />
              <SummaryItem
                label="Display Name"
                value={form.display_name || "Not set"}
              />
              <SummaryItem label="Phone" value={form.phone || "Not set"} />
              <SummaryItem
                label="Updates"
                value={form.marketing_emails ? "Subscribed" : "Not subscribed"}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#1b1714]">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#e6ddd2] bg-[#faf7f2] px-4 py-3 text-[16px] text-[#1b1714] outline-none transition placeholder:text-[#aaa095] focus:border-[#cfc4b7]"
      />
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="border-b border-[#eee5da] pb-4 last:border-b-0">
      <p className="text-[13px] uppercase tracking-[0.18em] text-[#8a7f73]">
        {label}
      </p>
      <p className="mt-2 break-all text-[18px] leading-7 text-[#1b1714]">
        {value}
      </p>
    </div>
  );
}