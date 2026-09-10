import React from "react";
import { Ban, Search } from "lucide-react";

interface CancelledStateProps {
  onSearchAgain: () => void;
}

export const CancelledState: React.FC<CancelledStateProps> = ({
  onSearchAgain,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center animate-fade-in">
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shadow-inner">
          <Ban className="w-8 h-8 stroke-[2]" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        Search cancelled
      </h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
        The hotel rate search was stopped as requested. You can start a new search at any time.
      </p>

      <div className="mt-7">
        <button
          type="button"
          onClick={onSearchAgain}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/80 text-blue-700 font-semibold text-sm transition-all duration-200 hover:border-blue-300 active:scale-95 shadow-xs"
        >
          <Search className="w-4 h-4" />
          <span>New Search</span>
        </button>
      </div>
    </div>
  );
};
