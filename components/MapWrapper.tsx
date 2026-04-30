'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
});

export default function MapWrapper({ 
  center, 
  onLocationSelect 
}: { 
  center: { lat: number; lon: number };
  onLocationSelect: (lat: number, lon: number) => void;
}) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-slate-200" style={{ zIndex: 0 }}>
      <MapComponent center={center} onLocationSelect={onLocationSelect} />
    </div>
  );
}
