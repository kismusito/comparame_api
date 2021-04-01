import { model, Schema } from "mongoose";
import { allowedRols } from "../config";

const rolSchema = new Schema({
    rolName: {
        type: String,
        enum: allowedRols,
        default: "client",
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
        default: new Date(),
    },
});

export default model("Rol", rolSchema);
