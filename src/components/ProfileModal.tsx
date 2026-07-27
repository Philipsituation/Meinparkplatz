import React, { useState } from 'react';
import { X, User, Eye, MessageSquare, Euro, Trash2, ShieldCheck, Mail, AlertTriangle, List, CheckCircle, LogOut, Heart, Star, Clock, MapPin, Smile } from 'lucide-react';
import { ParkingListing, Conversation } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string; isEmailVerified: boolean; zipCode: string };
  userListings: ParkingListing[];
  conversations: Conversation[];
  bookmarkedListings?: ParkingListing[];
  onDeleteListing: (id: string) => void;
  onOpenChatWithConversation: (conv: Conversation) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userListings,
  conversations,
  bookmarkedListings = [],
  onDeleteListing,
  onOpenChatWithConversation,
  onLogout,
  onDeleteAccount,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'listings' | 'chats' | 'bookmarks' | 'ratings' | 'settings'>('listings');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Compute stats
  const totalViews = userListings.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
  const totalInquiries = conversations.length;
  const estimatedEarnings = userListings.reduce((sum, l) => sum + l.price * 3, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 my-auto flex flex-col max-h-[90vh]">
        
        {/* Profile Header */}
        <div className="bg-[#22262d] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-gray-800">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#86b817] text-[#22262d] font-black flex items-center justify-center text-2xl shadow-inner shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="font-extrabold text-lg text-white flex items-center gap-2">
                <span>{currentUser.name}</span>
                <span className="bg-[#86b817]/20 text-[#86b817] text-xs px-2 py-0.5 rounded-md border border-[#86b817]/30 font-bold flex items-center gap-1">
                  😁 TOP Vermieter
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-[#86b817]" /> PLZ {currentUser.zipCode}</span>
                <span>•</span>
                <span className="text-gray-400">Mitglied seit Juli 2026</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-gray-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Abmelden</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${
              activeTab === 'listings' ? 'bg-white text-[#86b817] border-[#86b817]' : 'border-transparent hover:bg-gray-100 text-gray-600'
            }`}
          >
            📋 Meine Inserate ({userListings.length})
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${
              activeTab === 'chats' ? 'bg-white text-[#86b817] border-[#86b817]' : 'border-transparent hover:bg-gray-100 text-gray-600'
            }`}
          >
            💬 Nachrichten ({conversations.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${
              activeTab === 'bookmarks' ? 'bg-white text-[#86b817] border-[#86b817]' : 'border-transparent hover:bg-gray-100 text-gray-600'
            }`}
          >
            ❤️ Merkzettel ({bookmarkedListings.length})
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${
              activeTab === 'ratings' ? 'bg-white text-[#86b817] border-[#86b817]' : 'border-transparent hover:bg-gray-100 text-gray-600'
            }`}
          >
            ⭐ Bewertungen
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${
              activeTab === 'settings' ? 'bg-white text-[#86b817] border-[#86b817]' : 'border-transparent hover:bg-gray-100 text-gray-600'
            }`}
          >
            ⚙️ Konto & Logout
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">
          
          {/* TAB 1: Meine Inserate */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">Deine aktiven & inserierten Parkplätze</h3>
                <span className="text-xs text-gray-500 font-medium">Insgesamt {totalViews} Aufrufe</span>
              </div>

              {userListings.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center space-y-2">
                  <p className="text-sm font-semibold text-gray-800">Du hast aktuell keine aktiven Inserate.</p>
                  <p className="text-xs text-gray-500">
                    Biete deinen freien Stellplatz oder deine Garage einfach an und verdiene Geld!
                  </p>
                </div>
              ) : (
                userListings.map((listing) => (
                  <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <img src={listing.images[0]} alt="preview" className="w-20 h-14 object-cover rounded-lg shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900">{listing.title}</h4>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">
                          <span className="font-extrabold text-emerald-700">{listing.price} €</span> ({listing.priceType}) • {listing.city}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                          <span>👁️ {listing.viewsCount} Aufrufe</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">Aktiv online</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteListing(listing.id)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors self-end sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Anzeige löschen</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Chatverläufe / Nachrichten */}
          {activeTab === 'chats' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Datenschutz:</strong> Alle Chatverläufe und Kontaktdaten werden nach 14 Tagen inaktivität automatisch gelöscht.
                </span>
              </div>

              {conversations.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-500 text-sm">
                  Keine aktiven Chatverläufe vorhanden.
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      onOpenChatWithConversation(conv);
                      onClose();
                    }}
                    className="bg-white border border-gray-200 hover:border-[#86b817] p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#86b817] text-[#22262d] font-bold flex items-center justify-center shrink-0">
                        {conv.landlordName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-gray-900 group-hover:text-[#86b817] transition-colors">
                          {conv.landlordName} • <span className="font-normal text-gray-500">{conv.listingTitle}</span>
                        </div>
                        <div className="text-[11px] text-gray-600 truncate max-w-md mt-0.5">{conv.lastMessage}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Merkzettel */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">Deine gespeicherten Parkplätze</h3>
              
              {bookmarkedListings.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-500 text-xs">
                  Dein Merkzettel ist leer. Klicke bei interessanten Parkplätzen auf das Herz ❤️, um sie hier zu speichern.
                </div>
              ) : (
                bookmarkedListings.map((listing) => (
                  <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={listing.images[0]} alt="preview" className="w-14 h-11 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{listing.title}</h4>
                        <p className="text-[11px] text-gray-500">{listing.price} € ({listing.priceType}) • {listing.city}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Bewertungen */}
          {activeTab === 'ratings' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Dein Smiley-Bewertungsprofil</h4>
                    <p className="text-xs text-gray-500">Transparente Zufriedenheit deiner Mieter & Vermieter</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 font-black text-base flex items-center gap-1">
                      😁 100% Positiv
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center pt-1">
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <div className="text-xl">😁</div>
                    <div className="font-extrabold text-sm text-emerald-950 mt-0.5">5x TOP</div>
                    <div className="text-[10px] text-emerald-800">Sehr zufrieden</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                    <div className="text-xl">🙂</div>
                    <div className="font-extrabold text-sm text-blue-950 mt-0.5">0x Zufrieden</div>
                    <div className="text-[10px] text-blue-800">Alles ok</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                    <div className="text-xl">🙁</div>
                    <div className="font-extrabold text-sm text-gray-950 mt-0.5">0x Naja</div>
                    <div className="text-[10px] text-gray-600">Verbesserbar</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Einstellungen & Abmelden */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-gray-900">Kontoinformationen</h4>
                <div className="text-xs text-gray-700 space-y-1.5">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">Name / Inserent:</span>
                    <strong>{currentUser.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">E-Mail Adresse:</span>
                    <strong>{currentUser.email}</strong>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">Standort-PLZ:</span>
                    <strong>{currentUser.zipCode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">E-Mail Verifizierung:</span>
                    <strong className="text-emerald-700">✓ Bestätigt</strong>
                  </div>
                </div>
              </div>

              {/* Explicit Logout Button Box */}
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Aus Deinem Konto abmelden</h4>
                  <p className="text-xs text-gray-500">Beendet die Sitzung auf diesem Gerät.</p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="bg-[#22262d] hover:bg-black text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Jetzt Abmelden</span>
                </button>
              </div>

              {/* Danger Zone: Profile Deletion */}
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3">
                <div className="font-bold text-sm text-rose-950 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Konto & Daten löschen</span>
                </div>
                <p className="text-xs text-rose-800">
                  Möchtest du dein Profil und alle damit verbundenen Inserate & Chatverläufe unwiderruflich löschen?
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-lg text-xs transition-colors shadow"
                  >
                    Profil unwiderruflich löschen
                  </button>
                ) : (
                  <div className="p-3 bg-white border border-rose-300 rounded-lg space-y-2">
                    <p className="text-xs font-bold text-rose-900">Bist du absolut sicher?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onDeleteAccount();
                          onClose();
                        }}
                        className="bg-rose-700 text-white font-extrabold px-3 py-1.5 rounded text-xs"
                      >
                        Ja, jetzt löschen
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded text-xs"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

