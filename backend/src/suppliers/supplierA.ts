import type { Hotel } from "../types/hotel";

let failTwiceCount = 0;

export async function getSupplierAHotels(
  behavior?: string
): Promise<Hotel[]> {
  if (behavior === "delay") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  if (behavior === "timeout") {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  if (behavior === "error") {
    throw new Error("Supplier A failed");
  }

  if (behavior === "fail-twice") {
    failTwiceCount++;

    if (failTwiceCount <= 2) {
      throw new Error(`Supplier A failed attempt ${failTwiceCount}`);
    }

    failTwiceCount = 0;
  }

  if (behavior === "empty") {
    return [];
  }

  return [
    {
      hotelId: "hotel-1",
      name: "Taj Hotel",
      price: 5000,
    },
    {
      hotelId: "hotel-2",
      name: "Hyatt Hotel",
      price: 6000,
    },
  ];
}
