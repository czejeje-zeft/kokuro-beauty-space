import { useEffect, useRef, useState } from 'react';

// Dynamically import Leaflet (avoid SSR issues)
let L;

const PONTIANAK = [-0.0227, 109.3324]; // Default center: Pontianak

async function getLeaflet() {
  if (L) return L;
  const leaflet = await import('leaflet');
  L = leaflet.default ?? leaflet;

  // Fix broken marker icons when using bundlers
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  return L;
}

// Reverse geocode via Nominatim (free, no API key)
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`,
      { headers: { 'Accept-Language': 'id' } }
    );
    const data = await res.json();
    return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

/**
 * MapPicker — Leaflet map embeddable in booking form
 * Props:
 *  - onAddressChange(address: string, coords: {lat, lng}) → callback when pin moves
 *  - initialAddress: string
 */
export default function MapPicker({ onAddressChange, initialAddress }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markerRef    = useRef(null);

  const [loading,  setLoading]  = useState(false);
  const [geoError, setGeoError] = useState('');
  const [address,  setAddress]  = useState(initialAddress ?? '');
  const [geocoding, setGeocoding] = useState(false);

  // Mount Leaflet map once
  useEffect(() => {
    let map;
    let mounted = true;

    (async () => {
      const Leaflet = await getLeaflet();
      if (!mounted || !containerRef.current) return;
      if (mapRef.current) return; // already mounted

      // Import Leaflet CSS dynamically
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      map = Leaflet.map(containerRef.current, {
        center: PONTIANAK,
        zoom: 14,
        zoomControl: true,
      });

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Initial marker at Pontianak center
      const marker = Leaflet.marker(PONTIANAK, { draggable: true }).addTo(map);
      marker.bindPopup('📍 Tarik pin ke lokasi Anda').openPopup();

      // On drag end → reverse geocode
      marker.on('dragend', async () => {
        const { lat, lng } = marker.getLatLng();
        setGeocoding(true);
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
        onAddressChange(addr, { lat, lng });
        setGeocoding(false);
        marker.bindPopup(`📍 ${addr}`).openPopup();
      });

      // Click on map → move marker
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setGeocoding(true);
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
        onAddressChange(addr, { lat, lng });
        setGeocoding(false);
        marker.bindPopup(`📍 ${addr}`).openPopup();
      });

      mapRef.current    = map;
      markerRef.current = marker;
    })();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current    = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Detect current location via browser Geolocation API
  function detectLocation() {
    if (!navigator.geolocation) {
      setGeoError('Browser tidak mendukung geolocation.');
      return;
    }
    setLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([lat, lng], 17);
          markerRef.current.setLatLng([lat, lng]);
          setGeocoding(true);
          const addr = await reverseGeocode(lat, lng);
          setAddress(addr);
          onAddressChange(addr, { lat, lng });
          setGeocoding(false);
          markerRef.current.bindPopup(`📍 ${addr}`).openPopup();
        }
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) setGeoError('Izin lokasi ditolak. Aktifkan di pengaturan browser.');
        else setGeoError('Gagal mendapatkan lokasi. Coba geser pin secara manual.');
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
    );
  }

  return (
    <div className="map-picker-wrap">
      {/* Toolbar */}
      <div className="map-picker-toolbar">
        <button type="button" className="map-detect-btn" onClick={detectLocation} disabled={loading}>
          {loading
            ? <><span className="map-spinner" /> Mendeteksi lokasi...</>
            : <>📍 Gunakan Lokasi Saya</>}
        </button>
        <span className="map-hint">atau geser pin / klik titik di peta</span>
      </div>

      {/* Error */}
      {geoError && <div className="map-error">⚠️ {geoError}</div>}

      {/* Map Container */}
      <div ref={containerRef} className="map-container" />

      {/* Address Preview */}
      <div className="map-address-preview">
        <span className="map-address-icon">📍</span>
        <span className="map-address-text">
          {geocoding
            ? 'Mencari alamat...'
            : address || 'Geser pin atau klik peta untuk memilih lokasi'}
        </span>
      </div>
    </div>
  );
}
