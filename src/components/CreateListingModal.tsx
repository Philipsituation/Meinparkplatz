import React, { useState } from 'react';
import { X, PlusCircle, Car, MapPin, Euro, Clock, Camera, ShieldCheck, Check } from 'lucide-react';
import { ParkingListing, ParkingType, PriceType, VehicleType, FeatureType, PaymentMethod } from '../types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitListing: (newListing: Partial<ParkingListing>) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSubmitListing,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ParkingType>('stellplatz');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('10');
  const [priceType, setPriceType] = useState<PriceType>('daily');
  const [city, setCity] = useState('Frankfurt am Main');
  const [zipCode, setZipCode] = useState('60329');
  const [streetName, setStreetName] = useState('Kaiserstraße');
  const [availableTimesNote, setAvailableTimesNote] = useState('Täglich 22:00 - 10:00 Uhr & am Wochenende');
  const [suitableVehicles, setSuitableVehicles] = useState<VehicleType[]>(['pkw', 'suv_transporter']);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(['Bar', 'PayPal']);
  const [features, setFeatures] = useState<FeatureType[]>(['überdacht', 'zugang_24_7', 'bahnhofsnah']);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80'
  ]);

  const presetPhotos = [
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80',
  ];

  const handleToggleVehicle = (v: VehicleType) => {
    if (suitableVehicles.includes(v)) {
      setSuitableVehicles(prev => prev.filter(x => x !== v));
    } else {
      setSuitableVehicles(prev => [...prev, v]);
    }
  };

  const handleToggleFeature = (f: FeatureType) => {
    if (features.includes(f)) {
      setFeatures(prev => prev.filter(x => x !== f));
    } else {
      setFeatures(prev => [...prev, f]);
    }
  };

  const handleTogglePayment = (p: PaymentMethod) => {
    if (paymentMethods.includes(p)) {
      if (paymentMethods.length > 1) {
        setPaymentMethods(prev => prev.filter(x => x !== p));
      }
    } else {
      setPaymentMethods(prev => [...prev, p]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !city.trim() || !zipCode.trim()) return;

    onSubmitListing({
      title: title.trim(),
      type,
      description: description.trim() || 'Privater Parkplatz zur Vermietung.',
      price: parseFloat(price) || 10,
      priceType,
      city: city.trim(),
      zipCode: zipCode.trim(),
      streetName: streetName.trim(),
      lat: 50.1109 + (Math.random() - 0.5) * 0.05,
      lng: 8.6821 + (Math.random() - 0.5) * 0.05,
      distanceKm: Math.floor(Math.random() * 5) + 1,
      availableTimesNote: availableTimesNote.trim() || 'Nach Absprache im Chat',
      suitableVehicles,
      features,
      paymentMethods,
      images: images.length > 0 ? images : [presetPhotos[0]],
      createdAt: 'Gerade eben',
      viewsCount: 1,
      isFeatured: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#22262d] text-white p-4 flex items-center justify-between shrink-0 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#86b817]" />
            <h3 className="font-bold text-sm sm:text-base">Neuen Parkplatz inserieren</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-gray-600 max-w-lg mx-auto">
            <span className={step >= 1 ? 'text-[#86b817]' : ''}>1. Basis</span>
            <span>&rarr;</span>
            <span className={step >= 2 ? 'text-[#86b817]' : ''}>2. Preis</span>
            <span>&rarr;</span>
            <span className={step >= 3 ? 'text-[#86b817]' : ''}>3. Ort & Zeit</span>
            <span>&rarr;</span>
            <span className={step >= 4 ? 'text-[#86b817]' : ''}>4. Ausstatung</span>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* STEP 1: Basis Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Titel der Anzeige *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Tiefgaragenstellplatz HBF Frankfurt (22:00-10:00 Uhr)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-[#86b817] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Parkplatz-Kategorie</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ParkingType)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-[#86b817] focus:bg-white"
                >
                  <option value="stellplatz">🅿️ Einzelstellplatz (Außen)</option>
                  <option value="tiefgarage">🏢 Tiefgaragenstellplatz</option>
                  <option value="e_ladesaeule">⚡ E-Auto Ladesäule (Wallbox)</option>
                  <option value="carport">🚗 Carport (Überdacht)</option>
                  <option value="garage">🏠 Einzelgarage</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Beschreibung & Details</label>
                <textarea
                  rows={4}
                  placeholder="Beschreibe die Zufahrt, Schranke, Maße, Nähe zu BHF/Event und Anweisungen für den Mieter..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-[#86b817] focus:bg-white"
                />
              </div>

              <button
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="w-full bg-[#86b817] hover:bg-[#74a312] disabled:opacity-50 text-[#22262d] font-extrabold py-3 rounded-xl transition-colors text-sm"
              >
                Weiter zu Schritt 2 (Preis)
              </button>
            </div>
          )}

          {/* STEP 2: Pricing & Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Mietpreis in € *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm font-bold text-gray-900 outline-none focus:border-[#86b817]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Abrechnungszeitraum</label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as PriceType)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-[#86b817]"
                  >
                    <option value="hourly">Pro Stunde</option>
                    <option value="nightly">Über Nacht (Pauschal)</option>
                    <option value="daily">Pro Tag</option>
                    <option value="weekly">Pro Woche</option>
                    <option value="monthly">Pro Monat</option>
                  </select>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Akzeptierte Zahlungsarten (Nur Bar oder PayPal)</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleTogglePayment('Bar')}
                    className={`flex-1 p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 ${
                      paymentMethods.includes('Bar')
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    <span>💵 Barzahlung vor Ort</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePayment('PayPal')}
                    className={`flex-1 p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 ${
                      paymentMethods.includes('PayPal')
                        ? 'bg-blue-50 border-blue-500 text-blue-900'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    <span>🅿️ PayPal</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl text-xs"
                >
                  Zurück
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold py-3 rounded-xl text-sm"
                >
                  Weiter zu Schritt 3 (Ort)
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Availability */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">PLZ *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. 60329"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#86b817]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Stadt *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Frankfurt am Main"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#86b817]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Straße & Hausnummer (Optional)</label>
                <input
                  type="text"
                  placeholder="z.B. Kaiserstraße 42"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#86b817]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Genaues Zeitfenster / Verfügbarkeit</label>
                <input
                  type="text"
                  placeholder="z.B. Täglich von 22:00 bis 10:00 Uhr frei"
                  value={availableTimesNote}
                  onChange={(e) => setAvailableTimesNote(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#86b817]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl text-xs"
                >
                  Zurück
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-2/3 bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold py-3 rounded-xl text-sm"
                >
                  Weiter zu Schritt 4 (Ausstattung)
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Features, Vehicles & Photos */}
          {step === 4 && (
            <div className="space-y-4">
              
              {/* Vehicles */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Geeignete Fahrzeugtypen</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'pkw', label: '🚗 PKW' },
                    { id: 'suv_transporter', label: '🚐 SUV / Transporter' },
                    { id: 'motorrad', label: '🏍️ Motorrad' },
                    { id: 'wohnmobil', label: '🚐 Wohnmobil / Camper' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleVehicle(item.id as VehicleType)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        suitableVehicles.includes(item.id as VehicleType)
                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                          : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Eigenschaften wählen</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'überdacht', label: '🏠 Überdacht' },
                    { id: 'videoüberwacht', label: '📹 Videoüberwacht' },
                    { id: 'e_ladesaeule', label: '⚡ E-Ladesäule' },
                    { id: 'zugang_24_7', label: '🔑 24/7 Zugang' },
                    { id: 'barrierefrei', label: '♿ Barrierefrei' },
                    { id: 'umzaeunt', label: '🔒 Umzäunt' },
                    { id: 'bahnhofsnah', label: '🚆 BHF-nah' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleFeature(item.id as FeatureType)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        features.includes(item.id as FeatureType)
                          ? 'bg-[#86b817]/20 border-[#86b817] text-[#22262d]'
                          : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Photos */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Fotos auswählen oder hochladen</label>
                <div className="grid grid-cols-4 gap-2">
                  {presetPhotos.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        if (images.includes(img)) {
                          setImages(prev => prev.filter(x => x !== img));
                        } else {
                          setImages(prev => [...prev, img]);
                        }
                      }}
                      className={`h-16 rounded-lg overflow-hidden border-2 cursor-pointer relative ${
                        images.includes(img) ? 'border-[#86b817] ring-2 ring-[#86b817]/30' : 'border-gray-200 opacity-60'
                      }`}
                    >
                      <img src={img} alt="preset" className="w-full h-full object-cover" />
                      {images.includes(img) && (
                        <span className="absolute top-1 right-1 bg-[#86b817] text-black text-[10px] p-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl text-xs"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold py-3 rounded-xl shadow-lg text-sm"
                >
                  Anzeige jetzt veröffentlichen
                </button>
              </div>

            </div>
          )}

        </form>

      </div>
    </div>
  );
};
