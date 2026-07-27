import React, { useState } from 'react';
import { X, Send, Clock, ShieldCheck, Trash2, Smile, CheckCheck, Lock } from 'lucide-react';
import { Conversation, ChatMessage } from '../types';

interface ChatModalProps {
  conversation: Conversation | null;
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenRateLandlord: (landlordId: string, landlordName: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  conversation,
  onClose,
  onSendMessage,
  onDeleteConversation,
  onOpenRateLandlord,
}) => {
  if (!conversation) return null;

  const [inputMessage, setInputMessage] = useState('');

  const quickTemplates = [
    'Hallo! Ist der Parkplatz heute von 22:00 bis 10:00 Uhr frei?',
    'Hallo, kann ich bar vor Ort zahlen?',
    'Passt PayPal als Zahlungsmethode?',
    'Wie findet die Schlüssel- / Kartenübergabe statt?',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage.trim());
    setInputMessage('');
  };

  const handleSelectTemplate = (text: string) => {
    onSendMessage(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col h-[85vh]">
        
        {/* Chat Header Bar */}
        <div className="bg-[#22262d] text-white p-4 flex items-center justify-between shrink-0 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#86b817] text-[#22262d] font-black flex items-center justify-center text-base">
              {conversation.landlordName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>{conversation.landlordName}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-normal">
                  Privat-Vermieter
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate max-w-xs sm:max-w-md">
                Inserat: {conversation.listingTitle} ({conversation.listingPrice})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenRateLandlord(conversation.landlordId, conversation.landlordName)}
              className="px-2.5 py-1 bg-[#86b817]/20 hover:bg-[#86b817]/30 text-[#86b817] border border-[#86b817]/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              title="Vermieter mit Smiley bewerten"
            >
              <Smile className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bewerten</span>
            </button>

            <button
              onClick={() => onDeleteConversation(conversation.id)}
              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-lg transition-colors"
              title="Chatverlauf löschen"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Week Auto Deletion Safety & Location Privacy Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Standortschutz & Datenschutz:</strong> Genaue Adresse nur bei Freigabe. Chats verfallen nach 14 Tagen.
            </span>
          </div>

          <button
            onClick={() => {
              onSendMessage('📍 Standort freigegeben: Kaiserstraße 42, 60329 Frankfurt am Main (Einfahrt Kaiserstraße / Stellplatz Nr. 12)');
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 shadow-2xs transition-colors shrink-0"
            title="Genauen Standort für diesen Mieter freigeben"
          >
            <span>📍 Genauen Standort freigeben</span>
          </button>
        </div>

        {/* Message Bubble Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
          
          {conversation.messages.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="w-12 h-12 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mx-auto text-xl">
                💬
              </div>
              <h4 className="font-bold text-gray-800 text-sm">Noch keine Nachrichten</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Schreibe dem Vermieter für Fragen zur Verfügbarkeit, Uhrzeiten oder Bezahlung.
              </p>
            </div>
          ) : (
            conversation.messages.map((msg) => {
              const isMe = msg.senderId === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-2xs leading-relaxed ${
                      isMe
                        ? 'bg-[#86b817] text-[#22262d] font-medium rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1 flex items-center justify-end gap-1 font-mono ${
                        isMe ? 'text-[#22262d]/70' : 'text-gray-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-[#22262d]/80" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-gray-200 shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-gray-500 shrink-0">Schnell-Fragen:</span>
          {quickTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTemplate(template)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border border-gray-200 shrink-0 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Nachricht an den Vermieter schreiben..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-gray-100 text-gray-900 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#86b817] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-[#86b817] hover:bg-[#74a312] disabled:opacity-50 text-[#22262d] font-bold p-2.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Senden</span>
          </button>
        </form>

      </div>
    </div>
  );
};
