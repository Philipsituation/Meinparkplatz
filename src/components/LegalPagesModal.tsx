import React from 'react';
import { X, ShieldCheck, FileText, HelpCircle, Lock, AlertCircle, Scale, Accessibility, HeartHandshake } from 'lucide-react';
import { LegalModalType } from '../types';

interface LegalPagesModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'impressum':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Impressum</h3>
            <div>
              <strong className="block text-gray-900 text-sm">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz):</strong>
              <p className="mt-1">
                Philip Schüßler<br />
                Meinparkplatz Portal<br />
                Kaiserstraße 42<br />
                60329 Frankfurt am Main<br />
                Deutschland
              </p>
            </div>

            <div>
              <strong className="block text-gray-900 text-sm">Kontakt:</strong>
              <p className="mt-1">
                Telefon: +49 (0) 69 1234 5678<br />
                E-Mail: kontakt@meinparkplatz.de<br />
                Internet: www.meinparkplatz.de
              </p>
            </div>

            <div>
              <strong className="block text-gray-900 text-sm">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong>
              <p className="mt-1">
                Philip Schüßler<br />
                Kaiserstraße 42<br />
                60329 Frankfurt am Main
              </p>
            </div>

            <div>
              <strong className="block text-gray-900 text-sm">Haftungsausschluss (Disclaimer):</strong>
              <p className="mt-1">
                Meinparkplatz stellt ausschließlich die technische Infrastruktur (Inserate, Suche und Chat) zur privaten Kontaktaufnahme bereit. Der Betreiber (Philip Schüßler) ist weder Partei noch Vermittler von Mietverträgen und haftet nicht für Vertragsverletzungen, Nichtzahlungen, Schlüsselverluste oder Schäden. Alle Vereinbarungen werden ausschließlich und eigenverantwortlich zwischen den Nutzern geschlossen.
              </p>
            </div>

            <div>
              <strong className="block text-gray-900 text-sm">EU-Streitschlichtung:</strong>
              <p className="mt-1">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>
        );

      case 'hilfe':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Hilfe & FAQ – Fragen & Antworten</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm">Wie funktioniert das Mieten eines Parkplatzes?</h4>
                <p className="mt-1 text-gray-600">
                  Nutze die Suche oder die interaktive Kartenansicht mit Umkreissuche. Hast du einen passenden Parkplatz z.B. für ein Konzert oder zur Monatsmiete gefunden, klicke auf "Nachricht schreiben" und kläre Übergabe und Uhrzeit im Direkt-Chat.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm">Welche Zahlungsmethoden werden unterstützt?</h4>
                <p className="mt-1 text-gray-600">
                  Aus Sicherheits- und Flexibilitätsgründen erlaubt die Plattform ausschließlich <strong>Barzahlung bei Übergabe vor Ort</strong> oder <strong>PayPal mit Käuferschutz</strong> direkt zwischen Vermieter und Mieter.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm">Wie funktioniert das Smiley-Bewertungssystem?</h4>
                <p className="mt-1 text-gray-600">
                  Wie bei Kleinanzeigen kannst du Vermieter mit den drei Smileys (😁 TOP, 🙂 Zufrieden, 🙁 Na ja) bewerten. Das ist möglich, sobald du mit dem Vermieter ausreichend im Chat kommuniziert hast.
                </p>
              </div>
            </div>
          </div>
        );

      case 'sicherheit':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Tipps für deine Sicherheit</h3>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
              <h4 className="font-bold text-sm">1. Niemals ungesicherte Vorauszahlungen per Banküberweisung leisten</h4>
              <p>Zahle den Mietpreis erst bar vor Ort bei Schlüssel-/Kartenübergabe oder nutze PayPal mit Käuferschutz.</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-blue-950">
              <h4 className="font-bold text-sm">2. Ausschließlich über unseren Nachrichten-Chat kommunizieren</h4>
              <p>Wechsele nicht auf ungesicherte externe Messenger, um Betrug und Spam zu vermeiden.</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-purple-950">
              <h4 className="font-bold text-sm">3. Schlüssel, Sender & Transponder persönlich prüfen</h4>
              <p>Überprüfe bei Tiefgaragen oder Schranken vor Ort gemeinsam mit dem Vermieter die einwandfreie Funktion.</p>
            </div>
          </div>
        );

      case 'sicherheitsluecken':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Sicherheitslücken melden (Responsible Disclosure)</h3>
            <p>
              Die Sicherheit unserer Nutzer und deren Daten hat für uns höchste Priorität. Wenn du eine potenzielle Sicherheitslücke oder Schwachstelle in unserem System entdeckt hast, bitten wir dich, diese vertraulich an uns zu melden.
            </p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <strong className="block text-gray-900 font-bold">Kontakt für Sicherheitsthemen:</strong>
              <p>E-Mail: security@meinparkplatz.de</p>
              <p>Ansprechpartner: Philip Schüßler</p>
            </div>
          </div>
        );

      case 'widerruf':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Widerrufsbelehrung & Muster-Widerrufsformular</h3>
            <div>
              <strong className="block font-bold text-gray-900 text-sm">Widerrufsrecht für Verbraucher:</strong>
              <p className="mt-1">
                Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag über die Nutzung der Inseratsplattform zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <strong className="block font-bold text-gray-900">Muster-Widerrufsformular:</strong>
              <p className="text-[11px] font-mono text-gray-600 bg-white p-2 rounded border border-gray-200">
                An Philip Schüßler, Kaiserstraße 42, 60329 Frankfurt am Main, E-Mail: kontakt@meinparkplatz.de:<br /><br />
                Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über die kostenlose Nutzung des Portals Meinparkplatz.<br />
                Registriert am: [Datum]<br />
                Name des Nutzers:<br />
                Anschrift des Nutzers:<br />
                Datum / Unterschrift
              </p>
            </div>
          </div>
        );

      case 'jugendschutz':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Kinder- und Jugendschutz</h3>
            <p>
              Die Nutzung unseres Portals ist ausschließlich volljährigen Personen gestattet, die das 18. Lebensjahr vollendet haben und voll geschäftsfähig sind.
            </p>
            <p>
              Ansprechpartner für Jugendschutz: Philip Schüßler (jugendschutz@meinparkplatz.de).
            </p>
          </div>
        );

      case 'barrierefreiheit':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Barrierefreiheitserklärung</h3>
            <p>
              Wir sind bemüht, unser Portal barrierefrei und gemäß den Bestimmungen des Barrierefreiheitsstärkungsgesetzes (BFSG) sowie den Richtlinien der BITV 2.0 zugänglich zu machen.
            </p>
            <p>
              Sollten dir Barrieren auf unserer Website auffallen, kannst du uns jederzeit unter barrierefrei@meinparkplatz.de kontaktieren.
            </p>
          </div>
        );

      case 'datenschutz':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Datenschutzerklärung (DSGVO)</h3>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist Philip Schüßler, Kaiserstraße 42, 60329 Frankfurt am Main.
            </p>
            <div>
              <strong className="block text-gray-900 font-bold">2-Wochen Löschfrist für Chatverläufe:</strong>
              <p className="mt-1">
                Zur Maximierung des Nutzerdatenschutzes werden alle zwischen Vermieter und Mieter ausgetauschten Nachrichten nach Ablauf von 14 Tagen automatisch und unwiderruflich aus der Datenbank gelöscht.
              </p>
            </div>
            <div>
              <strong className="block text-gray-900 font-bold">Rechte der betroffenen Person:</strong>
              <p className="mt-1">
                Du hast das Recht auf Auskunft, Berichtigung, Löschung ("Recht auf Vergessenwerden") sowie Einschränkung der Verarbeitung deiner personenbezogenen Daten.
              </p>
            </div>
          </div>
        );

      case 'agb':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
            <div className="border-b pb-3">
              <h3 className="font-extrabold text-base text-gray-900">Allgemeine Geschäfts- & Nutzungsbedingungen (AGB)</h3>
              <p className="text-gray-500 text-[11px] mt-0.5">Stand: August 2026 • Portal: Meinparkplatz (Betreiber: Philip Schüßler)</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">§ 1 Geltungsbereich und Bereitstellung der Plattform</h4>
                <p className="mt-1">
                  (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Nutzer der Online-Plattform <strong>Meinparkplatz</strong> (nachfolgend „Plattform“), betrieben durch Philip Schüßler, Kaiserstraße 42, 60329 Frankfurt am Main.
                </p>
                <p className="mt-1">
                  (2) Meinparkplatz ist ein reines Kleinanzeigen-, Such- und Kommunikationsportal, auf dem Privatpersonen und Unternehmen Inserate für freie Stellplätze, Tiefgaragen, Garagen, Carports und E-Ladesäulen veröffentlichen und miteinander in Kontakt treten können.
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider">§ 2 Reiner Vermittlungscharakter & Peer-to-Peer-Mietverträge</h4>
                <p className="mt-1 text-amber-950">
                  (1) Der Betreiber stellt <strong>ausschließlich die technische Plattform</strong> zur Veröffentlichung von Inseraten und zum nachrichtlichen Austausch (Chat) bereit. 
                </p>
                <p className="mt-1 text-amber-950">
                  (2) Alle Mietverträge, Absprachen, Buchungen und Zahlungen kommen <strong>ausschließlich und unmittelbar zwischen den jeweiligen Nutzern (Vermieter und Mieter)</strong> zustande. 
                </p>
                <p className="mt-1 text-amber-950 font-semibold">
                  (3) Der Betreiber (Philip Schüßler) ist weder Vermieter, noch Mieter, noch Makler, Treuhänder oder Vertragspartei. Er ist zu keinem Zeitpunkt an der Erfüllung, Abwicklung oder Kontrolle der geschlossenen Verträge beteiligt.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">§ 3 Registrierung, Mindestalter (18+) und wahrheitsgemäße Angaben</h4>
                <p className="mt-1">
                  (1) Die Registrierung eines Nutzerkontos ist ausschließlich Personen gestattet, die das <strong>18. Lebensjahr vollendet haben und unbeschränkt geschäftsfähig sind</strong>.
                </p>
                <p className="mt-1">
                  (2) Jeder Nutzer verpflichtet sich, bei der Registrierung und beim Einstellen von Inseraten wahrheitsgemäße und vollständige Angaben zu machen.
                </p>
                <p className="mt-1">
                  (3) Der Nutzer bestätigt bei der Registrierung ausdrücklich sein Mindestalter sowie die uneingeschränkte Anerkennung dieser AGB und der Datenschutzerklärung.
                </p>
              </div>

              <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl">
                <h4 className="font-bold text-red-950 text-xs uppercase tracking-wider">§ 4 Vollständiger Haftungsausschluss für Schlüssel, Zugangsmedien & Vor-Ort-Gegebenheiten</h4>
                <p className="mt-1 text-red-950">
                  (1) <strong>Keine Kontrollmöglichkeit durch den Betreiber:</strong> Der Betreiber hat keinerlei physischen Zugang zu den Objekten, führt keine Vor-Ort-Besichtigungen durch und besitzt keine Kontrolle über Stellplatzgrößen, Durchfahrtshöhen, Sauberkeit oder Nutzbarkeit.
                </p>
                <p className="mt-1 text-red-950">
                  (2) <strong>Schlüssel, Handsender & Schrankenkarten:</strong> Die Übergabe, Verwahrung, Nutzung und Rückgabe von Schlüsseln, Handsendern, Transpondern oder PIN-Codes erfolgt rein privat zwischen Vermieter und Mieter. 
                </p>
                <p className="mt-1 text-red-950 font-bold">
                  (3) Der Betreiber haftet unter keinen Umständen für den Verlust, Diebstahl, Nichtrückgabe, Duplizierung oder Funktionsuntüchtigkeit von Schlüsseln, Toren, Schranken oder Fernbedienungen. Sämtliche Risiken tragen Vermieter und Mieter selbst.
                </p>
              </div>

              <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl">
                <h4 className="font-bold text-red-950 text-xs uppercase tracking-wider">§ 5 Vollständiger Ausschluss für Vertragsbrüche, Nichtzahlung & Streitigkeiten</h4>
                <p className="mt-1 text-red-950">
                  (1) <strong>Gebrochene Vereinbarungen:</strong> Der Betreiber ist nicht verantwortlich und haftet in keiner Weise, falls ein Nutzer Vereinbarungen bricht – einschließlich, aber nicht beschränkt auf:
                </p>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-red-950">
                  <li>Nichtzahlung oder verspätete Zahlung des vereinbarten Mietpreises</li>
                  <li>Nichterscheinen zur vereinbarten Zeit oder plötzliche Absagen</li>
                  <li>Falschangaben zu Stellplatzmerkmalen, Zufahrt oder Maßen</li>
                  <li>Widerrechtliches Weitervermieten ohne Erlaubnis des Hauseigentümers</li>
                  <li>Blockieren des Stellplatzes über den vereinbarten Mietzeitraum hinaus (Überziehen)</li>
                  <li>Falschparken auf fremden Stellplätzen oder unberechtigte Abschleppmaßnahmen</li>
                </ul>
                <p className="mt-1 text-red-950 font-bold">
                  (2) Streitigkeiten, Mahnungen, Schadensersatzforderungen oder Räumungsansprüche sind ausschließlich direkt und auf eigenes rechtliches Risiko zwischen Vermieter und Mieter zu klären.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">§ 6 Private Zahlungsabwicklung & Gebührenfreiheit</h4>
                <p className="mt-1">
                  (1) Das Veröffentlichen von Standard-Inseraten und die Nutzung des Kommunikationssystems auf Meinparkplatz ist für Nutzer <strong>grundsätzlich kostenlos</strong>. Es fallen keine Vermittlungsprovisionen an den Betreiber an.
                </p>
                <p className="mt-1">
                  (2) Alle Zahlungen (z.B. Barzahlung bei Schlüsselübergabe oder PayPal) werden direkt zwischen den Nutzern vereinbart und abgewickelt. Der Betreiber nimmt kein Geld treuhänderisch entgegen und bietet keine Treuhanddienste an.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">§ 7 Haftungsausschluss für Sach- und Fahrzeugschäden</h4>
                <p className="mt-1">
                  (1) Der Betreiber haftet nicht für Schäden, die an oder in auf den Stellplätzen abgestellten Fahrzeugen entstehen (z.B. durch Vandalismus, Einbruch, Diebstahl, Parkrempler, herabfallende Gegenstände, Feuchtigkeit, Rohrbrüche oder Unwetterschäden).
                </p>
                <p className="mt-1">
                  (2) Der Abschluss entsprechender Versicherungen (z.B. Kfz-Kaskoversicherung, Privathaftpflichtversicherung) obliegt den Nutzern selbst.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">§ 8 Allgemeine Haftungsbeschränkung des Betreibers</h4>
                <p className="mt-1">
                  (1) Der Betreiber haftet nur bei Vorsatz oder grober Fahrlässigkeit. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist die Haftung auf den typischerweise vorhersehbaren Schaden begrenzt.
                </p>
                <p className="mt-1">
                  (2) Der Betreiber übernimmt keine Garantie für die ständige, unterbrechungsfreie Verfügbarkeit des Portals oder die erfolgreiche Vermittlung von Stellplätzen.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">§ 9 Datenschutz & automatische Chat-Löschung (14 Tage)</h4>
                <p className="mt-1">
                  (1) Der Betreiber verarbeitet personenbezogene Daten streng im Einklang mit der DSGVO.
                </p>
                <p className="mt-1">
                  (2) Zum maximalen Schutz der Privatsphäre werden geschriebene Chatnachrichten nach 14 Tagen automatisch und unwiderruflich aus der Datenbank gelöscht.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">§ 10 Gerichtsstand & Salvatorische Klausel</h4>
                <p className="mt-1">
                  (1) Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten mit Kaufleuten ist Frankfurt am Main.
                </p>
                <p className="mt-1">
                  (2) Sollte eine Bestimmung dieser AGB unwirksam sein, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-[#22262d] text-white p-4 flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#86b817]" />
            <h3 className="font-bold text-sm">Rechtliche Information & Portalbestimmungen</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-bold px-5 py-2 rounded-lg text-xs"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
