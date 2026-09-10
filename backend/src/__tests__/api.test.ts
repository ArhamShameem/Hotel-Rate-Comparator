/// <reference types="jest" />
import request from "supertest";
import { app } from "../server";

// Mock temporal client
jest.mock("../temporal/client", () => ({
  getTemporalClient: jest.fn().mockResolvedValue({
    workflow: {
      start: jest.fn().mockImplementation((_name: unknown, options: any) => {
        const input = options.args[0];
        const isFailed =
          (input.supplierABehavior === "empty" && input.supplierBBehavior === "empty") ||
          (input.supplierABehavior === "error" && input.supplierBBehavior === "error");

        return Promise.resolve({
          cancel: jest.fn().mockResolvedValue(undefined),
          result: jest.fn().mockImplementation(() => {
            if (isFailed) {
              return Promise.reject(new Error("No hotels found"));
            }
            return Promise.resolve({
              hotelId: "hotel-1",
              name: "Taj Hotel",
              price: 4500,
            });
          }),
        });
      }),
    },
  }),
}));

describe("Backend API Endpoints (Supertest)", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    // Silence expected console.error logs during negative test cases
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("GET /health returns 200 and backend running message", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Backend is running" });
  });

  it("GET /supplierA/hotels returns 200 with normal hotels", async () => {
    const res = await request(app).get("/supplierA/hotels");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].price).toBe(5000);
  });

  it("GET /supplierB/hotels returns 200 with normal hotels", async () => {
    const res = await request(app).get("/supplierB/hotels");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].price).toBe(4500);
  });

  it("GET /supplierA/hotels?behavior=empty returns 200 with empty array", async () => {
    const res = await request(app).get("/supplierA/hotels?behavior=empty");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /supplierA/hotels?behavior=error returns 500 error", async () => {
    const res = await request(app).get("/supplierA/hotels?behavior=error");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Supplier A failed" });
  });

  it("GET /supplierB/hotels?behavior=error returns 500 error", async () => {
    const res = await request(app).get("/supplierB/hotels?behavior=error");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Supplier B failed" });
  });

  it("POST /api/search-hotels returns 400 when missing required fields", async () => {
    const res = await request(app)
      .post("/api/search-hotels")
      .send({ city: "Delhi" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "city, checkIn and checkOut are required",
    });
  });

  it("POST /api/search-hotels returns 200 with cheapest hotel on valid input", async () => {
    const res = await request(app).post("/api/search-hotels").send({
      city: "Delhi",
      checkIn: "2026-09-15",
      checkOut: "2026-09-18",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      hotelId: "hotel-1",
      name: "Taj Hotel",
      price: 4500,
    });
  });

  it("POST /api/search-hotels returns 500 when both suppliers fail", async () => {
    const res = await request(app).post("/api/search-hotels").send({
      city: "Delhi",
      checkIn: "2026-09-15",
      checkOut: "2026-09-18",
      supplierABehavior: "error",
      supplierBBehavior: "error",
    });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "No hotels found" });
  });
});
