import express from "express";
import { PlanController } from "../controllers";
import { AuthMiddleware } from "../Middlewares";
const router = express.Router();

router
    .get("/", AuthMiddleware, PlanController.getPlans)
    .get("/:id", AuthMiddleware, PlanController.getPlan)
    .post("/", AuthMiddleware, PlanController.createPlan)
    .put("/", AuthMiddleware, PlanController.updatePlan)
    .delete("/", AuthMiddleware, PlanController.deletePlan);

export { router as PlanRoutes };
