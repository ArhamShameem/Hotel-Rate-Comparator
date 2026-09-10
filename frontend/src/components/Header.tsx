import React from "react";
import { BedDouble } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
              StayFinder
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">
              Better Rates. Brighter Trips.
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-sm text-slate-500 font-medium">
          Find the best hotel rates across multiple suppliers
        </div>
      </div>
    </header>
  );
};
