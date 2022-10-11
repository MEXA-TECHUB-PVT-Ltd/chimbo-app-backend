import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const wishListItemSchema = Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
    },
    listingId: {
        type: Types.ObjectId,
        required: true,
    },
}, { timestamps: true });

export default model("WishListItem", wishListItemSchema);
