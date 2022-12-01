import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
    "Genders",
    new Schema(
        {
            name: {
                type: String,
                required: [true, "Gender Name is required"],
                unique: true,
            },
        },
        {
            timestamps: true,
        }
    )
);
