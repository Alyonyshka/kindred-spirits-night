import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Globe, Clock } from 'lucide-react';
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

interface EventVenueProps {
  lat?: number | null;
  lng?: number | null;
  address?: string;
  website?: string;
  phone?: string;
  hours?: string;
}

export default function EventVenue({ lat, lng, address, website, phone, hours }: EventVenueProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current || lat == null || lng == null) return;
    const map = L.map(ref.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
    }).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker([lat, lng]).addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 50);
    return () => { map.remove(); mapRef.current = null; };
  }, [lat, lng]);

  const openMap = () => {
    if (lat == null || lng == null) return;
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    const url = isApple
      ? `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(address || `${lat},${lng}`)}`
      : `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasMap = lat != null && lng != null;
  const hasAny = hasMap || website || phone || hours || address;
  if (!hasAny) return null;

  const normalizedWebsite = website
    ? (website.startsWith('http') ? website : `https://${website}`)
    : '';

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-secondary/20">
      {hasMap && (
        <div
          ref={ref}
          onClick={openMap}
          className="w-full h-[140px] cursor-pointer"
          style={{ background: 'hsl(var(--secondary))' }}
          role="button"
          aria-label="Open in maps"
        />
      )}
      <div className="p-3 space-y-1.5 text-xs">
        {address && (
          <button
            onClick={openMap}
            disabled={!hasMap}
            className="flex items-start gap-2 text-left w-full text-foreground hover:text-primary transition-colors disabled:cursor-default"
          >
            <MapPin size={13} className="text-primary mt-0.5 shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </button>
        )}
        {hours && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <Clock size={13} className="mt-0.5 shrink-0" />
            <span>{hours}</span>
          </div>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Phone size={13} className="shrink-0" />
            <span>{phone}</span>
          </a>
        )}
        {normalizedWebsite && (
          <a
            href={normalizedWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors truncate"
          >
            <Globe size={13} className="shrink-0" />
            <span className="truncate">{website}</span>
          </a>
        )}
      </div>
    </div>
  );
}
