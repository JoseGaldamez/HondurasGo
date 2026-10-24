import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  X, 
  Database,
  Check
} from 'lucide-react';
import { VisitRecord, UserPassport } from '../types';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  visits: VisitRecord[];
  passport: UserPassport;
  onResetDemoData: () => void;
  onImportData: (data: { visits: VisitRecord[]; passport: UserPassport }) => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  isOfflineMode,
  onToggleOfflineMode,
  visits,
  passport,
  onResetDemoData,
  onImportData
}) => {
  const [copiedStatus, setCopiedStatus] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const payload = JSON.stringify({ visits, passport, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pasaporte_catracho_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.visits && parsed.passport) {
          onImportData({ visits: parsed.visits, passport: parsed.passport });
          alert('¡Datos del Pasaporte Catracho importados correctamente!');
          onClose();
        } else {
          alert('El archivo no contiene un formato válido de Pasaporte Catracho.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Modo Offline & Almacenamiento
              </h3>
              <p className="text-xs text-slate-500">Gestión de datos de viaje en tu dispositivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Offline Toggle Simulator */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOfflineMode ? (
                <WifiOff className="w-4 h-4 text-amber-500" />
              ) : (
                <Wifi className="w-4 h-4 text-emerald-500" />
              )}
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isOfflineMode ? 'Modo Offline Forzado Activo' : 'Conexión En Línea'}
              </span>
            </div>
            <button
              onClick={onToggleOfflineMode}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                isOfflineMode
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              {isOfflineMode ? 'Desactivar' : 'Simular Offline'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Explora Honduras guarda todos los destinos, sellos, reseñas y el mapa vectorial en la memoria local (IndexedDB / LocalStorage) para que funcione en selvas, senderos y playas sin cobertura móvil.
          </p>
        </div>

        {/* Export / Backup */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Copia de Seguridad
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportJSON}
              className="p-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-sky-500" />
              <span>Exportar JSON</span>
            </button>

            <label className="p-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>Importar JSON</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('¿Restablecer datos demo con Roatán y Copán como visitas de ejemplo?')) {
                onResetDemoData();
                onClose();
              }
            }}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer datos demo</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
