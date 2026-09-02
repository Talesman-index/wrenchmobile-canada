'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MapComponentProps {
  customerCoords: { lat: number; lng: number };
  mechanicCoords?: { lat: number; lng: number };
  address?: string;
  zoom?: number;
  height?: string;
  interactive?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function MapComponent({
  customerCoords,
  mechanicCoords,
  address,
  zoom = 14,
  height = '240px',
  interactive = true,
  onLocationChange,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;

        // Leaflet CSS via CDN link if not loaded
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!isMounted || !mapRef.current) return;

        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }

        const map = L.map(mapRef.current, {
          center: [customerCoords.lat, customerCoords.lng],
          zoom,
          zoomControl: interactive,
          dragging: interactive,
          touchZoom: interactive,
          scrollWheelZoom: false,
        });

        leafletMapRef.current = map;

        // Dark carto / openstreetmap tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CartoDB &copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        // Custom Customer Marker
        const customerIcon = L.divIcon({
          className: 'custom-customer-pin',
          html: `<div style="background-color: #0284c7; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(2,132,199,0.5);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="#ffffff"/></svg>
          </div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const customerMarker = L.marker([customerCoords.lat, customerCoords.lng], {
          icon: customerIcon,
          draggable: Boolean(onLocationChange),
        }).addTo(map);

        if (address) {
          customerMarker.bindPopup(`<b>Your Vehicle</b><br/>${address}`);
        }

        if (onLocationChange) {
          customerMarker.on('dragend', (e: any) => {
            const position = e.target.getLatLng();
            onLocationChange(position.lat, position.lng);
          });

          map.on('click', (e: any) => {
            customerMarker.setLatLng(e.latlng);
            onLocationChange(e.latlng.lat, e.latlng.lng);
          });
        }

        // Mechanic Marker if available
        if (mechanicCoords) {
          const mechanicIcon = L.divIcon({
            className: 'custom-mechanic-pin',
            html: `<div style="background-color: #10b981; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(16,185,129,0.6); animation: bounce 1s infinite alternate;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const mechMarker = L.marker([mechanicCoords.lat, mechanicCoords.lng], {
            icon: mechanicIcon,
          }).addTo(map);
          mechMarker.bindPopup(`<b>Mobile Mechanic</b><br/>En route`);

          // Fit bounds to show both
          const group = L.featureGroup([customerMarker, mechMarker]);
          map.fitBounds(group.getBounds().pad(0.2));
        }
      } catch (err) {
        console.error('Error initializing Leaflet map:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isClient, customerCoords.lat, customerCoords.lng, mechanicCoords?.lat, mechanicCoords?.lng, address, zoom, interactive, onLocationChange]);

  if (!isClient) {
    return (
      <div
        className="w-full bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 text-xs border border-slate-800"
        style={{ height }}
      >
        Loading interactive map...
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
      <div ref={mapRef} style={{ height, width: '100%' }} className="z-0" />
      {onLocationChange && (
        <div className="absolute top-2 left-2 z-[400] bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] text-slate-300 shadow">
          📍 Drag marker or tap to adjust position
        </div>
      )}
    </div>
  );
}
