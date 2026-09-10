import React, { useState, useRef } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LoadingState } from "./components/LoadingState";
import { HotelResult } from "./components/HotelResult";
import { ErrorMessage } from "./components/ErrorMessage";
import { CancelledState } from "./components/CancelledState";
import { Footer } from "./components/Footer";
import { searchHotels, HotelApiError } from "./api/hotelApi";
import type {
  HotelSearchRequest,
  HotelSearchResponse,
  SearchStatus,
} from "./types/hotel";

export const App: React.FC = () => {
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [hotelResult, setHotelResult] = useState<HotelSearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [lastSearchCriteria, setLastSearchCriteria] =
    useState<HotelSearchRequest | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async (criteria: HotelSearchRequest) => {
    // Abort any ongoing request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLastSearchCriteria(criteria);
    setStatus("loading");
    setErrorMessage("");

    setTimeout(() => {
      document.getElementById("search-status-section")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 50);

    try {
      const data = await searchHotels(criteria, controller.signal);
      setHotelResult(data);
      setStatus("success");
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        setStatus("cancelled");
        return;
      }

      if (error instanceof HotelApiError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setStatus("error");
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("cancelled");
  };

  const handleReset = () => {
    setStatus("idle");
    setHotelResult(null);
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    if (lastSearchCriteria) {
      handleSearch(lastSearchCriteria);
    } else {
      handleReset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Hero with Search Form */}
        <Hero
          onSearch={handleSearch}
          isLoading={status === "loading"}
          initialValues={lastSearchCriteria ?? undefined}
        />

        {/* Dynamic State Section */}
        <section
          id="search-status-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full"
        >
          {status === "loading" && <LoadingState onCancel={handleCancel} />}

          {status === "success" && hotelResult && (
            <HotelResult hotel={hotelResult} onReset={handleReset} />
          )}

          {status === "error" && (
            <ErrorMessage message={errorMessage} onRetry={handleRetry} />
          )}

          {status === "cancelled" && (
            <CancelledState onSearchAgain={handleReset} />
          )}

          {status === "idle" && (
            <div className="text-center py-6 text-slate-400 text-sm font-medium">
              Ready to find the lowest rate? Enter your destination and travel dates above.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
