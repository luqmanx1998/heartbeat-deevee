import HomeClient from "./HomeClient";

export const metadata = {
  metadataBase: new URL("https://www.deevee.io"),

  title: "Deevee | Heartbeat – Die andere Seite",

  description:
    "Offizielle Webseite zu Heartbeat – Die andere Seite. Entdecke die Welt, Charaktere und den Deevee Book Shop.",

  openGraph: {
    title: "Deevee | Heartbeat – Die andere Seite",

    description:
      "Entdecke Heartbeat – Die andere Seite, eine düstere Romantasy-Welt voller Magie, Geheimnisse und emotionaler Spannung.",

    url: "https://www.deevee.io",

    siteName: "Deevee",

    images: [
      {
        url: "/emailhero.jpg",
        width: 1200,
        height: 630,
        alt: "Heartbeat – Die andere Seite",
      },
    ],

    locale: "de_DE",
    type: "website",
  },
};

export default function Page() {
  return <HomeClient />;
}