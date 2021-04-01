import app from "./app";
import dotenv from "dotenv";
import "./database";
import "@babel/polyfill";

dotenv.config();

(async () => {
    app.listen(process.env.PORT || 4000);
    console.log(`App listening on port ${process.env.PORT}`);
})();
