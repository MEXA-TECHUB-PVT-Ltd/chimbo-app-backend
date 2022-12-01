import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

export default model(
    "OTP",
    new Schema(
        {
            userId: {
                type: Types.ObjectId,
                required: [true, "user id is required"],

            },
            otp: {
                type: Number,
                required: true,
            }
        },

    )
);
