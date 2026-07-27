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
                Meinparkplatz stellt lediglich eine Vermittlungs- und Kommunikationsplattform für die private Vermietung von Parkplätzen bereit. Die genaue Adresse wird zum Schutz der Privatsphäre erst nach persönlicher Freigabe durch den Vermieter im Chat übermittelt. Verträge und Zahlungen (Bar oder PayPal) werden direkt und diskret zwischen Vermieter und Mieter geregelt.
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
                  Aus Sicherheits- und Flexibilitätsgründen erlaubt die Plattform ausschließlich **Barzahlung bei Übergabe vor Ort** oder **PayPal (Käuferschutz)**.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm">Wie funktioniert das Smiley-Bewertungssystem?</h4>
                <p className="mt-1 text-gray-600">
                  Wie bei Kleinanzeigen kannst du Vermieter mit den drei Smileys (😁 TOP, 🙂 Zufrieden, 🙁 Na ja) sowie Tags (pünktlich, freundlich) bewerten. Das ist möglich, sobald du mit dem Vermieter ausreichend im Chat kommuniziert hast.
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
              <p>Wechsele nicht auf externe Dienste wie WhatsApp, um Betrug und Spam zu vermeiden.</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-purple-950">
              <h4 className="font-bold text-sm">3. Schlüssel- & Chipkarte persönlich testen</h4>
              <p>Überprüfe bei Tiefgaragen oder Schranken vor der Abfahrt, ob der Transponder einwandfrei funktioniert.</p>
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
              <p>E-Mail: security@parkplatz-kleinanzeigen.de</p>
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
                An Philip Schüßler, Kaiserstraße 42, 60329 Frankfurt, E-Mail: kontakt@parkplatz-kleinanzeigen.de:<br /><br />
                Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über die Nutzung des Portals.<br />
                Bestellt am: [Datum] / Erhalten am: [Datum]<br />
                Name des Verbrauchers:<br />
                Anschrift des Verbrauchers:<br />
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
              Die Nutzung unseres Portals ist ausschließlich Personen gestattet, die das 18. Lebensjahr vollendet haben oder mit ausdrücklicher Zustimmung ihrer Erziehungsberechtigten handeln.
            </p>
            <p>
              Ansprechpartner für Jugendschutz: Philip Schüßler (jugendschutz@parkplatz-kleinanzeigen.de).
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
              Sollten dir Barrieren auf unserer Website auffallen, kannst du uns jederzeit unter barrierefrei@parkplatz-kleinanzeigen.de kontaktieren.
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
            <h3 className="font-extrabold text-base text-gray-900 border-b pb-2">Nutzungsbedingungen & AGB</h3>
            <p>
              Diese Allgemeine Nutzungsbedingungen regeln die Verwendung des Online-Kommunikationsportals "ParkPlatz Kleinanzeigen".
            </p>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Das Portal vermittelt lediglich Kontakte zwischen privaten Vermietern von Stellplätzen/Garagen und Stellplatzsuchenden.</li>
              <li>Ein Vertrag über die Nutzung des Stellplatzes kommt direkt zwischen den Nutzern zustande.</li>
              <li>Zahlungsabwicklungen erfolgen ausschließlich bar oder per PayPal zwischen den Vertragspartnern.</li>
            </ol>
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
