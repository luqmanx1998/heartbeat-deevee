"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import { createClient } from "@/app/lib/supabase/client";

const font2 = localFont({
  src: "../../../fonts/NeueMontreal-Regular.woff2",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const VISIBLE_ORDER_STATUSES = [
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default function OrdersPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);

  const [confirmOrder, setConfirmOrder] = useState(null);
  const [confirmMode, setConfirmMode] = useState(null);
  const [withdrawalNote, setWithdrawalNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionNotice, setActionNotice] = useState("");

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      setAuthLoading(true);
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Failed to get user:", userError.message);
        if (!ignore) {
          setUser(null);
          setOrders([]);
          setOrderItems([]);
          setAuthLoading(false);
          setLoading(false);
        }
        return;
      }

      if (!user) {
        if (!ignore) {
          setUser(null);
          setOrders([]);
          setOrderItems([]);
          setAuthLoading(false);
          setLoading(false);
        }
        return;
      }

      if (!ignore) {
        setUser(user);
        setAuthLoading(false);
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .in("status", VISIBLE_ORDER_STATUSES)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Failed to load customer orders:", ordersError.message);
        if (!ignore) {
          setOrders([]);
          setOrderItems([]);
          setLoading(false);
        }
        return;
      }

      const safeOrders = ordersData ?? [];
      const orderIds = safeOrders.map((order) => order.id);

      let itemsData = [];
      if (orderIds.length > 0) {
        const { data: fetchedItems, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds)
          .order("created_at", { ascending: true });

        if (itemsError) {
          console.error(
            "Failed to load customer order items:",
            itemsError.message,
          );
          if (!ignore) {
            setOrders(safeOrders);
            setOrderItems([]);
            setLoading(false);
          }
          return;
        }

        itemsData = fetchedItems ?? [];
      }

      if (!ignore) {
        setOrders(safeOrders);
        setOrderItems(itemsData);
        setLoading(false);
      }
    }

    loadPage();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  const totalOrders = orders.length;

  function getItemsForOrder(orderId) {
    return orderItems.filter((item) => item.order_id === orderId);
  }

  function toggleOrder(orderId) {
    setOpenOrderId((current) => (current === orderId ? null : orderId));
  }

  function openCancelModal(order) {
    setConfirmOrder(order);
    setConfirmMode("cancel");
    setWithdrawalNote("");
    setActionError("");
    setActionNotice("");
  }

  function openWithdrawalModal(order) {
    setConfirmOrder(order);
    setConfirmMode("withdrawal");
    setWithdrawalNote(order.withdrawal_notes || "");
    setActionError("");
    setActionNotice("");
  }

  function closeConfirmModal() {
    if (actionLoading) return;
    setConfirmOrder(null);
    setConfirmMode(null);
    setWithdrawalNote("");
    setActionError("");
  }

  async function handleCancelOrder() {
    if (!confirmOrder) return;

    try {
      setActionLoading(true);
      setActionError("");

      const res = await fetch("/api/customer-cancel-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: confirmOrder.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "Stornierung fehlgeschlagen.");
        return;
      }

      const now = new Date().toISOString();

      setOrders((prev) =>
        prev.map((order) =>
          order.id === confirmOrder.id
            ? {
                ...order,
                status: "cancelled",
                refunded_at: now,
                stripe_refund_id: data.refund?.id,
              }
            : order,
        ),
      );

      setActionNotice("Die Bestellung wurde storniert und erstattet.");
      setConfirmOrder(null);
      setConfirmMode(null);
    } catch {
      setActionError("Etwas ist schiefgelaufen.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRequestWithdrawal() {
    if (!confirmOrder) return;

    try {
      setActionLoading(true);
      setActionError("");

      const res = await fetch("/api/request-withdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: confirmOrder.id,
          note: withdrawalNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "Widerruf konnte nicht angefordert werden.");
        return;
      }

      const now = new Date().toISOString();

      setOrders((prev) =>
        prev.map((order) =>
          order.id === confirmOrder.id
            ? {
                ...order,
                withdrawal_requested_at: now,
                withdrawal_status: "requested",
                withdrawal_notes: withdrawalNote.trim() || null,
              }
            : order,
        ),
      );

      setActionNotice("Dein Widerruf wurde erfolgreich übermittelt.");
      setConfirmOrder(null);
      setConfirmMode(null);
      setWithdrawalNote("");
    } catch {
      setActionError("Etwas ist schiefgelaufen.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <section>
      {actionNotice && (
        <div className="mb-5 rounded-[22px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-[15px] text-emerald-800">
          {actionNotice}
        </div>
      )}

      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div>
          <p
            className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8a7f73]`}
          >
            Bestellungen
          </p>

          <h1 className="mt-3 text-[clamp(34px,5vw,56px)] font-semibold leading-none text-[#181311]">
            Meine Bestellungen
          </h1>

          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#6b625a]">
            Hier findest du deine bezahlten Bestellungen, den aktuellen Status
            und alle Details zu deinen Artikeln.
          </p>
        </div>

        <InfoCard
          label="Bestellungen"
          value={loading ? "—" : String(totalOrders)}
          font2={font2}
        />
      </header>

      {authLoading ? (
        <NoticeCard text="Konto wird geladen..." font2={font2} />
      ) : !user ? (
        <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-[28px] font-semibold text-[#181311]">
            Bitte anmelden
          </h2>
          <p className="mt-3 max-w-xl text-[16px] leading-7 text-[#6b625a]">
            Du musst angemeldet sein, um deine Bestellungen anzusehen.
          </p>

          <div className="mt-6">
            <Link
              href="/store"
              className={`${font2.className} inline-flex items-center justify-center rounded-full border border-[#181311] bg-[#181311] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white transition hover:opacity-90`}
            >
              Zum Shop
            </Link>
          </div>
        </div>
      ) : (
        <section className="space-y-5">
          {loading ? (
            <NoticeCard text="Bestellungen werden geladen..." font2={font2} />
          ) : orders.length === 0 ? (
            <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-[28px] font-semibold text-[#181311]">
                Noch keine Bestellungen
              </h2>
              <p className="mt-3 max-w-xl text-[16px] leading-7 text-[#6b625a]">
                Sobald du eine Bestellung abgeschlossen hast, erscheint sie hier.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const items = getItemsForOrder(order.id);
              const isOpen = openOrderId === order.id;
              const normalizedStatus = String(order.status || "").toLowerCase();
              const canCancel = normalizedStatus === "paid";
              const canRequestWithdrawal = ["shipped", "delivered"].includes(
                normalizedStatus,
              );
              const withdrawalRequested = Boolean(order.withdrawal_requested_at);

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-[28px] border border-[#e6ddd2] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
                >
                  <div className="grid gap-5 px-6 py-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto] lg:items-center">
                    <div>
                      <p
                        className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                      >
                        Bestellnummer
                      </p>
                      <p className="mt-2 break-all text-[22px] font-medium leading-[1.25] text-[#181311]">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                      >
                        Datum
                      </p>
                      <p className="mt-2 text-[18px] text-[#2c2521]">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                      >
                        Status
                      </p>
                      <div className="mt-2">
                        <StatusPill status={order.status} font2={font2} />
                      </div>
                    </div>

                    <div>
                      <p
                        className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                      >
                        Gesamtbetrag
                      </p>
                      <p className="mt-2 text-[24px] font-medium text-[#181311]">
                        €{Number(order.total ?? 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="lg:text-right">
                      <button
                        onClick={() => toggleOrder(order.id)}
                        className={`${font2.className} inline-flex cursor-pointer items-center justify-center rounded-full border border-[#d9d1c7] bg-[#f8f5f0] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#2a211d] transition hover:border-[#c8beb3] hover:bg-[#f1ece5]`}
                      >
                        {isOpen ? "Details ausblenden" : "Details ansehen"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-[#eee5da] bg-[#fcfaf7] px-6 py-6">
                      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
                        <div>
                          <h3 className="text-[26px] font-semibold text-[#181311]">
                            Artikel
                          </h3>

                          <div className="mt-5 space-y-4">
                            {items.length === 0 ? (
                              <p className="text-[15px] text-[#6b625a]">
                                Keine Artikel für diese Bestellung gefunden.
                              </p>
                            ) : (
                              items.map((item) => (
                                <div
                                  key={item.id}
                                  className="grid gap-4 rounded-[22px] border border-[#e6ddd2] bg-white p-4 sm:grid-cols-[100px_1fr]"
                                >
                                  <div className="overflow-hidden rounded-[18px] border border-[#eee5da] bg-[#f7f2ec]">
                                    {item.product_image ? (
                                      <Image
                                        src={item.product_image}
                                        alt={item.product_name}
                                        width={240}
                                        height={240}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-[100px] w-full bg-[#f1ebe4]" />
                                    )}
                                  </div>

                                  <div>
                                    <h4 className="text-[24px] font-medium leading-[1.15] text-[#181311]">
                                      {item.product_name}
                                    </h4>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                      <MiniCard
                                        label="Menge"
                                        value={String(item.quantity)}
                                        font2={font2}
                                      />
                                      <MiniCard
                                        label="Einzelpreis"
                                        value={`€${Number(item.unit_price ?? 0).toFixed(2)}`}
                                        font2={font2}
                                      />
                                      <MiniCard
                                        label="Zwischensumme"
                                        value={`€${Number(item.subtotal ?? 0).toFixed(2)}`}
                                        font2={font2}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-[26px] font-semibold text-[#181311]">
                            Versand
                          </h3>

                          <div className="mt-5 rounded-[22px] border border-[#e6ddd2] bg-white p-5">
                            <p
                              className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                            >
                              Lieferadresse
                            </p>
                            <p className="mt-3 whitespace-pre-line text-[18px] leading-8 text-[#2c2521]">
                              {order.shipping_address ||
                                "Keine Adresse vorhanden."}
                            </p>
                          </div>

                          <div className="mt-4 rounded-[22px] border border-[#e6ddd2] bg-white p-5">
                            <p
                              className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                            >
                              E-Mail-Adresse
                            </p>
                            <p className="mt-3 break-all text-[18px] leading-8 text-[#2c2521]">
                              {order.customer_email}
                            </p>
                          </div>

                          <div className="mt-4 rounded-[22px] border border-[#e6ddd2] bg-white p-5">
                            <p
                              className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                            >
                              Widerruf / Stornierung
                            </p>

                            {normalizedStatus === "paid" && (
                              <p className="mt-3 text-[15px] leading-7 text-[#6b625a]">
                                Diese Bestellung wurde noch nicht versendet. Du
                                kannst sie stornieren und die Zahlung wird über
                                die ursprüngliche Zahlungsmethode erstattet.
                              </p>
                            )}

                            {["shipped", "delivered"].includes(
                              normalizedStatus,
                            ) && (
                              <p className="mt-3 text-[15px] leading-7 text-[#6b625a]">
                                Diese Bestellung wurde bereits versendet. Du
                                kannst dein Widerrufsrecht online ausüben. Die
                                Rückerstattung erfolgt nach Eingang der Rücksendung
                                oder nach Vorlage eines Rücksendenachweises.
                              </p>
                            )}

                            {withdrawalRequested && (
                              <div className="mt-4 rounded-[18px] border border-[#ead6ae] bg-[#fff7e4] p-4 text-[#7d5a10]">
                                <p
                                  className={`${font2.className} text-[10px] uppercase tracking-[0.18em]`}
                                >
                                  Widerruf angefordert
                                </p>
                                <p className="mt-2 text-[15px] leading-6">
                                  Dein Widerruf wurde am{" "}
                                  {formatDate(order.withdrawal_requested_at)}{" "}
                                  übermittelt.
                                </p>
                              </div>
                            )}

                            <div className="mt-5 flex flex-col gap-3">
                              {canCancel && (
                                <button
                                  onClick={() => openCancelModal(order)}
                                  className={`${font2.className} inline-flex cursor-pointer items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-red-800 transition hover:bg-red-100`}
                                >
                                  Bestellung stornieren
                                </button>
                              )}

                              {canRequestWithdrawal && !withdrawalRequested && (
                                <button
                                  onClick={() => openWithdrawalModal(order)}
                                  className={`${font2.className} inline-flex cursor-pointer items-center justify-center rounded-full border border-[#d9d1c7] bg-[#f8f5f0] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#2a211d] transition hover:border-[#c8beb3] hover:bg-[#f1ece5]`}
                                >
                                  Widerruf anfordern
                                </button>
                              )}

                              {["cancelled", "refunded"].includes(
                                normalizedStatus,
                              ) && (
                                <p className="text-[15px] leading-7 text-[#6b625a]">
                                  Für diese Bestellung ist keine weitere Aktion
                                  verfügbar.
                                </p>
                              )}

                              <p className="text-[13px] leading-6 text-[#8b7f72]">
                                Bei Fragen oder Problemen erreichst du uns unter{" "}
                                <a
                                  href="mailto:xdeeveee@gmail.com"
                                  className="font-medium text-[#181311] underline underline-offset-4"
                                >
                                  xdeeveee@gmail.com
                                </a>
                                .
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      )}

      {confirmOrder && confirmMode === "cancel" && (
        <ConfirmModal
          title="Bestellung stornieren?"
          eyebrow="Stornierung bestätigen"
          body="Dadurch wird deine Bestellung storniert und die Zahlung über die ursprüngliche Zahlungsmethode zurückerstattet. Diese Aktion kann nicht rückgängig gemacht werden."
          confirmLabel={actionLoading ? "Storniere..." : "Ja, stornieren"}
          cancelLabel="Abbrechen"
          error={actionError}
          isLoading={actionLoading}
          onClose={closeConfirmModal}
          onConfirm={handleCancelOrder}
          font2={font2}
          ibmPlexSerif={ibmPlexSerif}
          danger
        />
      )}

      {confirmOrder && confirmMode === "withdrawal" && (
        <WithdrawalModal
          note={withdrawalNote}
          setNote={setWithdrawalNote}
          error={actionError}
          isLoading={actionLoading}
          onClose={closeConfirmModal}
          onConfirm={handleRequestWithdrawal}
          font2={font2}
          ibmPlexSerif={ibmPlexSerif}
        />
      )}
    </section>
  );
}

function ConfirmModal({
  title,
  eyebrow,
  body,
  confirmLabel,
  cancelLabel,
  error,
  isLoading,
  onClose,
  onConfirm,
  font2,
  ibmPlexSerif,
  danger = false,
}) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-[#e6ddd2] bg-white p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
        <p
          className={`${font2.className} text-[10px] uppercase tracking-[0.24em] ${
            danger ? "text-red-700/70" : "text-[#8b7f72]"
          }`}
        >
          {eyebrow}
        </p>

        <h3
          className={`${ibmPlexSerif.className} mt-4 text-[32px] leading-[1.05] text-[#181311]`}
        >
          {title}
        </h3>

        <p className="mt-4 text-[16px] leading-[1.65] text-[#6b625a]">{body}</p>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <div className="mt-7 flex gap-3">
          <button
            disabled={isLoading}
            onClick={onClose}
            className={`${font2.className} flex-1 cursor-pointer rounded-[16px] border border-[#d9d1c7] bg-[#f8f5f0] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#2a211d] transition hover:bg-[#f1ece5] disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {cancelLabel}
          </button>

          <button
            disabled={isLoading}
            onClick={onConfirm}
            className={`${font2.className} flex-1 cursor-pointer rounded-[16px] border px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-50 ${
              danger
                ? "border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
                : "border-[#181311] bg-[#181311] text-white hover:opacity-90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function WithdrawalModal({
  note,
  setNote,
  error,
  isLoading,
  onClose,
  onConfirm,
  font2,
  ibmPlexSerif,
}) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-[#e6ddd2] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
        <p
          className={`${font2.className} text-center text-[10px] uppercase tracking-[0.24em] text-[#8b7f72]`}
        >
          Widerruf online ausüben
        </p>

        <h3
          className={`${ibmPlexSerif.className} mt-4 text-center text-[32px] leading-[1.05] text-[#181311]`}
        >
          Widerruf anfordern?
        </h3>

        <p className="mt-4 text-[16px] leading-[1.65] text-[#6b625a]">
          Du kannst dein gesetzliches Widerrufsrecht innerhalb von 14 Tagen nach
          Erhalt der Ware ausüben. Nach Eingang deiner Erklärung erhältst du eine
          Bestätigung. Die Rückzahlung kann verweigert werden, bis die Ware
          zurückerhalten wurde oder du einen Rücksendenachweis erbracht hast.
        </p>

        <label
          className={`${font2.className} mt-5 block text-[10px] uppercase tracking-[0.2em] text-[#8b7f72]`}
        >
          Nachricht optional
        </label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          placeholder="Optional: Teile uns hier etwas zu deinem Widerruf mit."
          className="mt-3 min-h-[120px] w-full resize-y rounded-[18px] border border-[#e6ddd2] bg-[#fcfaf7] p-4 text-[#181311] outline-none transition placeholder:text-[#8b7f72]/55 focus:border-[#c8beb3]"
        />

        <p className="mt-2 text-right text-[12px] text-[#8b7f72]">
          {note.length}/500
        </p>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <div className="mt-7 flex gap-3">
          <button
            disabled={isLoading}
            onClick={onClose}
            className={`${font2.className} flex-1 cursor-pointer rounded-[16px] border border-[#d9d1c7] bg-[#f8f5f0] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#2a211d] transition hover:bg-[#f1ece5] disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Abbrechen
          </button>

          <button
            disabled={isLoading}
            onClick={onConfirm}
            className={`${font2.className} flex-1 cursor-pointer rounded-[16px] border border-[#181311] bg-[#181311] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isLoading ? "Sende..." : "Widerruf senden"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NoticeCard({ text, font2 }) {
  return (
    <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
      <p
        className={`${font2.className} text-[12px] uppercase tracking-[0.18em] text-[#8b7f72]`}
      >
        {text}
      </p>
    </div>
  );
}

function InfoCard({ label, value, font2 }) {
  return (
    <div className="flex-1 rounded-[24px] border border-[#e6ddd2] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
      <p
        className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
      >
        {label}
      </p>
      <p className="mt-4 text-[40px] font-semibold leading-none text-[#181311]">
        {value}
      </p>
    </div>
  );
}

function MiniCard({ label, value, font2 }) {
  return (
    <div className="rounded-[18px] border border-[#e6ddd2] bg-[#fcfaf7] p-4">
      <p
        className={`${font2.className} text-[10px] uppercase tracking-[0.18em] text-[#8b7f72]`}
      >
        {label}
      </p>
      <p className="mt-3 text-[22px] font-medium text-[#181311]">{value}</p>
    </div>
  );
}

function StatusPill({ status, font2 }) {
  const normalized = String(status || "").toLowerCase();

  const statusStyles = {
    paid: "border-[#cfe8d5] bg-[#eef9f0] text-[#1f6a30]",
    shipped: "border-[#cfe1f5] bg-[#eef6fd] text-[#245b94]",
    delivered: "border-[#ddd2f6] bg-[#f5f1fd] text-[#6240a8]",
    cancelled: "border-[#f1d0d0] bg-[#fdf1f1] text-[#9a3737]",
    refunded: "border-[#d9d1c7] bg-[#f8f5f0] text-[#4d433b]",
  };

  const statusLabels = {
    paid: "Bezahlt",
    shipped: "Versendet",
    delivered: "Geliefert",
    cancelled: "Storniert",
    refunded: "Erstattet",
  };

  return (
    <span
      className={`${font2.className} inline-flex rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] ${
        statusStyles[normalized] ||
        "border-[#e6ddd2] bg-[#f7f2ec] text-[#4d433b]"
      }`}
    >
      {statusLabels[normalized] || "Unbekannt"}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
