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

export default function OrdersPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);

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
          console.error("Failed to load customer order items:", itemsError.message);
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
  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0
  );

  function getItemsForOrder(orderId) {
    return orderItems.filter((item) => item.order_id === orderId);
  }

  function toggleOrder(orderId) {
    setOpenOrderId((current) => (current === orderId ? null : orderId));
  }

  return (
          <section>
            <header className="mb-8 flex flex-col lg:flex-row gap-4 lg:items-center">
             <div>
              <p
                className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8a7f73]`}
              >
                Orders
              </p>

              <h1 className="mt-3 text-[clamp(34px,5vw,56px)] font-semibold leading-none text-[#181311]">
                My Orders
              </h1>

              <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#6b625a]">
                View your recent purchases, order totals, statuses, and item details.
              </p>
            </div>
                    <InfoCard
                    label="Total Orders"
                    value={loading ? "—" : String(totalOrders)}
                    font2={font2}
                  />
            </header>

            {authLoading ? (
              <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                <p className={`${font2.className} text-[12px] uppercase tracking-[0.18em] text-[#8b7f72]`}>
                  Loading account...
                </p>
              </div>
            ) : !user ? (
              <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                <h2 className="text-[28px] font-semibold text-[#181311]">
                  Please sign in
                </h2>
                <p className="mt-3 max-w-xl text-[16px] leading-7 text-[#6b625a]">
                  You need to be logged in to view your orders.
                </p>

                <div className="mt-6">
                  <Link
                    href="/store"
                    className={`${font2.className} inline-flex items-center justify-center rounded-full border border-[#181311] bg-[#181311] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white transition hover:opacity-90`}
                  >
                    Go to Store
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <section className="space-y-5">
                  {loading ? (
                    <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                      <p className={`${font2.className} text-[12px] uppercase tracking-[0.18em] text-[#8b7f72]`}>
                        Loading orders...
                      </p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="rounded-[28px] border border-[#e6ddd2] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                      <h2 className="text-[28px] font-semibold text-[#181311]">
                        No orders yet
                      </h2>
                      <p className="mt-3 max-w-xl text-[16px] leading-7 text-[#6b625a]">
                        Once you place an order, it will appear here.
                      </p>
                    </div>
                  ) : (
                    orders.map((order) => {
                      const items = getItemsForOrder(order.id);
                      const isOpen = openOrderId === order.id;

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
                                Order ID
                              </p>
                              <p className="mt-2 break-all text-[22px] leading-[1.25] font-medium text-[#181311]">
                                {order.id}
                              </p>
                            </div>

                            <div>
                              <p
                                className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                              >
                                Date
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
                                Total
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
                                {isOpen ? "Hide details" : "View details"}
                              </button>
                            </div>
                          </div>

                          {isOpen && (
                            <div className="border-t border-[#eee5da] bg-[#fcfaf7] px-6 py-6">
                              <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
                                <div>
                                  <h3 className="text-[26px] font-semibold text-[#181311]">
                                    Order Items
                                  </h3>

                                  <div className="mt-5 space-y-4">
                                    {items.length === 0 ? (
                                      <p className="text-[15px] text-[#6b625a]">
                                        No items found for this order.
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
                                                label="Quantity"
                                                value={String(item.quantity)}
                                                font2={font2}
                                              />
                                              <MiniCard
                                                label="Unit Price"
                                                value={`€${Number(item.unit_price ?? 0).toFixed(2)}`}
                                                font2={font2}
                                              />
                                              <MiniCard
                                                label="Subtotal"
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
                                    Shipping
                                  </h3>

                                  <div className="mt-5 rounded-[22px] border border-[#e6ddd2] bg-white p-5">
                                    <p
                                      className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                                    >
                                      Shipping Address
                                    </p>
                                    <p className="mt-3 whitespace-pre-line text-[18px] leading-8 text-[#2c2521]">
  {order.shipping_address || "No address available."}
</p>
                                  </div>

                                  <div className="mt-4 rounded-[22px] border border-[#e6ddd2] bg-white p-5">
                                    <p
                                      className={`${font2.className} text-[10px] uppercase tracking-[0.22em] text-[#8b7f72]`}
                                    >
                                      Customer Email
                                    </p>
                                    <p className="mt-3 break-all text-[18px] leading-8 text-[#2c2521]">
                                      {order.customer_email}
                                    </p>
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
              </>
            )}
          </section>
  );
}

function InfoCard({ label, value, font2 }) {
  return (
    <div className="rounded-[24px] border border-[#e6ddd2] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] flex-1">
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
    pending: "border-[#ead6ae] bg-[#fff7e4] text-[#7d5a10]",
    paid: "border-[#cfe8d5] bg-[#eef9f0] text-[#1f6a30]",
    shipped: "border-[#cfe1f5] bg-[#eef6fd] text-[#245b94]",
    completed: "border-[#ddd2f6] bg-[#f5f1fd] text-[#6240a8]",
    cancelled: "border-[#f1d0d0] bg-[#fdf1f1] text-[#9a3737]",
  };

  return (
    <span
      className={`${font2.className} inline-flex rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] ${
        statusStyles[normalized] ||
        "border-[#e6ddd2] bg-[#f7f2ec] text-[#4d433b]"
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