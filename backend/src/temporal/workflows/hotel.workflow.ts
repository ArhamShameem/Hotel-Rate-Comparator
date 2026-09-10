import {
  proxyActivities,
  CancellationScope,
  ApplicationFailure,
} from "@temporalio/workflow";

import type * as activities from "../activities/hotel.activities";
import type { HotelSearchInput, Hotel } from "../../types/hotel";

const { fetchSupplierA, fetchSupplierB } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "5 seconds",
  scheduleToCloseTimeout: "5 seconds",
  retry: {
    initialInterval: "100 milliseconds",
    maximumAttempts: 3,
  },
});

export async function hotelSearchWorkflow(
  input: HotelSearchInput
): Promise<Hotel> {
  const supplierA = CancellationScope.withTimeout(
    "5 seconds",
    () => fetchSupplierA(input)
  );

  const supplierB = CancellationScope.withTimeout(
    "5 seconds",
    () => fetchSupplierB(input)
  );

  const [resultA, resultB] = await Promise.allSettled([
    supplierA,
    supplierB,
  ]);

  const hotelsA =
    resultA.status === "fulfilled" ? resultA.value : [];

  const hotelsB =
    resultB.status === "fulfilled" ? resultB.value : [];

  const allHotels = [...hotelsA, ...hotelsB];

  if (allHotels.length === 0) {
    throw ApplicationFailure.create({
      message: "No hotels found",
      nonRetryable: true,
    });
  }

  return allHotels.reduce((cheapest, hotel) =>
    hotel.price < cheapest.price ? hotel : cheapest
  );
}
