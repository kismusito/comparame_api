import express from "express";
import { UserController } from "../controllers";
import { AuthMiddleware, Upload } from "../Middlewares";
const router = express.Router();

router
    .get("/authenticate", UserController.authenticate)
    .post("/login", UserController.login)
    .post(
        "/upgradeToSupermarker",
        AuthMiddleware,
        Upload("supermarket").single("supermarketLogo"),
        UserController.upgradeToSupermarker
    )
    .post("/register", UserController.register);

export { router as UserRoute };
