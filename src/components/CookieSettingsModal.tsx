import React, { useState } from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#22262d] text-white p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#86b817]" />
            <h3 className="font-bold text-sm">Datenschutzeinstellungen & Cookies</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-gray-700">
          <p className="leading-relaxed">
            Wir nutzen Technologien auf Meinparkplatz, um dir ein optimales Erlebnis für die private Vermietung von Parkplätzen zu bieten.
          </p>

          <div className="space-y-3 pt-2">
            
            {/* Essential */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div>
                <strong className="block font-bold text-gray-900">Essenziell (Erforderlich)</strong>
                <p className="text-[11px] text-gray-500">Notwendig für Chat, Merkzettel & Anmeldung.</p>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Aktiv
              </span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div>
                <strong className="block font-bold text-gray-900">Analyse & Performance</strong>
                <p className="text-[11px] text-gray-500">Hilft uns, die Parkplatzsuche zu verbessern.</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="w-4 h-4 accent-[#86b817]"
              />
            </div>

            {/* Marketing / Werbefinanzierung */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div>
                <strong className="block font-bold text-gray-900">Werbefinanzierung (Zukunft)</strong>
                <p className="text-[11px] text-gray-500">Ermöglicht kostenlose Inserate durch Partnerwerbung.</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="w-4 h-4 accent-[#86b817]"
              />
            </div>

          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold py-3 rounded-xl shadow-md transition-colors text-sm flex items-center justify-center gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? 'Einstellungen gespeichert!' : 'Auswahl speichern'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
