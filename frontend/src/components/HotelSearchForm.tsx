import React, { useState } from "react";
import { Search, MapPin, Calendar, X } from "lucide-react";
import type { HotelSearchRequest } from "../types/hotel";
import {
  validateSearchForm,
  getTodayDateString,
  getMinCheckOutDate,
  type ValidationErrors,
} from "../utils/validation";

interface HotelSearchFormProps {
  onSearch: (criteria: HotelSearchRequest) => void;
  isLoading: boolean;
  initialValues?: Partial<HotelSearchRequest>;
}

export const HotelSearchForm: React.FC<HotelSearchFormProps> = ({
  onSearch,
  isLoading,
  initialValues,
}) => {
  const [city, setCity] = useState(initialValues?.city || "Delhi");
  const [checkIn, setCheckIn] = useState(
    initialValues?.checkIn || "2026-09-15"
  );
  const [checkOut, setCheckOut] = useState(
    initialValues?.checkOut || "2026-09-18"
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const todayStr = getTodayDateString();
  const minCheckOutStr = getMinCheckOutDate(checkIn);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    if (touched.city) {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, city: "City is required" }));
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.city;
          return updated;
        });
      }
    }
  };

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCheckIn(value);
    if (checkOut && new Date(checkOut) <= new Date(value)) {
      // Auto adjust or set validation error
      const nextDay = getMinCheckOutDate(value);
      setCheckOut(nextDay);
    }
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.checkIn;
      delete updated.checkOut;
      return updated;
    });
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCheckOut(value);
    if (checkIn && new Date(value) <= new Date(checkIn)) {
      setErrors((prev) => ({
        ...prev,
        checkOut: "Check-out must be after check-in",
      }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.checkOut;
        return updated;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: currentErrors } = validateSearchForm(city, checkIn, checkOut);
    setErrors(currentErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ city: true, checkIn: true, checkOut: true });

    const { isValid, errors: validationErrors } = validateSearchForm(
      city,
      checkIn,
      checkOut
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSearch({
      city: city.trim(),
      checkIn,
      checkOut,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-7 w-full max-w-lg transition-shadow duration-300">
      <div className="flex items-start gap-3.5 mb-6">
        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/25">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Search Hotels
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Enter your travel details to find the best hotel rate
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* City Input */}
        <div>
          <label
            htmlFor="city-input"
            className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider"
          >
            City
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              id="city-input"
              type="text"
              value={city}
              onChange={handleCityChange}
              onBlur={() => handleBlur("city")}
              disabled={isLoading}
              placeholder="e.g. Delhi"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "city-error" : undefined}
              className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.city
                  ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-100"
              } disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
            />
            {city && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setCity("");
                  setErrors((prev) => ({ ...prev, city: "City is required" }));
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear city"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {errors.city && (
            <p id="city-error" className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.city}
            </p>
          )}
        </div>

        {/* Date Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Check-In */}
          <div>
            <label
              htmlFor="checkin-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Check-in Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="checkin-input"
                type="date"
                value={checkIn}
                min={todayStr}
                onChange={handleCheckInChange}
                onBlur={() => handleBlur("checkIn")}
                disabled={isLoading}
                aria-invalid={Boolean(errors.checkIn)}
                aria-describedby={errors.checkIn ? "checkin-error" : undefined}
                className={`w-full pl-10 pr-3 py-3 rounded-xl border text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.checkIn
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-100"
                } disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
              />
            </div>
            {errors.checkIn && (
              <p
                id="checkin-error"
                className="mt-1.5 text-xs text-red-600 font-medium"
              >
                {errors.checkIn}
              </p>
            )}
          </div>

          {/* Check-Out */}
          <div>
            <label
              htmlFor="checkout-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Check-out Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="checkout-input"
                type="date"
                value={checkOut}
                min={minCheckOutStr}
                onChange={handleCheckOutChange}
                onBlur={() => handleBlur("checkOut")}
                disabled={isLoading}
                aria-invalid={Boolean(errors.checkOut)}
                aria-describedby={errors.checkOut ? "checkout-error" : undefined}
                className={`w-full pl-10 pr-3 py-3 rounded-xl border text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.checkOut
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-100"
                } disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
              />
            </div>
            {errors.checkOut && (
              <p
                id="checkout-error"
                className="mt-1.5 text-xs text-red-600 font-medium"
              >
                {errors.checkOut}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none disabled:shadow-none"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Search Hotels</span>
          </button>
        </div>
      </form>
    </div>
  );
};
