import { Suspense } from "react";
import CartClient from "./CartClient";
import StoreLoading from "@/app/components/StoreLoading";

export const metadata = {
  title: "Warenkorb",
  description:
    "Überprüfe deine ausgewählten Artikel im offiziellen Heartbeat Shop.",
};

export default function Page() {
  return (
    <Suspense fallback={<StoreLoading text="Dein Warenkorb wird geladen" />}>
      <CartClient />
    </Suspense>
  );
}