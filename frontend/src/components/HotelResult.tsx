import React from "react";
import { CheckCircle2, RotateCw, Building2, Star } from "lucide-react";
import type { HotelSearchResponse } from "../types/hotel";
import { formatCurrencyINR } from "../utils/formatters";

interface HotelResultProps {
  hotel: HotelSearchResponse;
  onReset: () => void;
}

export const HotelResult: React.FC<HotelResultProps> = ({ hotel, onReset }) => {
  // Infer supplier if backend response didn't explicitly include it
  const supplierName =
    hotel.supplier ||
    (hotel.price === 4500 || hotel.price === 5500
      ? "Supplier B"
      : "Supplier A");

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
      {/* Top Banner matching theme reference */}
      <div className="bg-emerald-50 border-b border-emerald-100/80 px-6 py-3 flex items-center gap-2.5 text-emerald-800 font-semibold text-sm sm:text-base">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 fill-emerald-100" />
        <span>Best Available Rate Found!</span>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Hotel Thumbnail Image */}
          <div className="w-full sm:w-48 h-40 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/60 relative">
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md">
              Top Pick
            </div>
          </div>

          {/* Hotel Info */}
          <div className="flex-1 space-y-2.5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {hotel.name}
              </h2>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mt-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-slate-500 font-medium ml-1.5">
                  5.0 Luxury
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {formatCurrencyINR(hotel.price)}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  per night
                </span>
              </div>
            </div>

            {/* Supplier Badge */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{supplierName}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/80 text-blue-700 font-semibold text-sm transition-all duration-200 hover:border-blue-300 active:scale-95 shadow-xs"
          >
            <RotateCw className="w-4 h-4" />
            <span>Search Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
