import React from 'react';
import { Destination, VisitRecord } from '../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Star, 
  Award, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  Thermometer, 
  Mountain, 
  DollarSign, 
  Navigation
} from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination | null;
  visit?: VisitRecord;
  isOpen: boolean;
  onClose: () => void;
  onOpenVisitModal: (destination: Destination) => void;
  onViewOnMap: (destination: Destination) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  visit,
  isOpen,
  onClose,
  onOpenVisitModal,
  onViewOnMap
}) => {
  if (!isOpen || !destination) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-2xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 sm:hidden" />

        {/* Hero Header Banner */}
        <div className="relative h-48 sm:h-56 bg-slate-900 p-6 text-white flex flex-col justify-between overflow-hidden shrink-0">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

          {/* Top Row with Close & Status */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-semibold text-white">
                {destination.category}
              </span>
              {visit && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-xs font-bold flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Visitado</span>
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Region */}
          <div className="relative z-10">
            <span className="text-xs font-bold text-sky-200 uppercase tracking-wider block">
              {destination.department} · {destination.region}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-display drop-shadow-sm">
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Clima</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>{destination.climate}</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Altitud</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Mountain className="w-3.5 h-3.5 text-emerald-500" />
                <span>{destination.altitude}</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Mejor Época</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                <span>{destination.bestTimeToVisit}</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Costo Est.</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                <span>{destination.estimatedCost}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Acerca de este Destino
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Experiencias Inolvidables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {destination.highlights.map((highlight, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2"
                >
                  <span className="text-sky-500 font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips / Consejos de Viaje Catrachos */}
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-xs mb-1">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Consejo Práctico del Viajero</span>
            </div>
            <p className="text-xs text-sky-950 dark:text-sky-200 leading-relaxed">
              {destination.travelTips}
            </p>
          </div>

          {/* If the user already visited, show their personal memory */}
          {visit && (
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Tu Registro de Viaje
                </span>
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                  {new Date(visit.visitedAt).toLocaleDateString('es-HN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < visit.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">· Fuiste {visit.visitedWith}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                "{visit.review}"
              </p>

              {visit.favoriteMemory && (
                <div className="pt-1 text-[11px] text-amber-900 dark:text-amber-200">
                  <strong>Momento favorito:</strong> {visit.favoriteMemory}
                </div>
              )}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onViewOnMap(destination);
              }}
              className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-500" />
              <span>Ver en el Mapa</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenVisitModal(destination);
              }}
              className={`flex-1 py-3 px-5 text-xs font-bold text-white rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 ${
                visit
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
                  : 'bg-sky-600 hover:bg-sky-500 shadow-sky-900/20'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{visit ? 'Editar Sello y Reseña' : 'Estampar en mi Pasaporte'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
