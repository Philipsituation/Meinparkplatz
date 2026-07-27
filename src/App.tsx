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

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['p-102']);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Active User State (null = ausgeloggt / Gast)
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateListingModalOpen, setIsCreateListingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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

  // Mock Conversations List
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-101',
      listingId: 'p-101',
      listingTitle: 'Tiefgaragen-Stellplatz nähe HBF Frankfurt',
      listingImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80',
      listingPrice: '12 € / Nacht',
      landlordId: 'usr-landlord-1',
      landlordName: 'Philip Schüßler',
      renterId: 'me',
      renterName: 'Mieter',
      lastMessage: 'Hallo! Ist der Parkplatz heute von 22:00 bis 10:00 Uhr frei?',
      lastMessageTime: '12:15',
      unreadCount: 1,
      createdAt: '2026-07-27',
      expiresAt: 'In 14 Tagen',
      canRate: true,
      messages: [
        {
          id: 'm-1',
          conversationId: 'conv-101',
          senderId: 'usr-landlord-1',
          senderName: 'Philip Schüßler',
          text: 'Hallo! Ja, der Platz in der Tiefgarage Kaiserstraße ist heute ab 22:00 Uhr frei.',
          timestamp: '12:10',
          isRead: true,
        },
        {
          id: 'm-2',
          conversationId: 'conv-101',
          senderId: 'me',
          senderName: 'Ich',
          text: 'Super! Kann ich vor Ort bar zahlen oder bevorzugst du PayPal?',
          timestamp: '12:15',
          isRead: true,
        },
      ],
    },
  ]);

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
    // Find existing or create new
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

    // Simulated Auto Landlord Response
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

  // Delete Conversation
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation?.id === id) {
      setActiveConversation(null);
    }
    showToast('Chatverlauf gelöscht');
  };

  // Delete User Listing
  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    showToast('Anzeige gelöscht');
  };

  // Report Listing
  const handleReportListing = (listingId: string) => {
    showToast('Anzeige & Profil zur Überprüfung an den Kundenservice gemeldet.');
    setSelectedListing(null);
  };

  // Submit Rating
  const handleSubmitRating = (rating: SmileyRating, tags: string[], comment: string) => {
    showToast(`Danke! Bewertet mit ${rating.toUpperCase()} ${rating === 'top' ? '😁' : rating === 'zufrieden' ? '🙂' : '🙁'}`);
  };

  // Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Bookmarks filter
      if (showBookmarksOnly && !bookmarkedIds.includes(item.id)) {
        return false;
      }

      // Search query (title, description, city, zipCode)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        const matchesZip = item.zipCode.includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCity && !matchesZip) return false;
      }

      // Location / PLZ query
      if (filters.locationQuery.trim()) {
        const loc = filters.locationQuery.toLowerCase();
        const matchesCity = item.city.toLowerCase().includes(loc);
        const matchesZip = item.zipCode.includes(loc);
        if (!matchesCity && !matchesZip) return false;
      }

      // Type filter
      if (filters.selectedType !== 'all' && item.type !== filters.selectedType) {
        return false;
      }

      // Price type
      if (filters.selectedPriceType !== 'all' && item.priceType !== filters.selectedPriceType) {
        return false;
      }

      // Payment method
      if (filters.paymentMethod !== 'all' && !item.paymentMethods.includes(filters.paymentMethod as any)) {
        return false;
      }

      // Vehicle type
      if (filters.vehicleType !== 'all' && !item.suitableVehicles.includes(filters.vehicleType as any)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'distance') return (a.distanceKm || 0) - (b.distanceKm || 0);
      return 0; // newest
    });
  }, [listings, filters, showBookmarksOnly, bookmarkedIds]);

  return (
    <div className="min-h-screen bg-[#f4f4f6] flex flex-col text-gray-900 font-sans antialiased">
      
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#22262d] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#86b817] flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-[#86b817]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Kleinanzeigen Header */}
      <Header
        filters={filters}
        setFilters={setFilters}
        onOpenCreateListing={() => setIsCreateListingModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
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
        onOpenBookmarks={() => setShowBookmarksOnly(!showBookmarksOnly)}
        unreadChatsCount={conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
        bookmarkedCount={bookmarkedIds.length}
        currentUser={currentUser}
        onSearchSubmit={() => {}}
      />

      {/* Slogan Banner */}
      <SloganBanner onOpenCreateListing={() => setIsCreateListingModalOpen(true)} />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalResults={filteredListings.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* Bookmarks Filter Active Banner */}
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

        {/* Content View: List / Grid vs Map */}
        {viewMode === 'list' ? (
          <div>
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-4 my-8 max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                  🔍
                </div>
                <h3 className="font-extrabold text-gray-900 text-base">Keine Parkplätze gefunden</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Passe deine Suche, PLZ oder den Umkreis an. Du kannst auch selbst einen Parkplatz anbieten!
                </p>
                <button
                  onClick={() => setIsCreateListingModalOpen(true)}
                  className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold px-5 py-2.5 rounded-xl text-xs shadow"
                >
                  Parkplatz jetzt inserieren
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
          /* Interactive Map View */
          <MapView
            listings={filteredListings}
            onSelectListing={(l) => setSelectedListing(l)}
            radiusKm={filters.radiusKm}
          />
        )}

        {/* Ad Placeholder Banner for Future Monetization */}
        <AdBannerPlaceholder />

      </main>

      {/* Footer */}
      <Footer
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
        onOpenCookieSettings={() => setIsCookieModalOpen(true)}
        onOpenCreateListing={() => setIsCreateListingModalOpen(true)}
      />

      {/* Modals */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onOpenChat={handleOpenChatForListing}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={bookmarkedIds.includes(selectedListing.id)}
          onOpenRateLandlord={(lId, lName) => setRateModalData({ isOpen: true, landlordId: lId, landlordName: lName })}
          onReportListing={handleReportListing}
        />
      )}

      {activeConversation && (
        <ChatModal
          conversation={activeConversation}
          onClose={() => setActiveConversation(null)}
          onSendMessage={handleSendMessage}
          onDeleteConversation={handleDeleteConversation}
          onOpenRateLandlord={(lId, lName) => setRateModalData({ isOpen: true, landlordId: lId, landlordName: lName })}
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Willkommen zurück, ${user.name}!`);
        }}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser || { name: 'Philip Schüßler', email: 'philip.s@parkplatz.de', isEmailVerified: true, zipCode: '60329' }}
        userListings={listings.filter(l => l.landlord.id === 'usr-landlord-1' || l.landlord.id === 'usr-me')}
        conversations={conversations}
        bookmarkedListings={listings.filter(l => bookmarkedIds.includes(l.id))}
        onDeleteListing={handleDeleteListing}
        onOpenChatWithConversation={(conv) => setActiveConversation(conv)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Erfolgreich abgemeldet');
        }}
        onDeleteAccount={() => {
          setCurrentUser(null);
          showToast('Konto und Daten wurden gelöscht');
        }}
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
