import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
    "OccupationTypes",
    new Schema(
        {
            name: {
                type: String,
                required: [true, "Occupation Type Name is required"],
                unique: true,
            },
        },
        {
            timestamps: true,
        }
    )
);
