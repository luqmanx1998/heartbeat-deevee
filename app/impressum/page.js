import LegalPage from "@/app/components/LegalPage";

export const metadata = {
  title: "Impressum | Deevee",
  description:
    "Gesetzliche Anbieterkennung und Kontaktinformationen von Deevee.",
};

export default function Page() {
  return (
    <LegalPage title="Impressum">
      <h2>Gesetzliche Anbieterkennung</h2>

      <p>
        Dana Jovanovic
        <br />
        Deevee
        <br />
        Staigstraße 10
        <br />
        89293 Kellmünz
        <br />
        Deutschland
      </p>

      <p>
        Telefon: +4917664148383
        <br />
        E-Mail: xdeeveee@gmail.com
      </p>

      <p>
        Wir sind nicht bereit und nicht verpflichtet, an
        Streitbeilegungsverfahren vor Verbraucherschlichtungsstellen
        teilzunehmen.
      </p>
    </LegalPage>
  );
}