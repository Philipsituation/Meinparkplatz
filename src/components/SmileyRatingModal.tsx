import React, { useState } from 'react';
import { X, Smile, Check, ShieldCheck } from 'lucide-react';
import { SmileyRating } from '../types';

interface SmileyRatingModalProps {
  isOpen: boolean;
  landlordName: string;
  onClose: () => void;
  onSubmitRating: (rating: SmileyRating, tags: string[], comment: string) => void;
}

export const SmileyRatingModal: React.FC<SmileyRatingModalProps> = ({
  isOpen,
  landlordName,
  onClose,
  onSubmitRating,
}) => {
  if (!isOpen) return null;

  const [selectedRating, setSelectedRating] = useState<SmileyRating>('top');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sehr pünktlich', 'Freundliche Kommunikation']);
  const [comment, setComment] = useState('');

  const availableTags = [
    'Sehr pünktlich',
    'Freundliche Kommunikation',
    'Saubere Tiefgarage / Stellplatz',
    'Klasse BHF- / Zentrumslage',
    'Einfache Schlüssel- / Kartenübergabe',
    'Fairer Preis',
    'Sehr zuverlässig',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRating(selectedRating, selectedTags, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#22262d] text-white p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-[#86b817]" />
            <h3 className="font-bold text-sm">Vermieter bewerten</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-500">Wie war deine Erfahrung mit</p>
            <h4 className="font-extrabold text-base text-gray-900">{landlordName}?</h4>
          </div>

          {/* 3 Smiley Selection Tiers */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRating('top')}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                selectedRating === 'top'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md scale-105'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-3xl">😁</span>
              <span className="font-black text-xs">TOP</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRating('zufrieden')}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                selectedRating === 'zufrieden'
                  ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md scale-105'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-3xl">🙂</span>
              <span className="font-black text-xs">Zufrieden</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRating('naja')}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                selectedRating === 'naja'
                  ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-md scale-105'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-3xl">🙁</span>
              <span className="font-black text-xs">Na ja</span>
            </button>
          </div>

          {/* Tags Checkbox Pill Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 block">
              Was hat besonders gut gepasst? (Mehrfachauswahl)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag, idx) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#86b817]/20 border-[#86b817] text-[#22262d] font-bold'
                        : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#628b0d]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              Kommentar (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Kurzes Feedback zur Schlüsselübergabe oder zum Parkplatz..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:bg-white focus:border-[#86b817]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#86b817] hover:bg-[#74a312] text-[#22262d] font-extrabold py-3 rounded-xl shadow-md transition-colors text-sm"
          >
            Bewertung absenden
          </button>
        </form>

      </div>
    </div>
  );
};
