import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const savedSearchSchema = Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
    },
    query: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default model(
    "SavedSearch",
    savedSearchSchema
);
