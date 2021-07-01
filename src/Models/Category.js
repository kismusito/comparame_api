import { Schema, model , Types} from "mongoose";

const categorySchema = new Schema({
    category_name: {
        type: String,
        require: true,
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

export default model("Category", categorySchema);
