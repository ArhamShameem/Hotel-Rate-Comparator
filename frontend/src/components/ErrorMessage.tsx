import React from "react";
import { AlertCircle, RotateCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  const isNotFound =
    message.toLowerCase().includes("no hotels") ||
    message.toLowerCase().includes("not found");

  const title = isNotFound ? "No hotels found" : "Something went wrong";
  const subtitle = isNotFound
    ? "We couldn't find any hotels for your search criteria. Please try different dates or a different city."
    : message;

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center animate-fade-in">
      {/* Red Alert Icon matching reference image */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-red-100/80 text-red-500 flex items-center justify-center shadow-inner">
          <AlertCircle className="w-8 h-8 stroke-[2.2]" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
        {subtitle}
      </p>

      <div className="mt-7">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/80 text-blue-700 font-semibold text-sm transition-all duration-200 hover:border-blue-300 active:scale-95 shadow-xs"
        >
          <RotateCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
