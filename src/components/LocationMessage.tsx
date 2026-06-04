import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Leaflet bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationMessageProps {
  lat: number;
  lng: number;
}

export default function LocationMessage({ lat, lng }: LocationMessageProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
    }).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    L.marker([lat, lng]).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng]);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: { 'Accept-Language': navigator.language || 'en' },
    })
      .then(r => r.json())
      .then(d => { if (!cancelled) setAddress(d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`); })
      .catch(() => { if (!cancelled) setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); });
    return () => { cancelled = true; };
  }, [lat, lng]);

  const openExternalMap = () => {
    const ua = navigator.userAgent;
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(ua);
    const url = isApple
      ? `https://maps.apple.com/?ll=${lat},${lng}&q=${lat},${lng}`
      : `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-[240px] rounded-xl overflow-hidden border border-border bg-card/60">
      <div
        ref={mapRef}
        onClick={openExternalMap}
        className="w-full h-[140px] cursor-pointer"
        style={{ background: 'hsl(var(--secondary))' }}
      />
      <button
        onClick={openExternalMap}
        className="w-full px-2.5 py-1.5 text-[11px] text-left text-muted-foreground hover:text-foreground transition-colors line-clamp-2"
        title={address}
      >
        📍 {address || '...'}
      </button>
    </div>
  );
}
