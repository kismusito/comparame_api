import express from "express";
import { ProductController } from "../controllers/product.controller";
import { AuthMiddleware } from "../Middlewares";
const router = express.Router();

router
  .get("/", ProductController.getProducts)
  .get("/:id", ProductController.getProduct)
  .post("/", AuthMiddleware, ProductController.createProduct)
  .put("/", AuthMiddleware, ProductController.updateProduct)
  .delete("/", AuthMiddleware, ProductController.deleteProduct);

export { router as ProductRoutes };
