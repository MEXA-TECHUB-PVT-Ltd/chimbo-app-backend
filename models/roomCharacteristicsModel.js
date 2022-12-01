import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
    "RoomCharacteristics",
    new Schema(
        {
            name: {
                type: String,
                required: [true, "Room Characteristic Name is required"],
                unique: true,
            },
            // type: {
            //     type: String,
            //     required: [true, "Room Characteristic Type is required"],
            // },
        },
        {
            timestamps: true,
        }
    )
);
