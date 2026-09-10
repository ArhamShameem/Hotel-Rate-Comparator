import { Router } from "express";
import { hotelController } from "../controllers/hotel.controller";

const router = Router();

router.post("/search-hotels", (req, res) => hotelController.search(req, res));

export default router;
