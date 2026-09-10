import type { Hotel } from "../types/hotel";

export async function getSupplierBHotels(
  behavior?: string
): Promise<Hotel[]> {
  if (behavior === "delay") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (behavior === "timeout") {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  if (behavior === "error") {
    throw new Error("Supplier B failed");
  }

  if (behavior === "empty") {
    return [];
  }

  return [
    {
      hotelId: "hotel-1",
      name: "Taj Hotel",
      price: 4500,
    },
    {
      hotelId: "hotel-2",
      name: "Hyatt Hotel",
      price: 5500,
    },
  ];
}
