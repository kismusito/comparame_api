import express from "express";
import { UserController } from "../controllers";
import { AuthMiddleware, Upload } from "../Middlewares";
const router = express.Router();

router
    .get("/authenticate", UserController.authenticate)
    .get("/favoriteProducts", AuthMiddleware, UserController.getFavoriteProduct)
    .post("/login", UserController.login)
    .post(
        "/upgradeToSupermarker",
        AuthMiddleware,
        Upload("supermarket").single("supermarketLogo"),
        UserController.upgradeToSupermarker
    )
    .post(
        "/favoriteProducts",
        AuthMiddleware,
        UserController.addFavoriteProduct
    )
    .post("/register", UserController.register)
    .delete(
        "/favoriteProducts",
        AuthMiddleware,
        UserController.removeFavoriteProduct
    );

export { router as UserRoute };
