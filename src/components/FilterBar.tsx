import React from 'react';
import { Filter, SlidersHorizontal, Map, ListFilter, RotateCcw, Euro, ShieldCheck, Car } from 'lucide-react';
import { FilterState, ParkingType } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const resetFilters = () => {
    setFilters({
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
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[108px] z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
        
        {/* Row 1: Category Chips & View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Quick Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedType: 'all' }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filters.selectedType === 'all'
                  ? 'bg-[#86b817] text-[#22262d]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle Parkplätze
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedType: 'tiefgarage' }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filters.selectedType === 'tiefgarage'
                  ? 'bg-[#86b817] text-[#22262d]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏢 Tiefgarage
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedType: 'stellplatz' }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filters.selectedType === 'stellplatz'
                  ? 'bg-[#86b817] text-[#22262d]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🅿️ Einzelstellplatz
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedType: 'e_ladesaeule' }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filters.selectedType === 'e_ladesaeule'
                  ? 'bg-[#86b817] text-[#22262d]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚡ E-Ladesäule
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedType: 'carport' }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filters.selectedType === 'carport'
                  ? 'bg-[#86b817] text-[#22262d]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚗 Carport
            </button>
          </div>

          {/* Action Tools & View Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                showAdvanced || filters.selectedPriceType !== 'all' || filters.paymentMethod !== 'all'
                  ? 'bg-[#86b817]/20 border-[#86b817] text-[#22262d]'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>

            {/* List / Map View Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Liste</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-[#86b817] font-extrabold shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Karte</span>
              </button>
            </div>
          </div>

        </div>

        {/* Row 2: Radius Slider & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-600">Umkreis:</span>
            <div className="flex items-center gap-2">
              {[0, 5, 10, 20, 50, 100].map(radius => (
                <button
                  key={radius}
                  onClick={() => setFilters(prev => ({ ...prev, radiusKm: radius }))}
                  className={`px-2 py-0.5 rounded text-xs ${
                    filters.radiusKm === radius
                      ? 'bg-gray-900 text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {radius === 0 ? 'Exakt' : `+${radius} km`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-500">
              <strong className="text-gray-900 font-bold">{totalResults}</strong> Ergebnisse
            </div>

            <div className="flex items-center gap-1">
              <span className="text-gray-500">Sortierung:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-gray-50 border border-gray-200 text-gray-800 rounded px-2 py-1 text-xs outline-none font-medium"
              >
                <option value="newest">Neueste zuerst</option>
                <option value="price_asc">Preis: Aufsteigend</option>
                <option value="price_desc">Preis: Absteigend</option>
                <option value="distance">Entfernung</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expanded Advanced Filters */}
        {showAdvanced && (
          <div className="pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
            
            {/* Mietdauer / Zeitfenster */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <span>Mietdauer / Zeitraum</span>
              </label>
              <select
                value={filters.selectedPriceType}
                onChange={(e) => setFilters(prev => ({ ...prev, selectedPriceType: e.target.value }))}
                className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800"
              >
                <option value="all">Alle Zeiträume</option>
                <option value="hourly">Stundenweise</option>
                <option value="nightly">Über Nacht (Event / Konzert)</option>
                <option value="daily">Tagesweise</option>
                <option value="weekly">Wöchentlich</option>
                <option value="monthly">Monatlich</option>
              </select>
            </div>

            {/* Zahlungsmethode */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zahlungsmethode</span>
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800"
              >
                <option value="all">Alle (Bar & PayPal)</option>
                <option value="Bar">Nur Barzahlung vor Ort</option>
                <option value="PayPal">Nur PayPal</option>
              </select>
            </div>

            {/* Fahrzeugtyp */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-blue-600" />
                <span>Passend für Fahrzeug</span>
              </label>
              <select
                value={filters.vehicleType}
                onChange={(e) => setFilters(prev => ({ ...prev, vehicleType: e.target.value }))}
                className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800"
              >
                <option value="all">Alle Fahrzeuge</option>
                <option value="pkw">Standard PKW</option>
                <option value="suv_transporter">SUV / Transporter</option>
                <option value="motorrad">Motorrad / Roller</option>
                <option value="wohnmobil">Wohnmobil / Camper</option>
              </select>
            </div>

            {/* Reset Actions */}
            <div className="flex items-end justify-between gap-2">
              <button
                onClick={resetFilters}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md py-1.5 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Filter zurücksetzen</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
