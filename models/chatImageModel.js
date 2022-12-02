import mongoose from "mongoose"

const chatImgSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        imagePath: {
            type: String

        },
    },
    {
        timestamps: true,
    }
);

const chatImageModel = mongoose.model("chatImages", chatImgSchema);
export default chatImageModel
