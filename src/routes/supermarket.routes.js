import express from "express";
const router = express.Router();
import { SupermarketController } from "../controllers";
import { AuthMiddleware, Upload } from "../Middlewares";

router
    .get("/", SupermarketController.getSupermarkets)
    .get("/:id", SupermarketController.getSupermarket)
    .get(
        "/headsquare/:supermarketID",
        SupermarketController.getSupermarketHeadsquares
    )
    .get(
        "/headsquare/:supermarketID/:headsquareID",
        SupermarketController.getSupermarketHeadsquare
    )
    .post(
        "/headsquare",
        AuthMiddleware,
        Upload("supermarket/headsquares").single("headsquarePhoto"),
        SupermarketController.createSupermarketHeadsquare
    )
    .put(
        "/",
        AuthMiddleware,
        Upload("supermarket").single("supermarketLogo"),
        SupermarketController.updateSupermarket
    )
    .put(
        "/headsquare",
        AuthMiddleware,
        Upload("supermarket/headsquares").single("headsquarePhoto"),
        SupermarketController.updateSupermarketHeadsquare
    )
    .delete(
        "/headsquare",
        AuthMiddleware,
        SupermarketController.deleteSupermarketHeadsquare
    );

export { router as SupermarketRoutes };
