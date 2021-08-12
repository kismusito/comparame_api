import { Schema, model, Types } from "mongoose";

const productListSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
});

export default model("ProductList", productListSchema);
