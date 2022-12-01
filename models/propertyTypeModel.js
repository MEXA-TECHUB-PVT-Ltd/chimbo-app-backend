import mongoose from "mongoose";
const { Schema, model } = mongoose;

const propertyTypeSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Property Type Name is required"],
            unique: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model("PropertyType", propertyTypeSchema);

