import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
        },
        user: {
            _id: String,
        },
        text: {
            type: String,
        },
        msg_type: {
            type: String,
            enum: ["text", "image", "video"]
        },
        public_id: String,
    },
    {
        timestamps: true,
    }
);

const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel
