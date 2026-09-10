/// <reference types="jest" />
let mockSupplierAResponse: any = [];
let mockSupplierBResponse: any = [];

jest.mock("@temporalio/workflow", () => ({
  proxyActivities: () => ({
    fetchSupplierA: jest.fn(async () => {
      if (mockSupplierAResponse instanceof Error) {
        throw mockSupplierAResponse;
      }
      return mockSupplierAResponse;
    }),
    fetchSupplierB: jest.fn(async () => {
      if (mockSupplierBResponse instanceof Error) {
        throw mockSupplierBResponse;
      }
      return mockSupplierBResponse;
    }),
  }),
  CancellationScope: {
    withTimeout: jest.fn((_timeout: string, fn: () => any) => fn()),
  },
  ApplicationFailure: {
    create: ({ message, nonRetryable }: { message: string; nonRetryable?: boolean }) => {
      const err = new Error(message);
      (err as any).nonRetryable = nonRetryable;
      return err;
    },
  },
}));

import { hotelSearchWorkflow } from "../temporal/workflows/hotel.workflow";

describe("Temporal Hotel Search Workflow Unit Tests", () => {
  beforeEach(() => {
    mockSupplierAResponse = [];
    mockSupplierBResponse = [];
  });

  it("should select the cheapest hotel when both suppliers succeed", async () => {
    mockSupplierAResponse = [
      { hotelId: "hotel-1", name: "Taj Hotel", price: 5000 },
      { hotelId: "hotel-2", name: "Hyatt Hotel", price: 6000 },
    ];
    mockSupplierBResponse = [
      { hotelId: "hotel-1", name: "Taj Hotel", price: 4500 },
      { hotelId: "hotel-2", name: "Hyatt Hotel", price: 5500 },
    ];

    const result = await hotelSearchWorkflow({
      city: "Delhi",
      checkIn: "2026-09-15",
      checkOut: "2026-09-18",
    });

    expect(result).toEqual({
      hotelId: "hotel-1",
      name: "Taj Hotel",
      price: 4500,
    });
  });

  it("should select Supplier A when Supplier A is cheaper", async () => {
    mockSupplierAResponse = [
      { hotelId: "hotel-1", name: "Taj Hotel", price: 4000 },
    ];
    mockSupplierBResponse = [
      { hotelId: "hotel-1", name: "Taj Hotel", price: 4500 },
    ];

    const result = await hotelSearchWorkflow({
      city: "Delhi",
      checkIn: "2026-09-15",
      checkOut: "2026-09-18",
    });

    expect(result).toEqual({
      hotelId: "hotel-1",
      name: "Taj Hotel",
      price: 4000,
    });
  });

  it("should deterministically pick Supplier A when both return the same rate", async () => {
    mockSupplierAResponse = [
      { hotelId: "hotel-1", name: "Taj Hotel A", price: 4500 },
    ];
    mockSupplierBResponse = [
      { hotelId: "hotel-1", name: "Taj Hotel B", price: 4500 },
    ];

    const result = await hotelSearchWorkflow({
      city: "Delhi",
      checkIn: "2026-09-15",
      checkOut: "2026-09-18",
    });

    // Deterministic selection picks the first registered supplier (Supplier A)
    expect(result.name).toBe("Taj Hotel A");
    expect(result.price).toBe(4500);
  });

  it("should fallback to Supplier B when Supplier A throws an error", async () => {
    mockSupplierAResponse = new Error("Supplier A failed");
    mockSupplierBResponse = [
      { hotelId: "hotel-1", name: "Taj Hotel", price: 4500 },
    ];

    const result = await hotelSearchWorkflow({
      city: "Delhi",
      checkIn: "2026-09-15",
      checkOut: "2026-09-18",
      supplierABehavior: "error",
      supplierBBehavior: "normal",
    });

    expect(result).toEqual({
      hotelId: "hotel-1",
      name: "Taj Hotel",
      price: 4500,
    });
  });

  it("should fallback to Supplier B when Supplier A returns empty", async () => {
    mockSupplierAResponse = [];
    mockSupplierBResponse = [
      { hotelId: "hotel-1", name: "Taj Hotel", price: 4500 },
    ];

    const result = await hotelSearchWorkflow({
      city: "Delhi",
      checkIn: "2026-09-15",
      checkOut: "2026-09-18",
      supplierABehavior: "empty",
      supplierBBehavior: "normal",
    });

    expect(result).toEqual({
      hotelId: "hotel-1",
      name: "Taj Hotel",
      price: 4500,
    });
  });

  it("should throw 'No hotels found' when both suppliers return empty", async () => {
    mockSupplierAResponse = [];
    mockSupplierBResponse = [];

    await expect(
      hotelSearchWorkflow({
        city: "Delhi",
        checkIn: "2026-09-15",
        checkOut: "2026-09-18",
      })
    ).rejects.toThrow("No hotels found");
  });

  it("should throw 'No hotels found' when both suppliers fail with errors", async () => {
    mockSupplierAResponse = new Error("Supplier A failed");
    mockSupplierBResponse = new Error("Supplier B failed");

    await expect(
      hotelSearchWorkflow({
        city: "Delhi",
        checkIn: "2026-09-15",
        checkOut: "2026-09-18",
      })
    ).rejects.toThrow("No hotels found");
  });
});
