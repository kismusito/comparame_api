import { model, Schema, Types } from "mongoose";

const supermarketSchema = new Schema({
    supermarketName: {
        type: String,
    },
    userID: {
        type: Types.ObjectId,
        ref: "User",
    },
    plans: {
        type: Types.ObjectId,
        ref: "Plan",
    },
    supermarketLogo: {
        path: String,
        name: String,
    },
    headsquares: [
        {
            headsquareName: {
                type: String,
                required: true,
            },
            headSquareImage: {
                path: String,
                name: String,
            },
            isMainHeadsquare: Boolean,
            headsquareLocation: {
                latitude: String,
                longitude: String,
            },
        },
    ],
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
        default: null,
    },
});

export default model("Supermarket", supermarketSchema);
