import { Badge } from '../types';

export const HONDURAS_BADGES: Badge[] = [
  {
    id: 'badge-primer-paso',
    title: 'Primer Sello Catracho',
    description: 'Registraste tu primera parada en territorio hondureño. ¡El viaje recién comienza!',
    iconName: 'Compass',
    requirementDescription: 'Registra al menos 1 visita',
    theme: 'count',
    targetKey: 'any',
    targetCount: 1,
    tier: 'Bronce',
    color: '#0284c7'
  },
  {
    id: 'badge-caribe-islas',
    title: 'Conquistador del Caribe',
    description: 'Exploraste las aguas turquesas y arrecifes de las Islas de la Bahía y el Mar Caribe.',
    iconName: 'Waves',
    requirementDescription: 'Visita al menos 2 destinos en Caribe & Islas',
    theme: 'region',
    targetKey: 'Caribe & Islas',
    targetCount: 2,
    tier: 'Plata',
    color: '#06b6d4'
  },
  {
    id: 'badge-maya-colonial',
    title: 'Guardián del Reino Maya',
    description: 'Caminaste por los templos sagrados de Copán y las calles adoquinadas del occidente.',
    iconName: 'Landmark',
    requirementDescription: 'Visita al menos 2 destinos en Occidente Maya & Colonial',
    theme: 'region',
    targetKey: 'Occidente Maya & Colonial',
    targetCount: 2,
    tier: 'Oro',
    color: '#d97706'
  },
  {
    id: 'badge-sol-arena',
    title: 'Sirena y Sol de Playa',
    description: 'Buceaste en arrecifes o te relajaste en las playas de aguas cristalinas de Honduras.',
    iconName: 'Waves',
    requirementDescription: 'Visita al menos 2 destinos de Sol y arena',
    theme: 'category',
    targetKey: 'Sol y arena',
    targetCount: 2,
    tier: 'Plata',
    color: '#06b6d4'
  },
  {
    id: 'badge-arqueologia-viva',
    title: 'Guardián Arqueológico',
    description: 'Descubriste la historia viva en templos mayas y fortalezas coloniales de piedra.',
    iconName: 'Landmark',
    requirementDescription: 'Visita al menos 2 destinos Arqueológicos',
    theme: 'category',
    targetKey: 'Arqueológicos',
    targetCount: 2,
    tier: 'Oro',
    color: '#d97706'
  },
  {
    id: 'badge-cabanas-bosque',
    title: 'Amante del Bosque & Cabañas',
    description: 'Te desconectaste en acogedoras cabañas rodeadas de senderos, neblina y pinos.',
    iconName: 'TreePine',
    requirementDescription: 'Visita al menos 2 destinos de Cabañas en el bosque',
    theme: 'category',
    targetKey: 'Cabañas en el bosque',
    targetCount: 2,
    tier: 'Plata',
    color: '#059669'
  },
  {
    id: 'badge-centro-valles',
    title: 'Caminante del Centro',
    description: 'Descubriste el corazón de Honduras entre cavernas milenarias y miradores de altura.',
    iconName: 'Mountain',
    requirementDescription: 'Visita al menos 2 destinos en Centro & Valles',
    theme: 'region',
    targetKey: 'Centro & Valles',
    targetCount: 2,
    tier: 'Bronce',
    color: '#6366f1'
  },
  {
    id: 'badge-maestro-viajero-5',
    title: 'Gran Viajero 5 Estrellas',
    description: 'Llevas 5 o más sellos en tu Pasaporte Catracho. Eres un verdadero embajador del país.',
    iconName: 'Award',
    requirementDescription: 'Completa 5 visitas en tu pasaporte',
    theme: 'count',
    targetKey: 'any',
    targetCount: 5,
    tier: 'Oro',
    color: '#f59e0b'
  },
  {
    id: 'badge-leyenda-honduras',
    title: 'Leyenda Catracha',
    description: '¡Hito extraordinario! Has recorrido más de 8 maravillas de Honduras de costa a costa.',
    iconName: 'Crown',
    requirementDescription: 'Completa 8 visitas en tu pasaporte',
    theme: 'milestone',
    targetKey: 'any',
    targetCount: 8,
    tier: 'Diamante Maya',
    color: '#8b5cf6'
  }
];
