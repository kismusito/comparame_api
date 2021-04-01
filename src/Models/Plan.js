import { Schema, model } from "mongoose";

const planSchema = new Schema({
    plan_total_featured_projects: {
        type: Number,
        default: 0,
    },
    plan_price: {
        type: Number,
        required: true,
        default: 0,
    },
    plan_name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        default: 1,
    },
});

export default model("Plan", planSchema);
