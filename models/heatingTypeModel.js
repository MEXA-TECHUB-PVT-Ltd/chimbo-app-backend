import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
    "HeatingTypes",
    new Schema(
        {
            name: {
                type: String,
                required: [true, "Heating Type Name is required"],
                unique: true,
            },
        },
        {
            timestamps: true,
        }
    )
);
