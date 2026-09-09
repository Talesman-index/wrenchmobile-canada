'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  ArrowRight,
  Zap,
  BatteryCharging,
  Disc,
  ShieldAlert,
  Droplets,
  Cpu,
  Sparkles,
  Car,
  Search,
  ShoppingBag,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
} from 'lucide-react';
import { LONDON_AREAS } from '@/lib/constants';
import { useApp } from '@/lib/store';

export default function LandingPage() {
  const { setCurrentRole } = useApp();
  const [activeServiceTab, setActiveServiceTab] = useState<'emergency' | 'maintenance' | 'repair'>('emergency');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);

  const heroThumbnails = [
    {
      title: 'Tyres & Punctures',
      price: '£65',
      image: '/images/landing/tires_stack.jpg',
      badge: 'Rapid Fitting',
    },
    {
      title: 'Oil & Filter Service',
      price: '£95',
      image: '/images/landing/oil_filter.jpg',
      badge: 'Full Synthetic',
    },
    {
      title: 'Battery & Charging',
      price: '£145',
      image: '/images/offer_battery_mechanic.jpg',
      badge: '3-Year Warranty',
    },
    {
      title: 'Brake Pads & Discs',
      price: '£139',
      image: '/images/offer_brakes_mechanic.jpg',
      badge: 'OEM Ceramic',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F6] text-[#131722] font-sans antialiased selection:bg-[#FF5C28] selection:text-white overflow-x-hidden">
      
      {/* Top Assistance Ribbon */}
      <div className="bg-[#FFF4EE] border-b border-[#FFE4D6] px-4 py-2 text-center text-xs text-[#FF5C28] flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FF5C28] animate-ping" />
        <span>
          <strong className="text-[#131722]">Live in Greater London:</strong> Certified mobile mechanics ready within 25 mins in Westminster, Camden, Kensington, Islington & City
        </span>
      </div>

      {/* Main Header / Navigation Bar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#F0EAE3] shadow-sm px-5 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6A3D] to-[#FF5C28] flex items-center justify-center text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-all">
              <Wrench className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-[#131722]">WRENCH</span>
                <span className="text-[10px] bg-[#FFF0EB] text-[#FF5C28] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  LONDON
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#5A6072]">
            <Link href="/" className="text-[#131722] font-bold hover:text-[#FF5C28] transition-colors">
              Home
            </Link>
            <Link href="#services" className="hover:text-[#FF5C28] transition-colors">
              Our Services
            </Link>
            <Link href="#experience" className="hover:text-[#FF5C28] transition-colors">
              Why Us
            </Link>
            <Link href="#how-it-works" className="hover:text-[#FF5C28] transition-colors">
              How It Works
            </Link>
            <Link href="/app/explore" onClick={() => setCurrentRole('customer')} className="hover:text-[#FF5C28] transition-colors">
              Find Mechanics
            </Link>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-[#F6F4F0] rounded-full px-3.5 py-2 border border-[#EDE7DF] w-52 focus-within:w-64 focus-within:border-[#FF5C28] transition-all">
              <Search className="w-4 h-4 text-[#8C93A4] shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Search repair or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs w-full focus:outline-none text-[#131722] placeholder:text-[#9AA1B2]"
              />
            </div>

            <Link
              href="/app/request"
              onClick={() => setCurrentRole('customer')}
              className="w-10 h-10 rounded-full bg-[#131722] text-white flex items-center justify-center hover:bg-[#FF5C28] transition-colors shadow-sm"
              title="Fast booking"
            >
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-6 pb-16 lg:pb-24 max-w-7xl mx-auto w-full">
        {/* Ambient background glow shapes */}
        <div className="absolute top-12 right-12 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-100/60 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-start pt-2">
            {/* Pill Introducing */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0EB] border border-[#FFE2D6] text-xs font-bold text-[#FF5C28] mb-5">
              <Sparkles className="w-3.5 h-3.5 fill-[#FF5C28]" />
              <span>On-Demand Mobile Mechanic • Greater London</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#131722] leading-[1.12]">
              Certified Mobile Mechanics <br />
              <span className="text-[#131722]">At Your </span>
              <span className="text-[#FF5C28] relative inline-block">
                Doorstep
                <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-[#FF5C28]/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 Q50 0 100 15" stroke="currentColor" strokeWidth="6" fill="transparent" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#60677A] leading-relaxed max-w-lg">
              Our IMI-certified mobile technicians come directly to your driveway, office parking or roadside across London. Fast dealer-grade diagnostics, routine servicing and on-site repairs without the recovery truck.
            </p>

            {/* Mini Service Selector Badges / Thumbnails */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5 p-2 bg-white rounded-2xl border border-[#EDE7DF] shadow-sm">
              {heroThumbnails.map((item, idx) => (
                <button
                  key={item.title}
                  onClick={() => setSelectedHeroIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    selectedHeroIndex === idx
                      ? 'bg-[#131722] text-white shadow-sm'
                      : 'bg-[#F9F7F4] hover:bg-[#F2EFEA] text-[#4A5060]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 bg-white">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">{item.title}</span>
                </button>
              ))}
            </div>

            {/* CTA Buttons and Price Display */}
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link
                href="/app/request"
                onClick={() => setCurrentRole('customer')}
                className="bg-gradient-to-r from-[#FF6A3D] to-[#FF5C28] hover:from-[#f05a2b] hover:to-[#e64c17] active:scale-[0.98] text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 text-sm transition-all"
              >
                <span>Book a Mobile Mechanic</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#131722]">From £59.00</span>
                <span className="text-xs text-[#82899A] font-medium">Fixed Quote</span>
              </div>
            </div>

            {/* Micro reassurance badges */}
            <div className="mt-8 flex items-center gap-6 pt-6 border-t border-[#EDE7DF] w-full max-w-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5C28]" />
                <span className="text-xs font-semibold text-[#4A5060]">No hidden call-out fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5C28]" />
                <span className="text-xs font-semibold text-[#4A5060]">12-Month Parts & Labour Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            
            {/* Dynamic circular background container */}
            <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
              
              {/* Concentric Orange Circles & Fluid Rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF6A3D] to-[#FF4E18] shadow-2xl shadow-orange-500/25 flex items-center justify-center" />
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[#FF7D54]/50 animate-spin" style={{ animationDuration: '60s' }} />
              <div className="absolute -inset-8 rounded-full border border-[#FF6A3D]/20" />

              {/* Hero Image Render */}
              <div className="relative z-10 w-[92%] h-[92%] rounded-full overflow-hidden flex items-center justify-center p-2">
                <Image
                  src="/images/landing/tires_stack.jpg"
                  alt="Mobile tyre and vehicle servicing London"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-full transform hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              {/* Floating Vertical Feature Badges */}
              <div className="absolute -right-2 sm:-right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 z-20">
                {/* Badge 1 */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 pr-4 border border-[#F0EAE3] shadow-lg flex items-center gap-3 hover:-translate-x-1 transition-transform">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF5C28] flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#131722]">25 Min Arrival</p>
                    <p className="text-[10px] text-[#7E8597]">London rapid dispatch</p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 pr-4 border border-[#F0EAE3] shadow-lg flex items-center gap-3 hover:-translate-x-1 transition-transform">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF5C28] flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#131722]">IMI Certified</p>
                    <p className="text-[10px] text-[#7E8597]">Level 3 & 4 Technicians</p>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 pr-4 border border-[#F0EAE3] shadow-lg flex items-center gap-3 hover:-translate-x-1 transition-transform">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF5C28] flex items-center justify-center font-bold shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#131722]">100% Guaranteed</p>
                    <p className="text-[10px] text-[#7E8597]">OEM & OE-Spec Parts</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: BEST SERVICE EXPERIENCE (MECHANIC HERO) ===================== */}
      <section id="experience" className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl sm:rounded-[36px] border border-[#EDE7DF] p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Card: Mechanic Portrait with Metrics */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px]">
                
                {/* Mechanic portrait in orange circle */}
                <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-[#FF7D54] to-[#FF5C28] p-1.5 shadow-xl shadow-orange-500/20">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      src="/images/landing/mechanic_pro.jpg"
                      alt="IMI Certified Mobile Mechanic"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating Top-Right Rating Badge */}
                <div className="absolute top-4 right-0 sm:-right-2 bg-white rounded-2xl px-3 py-1.5 border border-[#EDE7DF] shadow-md flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-[#131722]">4.98 / 5</span>
                </div>

                {/* Floating Top-Left Team Badge */}
                <div className="absolute top-8 -left-2 sm:-left-4 bg-white rounded-2xl px-3 py-1.5 border border-[#EDE7DF] shadow-md flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#FF5C28]" />
                  <span className="text-[11px] font-bold text-[#131722]">IMI Master Techs</span>
                </div>

                {/* Floating Bottom Card: London Motorists Served */}
                <div className="mt-4 bg-[#FBF9F6] border border-[#EDE7DF] rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-[#7E8597] font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 text-[#FF5C28]" />
                      <span>Motorists Served in London</span>
                    </div>
                    <p className="text-xl font-black text-[#131722] mt-0.5">84,200+</p>
                  </div>
                  <div className="h-8 w-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-black text-[#FF5C28]">99.4% On-Time</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-7 flex flex-col items-start lg:pl-6">
              <span className="text-xs uppercase tracking-widest text-[#FF5C28] font-black mb-2">
                Reinventing Car Servicing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131722] tracking-tight leading-tight">
                The finest workshop experience, right in your driveway.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#60677A] leading-relaxed">
                Forget lost weekends, greasy garage waiting rooms and eye-watering towing charges. Our custom workshop vans carry the same dealer diagnostic equipment, torque tools and fluid extractors as a main franchise.
              </p>

              {/* 2 Value Pillars */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FBF9F6] border border-[#EDE7DF]">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] text-[#FF5C28] flex items-center justify-center shrink-0 font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#131722]">Live GPS Tracking</h4>
                    <p className="text-[11px] text-[#7E8597] mt-0.5">Track your mobile technician arriving in real time</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FBF9F6] border border-[#EDE7DF]">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] text-[#FF5C28] flex items-center justify-center shrink-0 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#131722]">Fixed & Transparent Quotes</h4>
                    <p className="text-[11px] text-[#7E8597] mt-0.5">Clear upfront pricing in GBP (£) with 20% VAT invoice</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/app/request"
                  onClick={() => setCurrentRole('customer')}
                  className="bg-[#131722] hover:bg-[#FF5C28] text-white font-bold py-3.5 px-6 rounded-full text-xs transition-all flex items-center gap-2"
                >
                  <span>Book Service Online</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/mechanic/onboarding"
                  onClick={() => setCurrentRole('mechanic')}
                  className="text-xs font-bold text-[#131722] hover:text-[#FF5C28] transition-colors"
                >
                  Are you a qualified mechanic? Join our team →
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: EXPLORE OUR SERVICES & PRODUCTS ===================== */}
      <section id="services" className="px-4 sm:px-6 lg:px-8 py-14 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FF5C28] font-black mb-1 block">
              Transparent Packages & Parts
            </span>
            <h2 className="text-3xl font-extrabold text-[#131722] tracking-tight">
              Explore Popular Mobile Services
            </h2>
            <p className="text-xs sm:text-sm text-[#7E8597] mt-1 max-w-lg">
              Every appointment includes mobile call-out, initial diagnostics, OEM-grade parts and comprehensive labour.
            </p>
          </div>

          <Link
            href="/app/request"
            onClick={() => setCurrentRole('customer')}
            className="self-start md:self-auto bg-gradient-to-r from-[#FF6A3D] to-[#FF5C28] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-orange-500/20 hover:opacity-95 transition-opacity"
          >
            View All Services
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Full Oil Service */}
          <div className="bg-white rounded-3xl border border-[#EDE7DF] p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl bg-[#FBF9F6] overflow-hidden mb-4 p-2 flex items-center justify-center">
                <Image
                  src="/images/landing/oil_filter.jpg"
                  alt="Mobile oil change and filter service London"
                  width={240}
                  height={180}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-extrabold text-sm text-[#131722]">Full Oil & Filter Service</h3>
              <p className="text-[11px] text-[#7E8597] mt-1">Premium synthetic OEM-spec oil, new filter & multi-point check.</p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#F0EAE3] flex items-center justify-between">
              <span className="text-base font-black text-[#FF5C28]">£95.00</span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#131722]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
            </div>
          </div>

          {/* Card 2: Battery Replacement */}
          <div className="bg-white rounded-3xl border border-[#EDE7DF] p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl bg-[#FBF9F6] overflow-hidden mb-4 p-2 flex items-center justify-center">
                <Image
                  src="/images/offer_battery_mechanic.jpg"
                  alt="Mobile battery replacement London"
                  width={240}
                  height={180}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-extrabold text-sm text-[#131722]">New Battery & ECU Coding</h3>
              <p className="text-[11px] text-[#7E8597] mt-1">Delivery, installation and BMS coding with 3-year warranty.</p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#F0EAE3] flex items-center justify-between">
              <span className="text-base font-black text-[#FF5C28]">£145.00</span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#131722]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
            </div>
          </div>

          {/* Card 3: Brakes and Discs */}
          <div className="bg-white rounded-3xl border border-[#EDE7DF] p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl bg-[#FBF9F6] overflow-hidden mb-4 p-2 flex items-center justify-center">
                <Image
                  src="/images/offer_brakes_mechanic.jpg"
                  alt="Mobile brake pads and discs replacement"
                  width={240}
                  height={180}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-extrabold text-sm text-[#131722]">Brake Pads & Discs Service</h3>
              <p className="text-[11px] text-[#7E8597] mt-1">Full system inspection, calliper clean and ceramic pad fitting.</p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#F0EAE3] flex items-center justify-between">
              <span className="text-base font-black text-[#FF5C28]">£139.00</span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#131722]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </div>
            </div>
          </div>

          {/* Card 4: Tyres & Punctures */}
          <div className="bg-white rounded-3xl border border-[#EDE7DF] p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl bg-[#FBF9F6] overflow-hidden mb-4 p-2 flex items-center justify-center">
                <Image
                  src="/images/landing/tires_stack.jpg"
                  alt="Mobile tyre fitting and puncture repair"
                  width={240}
                  height={180}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-extrabold text-sm text-[#131722]">Mobile Tyre & Puncture</h3>
              <p className="text-[11px] text-[#7E8597] mt-1">Driveway puncture repair, wheel balancing and tyre replacement.</p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#F0EAE3] flex items-center justify-between">
              <span className="text-base font-black text-[#FF5C28]">£65.00</span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#131722]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===================== SECTION: COMPLETE MOBILE WORKSHOP ===================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="bg-[#111625] text-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5C28]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Header info */}
            <div className="lg:col-span-4 flex flex-col">
              <span className="text-xs uppercase tracking-widest text-[#FF6A3D] font-black mb-2">
                All-in-One Mobile Van
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Our Services
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-[#94A0B8] leading-relaxed">
                Precision automotive engineering carried out right at your location with certified professional tooling and complete guarantee.
              </p>
            </div>

            {/* Right 3 Service Interactive Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Emergency Roadside */}
              <div
                onClick={() => setActiveServiceTab('emergency')}
                className={`p-5 rounded-3xl cursor-pointer transition-all ${
                  activeServiceTab === 'emergency'
                    ? 'bg-gradient-to-br from-[#FF6A3D] to-[#FF5C28] text-white shadow-lg shadow-orange-500/30'
                    : 'bg-[#1C2337] hover:bg-[#232C44] text-[#E2E8F0]'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                  activeServiceTab === 'emergency' ? 'bg-white/20 text-white' : 'bg-white/5 text-[#FF6A3D]'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm mb-1.5">Emergency Assistance</h4>
                <p className={`text-[11px] leading-relaxed ${
                  activeServiceTab === 'emergency' ? 'text-white/90' : 'text-[#8A95AC]'
                }`}>
                  Fast battery jump start, no-start troubleshooting & roadside puncture recovery.
                </p>
              </div>

              {/* Card 2: Driveway Servicing */}
              <div
                onClick={() => setActiveServiceTab('maintenance')}
                className={`p-5 rounded-3xl cursor-pointer transition-all ${
                  activeServiceTab === 'maintenance'
                    ? 'bg-gradient-to-br from-[#FF6A3D] to-[#FF5C28] text-white shadow-lg shadow-orange-500/30'
                    : 'bg-[#1C2337] hover:bg-[#232C44] text-[#E2E8F0]'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                  activeServiceTab === 'maintenance' ? 'bg-white/20 text-white' : 'bg-white/5 text-[#FF6A3D]'
                }`}>
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm mb-1.5">Driveway Servicing</h4>
                <p className={`text-[11px] leading-relaxed ${
                  activeServiceTab === 'maintenance' ? 'text-white/90' : 'text-[#8A95AC]'
                }`}>
                  Full synthetic oil service, spark plugs, pollen filters & 40-point vehicle check.
                </p>
              </div>

              {/* Card 3: Brakes & Diagnostics */}
              <div
                onClick={() => setActiveServiceTab('repair')}
                className={`p-5 rounded-3xl cursor-pointer transition-all ${
                  activeServiceTab === 'repair'
                    ? 'bg-gradient-to-br from-[#FF6A3D] to-[#FF5C28] text-white shadow-lg shadow-orange-500/30'
                    : 'bg-[#1C2337] hover:bg-[#232C44] text-[#E2E8F0]'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                  activeServiceTab === 'repair' ? 'bg-white/20 text-white' : 'bg-white/5 text-[#FF6A3D]'
                }`}>
                  <Disc className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm mb-1.5">Brakes & Diagnostics</h4>
                <p className={`text-[11px] leading-relaxed ${
                  activeServiceTab === 'repair' ? 'text-white/90' : 'text-[#8A95AC]'
                }`}>
                  Brembo pad & disc replacement, electronic handbrake reset & OBD-II ECU scans.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ===================== SECTION: HOW IT WORKS ===================== */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#FF5C28] font-black mb-1 block">
            Simple & Transparent
          </span>
          <h2 className="text-3xl font-extrabold text-[#131722] tracking-tight">
            How WrenchMobile Works
          </h2>
          <p className="text-xs sm:text-sm text-[#7E8597] mt-1">
            In 3 effortless steps, get your vehicle sorted without leaving home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl border border-[#EDE7DF] p-6 shadow-sm flex flex-col relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-[#FF5C28] bg-[#FFF0EB] px-3 py-1 rounded-full">
                Step 01
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#FBF9F6] border border-[#EDE7DF] flex items-center justify-center text-[#131722]">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-[#131722] mb-1.5">Select your vehicle & issue</h3>
            <p className="text-xs text-[#7E8597] leading-relaxed">
              Enter your vehicle registration or make/model and choose the required service or symptoms (non-starter, flat battery, worn brakes).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl border border-[#EDE7DF] p-6 shadow-sm flex flex-col relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-[#FF5C28] bg-[#FFF0EB] px-3 py-1 rounded-full">
                Step 02
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF5C28] flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-[#131722] mb-1.5">Mechanic dispatched</h3>
            <p className="text-xs text-[#7E8597] leading-relaxed">
              The nearest IMI-certified mobile technician accepts your request and drives directly to your London postcode in a fully equipped van.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl border border-[#EDE7DF] p-6 shadow-sm flex flex-col relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-[#FF5C28] bg-[#FFF0EB] px-3 py-1 rounded-full">
                Step 03
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-[#131722] mb-1.5">Repaired on site</h3>
            <p className="text-xs text-[#7E8597] leading-relaxed">
              Work is executed with OEM-spec parts. Review the diagnostic report and pay securely in GBP (£) with an automated VAT receipt.
            </p>
          </div>

        </div>
      </section>

      {/* ===================== SECTION: WORKSHOP EQUIPMENT & GUARANTEE BANNER ===================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#171D2D] to-[#111625] text-white rounded-3xl sm:rounded-[36px] p-8 sm:p-10 border border-[#242E46] relative overflow-hidden shadow-xl">
          <div className="max-w-xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7D54] bg-white/10 px-3 py-1 rounded-full">
              Full Workshop Equipment & Guarantee
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
              A comprehensive mobile garage right outside your door.
            </h3>
            <p className="text-[#94A0B8] text-xs sm:text-sm mt-2 leading-relaxed">
              Our intervention vans are fitted with official OBD-II diagnostic equipment, high-lift hydraulic jacks and precision torque tools. Every repair is backed by a 12-month or 12,000-mile warranty.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/app/request"
                onClick={() => setCurrentRole('customer')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6A3D] to-[#FF5C28] hover:from-[#f05a2b] hover:to-[#e64c17] text-white font-bold py-3.5 px-7 rounded-full text-xs shadow-md shadow-orange-500/25 transition-all"
              >
                <span>Book Your Mobile Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER & SUPPORTED LONDON BOROUGHS ===================== */}
      <footer className="px-4 sm:px-6 lg:px-8 pt-12 pb-16 max-w-7xl mx-auto w-full text-center border-t border-[#EDE7DF] mt-10">
        <p className="text-xs font-bold text-[#8C93A4] uppercase tracking-wider mb-4">
          London Boroughs & Areas Covered
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-8">
          {LONDON_AREAS.map((area) => (
            <span
              key={area.name}
              className="text-xs px-3.5 py-1.5 bg-white border border-[#EDE7DF] text-[#131722] rounded-full font-semibold shadow-2xs flex items-center gap-1.5"
            >
              <MapPin className="w-3 h-3 text-[#FF5C28] shrink-0" />
              <span>{area.name}, London</span>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#7E8597] font-medium mb-4">
          <Link href="/app" onClick={() => setCurrentRole('customer')} className="hover:text-[#FF5C28]">Customer Portal</Link>
          <Link href="/mechanic" onClick={() => setCurrentRole('mechanic')} className="hover:text-[#FF5C28]">Mechanic Portal</Link>
          <Link href="/admin" onClick={() => setCurrentRole('admin')} className="hover:text-[#FF5C28]">Admin Dashboard</Link>
        </div>

        <p className="text-xs text-[#9AA1B2]">
          © {new Date().getFullYear()} WrenchMobile London Ltd. All rights reserved. Registered in England & Wales.
        </p>
      </footer>

    </div>
  );
}
