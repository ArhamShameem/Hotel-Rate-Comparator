import React from "react";
import { Zap, ShieldCheck, Tag } from "lucide-react";
import { HotelSearchForm } from "./HotelSearchForm";
import type { HotelSearchRequest } from "../types/hotel";

interface HeroProps {
  onSearch: (criteria: HotelSearchRequest) => void;
  isLoading: boolean;
  initialValues?: Partial<HotelSearchRequest>;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  isLoading,
  initialValues,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-[540px] flex items-center">
      {/* Background with luxury pool / sunset aesthetic */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.65) 50%, rgba(15, 23, 42, 0.45) 100%), url('https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & Value Props */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Hotel Rate Comparator
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed">
                Find the best available hotel rate from multiple suppliers
                powered by Temporal Workflows.
              </p>
            </div>

            {/* Feature Highlights matching the theme reference */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 backdrop-blur-sm border border-blue-400/20">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Fast</h2>
                  <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                    Compare rates in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 backdrop-blur-sm border border-emerald-400/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Reliable</h2>
                  <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                    Handles failures automatically
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 backdrop-blur-sm border border-indigo-400/20">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Better Deals</h2>
                  <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                    Get the lowest price
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Search Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HotelSearchForm
              onSearch={onSearch}
              isLoading={isLoading}
              initialValues={initialValues}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
