import mongoose from "mongoose";
const { Schema, model } = mongoose;

const accessibilityItemSchema = Schema({
    name: {
        type: String,
        required: true,
    },
});

export default model(
    "AccessibilityItem",
    accessibilityItemSchema
);
