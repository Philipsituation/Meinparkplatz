import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; isEmailVerified: boolean; zipCode: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Verification notice banner state
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'register') {
      setShowVerificationBanner(true);
      onLoginSuccess({
        name: name.trim() || 'Neuer Nutzer',
        email: email.trim(),
        isEmailVerified: false,
        zipCode: zipCode.trim() || '60329',
      });
    } else {
      // Login
      onLoginSuccess({
        name: name.trim() || email.split('@')[0] || 'Nutzer',
        email: email.trim(),
        isEmailVerified: true,
        zipCode: zipCode.trim() || '60329',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#22262d] text-white p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#86b817]" />
            <h3 className="font-bold text-sm">Meinparkplatz – Anmelden oder Registrieren</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-700">
          <button
            onClick={() => { setMode('login'); setShowVerificationBanner(false); }}
            className={`flex-1 py-3 transition-colors ${
              mode === 'login' ? 'bg-white text-[#86b817] border-b-2 border-[#86b817]' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            Anmelden / Login
          </button>
          <button
            onClick={() => { setMode('register'); setShowVerificationBanner(false); }}
            className={`flex-1 py-3 transition-colors ${
              mode === 'register' ? 'bg-white text-[#86b817] border-b-2 border-[#86b817]' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            Registrieren (Kostenlos)
          </button>
        </div>

        {/* E-Mail Verification Alert */}
        {showVerificationBanner && (
          <div className="m-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Verifizierungs-E-Mail wurde gesendet!</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Bitte überprüfe deinen Posteingang für <strong>{email}</strong> und klicke auf den Bestätigungslink.
            </p>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="p-5 space-y-4">
          
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Dein Name / Inserenten-Name *</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    placeholder="z.B. Max Mustermann"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 outline-none focus:border-[#86b817]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">PLZ deines Standorts *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. 60329"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:border-[#86b817]"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">E-Mail Adresse *</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="email"
                required
                placeholder="deine.email@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 outline-none focus:border-[#86b817]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Passwort *</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 outline-none focus:border-[#86b817]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold py-3 rounded-xl shadow-md transition-colors text-sm mt-2"
          >
            {mode === 'login' ? 'Jetzt Anmelden' : 'Kostenloses Konto erstellen'}
          </button>

          {/* Privacy Footnote */}
          <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sicher & verschlüsselt nach DSGVO Standards</span>
          </div>

        </form>

      </div>
    </div>
  );
};
