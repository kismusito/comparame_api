import express from "express";
import { ProductController } from "../controllers/product.controller";
const router = express.Router();

router
    .get("/", ProductController.getProductsGen)
    .get("/{id}", ProductController.getProduct)
    .post("/", ProductController.createProduct)
    .put("/", ProductController.updateProduct)
    .delete("/", ProductController.deleteProduct);

export { router as ProductRoutes };
