import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
    "ListingTypes",
    new Schema(
        {
            name: {
                type: String,
                required: [true, "Listing Type Name is required"],
                unique: true,
            },
        },
        {
            timestamps: true,
        }
    )
);
