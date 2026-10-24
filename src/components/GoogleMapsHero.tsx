import React, { useState, useEffect, useRef } from 'react';
import { Destination, VisitRecord } from '../types';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap, 
  useMapsLibrary 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Locate, 
  Clock, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Sparkles,
  Compass,
  AlertCircle
} from 'lucide-react';

interface GoogleMapsHeroProps {
  destinations: Destination[];
  visits: VisitRecord[];
  selectedDestination: Destination | null;
  onSelectDestination: (dest: Destination) => void;
  onOpenVisitModal: (dest: Destination) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
}

// Inner route-drawing component using modern Routes library
function RouteRenderer({
  origin,
  destination,
  onRouteResult
}: {
  origin: { lat: number; lng: number } | null;
  destination: Destination | null;
  onRouteResult: (result: { distance: string; duration: string } | null) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const rendererRef = useRef<any | null>(null);

  useEffect(() => {
    if (!map || !routesLib) return;

    if (!rendererRef.current) {
      rendererRef.current = new routesLib.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#0284c7',
          strokeWeight: 5,
          strokeOpacity: 0.9
        }
      });
    }

    return () => {
      if (rendererRef.current) {
        rendererRef.current.setMap(null);
        rendererRef.current = null;
      }
    };
  }, [map, routesLib]);

  useEffect(() => {
    if (!map || !routesLib || !rendererRef.current) return;

    if (!origin || !destination) {
      rendererRef.current.setDirections({ routes: [] });
      onRouteResult(null);
      return;
    }

    const directionsService = new routesLib.DirectionsService();
    const travelMode = routesLib.TravelMode?.DRIVING || 'DRIVING';

    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.coordinates.lat, lng: destination.coordinates.lng },
        travelMode: travelMode as any
      },
      (response: any, status: any) => {
        if ((status === 'OK' || status === routesLib.DirectionsStatus?.OK) && response && rendererRef.current) {
          rendererRef.current.setDirections(response);
          const leg = response.routes?.[0]?.legs?.[0];
          if (leg) {
            onRouteResult({
              distance: leg.distance?.text || '',
              duration: leg.duration?.text || ''
            });
          }
        } else {
          console.warn('Google Maps Route status:', status);
          onRouteResult(null);
        }
      }
    );
  }, [map, routesLib, origin, destination]);

  return null;
}

// Recenter Map Helper
function MapRecenter({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && target) {
      map.panTo(target);
      map.setZoom(10);
    }
  }, [map, target]);
  return null;
}

export const GoogleMapsHero: React.FC<GoogleMapsHeroProps> = ({
  destinations,
  visits,
  selectedDestination,
  onSelectDestination,
  onOpenVisitModal,
  userLocation,
  setUserLocation
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  const visitedSet = new Set(visits.map(v => v.destinationId));

  // Geolocation trigger
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      err => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        // If user denied or outside, offer Tegucigalpa or San Pedro Sula preset
        setUserLocation({ lat: 14.072, lng: -87.192 }); // Tegucigalpa default
        setLocationError('No se pudo acceder a tu GPS. Se configuró tu ubicación en Tegucigalpa, Honduras.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleOpenGoogleMapsExternal = () => {
    if (!selectedDestination) return;
    const destCoords = `${selectedDestination.coordinates.lat},${selectedDestination.coordinates.lng}`;
    const originCoords = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const url = originCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${originCoords}&destination=${destCoords}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${destCoords}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-200">
      {/* Hero Map Container with explicit height */}
      <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px]">
        <APIProvider apiKey={apiKey} libraries={['routes', 'geometry']}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={{ lat: 15.0, lng: -86.5 }}
            defaultZoom={7.4}
            gestureHandling="greedy"
            disableDefaultUI={false}
            fullscreenControl={false}
            streetViewControl={false}
            style={{ width: '100%', height: '100%' }}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {/* Draw live route between user location and selected destination */}
            <RouteRenderer
              origin={userLocation}
              destination={selectedDestination}
              onRouteResult={setRouteInfo}
            />

            {/* Recenter helper */}
            <MapRecenter 
              target={selectedDestination ? { lat: selectedDestination.coordinates.lat, lng: selectedDestination.coordinates.lng } : null} 
            />

            {/* User GPS Location Marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation} title="Tu Ubicación Actual">
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-sky-500/30 animate-ping absolute" />
                  <div className="w-6 h-6 rounded-full bg-sky-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <Navigation className="w-3.5 h-3.5 fill-white rotate-45" />
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* All Destination Markers */}
            {destinations.map(dest => {
              const isVisited = visitedSet.has(dest.id);
              const isSelected = selectedDestination?.id === dest.id;

              return (
                <AdvancedMarker
                  key={dest.id}
                  position={{ lat: dest.coordinates.lat, lng: dest.coordinates.lng }}
                  onClick={() => onSelectDestination(dest)}
                  title={dest.name}
                >
                  <div className="group cursor-pointer flex flex-col items-center">
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white scale-110 ring-2 ring-sky-500'
                          : isVisited
                          ? 'bg-emerald-600 text-white hover:scale-105'
                          : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:scale-105'
                      }`}
                    >
                      {isVisited ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                      ) : (
                        <MapPin className="w-3 h-3 text-sky-600" />
                      )}
                      <span className="truncate max-w-[110px]">{dest.name}</span>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}
          </Map>
        </APIProvider>

        {/* Floating Top GPS Controls Bar (Clean Airbnb style) */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-slate-200 flex items-center gap-2 pointer-events-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">Mapa Turístico de Honduras</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="bg-white/95 hover:bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-md border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              title="Detectar mi ubicación actual"
            >
              <Locate className={`w-3.5 h-3.5 text-sky-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{userLocation ? 'Mi Ubicación Activa' : 'Mi Ubicación'}</span>
            </button>
          </div>
        </div>

        {/* Location alert if any */}
        {locationError && (
          <div className="absolute top-16 left-4 right-4 z-10 bg-amber-50/95 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs flex items-center justify-between shadow-sm">
            <span>{locationError}</span>
            <button onClick={() => setLocationError(null)} className="text-amber-700 hover:text-amber-900 ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Floating Route Information & Action Card (When a destination is selected) */}
        {selectedDestination && (
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/98 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 max-w-lg mx-auto animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block">
                  Ruta hacia {selectedDestination.department}
                </span>
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {selectedDestination.name}
                </h3>
              </div>

              <button
                onClick={() => onSelectDestination(null as any)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Route Distance & Travel Time Stats */}
            {userLocation ? (
              routeInfo ? (
                <div className="mt-3 p-2.5 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between text-xs text-sky-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    <span>Distancia: {routeInfo.distance}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Tiempo estimado: {routeInfo.duration}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                  <span>Calculando la mejor ruta por carretera...</span>
                </div>
              )
            ) : (
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                <span>Presiona "Mi Ubicación" para trazar la ruta en carretera</span>
                <button
                  onClick={handleDetectLocation}
                  className="text-sky-600 font-bold underline hover:text-sky-700 ml-2"
                >
                  Activar GPS
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={handleOpenGoogleMapsExternal}
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Navegar en Google Maps</span>
              </button>

              <button
                onClick={() => onOpenVisitModal(selectedDestination)}
                className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{visitedSet.has(selectedDestination.id) ? 'Editar Visita' : 'Registrar Visita'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
