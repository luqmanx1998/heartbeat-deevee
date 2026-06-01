import LegalPage from "@/app/components/LegalPage";

export default function Page() {
  return (
    <LegalPage title="Zahlung und Versand">
      <h2>Zahlung und Versand</h2>

      <p>Es gelten folgende Bedingungen:</p>

      <h3>Liefergebiet</h3>

      <p>Die Lieferung erfolgt nur im Inland (Deutschland).</p>

      <h3>Versandkosten</h3>

      <p>Versandkosten inklusive gesetzlicher Mehrwertsteuer.</p>

      <p>Wir berechnen die Versandkosten pauschal mit 5,99 € pro Bestellung.</p>

      <h3>Lieferfristen</h3>

      <p>
        Soweit im jeweiligen Angebot keine andere Frist angegeben ist, erfolgt
        die Lieferung der Ware im Inland (Deutschland) innerhalb von 4 - 5
        Werktagen nach Vertragsschluss. Bei vereinbarter Vorauszahlung beginnt
        die Lieferfrist nach dem Zeitpunkt Ihrer Zahlungsanweisung.
      </p>

      <p>
        Beachten Sie, dass an Sonn- und Feiertagen keine Zustellung erfolgt.
      </p>

      <p>
        Haben Sie Artikel mit unterschiedlichen Lieferzeiten bestellt, wird die
        Ware in einer gemeinsamen Sendung versandt, sofern wir keine
        abweichenden Vereinbarungen mit Ihnen getroffen haben. Die Lieferzeit
        bestimmt sich in diesem Fall nach dem Artikel mit der längsten
        Lieferzeit, den Sie bestellt haben.
      </p>

      <h3>Akzeptierte Zahlungsmöglichkeiten</h3>

      <h4>Über PayPal Checkout</h4>

      <ul>
        <li>Zahlung per PayPal</li>
        <li>Zahlung per Kreditkarte</li>
      </ul>

      <h4>Über Stripe</h4>

      <ul>
        <li>Zahlung per Kreditkarte</li>
        <li>Zahlung per Google Pay</li>
        <li>Zahlung per Link</li>
      </ul>

      <p>Bei Fragen finden Sie unsere Kontaktdaten im Impressum.</p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="!mt-0">Wichtiger Hinweis zu deiner Bestellung</h3>

        <p>
          Bücher können durch den Transport kleine Macken und abgestoßene Ecken
          aufweisen.
        </p>

        <p>
          Diese kleinen optischen Mängel sind von der Reklamation
          ausgeschlossen.
        </p>

        <h3>Wichtige Informationen</h3>

        <p>
          Bei Bestellung von mehreren Produkten wird die Ware erst mit dem
          Release des letzten Buches versendet.
        </p>
      </div>
    </LegalPage>
  );
}
