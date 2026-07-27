import React from 'react';
import { MapPin, Heart, ShieldCheck, Eye, Clock, Car, Sparkles } from 'lucide-react';
import { ParkingListing, SmileyRating } from '../types';

interface ListingCardProps {
  listing: ParkingListing;
  onSelect: (listing: ParkingListing) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  isBookmarked: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  onToggleBookmark,
  isBookmarked,
}) => {
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

  const getPriceUnitText = (type: string) => {
    switch (type) {
      case 'hourly': return '/ Std';
      case 'nightly': return '/ Nacht';
      case 'daily': return '/ Tag';
      case 'weekly': return '/ Woche';
      case 'monthly': return '/ Monat';
      default: return '';
    }
  };

  return (
    <div 
      onClick={() => onSelect(listing)}
      className="bg-white rounded-xl border border-gray-200 hover:border-[#86b817] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col sm:flex-row group relative"
    >
      {/* Featured Badge */}
      {listing.isFeatured && (
        <div className="absolute top-2 left-2 z-10 bg-[#86b817] text-[#22262d] font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Top-Anzeige
        </div>
      )}

      {/* Image Container */}
      <div className="relative sm:w-64 h-48 sm:h-auto bg-gray-100 shrink-0 overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Photo count */}
        {listing.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded font-medium backdrop-blur-xs">
            📷 1/{listing.images.length}
          </span>
        )}

        {/* Bookmark Heart */}
        <button
          onClick={(e) => onToggleBookmark(listing.id, e)}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md shadow-md transition-all ${
            isBookmarked
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/80 text-gray-600 hover:text-rose-500 hover:bg-white'
          }`}
          title="Auf den Merkzettel"
        >
          <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Header: Title & Price */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-gray-900 group-hover:text-[#6a960e] transition-colors line-clamp-2 text-base leading-snug">
              {listing.title}
            </h3>
            
            {/* Price Tag */}
            <div className="text-right shrink-0 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <div className="font-extrabold text-emerald-800 text-lg sm:text-xl">
                {listing.price.toLocaleString('de-DE', { minimumFractionDigits: listing.price % 1 === 0 ? 0 : 2 })} €
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold -mt-1">
                {getPriceUnitText(listing.priceType)}
              </div>
            </div>
          </div>

          {/* Location & Time window */}
          <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-600">
            <span className="flex items-center gap-1 font-medium text-gray-800">
              <MapPin className="w-3.5 h-3.5 text-[#86b817]" />
              {listing.zipCode} {listing.city}
              <span className="text-gray-500 font-normal"> (~100m Bereich)</span>
              {listing.distanceKm !== undefined && (
                <span className="text-gray-500 font-normal">• {listing.distanceKm} km</span>
              )}
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {listing.availableTimesNote}
            </span>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {listing.features.slice(0, 4).map((feat, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded border border-gray-200">
              {feat === 'überdacht' && '🏠 Überdacht'}
              {feat === 'videoüberwacht' && '📹 Videoüberwacht'}
              {feat === 'e_ladesaeule' && '⚡ E-Ladesäule'}
              {feat === 'zugang_24_7' && '🔑 24/7 Zugang'}
              {feat === 'barrierefrei' && '♿ Barrierefrei'}
              {feat === 'umzaeunt' && '🔒 Umzäunt'}
              {feat === 'zentrumsnah' && '📍 Zentrumsnah'}
              {feat === 'bahnhofsnah' && '🚆 BHF-nah'}
            </span>
          ))}
          {listing.features.length > 4 && (
            <span className="text-[11px] text-gray-500 py-0.5 font-medium">+{listing.features.length - 4} mehr</span>
          )}
        </div>

        {/* Footer: Landlord info, Rating, Payment methods */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          
          {/* Landlord & Smiley Rating */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{listing.landlord.name}</span>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              {getSmileyIcon(listing.landlord.smileyRating)}
              <span className="text-gray-500 text-[11px]">({listing.landlord.topCount + listing.landlord.zufriedenCount})</span>
            </div>
          </div>

          {/* Payment Badges & Date */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px]">
              {listing.paymentMethods.includes('Bar') && (
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">💵 Bar</span>
              )}
              {listing.paymentMethods.includes('PayPal') && (
                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">🅿️ PayPal</span>
              )}
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{listing.createdAt}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
