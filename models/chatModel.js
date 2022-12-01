import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        members: [mongoose.Schema.Types.ObjectId]
    },
    {
        timestamps: true,
    }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel
