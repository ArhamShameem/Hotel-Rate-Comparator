export interface HotelSearchRequest {
  city: string;
  checkIn: string;
  checkOut: string;
}

export interface HotelSearchResponse {
  hotelId: string;
  name: string;
  price: number;
  supplier?: string;
}

export interface ApiError {
  error: string;
}

export type SearchStatus = "idle" | "loading" | "success" | "error" | "cancelled";
