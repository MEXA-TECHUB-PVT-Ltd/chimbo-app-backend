import ListingFeatures from "../models/listingFeaturesModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
    const existing = await ListingFeatures.findOne({ name: req.body.name });
    if (existing) {
        return res.json({
            success: false,
            status: 400,
            message: "Listing Feature with this name already exists",
        });
    }

    const listingFeature = await ListingFeatures.create({ ...req.body });
    if (!listingFeature) {
        return res.json({
            success: false,
            status: 500,
            message: "Listing Feature could not be created",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Listing Feature added successfully",
        listingFeature,
    });
});

export const update = catchAsync(async (req, res, next) => {
    const existing = await ListingFeatures.findOne({ _id: req.body.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Listing Feature not found",
        });
    }

    const listingFeature = await ListingFeatures.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (listingFeature) {
        return res.json({
            success: true,
            status: 200,
            message: "Listing Feature updated successfully",
            listingFeature,
        });
    }

    return res.json({
        success: false,
        status: 500,
        message: "Listing Feature could not be updated",
    });
});

export const getAll = catchAsync(async (req, res, next) => {
    const listingFeatures = await ListingFeatures.find();
    if (listingFeatures.length > 0) {
        return res.json({
            success: true,
            status: 200,
            message: "Listing Features found",
            listingFeatures,
        });
    }
    return res.json({
        success: false,
        status: 404,
        message: "Listing Feature Not found",
    });
});

export const get = catchAsync(async (req, res, next) => {
    const listingFeature = await ListingFeatures.findOne({ _id: req.params.id });
    if (!listingFeature) {
        return res.json({
            success: false,
            status: 404,
            message: "Listing Feature Not found",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Listing Feature found",
        listingFeature,
    });
});

export const del = catchAsync(async (req, res, next) => {
    const existing = await ListingFeatures.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Listing Feature not found",
        });
    }

    const listingFeature = await ListingFeatures.findByIdAndDelete(existing._id);
    if (!listingFeature) {
        return res.json({
            success: false,
            status: 500,
            message: "Listing Feature could not be deleted",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Listing Feature deleted successfully",
        listingFeature,
    });
});
