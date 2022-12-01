import ListingTypes from "../models/listingTypeModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res) => {
    const existing = await ListingTypes.findOne({ name: req.body.name });
    if (existing) {
        return res.json({
            success: false,
            message: "Listing Type with this name already exists",
        });
    }

    const listingType = await ListingTypes.create({ ...req.body });
    if (!listingType) {
        return res.json({
            success: false,
            message: "Listing Type could not be created",
        });
    }

    return res.json({
        success: true,
        message: "Listing Type added successfully",
        listingType,
    });
});

export const update = catchAsync(async (req, res) => {
    const existing = await ListingTypes.findOne({ _id: req.body.id });
    if (!existing) {
        return res.json({
            success: false,
            message: "Listing Type not found",
        });
    }

    const listingType = await ListingTypes.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (listingType) {
        return res.json({
            success: true,
            message: "Listing Type updated successfully",
            listingType,
        });
    }

    return res.json({
        success: false,
        message: "Listing Type could not be updated",
    });
});

export const getAll = catchAsync(async (req, res) => {
    const listingTypes = await ListingTypes.find();
    if (listingTypes.length > 0) {
        return res.json({
            success: true,
            message: "Listing Types found",
            listingTypes,
        });
    }
    return res.json({
        success: false,
        message: "Listing Types Not found",
    });
});

export const get = catchAsync(async (req, res) => {
    const listingType = await ListingTypes.findOne({ _id: req.params.id });
    if (!listingType) {
        return res.json({
            success: false,
            message: "Listing Type Not found",
        });
    }

    return res.json({
        success: true,
        message: "Listing Type found",
        listingType,
    });
});

export const del = catchAsync(async (req, res) => {
    const existing = await ListingTypes.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            message: "Listing Type not found",
        });
    }

    const listingType = await ListingTypes.findByIdAndDelete(existing._id);
    if (!listingType) {
        return res.json({
            success: false,
            message: "Listing Type could not be deleted",
        });
    }

    return res.json({
        success: true,
        message: "Listing Type deleted successfully",
        listingType,
    });
});
