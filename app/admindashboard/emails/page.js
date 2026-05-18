"use client";

import { useState } from "react";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import Link from "next/link";

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

export default function EmailsPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function handleSendNewsletter(e) {
    e.preventDefault();

    setNotice("");
    setError("");

    if (!subject.trim()) {
      setError("Bitte gib einen Betreff ein.");
      return;
    }

    if (!message.trim()) {
      setError("Bitte gib eine Nachricht ein.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Newsletter konnte nicht gesendet werden.");
        return;
      }

      setNotice(`Newsletter wurde gesendet. Empfänger: ${data.sentCount ?? "-"}`);
      setSubject("");
      setMessage("");
    } catch {
      setError("Etwas ist schiefgelaufen.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
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

      <header className="relative mb-10 text-center">
        <h1
          className={`${segamoriz.className} text-[clamp(42px,5vw,72px)] leading-[0.96] tracking-[0.01em] text-[#f3dfb7] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]`}
        >
          Emails
        </h1>

        <div className="mx-auto mt-4 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b89154]/60" />
          <span className="text-[#d2aa6a]">☾</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b89154]/60" />
        </div>

        <p
          className={`${ibmPlexSerif.className} mx-auto mt-5 max-w-3xl text-[18px] leading-[1.7] text-[#e4d4be]/82`}
        >
          Sende Updates an bestätigte Newsletter-Abonnenten und verwalte
          Deevee-Kommunikation an einem Ort.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[30px] border border-[#8d693b]/55 bg-[linear-gradient(180deg,rgba(19,13,12,0.78),rgba(11,8,10,0.7))] p-6 shadow-[0_22px_45px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(205,171,114,0.06)]">
          <p
            className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/55`}
          >
            Email Center
          </p>

          <h2
            className={`${ibmPlexSerif.className} mt-4 text-[34px] leading-[1.05] text-[#f4dfba]`}
          >
            Newsletter senden
          </h2>

          <p
            className={`${ibmPlexSerif.className} mt-5 text-[17px] leading-[1.7] text-[#decbb0]/78`}
          >
            Diese Nachricht wird an alle bestätigten Subscriber gesendet.
            Versandbestätigungen für einzelne Bestellungen laufen später direkt
            über die Orders-Seite.
          </p>

          <div className="mt-8 grid gap-4">
            <InfoCard label="Empfänger" value="Confirmed subscribers" />
            <InfoCard label="Typ" value="Newsletter campaign" />
            <InfoCard label="Status" value="Manual send" />
          </div>
        </div>

        <form
          onSubmit={handleSendNewsletter}
          className="rounded-[30px] border border-[#8d693b]/55 bg-[linear-gradient(180deg,rgba(19,13,12,0.78),rgba(11,8,10,0.7))] p-6 shadow-[0_22px_45px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(205,171,114,0.06)]"
        >
          <label className="block">
            <p
              className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/55`}
            >
              Betreff
            </p>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="z.B. Heartbeat Presale Update"
              className={`${ibmPlexSerif.className} mt-3 w-full rounded-[20px] border border-[#8d693b]/35 bg-[rgba(18,12,10,0.72)] px-5 py-4 text-[20px] text-[#f5dfb8] outline-none placeholder:text-[#d6c2a0]/35 focus:border-[#b89154]/65`}
            />
          </label>

          <label className="mt-6 block">
            <p
              className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/55`}
            >
              Nachricht
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schreibe hier die Nachricht an deine Leser:innen..."
              rows={12}
              className={`${ibmPlexSerif.className} mt-3 w-full resize-none rounded-[20px] border border-[#8d693b]/35 bg-[rgba(18,12,10,0.72)] px-5 py-4 text-[18px] leading-[1.65] text-[#f5dfb8] outline-none placeholder:text-[#d6c2a0]/35 focus:border-[#b89154]/65`}
            />
          </label>

          {error && (
            <p className={`${font2.className} mt-5 text-sm text-red-200`}>
              {error}
            </p>
          )}

          {notice && (
            <p className={`${font2.className} mt-5 text-sm text-[#f3d4a2]`}>
              {notice}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p
              className={`${font2.className} text-[11px] uppercase tracking-[0.18em] text-[#d6c2a0]/45`}
            >
              Bitte vor dem Senden prüfen.
            </p>

            <button
              disabled={sending}
              className={`${font2.className} inline-flex cursor-pointer items-center justify-center rounded-[16px] border border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#f7e3bc] shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.08)] transition hover:-translate-y-[1px] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {sending ? "Wird gesendet..." : "Newsletter senden"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-[22px] border border-[#8d693b]/45 bg-[linear-gradient(180deg,rgba(31,20,15,0.82),rgba(18,12,10,0.72))] p-4 shadow-[0_14px_24px_rgba(0,0,0,0.22)]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/55">
        {label}
      </p>
      <p className="mt-3 text-[24px] text-[#f5dfb8]">{value}</p>
    </div>
  );
}