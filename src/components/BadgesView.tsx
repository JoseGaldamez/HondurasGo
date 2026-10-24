import React, { useState } from 'react';
import { Badge, VisitRecord, Destination } from '../types';
import { calculateBadgesProgress } from '../services/storage';
import { 
  Award, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Waves, 
  Landmark, 
  Flame, 
  TreePine, 
  Mountain, 
  Crown, 
  Compass, 
  ArrowRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BadgesViewProps {
  visits: VisitRecord[];
  destinations: Destination[];
  onExploreTheme: (themeKey: string) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  visits,
  destinations,
  onExploreTheme
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  const badgeCalculations = calculateBadgesProgress(visits);
  const unlockedCount = badgeCalculations.filter(b => b.isUnlocked).length;

  const filteredBadges = badgeCalculations.filter(item => {
    if (filter === 'unlocked') return item.isUnlocked;
    if (filter === 'locked') return !item.isUnlocked;
    return true;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Waves': return <Waves className="w-6 h-6" />;
      case 'Landmark': return <Landmark className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'TreePine': return <TreePine className="w-6 h-6" />;
      case 'Mountain': return <Mountain className="w-6 h-6" />;
      case 'Crown': return <Crown className="w-6 h-6" />;
      case 'Compass': return <Compass className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const handleCelebrateBadge = (badgeItem: any) => {
    setSelectedBadge(badgeItem);
    if (badgeItem.isUnlocked) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Clean White Header Card (Airbnb Style) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Medallas de Honor Catrachas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
            Insignias & Reconocimientos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
            Completa recorridos regionales y temáticos por los destinos más emblemáticos de Honduras para desbloquear tus medallas.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">DESBLOQUEADAS</span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {unlockedCount} <span className="text-sm font-normal text-slate-400">/ {badgeCalculations.length}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todas ({badgeCalculations.length})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
            filter === 'unlocked'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Conseguidas ({unlockedCount})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
            filter === 'locked'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Por Conseguir ({badgeCalculations.length - unlockedCount})
        </button>
      </div>

      {/* Badges Grid (Clean White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map(({ badge, currentCount, targetCount, isUnlocked, progressPercent }) => {
          return (
            <div
              key={badge.id}
              onClick={() => handleCelebrateBadge({ badge, currentCount, targetCount, isUnlocked, progressPercent })}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-sm hover:shadow-md hover:scale-[1.02]'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                      isUnlocked
                        ? 'text-white shadow-sm'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                    style={isUnlocked ? { backgroundColor: badge.color } : {}}
                  >
                    {getIcon(badge.iconName)}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {badge.tier}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Progress & Requirement */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[130px]">
                    {badge.requirementDescription}
                  </span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {currentCount}/{targetCount}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: isUnlocked ? badge.color : '#94a3b8'
                    }}
                  />
                </div>

                {isUnlocked ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>¡Conseguida!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mt-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{targetCount - currentCount} visita(s) restante(s)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Badge Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: selectedBadge.badge.color }}
            >
              {getIcon(selectedBadge.badge.iconName)}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                {selectedBadge.badge.tier}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {selectedBadge.badge.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                {selectedBadge.badge.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Requisito Oficial
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {selectedBadge.badge.requirementDescription}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Progreso:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {selectedBadge.currentCount} de {selectedBadge.targetCount} ({selectedBadge.progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${selectedBadge.progressPercent}%`,
                    backgroundColor: selectedBadge.badge.color
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedBadge(null)}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                Cerrar
              </button>
              {!selectedBadge.isUnlocked && selectedBadge.badge.targetKey !== 'any' && (
                <button
                  onClick={() => {
                    const key = selectedBadge.badge.targetKey;
                    setSelectedBadge(null);
                    onExploreTheme(key);
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-sm transition-colors flex items-center justify-center gap-1"
                >
                  <span>Ver Lugares</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
