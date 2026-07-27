import React, { useState } from 'react';
import { X, MapPin, ShieldCheck, Heart, MessageSquare, Clock, Car, Share2, Flag, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Banknote } from 'lucide-react';
import { ParkingListing, SmileyRating } from '../types';

interface ListingDetailModalProps {
  listing: ParkingListing | null;
  onClose: () => void;
  onOpenChat: (listing: ParkingListing) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  isBookmarked: boolean;
  onOpenRateLandlord: (landlordId: string, landlordName: string) => void;
  onReportListing: (listingId: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onOpenChat,
  onToggleBookmark,
  isBookmarked,
  onOpenRateLandlord,
  onReportListing,
}) => {
  if (!listing) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getSmileyIcon = (rating: SmileyRating) => {
    switch (rating) {
      case 'top':
        return <span className="text-emerald-600 font-bold flex items-center gap-1">😁 TOP</span>;
      case 'zufrieden':
        return <span className="text-blue-600 font-bold flex items-center gap-1">🙂 Zufrieden</span>;
      case 'naja':
        return <span className="text-amber-600 font-bold flex items-center gap-1">🙁 Na ja</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Modal Bar */}
        <div className="bg-[#22262d] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#86b817] text-[#22262d] font-bold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
              Parkplatz-Kleinanzeige #{listing.id}
            </span>
            <span className="text-xs text-gray-400 font-mono hidden sm:inline">Erstellt: {listing.createdAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 transition-colors text-xs flex items-center gap-1"
              title="Link kopieren"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedShare ? 'Kopiert!' : 'Teilen'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Gallery & Details */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Photo Viewer */}
              <div className="relative rounded-xl overflow-hidden bg-gray-900 h-64 sm:h-80 group">
                <img
                  src={listing.images[activeImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />

                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Bild {activeImageIndex + 1} von {listing.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-[#86b817] ring-2 ring-[#86b817]/30' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Description */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                  {listing.title}
                </h2>

                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#86b817] shrink-0" />
                    <span className="font-semibold text-gray-900">
                      {listing.zipCode} {listing.city} (~100m Ungefährer Standortbereich)
                    </span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Standortschutz aktiv:</strong> Die genaue Adresse ({listing.exactAddress || `${listing.streetName ? listing.streetName + ', ' : ''}${listing.zipCode} ${listing.city}`}) wird zum Schutz des Vermieters erst nach persönlicher Freigabe im Chat sichtbar.
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm">Beschreibung</h3>
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              </div>

              {/* Availability & Vehicle Suitability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Verfügbare Zeiten / Zeitfenster</span>
                  </div>
                  <p className="text-amber-800 font-medium">{listing.availableTimesNote}</p>
                </div>

                <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 text-xs space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>Geeignete Fahrzeuge</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {listing.suitableVehicles.map((v, i) => (
                      <span key={i} className="bg-white text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200 uppercase text-[10px]">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* All Features Badges */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 text-sm">Eigenschaften & Ausstattung</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feat, idx) => (
                    <div key={idx} className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#86b817]" />
                      <span>
                        {feat === 'überdacht' && 'Überdacht / Garage'}
                        {feat === 'videoüberwacht' && 'Videoüberwacht'}
                        {feat === 'e_ladesaeule' && 'E-Ladesäule (Wallbox)'}
                        {feat === 'zugang_24_7' && '24/7 Zugang'}
                        {feat === 'barrierefrei' && 'Barrierefrei'}
                        {feat === 'umzaeunt' && 'Umzäunt / Abgeschlossen'}
                        {feat === 'zentrumsnah' && 'Zentrumsnah'}
                        {feat === 'bahnhofsnah' && 'Bahnhofsnah'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Pricing & Landlord Box */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Price Box */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3">
                <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                  Mietpreis & Abrechnung
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold text-emerald-900">
                    {listing.price.toLocaleString('de-DE', { minimumFractionDigits: listing.price % 1 === 0 ? 0 : 2 })} €
                  </div>
                  <div className="text-sm font-bold text-emerald-700 bg-emerald-200/60 px-2.5 py-1 rounded-full">
                    {listing.priceType === 'hourly' && 'Pro Stunde'}
                    {listing.priceType === 'nightly' && 'Über Nacht (Pauschal)'}
                    {listing.priceType === 'daily' && 'Pro Tag'}
                    {listing.priceType === 'weekly' && 'Pro Woche'}
                    {listing.priceType === 'monthly' && 'Pro Monat'}
                  </div>
                </div>

                {/* Accepted Payments */}
                <div className="pt-2 border-t border-emerald-200/60 text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-900 font-semibold">
                    <span>Diskrete Bezahlung:</span>
                    <div className="flex gap-1.5 font-bold">
                      {listing.paymentMethods.map((pm, i) => (
                        <span key={i} className="bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 shadow-2xs">
                          {pm === 'Bar' ? '💵 Bar' : '🅿️ PayPal'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Gezahlt wird direkt zwischen Vermieter und Mieter nach Absprache im Chat.
                  </p>
                </div>
              </div>

              {/* Chat CTA Button */}
              <div className="space-y-2">
                <button
                  onClick={() => onOpenChat(listing)}
                  className="w-full bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold py-3.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base transform active:scale-98"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Nachricht schreiben (Chat)</span>
                </button>

                <button
                  onClick={(e) => onToggleBookmark(listing.id, e)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    isBookmarked
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-rose-500' : ''}`} />
                  <span>{isBookmarked ? 'Auf Merkzettel gespeichert' : 'Auf Merkzettel speichern'}</span>
                </button>
              </div>

              {/* Landlord Card Box */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#86b817]/20 border-2 border-[#86b817] flex items-center justify-center font-bold text-[#22262d] text-lg overflow-hidden">
                      {listing.landlord.avatarUrl ? (
                        <img src={listing.landlord.avatarUrl} alt={listing.landlord.name} className="w-full h-full object-cover" />
                      ) : (
                        listing.landlord.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-1.5 text-base">
                        <span>{listing.landlord.name}</span>
                        {listing.landlord.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verifizierter Vermieter" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Mitglied seit {listing.landlord.memberSince}</p>
                    </div>
                  </div>
                </div>

                {/* Smiley Ratings Breakdown */}
                <div className="bg-gray-50 p-3 rounded-xl space-y-2 border border-gray-200">
                  <div className="text-xs font-bold text-gray-800 flex items-center justify-between">
                    <span>Kleinanzeigen Bewertung:</span>
                    {getSmileyIcon(listing.landlord.smileyRating)}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-gray-200">
                    <div className="bg-emerald-100/60 p-1.5 rounded">
                      <div className="font-extrabold text-emerald-800">😁 {listing.landlord.topCount}</div>
                      <div className="text-[10px] text-emerald-900 font-medium">TOP</div>
                    </div>
                    <div className="bg-blue-100/60 p-1.5 rounded">
                      <div className="font-extrabold text-blue-800">🙂 {listing.landlord.zufriedenCount}</div>
                      <div className="text-[10px] text-blue-900 font-medium">Zufrieden</div>
                    </div>
                    <div className="bg-amber-100/60 p-1.5 rounded">
                      <div className="font-extrabold text-amber-800">🙁 {listing.landlord.najaCount}</div>
                      <div className="text-[10px] text-amber-900 font-medium">Na ja</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Antwortrate:</span>
                    <strong className="text-gray-900">{listing.landlord.responseRate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Antwortzeit:</span>
                    <strong className="text-gray-900">{listing.landlord.responseTime}</strong>
                  </div>
                </div>

                {/* Rate Landlord Action */}
                <button
                  onClick={() => onOpenRateLandlord(listing.landlord.id, listing.landlord.name)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-bold text-xs transition-colors border border-gray-300 flex items-center justify-center gap-1.5"
                >
                  <span>😁 Vermieter bewerten</span>
                </button>
              </div>

              {/* Safety Tips & Report */}
              <div className="space-y-2">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1 text-emerald-900">
                  <strong className="flex items-center gap-1 text-emerald-950 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Sicherheits-Tipp
                  </strong>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    Zahle nur bar bei Übergabe vor Ort oder mit PayPal (Käuferschutz). Antworte nur direkt über unseren Chat.
                  </p>
                </div>

                <button
                  onClick={() => onReportListing(listing.id)}
                  className="w-full text-xs text-gray-500 hover:text-rose-600 font-semibold py-1 flex items-center justify-center gap-1"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Anzeige oder Nutzer profil melden</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
