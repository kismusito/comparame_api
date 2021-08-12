import express from "express";
import { UserListController } from "../controllers/product_list.controller";
import { AuthMiddleware } from "../Middlewares";
const router = express.Router();

router
  .get("/", AuthMiddleware, UserListController.getMyLists)
  .get("/:id", AuthMiddleware, UserListController.getList)
  .post("/", AuthMiddleware, UserListController.createList)
  .post("/product", AuthMiddleware, UserListController.addProductToList)
  .delete("/", AuthMiddleware, UserListController.removeProductToList);
  
export { router as ProductListRoutes };
