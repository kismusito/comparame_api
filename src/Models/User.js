import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    rol: {
        type: Types.ObjectId,
        ref: "Rol",
        required: true,
    },
    plans: {
        type: Types.ObjectId,
        ref: "Plan",
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    age: Number,
    photo: {
        path: String,
        name: String,
        size: Number,
    },
    location: {
        latitude: Number,
        longitude: Number,
    },
    favorite_products: [
        {
            type: Types.ObjectId,
            ref: "Product"
        }
    ]
});

userSchema.methods.confirmPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.encryptPassword = async (password) => {
    
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export default model("User", userSchema);
