import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SloganBanner } from './components/SloganBanner';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { MapView } from './components/MapView';
import { ChatModal } from './components/ChatModal';
import { SmileyRatingModal } from './components/SmileyRatingModal';
import { CreateListingModal } from './components/CreateListingModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { LegalPagesModal } from './components/LegalPagesModal';
import { CookieSettingsModal } from './components/CookieSettingsModal';
import { Footer } from './components/Footer';
import { AdBannerPlaceholder } from './components/AdBannerPlaceholder';
import { initialListings } from './data/mockListings';
import { ParkingListing, FilterState, Conversation, LegalModalType, SmileyRating } from './types';
import { CheckCircle, Heart, ArrowLeft, MessageSquare, ShieldCheck, Check } from 'lucide-react';

export default function App() {
  const [listings, setListings] = useState<ParkingListing[]>(initialListings);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [activePage, setActivePage] = useState<
    'home' | 'profil' | 'auth' | 'createListing' | 'detail' | 'chat' | 'legal'
  >('home');

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    isEmailVerified: boolean;
    zipCode: string;
  } | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    locationQuery: '',
    radiusKm: 20,
    selectedType: 'all',
    selectedPriceType: 'all',
    maxPrice: 200,
    paymentMethod: 'all',
    vehicleType: 'all',
    features: [],
    sortBy: 'newest',
  });

  const [selectedListing, setSelectedListing] = useState<ParkingListing | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [detailActiveImageIndex, setDetailActiveImageIndex] = useState(0);

  const [rateModalData, setRateModalData] = useState<{ isOpen: boolean; landlordId: string; landlordName: string }>({
    isOpen: false,
    landlordId: '',
    landlordName: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const handleGoHome = () => {
    setActivePage('home');
    setSelectedListing(null);
    setActiveConversation(null);
    setShowBookmarksOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryType: string) => {
    setActivePage('home');
    setShowBookmarksOnly(false);
    setFilters(prev => ({
      ...prev,
      selectedType: categoryType,
      searchQuery: '',
      locationQuery: '',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreateListingGuard = () => {
    if (!currentUser) {
      showToast('🔒 Bitte registriere dich oder melde dich an, um ein Inserat zu erstellen.');
      setActivePage('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!currentUser.isEmailVerified) {
      showToast('⚠️ Bitte bestätige zuerst deine E-Mail-Adresse.');
      setActivePage('profil');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActivePage('createListing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(prev => prev.filter(x => x !== id));
      showToast('Von Merkzettel entfernt');
    } else {
      setBookmarkedIds(prev => [...prev, id]);
      showToast('Auf Merkzettel gespeichert ❤️');
    }
  };

  const handleCreateListing = (newListingData: Partial<ParkingListing>) => {
    const created: ParkingListing = {
      id: `p-${Date.now()}`,
      title: newListingData.title || 'Neuer Parkplatz',
      description: newListingData.description || '',
      type: newListingData.type || 'stellplatz',
      price: newListingData.price || 10,
      priceType: newListingData.priceType || 'daily',
      city: newListingData.city || 'Frankfurt am Main',
      zipCode: newListingData.zipCode || '60329',
      streetName: newListingData.streetName,
      lat: newListingData.lat || 50.1109,
      lng: newListingData.lng || 8.6821,
      distanceKm: newListingData.distanceKm || 1.0,
      availableTimesNote: newListingData.availableTimesNote || 'Flexibel',
      suitableVehicles: newListingData.suitableVehicles || ['pkw'],
      features: newListingData.features || ['überdacht'],
      paymentMethods: newListingData.paymentMethods || ['Bar', 'PayPal'],
      images: newListingData.images && newListingData.images.length > 0 
        ? newListingData.images 
        : ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80'],
      landlord: {
        id: 'usr-me',
        name: currentUser?.name || 'Philip Schüßler',
        email: currentUser?.email || 'philip.s@parkplatz.de',
        isVerified: true,
        memberSince: 'Juli 2026',
        smileyRating: 'top',
        topCount: 5,
        zufriedenCount: 0,
        najaCount: 0,
        responseRate: '100%',
        responseTime: '< 5 Min.',
      },
      createdAt: 'Gerade eben',
      viewsCount: 1,
      isFeatured: true,
    };

    setListings(prev => [created, ...prev]);
    showToast('Anzeige erfolgreich veröffentlicht! 🎉');
    handleGoHome();
  };

  const handleOpenChatForListing = (listing: ParkingListing) => {
    let existing = conversations.find(c => c.listingId === listing.id);
    if (!existing) {
      existing = {
        id: `conv-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.images[0],
        listingPrice: `${listing.price} € (${listing.priceType})`,
        landlordId: listing.landlord.id,
        landlordName: listing.landlord.name,
        renterId: 'me',
        renterName: currentUser?.name || 'Mieter',
        lastMessage: 'Hallo, ist der Parkplatz frei?',
        lastMessageTime: 'Jetzt',
        unreadCount: 0,
        createdAt: '2026-07-27',
        expiresAt: 'In 14 Tagen',
        canRate: true,
        messages: [
          {
            id: `m-${Date.now()}`,
            conversationId: `conv-${Date.now()}`,
            senderId: 'me',
            senderName: 'Ich',
            text: `Hallo ${listing.landlord.name}, ist der Parkplatz "${listing.title}" frei?`,
            timestamp: 'Gerade eben',
            isRead: true,
          }
        ],
      };
      setConversations(prev => [existing!, ...prev]);
    }
    setActiveConversation(existing);
    setActivePage('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = (text: string) => {
    if (!activeConversation) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: 'me',
      senderName: 'Ich',
      text,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    const updated = {
      ...activeConversation,
      lastMessage: text,
      lastMessageTime: newMsg.timestamp,
      messages: [...activeConversation.messages, newMsg],
    };

    setActiveConversation(updated);
    setConversations(prev => prev.map(c => c.id === updated.id ? updated : c));

    setTimeout(() => {
      const landlordResponse = {
        id: `msg-${Date.now() + 1}`,
        conversationId: updated.id,
        senderId: updated.landlordId,
        senderName: updated.landlordName,
        text: 'Vielen Dank für deine Anfrage! Der Parkplatz ist frei.',
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };

      const finalConv = {
        ...updated,
        lastMessage: landlordResponse.text,
        lastMessageTime: landlordResponse.timestamp,
        messages: [...updated.messages, landlordResponse],
      };

      setActiveConversation(prev => prev?.id === finalConv.id ? finalConv : prev);
      setConversations(prev => prev.map(c => c.id === finalConv.id ? finalConv : c));
    }, 1200);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation?.id === id) {
      setActiveConversation(null);
      setActivePage('home');
    }
    showToast('Chatverlauf gelöscht');
  };

  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    showToast('Anzeige gelöscht');
  };

  const handleReportListing = () => {
    if (!currentUser) {
      showToast('🔒 Bitte melde dich an, um eine Anzeige zu melden.');
      setActivePage('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const reason = prompt('Bitte gib einen Grund für die Meldung an (z.B. Falsche Angaben, Betrugsverdacht):');
    if (!reason || reason.trim() === '') {
      showToast('Meldung abgebrochen: Es wurde kein Grund angegeben.');
      return;
    }

    showToast(`Meldung erfolgreich eingereicht. Grund: "${reason}"`);
    handleGoHome();
  };

  const handleSubmitRating = (rating: SmileyRating) => {
    showToast(`Danke! Bewertet mit ${rating.toUpperCase()}`);
  };

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      if (showBookmarksOnly && !bookmarkedIds.includes(item.id)) return false;
      if (filters.selectedType !== 'all' && item.type !== filters.selectedType) return false;

      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        const matchesZip = item.zipCode.includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCity && !matchesZip) return false;
      }

      if (filters.locationQuery.trim()) {
        const loc = filters.locationQuery.toLowerCase();
        const matchesCity = item.city.toLowerCase().includes(loc);
        const matchesZip = item.zipCode.includes(loc);
        if (!matchesCity && !matchesZip) return false;
      }

      if (filters.selectedPriceType !== 'all' && item.priceType !== filters.selectedPriceType) return false;
      if (filters.paymentMethod !== 'all' && !item.paymentMethods.includes(filters.paymentMethod as any)) return false;
      if (filters.vehicleType !== 'all' && !item.suitableVehicles.includes(filters.vehicleType as any)) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'distance') return (a.distanceKm || 0) - (b.distanceKm || 0);
      return 0;
    });
  }, [listings, filters, showBookmarksOnly, bookmarkedIds]);

  const handleOpenRateLandlordGuard = (landlordId: string, landlordName: string) => {
    const hasChatContact = conversations.some(c => c.landlordId === landlordId);
    if (!hasChatContact) {
      showToast('🔒 Bewertung erst nach Chat-Kontakt möglich!');
      return;
    }
    setRateModalData({ isOpen: true, landlordId, landlordName });
  };

  return (
    <div className="min-h-screen bg-[#f4f4f6] flex flex-col text-gray-900 font-sans antialiased">
      
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#22262d] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#86b817] flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-[#86b817]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Header
        filters={filters}
        setFilters={setFilters}
        onLogoClick={handleGoHome}
        onOpenCreateListing={handleOpenCreateListingGuard}
        onOpenAuth={() => { setActivePage('auth'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onOpenProfile={() => { setActivePage('profil'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Erfolgreich abgemeldet 👋');
          handleGoHome();
        }}
        onOpenChat={() => {
          if (conversations.length > 0) {
            setActiveConversation(conversations[0]);
            setActivePage('chat');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            showToast('Keine aktiven Nachrichten vorhanden');
          }
        }}
        onOpenBookmarks={() => {
          setActivePage('home');
          setShowBookmarksOnly(!showBookmarksOnly);
        }}
        unreadChatsCount={conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
        bookmarkedCount={bookmarkedIds.length}
        currentUser={currentUser}
        onSearchSubmit={() => setActivePage('home')}
      />

      {activePage === 'home' && (
        <>
          <SloganBanner 
            onOpenCreateListing={handleOpenCreateListingGuard} 
            onSelectCategory={handleSelectCategory}
          />
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalResults={filteredListings.length}
          />
        </>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activePage === 'home' && (
          <>
            {showBookmarksOnly && (
              <div className="mb-4 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center justify-between text-xs text-rose-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  Merkzettel ({filteredListings.length} gespeicherte Parkplätze)
                </span>
                <button
                  onClick={() => setShowBookmarksOnly(false)}
                  className="bg-white border border-rose-300 px-3 py-1 rounded-lg text-[11px] text-gray-800 hover:bg-rose-100"
                >
                  Alle Anzeigen
                </button>
              </div>
            )}

            {filters.selectedType !== 'all' && (
              <div className="mb-4 bg-[#86b817]/10 border border-[#86b817]/30 p-3 rounded-xl flex items-center justify-between text-xs text-gray-800 font-bold">
                <span className="flex items-center gap-2">
                  <span>Aktive Kategorie:</span>
                  <span className="bg-[#86b817] text-[#22262d] px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[11px]">
                    {filters.selectedType}
                  </span>
                </span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, selectedType: 'all' }))}
                  className="bg-white border border-gray-300 px-3 py-1 rounded-lg text-[11px] hover:bg-gray-100 shadow-sm transition-colors"
                >
                  Kategorie aufheben ✕
                </button>
              </div>
            )}

            {viewMode === 'list' ? (
              <div>
                {filteredListings.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-4 my-8 max-w-md mx-auto shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                      🔍
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base">Keine Parkplätze gefunden</h3>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, selectedType: 'all', searchQuery: '' }))}
                      className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold px-5 py-2.5 rounded-xl text-xs shadow"
                    >
                      Filter zurücksetzen
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        onSelect={(l) => {
                          setSelectedListing(l);
                          setDetailActiveImageIndex(0);
                          setActivePage('detail');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onToggleBookmark={handleToggleBookmark}
                        isBookmarked={bookmarkedIds.includes(listing.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <MapView
                listings={filteredListings}
                onSelectListing={(l) => {
                  setSelectedListing(l);
                  setDetailActiveImageIndex(0);
                  setActivePage('detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                radiusKm={filters.radiusKm}
              />
            )}

            <AdBannerPlaceholder />
          </>
        )}

        {activePage === 'detail' && selectedListing && (
          <div className="pb-12 max-w-4xl mx-auto w-full space-y-6">
            <button 
              onClick={handleGoHome}
              className="bg-white border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
            </button>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <div>
                  <span className="bg-[#86b817]/20 text-[#22262d] font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {selectedListing.priceType === 'hourly' ? 'Stundenparkplatz' : selectedListing.priceType === 'daily' ? 'Tagesparkplatz' : 'Monatsparkplatz'}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">{selectedListing.title}</h1>
                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                    📍 {selectedListing.city} ({selectedListing.zipCode}) {selectedListing.streetName ? `• ${selectedListing.streetName}` : ''}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-gray-900">
                    {selectedListing.price} €
                  </div>
                  <div className="text-xs text-gray-500 font-bold">
                    pro {selectedListing.priceType === 'hourly' ? 'Stunde' : selectedListing.priceType === 'daily' ? 'Tag' : 'Monat'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img 
                    src={selectedListing.images[detailActiveImageIndex] || selectedListing.images[0]} 
                    alt={selectedListing.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedListing.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedListing.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setDetailActiveImageIndex(idx)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${detailActiveImageIndex === idx ? 'border-[#86b817] shadow' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-sm text-gray-900 border-b pb-2">Beschreibung</h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {selectedListing.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-extrabold text-sm text-gray-900 border-b pb-2">Rechtlicher Hinweis zum Vertrag</h3>
                    <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                      Mietverträge (z.B. für Kurzzeit-Parken über wenige Stunden) kommen <strong>ausschließlich privat direkt zwischen Vermieter und Mieter</strong> zustande (mündlich, per Handschlag oder Chat). Dieses Portal stellt lediglich die Kommunikations-Infrastruktur bereit und übernimmt keine Haftung für Nichtzahlung, Betrug oder Schäden.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200 h-fit">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 bg-[#22262d] text-white font-extrabold rounded-full flex items-center justify-center text-xs">
                      {selectedListing.landlord.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 flex items-center gap-1">
                        {selectedListing.landlord.name} <ShieldCheck className="w-3.5 h-3.5 text-[#86b817]" />
                      </h4>
                      <p className="text-[10px] text-gray-500">Antwortet meist schnell</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenChatForListing(selectedListing)}
                    className="w-full bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-black py-3 px-4 rounded-xl shadow text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Nachricht an Vermieter
                  </button>

                  <button
                    onClick={(e) => handleToggleBookmark(selectedListing.id, e)}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Heart className={`w-4 h-4 text-rose-500 ${bookmarkedIds.includes(selectedListing.id) ? 'fill-current' : ''}`} />
                    {bookmarkedIds.includes(selectedListing.id) ? 'Von Merkzettel entfernen' : 'Auf Merkzettel'}
                  </button>

                  <button
                    onClick={handleReportListing}
                    className="w-full text-rose-600 hover:text-rose-700 text-[11px] font-bold py-1 text-center"
                  >
                    Anzeige melden
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activePage === 'chat' && activeConversation && (
          <div className="pb-8 max-w-4xl mx-auto">
            <button 
              onClick={handleGoHome}
              className="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
            </button>
            <ChatModal
              conversation={activeConversation}
              onClose={handleGoHome}
              onSendMessage={handleSendMessage}
              onDeleteConversation={handleDeleteConversation}
              onOpenRateLandlord={handleOpenRateLandlordGuard}
            />
          </div>
        )}

        {activePage === 'createListing' && (
          <div className="pb-8 max-w-3xl mx-auto">
            <button 
              onClick={handleGoHome}
              className="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Abbrechen & Zurück
            </button>
            <CreateListingModal
              isOpen={true}
              onClose={handleGoHome}
              onSubmitListing={handleCreateListing}
            />
          </div>
        )}

        {activePage === 'profil' && (
          <div className="pb-12 max-w-7xl mx-auto w-full">
            <button 
              onClick={handleGoHome}
              className="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
            </button>
            
            <ProfileModal
              isOpen={true} 
              onClose={handleGoHome} 
              currentUser={currentUser || { name: 'Philip Schüßler', email: 'philip.s@parkplatz.de', isEmailVerified: true, zipCode: '60329' }}
              userListings={listings.filter(l => l.landlord.id === 'usr-landlord-1' || l.landlord.id === 'usr-me')}
              conversations={conversations}
              bookmarkedListings={listings.filter(l => bookmarkedIds.includes(l.id))}
              onDeleteListing={handleDeleteListing}
              onOpenChatWithConversation={(conv) => {
                setActiveConversation(conv);
                setActivePage('chat');
              }}
              onLogout={() => {
                setCurrentUser(null);
                handleGoHome();
                showToast('Erfolgreich abgemeldet');
              }}
              onDeleteAccount={() => {
                setCurrentUser(null);
                handleGoHome();
                showToast('Konto und Daten wurden gelöscht');
              }}
              onGoHome={handleGoHome}
            />
          </div>
        )}

        {activePage === 'auth' && (
          <div className="pb-8 max-w-md mx-auto">
            <button 
              onClick={handleGoHome}
              className="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
            </button>

            <AuthModal
              isOpen={true}
              onClose={handleGoHome}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setActivePage('home');
                showToast(`Willkommen, ${user.name}!`);
              }}
            />
          </div>
        )}

        {activePage === 'legal' && (
          <div className="pb-8 max-w-3xl mx-auto">
            <button 
              onClick={handleGoHome}
              className="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
            </button>
            <LegalPagesModal
              type={activeLegalModal}
              onClose={handleGoHome}
            />
          </div>
        )}
      </main>

      <Footer
        onOpenLegalModal={(type) => {
          setActiveLegalModal(type);
          setActivePage('legal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCookieSettings={() => setIsCookieModalOpen(true)}
        onOpenCreateListing={handleOpenCreateListingGuard}
      />

      <SmileyRatingModal
        isOpen={rateModalData.isOpen}
        landlordName={rateModalData.landlordName}
        onClose={() => setRateModalData({ isOpen: false, landlordId: '', landlordName: '' })}
        onSubmitRating={handleSubmitRating}
      />

      <CookieSettingsModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />

    </div>
  );
}
