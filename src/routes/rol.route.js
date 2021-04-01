import express from "express";
import { RolController } from "../controllers";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
const router = express.Router();

router
    .get("/", AuthMiddleware, RolController.getRols)
    .post("/", AuthMiddleware, RolController.createRol)
    .put("/", AuthMiddleware, RolController.updateRol)
    .delete("/", AuthMiddleware, RolController.deleteRol);

export { router as RolRoutes };
