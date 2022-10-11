import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
    "Floors",
    new Schema(
        {
            name: {
                type: String,
                required: [true, "Floor Name is required"],

            },
        },
        {
            timestamps: true,
        }
    )
);
