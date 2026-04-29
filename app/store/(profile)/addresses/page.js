"use client";

import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import { countries } from "@/app/constants/countries";
import { createClient } from "@/app/lib/supabase/client";

const font2 = localFont({
  src: "../../../fonts/NeueMontreal-Regular.woff2",
});

export default function Page() {
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    country: "Germany",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
  });

  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadAddress() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!ignore) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Failed to load address:", error.message);
      }

      if (!ignore && data) {
        setSavedAddress(data);

        setForm({
          full_name: data.full_name || "",
          country: data.country || "Germany",
          address_line_1: data.address_line_1 || "",
          address_line_2: data.address_line_2 || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
        });
      }

      if (!ignore) setLoading(false);
    }

    loadAddress();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const payload = {
      user_id: user.id,
      full_name: form.full_name,
      country: form.country,
      address_line_1: form.address_line_1,
      address_line_2: form.address_line_2,
      city: form.city,
      state: form.state,
      postal_code: form.postal_code,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("addresses")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      console.error("Failed to save address:", error.message);
      setSaving(false);
      return;
    }

    setSavedAddress(data);
    setSaving(false);
  }

  return (
    <section>
      <header className="mb-8">
        <p
          className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8a7f73]`}
        >
          Addresses
        </p>

        <h1 className="mt-3 text-[clamp(34px,5vw,56px)] font-semibold leading-none text-[#181311]">
          My Address
        </h1>

        <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#6b625a]">
          Save your shipping address for faster checkout.
        </p>
      </header>

      {loading ? (
        <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <p
            className={`${font2.className} text-[11px] uppercase tracking-[0.18em] text-[#8a7f73]`}
          >
            Loading address...
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
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
              />

              <Select
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                options={countries}
              />

              <Input
                label="Address Line 1"
                name="address_line_1"
                value={form.address_line_1}
                onChange={handleChange}
              />

              <Input
                label="Address Line 2"
                name="address_line_2"
                value={form.address_line_2}
                onChange={handleChange}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />

                <Input
                  label="PLZ"
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="State / Region"
                name="state"
                value={form.state}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`${font2.className} mt-8 inline-flex items-center justify-center rounded-full border border-[#181311] bg-[#181311] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer`}
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
          </form>

          <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <p
              className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8a7f73]`}
            >
              Saved Address
            </p>

            {savedAddress && (<div className="mt-6 space-y-5">
              <SummaryItem label="Full Name" value={form.full_name}/>
              <SummaryItem label="Address Line 1" value={form.address_line_1}/>
              <SummaryItem label="Address Line 2" value={form.address_line_2}/>
              <SummaryItem label="City" value={form.city}/>
              <SummaryItem label="State/Region" value={form.state}/>
              <SummaryItem label="PLZ" value={form.postal_code}/>
            </div>    
            )}
          </div>
        </div>
      )}
    </section>
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

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#1b1714]">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-[#e6ddd2] bg-[#faf7f2] px-4 py-3 text-[16px] text-[#1b1714] outline-none transition focus:border-[#cfc4b7]"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#1b1714]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-[#e6ddd2] bg-[#faf7f2] px-4 py-3 text-[16px] text-[#1b1714] outline-none transition focus:border-[#cfc4b7]"
      >
        {options.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
}