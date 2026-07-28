import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SloganBanner } from './components/SloganBanner';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { MapView } from './components/MapView';
import { ListingDetailModal } from './components/ListingDetailModal';
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
import { AlertCircle, CheckCircle, Heart, Search } from 'lucide-react';

export default function App() {
  // Main Listings State
  const [listings, setListings] = useState<ParkingListing[]>(initialListings);
  
  // View Mode: List vs Map
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Active Page State ('home' | 'profil' | 'auth')
  const [activePage, setActivePage] = useState<'home' | 'profil' | 'auth'>('home');

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Active User State
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    isEmailVerified: boolean;
    zipCode: string;
  } | null>(null);

  // Filter State
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

  // Active Modals State
  const [selectedListing, setSelectedListing] = useState<ParkingListing | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isCreateListingModalOpen, setIsCreateListingModalOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Rate Landlord Modal State
  const [rateModalData, setRateModalData] = useState<{ isOpen: boolean; landlordId: string; landlordName: string }>({
    isOpen: false,
    landlordId: '',
    landlordName: '',
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Conversations List
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Zurück zur Startseite Handler
  const handleGoHome = () => {
    setActivePage('home');
    setFilters(prev => ({
      ...prev,
      selectedType: 'all',
      searchQuery: '',
      locationQuery: '',
    }));
    setShowBookmarksOnly(false);
    showToast('Zurück zur Startseite 🏠');
  };

  // Exakte Kategorie Auswahl Handler
  const handleSelectCategory = (categoryType: string) => {
    setFilters(prev => ({
      ...prev,
      selectedType: categoryType,
      searchQuery: '' 
    }));
    setActivePage('home');
    setShowBookmarksOnly(false);
    showToast(`Kategorie-Filter aktiv 🎯`);
  };

  // GUARD: Inserieren nur wenn eingeloggt
  const handleOpenCreateListingGuard = () => {
    if (!currentUser) {
      showToast('🔒 Bitte melde dich zuerst an, um einen Parkplatz zu inserieren.');
      setActivePage('auth');
      return;
    }
    setIsCreateListingModalOpen(true);
  };

  // Toggle Bookmark
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

  // Create New Listing
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
      images: newListingData.images || ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80'],
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
  };

  // Open Chat for a Listing
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
            text: `Hallo ${listing.landlord.name}, ist der Parkplatz "${listing.title}" für mein Wunschdatum frei?`,
            timestamp: 'Gerade eben',
            isRead: true,
          }
        ],
      };
      setConversations(prev => [existing!, ...prev]);
    }
    setActiveConversation(existing);
    setSelectedListing(null);
  };

  // Send Message in Active Conversation
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
        text: 'Vielen Dank für deine Anfrage! Der Parkplatz ist frei. Du kannst gerne bar vor Ort oder bequem per PayPal zahlen.',
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
    }
    showToast('Chatverlauf gelöscht');
  };

  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    showToast('Anzeige gelöscht');
  };

  const handleReportListing = (listingId: string) => {
    showToast('Anzeige & Profil zur Überprüfung an den Kundenservice gemeldet.');
    setSelectedListing(null);
  };

  const handleSubmitRating = (rating: SmileyRating, tags: string[], comment: string) => {
    showToast(`Danke! Bewertet mit ${rating.toUpperCase()} ${rating === 'top' ? '😁' : rating === 'zufrieden' ? '🙂' : '🙁'}`);
  };

  // Filter-Logik
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      if (showBookmarksOnly && !bookmarkedIds.includes(item.id)) return false;
      
      if (filters.selectedType !== 'all') {
        if (item.type !== filters.selectedType) return false;
      }

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
      showToast('🔒 Bewertung erst nach persönlichem Chat-Kontakt & Miet-Absprache möglich!');
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
        onOpenAuth={() => setActivePage('auth')}
        onOpenProfile={() => setActivePage('profil')}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Erfolgreich abgemeldet 👋');
        }}
        onOpenChat={() => {
          if (conversations.length > 0) {
            setActiveConversation(conversations[0]);
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
        <SloganBanner 
          onOpenCreateListing={handleOpenCreateListingGuard} 
          onSelectCategory={handleSelectCategory}
        />
      )}

      {activePage === 'home' && (
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalResults={filteredListings.length}
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {activePage === 'home' ? (
          <>
            {showBookmarksOnly && (
              <div className="mb-4 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center justify-between text-xs text-rose-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  Zeige deinen Merkzettel ({filteredListings.length} gespeicherte Parkplätze)
                </span>
                <button
                  onClick={() => setShowBookmarksOnly(false)}
                  className="bg-white border border-rose-300 px-3 py-1 rounded-lg text-[11px] text-gray-800 hover:bg-rose-100"
                >
                  Alle Anzeigen anzeigen
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
                  <span className="text-gray-500 font-normal">({filteredListings.length} Treffer)</span>
                </span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, selectedType: 'all' }))}
                  className="bg-white border border-gray-300 px-3 py-1 rounded-lg text-[11px] hover:bg-gray-100 shadow-sm transition-colors"
                >
                  Kategorie-Filter aufheben ✕
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
                    <h3 className="font-extrabold text-gray-900 text-base">Keine Parkplätze in dieser Kategorie</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Für diese Kategorie wurden aktuell keine passenden Inserate gefunden. Setze den Filter zurück oder biete selbst einen Parkplatz an!
                    </p>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, selectedType: 'all' }))}
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
                        onSelect={(l) => setSelectedListing(l)}
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
                onSelectListing={(l) => setSelectedListing(l)}
                radiusKm={filters.radiusKm}
              />
            )}

            <AdBannerPlaceholder />
          </>
        ) : activePage === 'profil' ? (
          <div className="pb-8 max-w-3xl mx-auto">
            <button 
              onClick={handleGoHome}
              className="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
            >
              ← Zurück zur Startseite
            </button>
            
            <ProfileModal
              isOpen={true} 
              onClose={handleGoHome} 
              currentUser={currentUser || { name: 'Philip Schüßler', email: 'philip.s@parkplatz.de', isEmailVerified: true, zipCode: '60329' }}
              userListings={listings.filter(l => l.landlord.id === 'usr-landlord-1' || l.landlord.id === 'usr-me')}
              conversations={conversations}
              bookmarkedListings={listings.filter(l => bookmarkedIds.includes(l.id))}
              onDeleteListing={handleDeleteListing}
              onOpenChatWithConversation={(conv) => setActiveConversation(conv)}
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
            />
          </div>
        ) : (
          <div className="pb-8 max-w-md mx-auto">
            <button 
              onClick={handleGoHome}
              className="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
            >
              ← Zurück zur Startseite
            </button>

            <AuthModal
              isOpen={true}
              onClose={handleGoHome}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setActivePage('home');
                showToast(`Willkommen, ${user.name}! Anmeldung erfolgreich! 🎉`);
              }}
            />
          </div>
        )}
      </main>

      <Footer
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
        onOpenCookieSettings={() => setIsCookieModalOpen(true)}
        onOpenCreateListing={handleOpenCreateListingGuard}
      />

      {/* Modals */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onOpenChat={handleOpenChatForListing}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={bookmarkedIds.includes(selectedListing.id)}
          onOpenRateLandlord={handleOpenRateLandlordGuard}
          onReportListing={handleReportListing}
        />
      )}

      {activeConversation && (
        <ChatModal
          conversation={activeConversation}
          onClose={() => setActiveConversation(null)}
          onSendMessage={handleSendMessage}
          onDeleteConversation={handleDeleteConversation}
          onOpenRateLandlord={handleOpenRateLandlordGuard}
        />
      )}

      <SmileyRatingModal
        isOpen={rateModalData.isOpen}
        landlordName={rateModalData.landlordName}
        onClose={() => setRateModalData({ isOpen: false, landlordId: '', landlordName: '' })}
        onSubmitRating={handleSubmitRating}
      />

      <CreateListingModal
        isOpen={isCreateListingModalOpen}
        onClose={() => setIsCreateListingModalOpen(false)}
        onSubmitListing={handleCreateListing}
      />

      <LegalPagesModal
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      <CookieSettingsModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />

    </div>
  );
}
