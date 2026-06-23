import { Suspense } from "react";
import CartClient from "./CartClient";

export const metadata = {
  title: "Warenkorb",
  description:
    "Überprüfe deine ausgewählten Artikel im offiziellen Heartbeat Shop.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CartClient />
    </Suspense>
  );
}