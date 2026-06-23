export const metadata = {
  title: {
    default: "Heartbeat Shop | Deevee",
    template: "%s | Heartbeat Shop",
  },
  description:
    "Offizieller Shop für Heartbeat – Die andere Seite.",

  openGraph: {
    title: "Heartbeat Shop | Deevee",
    description:
      "Offizieller Shop für Heartbeat – Die andere Seite.",
    images: ["/book1.jpeg"],
  },
};
export default function StoreLayout({ children }) {
  return children;
}