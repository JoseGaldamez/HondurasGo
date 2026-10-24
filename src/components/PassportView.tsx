import React, { useState } from 'react';
import { UserPassport, VisitRecord, Destination } from '../types';
import { 
  Award, 
  MapPin, 
  Calendar, 
  Star, 
  Edit3, 
  Share2, 
  Check, 
  Plus, 
  Navigation, 
  Sparkles,
  Users,
  X
} from 'lucide-react';

interface PassportViewProps {
  passport: UserPassport;
  visits: VisitRecord[];
  destinations: Destination[];
  onUpdatePassport: (passport: UserPassport) => void;
  onOpenVisitModal: (dest: Destination) => void;
  onSelectVisit: (visit: VisitRecord) => void;
}

export const PassportView: React.FC<PassportViewProps> = ({
  passport,
  visits,
  destinations,
  onUpdatePassport,
  onOpenVisitModal,
  onSelectVisit
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [formData, setFormData] = useState<UserPassport>(passport);
  const [copiedShare, setCopiedShare] = useState(false);

  const destMap = new Map(destinations.map(d => [d.id, d]));
  const visitedDepartments = new Set(visits.map(v => v.department)).size;
  const averageRating = visits.length 
    ? (visits.reduce((acc, v) => acc + v.rating, 0) / visits.length).toFixed(1)
    : '5.0';

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePassport(formData);
    setIsEditingBio(false);
  };

  const handleShare = async () => {
    const text = `¡Tengo ${visits.length} sellos oficiales en mi Pasaporte Catracho en Explora Honduras! 🇭🇳✨`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. Clean Airbnb-Style Traveler Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Avatar and Traveler Details */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-xl sm:text-2xl shrink-0 shadow-inner">
              {passport.travelerName.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                  Pasaporte Catracho Oficial
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] font-mono text-slate-500">{passport.passportNumber}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight font-display">
                {passport.travelerName}
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                {passport.travelerTitle} · {passport.nationality}
              </p>

              {passport.motto && (
                <p className="text-xs italic text-slate-600 mt-1 font-medium">
                  "{passport.motto}"
                </p>
              )}
            </div>
          </div>

          {/* Quick Profile Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditingBio(true)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Perfil</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Stats Strip (Clean unboxed metrics) */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-slate-900 block tabular-nums">
              {visits.length} <span className="text-xs font-normal text-slate-400">/ {destinations.length}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Sellos Obtenidos</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-slate-900 block tabular-nums">
              {visitedDepartments} <span className="text-xs font-normal text-slate-400">/ 18</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Departamentos</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-amber-500 block tabular-nums">
              ★ {averageRating}
            </span>
            <span className="text-xs text-slate-500 font-medium">Calificación Media</span>
          </div>
        </div>
      </div>

      {/* 2. Visas and Stamped Places Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
              Sellos Visados en tu Pasaporte
            </h3>
            <p className="text-xs text-slate-500">
              Lugares que has explorado y registrado en Honduras
            </p>
          </div>

          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {visits.length} de {destinations.length} lugares
          </span>
        </div>

        {/* Visited Stamped Cards Grid (Clean Airbnb-style with real photo & stamp seal) */}
        {visits.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Tu pasaporte aún no tiene sellos</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Comienza a explorar Honduras y presiona "Registrar visita" en cualquier destino para recibir tu primer sello.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visits.map((visit) => {
              const dest = destMap.get(visit.destinationId);
              const imageUrl = dest?.imageUrl || '/images/roatan_west_bay.jpg';

              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Real Photo with Stamped Visa Badge Overlay */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl}
                      alt={visit.destinationName}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    {/* Official Stamp Ink Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-1.5">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: visit.stampColor || '#0284c7' }}
                      />
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                        Sello Oficial HN
                      </span>
                    </div>

                    {/* Bottom overlay: Location name & Date */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block">
                        {visit.department} · {new Date(visit.visitedAt).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold leading-tight drop-shadow-sm truncate">
                        {visit.destinationName}
                      </h4>
                    </div>
                  </div>

                  {/* Body: Rating, review & memory */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating and Companion */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < visit.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                            />
                          ))}
                          <span className="font-bold text-slate-800 ml-1.5">{visit.rating}.0</span>
                        </div>

                        <div className="flex items-center gap-1 text-slate-500 font-medium">
                          <Users className="w-3.5 h-3.5" />
                          <span>{visit.visitedWith}</span>
                        </div>
                      </div>

                      {/* Review text */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                        "{visit.review}"
                      </p>

                      {/* Favorite memory snippet */}
                      {visit.favoriteMemory && (
                        <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <strong className="text-slate-900">Recuerdo favorito:</strong> {visit.favoriteMemory}
                        </div>
                      )}
                    </div>

                    {/* Actions: Ver en el mapa / Editar */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => onSelectVisit(visit)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5 text-sky-600" />
                        <span>Ver en el mapa</span>
                      </button>

                      {dest && (
                        <button
                          onClick={() => onOpenVisitModal(dest)}
                          className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar sello</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Profile Modal (Clean and white) */}
      {isEditingBio && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsEditingBio(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Editar Perfil del Viajero</h3>
              <button 
                onClick={() => setIsEditingBio(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBio} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.travelerName}
                  onChange={e => setFormData({ ...formData, travelerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de Viajero</label>
                <input
                  type="text"
                  value={formData.travelerTitle}
                  onChange={e => setFormData({ ...formData, travelerTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nacionalidad / Origen</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lema Personal</label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={e => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBio(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
