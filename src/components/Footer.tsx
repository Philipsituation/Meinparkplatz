import React from 'react';
import { ShieldCheck, Heart, MapPin, Sparkles } from 'lucide-react';
import { LegalModalType } from '../types';

interface FooterProps {
  onOpenLegalModal: (type: LegalModalType) => void;
  onOpenCookieSettings: () => void;
  onOpenCreateListing: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalModal,
  onOpenCookieSettings,
  onOpenCreateListing,
}) => {
  return (
    <footer className="bg-[#22262d] text-gray-300 text-xs border-t border-gray-800">
      
      {/* Top Footer Callout */}
      <div className="bg-[#1b1e24] py-8 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 text-white font-extrabold text-base">
              <div className="w-7 h-7 bg-gradient-to-br from-[#86b817] to-[#719f12] rounded-lg flex items-center justify-center text-[#1b1e24] shadow-xs">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                  <path d="M3.5 21V9.5a8.5 8.5 0 0 1 17 0V21h-3.8V9.5a4.7 4.7 0 0 0-9.4 0V21H3.5z" fill="currentColor" />
                  <path d="M9.5 17V8.5h3.6a2.5 2.5 0 0 1 0 5H9.5" stroke="#1b1e24" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <span className="text-lg font-black tracking-tight">Meinparkplatz</span>
            </div>
            <p className="text-gray-400 max-w-2xl text-xs">
              Deutschlands direkte Plattform für die private Stellplatzvermietung. Flexibel stundenweise, über Nacht bei Konzerten am Bahnhof, tagesweise oder monatlich.
            </p>
          </div>

          <button
            onClick={onOpenCreateListing}
            className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold px-6 py-3 rounded-xl shadow-lg text-sm transition-all shrink-0"
          >
            + Jetzt Parkplatz inserieren
          </button>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        
        {/* Col 1: Kategorien */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Kategorien</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">🏢 Tiefgaragenstellplätze</li>
            <li className="hover:text-white cursor-pointer transition-colors">🅿️ Außenstellplätze</li>
            <li className="hover:text-white cursor-pointer transition-colors">⚡ E-Auto Wallboxen</li>
            <li className="hover:text-white cursor-pointer transition-colors">🚗 Carports & Garagen</li>
            <li className="hover:text-white cursor-pointer transition-colors">🚐 Wohnmobilstellplätze</li>
          </ul>
        </div>

        {/* Col 2: Informationen & Sicherheit */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Informationen</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button onClick={() => onOpenLegalModal('hilfe')} className="hover:text-white transition-colors text-left">
                Hilfe & FAQ
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegalModal('sicherheit')} className="hover:text-white transition-colors text-left">
                Tipps für deine Sicherheit
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegalModal('sicherheitsluecken')} className="hover:text-white transition-colors text-left">
                Sicherheitslücken melden
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegalModal('widerruf')} className="hover:text-white transition-colors text-left">
                Vertrag Widerrufen
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegalModal('jugendschutz')} className="hover:text-white transition-colors text-left">
                Kinder- und Jugendschutz
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Rechtliches & Datenschutz */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Rechtliches</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button onClick={() => onOpenLegalModal('barrierefreiheit')} className="hover:text-white transition-colors text-left">
                Barrierefreiheitserklärung
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegalModal('datenschutz')} className="hover:text-white transition-colors text-left">
                Datenschutzerklärung
              </button>
            </li>
            <li>
              <button onClick={onOpenCookieSettings} className="hover:text-white transition-colors text-left text-[#86b817] font-semibold">
                Datenschutzeinstellungen
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegalModal('agb')} className="hover:text-white transition-colors text-left">
                Nutzungsbedingungen (AGB)
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegalModal('impressum')} className="hover:text-white transition-colors text-left font-bold text-white">
                Impressum (Philip Schüßler)
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Top Städte */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Top Standorte</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">Frankfurt am Main HBF</li>
            <li className="hover:text-white cursor-pointer transition-colors">München Allianz Arena / HBF</li>
            <li className="hover:text-white cursor-pointer transition-colors">Berlin Mitte & Torstraße</li>
            <li className="hover:text-white cursor-pointer transition-colors">Hamburg Altona & HBF</li>
            <li className="hover:text-white cursor-pointer transition-colors">Köln Innenstadt & Dom</li>
          </ul>
        </div>

        {/* Col 5: Branding & Safe Payments */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3 bg-gray-800/40 p-4 rounded-xl border border-gray-800">
          <h4 className="font-extrabold text-white text-sm">Diskrete Bezahlung</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Auf <strong>Meinparkplatz</strong> wird die Bezahlung diskret und direkt per <strong>Bar vor Ort</strong> oder <strong>PayPal</strong> vereinbart.
          </p>
          <div className="flex gap-2 font-bold text-xs pt-1">
            <span className="bg-emerald-950 text-emerald-300 px-2 py-1 rounded border border-emerald-800">💵 Bar</span>
            <span className="bg-blue-950 text-blue-300 px-2 py-1 rounded border border-blue-800">🅿️ PayPal</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 px-4 bg-[#171a1f] text-gray-400 text-center text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Meinparkplatz • Betreiber & Impressum: <strong>Philip Schüßler</strong>
          </span>
          <span className="text-gray-400">
            Parkplätze privat vermieten & mieten mit Standortschutz
          </span>
        </div>
      </div>

    </footer>
  );
};
