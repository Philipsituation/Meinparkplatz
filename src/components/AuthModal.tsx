import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle, Eye, EyeOff, Loader2, ExternalLink } from 'lucide-react';
import { signUpWithSupabase, signInWithSupabase, isSupabaseConfigured, AppUser } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
  onOpenLegalModal?: (type: 'agb' | 'datenschutz') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenLegalModal,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Rechtliche Pflicht-Bestätigungen für die Registrierung
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isAgbAccepted, setIsAgbAccepted] = useState(false);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (mode === 'register') {
      if (!isAgeConfirmed || !isAgbAccepted || !isPrivacyAccepted) {
        setErrorMessage('Bitte bestätige dein Mindestalter (18+), die AGB und die Datenschutzerklärung, um ein Konto zu erstellen.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        const res = await signUpWithSupabase(
          email.trim(),
          password,
          name.trim() || 'Neuer Nutzer',
          zipCode.trim() || '60329'
        );

        if (res.error) {
          // Deutsches verständliches Feedback bei typischen Supabase Auth Fehlern
          if (res.error.toLowerCase().includes('already registered')) {
            setErrorMessage('Diese E-Mail-Adresse ist bereits registriert. Bitte melde dich an.');
          } else if (res.error.toLowerCase().includes('password')) {
            setErrorMessage('Das Passwort muss mindestens 6 Zeichen lang sein.');
          } else {
            setErrorMessage(`Fehler bei der Registrierung: ${res.error}`);
          }
          setIsLoading(false);
          return;
        }

        if (res.emailConfirmationRequired) {
          setSuccessNotice(
            `Konto erfolgreich erstellt! Bitte überprüfe deine E-Mails an ${email}, um die Registrierung zu bestätigen.`
          );
        } else {
          setSuccessNotice('Konto erfolgreich erstellt und verifiziert!');
        }

        if (res.user) {
          setTimeout(() => {
            onLoginSuccess(res.user!);
            onClose();
          }, 1200);
        }
      } else {
        // Login Flow
        const res = await signInWithSupabase(email.trim(), password);

        if (res.error) {
          if (res.error.toLowerCase().includes('invalid login credentials') || res.error.toLowerCase().includes('invalid_grant')) {
            setErrorMessage('Ungültige E-Mail-Adresse oder falsches Passwort.');
          } else if (res.error.toLowerCase().includes('email not confirmed')) {
            setErrorMessage('Deine E-Mail-Adresse wurde noch nicht bestätigt. Bitte klicke auf den Bestätigungslink in deiner E-Mail.');
          } else {
            setErrorMessage(`Anmeldefehler: ${res.error}`);
          }
          setIsLoading(false);
          return;
        }

        if (res.user) {
          onLoginSuccess(res.user);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Klick Demo-Login für sofortiges Testen
  const handleQuickDemoLogin = (roleName: string, demoEmail: string) => {
    onLoginSuccess({
      name: roleName,
      email: demoEmail,
      isEmailVerified: true,
      zipCode: '60329',
    });
    onClose();
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      
      {/* Header */}
      <div className="bg-[#22262d] text-white p-5 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#86b817] text-[#22262d] flex items-center justify-center font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Meinparkplatz Authentifizierung</h3>
            <p className="text-[11px] text-gray-400">Sicheres Einloggen & Profilverwaltung mit Supabase</p>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-700">
        <button
          type="button"
          onClick={() => { 
            setMode('login'); 
            setErrorMessage(null); 
            setSuccessNotice(null); 
          }}
          className={`flex-1 py-3 transition-colors ${
            mode === 'login' 
              ? 'bg-white text-[#86b817] border-b-2 border-[#86b817]' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          Anmelden / Login
        </button>
        <button
          type="button"
          onClick={() => { 
            setMode('register'); 
            setErrorMessage(null); 
            setSuccessNotice(null); 
          }}
          className={`flex-1 py-3 transition-colors ${
            mode === 'register' 
              ? 'bg-white text-[#86b817] border-b-2 border-[#86b817]' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          Konto registrieren (Kostenlos)
        </button>
      </div>

      {/* Status Badges & Alerts */}
      <div className="p-5 space-y-4">
        
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-bold">Hinweis zur Anmeldung:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Dein Name / Inserenten-Name *</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    placeholder="z.B. Philip Schüßler"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 outline-none focus:border-[#86b817] focus:bg-white"
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
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:border-[#86b817] focus:bg-white"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">E-Mail-Adresse *</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="email"
                required
                placeholder="deine.email@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 outline-none focus:border-[#86b817] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Passwort *</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Mindestens 6 Zeichen"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-10 py-2.5 text-xs text-gray-900 outline-none focus:border-[#86b817] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Rechtliche Pflichtbestätigungen für Registrierung */}
          {mode === 'register' && (
            <div className="pt-2 pb-1 space-y-2.5 bg-gray-50/80 p-3 rounded-xl border border-gray-200">
              <div className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86b817]" />
                <span>Rechtliche Vereinbarungen (Pflichtangaben)</span>
              </div>

              {/* Checkbox 1: Mindestalter 18 Jahre */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  required
                  checked={isAgeConfirmed}
                  onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#86b817] focus:ring-[#86b817] cursor-pointer"
                />
                <span className="text-[11px] text-gray-700 leading-tight">
                  <strong className="text-gray-900 font-bold">Volljährigkeit:</strong> Ich bestätige, dass ich mindestens <strong className="text-gray-900">18 Jahre alt</strong> und voll geschäftsfähig bin.
                </span>
              </label>

              {/* Checkbox 2: AGB & Haftungsausschluss */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  required
                  checked={isAgbAccepted}
                  onChange={(e) => setIsAgbAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#86b817] focus:ring-[#86b817] cursor-pointer"
                />
                <span className="text-[11px] text-gray-700 leading-tight">
                  Ich habe die{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onOpenLegalModal) onOpenLegalModal('agb');
                    }}
                    className="text-[#74a312] hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    <span>Nutzungsbedingungen (AGB)</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>{' '}
                  gelesen und akzeptiere den vollständigen Haftungsausschluss des Betreibers (alle Verträge, Schlüsselübergaben & Zahlungen laufen rein privat zwischen Nutzern).
                </span>
              </label>

              {/* Checkbox 3: Datenschutzerklärung */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  required
                  checked={isPrivacyAccepted}
                  onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#86b817] focus:ring-[#86b817] cursor-pointer"
                />
                <span className="text-[11px] text-gray-700 leading-tight">
                  Ich willige in die{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onOpenLegalModal) onOpenLegalModal('datenschutz');
                    }}
                    className="text-[#74a312] hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    <span>Datenschutzerklärung</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>{' '}
                  ein (inkl. automatischer Chat-Löschung nach 14 Tagen).
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (mode === 'register' && (!isAgeConfirmed || !isAgbAccepted || !isPrivacyAccepted))}
            className="w-full bg-[#86b817] hover:bg-[#74a312] disabled:opacity-50 text-[#22262d] font-black py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Wird verarbeitet...</span>
              </>
            ) : mode === 'login' ? (
              'Jetzt Anmelden'
            ) : (
              'Kostenloses Konto anlegen'
            )}
          </button>
        </form>

        {/* Quick Demo Test Login */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">
            Test-Zugang / Schnellanmeldung
          </p>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('Philip Schüßler', 'philip.s@meinparkplatz.de')}
            className="w-full bg-gray-100 hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200 text-gray-800 hover:text-emerald-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>⚡ Als Inhaber (Philip Schüßler) mit 1 Klick einloggen</span>
          </button>
        </div>

        {/* Security & SSL Notice */}
        <div className="pt-2 text-[11px] text-gray-500 flex items-center justify-center gap-1.5 border-t border-gray-100">
          <ShieldCheck className="w-3.5 h-3.5 text-[#86b817]" />
          <span>SSL-verschlüsselte & sichere Authentifizierung</span>
        </div>

      </div>

    </div>
  );
};

