import React from "react";
import { Square } from "lucide-react";

interface LoadingStateProps {
  onCancel: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ onCancel }) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center animate-fade-in">
      {/* Animated blue spinner */}
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        Searching for the best hotel rate...
      </h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
        We&apos;re checking with multiple suppliers. This may take a few seconds.
      </p>

      <div className="mt-7">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-600 font-semibold text-sm transition-all duration-200 hover:border-red-300 active:scale-95 shadow-sm"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Cancel Search</span>
        </button>
      </div>
    </div>
  );
};
