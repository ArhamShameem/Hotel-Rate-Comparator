import { Request, Response } from "express";
import { getSupplierAHotels } from "../suppliers/supplierA";
import { getSupplierBHotels } from "../suppliers/supplierB";

export class SupplierController {
  async getSupplierA(req: Request, res: Response) {
    try {
      const hotels = await getSupplierAHotels(
        req.query.behavior as string | undefined
      );
      return res.json(hotels);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Hotel search failed";
      return res.status(500).json({ error: message });
    }
  }

  async getSupplierB(req: Request, res: Response) {
    try {
      const hotels = await getSupplierBHotels(
        req.query.behavior as string | undefined
      );
      return res.json(hotels);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Hotel search failed";
      return res.status(500).json({ error: message });
    }
  }
}

export const supplierController = new SupplierController();
