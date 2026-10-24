export type Region = 
  | 'Caribe & Islas'
  | 'Occidente Maya & Colonial'
  | 'Centro & Valles'
  | 'Norte & Aventura'
  | 'Sur & Golfo de Fonseca'
  | 'Oriente & Biosfera';

export type Category = 
  | 'Destacados'
  | 'Arqueológicos'
  | 'Sol y arena'
  | 'Cabañas en el bosque';


export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  name: string;
  department: string;
  region: Region;
  category: Category;
  imageUrl: string;
  description: string;
  highlights: string[];
  coordinates: Coordinates;
  svgBadge: string;
  gradient: string;
  bestTimeToVisit: string;
  travelTips: string;
  altitude?: string;
  climate?: string;
  estimatedCost?: string;
}

export interface VisitRecord {
  id: string;
  destinationId: string;
  destinationName: string;
  department: string;
  category: Category;
  visitedAt: string; // ISO string
  rating: number; // 1-5
  review: string;
  favoriteMemory?: string;
  visitedWith: 'Solo' | 'En Pareja' | 'Familia' | 'Con Aleros';
  stampColor: string; // hex
  stampShape: 'circular' | 'round-rect' | 'shield';
  photoUrl?: string; // base64 or placeholder
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requirementDescription: string;
  theme: 'region' | 'category' | 'count' | 'milestone';
  targetKey: string;
  targetCount: number;
  tier: 'Bronce' | 'Plata' | 'Oro' | 'Diamante Maya';
  color: string;
}

export interface UserPassport {
  travelerName: string;
  travelerTitle: string;
  passportNumber: string;
  nationality: string;
  issueDate: string;
  avatarUrl?: string;
  motto: string;
}
