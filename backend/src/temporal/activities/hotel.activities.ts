import { Context } from "@temporalio/activity";
import type { Hotel, HotelSearchInput } from "../../types/hotel";

export async function fetchSupplierA(
  input: HotelSearchInput
): Promise<Hotel[]> {
  const behaviorQuery = input.supplierABehavior
    ? `&behavior=${encodeURIComponent(input.supplierABehavior)}`
    : "";
  const response = await fetch(
    `http://localhost:3000/supplierA/hotels?city=${encodeURIComponent(
      input.city
    )}&checkIn=${encodeURIComponent(input.checkIn)}&checkOut=${encodeURIComponent(
      input.checkOut
    )}${behaviorQuery}`,
    {
      signal: Context.current().cancellationSignal,
    }
  );

  if (!response.ok) {
    throw new Error("Supplier A failed");
  }

  return (await response.json()) as Hotel[];
}

export async function fetchSupplierB(
  input: HotelSearchInput
): Promise<Hotel[]> {
  const behaviorQuery = input.supplierBBehavior
    ? `&behavior=${encodeURIComponent(input.supplierBBehavior)}`
    : "";
  const response = await fetch(
    `http://localhost:3000/supplierB/hotels?city=${encodeURIComponent(
      input.city
    )}&checkIn=${encodeURIComponent(input.checkIn)}&checkOut=${encodeURIComponent(
      input.checkOut
    )}${behaviorQuery}`,
    {
      signal: Context.current().cancellationSignal,
    }
  );

  if (!response.ok) {
    throw new Error("Supplier B failed");
  }

  return (await response.json()) as Hotel[];
}
