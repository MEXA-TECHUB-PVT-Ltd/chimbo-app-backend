import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    genderId: {
        type: Types.ObjectId,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    pfp: {
        type: String,
        required: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
});

export default model("Users", userSchema);
