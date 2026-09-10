import { Router } from "express";
import hotelRoutes from "./hotel.routes";
import supplierRoutes from "./supplier.routes";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({ message: "Backend is running" });
});

// Mount modular sub-routers
router.use("/api", hotelRoutes);
router.use(supplierRoutes);

export default router;
