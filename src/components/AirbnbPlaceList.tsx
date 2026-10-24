import React from 'react';
import { Destination, VisitRecord, Category } from '../types';
import { CATEGORIES } from '../data/destinations';
import { 
  MapPin, 
  CheckCircle2, 
  Navigation, 
  Sparkles, 
  Star,
  Award
} from 'lucide-react';

interface AirbnbPlaceListProps {
  destinations: Destination[];
  visits: VisitRecord[];
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  onViewLocation: (destination: Destination) => void;
  onRegisterVisit: (destination: Destination) => void;
  selectedDestinationId?: string | null;
}

export const AirbnbPlaceList: React.FC<AirbnbPlaceListProps> = ({
  destinations,
  visits,
  activeCategory,
  onSelectCategory,
  onViewLocation,
  onRegisterVisit,
  selectedDestinationId
}) => {
  const visitedMap = new Map<string, VisitRecord>();
  visits.forEach(v => visitedMap.set(v.destinationId, v));

  const filteredPlaces = destinations.filter(d => d.category === activeCategory);

  return (
    <div className="w-full space-y-6">
      {/* Category Navigation Bar (Clean Airbnb-style horizontal category icons/tabs) */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map(cat => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Clean Airbnb-style Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlaces.map(place => {
          const visit = visitedMap.get(place.id);
          const isVisited = !!visit;
          const isSelected = selectedDestinationId === place.id;

          return (
            <div
              key={place.id}
              className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 shadow-md ring-2 ring-sky-500/20'
                  : 'border-slate-200 hover:shadow-lg'
              }`}
            >
              {/* Simple Image with Fallback */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to high-contrast styled gradient container if network blocks image
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Visited Stamp Pill (clean indicator) */}
                {isVisited && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Visitado</span>
                  </div>
                )}
              </div>

              {/* Simple Card Body: Name and Department */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{place.department}</span>
                    <span>·</span>
                    <span>{place.region}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
                    {place.name}
                  </h3>

                  {isVisited && visit && (
                    <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{visit.rating}.0</span>
                      <span className="text-slate-400">· "{visit.review.slice(0, 38)}..."</span>
                    </div>
                  )}
                </div>

                {/* Exactly Two Buttons: "Ver ubicación" & "Registrar visita" */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onViewLocation(place)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ver ubicación</span>
                  </button>

                  <button
                    onClick={() => onRegisterVisit(place)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs ${
                      isVisited
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-sky-600 hover:bg-sky-500 text-white'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isVisited ? 'Editar visita' : 'Registrar visita'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
