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

  function escapePreviewHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPreviewMessage(value) {
  return escapePreviewHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" style="color:#b8924f; text-decoration:underline;">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/~~(.*?)~~/g, "<s>$1</s>")
    .replaceAll("\n", "<br/>");
}

  function wrapSelection(before, after = before) {
  const textarea = document.getElementById("newsletter-message");
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = message.slice(start, end);

  const nextMessage =
    message.slice(0, start) +
    before +
    selectedText +
    after +
    message.slice(end);

  setMessage(nextMessage);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(
      start + before.length,
      end + before.length
    );
  });
}

function insertLink() {
  let url = prompt("Link URL:");
  if (!url) return;

  url = url.trim();

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  const textarea = document.getElementById("newsletter-message");
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = message.slice(start, end) || "hier";

  const markdownLink = `[${selectedText}](${url})`;

  const nextMessage =
    message.slice(0, start) + markdownLink + message.slice(end);

  setMessage(nextMessage);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(
      start + markdownLink.length,
      start + markdownLink.length,
    );
  });
}

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

            <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => wrapSelection("**")}
            className={`${font2.className} rounded-full border border-[#8d693b]/35 bg-[#120d12]/75 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#f4dfba] hover:bg-[#2b1b12]`}
          >
            Bold
          </button>

          <button
            type="button"
            onClick={() => wrapSelection("_")}
            className={`${font2.className} rounded-full border border-[#8d693b]/35 bg-[#120d12]/75 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#f4dfba] hover:bg-[#2b1b12]`}
          >
            Italic
          </button>

          <button
            type="button"
            onClick={() => wrapSelection("__")}
            className={`${font2.className} rounded-full border border-[#8d693b]/35 bg-[#120d12]/75 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#f4dfba] hover:bg-[#2b1b12]`}
          >
            Underline
          </button>

          <button
            type="button"
            onClick={() => wrapSelection("~~")}
            className={`${font2.className} rounded-full border border-[#8d693b]/35 bg-[#120d12]/75 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#f4dfba] hover:bg-[#2b1b12]`}
          >
            Strike
          </button>

          <button
            type="button"
            onClick={insertLink}
            className={`${font2.className} rounded-full border border-[#8d693b]/35 bg-[#120d12]/75 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#f4dfba] hover:bg-[#2b1b12]`}
          >
            Link
          </button>
        </div>

                    <textarea
                    id="newsletter-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schreiben Sie hier Ihre Nachricht an Ihre Leser..."
              rows={12}
              className={`${ibmPlexSerif.className} mt-3 w-full resize-none rounded-[20px] border border-[#8d693b]/35 bg-[rgba(18,12,10,0.72)] px-5 py-4 text-[18px] leading-[1.65] text-[#f5dfb8] outline-none placeholder:text-[#d6c2a0]/35 focus:border-[#b89154]/65`}
            />

            <div className="mt-6 rounded-[24px] border border-[#8d693b]/35 bg-white p-5 text-black">
  <p
    className={`${font2.className} mb-4 text-[10px] uppercase tracking-[0.22em] text-[#9b7a43]`}
  >
    Email Preview
  </p>

  <div className="overflow-hidden rounded-[22px] bg-[#0b0b0d] textbox">
    <img
      src="/deeveeemaildark.png"
      alt="Deevee"
      className="block w-full"
    />

    <div className="bg-white p-6">
      <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#b8924f]">
        Deevee Newsletter
      </p>

      <h2 className="text-[28px] font-bold leading-[1.1] text-[#151515]">
        {subject || "Dein Betreff erscheint hier"}
      </h2>

      <div className="mt-6 rounded-[22px] bg-[#111111] p-6 text-[#f4efe8]">
        <div
          className="text-[15px] leading-[1.5]"
          dangerouslySetInnerHTML={{
            __html:
              formatPreviewMessage(message) ||
              "Deine Nachricht erscheint hier...",
          }}
        />
      </div>

      <p className="mt-6 text-[13px] leading-[1.7] text-[#777]">
        Du erhältst diese E-Mail, weil du Deevee Updates abonniert hast.
      </p>
    </div>
  </div>
</div>
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