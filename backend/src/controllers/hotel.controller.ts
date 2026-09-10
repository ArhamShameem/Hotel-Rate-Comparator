import { Request, Response } from "express";
import { hotelService } from "../services/hotel.service";

export class HotelController {
  async search(req: Request, res: Response) {
    try {
      const {
        city,
        checkIn,
        checkOut,
        supplierABehavior,
        supplierBBehavior,
      } = req.body;

      if (!city || !checkIn || !checkOut) {
        return res.status(400).json({
          error: "city, checkIn and checkOut are required",
        });
      }

      let cancelWorkflow: (() => Promise<void>) | null = null;

      // Handle client-initiated aborts (e.g., user navigates away or hits cancel)
      req.on("close", async () => {
        if (!res.writableEnded && cancelWorkflow) {
          await cancelWorkflow();
        }
      });

      const result = await hotelService.searchHotels(
        {
          city,
          checkIn,
          checkOut,
          supplierABehavior,
          supplierBBehavior,
        },
        (cancelFn) => {
          cancelWorkflow = cancelFn;
        }
      );

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "No hotels found",
      });
    }
  }
}

export const hotelController = new HotelController();
