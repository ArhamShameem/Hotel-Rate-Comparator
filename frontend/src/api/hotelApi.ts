import type {
  HotelSearchRequest,
  HotelSearchResponse,
  ApiError,
} from "../types/hotel";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export class HotelApiError extends Error {
  public readonly status?: number;
  public readonly isNetworkError: boolean;

  constructor(message: string, status?: number, isNetworkError = false) {
    super(message);
    this.name = "HotelApiError";
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

export async function searchHotels(
  criteria: HotelSearchRequest,
  signal?: AbortSignal
): Promise<HotelSearchResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/search-hotels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(criteria),
      signal,
    });
  } catch (error: unknown) {
    if (
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw error;
    }
    throw new HotelApiError(
      "Unable to connect to the hotel search service. Please try again.",
      undefined,
      true
    );
  }

  if (!response.ok) {
    let errorMessage = "Hotel search failed. Please try again.";
    try {
      const errorData = (await response.json()) as ApiError;
      if (errorData && typeof errorData.error === "string" && errorData.error.trim()) {
        errorMessage = errorData.error;
      }
    } catch {
      // Fallback if response is non-JSON
    }
    throw new HotelApiError(errorMessage, response.status);
  }

  try {
    const data = (await response.json()) as HotelSearchResponse;
    if (!data || typeof data.price !== "number" || !data.name) {
      throw new Error("Invalid response format received from server");
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof HotelApiError) throw error;
    throw new HotelApiError(
      "Invalid response received from hotel search service."
    );
  }
}
