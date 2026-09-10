/// <reference types="jest" />
import { getSupplierAHotels } from "../suppliers/supplierA";
import { getSupplierBHotels } from "../suppliers/supplierB";

describe("Supplier Unit Tests", () => {
  describe("Supplier A", () => {
    it("should return normal hotels when behavior is omitted or normal", async () => {
      const hotels = await getSupplierAHotels();
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBe(2);
      expect(hotels[0]).toEqual({
        hotelId: "hotel-1",
        name: "Taj Hotel",
        price: 5000,
      });
      expect(hotels[1]).toEqual({
        hotelId: "hotel-2",
        name: "Hyatt Hotel",
        price: 6000,
      });
    });

    it("should return empty array when behavior is empty", async () => {
      const hotels = await getSupplierAHotels("empty");
      expect(hotels).toEqual([]);
    });

    it("should throw 'Supplier A failed' error when behavior is error", async () => {
      await expect(getSupplierAHotels("error")).rejects.toThrow(
        "Supplier A failed"
      );
    });

    it("should delay approximately 3 seconds when behavior is delay", async () => {
      const start = Date.now();
      const hotels = await getSupplierAHotels("delay");
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(2800);
      expect(hotels.length).toBe(2);
    }, 10000);

    it("should handle fail-twice behavior: fails 2 times then succeeds on 3rd attempt", async () => {
      // 1st attempt: fails
      await expect(getSupplierAHotels("fail-twice")).rejects.toThrow(
        "Supplier A failed attempt 1"
      );

      // 2nd attempt: fails
      await expect(getSupplierAHotels("fail-twice")).rejects.toThrow(
        "Supplier A failed attempt 2"
      );

      // 3rd attempt: succeeds
      const hotels = await getSupplierAHotels("fail-twice");
      expect(hotels.length).toBe(2);
      expect(hotels[0]?.price).toBe(5000);
    });
  });

  describe("Supplier B", () => {
    it("should return normal hotels with cheaper price", async () => {
      const hotels = await getSupplierBHotels();
      expect(hotels.length).toBe(2);
      expect(hotels[0]).toEqual({
        hotelId: "hotel-1",
        name: "Taj Hotel",
        price: 4500,
      });
      expect(hotels[1]).toEqual({
        hotelId: "hotel-2",
        name: "Hyatt Hotel",
        price: 5500,
      });
    });

    it("should return empty array when behavior is empty", async () => {
      const hotels = await getSupplierBHotels("empty");
      expect(hotels).toEqual([]);
    });

    it("should throw 'Supplier B failed' error when behavior is error", async () => {
      await expect(getSupplierBHotels("error")).rejects.toThrow(
        "Supplier B failed"
      );
    });

    it("should delay approximately 2 seconds when behavior is delay", async () => {
      const start = Date.now();
      const hotels = await getSupplierBHotels("delay");
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(1800);
      expect(hotels.length).toBe(2);
    }, 10000);
  });
});
