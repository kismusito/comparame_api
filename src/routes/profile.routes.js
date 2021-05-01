import { ProfileController } from "../controllers";
import { AuthMiddleware, Upload } from "../Middlewares";
import express from "express";

const router = express.Router();

router
    .get("/", AuthMiddleware, ProfileController.getUserProfile)
    .put(
        "/",
        AuthMiddleware,
        Upload("users").single("photo"),
        ProfileController.updateProfile
    )
    .put("/location", AuthMiddleware, ProfileController.updateGeolocation);

export { router as ProfileRoutes };
