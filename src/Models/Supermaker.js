import { model, Schema } from "mongoose";

const supermarkerSchema = new Schema({
    supermakerName: {
        type: String,
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
        default: null,
    },
});

export default model("Supermaker", supermarkerSchema);
