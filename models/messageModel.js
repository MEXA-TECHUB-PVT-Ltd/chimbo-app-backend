import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        text: {
            type: String,
        },
        msg_type: {
            type: String,
            enum: ["text", "image", "video"]
        },
        time: {
            type: Date
        },
        public_id: String,
    },
    {
        timestamps: true,
    }
);

const MessageModel = mongoose.model("Message2", MessageSchema);
export default MessageModel
