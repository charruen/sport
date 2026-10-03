'use client';

import React, { useState } from 'react';
import { Info, X, ShieldCheck } from 'lucide-react';

export default function EquipmentTip() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="bg-zinc-900/90 border border-cyan-500/30 rounded-2xl p-4 my-6 backdrop-blur-md relative">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              💡 Conseil installation anti-glisse
            </h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Aligne tes 2 tapis de yoga bout à bout ou cale l’extrémité contre le bas d’un mur ou meuble lourd. Entraîne-toi <strong className="text-cyan-300">pieds nus ou avec des baskets propres</strong> (les chaussettes glissent sur le sol).
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
