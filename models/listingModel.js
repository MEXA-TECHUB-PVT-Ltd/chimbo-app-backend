import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const listingSchema = Schema({
    listingTypeId: {
        type: Types.ObjectId,
        required: [true, "Listing Type is Required"],
    },
    propertyTypeId: {
        type: Types.ObjectId,
        required: true,
    },
    videoPath: {
        type: String,
        required: false,
    },
    video3DPath: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: true,
    },
    streetName: {
        type: String,
        required: true,
    },
    streetNo: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    heatingTypeId: {
        type: Types.ObjectId,
        required: [true, "Required Heating Type"],
    },
    availableFrom: {
        type: Date,
        required: true,
    },
    roomSharedWith: {
        type: Number,
        required: false,
    },
    currentResidentCount: {
        type: Number,
        required: false,
    },
    isOwnerLivingInProperty: {
        type: Boolean,
        required: true,
    },
    genderPreferenceId: {
        type: Types.ObjectId,
        required: false,
    },
    occupationTypeId: {
        type: Array,
        required: false,
    },
    minStay: {
        type: String,
        required: true,
    },
    communityFee: {
        type: Number,

    },
    deposit: {
        type: Number,

    },
    selectedSpecifications: {
        type: Array,
        required: true,
    },
    imagePaths: {
        type: Array,
        required: true,
    },
    selectedRoomCharacteristics: {
        type: Array,
        required: true,
    },
    selectedFeatures: {
        type: Array,
        required: true,
    },
    selectedAccessibilityItems: {
        type: Array,

    },
    location: {
        type: { type: String },
        coordinates: [],
    },
    advertiser: {
        type: Types.ObjectId,
        required: true,
    },
    beds: {
        type: Number,
        required: true
    },
    baths: {
        type: Number,
        required: true
    },
    m2: {
        type: Number,
        required: true
    },
    rAddress: {
        type: String,

    },
    email: {
        type: String
    },
    phone: {
        type: Number,
    },
    yourName: {
        type: String
    },
    pContact: {
        type: Number
    },
    floor: {
        type: Types.ObjectId,
        ref: "Floors"
    },
    addedBy: {
        type: String,
        default: "user"
    }


},
    {
        timestamps: true
    });

listingSchema.index({ location: "2dsphere" });

export default model("generalListing", listingSchema);
