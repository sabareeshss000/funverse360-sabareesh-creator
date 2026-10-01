import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import BookingPassModal from '../components/BookingPassModal';
import {
  MapPin,
  Layers,
  Compass,
  Clock,
  Ticket,
  Navigation,
  Sparkles,
  Flame,
  Info
} from 'lucide-react';

// Center coordinates for FUNVERSE 360 Park
const PARK_CENTER = [12.9720, 77.5945];

// Custom HTML DivIcon creator for Leaflet
const createCustomIcon = (emoji, color = '#7C3AED', badge = '') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        background: #131838;
        border: 2px solid ${color};
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 0 14px ${color}88;
        cursor: pointer;
      ">
        ${emoji}
        ${badge ? `<div style="position: absolute; top: -6px; right: -6px; background: ${badge}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #131838;"></div>` : ''}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const SmartMapPage = () => {
  const location = useLocation();
  const plannedItinerary = location.state?.plannedItinerary || [];

  const [mapMarkers, setMapMarkers] = useState([]);
  const [activeLayer, setActiveLayer] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const fetchMapPoints = async () => {
      try {
        setLoading(true);
        const [ridesRes, foodRes, gamesRes, eventsRes] = await Promise.all([
          api.get('/rides'),
          api.get('/food'),
          api.get('/games'),
          api.get('/events')
        ]);

        const markers = [
          ...ridesRes.data.map(r => ({
            id: r._id,
            name: r.name,
            type: 'RIDE',
            emoji: '🎢',
            color: '#EC4899',
            badge: r.estimatedWait > 20 ? '#EF4444' : '#22C55E',
            lat: r.location?.lat || 12.9718,
            lng: r.location?.lng || 77.5935,
            zone: r.location?.zone || 'Zone A - Thrill Peaks',
            price: r.price,
            wait: `${r.estimatedWait}m wait`,
            desc: r.description
          })),
          ...foodRes.data.slice(0, 8).map(f => ({
            id: f._id,
            name: f.name,
            type: 'FOOD',
            emoji: '🍔',
            color: '#FACC15',
            badge: f.demandLevel === 'HIGH' ? '#EF4444' : '#22C55E',
            lat: f.location?.lat || 12.9716,
            lng: f.location?.lng || 77.5946,
            zone: f.location?.zone || 'Zone B - Flavor Hub',
            price: f.price,
            wait: `${f.preparationTime}m prep`,
            desc: f.description
          })),
          ...gamesRes.data.slice(0, 6).map(g => ({
            id: g._id,
            name: g.name,
            type: 'GAME',
            emoji: '🎮',
            color: '#06B6D4',
            badge: '#22C55E',
            lat: g.location?.lat || 12.9720,
            lng: g.location?.lng || 77.5950,
            zone: g.location?.zone || 'Zone C - Arcade Galaxy',
            price: g.price,
            wait: `High: ${g.highScore}`,
            desc: g.description
          })),
          ...eventsRes.data.slice(0, 4).map(e => ({
            id: e._id,
            name: e.title,
            type: 'EVENT',
            emoji: '🎤',
            color: '#7C3AED',
            badge: e.status === 'LIVE' ? '#EF4444' : '#FACC15',
            lat: e.location?.lat || 12.9730,
            lng: e.location?.lng || 77.5960,
            zone: e.location?.zone || 'Zone D - Festival Grounds',
            price: e.price,
            wait: e.startTime,
            desc: e.description
          })),
          // Park Essentials
          {
            id: 'restroom-1',
            name: 'Central Restrooms & Lockers',
            type: 'ESSENTIAL',
            emoji: '🚻',
            color: '#3B82F6',
            badge: '',
            lat: 12.9719,
            lng: 77.5942,
            zone: 'Amusement Hub',
            price: 0,
            wait: 'Clean • Free',
            desc: 'Restrooms, luggage lockers, and hydration fountain station.'
          },
          {
            id: 'firstaid-1',
            name: 'Medical & First Aid Center',
            type: 'ESSENTIAL',
            emoji: '🚑',
            color: '#EF4444',
            badge: '',
            lat: 12.9724,
            lng: 77.5936,
            zone: 'Zone A Entrance',
            price: 0,
            wait: '24/7 Paramedics',
            desc: 'On-duty emergency medical staff and paramedic assistance.'
          }
        ];

        setMapMarkers(markers);
      } catch (err) {
        console.error('[MAP MARKER FETCH ERROR]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMapPoints();
  }, []);

  const filteredMarkers = activeLayer === 'ALL'
    ? mapMarkers
    : mapMarkers.filter(m => m.type === activeLayer);

  // Generate route line coordinates from itinerary if passed
  const routePoints = plannedItinerary
    .map(item => {
      const match = mapMarkers.find(m => m.name === item.name);
      return match ? [match.lat, match.lng] : null;
    })
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 animate-spin" />
            <span>Interactive 360 Geo-Navigation</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Smart Park Map & Heatmap
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Navigate between roller coasters, food court stalls, arcade zones, first aid, and planned itinerary routes.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Low Crowd
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Moderate
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High Crowd
          </span>
        </div>
      </div>

      {/* Layer Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-400 font-bold mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Filters:
        </span>
        {[
          { label: 'All Locations', value: 'ALL' },
          { label: '🎢 Rides', value: 'RIDE' },
          { label: '🍔 Food Stalls', value: 'FOOD' },
          { label: '🎮 Games & VR', value: 'GAME' },
          { label: '🎤 Live Events', value: 'EVENT' },
          { label: '🚻 Services & Aid', value: 'ESSENTIAL' }
        ].map((layer) => (
          <button
            key={layer.value}
            onClick={() => setActiveLayer(layer.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeLayer === layer.value
                ? 'bg-cyan-600 text-white shadow-neon-cyan'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Planned Itinerary Banner (if redirected from Fun Planner) */}
      {plannedItinerary.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="font-gaming font-extrabold text-white text-sm">
                Active Itinerary Journey: {plannedItinerary.length} Stops Connected!
              </div>
              <div className="text-xs text-slate-300">
                Following pink route line on map: {plannedItinerary.map(i => i.name).join(' ➔ ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 h-[560px] relative shadow-2xl">
        <MapContainer
          center={PARK_CENTER}
          zoom={16}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Planned Itinerary Route Polyline */}
          {routePoints.length > 1 && (
            <Polyline
              positions={routePoints}
              pathOptions={{ color: '#EC4899', weight: 5, dashArray: '8, 8', opacity: 0.9 }}
            />
          )}

          {/* Markers */}
          {filteredMarkers.map((m) => (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={createCustomIcon(m.emoji, m.color, m.badge)}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-pink-400 uppercase mb-1">
                    <span>{m.emoji}</span>
                    <span>{m.type}</span>
                  </div>
                  <h4 className="font-gaming font-extrabold text-sm text-white mb-1">
                    {m.name}
                  </h4>
                  <p className="text-[11px] text-slate-300 mb-2">
                    {m.desc}
                  </p>
                  <div className="flex justify-between items-center text-xs py-1.5 border-t border-white/10 mb-2">
                    <span className="text-yellow-400 font-bold">{m.price === 0 ? 'FREE' : `₹${m.price}`}</span>
                    <span className="text-cyan-400 font-semibold">{m.wait}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2">
                    📍 {m.zone}
                  </div>
                  <button
                    onClick={() => alert(`Navigating to ${m.name} in ${m.zone}!`)}
                    className="w-full py-1.5 rounded-lg font-bold text-[11px] bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    GO HERE
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* QR Modal if needed */}
      {confirmedBooking && (
        <BookingPassModal booking={confirmedBooking} onClose={() => setConfirmedBooking(null)} />
      )}
    </div>
  );
};

export default SmartMapPage;
