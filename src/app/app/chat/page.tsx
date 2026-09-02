'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  Send,
  Video,
  Phone,
  Paperclip,
  MoreVertical,
  CheckCheck,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Maximize2,
  Car,
  Camera,
  Wrench,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mechanic';
  text: string;
  time: string;
  isMedia?: boolean;
  mediaUrl?: string;
}

export default function ChatAndVideoPage() {
  const { activeCustomerRequest, currentMechanicProfile } = useApp();
  const { showSuccess, showInfo } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'mechanic',
      text: 'Bonjour David ! Je suis en route dans mon fourgon atelier. J’arrive dans environ 15 minutes avec le banc de test.',
      time: '14:20',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Parfait Marc-André, la voiture est garée dans l’allée devant le garage.',
      time: '14:22',
    },
    {
      id: 'm3',
      sender: 'mechanic',
      text: 'Très bien ! Pouvez-vous laisser le capot déverrouillé si possible ?',
      time: '14:23',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Réponse automatique simulée du mécanicien
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'mechanic',
          text: 'Bien reçu ! Je me stationne à l’instant.',
          time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col -mx-4 -mt-3 pb-2 h-[calc(100vh-140px)]">
      {/* En-tête de conversation */}
      <div className="bg-white border-b border-slate-100 p-3.5 flex items-center justify-between shadow-sm sticky top-12 z-30">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <img
              src={currentMechanicProfile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
              alt={currentMechanicProfile.first_name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div>
            <h2 className="text-xs font-black text-slate-900">
              {currentMechanicProfile.first_name} {currentMechanicProfile.last_name}
            </h2>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span>● En service • Sceau Rouge</span>
            </p>
          </div>
        </div>

        {/* Boutons d'appel */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsVideoCallActive(true)}
            className="w-9 h-9 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ff6b00] flex items-center justify-center transition-all shadow-sm"
            title="Lancer l'appel vidéo diagnostic"
          >
            <Video className="w-4 h-4" />
          </button>
          <a
            href={`tel:${currentMechanicProfile.phone}`}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-sm"
            title="Appel vocal"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Fil des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center">
          <span className="bg-white text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            Aujourd’hui
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] rounded-3xl p-3.5 text-xs shadow-card ${
                  isMe
                    ? 'bg-[#0c1f38] text-white rounded-br-xs'
                    : 'bg-white border border-slate-100 text-slate-900 rounded-bl-xs'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                    isMe ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#ff6b00]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barre de saisie */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t border-slate-100 p-3 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => showSuccess('Photo ajoutée à la conversation avec le mécanicien.')}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="Écrivez votre message au mécanicien..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:border-[#0c1f38] outline-none"
        />

        <button
          type="submit"
          className="w-10 h-10 rounded-2xl bg-[#ff6b00] hover:bg-[#e65c00] text-white flex items-center justify-center shrink-0 shadow-orange-cta active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* MODAL D'APPEL VIDÉO DIAGNOSTIC EN DIRECT */}
      {isVideoCallActive && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between animate-in fade-in duration-300">
          {/* En-tête de l'appel */}
          <div className="p-4 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/30">
                <img
                  src={currentMechanicProfile.avatar_url}
                  alt={currentMechanicProfile.first_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-black">
                  {currentMechanicProfile.first_name} (Diagnostic Direct)
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  04:18 • HD 1080p
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsVideoCallActive(false)}
              className="text-white/80 hover:text-white p-2 rounded-full bg-white/10"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Flux vidéo simulé : mécanicien sous le capot */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=900&auto=format&fit=crop&q=80"
              alt="Inspection moteur en direct"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Incrustation caméra client (PiP) */}
            <div className="absolute top-4 right-4 w-28 h-40 bg-slate-900 rounded-2xl border-2 border-white/50 overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Caméra client"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-2 text-[9px] text-white font-bold bg-black/60 px-1 rounded">
                Vous
              </span>
            </div>

            {/* Légende du mécanicien */}
            <div className="absolute bottom-24 left-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-white text-xs">
              <p className="font-bold flex items-center gap-1 text-[#ff6b00]">
                <Wrench className="w-3.5 h-3.5" />
                <span>Marc-André vous montre les cosses de batterie :</span>
              </p>
              <p className="text-[11px] text-slate-200 mt-0.5">
                « La borne négative présente une forte oxydation de sulfate empêchant le courant de passer. »
              </p>
            </div>
          </div>

          {/* Commandes d'appel vidéo */}
          <div className="p-6 bg-gradient-to-t from-black to-transparent flex items-center justify-center gap-5 z-10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-13 h-13 rounded-full flex items-center justify-center text-white transition-colors ${
                isMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoDisabled(!isVideoDisabled)}
              className={`w-13 h-13 rounded-full flex items-center justify-center text-white transition-colors ${
                isVideoDisabled ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
              }`}
            >
              {isVideoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoCallActive(false)}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl active:scale-95 transition-all"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
