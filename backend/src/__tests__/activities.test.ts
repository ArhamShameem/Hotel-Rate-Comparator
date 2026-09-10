/// <reference types="jest" />
import { fetchSupplierA, fetchSupplierB } from "../temporal/activities/hotel.activities";

// Mock @temporalio/activity Context
jest.mock("@temporalio/activity", () => ({
  Context: {
    current: () => ({
      cancellationSignal: new AbortController().signal,
    }),
  },
}));

describe("Temporal Activity Unit Tests", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe("fetchSupplierA", () => {
    it("should successfully fetch and parse Supplier A hotels", async () => {
      const mockHotels = [
        { hotelId: "hotel-1", name: "Taj Hotel", price: 5000 },
        { hotelId: "hotel-2", name: "Hyatt Hotel", price: 6000 },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockHotels,
      } as Response);

      const result = await fetchSupplierA({
        city: "Delhi",
        checkIn: "2026-09-15",
        checkOut: "2026-09-18",
      });

      expect(result).toEqual(mockHotels);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("http://localhost:3000/supplierA/hotels"),
        expect.any(Object)
      );
    });

    it("should include behavior query parameter when provided", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      await fetchSupplierA({
        city: "Delhi",
        checkIn: "2026-09-15",
        checkOut: "2026-09-18",
        supplierABehavior: "empty",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("behavior=empty"),
        expect.any(Object)
      );
    });

    it("should throw error when Supplier A returns non-OK status", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(
        fetchSupplierA({
          city: "Delhi",
          checkIn: "2026-09-15",
          checkOut: "2026-09-18",
          supplierABehavior: "error",
        })
      ).rejects.toThrow("Supplier A failed");
    });
  });

  describe("fetchSupplierB", () => {
    it("should successfully fetch and parse Supplier B hotels", async () => {
      const mockHotels = [
        { hotelId: "hotel-1", name: "Taj Hotel", price: 4500 },
        { hotelId: "hotel-2", name: "Hyatt Hotel", price: 5500 },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockHotels,
      } as Response);

      const result = await fetchSupplierB({
        city: "Delhi",
        checkIn: "2026-09-15",
        checkOut: "2026-09-18",
      });

      expect(result).toEqual(mockHotels);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("http://localhost:3000/supplierB/hotels"),
        expect.any(Object)
      );
    });

    it("should throw error when Supplier B returns non-OK status", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(
        fetchSupplierB({
          city: "Delhi",
          checkIn: "2026-09-15",
          checkOut: "2026-09-18",
          supplierBBehavior: "error",
        })
      ).rejects.toThrow("Supplier B failed");
    });
  });
});
