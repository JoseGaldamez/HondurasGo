import React, { useState, useEffect } from 'react';
import { Destination, VisitRecord } from '../types';
import { 
  X, 
  Star, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Award, 
  Users, 
  Trash2, 
  Check, 
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VisitModalProps {
  destination: Destination;
  existingVisit?: VisitRecord;
  isOpen: boolean;
  onClose: () => void;
  onSaveVisit: (visit: VisitRecord) => void;
  onDeleteVisit?: (destinationId: string) => void;
}

const STAMP_COLORS = [
  { label: 'Azul Maya', hex: '#0284c7' },
  { label: 'Verde Selva', hex: '#059669' },
  { label: 'Dorado Lenca', hex: '#d97706' },
  { label: 'Rojo Carmesí', hex: '#dc2626' },
  { label: 'Orquídea', hex: '#7c3aed' },
  { label: 'Café Copán', hex: '#78350f' }
];

export const VisitModal: React.FC<VisitModalProps> = ({
  destination,
  existingVisit,
  isOpen,
  onClose,
  onSaveVisit,
  onDeleteVisit
}) => {
  const [rating, setRating] = useState<number>(existingVisit ? existingVisit.rating : 5);
  const [visitedAt, setVisitedAt] = useState<string>(
    existingVisit 
      ? existingVisit.visitedAt.slice(0, 10) 
      : new Date().toISOString().slice(0, 10)
  );
  const [review, setReview] = useState<string>(existingVisit ? existingVisit.review : '');
  const [favoriteMemory, setFavoriteMemory] = useState<string>(existingVisit?.favoriteMemory || '');
  const [visitedWith, setVisitedWith] = useState<'Solo' | 'En Pareja' | 'Familia' | 'Con Aleros'>(
    existingVisit?.visitedWith || 'Con Aleros'
  );
  const [stampColor, setStampColor] = useState<string>(existingVisit?.stampColor || '#0284c7');
  const [stampShape, setStampShape] = useState<'circular' | 'round-rect' | 'shield'>(
    existingVisit?.stampShape || 'circular'
  );
  const [isStamping, setIsStamping] = useState(false);

  useEffect(() => {
    if (existingVisit) {
      setRating(existingVisit.rating);
      setVisitedAt(existingVisit.visitedAt.slice(0, 10));
      setReview(existingVisit.review);
      setFavoriteMemory(existingVisit.favoriteMemory || '');
      setVisitedWith(existingVisit.visitedWith);
      setStampColor(existingVisit.stampColor);
      setStampShape(existingVisit.stampShape);
    } else {
      setRating(5);
      setVisitedAt(new Date().toISOString().slice(0, 10));
      setReview('');
      setFavoriteMemory('');
      setVisitedWith('Con Aleros');
      setStampColor('#0284c7');
      setStampShape('circular');
    }
  }, [existingVisit, destination, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStamping(true);

    const record: VisitRecord = {
      id: existingVisit ? existingVisit.id : `visit-${Date.now()}`,
      destinationId: destination.id,
      destinationName: destination.name,
      department: destination.department,
      category: destination.category,
      visitedAt: new Date(visitedAt).toISOString(),
      rating,
      review: review.trim() || '¡Una experiencia inolvidable en este paraíso catracho!',
      favoriteMemory: favoriteMemory.trim(),
      visitedWith,
      stampColor,
      stampShape
    };

    // Confetti celebration for the stamp
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      onSaveVisit(record);
      setIsStamping(false);
      onClose();
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 sm:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              <img src={destination.imageUrl} alt={destination.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                {destination.department} · {destination.category}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight font-display">
                {existingVisit ? 'Modificar Sello y Reseña' : 'Estampar Visita en Pasaporte'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Target destination badge summary */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">{destination.name}</span>
            <span className="text-slate-500">{destination.category}</span>
          </div>

          {/* Rating Stars (large touchable targets) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tu Calificación del Destino (1 - 5 Estrellas)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-amber-400 hover:scale-110 active:scale-95 transition-transform"
                >
                  <Star 
                    className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} 
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">
                {rating === 5 ? '¡Excelente! (5.0)' : rating === 4 ? 'Muy Bueno (4.0)' : rating === 3 ? 'Bueno (3.0)' : 'Regular'}
              </span>
            </div>
          </div>

          {/* Visit Date & Companions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Fecha del Viaje
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={visitedAt}
                  onChange={e => setVisitedAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ¿Con quién fuiste?
              </label>
              <select
                value={visitedWith}
                onChange={e => setVisitedWith(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
              >
                <option value="Con Aleros">Con Aleros (Amigos)</option>
                <option value="En Pareja">En Pareja</option>
                <option value="Familia">En Familia</option>
                <option value="Solo">Solo (Aventura propia)</option>
              </select>
            </div>
          </div>

          {/* Review & Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tu Reseña y Comentario del Viaje
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="¿Qué tal estuvo la comida, los caminos, la hospitalidad de la gente? Deja tus impresiones..."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400"
              required
            />
          </div>

          {/* Favorite Memory */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Momento o Anécdota Favorita (Opcional)
            </label>
            <input
              type="text"
              value={favoriteMemory}
              onChange={e => setFavoriteMemory(e.target.value)}
              placeholder="Ej. Probar la baleada con aguacate en el pueblo, ver el atardecer..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Virtual Passport Stamp Customizer */}
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
              Personaliza el Sello de tu Pasaporte
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">Color de tinta:</span>
              <div className="flex items-center gap-2">
                {STAMP_COLORS.map(c => (
                  <button
                    type="button"
                    key={c.hex}
                    onClick={() => setStampColor(c.hex)}
                    title={c.label}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                      stampColor === c.hex ? 'scale-125 ring-2 ring-offset-2 ring-sky-500' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {stampColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Stamp Preview */}
            <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">VISTA PREVIA DEL SELLO</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {destination.department} · {new Date(visitedAt).toLocaleDateString('es-HN')}
                </span>
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-white text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5"
                style={{ backgroundColor: stampColor }}
              >
                <Award className="w-3.5 h-3.5" />
                <span>VISITADO HN</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            {existingVisit && onDeleteVisit && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Deseas eliminar este sello de tu pasaporte?')) {
                    onDeleteVisit(destination.id);
                    onClose();
                  }
                }}
                className="p-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-rose-200 dark:border-rose-900"
                title="Eliminar Sello"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isStamping}
              className="flex-2 py-3 px-5 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 active:scale-[0.98] rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{existingVisit ? 'Guardar Cambios' : '¡Estampar en mi Pasaporte!'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
