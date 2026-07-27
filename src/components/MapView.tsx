import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ParkingListing } from '../types';

interface MapViewProps {
  listings: ParkingListing[];
  onSelectListing: (listing: ParkingListing) => void;
  centerLat?: number;
  centerLng?: number;
  radiusKm?: number;
}

export const MapView: React.FC<MapViewProps> = ({
  listings,
  onSelectListing,
  centerLat = 50.1109, // Frankfurt default center
  centerLng = 8.6821,
  radiusKm = 20,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([centerLat, centerLng], listings.length > 0 ? 11 : 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;

    if (!markersGroup) return;

    // Clear previous markers
    markersGroup.clearLayers();

    // Calculate bounds or center
    const bounds = L.latLngBounds([]);

    // Add search radius circle if radius > 0
    if (radiusKm > 0 && listings.length > 0) {
      const circle = L.circle([centerLat, centerLng], {
        color: '#86b817',
        fillColor: '#86b817',
        fillOpacity: 0.12,
        radius: radiusKm * 1000,
      }).addTo(markersGroup);
      bounds.extend(circle.getBounds());
    }

    // Add listing markers & approximate circles (~150m radius)
    listings.forEach((listing) => {
      const latLng: [number, number] = [listing.lat, listing.lng];
      bounds.extend(latLng);

      // Approximate location circle (~150m) for privacy
      L.circle(latLng, {
        color: '#86b817',
        fillColor: '#86b817',
        fillOpacity: 0.15,
        radius: 150, // 150 meters approximate radius
        weight: 1.5,
      }).addTo(markersGroup);

      // Create Custom Price Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-price-marker',
        html: `
          <div style="
            background-color: #22262d; 
            color: #86b817; 
            border: 2px solid #86b817; 
            padding: 4px 8px; 
            border-radius: 20px; 
            font-weight: 800; 
            font-size: 12px; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            white-space: nowrap;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>🅿️</span>
            <span>${listing.price} €</span>
          </div>
        `,
        iconSize: [80, 32],
        iconAnchor: [40, 16],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(markersGroup);

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 space-y-2 text-gray-900 font-sans max-w-[220px]';
      popupContent.innerHTML = `
        <img src="${listing.images[0]}" class="w-full h-24 object-cover rounded-md mb-2" />
        <h4 class="font-bold text-xs leading-tight line-clamp-2">${listing.title}</h4>
        <div class="text-[11px] text-gray-600 bg-amber-50 p-1.5 rounded border border-amber-200">
          📍 <strong>~100m Bereich</strong><br/>
          Genaue Adresse erst bei Freigabe im Chat.
        </div>
        <div class="flex items-center justify-between text-xs my-1">
          <span class="font-extrabold text-emerald-700">${listing.price} €</span>
          <span class="text-gray-500">${listing.city}</span>
        </div>
        <button id="btn-view-${listing.id}" class="w-full bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-bold py-1.5 px-3 rounded text-xs transition-colors shadow">
          Parkplatz ansehen & Chat
        </button>
      `;

      marker.bindPopup(popupContent);

      // Handle popup button click
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-${listing.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectListing(listing);
          };
        }
      });
    });

    // Fit bounds if markers exist
    if (listings.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

  }, [listings, centerLat, centerLng, radiusKm]);

  return (
    <div className="relative w-full h-[550px] lg:h-[650px] rounded-2xl overflow-hidden border border-gray-300 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      
      {/* Map Legend Floating Box */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-200 shadow-lg text-xs space-y-1">
        <div className="font-bold text-gray-800 flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#86b817] rounded-full inline-block"></span>
          <span>Parkplatz-Standorte ({listings.length})</span>
        </div>
        <p className="text-[11px] text-gray-500">Klicke auf den Preis-Marker für Details & Direkt-Chat</p>
      </div>
    </div>
  );
};
