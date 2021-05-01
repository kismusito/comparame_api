import express from "express";
const router = express.Router();
import { SupermarkerController } from "../controllers";
import { AuthMiddleware, Upload } from "../Middlewares";

router
    .get("/", SupermarkerController.getSupermarkers)
    .get("/{id}", SupermarkerController.getSupermarker)
    .get("/headsquare", SupermarkerController.getSupermarkerHeadsquares)
    .get("/headsquare/{id}", SupermarkerController.getSupermarkerHeadsquare)
    .post(
        "/headsquare",
        AuthMiddleware,
        Upload("headsquares").single("headsquarePhoto"),
        SupermarkerController.createSupermarkerHeadsquare
    )
    .put("/", AuthMiddleware, SupermarkerController.updateSupermarker)
    .put(
        "/headsquare",
        AuthMiddleware,
        Upload("headsquares").single("headsquarePhoto"),
        SupermarkerController.updateSupermarkerHeadsquare
    )
    .delete(
        "/headsquare",
        AuthMiddleware,
        SupermarkerController.deleteSupermarkerHeadsquare
    );

export { router as SupermarkerRoutes };
