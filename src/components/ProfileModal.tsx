import React, { useState } from 'react';
import { ParkingListing, Conversation } from '../types';
import { User, MessageSquare, Heart, Trash2, LogOut, CheckCircle, Settings, Star, Edit3, Save, X, Image as ImageIcon, MapPin, Upload, ArrowLeft, ArrowRight, Home } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string; isEmailVerified: boolean; zipCode: string };
  userListings: ParkingListing[];
  conversations: Conversation[];
  bookmarkedListings?: ParkingListing[];
  onDeleteListing: (id: string) => void;
  onUpdateListing?: (updatedListing: ParkingListing) => void;
  onSelectListingToView?: (listing: ParkingListing) => void;
  onOpenChatWithConversation: (conv: Conversation) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onGoHome?: () => void; // Neu: Funktion um zum Startbildschirm zurückzukehren
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  currentUser,
  userListings,
  conversations,
  bookmarkedListings = [],
  onDeleteListing,
  onUpdateListing,
  onSelectListingToView,
  onOpenChatWithConversation,
  onLogout,
  onDeleteAccount,
  onGoHome,
}) => {
  if (!isOpen) return null;

  // Aktiver Reiter im Profil
  const [activeTab, setActiveTab] = useState<'listings' | 'chats' | 'bookmarks' | 'ratings' | 'settings'>('listings');
  
  // Bearbeitungs-State für ein Inserat
  const [editingListing, setEditingListing] = useState<ParkingListing | null>(null);

  // Einstellungs-Formular-Zustände
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editZip, setEditZip] = useState(currentUser.zipCode);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveProfileData = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Kontodaten erfolgreich aktualisiert!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert('Bitte fülle alle Passwort-Felder aus.');
      return;
    }
    setSuccessMessage('Passwort erfolgreich geändert!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingListing && onUpdateListing) {
      onUpdateListing(editingListing);
      setSuccessMessage('Inserat erfolgreich aktualisiert!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setEditingListing(null);
  };

  // Echter Bild-Upload vom Handy/PC mittels Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !editingListing) return;
    
    const files = Array.from(e.target.files);

    Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            }
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
      })
    ).then((base64Images) => {
      setEditingListing((prev) => 
        prev ? { ...prev, images: [...prev.images, ...base64Images] } : null
      );
    }).catch((err) => console.error("Fehler beim Bild-Upload:", err));
  };

  // Hilfsfunktionen zum Verschieben der Bilder (Reihenfolge / Titelbild)
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    if (!editingListing) return;
    const newImages = [...editingListing.images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    // Tauschen
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setEditingListing({ ...editingListing, images: newImages });
  };

  const handleSetAsCover = (index: number) => {
    if (!editingListing || index === 0) return;
    const newImages = [...editingListing.images];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage); // An den Anfang setzen (wird Titelbild)

    setEditingListing({ ...editingListing, images: newImages });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden text-xs text-gray-800">
      
      {/* Kopfbereich der Profilseite mit klickbarem Logo / Start-Button */}
      <div className="bg-[#22262d] text-white px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo / Avatar klickbar, führt zum Startbildschirm */}
          <div 
            onClick={onGoHome}
            className={`w-12 h-12 bg-[#86b817] text-[#22262d] font-black rounded-2xl flex items-center justify-center text-lg shadow ${onGoHome ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
            title="Zum Startbildschirm"
          >
            {onGoHome ? <Home className="w-6 h-6" /> : currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              {currentUser.name}
              {currentUser.isEmailVerified && (
                <span className="bg-[#86b817]/20 text-[#86b817] text-[10px] px-2 py-0.5 rounded-full border border-[#86b817]/40">
                  Verifiziert ✓
                </span>
              )}
            </h2>
            <p className="text-[11px] text-gray-400">{currentUser.email} • PLZ: {currentUser.zipCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="hidden sm:flex bg-[#86b817] text-[#22262d] hover:bg-[#74a312] font-extrabold px-3.5 py-2 rounded-xl transition-colors items-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Startseite
            </button>
          )}
          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2 rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Abmelden
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-[#86b817]/10 border-b border-[#86b817]/30 p-3 text-xs text-[#22262d] font-bold flex items-center gap-2 justify-center">
          <CheckCircle className="w-4 h-4 text-[#86b817]" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profil Navigation Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('listings'); setEditingListing(null); }}
          className={`flex-1 min-w-[120px] py-3.5 px-4 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'listings' ? 'border-[#86b817] text-[#22262d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>🅿️ Inserate ({userListings.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('chats'); setEditingListing(null); }}
          className={`flex-1 min-w-[120px] py-3.5 px-4 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'chats' ? 'border-[#86b817] text-[#22262d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chats ({conversations.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('bookmarks'); setEditingListing(null); }}
          className={`flex-1 min-w-[120px] py-3.5 px-4 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'bookmarks' ? 'border-[#86b817] text-[#22262d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          <span>Merkzettel ({bookmarkedListings.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('ratings'); setEditingListing(null); }}
          className={`flex-1 min-w-[120px] py-3.5 px-4 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'ratings' ? 'border-[#86b817] text-[#22262d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
          <span>Bewertungen</span>
        </button>

        <button
          onClick={() => { setActiveTab('settings'); setEditingListing(null); }}
          className={`flex-1 min-w-[120px] py-3.5 px-4 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'settings' ? 'border-[#86b817] text-[#22262d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Einstellungen</span>
        </button>
      </div>

      {/* Tab-Inhalte als Seiten */}
      <div className="p-6">
        
        {/* TAB 1: Meine Inserate & Bearbeiten */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {editingListing ? (
              // BEARBEITUNGS-FORMULAR (SEITE ZUM BEARBEITEN)
              <form onSubmit={handleSaveEdit} className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-[#86b817]" /> Inserat bearbeiten: {editingListing.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingListing(null)}
                    className="text-gray-400 hover:text-gray-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-gray-700">Titel der Anzeige</label>
                    <input
                      type="text"
                      value={editingListing.title}
                      onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1 text-gray-700">Preis (€)</label>
                      <input
                        type="number"
                        value={editingListing.price}
                        onChange={(e) => setEditingListing({ ...editingListing, price: Number(e.target.value) })}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-gray-700">Zeitraum</label>
                      <select
                        value={editingListing.priceType}
                        onChange={(e) => setEditingListing({ ...editingListing, priceType: e.target.value as any })}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
                      >
                        <option value="hourly">Stunde</option>
                        <option value="daily">Tag</option>
                        <option value="monthly">Monat</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-700">Beschreibung</label>
                  <textarea
                    rows={3}
                    value={editingListing.description}
                    onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs focus:outline-none focus:border-[#86b817]"
                    required
                  />
                </div>

                {/* Bilder verwalten, Reihenfolge ändern & Titelbild festlegen */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-gray-700 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#86b817]" /> Fotos verwalten & Reihenfolge (Erstes Bild = Titelbild)
                    </label>
                    <span className="text-[10px] text-gray-500">{editingListing.images.length} Bilder hochgeladen</span>
                  </div>

                  {/* Vorschaubilder-Liste mit Steuerungs-Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {editingListing.images.map((imgUrl, index) => (
                      <div key={index} className={`relative flex items-center gap-3 bg-white border rounded-xl p-2 shadow-sm ${index === 0 ? 'border-2 border-[#86b817] bg-[#86b817]/5' : 'border-gray-200'}`}>
                        
                        {/* Bildvorschau */}
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <img src={imgUrl} alt="" className="w-full h-full object-cover rounded-lg border" />
                          {index === 0 && (
                            <span className="absolute -top-2 -left-2 bg-[#86b817] text-[#22262d] text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                              Titelbild
                            </span>
                          )}
                        </div>

                        {/* Steuerungsoptionen */}
                        <div className="flex-1 flex flex-col justify-between text-[11px]">
                          <div className="font-bold text-gray-800">
                            {index === 0 ? '⭐️ Haupt-Titelbild' : `Bild ${index + 1}`}
                          </div>

                          <div className="flex items-center gap-1.5 mt-1">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(index, 'left')}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md flex items-center gap-0.5 text-[10px] font-bold"
                                title="Nach links / vor"
                              >
                                <ArrowLeft className="w-3 h-3" /> Vor
                              </button>
                            )}

                            {index < editingListing.images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(index, 'right')}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md flex items-center gap-0.5 text-[10px] font-bold"
                                title="Nach rechts / zurück"
                              >
                                Zurück <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetAsCover(index)}
                                className="bg-[#86b817]/20 hover:bg-[#86b817]/30 text-[#22262d] px-2 py-1 rounded-md text-[10px] font-extrabold"
                                title="Als Titelbild festlegen"
                              >
                                Als Titelbild
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Löschen-Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = editingListing.images.filter((_, i) => i !== index);
                            setEditingListing({ ...editingListing, images: newImgs.length ? newImgs : ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a'] });
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition-colors"
                          title="Bild löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Upload-Button */}
                  <div>
                    <label className="cursor-pointer bg-white hover:bg-gray-100 border border-dashed border-gray-300 text-gray-700 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      <Upload className="w-4 h-4 text-[#86b817]" />
                      <span>Weitere Bilder vom Handy / PC hinzufügen</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingListing(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-xl"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold px-5 py-2 rounded-xl shadow flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Speichern
                  </button>
                </div>
              </form>
            ) : (
              // LISTE DER INSERATE
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2 mb-3">Meine Parkplatz-Angebote</h3>
                {userListings.length === 0 ? (
                  <p className="text-gray-500 italic py-6 text-center">Du hast aktuell keine Parkplätze inseriert.</p>
                ) : (
                  <div className="space-y-3">
                    {userListings.map(listing => (
                      <div key={listing.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3.5 rounded-xl border border-gray-200 gap-3">
                        
                        {/* KLICK AUF BILD ODER NAME ÖFFNET DIREKT DIE BEARBEITEN-SEITE */}
                        <div 
                          className="flex items-center gap-3 cursor-pointer flex-1 group"
                          onClick={() => setEditingListing(listing)}
                          title="Klicken zum Bearbeiten"
                        >
                          <img 
                            src={listing.images[0]} 
                            alt="" 
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border group-hover:border-[#86b817] transition-all" 
                          />
                          <div>
                            <h4 className="font-extrabold text-gray-900 group-hover:text-[#86b817] transition-colors flex items-center gap-1.5">
                              {listing.title}
                              <Edit3 className="w-3 h-3 text-gray-400 group-hover:text-[#86b817] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#86b817]" /> {listing.city} • {listing.price} € / {listing.priceType}
                            </p>
                          </div>
                        </div>

                        {/* Aktionen (Bearbeiten / Löschen) */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                          <button
                            onClick={() => setEditingListing(listing)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#86b817]" /> Bearbeiten
                          </button>
                          <button
                            onClick={() => onDeleteListing(listing.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Chats */}
        {activeTab === 'chats' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2">Aktive Nachrichten & Anfragen</h3>
            {conversations.length === 0 ? (
              <p className="text-gray-500 italic py-6 text-center">Keine aktiven Nachrichten vorhanden.</p>
            ) : (
              <div className="space-y-3">
                {conversations.map(conv => (
                  <div key={conv.id} className="flex items-center justify-between bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    <div>
                      <h4 className="font-extrabold text-gray-900">{conv.listingTitle}</h4>
                      <p className="text-gray-500 truncate max-w-xs">{conv.lastMessage}</p>
                    </div>
                    <button
                      onClick={() => onOpenChatWithConversation(conv)}
                      className="bg-[#22262d] text-white hover:bg-black font-bold px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Öffnen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Merkzettel */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2">Deine gemerkten Parkplätze</h3>
            {bookmarkedListings.length === 0 ? (
              <p className="text-gray-500 italic py-6 text-center">Du hast noch keine Parkplätze auf deinem Merkzettel gespeichert.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookmarkedListings.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => onSelectListingToView && onSelectListingToView(item)}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-gray-300"
                  >
                    <img src={item.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-extrabold text-gray-900 truncate w-44">{item.title}</h4>
                      <p className="text-gray-500">{item.price} € / {item.priceType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Bewertungen */}
        {activeTab === 'ratings' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2">Erhaltene Smiley-Bewertungen</h3>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-center space-y-2">
              <div className="text-2xl">😁 Top Vermieter</div>
              <p className="text-gray-500">Du hast bisher 5 Top-Bewertungen von Mietern erhalten.</p>
            </div>
          </div>
        )}

        {/* TAB 5: Einstellungen */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2">Kontodaten & Sicherheit</h3>
            
            <form onSubmit={handleSaveProfileData} className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <h4 className="font-extrabold text-gray-900 text-xs">Persönliche Informationen</h4>
              <div>
                <label className="block font-bold mb-1 text-gray-700">Dein Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-gray-700">E-Mail-Adresse</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-gray-700">Wohnort / PLZ</label>
                <input
                  type="text"
                  value={editZip}
                  onChange={(e) => setEditZip(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold px-5 py-2.5 rounded-xl shadow transition-colors"
              >
                Änderungen speichern
              </button>
            </form>

            <form onSubmit={handleSavePassword} className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <h4 className="font-extrabold text-gray-900 text-xs">Passwort ändern</h4>
              <div>
                <label className="block font-bold mb-1 text-gray-700">Aktuelles Passwort</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-gray-700">Neues Passwort</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#22262d] hover:bg-black text-white font-extrabold px-5 py-2.5 rounded-xl shadow transition-colors"
              >
                Neues Passwort festlegen
              </button>
            </form>

            <div className="pt-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Möchtest du dein Konto wirklich unwiderruflich löschen?')) {
                    onDeleteAccount();
                  }
                }}
                className="text-rose-600 hover:text-rose-700 font-bold px-4 py-2 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Konto unwiderruflich löschen
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
