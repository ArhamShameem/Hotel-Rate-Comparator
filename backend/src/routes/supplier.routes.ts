import { Router } from "express";
import { supplierController } from "../controllers/supplier.controller";

const router = Router();

router.get("/supplierA/hotels", (req, res) =>
  supplierController.getSupplierA(req, res)
);

router.get("/supplierB/hotels", (req, res) =>
  supplierController.getSupplierB(req, res)
);

export default router;
