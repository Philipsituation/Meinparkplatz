import React from 'react';
import { Search, MapPin, PlusCircle, User, Heart, MessageSquare, LogIn, Menu, X } from 'lucide-react';
import { FilterState } from '../types';

interface HeaderProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onLogoClick: () => void;
  onOpenCreateListing: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onOpenChat: () => void;
  onOpenBookmarks: () => void;
  unreadChatsCount: number;
  bookmarkedCount: number;
  currentUser: {
    name: string;
    email: string;
    isEmailVerified: boolean;
    zipCode: string;
  } | null;
  onSearchSubmit: () => void;
}

export function Header({
  filters,
  setFilters,
  onLogoClick,
  onOpenCreateListing,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onOpenChat,
  onOpenBookmarks,
  unreadChatsCount,
  bookmarkedCount,
  currentUser,
  onSearchSubmit,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-[#22262d] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* Logo & Markenname (Jetzt klickbar -> Zur Startseite) */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-12 h-12 bg-[#86b817] rounded-2xl flex items-center justify-center text-[#22262d] font-black text-2xl shadow-inner group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight group-hover:text-[#86b817] transition-colors leading-tight">
              Mein Parkplatz
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Dein Stellplatz-Portal
            </span>
          </div>
        </div>

        {/* Schnellsuchleiste im Header (optional, direkt filternd) */}
        <div className="hidden md:flex items-center bg-white/10 rounded-2xl p-1.5 border border-white/10 flex-1 max-w-md mx-4 focus-within:border-[#86b817] transition-colors">
          <div className="flex items-center gap-2 px-3 flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Stadt, PLZ oder Adresse suchen..."
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                onSearchSubmit();
              }}
              className="bg-transparent border-none text-xs text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Desktop Navigation / Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Merkzettel */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white flex items-center gap-2 text-xs font-bold"
            title="Merkzettel"
          >
            <Heart className={`w-4 h-4 ${bookmarkedCount > 0 ? 'text-rose-500 fill-current' : ''}`} />
            <span>Merkzettel</span>
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Nachrichten / Chat */}
          <button
            onClick={onOpenChat}
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white flex items-center gap-2 text-xs font-bold"
            title="Nachrichten"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
            {unreadChatsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#86b817] text-[#22262d] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {unreadChatsCount}
              </span>
            )}
          </button>

          {/* Parkplatz inserieren Button */}
          <button
            onClick={onOpenCreateListing}
            className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Parkplatz inserieren</span>
          </button>

          {/* Benutzer / Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                <div className="w-6 h-6 bg-[#86b817] rounded-full text-[#22262d] flex items-center justify-center font-black">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors border border-white/10"
            >
              <LogIn className="w-4 h-4 text-[#86b817]" />
              <span>Anmelden / Registrieren</span>
            </button>
          )}

        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a1e24] border-t border-white/10 px-4 py-4 space-y-3">
          <button
            onClick={() => { setMobileMenuOpen(false); onLogoClick(); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-xs font-bold flex items-center gap-2"
          >
            🏠 Startseite
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenBookmarks(); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-xs font-bold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">❤️ Merkzettel</span>
            <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px]">{bookmarkedCount}</span>
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-xs font-bold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">💬 Nachrichten / Chat</span>
            {unreadChatsCount > 0 && <span className="bg-[#86b817] text-[#22262d] px-2 py-0.5 rounded-full text-[10px]">{unreadChatsCount}</span>}
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenCreateListing(); }}
            className="w-full bg-[#86b817] text-[#22262d] py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow"
          >
            <PlusCircle className="w-4 h-4" /> Parkplatz inserieren
          </button>
          {currentUser ? (
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenProfile(); }}
              className="w-full bg-white/10 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" /> Mein Profil ({currentUser.name})
            </button>
          ) : (
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="w-full bg-white/10 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-[#86b817]" /> Anmelden / Registrieren
            </button>
          )}
        </div>
      )}
    </header>
  );
}
