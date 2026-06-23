"use client";

import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import { IBM_Plex_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

const FILTERS = [
  { key: "all", label: "Alle" },
  { key: "paid", label: "Paid" },
  { key: "shipped", label: "Versandt" },
  { key: "cancelled", label: "Storniert" },
  { key: "refunded", label: "Zurückerstattet"}
];

const OPERATIONAL_STATUSES = ["paid", "shipped", "cancelled", "refunded"];
const PAGE_SIZE = 5;

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchTerm]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  const updateOrderStatusMutation = useMutation({
  mutationFn: async ({ orderId, status, order, items }) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) throw error;

    if (status === "shipped") {
      const res = await fetch("/api/send-shipping-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            ...order,
            status,
          },
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Shipping email failed.");
      }
    }
  },

  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });

    setSelectedOrder((prev) =>
      prev?.id === variables.orderId
        ? { ...prev, status: variables.status }
        : prev
    );
  },
});

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-orders", activeFilter, page, searchTerm],
    queryFn: () => loadOrdersPage({ supabase, activeFilter, page, searchTerm }),
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 15,
  });

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setSelectedOrder(null);
    }

    if (selectedOrder) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedOrder]);

  const orders = data?.orders ?? [];
  const orderItems = data?.orderItems ?? [];
  const totalCount = data?.totalCount ?? 0;
  const statsCount = data?.statsCount ?? 0;
  const statsRevenue = data?.statsRevenue ?? 0;
  const pendingShipmentCount = data?.pendingShipmentCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function getItemsForOrder(orderId) {
    return orderItems.filter((item) => item.order_id === orderId);
  }

  return (
    <>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          items={getItemsForOrder(selectedOrder.id)}
          onClose={() => setSelectedOrder(null)}
          font2={font2}
          ibmPlexSerif={ibmPlexSerif}
          setSelectedOrder={setSelectedOrder}
          updateOrderStatusMutation={updateOrderStatusMutation}
        />
      )}

        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
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
              Orders
            </h1>

            <div className="mx-auto mt-4 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b89154]/60" />
              <span className="text-[#d2aa6a]">☾</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b89154]/60" />
            </div>

            <p
              className={`${ibmPlexSerif.className} mt-5 text-[clamp(24px,2.3vw,36px)] italic text-[#f7ead6]`}
            >
              Bestellungen im Überblick
            </p>

            <p
              className={`${ibmPlexSerif.className} mx-auto mt-4 max-w-3xl text-[18px] leading-[1.7] text-[#e4d4be]/82`}
            >
              Verfolge bezahlte Bestellungen, Versandstatus und abgeschlossene
              Aufträge an einem Ort.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Bestellungen"
              value={isLoading ? "—" : String(statsCount)}
              icon="✦"
              ibmPlexSerif={ibmPlexSerif}
            />
            <StatCard
              label="Ausstehender Versand"
              value={isLoading ? "—" : String(pendingShipmentCount)}
              icon="❦"
              ibmPlexSerif={ibmPlexSerif}
            />
            <StatCard
              label="Revenue"
              value={isLoading ? "—" : `€${statsRevenue.toFixed(2)}`}
              icon="✧"
              ibmPlexSerif={ibmPlexSerif}
            />
          </section>

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                {FILTERS.map((filter) => {
                  const active = activeFilter === filter.key;

                  return (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`${font2.className} cursor-pointer rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition ${
                        active
                          ? "border-[#b89154]/45 bg-[#4a2d14]/60 text-[#f3d4a2]"
                          : "border-[#8d693b]/35 bg-[#2b1b12]/45 text-[#f4dfba]/75 hover:bg-[#2b1b12]/70"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              <div className="w-full sm:w-[360px]">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search email or order ID..."
                  className={`${font2.className} w-full rounded-full border border-[#8d693b]/35 bg-[#120d12]/75 px-5 py-3 text-[13px] text-[#f4dfba] outline-none placeholder:text-[#f4dfba]/35 focus:border-[#b89154]/60`}
                />
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="overflow-hidden rounded-[26px] border border-[#8d693b]/45 bg-[linear-gradient(180deg,rgba(19,13,12,0.78),rgba(11,8,10,0.7))] shadow-[0_22px_45px_rgba(0,0,0,0.32),inset_0_0_0_1px_rgba(205,171,114,0.06)]">
              <div className="hidden grid-cols-[1.7fr_1.1fr_1fr_1fr_1.1fr_0.8fr] gap-4 border-b border-[#8c6a40]/22 px-6 py-4 lg:grid">
                <p
                  className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
                >
                  Order ID
                </p>
                <p
                  className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
                >
                  Kunde
                </p>
                <p
                  className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
                >
                  Datum
                </p>
                <p
                  className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
                >
                  Status
                </p>
                <p
                  className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
                >
                  Total
                </p>
                <p
                  className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48 text-right`}
                >
                  Aktion
                </p>
              </div>

              {isLoading ? (
                <div className="px-6 py-6">
                  <p className={`${font2.className} text-sm text-[#e1cfb6]/70`}>
                    Lade Bestellungen...
                  </p>
                </div>
              ) : error ? (
                <div className="px-6 py-6">
                  <p className={`${font2.className} text-sm text-red-200/80`}>
                    Bestellungen konnten nicht geladen werden.
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="px-6 py-6">
                  <p className={`${font2.className} text-sm text-[#e1cfb6]/70`}>
                    Keine Bestellungen gefunden.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="border-b border-[#8c6a40]/16 px-6 py-5 last:border-b-0"
                  >
                    <div className="grid gap-4 lg:grid-cols-[1.7fr_1.1fr_1fr_1fr_1.1fr_0.8fr] lg:items-center">
                      <div>
                        <p
                          className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48 lg:hidden`}
                        >
                          Order ID
                        </p>
                        <p
                          className={`${ibmPlexSerif.className} mt-1 text-[16px] leading-[1.2] text-[#f4dfba] break-all`}
                        >
                          {order.id}
                        </p>
                      </div>

                      <div>
                        <p
                          className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48 lg:hidden`}
                        >
                          Kunde
                        </p>
                        <p
                          className={`${ibmPlexSerif.className} mt-1 text-[14px] text-[#f5e4c5] break-all`}
                        >
                          {order.customer_email}
                        </p>
                      </div>

                      <div>
                        <p
                          className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48 lg:hidden`}
                        >
                          Datum
                        </p>
                        <p
                          className={`${ibmPlexSerif.className} mt-1 text-[14px] text-[#f5e4c5]`}
                        >
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div>
                        <p
                          className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48 lg:hidden`}
                        >
                          Status
                        </p>
                        <div className="mt-2 lg:mt-0">
                          <StatusPill status={order.status} font2={font2} />
                        </div>
                      </div>

                      <div>
                        <p
                          className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48 lg:hidden`}
                        >
                          Total
                        </p>
                        <p
                          className={`${ibmPlexSerif.className} mt-1 text-[18px] text-[#f5dfb8]`}
                        >
                          €{Number(order.total ?? 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="lg:text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`${font2.className} inline-flex cursor-pointer items-center justify-center rounded-[16px] border border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#f7e3bc] shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.08)] transition hover:-translate-y-[1px] hover:brightness-110`}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className={`${font2.className} inline-flex items-center justify-center rounded-[16px] border px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition ${
                  page === 1
                    ? "cursor-not-allowed border-[#8d693b]/20 bg-[#2b1b12]/20 text-[#f4dfba]/35"
                    : "cursor-pointer border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] text-[#f7e3bc] shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.08)] hover:-translate-y-[1px] hover:brightness-110"
                }`}
              >
                Previous
              </button>

              <p
                className={`${ibmPlexSerif.className} text-[20px] text-[#f1dcb8]`}
              >
                Seite {page} von {totalPages}
              </p>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page >= totalPages}
                className={`${font2.className} inline-flex items-center justify-center rounded-[16px] border px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition ${
                  page >= totalPages
                    ? "cursor-not-allowed border-[#8d693b]/20 bg-[#2b1b12]/20 text-[#f4dfba]/35"
                    : "cursor-pointer border-[#6c4621] bg-[linear-gradient(180deg,#6a4526,#3f2818)] text-[#f7e3bc] shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,230,176,0.08)] hover:-translate-y-[1px] hover:brightness-110"
                }`}
              >
                Next
              </button>
            </div>
          </section>
        </div>
    </>
  );
}

async function loadOrdersPage({ supabase, activeFilter, page, searchTerm }) {
  const normalizedSearch = String(searchTerm || "")
    .trim()
    .toLowerCase();

  const { data: allOrdersData, error: allOrdersError } = await supabase
    .from("orders")
    .select("*")
    .in("status", OPERATIONAL_STATUSES)
    .order("created_at", { ascending: false });

  if (allOrdersError) throw allOrdersError;

  const allOrders = allOrdersData ?? [];

  const pendingShipmentCount = allOrders.filter(
    (order) => String(order.status).toLowerCase() === "paid",
  ).length;

  let filteredOrders = allOrders;

  if (activeFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => String(order.status).toLowerCase() === activeFilter,
    );
  }

  if (normalizedSearch) {
    filteredOrders = filteredOrders.filter((order) => {
      const email = String(order.customer_email || "").toLowerCase();
      const id = String(order.id || "").toLowerCase();

      return email.includes(normalizedSearch) || id.includes(normalizedSearch);
    });
  }

  const totalCount = filteredOrders.length;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE;
  const paginatedOrders = filteredOrders.slice(from, to);

  const orderIds = paginatedOrders.map((order) => order.id);

  let itemsData = [];

  if (orderIds.length > 0) {
    const { data: fetchedItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds)
      .order("created_at", { ascending: true });

    if (itemsError) throw itemsError;

    itemsData = fetchedItems ?? [];
  }

  return {
    orders: paginatedOrders,
    orderItems: itemsData,
    totalCount,
    statsCount: filteredOrders.length,
    statsRevenue: filteredOrders.reduce(
      (sum, order) => sum + Number(order.total ?? 0),
      0,
    ),
    pendingShipmentCount,
  };
}

function OrderDetailsModal({
  order,
  items,
  onClose,
  font2,
  ibmPlexSerif,
  setSelectedOrder,
  updateOrderStatusMutation,
}) {
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState("");
  const [refundNotice, setRefundNotice] = useState("");

  const canRefund =
    order.status !== "refunded" &&
    order.status !== "cancelled" &&
    Boolean(order.stripe_payment_intent_id);

  async function handleRefundOrder() {
    try {
      setIsRefunding(true);
      setRefundError("");
      setRefundNotice("");

      const res = await fetch("/api/refund-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRefundError(data.error || "Rückerstattung fehlgeschlagen.");
        return;
      }

      setRefundNotice("Die Bestellung wurde erfolgreich zurückerstattet.");
      setShowRefundConfirm(false);

      setSelectedOrder((prev) =>
        prev?.id === order.id
          ? {
              ...prev,
              status: "refunded",
              refunded_at: new Date().toISOString(),
              stripe_refund_id: data.refund?.id,
            }
          : prev,
      );
    } catch {
      setRefundError("Etwas ist schiefgelaufen.");
    } finally {
      setIsRefunding(false);
    }
  }

  return (
    <div
      onClick={() => setSelectedOrder(null)}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
    >
      {showRefundConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[28px] border border-red-300/25 bg-[linear-gradient(180deg,rgba(35,12,12,0.98),rgba(13,8,9,0.98))] p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
          >
            <p
              className={`${font2.className} text-[10px] uppercase tracking-[0.24em] text-red-200/65`}
            >
              Rückerstattung bestätigen
            </p>

            <h3
              className={`${ibmPlexSerif.className} mt-4 text-[32px] leading-[1.05] text-red-100`}
            >
              Bestellung wirklich erstatten?
            </h3>

            <p
              className={`${ibmPlexSerif.className} mt-4 text-[16px] leading-[1.65] text-red-50/72`}
            >
              Dadurch wird die Zahlung über Stripe an die ursprüngliche
              Zahlungsmethode zurückerstattet. Diese Aktion sollte nur nach
              Prüfung der Rückgabe ausgeführt werden.
            </p>

            {refundError && (
              <p className={`${font2.className} mt-4 text-sm text-red-200`}>
                {refundError}
              </p>
            )}

            <div className="mt-7 flex gap-3">
              <button
                disabled={isRefunding}
                onClick={() => setShowRefundConfirm(false)}
                className={`${font2.className} flex-1 cursor-pointer rounded-[16px] border border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Abbrechen
              </button>

              <button
                disabled={isRefunding}
                onClick={handleRefundOrder}
                className={`${font2.className} flex-1 cursor-pointer rounded-[16px] border border-red-300/30 bg-red-950/60 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-red-100 transition hover:-translate-y-[1px] hover:bg-red-900/70 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isRefunding ? "Erstatte..." : "Ja, erstatten"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[30px] border border-[#8d693b]/55 bg-[linear-gradient(180deg,rgba(19,13,12,0.96),rgba(11,8,10,0.94))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
      >
        <button
          onClick={onClose}
          className={`${font2.className} absolute right-5 top-5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#8d693b]/45 bg-[#2b1b12]/70 text-[#f4dfba] transition hover:bg-[#3a2418]`}
          aria-label="Close order details"
        >
          ✕
        </button>

        <div className="pr-14">
          <p
            className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
          >
            Order ID
          </p>
          <h2
            className={`${ibmPlexSerif.className} mt-2 text-[30px] leading-[1.2] text-[#f4dfba] break-all`}
          >
            {order.id}
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MiniStat
            label="Kunde"
            value={order.customer_email}
            font2={font2}
            ibmPlexSerif={ibmPlexSerif}
          />
          <MiniStat
            label="Status"
            value={String(order.status || "unknown")}
            font2={font2}
            ibmPlexSerif={ibmPlexSerif}
          />
          <MiniStat
            label="Total"
            value={`€${Number(order.total ?? 0).toFixed(2)}`}
            font2={font2}
            ibmPlexSerif={ibmPlexSerif}
          />
        </div>

        <div className="mt-8">
          <p className={`${ibmPlexSerif.className} text-[28px] text-[#f1dcb8]`}>
            Bestellpositionen
          </p>

          <div className="mt-5 grid gap-4">
            {items.length === 0 ? (
              <p className={`${font2.className} text-sm text-[#e1cfb6]/70`}>
                Keine Bestellpositionen gefunden.
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-[24px] border border-[#8d693b]/35 bg-[linear-gradient(180deg,rgba(25,17,13,0.68),rgba(13,9,9,0.62))] p-4 md:grid-cols-[120px_1fr]"
                >
                  <div className="overflow-hidden rounded-[16px] border border-[#6d4823]/45">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        width={320}
                        height={320}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-[120px] w-full bg-[#1a1414]" />
                    )}
                  </div>

                  <div>
                    <h3
                      className={`${ibmPlexSerif.className} text-[24px] leading-[1.15] text-[#f5dfb8]`}
                    >
                      {item.product_name}
                    </h3>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <MiniStat
                        label="Menge"
                        value={String(item.quantity)}
                        font2={font2}
                        ibmPlexSerif={ibmPlexSerif}
                      />
                      <MiniStat
                        label="Einzelpreis"
                        value={`€${Number(item.unit_price ?? 0).toFixed(2)}`}
                        font2={font2}
                        ibmPlexSerif={ibmPlexSerif}
                      />
                      <MiniStat
                        label="Subtotal"
                        value={`€${Number(item.subtotal ?? 0).toFixed(2)}`}
                        font2={font2}
                        ibmPlexSerif={ibmPlexSerif}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-[#8c6a40]/22 pt-6">
          <p
            className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
          >
            Shipping Address
          </p>
          <p
            className={`${ibmPlexSerif.className} mt-2 whitespace-pre-line text-[20px] leading-[1.5] text-[#f5e4c5]`}
          >
            {order.shipping_address || "Keine Adresse vorhanden."}
          </p>
        </div>

               <div className="mt-8 rounded-[24px] border border-[#b89154]/25 bg-[linear-gradient(180deg,rgba(48,30,18,0.72),rgba(18,12,10,0.72))] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
  <p
    className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
  >
    Signaturwunsch
  </p>

  {order.signature_request ? (
    <p
      className={`${ibmPlexSerif.className} mt-3 whitespace-pre-line text-[18px] leading-[1.7] text-[#f5e4c5]`}
    >
      {order.signature_request}
    </p>
  ) : (
    <p
      className={`${ibmPlexSerif.className} mt-3 text-[18px] italic text-[#e6d5bc]/45`}
    >
      Kein Signaturwunsch angegeben.
    </p>
  )}
</div>

{order.withdrawal_requested_at && (
  <div className="mt-8 rounded-[24px] border border-amber-300/30 bg-amber-950/25 p-5">
    <p
      className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-amber-200/65`}
    >
      Widerruf angefordert
    </p>

    <p
      className={`${ibmPlexSerif.className} mt-3 text-[18px] leading-[1.7] text-amber-50/85`}
    >
      Der Kunde hat am {formatDate(order.withdrawal_requested_at)} einen
      Widerruf angefordert.
    </p>

    {order.withdrawal_notes ? (
      <p
        className={`${ibmPlexSerif.className} mt-3 whitespace-pre-line text-[17px] leading-[1.7] text-amber-50/70`}
      >
        {order.withdrawal_notes}
      </p>
    ) : (
      <p
        className={`${ibmPlexSerif.className} mt-3 italic text-[17px] text-amber-50/45`}
      >
        Keine zusätzliche Nachricht angegeben.
      </p>
    )}
  </div>
)}

        <div className="mt-8 rounded-[24px] border border-[#8d693b]/35 bg-[linear-gradient(180deg,rgba(25,17,13,0.68),rgba(13,9,9,0.62))] p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p
                className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#d6c2a0]/48`}
              >
                Fulfillment
              </p>

              <p
                className={`${ibmPlexSerif.className} mt-2 text-[24px] text-[#f4dfba]`}
              >
                Bestellung verwalten
              </p>

              <p
                className={`${ibmPlexSerif.className} mt-2 max-w-xl text-[16px] leading-[1.6] text-[#e6d5bc]/72`}
              >
                {order.status === "paid" &&
                  "Diese Bestellung wartet auf den Versand."}
                {order.status === "shipped" &&
                  "Diese Bestellung wurde bereits versendet."}
                {order.status === "cancelled" &&
                  "Diese Bestellung wurde storniert."}
                {order.status === "refunded" &&
                  "Diese Bestellung wurde zurückerstattet."}
              </p>

              {refundNotice && (
                <p className={`${font2.className} mt-3 text-sm text-emerald-200`}>
                  {refundNotice}
                </p>
              )}

              {refundError && !showRefundConfirm && (
                <p className={`${font2.className} mt-3 text-sm text-red-200`}>
                  {refundError}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {order.status === "paid" && (
                <button
                  disabled={updateOrderStatusMutation.isPending}
                  onClick={() =>
                    updateOrderStatusMutation.mutate({
                      orderId: order.id,
                      status: "shipped",
                      order,
                      items,
                    })
                  }
                  className={`${font2.className} inline-flex cursor-pointer items-center justify-center rounded-[16px] border border-sky-400/30 bg-sky-950/40 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-sky-100 transition hover:-translate-y-[1px] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {updateOrderStatusMutation.isPending
                    ? "Updating..."
                    : "Als versandt markieren"}
                </button>
              )}

              {order.status === "shipped" && (
                <div
                  className={`${font2.className} inline-flex items-center justify-center rounded-[16px] border border-sky-400/30 bg-sky-950/30 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-sky-100`}
                >
                  Versandt ✓
                </div>
              )}

              {order.status === "refunded" && (
                <div
                  className={`${font2.className} inline-flex items-center justify-center rounded-[16px] border border-emerald-400/30 bg-emerald-950/30 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-emerald-100`}
                >
                  Erstattet ✓
                </div>
              )}

              {canRefund && (
                <button
                  disabled={isRefunding}
                  onClick={() => setShowRefundConfirm(true)}
                  className={`${font2.className} inline-flex cursor-pointer items-center justify-center rounded-[16px] border border-red-300/25 bg-red-950/35 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-red-100 transition hover:-translate-y-[1px] hover:bg-red-900/45 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Rückerstatten
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, ibmPlexSerif }) {
  return (
    <div className="rounded-[26px] border border-[#8d693b]/60 bg-[linear-gradient(180deg,rgba(222,198,160,0.9),rgba(173,140,96,0.78))] p-5 text-[#2f1f15] shadow-[0_16px_28px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(255,247,223,0.12)]">
      <div className="flex items-start gap-3">
        <span className="text-[26px] leading-none text-[#7a5328]">{icon}</span>
        <div>
          <p
            className={`${ibmPlexSerif.className} text-[22px] leading-[1.05] text-[#392518]`}
          >
            {label}
          </p>
          <p
            className={`${ibmPlexSerif.className} mt-4 text-[44px] leading-none text-[#23160f]`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, font2, ibmPlexSerif }) {
  return (
    <div className="rounded-[18px] border border-[#8d693b]/35 bg-[linear-gradient(180deg,rgba(31,20,15,0.82),rgba(18,12,10,0.72))] p-3">
      <p
        className={`${font2.className} text-[10px] uppercase tracking-[0.18em] text-[#d6c2a0]/55`}
      >
        {label}
      </p>
      <p
        className={`${ibmPlexSerif.className} mt-2 text-[20px] break-words text-[#f5dfb8]`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status, font2 }) {
  const normalized = String(status || "").toLowerCase();

  const statusStyles = {
    paid: "border-emerald-400/30 bg-emerald-950/50 text-emerald-200",
    shipped: "border-sky-400/30 bg-sky-950/50 text-sky-200",
    cancelled: "border-rose-400/30 bg-rose-950/50 text-rose-200",
  };

  return (
    <span
      className={`${font2.className} inline-flex rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] ${
        statusStyles[normalized] ||
        "border-[#8d693b]/45 bg-[#2b1b12]/75 text-[#f4dfba]"
      }`}
    >
      {normalized || "unknown"}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}
