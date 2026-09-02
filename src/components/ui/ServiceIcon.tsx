'use client';

import React from 'react';
import {
  Car,
  Wrench,
  Disc,
  Sparkles,
  Droplets,
  Zap,
  BatteryCharging,
  ShieldAlert,
  Cpu,
  AlertTriangle,
  Settings,
  ShieldCheck,
  Gauge,
  Key,
} from 'lucide-react';

export interface ServiceIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showContainer?: boolean;
}

export default function ServiceIcon({
  type,
  size = 'md',
  className = '',
  showContainer = true,
}: ServiceIconProps) {
  // Définition des dimensions selon la taille
  const containerSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const secondarySizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  // Contenu d'icône avec le style duo-ton signature (Violet Électrique #5e17eb + Accent Orange Vif #ff7a00)
  const renderIconContent = () => {
    switch (type) {
      case 'mechanic_repair':
      case 'general_repair':
        return (
          <div className="relative flex items-center justify-center">
            <Car className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <Wrench className={`${secondarySizes[size]} text-[#ff7a00] stroke-[2.5] absolute -bottom-1 -right-1`} />
          </div>
        );

      case 'bodywork_dent':
        return (
          <div className="relative flex items-center justify-center">
            <Disc className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <Sparkles className={`${secondarySizes[size]} text-[#ff7a00] absolute -top-0.5 -right-0.5`} />
          </div>
        );

      case 'oil_change':
        return (
          <div className="relative flex items-center justify-center">
            <Droplets className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#ff7a00] shadow-xs" />
          </div>
        );

      case 'car_wash':
        return (
          <div className="relative flex items-center justify-center">
            <Car className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <div className="absolute -top-1.5 flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]" />
              <span className="w-1 h-1 rounded-full bg-[#ff7a00]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]" />
            </div>
          </div>
        );

      case 'battery_jump':
        return (
          <div className="relative flex items-center justify-center">
            <Zap className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ff7a00] ring-1 ring-white" />
          </div>
        );

      case 'battery_replacement':
        return (
          <div className="relative flex items-center justify-center">
            <BatteryCharging className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-black text-[#ff7a00] leading-none">+</span>
          </div>
        );

      case 'flat_tire':
      case 'tire_puncture':
        return (
          <div className="relative flex items-center justify-center">
            <Disc className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <Sparkles className={`${secondarySizes[size]} text-[#ff7a00] absolute bottom-0 right-0`} />
          </div>
        );

      case 'brake_service':
        return (
          <div className="relative flex items-center justify-center">
            <ShieldAlert className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#ff7a00]" />
          </div>
        );

      case 'diagnostic_scan':
        return (
          <div className="relative flex items-center justify-center">
            <Cpu className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#ff7a00] animate-pulse" />
          </div>
        );

      case 'no_start':
        return (
          <div className="relative flex items-center justify-center">
            <AlertTriangle className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <Zap className={`${secondarySizes[size]} text-[#ff7a00] absolute -bottom-1 -right-1`} />
          </div>
        );

      case 'alternator_starter':
        return (
          <div className="relative flex items-center justify-center">
            <Wrench className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <Zap className={`${secondarySizes[size]} text-[#ff7a00] absolute -top-1 -right-1`} />
          </div>
        );

      default:
        return (
          <div className="relative flex items-center justify-center">
            <Settings className={`${iconSizes[size]} text-[#5e17eb] stroke-[2.2]`} />
            <Wrench className={`${secondarySizes[size]} text-[#ff7a00] absolute -bottom-1 -right-1`} />
          </div>
        );
    }
  };

  if (!showContainer) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderIconContent()}</div>;
  }

  return (
    <div
      className={`${containerSizes[size]} rounded-full bg-[#f8f9fd] group-hover:bg-[#f3ebff] border border-slate-100 group-hover:border-purple-200 flex items-center justify-center shrink-0 shadow-sm transition-all duration-200 group-hover:scale-105 ${className}`}
    >
      {renderIconContent()}
    </div>
  );
}
