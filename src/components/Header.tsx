import React from 'react';
import { Search, MapPin, PlusCircle, MessageSquare, Heart, User, ShieldCheck, Database, LogOut } from 'lucide-react';
import { FilterState } from '../types';

interface HeaderProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenCreateListing: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onOpenChat: () => void;
  onOpenBookmarks: () => void;
  unreadChatsCount: number;
  bookmarkedCount: number;
  currentUser: { name: string; isEmailVerified: boolean } | null;
  onSearchSubmit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  setFilters,
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
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#22262d] text-white shadow-md border-b border-gray-800">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            <button 
              onClick={() => {
                setFilters(prev => ({ 
                  ...prev, 
                  searchQuery: '', 
                  locationQuery: '', 
                  selectedType: 'all', 
                  selectedPriceType: 'all',
                  vehicleType: 'all',
                  paymentMethod: 'all',
                }));
              }}
              className="flex items-center gap-3 group text-left transition-transform active:scale-98"
              title="Meinparkplatz – Zur Startseite"
            >
              {/* Distinct Inverted U Parking Canopy & P Logo */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-[#86b817] via-[#94cc19] to-[#719f12] rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-[#86b817]/40 group-hover:scale-105 group-hover:shadow-[#86b817]/20 transition-all shrink-0">
                <svg className="w-7 h-7 text-[#1b1e24] drop-shadow-xs" viewBox="0 0 24 24" fill="none">
                  {/* Outer Inverted U Parking Arch / Canopy */}
                  <path 
                    d="M3.5 21V9.5a8.5 8.5 0 0 1 17 0V21h-3.8V9.5a4.7 4.7 0 0 0-9.4 0V21H3.5z" 
                    fill="currentColor"
                  />
                  {/* Inner Parking "P" Symbol inside the Arch */}
                  <path 
                    d="M9.5 17V8.5h3.6a2.5 2.5 0 0 1 0 5H9.5" 
                    stroke="#1b1e24" 
                    strokeWidth="2.3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="none" 
                  />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl sm:text-3xl tracking-tight text-white group-hover:text-[#86b817] transition-colors">
                    Meinparkplatz
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-gray-400 -mt-0.5">Parkplätze privat vermieten</p>
              </div>
            </button>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              {currentUser ? (
                <div className="flex items-center gap-1.5 bg-gray-800/80 p-1 rounded-lg border border-gray-700">
                  <button
                    onClick={onOpenProfile}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-white hover:text-[#86b817]"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="max-w-[70px] truncate">{currentUser.name.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1 text-rose-400 hover:text-rose-300 text-xs"
                    title="Abmelden"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="bg-[#86b817]/20 border border-[#86b817] text-[#86b817] hover:bg-[#86b817] hover:text-[#22262d] font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Anmelden</span>
                </button>
              )}

              <button
                onClick={onOpenCreateListing}
                className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Inserieren</span>
              </button>
            </div>
          </div>

          {/* Quick Search Bar in Header */}
          <div className="w-full lg:flex-1 max-w-2xl">
            <form 
              onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
              className="flex flex-col sm:flex-row items-center bg-white text-gray-800 rounded-xl p-1 shadow-inner gap-1"
            >
              {/* Search query */}
              <div className="relative flex-1 w-full flex items-center px-3 border-b sm:border-b-0 sm:border-r border-gray-200 py-1.5 sm:py-0">
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Was suchst du? (z.B. Tiefgarage, BHF, Ladesäule)"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full text-xs sm:text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900"
                />
              </div>

              {/* Location & PLZ */}
              <div className="relative w-full sm:w-52 flex items-center px-3 py-1.5 sm:py-0">
                <MapPin className="w-4 h-4 text-[#86b817] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="PLZ oder Ort (z.B. 60329)"
                  value={filters.locationQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, locationQuery: e.target.value }))}
                  className="w-full text-xs sm:text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-bold px-5 py-2 rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Suchen</span>
              </button>
            </form>
          </div>

          {/* User & Navigation Links */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Bookmarks / Merkzettel */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg flex flex-col items-center gap-0.5 text-xs transition-colors"
              title="Merkzettel / Favoriten"
            >
              <Heart className="w-5 h-5 text-rose-400" />
              <span>Merkzettel</span>
              {bookmarkedCount > 0 && (
                <span className="absolute top-1 right-2 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Direct Chat / Nachrichten */}
            <button
              onClick={onOpenChat}
              className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg flex flex-col items-center gap-0.5 text-xs transition-colors"
              title="Nachrichten & Chatverläufe"
            >
              <MessageSquare className="w-5 h-5 text-[#86b817]" />
              <span>Nachrichten</span>
              {unreadChatsCount > 0 && (
                <span className="absolute top-1 right-2 bg-[#86b817] text-[#22262d] font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadChatsCount}
                </span>
              )}
            </button>

            {/* User Account / Login / Logout Window */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-gray-800/90 p-1 rounded-xl border border-gray-700 shadow-sm">
                <button
                  onClick={onOpenProfile}
                  className="px-3 py-1.5 text-gray-100 hover:text-white hover:bg-gray-700/80 rounded-lg flex items-center gap-2 text-xs transition-colors"
                  title="Mein Profil, Inserate & Einstellungen öffnen"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Angemeldet</span>
                    <span className="font-extrabold max-w-[100px] truncate text-white">{currentUser.name.split(' ')[0]}</span>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 text-rose-300 hover:text-white hover:bg-rose-950/80 rounded-lg flex items-center justify-center text-xs transition-colors border border-rose-900/50"
                  title="Aus Deinem Konto abmelden"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="text-[11px] font-bold ml-1">Abmelden</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 bg-emerald-950/50 hover:bg-[#86b817] border border-[#86b817] text-[#86b817] hover:text-[#22262d] font-extrabold rounded-xl flex items-center gap-2 text-xs transition-all shadow-sm group"
                title="Jetzt anmelden oder neues Konto erstellen"
              >
                <User className="w-4 h-4 text-[#86b817] group-hover:text-[#22262d] transition-colors" />
                <span>Anmelden / Registrieren</span>
              </button>
            )}

            {/* Create Listing CTA */}
            <button
              onClick={onOpenCreateListing}
              className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Inserieren</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
