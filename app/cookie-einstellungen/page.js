import LegalPage from "@/app/components/LegalPage";

export const metadata = {
  title: "Cookie-Einstellungen | Deevee",
  description:
    "Informationen zu technisch notwendigen Cookies und aktuellen Cookie-Einstellungen auf Deevee.",
};

export default function Page() {
  return (
    <LegalPage title="Cookie-Einstellungen">
      <h2>Cookie-Einstellungen</h2>

      <p>
        Auf dieser Webseite werden derzeit ausschließlich technisch notwendige
        Cookies verwendet. Diese Cookies sind erforderlich, damit die Webseite
        ordnungsgemäß funktioniert.
      </p>

      <h3>Technisch notwendige Cookies</h3>

      <p>
        Technisch notwendige Cookies ermöglichen grundlegende Funktionen der
        Webseite, wie z. B. die sichere Nutzung der Seite, die Warenkorb-Funktion
        oder die Zahlungsabwicklung.
      </p>

      <p>
        Diese Cookies können nicht deaktiviert werden, da die Webseite ohne sie
        nicht korrekt funktionieren würde.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="mt-0">Aktueller Cookie-Status</h3>

        <p>
          Es werden keine optionalen Cookies für Marketing, Analyse oder
          Personalisierung verwendet.
        </p>

        <ul>
          <li>Marketing-Cookies: nicht aktiv</li>
          <li>Analyse-Cookies: nicht aktiv</li>
          <li>Personalisierungs-Cookies: nicht aktiv</li>
          <li>Technisch notwendige Cookies: aktiv</li>
        </ul>
      </div>

      <h3>Weitere Informationen</h3>

      <p>
        Weitere Informationen zur Verarbeitung personenbezogener Daten und zur
        Verwendung technisch notwendiger Cookies finden Sie in unserer
        Datenschutzerklärung.
      </p>
    </LegalPage>
  );
}