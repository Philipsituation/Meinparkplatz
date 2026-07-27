import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

export const AdBannerPlaceholder: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 my-6">
      <div className="bg-gradient-to-r from-gray-100 via-emerald-50/50 to-gray-100 border border-dashed border-gray-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="bg-gray-200 text-gray-700 font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
            Werbung / Sponsor
          </span>
          <div>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span>KFZ-Versicherung & Wallbox-Förderung 2026 vergleichen</span>
              <Sparkles className="w-3.5 h-3.5 text-[#86b817]" />
            </h4>
            <p className="text-[11px] text-gray-500">
              Spare jetzt bis zu 40% bei der Tiefgaragen- & Parkplatz-Versicherung.
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert('Sponsor-Partnerangebot wird geöffnet.')}
          className="bg-gray-900 hover:bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
        >
          <span>Ansehen</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
