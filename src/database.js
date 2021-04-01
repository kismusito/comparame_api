import mongoose from "mongoose";
import dotenv from "dotenv";

// Get environment variables
dotenv.config();

const db = mongoose.connection;

const uri =
    process.env.ENVIRONMENT === "production"
        ? process.env.URI_PROD
        : process.env.URI_DEV;

(() => {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    db.on("open", () => {
        console.log("Database connect successfully.");
    });

    db.on("error", (err) => {
        throw err;
    });
})();
