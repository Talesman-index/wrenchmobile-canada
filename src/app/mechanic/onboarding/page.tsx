'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Wrench,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { LONDON_AREAS } from '@/lib/constants';

export default function MechanicOnboardingPage() {
  const router = useRouter();
  const { setCurrentRole } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [area, setArea] = useState('Westminster');
  const [experience, setExperience] = useState('5');
  const [hasIMI, setHasIMI] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setCurrentRole('mechanic');
      router.push('/mechanic');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto py-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#f3ebff] text-[#5e17eb] border-2 border-purple-100 flex items-center justify-center mx-auto mb-3 shadow-md relative">
          <Wrench className="w-6 h-6 stroke-[2.2] text-[#5e17eb]" />
          <Sparkles className="w-3.5 h-3.5 text-[#ff7a00] absolute -top-0.5 -right-0.5" />
        </div>
        <h1 className="text-2xl font-black text-[#181528] tracking-tight">Join as a Partner Mechanic</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Join London&apos;s premier mobile mechanic network. Receive well-paid call-out jobs on your own flexible schedule.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex flex-col gap-3.5 text-xs">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="e.g. Marcus"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="e.g. Sterling"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Trading Name / Mobile Van (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Sterling Mobile Diagnostics & Repairs"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
            <input
              type="tel"
              placeholder="+44 20 7946 0912"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Coverage Borough</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] font-bold focus:border-[#5e17eb] focus:bg-white outline-none transition-all"
            >
              {LONDON_AREAS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name} ({a.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Years of Experience</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              min={1}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">IMI Accreditation</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="imi-cert"
                checked={hasIMI}
                onChange={(e) => setHasIMI(e.target.checked)}
                className="w-4 h-4 rounded text-[#5e17eb] focus:ring-[#5e17eb]"
              />
              <label htmlFor="imi-cert" className="text-slate-800 font-bold text-xs cursor-pointer">
                IMI Level 3 / 4 Certified
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitted}
          className="mt-3 w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-4 rounded-2xl shadow-purple-cta text-xs flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-75"
        >
          <span>{submitted ? 'Submitting Application...' : 'Submit Mechanic Application'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
