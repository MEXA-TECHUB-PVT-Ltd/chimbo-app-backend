import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
    "ListingFeatures",
    new Schema(
        {
            name: {
                type: String,
                required: [true, "Listing Feature Name is required"],
                unique: true,
            },
        },
        {
            timestamps: true,
        }
    )
);
