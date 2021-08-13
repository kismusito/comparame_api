import express from "express";
import { ProductController } from "../controllers/product.controller";
import { AuthMiddleware } from "../Middlewares";
const router = express.Router();

router
  .get("/", ProductController.getProducts)
  .get("/:id", ProductController.getProduct)
  .post("/", AuthMiddleware, ProductController.createProduct)
  .put("/", AuthMiddleware, ProductController.updateProduct)
  .put("/TA", AuthMiddleware, ProductController.TakeAwayProductCategory)
  .put("/In", AuthMiddleware, ProductController.InsertProductCategory)
  .delete("/", AuthMiddleware, ProductController.deleteProduct)
  .get("/searchS", ProductController.searchProductNameSupermarket)
  .get("/search", ProductController.searchProductNameGen)
  .get("/compare/:id", ProductController.compareProducts);

export { router as ProductRoutes };
