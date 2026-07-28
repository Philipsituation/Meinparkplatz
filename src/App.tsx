import React, { useState } from 'react';
import { ParkingListing, VehicleType, PriceType, PaymentMethod } from '../types';
import { X, Upload, Image as ImageIcon, Check } from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitListing: (listing: Partial<ParkingListing>) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSubmitListing,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'stellplatz' | 'garage' | 'carport' | 'hof' | 'tiefgarage'>('stellplatz');
  const [price, setPrice] = useState<number>(10);
  const [priceType, setPriceType] = useState<PriceType>('daily');
  const [city, setCity] = useState('Frankfurt am Main');
  const [zipCode, setZipCode] = useState('60329');
  const [streetName, setStreetName] = useState('');
  
  // Bild-Zustand: Hält entweder Standard-URLs oder echte Datei-Vorschau-URLs
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80',
  ]);

  const [suitableVehicles, setSuitableVehicles] = useState<VehicleType[]>(['pkw']);
  const [features, setFeatures] = useState<string[]>(['überdacht']);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(['Bar', 'PayPal']);

  if (!isOpen) return null;

  // Eigene Bilder vom PC hochladen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !city.trim()) {
      alert('Bitte fülle mindestens Titel und Stadt aus.');
      return;
    }

    onSubmitListing({
      title,
      description,
      type,
      price: Number(price),
      priceType,
      city,
      zipCode,
      streetName,
      images,
      suitableVehicles,
      features,
      paymentMethods,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-2xl mx-auto my-6">
      <div className="bg-[#22262d] text-white px-6 py-4 flex items-center justify-between">
        <h2 className="font-extrabold text-base flex items-center gap-2">
          <span>🅿️</span> Parkplatz inserieren
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs text-gray-800">
        
        {/* Titel & Typ */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2">1. Grunddetails</h3>
          
          <div>
            <label className="block font-bold mb-1 text-gray-700">Titel des Inserats *</label>
            <input
              type="text"
              required
              placeholder="z.B. Sicherer Tiefgaragenstellplatz im Bahnhofsviertel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 text-gray-700">Parkplatz-Art</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#86b817]"
              >
                <option value="stellplatz">Freier Stellplatz</option>
                <option value="garage">Garage</option>
                <option value="carport">Carport</option>
                <option value="hof">Hof / Einfahrt</option>
                <option value="tiefgarage">Tiefgarage</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 text-gray-700">Beschreibung</label>
              <textarea
                rows={2}
                placeholder="Details zur Zufahrt, Höhe, Besonderheiten..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#86b817]"
              />
            </div>
          </div>
        </div>

        {/* Standort */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2">2. Standort</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1 text-gray-700">Stadt *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-gray-700">PLZ *</label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-gray-700">Straße & Hausnummer</label>
              <input
                type="text"
                placeholder="Musterstraße 12"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Eigene Bilder hochladen */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2">3. Fotos hochladen</h3>
          <p className="text-[11px] text-gray-500">Lade echte Bilder deines Parkplatzes hoch, damit Mieter ihn sofort erkennen.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((imgUrl, index) => (
              <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                <img src={imgUrl} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 transition-opacity shadow"
                  title="Bild löschen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Upload-Button Feld */}
            <label className="border-2 border-dashed border-gray-300 hover:border-[#86b817] rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer bg-gray-50 hover:bg-[#86b817]/5 transition-colors aspect-square text-center">
              <Upload className="w-6 h-6 text-gray-400 mb-1" />
              <span className="font-bold text-[11px] text-gray-700">Foto wählen</span>
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

        {/* Preis */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-gray-900 text-sm border-b pb-2">4. Preisgestaltung</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 text-gray-700">Betrag in EUR (€)</label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-gray-700">Abrechnungsart</label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as PriceType)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="hourly">Pro Stunde</option>
                <option value="daily">Pro Tag</option>
                <option value="monthly">Pro Monat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold px-6 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Inserat veröffentlichen
          </button>
        </div>

      </form>
    </div>
  );
};
