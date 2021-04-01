import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { PlanRoutes, UserRoute, RolRoutes } from "./routes";

// Use only in development mode.
import morgan from "morgan";

const app = express();

// Allow origins cors
app.use(cors());

// Set more security on requests
app.use(helmet());

// Help with routes information
app.use(morgan("combined"));

// Set default storage
app.use(express.static(path.join(__dirname, "../public")));

// Allow and parse json objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set routes
app.use("/plan", PlanRoutes);
app.use("/user", UserRoute);
app.use("/rol", RolRoutes);

export default app;
