import express from "express";
import { UserController } from "../controllers";
const router = express.Router();

router
    .get("/authenticate", UserController.authenticate)
    .post("/login", UserController.login)
    .post("/register", UserController.register);

export { router as UserRoute };
