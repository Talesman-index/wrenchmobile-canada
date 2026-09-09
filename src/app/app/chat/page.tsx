'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  Send,
  Video,
  Phone,
  CheckCheck,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Maximize2,
  Minimize2,
  Camera,
  Wrench,
  RefreshCw,
  Sparkles,
  Volume2,
  VolumeX,
  Activity,
  ShieldCheck,
  Radio,
  Layers,
  PhoneCall,
  AlertCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mechanic';
  text: string;
  time: string;
  hasCallPrompt?: boolean;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const { currentMechanicProfile } = useApp();
  const { showSuccess, showError } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'mechanic',
      text: 'Hello James! I’m en route in our mobile workshop van. Arriving in about 15 minutes with the diagnostic rig.',
      time: '14:20',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Sounds great Marcus, the car is parked in the driveway outside.',
      time: '14:22',
    },
    {
      id: 'm3',
      sender: 'mechanic',
      text: 'Spot on! Could you release the bonnet latch if convenient?',
      time: '14:23',
    },
    {
      id: 'm4',
      sender: 'mechanic',
      text: 'I can also initiate a live diagnostic video call if you’d like to see the multimeter and OBD-II scanner readouts in real-time.',
      time: '14:24',
      hasCallPrompt: true,
    },
  ]);

  const [inputText, setInputText] = useState('');

  // Call state
  const [callType, setCallType] = useState<'video' | 'voice' | null>(null);
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const [remoteFeedMode, setRemoteFeedMode] = useState<'engine' | 'technician'>('engine');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Live telemetry mock
  const [voltage, setVoltage] = useState(12.4);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringOscillatorRef = useRef<OscillatorNode | null>(null);

  // Auto-trigger call if query param ?call=video or ?call=voice
  useEffect(() => {
    const callParam = searchParams.get('call');
    if (callParam === 'video') {
      startCall('video');
    } else if (callParam === 'voice') {
      startCall('voice');
    }
  }, [searchParams]);

  // Handle live call timer & voltage fluctuation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callType && callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((d) => d + 1);
        // Realistic voltage fluctuation
        setVoltage(+(12.3 + Math.random() * 0.3).toFixed(2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callType, callStatus]);

  // Play realistic Web Audio ringtone while calling
  const startRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(400, ctx.currentTime);
      osc2.frequency.setValueAtTime(450, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      ringOscillatorRef.current = osc1;

      // Cadence pulsing
      let on = true;
      const pulseInterval = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          clearInterval(pulseInterval);
          return;
        }
        on = !on;
        gainNode.gain.setValueAtTime(on ? 0.05 : 0, ctx.currentTime);
      }, 700);

      setTimeout(() => {
        clearInterval(pulseInterval);
      }, 3000);
    } catch {
      // AudioContext policy or unsupported
    }
  };

  const stopRingtone = () => {
    if (ringOscillatorRef.current) {
      try {
        ringOscillatorRef.current.stop();
      } catch {}
      ringOscillatorRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  // Start Camera Stream
  const initUserMedia = async (targetFacing: 'user' | 'environment') => {
    // Stop any existing tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermissionGranted(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: targetFacing, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });

      mediaStreamRef.current = stream;
      setCameraPermissionGranted(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access unavailable or declined:', err);
      setCameraPermissionGranted(false);
    }
  };

  const startCall = (type: 'video' | 'voice') => {
    setCallType(type);
    setCallStatus('calling');
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoDisabled(false);

    startRingtone();

    if (type === 'video') {
      initUserMedia(facingMode);
    }

    // Auto-answer simulation after 1.8s
    setTimeout(() => {
      stopRingtone();
      setCallStatus('connected');
    }, 1800);
  };

  const endCall = () => {
    stopRingtone();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCallStatus('ended');
    setTimeout(() => {
      setCallType(null);
      showSuccess('Diagnostic session ended. Summary added to job history.');
    }, 400);
  };

  // Toggle user camera facing (Front vs Back)
  const toggleCameraFacing = async () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    await initUserMedia(nextFacing);
  };

  // Toggle Audio Mute
  const toggleMute = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle Video Track
  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoDisabled;
      });
    }
    setIsVideoDisabled(!isVideoDisabled);
  };

  // Chat message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated mechanic reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'mechanic',
          text: 'Understood! Van parked up outside now. I will pop the bonnet and begin the multi-point inspection.',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col -mx-4 -mt-3 pb-2 h-[calc(100vh-140px)] relative">
      {/* Top Chat Header */}
      <div className="bg-white border-b border-slate-100 p-3 flex items-center justify-between shadow-sm sticky top-12 z-30">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0">
            <img
              src={currentMechanicProfile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
              alt={currentMechanicProfile.first_name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
          </div>

          <div>
            <h2 className="text-xs font-black text-slate-900">
              {currentMechanicProfile.first_name} {currentMechanicProfile.last_name}
            </h2>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span>● On Duty • IMI Certified</span>
            </p>
          </div>
        </div>

        {/* Action Call Buttons with larger touch areas */}
        <div className="flex items-center gap-2">
          {/* VIDEO CALL BUTTON */}
          <button
            type="button"
            id="btn-video-call"
            onClick={() => startCall('video')}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-200 text-[#ff6b00] border border-orange-200/70 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Launch Live Diagnostic Video Call"
          >
            <Video className="w-5 h-5 text-[#ff6b00]" />
          </button>

          {/* VOICE CALL BUTTON */}
          <button
            type="button"
            id="btn-voice-call"
            onClick={() => startCall('voice')}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#5e17eb] border border-slate-200/80 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Launch Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center">
          <span className="bg-white text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            Today
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
                className={`max-w-[82%] rounded-3xl p-3.5 text-xs shadow-card ${
                  isMe
                    ? 'bg-[#5e17eb] text-white rounded-br-xs shadow-purple-cta'
                    : 'bg-white border border-slate-100 text-[#181528] rounded-bl-xs'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>

                {/* Inline Call Card Prompt */}
                {msg.hasCallPrompt && !isMe && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-col gap-2">
                    <div className="bg-[#f8f9fd] rounded-2xl p-2.5 border border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#ff6b00] flex items-center justify-center">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <div>
                          <p className="font-black text-[11px] text-[#181528]">OBD-II Video Rig Ready</p>
                          <p className="text-[9px] text-slate-500">Live 1080p Telemetry Stream</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => startCall('video')}
                        className="bg-[#ff6b00] hover:bg-[#e05f00] text-white font-black text-[10px] px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join Call</span>
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-center justify-end gap-1 mt-1.5 text-[9px] ${
                    isMe ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t border-slate-100 p-3 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => showSuccess('Diagnostic photo captured and attached to chat.')}
          className="p-2.5 text-slate-400 hover:text-[#5e17eb] rounded-full hover:bg-[#f3ebff] transition-colors"
          title="Attach photo"
        >
          <Camera className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Type a message to your mobile mechanic..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#f8f9fd] border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs text-[#181528] focus:border-[#5e17eb] outline-none transition-colors"
        />

        <button
          type="submit"
          className="w-10 h-10 rounded-2xl bg-[#5e17eb] hover:bg-[#4c0ec4] text-white flex items-center justify-center shrink-0 shadow-purple-cta active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* ========================================================================= */}
      {/* 📹 LIVE DIAGNOSTIC VIDEO MODAL (FULL EXPERIENCE WITH CAMERA & WEBRTC) */}
      {/* ========================================================================= */}
      {callType === 'video' && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col justify-between animate-in fade-in duration-300">
          {/* Top Bar Overlay */}
          <div className="p-4 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-lg shrink-0">
                <img
                  src={currentMechanicProfile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                  alt={currentMechanicProfile.first_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight">
                    {currentMechanicProfile.first_name} {currentMechanicProfile.last_name}
                  </h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-1.5 py-0.5 rounded-full">
                    IMI Master Tech
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
                  {callStatus === 'calling' ? (
                    <span className="text-amber-400 flex items-center gap-1 animate-pulse font-sans font-bold">
                      <Radio className="w-3 h-3" />
                      Calling technician line...
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>{formatTimer(callDuration)}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-slate-300">1080p HD Encrypted</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Toggle Remote Angle (Engine Bay vs Mechanic Face) */}
            {callStatus === 'connected' && (
              <button
                type="button"
                onClick={() => setRemoteFeedMode(remoteFeedMode === 'engine' ? 'technician' : 'engine')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-md transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>{remoteFeedMode === 'engine' ? 'Cam: Engine' : 'Cam: Marcus'}</span>
              </button>
            )}
          </div>

          {/* Main Stage */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-slate-900">
            {callStatus === 'calling' ? (
              // CALLING PULSE SCREEN
              <div className="flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-4 border-[#ff6b00] overflow-hidden shadow-2xl animate-pulse">
                    <img
                      src={currentMechanicProfile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                      alt="Calling mechanic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#ff6b00] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                    Connecting
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-white">Calling Marcus Sterling</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Opening live encrypted video rig & telemetry telemetry channel...
                  </p>
                </div>
              </div>
            ) : (
              // CONNECTED VIDEO FEED
              <>
                {remoteFeedMode === 'engine' ? (
                  // Engine Bay Live Inspection Feed
                  <div className="relative w-full h-full">
                    <img
                      src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&auto=format&fit=crop&q=80"
                      alt="Live engine diagnostics"
                      className="w-full h-full object-cover"
                    />

                    {/* Telemetry HUD overlays */}
                    <div className="absolute top-20 left-4 bg-black/60 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 text-white text-xs shadow-xl flex flex-col gap-1 max-w-[200px]">
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold border-b border-white/10 pb-1">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-emerald-400" />
                          <span>MULTIMETER</span>
                        </span>
                        <span className="text-[9px] bg-emerald-500/20 px-1 rounded">LIVE</span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-mono font-black text-emerald-300">{voltage}</span>
                        <span className="text-xs font-mono text-emerald-400">V DC</span>
                      </div>
                      <p className="text-[9px] text-slate-300">Alternator ripple: &lt; 0.05V (Normal)</p>
                    </div>

                    {/* Inspection Point Highlight Marker */}
                    <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                      <div className="relative">
                        <span className="w-5 h-5 rounded-full bg-[#ff6b00] block animate-ping opacity-75" />
                        <span className="w-3 h-3 rounded-full bg-[#ff6b00] block absolute inset-1 ring-2 ring-white" />
                      </div>
                      <span className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-orange-500/50">
                        Negative Terminal
                      </span>
                    </div>
                  </div>
                ) : (
                  // Mechanic Front-Facing Video Feed
                  <div className="relative w-full h-full">
                    <img
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80"
                      alt="Marcus explaining"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Subtitle / Mechanic Live Voice Transcription */}
                <div className="absolute bottom-28 left-4 right-4 bg-black/75 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-white text-xs shadow-2xl">
                  <p className="font-bold flex items-center gap-1.5 text-[#ff6b00]">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Marcus is talking with you:</span>
                  </p>
                  <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
                    « As you can see on the digital readout, the battery terminal has slight oxide buildup. I’m cleaning the posts with a wire brush and applying protective dielectric grease now. »
                  </p>
                </div>

                {/* Picture-in-Picture: Real User Video Stream */}
                <div className="absolute top-20 right-4 w-28 h-40 bg-slate-950 rounded-2xl border-2 border-white/50 overflow-hidden shadow-2xl flex flex-col justify-between">
                  {cameraPermissionGranted === true && !isVideoDisabled ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                      style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-900 text-white">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-1">
                        <VideoOff className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold">
                        {isVideoDisabled ? 'Camera Off' : 'Preview Mode'}
                      </span>
                    </div>
                  )}

                  {/* PiP Overlay Controls */}
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between z-10">
                    <span className="text-[8px] text-white font-bold bg-black/70 px-1.5 py-0.5 rounded">
                      You
                    </span>
                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
                      title="Flip front/rear camera"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Call Control Action Bar */}
          <div className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-center gap-5 z-20">
            {/* Mute button */}
            <button
              type="button"
              onClick={toggleMute}
              className={`w-13 h-13 rounded-full flex items-center justify-center text-white transition-all active:scale-95 ${
                isMuted ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video toggle button */}
            <button
              type="button"
              onClick={toggleVideo}
              className={`w-13 h-13 rounded-full flex items-center justify-center text-white transition-all active:scale-95 ${
                isVideoDisabled ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
              }`}
              title={isVideoDisabled ? 'Enable video' : 'Disable video'}
            >
              {isVideoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Flip camera button */}
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="w-13 h-13 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-95"
              title="Flip camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* End call button */}
            <button
              type="button"
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl shadow-red-600/40 active:scale-90 transition-all cursor-pointer"
              title="Hang up call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📞 LIVE IN-APP VOICE CALL MODAL */}
      {/* ========================================================================= */}
      {callType === 'voice' && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#0e0720] via-[#140b2e] to-[#070411] flex flex-col justify-between p-6 text-white animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-mono text-purple-300 bg-purple-900/40 border border-purple-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>HD VoIP Direct Line</span>
            </span>

            {callStatus === 'connected' && (
              <button
                type="button"
                onClick={() => {
                  setCallType('video');
                  initUserMedia('user');
                }}
                className="bg-orange-500/20 hover:bg-orange-500/30 text-[#ff7a00] border border-orange-500/40 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Switch to Video</span>
              </button>
            )}
          </div>

          {/* Technician Avatar and Calling Animation */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#5e17eb] shadow-2xl relative z-10">
                <img
                  src={currentMechanicProfile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80'}
                  alt="Marcus Sterling"
                  className="w-full h-full object-cover"
                />
              </div>

              {callStatus === 'connected' && (
                <div className="absolute inset-0 -m-3 rounded-full border-2 border-purple-400/40 animate-ping opacity-60 pointer-events-none" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-black text-white">
                {currentMechanicProfile.first_name} {currentMechanicProfile.last_name}
              </h2>
              <p className="text-xs text-purple-300 font-medium mt-1">
                Wrench Mobile Technician • London Fleet
              </p>
            </div>

            {callStatus === 'calling' ? (
              <p className="text-xs font-mono text-amber-400 animate-pulse font-bold">
                Ringing technician mobile workshop...
              </p>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <p className="text-lg font-mono font-black text-emerald-400">
                  {formatTimer(callDuration)}
                </p>

                {/* Animated Voice Waveform */}
                <div className="flex items-center gap-1 h-8">
                  {[40, 70, 25, 90, 50, 80, 30, 65, 85, 45, 95, 35].map((height, idx) => (
                    <span
                      key={idx}
                      style={{ height: `${height}%` }}
                      className="w-1 bg-[#5e17eb] rounded-full animate-pulse transition-all duration-300"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-6 pb-6">
            <button
              type="button"
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all active:scale-95 ${
                isMuted ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              type="button"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all active:scale-95 ${
                isSpeakerOn ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
              title={isSpeakerOn ? 'Speaker ON' : 'Speaker OFF'}
            >
              {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>

            <button
              type="button"
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-xl shadow-red-600/50 active:scale-90 transition-all cursor-pointer"
              title="End Voice Call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatAndVideoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Loading Live Diagnostics Chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
