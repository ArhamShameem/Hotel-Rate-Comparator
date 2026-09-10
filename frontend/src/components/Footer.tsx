import React from "react";
import { Plane, Mountain } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left branding quote with airplane */}
        <div className="flex items-center gap-3 text-blue-900/80">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <p className="font-script text-2xl sm:text-3xl text-blue-900/90 leading-tight">
              Good Hotels Make Great Memories
            </p>
          </div>
        </div>

        {/* Right motto with mountain outline */}
        <div className="flex items-center gap-3 text-slate-500">
          <Mountain className="w-6 h-6 text-slate-400 stroke-[1.5]" />
          <span className="text-xs sm:text-sm font-medium tracking-wide">
            Explore &bull; Compare &bull; Travel Better
          </span>
        </div>
      </div>
    </footer>
  );
};
