import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: false,
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
        required: false,
    },
    phoneNo: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
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
    loginType:{
        type: String,
        required: false,
    }
});

export default model("Users", userSchema);
