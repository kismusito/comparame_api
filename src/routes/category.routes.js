import express from "express";
import { CategoryController } from "../controllers/category.controller";
import { AuthMiddleware } from "../Middlewares";
const router = express.Router();

router
    .get("/", CategoryController.getCategories)
    .get("/{id}", CategoryController.getCategory)
    //.get("/user",  CategoryController.getUsers)
    .post("/", AuthMiddleware, CategoryController.createCategory)
    .put("/", AuthMiddleware, CategoryController.updateCategory)
    .delete("/", AuthMiddleware, CategoryController.deleteCategory);
    ;
export { router as CategoryRoutes };
