import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Crosshair, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface PickedPlace {
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  website?: string;
  hours?: string;
}

interface LocationPickerProps {
  initial?: { lat: number; lng: number } | null;
  onSelect: (p: PickedPlace) => void;
  onClose: () => void;
}

const DEFAULT_CENTER: [number, number] = [50.4501, 30.5234]; // Kyiv

export default function LocationPicker({ initial, onSelect, onClose }: LocationPickerProps) {
  const { language } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(initial || null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [venueLoading, setVenueLoading] = useState(false);
  const [venue, setVenue] = useState<{ phone?: string; website?: string; hours?: string } | null>(null);

  // init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const center = initial ? [initial.lat, initial.lng] as [number, number] : DEFAULT_CENTER;
    const map = L.map(containerRef.current).setView(center, initial ? 16 : 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const setMarker = (lat: number, lng: number) => {
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current.on('dragend', () => {
        const { lat, lng } = markerRef.current!.getLatLng();
        handlePick(lat, lng);
      });
      setCoords({ lat, lng });
    };

    if (initial) setMarker(initial.lat, initial.lng);

    map.on('click', (e: L.LeafletMouseEvent) => {
      setMarker(e.latlng.lat, e.latlng.lng);
      handlePick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);

    return () => { map.remove(); mapRef.current = null; markerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePick = async (lat: number, lng: number) => {
    setLoading(true);
    setVenueLoading(true);
    setVenue(null);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': navigator.language || 'en' } }
      );
      const d = await r.json();
      setAddress(d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setLoading(false);
    }

    // Overpass: search for venues with tags within ~60m
    try {
      const radius = 60;
      const q = `[out:json][timeout:10];(
        node(around:${radius},${lat},${lng})[amenity~"bar|pub|restaurant|cafe|nightclub|biergarten"];
        way(around:${radius},${lat},${lng})[amenity~"bar|pub|restaurant|cafe|nightclub|biergarten"];
      );out tags center 5;`;
      const resp = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: 'data=' + encodeURIComponent(q),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = await resp.json();
      const el = (data?.elements || []).find((e: any) =>
        e.tags && (e.tags.phone || e.tags['contact:phone'] || e.tags.website || e.tags['contact:website'] || e.tags.opening_hours)
      );
      if (el?.tags) {
        const tags = el.tags;
        setVenue({
          phone: tags.phone || tags['contact:phone'],
          website: tags.website || tags['contact:website'] || tags['contact:instagram'],
          hours: tags.opening_hours,
        });
      }
    } catch {/* ignore */}
    finally { setVenueLoading(false); }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert(t('geoUnsupported', language));
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 17);
          if (markerRef.current) markerRef.current.setLatLng([latitude, longitude]);
          else {
            markerRef.current = L.marker([latitude, longitude], { draggable: true }).addTo(mapRef.current);
            markerRef.current.on('dragend', () => {
              const { lat, lng } = markerRef.current!.getLatLng();
              handlePick(lat, lng);
            });
          }
        }
        setCoords({ lat: latitude, lng: longitude });
        handlePick(latitude, longitude);
      },
      () => {
        setLoading(false);
        alert(t('geoDenied', language));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const confirm = () => {
    if (!coords) return;
    onSelect({ lat: coords.lat, lng: coords.lng, address, ...venue });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative glass-panel-strong w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold amber-glow text-sm">{t('pickLocation', language)}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent transition-colors"><X size={18} /></button>
        </div>

        <div className="relative">
          <div ref={containerRef} className="w-full h-[320px]" style={{ background: 'hsl(var(--secondary))' }} />
          <button
            onClick={handleGeolocate}
            className="absolute top-3 right-3 z-[400] p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            title={t('useMyLocation', language)}
          >
            <Crosshair size={16} />
          </button>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto">
          <div className="text-xs text-muted-foreground flex items-start gap-2">
            {loading ? <Loader2 size={14} className="animate-spin mt-0.5" /> : <Search size={14} className="mt-0.5" />}
            <span className="flex-1">{address || t('tapMapToPick', language)}</span>
          </div>
          {venueLoading && (
            <p className="text-[11px] text-primary/70 flex items-center gap-1.5">
              <Loader2 size={11} className="animate-spin" /> {t('searchingVenue', language)}
            </p>
          )}
          {venue && (venue.phone || venue.website || venue.hours) && (
            <div className="text-[11px] text-emerald-400 space-y-0.5">
              <p>✓ {t('venueAutoFilled', language)}</p>
              {venue.phone && <p className="text-muted-foreground">📞 {venue.phone}</p>}
              {venue.website && <p className="text-muted-foreground truncate">🔗 {venue.website}</p>}
              {venue.hours && <p className="text-muted-foreground">🕒 {venue.hours}</p>}
            </div>
          )}
          <button
            onClick={confirm}
            disabled={!coords || !address}
            className="w-full mt-2 py-2.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('confirmLocation', language)}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
