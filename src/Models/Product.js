import { Schema, model, Types } from "mongoose";

const productSchema = new Schema({
    categories: [
        {
            type: Types.ObjectId,
            ref: "Category",
        },
    ],
    supermarket: {
        type: Types.ObjectId,
        ref: "Supermarket",
    },
    product_name: {
        type: String,
        require: true,
    },
    product_price: {
        type: Number,
        require: true,
        default: 0,
    },
    product_status: {
        type: Boolean,
        default: true,
    },
    product_discount: {
        type: Number,
        default: 0,
    },
    product_feautered: {
        type: Boolean,
        default: false,
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

export default model("Product", productSchema);
