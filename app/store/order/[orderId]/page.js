"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useParams, useSearchParams } from "next/navigation";

const font2 = localFont({
  src: "../../../fonts/NeueMontreal-Regular.woff2",
});

export default function GuestOrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId = params.orderId;
  const token = searchParams.get("token");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [withdrawalNote, setWithdrawalNote] = useState("");

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      setError("");

      const res = await fetch(
        `/api/guest-order?orderId=${orderId}&token=${token}`,
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Bestellung konnte nicht geladen werden.");
        setLoading(false);
        return;
      }

      setOrder(data.order);
      setItems(data.items ?? []);
      setLoading(false);
    }

    if (orderId && token) loadOrder();
  }, [orderId, token]);

  async function runAction(action) {
    setActionLoading(true);
    setError("");
    setNotice("");

    const res = await fetch("/api/guest-order-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        token,
        action,
        note: withdrawalNote,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Aktion fehlgeschlagen.");
      setActionLoading(false);
      return;
    }

    setNotice(data.message || "Aktualisiert.");

    if (action === "cancel") {
      setOrder((prev) => ({
        ...prev,
        status: "cancelled",
        refunded_at: new Date().toISOString(),
      }));
      setShowCancelConfirm(false);
    }

    if (action === "withdrawal") {
      setOrder((prev) => ({
        ...prev,
        withdrawal_status: "requested",
        withdrawal_requested_at: new Date().toISOString(),
        withdrawal_notes: withdrawalNote || null,
      }));
      setShowWithdrawalConfirm(false);
    }

    setActionLoading(false);
  }

  const status = String(order?.status || "").toLowerCase();
  const canCancel = status === "paid";
  const canRequestWithdrawal =
    ["shipped", "delivered"].includes(status) &&
    order?.withdrawal_status !== "requested";

  return (
    <main className={`${font2.className} min-h-screen bg-[#090909] text-white`}>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(74,109,190,0.18),transparent_34%),linear-gradient(to_bottom,#0b0b0d,#090909)] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/store"
            className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
          >
            ← Zurück zum Shop
          </Link>

          <header className="mt-10">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#f3d4a2]/55">
              Deevee Bestellung
            </p>

            <h1 className="mt-4 text-[clamp(38px,6vw,72px)] font-semibold leading-[0.95] tracking-[-0.04em]">
              Bestellung verwalten
            </h1>

            <p className="mt-5 max-w-2xl text-[16px] leading-7 text-white/58">
              Hier kannst du deine Bestellung ansehen, stornieren oder dein
              Widerrufsrecht ausüben.
            </p>
          </header>

          {loading ? (
            <Card className="mt-10">
              <p className="text-white/60">Bestellung wird geladen...</p>
            </Card>
          ) : error ? (
            <Card className="mt-10">
              <p className="text-red-200">{error}</p>
            </Card>
          ) : (
            <>
              {notice && (
                <div className="mt-8 rounded-[22px] border border-emerald-300/20 bg-emerald-950/30 p-5 text-emerald-100">
                  {notice}
                </div>
              )}

              <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="space-y-5">
                  <Card>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                      Bestellnummer
                    </p>
                    <p className="mt-2 break-all text-[20px] text-white">
                      {order.id}
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <Mini label="Status" value={translateStatus(status)} />
                      <Mini
                        label="Datum"
                        value={formatDate(order.created_at)}
                      />
                      <Mini
                        label="Gesamt"
                        value={`€${Number(order.total ?? 0).toFixed(2)}`}
                      />
                    </div>
                  </Card>

                  <Card>
                    <h2 className="text-[28px] font-semibold">
                      Bestellpositionen
                    </h2>

                    <div className="mt-5 space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="grid gap-4 rounded-[22px] border border-white/10 bg-black/20 p-4 sm:grid-cols-[100px_1fr]"
                        >
                          <div className="overflow-hidden rounded-[16px] border border-white/10 bg-white/5">
                            {item.product_image ? (
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                width={220}
                                height={220}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-[100px] bg-white/5" />
                            )}
                          </div>

                          <div>
                            <h3 className="text-[22px] font-semibold">
                              {item.product_name}
                            </h3>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                              <Mini label="Menge" value={item.quantity} />
                              <Mini
                                label="Einzelpreis"
                                value={`€${Number(item.unit_price ?? 0).toFixed(2)}`}
                              />
                              <Mini
                                label="Zwischensumme"
                                value={`€${Number(item.subtotal ?? 0).toFixed(2)}`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <aside className="space-y-5">
                  <Card>
                    <h2 className="text-[24px] font-semibold">Lieferung</h2>
                    <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-white/70">
                      {order.shipping_address || "Keine Lieferadresse vorhanden."}
                    </p>
                  </Card>

                  <Card>
                    <h2 className="text-[24px] font-semibold">
                      Stornierung & Widerruf
                    </h2>

                    {canCancel && (
                      <>
                        <p className="mt-4 text-[15px] leading-7 text-white/65">
                          Deine Bestellung wurde noch nicht versendet. Du kannst
                          sie hier stornieren. Die Zahlung wird über die
                          ursprüngliche Zahlungsmethode zurückerstattet.
                        </p>

                        <button
                          onClick={() => setShowCancelConfirm(true)}
                          className="mt-5 w-full rounded-full border border-red-300/25 bg-red-950/40 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-900/50"
                        >
                          Bestellung stornieren
                        </button>
                      </>
                    )}

                    {canRequestWithdrawal && (
                      <>
                        <p className="mt-4 text-[15px] leading-7 text-white/65">
                          Deine Bestellung wurde bereits versendet. Du kannst
                          dein Widerrufsrecht online ausüben. Die Rückerstattung
                          erfolgt nach Eingang oder Nachweis der Rücksendung.
                        </p>

                        <button
                          onClick={() => setShowWithdrawalConfirm(true)}
                          className="mt-5 w-full rounded-full border border-[#f3d4a2]/25 bg-[#4a2d14]/40 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#f3d4a2] transition hover:bg-[#4a2d14]/60"
                        >
                          Widerruf anfordern
                        </button>
                      </>
                    )}

                    {order.withdrawal_status === "requested" && (
                      <p className="mt-4 rounded-[18px] border border-[#f3d4a2]/20 bg-[#4a2d14]/25 p-4 text-[14px] leading-6 text-[#f3d4a2]">
                        Dein Widerruf wurde übermittelt.
                      </p>
                    )}

                    {["cancelled", "refunded"].includes(status) && (
                      <p className="mt-4 rounded-[18px] border border-emerald-300/20 bg-emerald-950/25 p-4 text-[14px] leading-6 text-emerald-100">
                        Diese Bestellung wurde bereits storniert oder
                        zurückerstattet.
                      </p>
                    )}

                    {status === "pending" && (
                      <p className="mt-4 text-[14px] leading-6 text-white/50">
                        Diese Bestellung wartet noch auf die Zahlungsbestätigung.
                      </p>
                    )}
                  </Card>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>

      {showCancelConfirm && (
        <ConfirmModal
          title="Bestellung wirklich stornieren?"
          text="Dadurch wird deine Zahlung über Stripe an die ursprüngliche Zahlungsmethode zurückerstattet."
          confirmText={actionLoading ? "Storniere..." : "Ja, stornieren"}
          onCancel={() => setShowCancelConfirm(false)}
          onConfirm={() => runAction("cancel")}
          disabled={actionLoading}
        />
      )}

      {showWithdrawalConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-[#f3d4a2]/20 bg-[#111113] p-6">
            <h3 className="text-[30px] font-semibold">
              Widerruf anfordern?
            </h3>

            <p className="mt-4 text-[15px] leading-7 text-white/65">
              Du kannst optional eine kurze Nachricht hinzufügen.
            </p>

            <textarea
              value={withdrawalNote}
              onChange={(e) => setWithdrawalNote(e.target.value)}
              placeholder="Optional: Nachricht zu deinem Widerruf"
              className="mt-5 min-h-[120px] w-full rounded-[18px] border border-white/10 bg-white/[0.04] p-4 text-white outline-none placeholder:text-white/35"
            />

            <div className="mt-6 flex gap-3">
              <button
                disabled={actionLoading}
                onClick={() => setShowWithdrawalConfirm(false)}
                className="flex-1 rounded-[16px] border border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white/70"
              >
                Abbrechen
              </button>

              <button
                disabled={actionLoading}
                onClick={() => runAction("withdrawal")}
                className="flex-1 rounded-[16px] bg-[#f2e6d7] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-black"
              >
                {actionLoading ? "Sende..." : "Widerruf senden"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/25 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>
      <p className="mt-2 break-words text-[18px] text-white">{value}</p>
    </div>
  );
}

function ConfirmModal({
  title,
  text,
  confirmText,
  onCancel,
  onConfirm,
  disabled,
}) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-red-300/20 bg-[#111113] p-6">
        <h3 className="text-[30px] font-semibold text-red-100">{title}</h3>

        <p className="mt-4 text-[15px] leading-7 text-red-50/70">{text}</p>

        <div className="mt-6 flex gap-3">
          <button
            disabled={disabled}
            onClick={onCancel}
            className="flex-1 rounded-[16px] border border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white/70"
          >
            Abbrechen
          </button>

          <button
            disabled={disabled}
            onClick={onConfirm}
            className="flex-1 rounded-[16px] bg-red-950/70 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-red-100"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function translateStatus(status) {
  const map = {
    pending: "Ausstehend",
    paid: "Bezahlt",
    shipped: "Versendet",
    delivered: "Geliefert",
    cancelled: "Storniert",
    refunded: "Zurückerstattet",
  };

  return map[status] || status || "Unbekannt";
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("de-DE");
}