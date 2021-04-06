import express from "express";
import { ProductController } from "../controllers";
const router = express.Router();

router
    .get("/", ProductController.getProducts)
    .get("/{id}", ProductController.getProduct)
    .post("/", ProductController.createProduct)
    .put("/", ProductController.updateProduct)
    .delete("/", ProductController.deleteProduct);

export { router as ProductRoutes };
