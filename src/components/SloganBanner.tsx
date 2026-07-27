import React from 'react';
import { Car, Clock, ShieldCheck, Banknote, Sparkles, AlertCircle } from 'lucide-react';

interface SloganBannerProps {
  onOpenCreateListing: () => void;
}

export const SloganBanner: React.FC<SloganBannerProps> = ({ onOpenCreateListing }) => {
  return (
    <div className="bg-gradient-to-r from-[#22262d] via-[#2a303a] to-[#22262d] text-white border-b border-gray-800 relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86b817_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Main Slogan & CTA */}
          <div className="md:col-span-8 space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#86b817]/20 border border-[#86b817]/40 text-[#86b817] px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Meinparkplatz – Parkplätze privat vermieten & mieten</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Du hast einen freien Parkplatz? <br className="hidden sm:inline" />
              <span className="text-[#86b817]">Verdiene Geld</span> und vermiete ihn einfach privat!
            </h1>
            
            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl">
              Ob stundenweise vor dem Konzert am Bahnhof, über Nacht von 22 bis 10 Uhr, tagesweise bei Events oder dauerhaft monatlich.
            </p>

            {/* Quick Benefits Tags */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs text-gray-200">
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <Banknote className="w-3.5 h-3.5 text-[#86b817]" />
                <span>Diskrete Abwicklung (Bar oder PayPal)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86b817]" />
                <span>Standortschutz (~100m Bereich)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#86b817]" />
                <span>Freigabe der Adresse im Chat</span>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/15 w-full text-center sm:text-right space-y-3">
              <div className="text-xs text-gray-300">
                In weniger als 2 Minuten kostenfrei inserieren:
              </div>
              <button
                onClick={onOpenCreateListing}
                className="w-full bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold py-3 px-6 rounded-lg text-sm transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Car className="w-5 h-5" />
                <span>Jetzt Parkplatz inserieren</span>
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                100% kostenlos • Keine Buchungsprovision
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
