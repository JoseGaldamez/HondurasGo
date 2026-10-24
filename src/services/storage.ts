import { VisitRecord, UserPassport, Badge } from '../types';
import { HONDURAS_BADGES } from '../data/badges';
import { HONDURAS_DESTINATIONS } from '../data/destinations';

const VISITS_STORAGE_KEY = 'explora_honduras_visits_v1';
const PASSPORT_STORAGE_KEY = 'explora_honduras_passport_v1';

const INITIAL_PASSPORT: UserPassport = {
  travelerName: 'Explorador Catracho',
  travelerTitle: 'Viajero Aventurero',
  passportNumber: 'HN-2026-CATRACHO',
  nationality: 'Hondureña (o visitante de corazón)',
  issueDate: '2026-01-15',
  motto: '¡Honduras en el corazón y en la mochila!',
  avatarUrl: ''
};

// Seed 2 realistic initial visits to give immediate delight on first load
const INITIAL_VISITS: VisitRecord[] = [
  {
    id: 'visit-init-1',
    destinationId: 'roatan-west-bay',
    destinationName: 'West Bay & Arrecife de Roatán',
    department: 'Islas de la Bahía',
    category: 'Destacados',
    visitedAt: '2026-03-12T14:30:00.000Z',
    rating: 5,
    review: 'El agua es tan clara que ves los peces y corales desde la orilla. El mejor atardecer de mi vida con una cerveza SalvaVida bien helada.',
    favoriteMemory: 'Hacer esnórquel junto a una tortuga carey a pocos metros de la playa.',
    visitedWith: 'Con Aleros',
    stampColor: '#0284c7',
    stampShape: 'circular'
  },
  {
    id: 'visit-init-2',
    destinationId: 'copan-ruinas',
    destinationName: 'Parque Arqueológico Copán Ruinas',
    department: 'Copán',
    category: 'Destacados',
    visitedAt: '2026-04-05T09:15:00.000Z',
    rating: 5,
    review: 'Imponente energía ancestral. Ver las guacamayas rojas volar sobre la Acrópolis y la Escalinata de Jeroglíficos te eriza la piel.',
    favoriteMemory: 'Aprender el significado del jeroglífico del rey 18 Conejo.',
    visitedWith: 'Familia',
    stampColor: '#d97706',
    stampShape: 'shield'
  }
];

export function getStoredVisits(): VisitRecord[] {
  try {
    const raw = localStorage.getItem(VISITS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(INITIAL_VISITS));
      return INITIAL_VISITS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading visits from storage:', e);
    return INITIAL_VISITS;
  }
}

export function saveVisit(visit: VisitRecord): VisitRecord[] {
  const current = getStoredVisits();
  // Check if already visited, replace or prepend
  const existsIndex = current.findIndex(v => v.destinationId === visit.destinationId);
  let updated: VisitRecord[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = visit;
  } else {
    updated = [visit, ...current];
  }
  localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeVisit(destinationId: string): VisitRecord[] {
  const current = getStoredVisits();
  const updated = current.filter(v => v.destinationId !== destinationId);
  localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getStoredPassport(): UserPassport {
  try {
    const raw = localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(INITIAL_PASSPORT));
      return INITIAL_PASSPORT;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PASSPORT;
  }
}

export function savePassport(passport: UserPassport): UserPassport {
  localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(passport));
  return passport;
}

export function resetToDemoData(): { visits: VisitRecord[]; passport: UserPassport } {
  localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(INITIAL_VISITS));
  localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(INITIAL_PASSPORT));
  return { visits: INITIAL_VISITS, passport: INITIAL_PASSPORT };
}

export function calculateBadgesProgress(visits: VisitRecord[]) {
  // Map destination lookups
  const destMap = new Map(HONDURAS_DESTINATIONS.map(d => [d.id, d]));

  return HONDURAS_BADGES.map(badge => {
    let currentCount = 0;

    if (badge.theme === 'count' || badge.theme === 'milestone') {
      currentCount = visits.length;
    } else if (badge.theme === 'region') {
      currentCount = visits.filter(v => {
        const dest = destMap.get(v.destinationId);
        return dest?.region === badge.targetKey;
      }).length;
    } else if (badge.theme === 'category') {
      currentCount = visits.filter(v => {
        const dest = destMap.get(v.destinationId);
        return dest?.category === badge.targetKey;
      }).length;
    }

    const isUnlocked = currentCount >= badge.targetCount;
    const progressPercent = Math.min(100, Math.round((currentCount / badge.targetCount) * 100));

    return {
      badge,
      currentCount,
      targetCount: badge.targetCount,
      isUnlocked,
      progressPercent
    };
  });
}
