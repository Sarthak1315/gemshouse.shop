import React from "react";

export default function AdminLoading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
      {/* Pulse Diamond Rings */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-champagne-gold/20 animate-ping"></div>
        <div className="absolute w-12 h-12 rounded-full border-2 border-t-emerald-deep border-r-emerald-deep border-b-champagne-gold border-l-champagne-gold animate-spin"></div>
        <span className="material-symbols-outlined text-xl text-emerald-deep dark:text-champagne-gold select-none animate-pulse">
          diamond
        </span>
      </div>
      <div className="text-center">
        <p className="font-label-caps text-[10px] text-champagne-gold tracking-widest uppercase">
          Loading Console
        </p>
        <p className="text-[8px] text-on-surface-variant/60 font-label-caps uppercase tracking-widest mt-1">
          Securing session dossier...
        </p>
      </div>
    </div>
  );
}
