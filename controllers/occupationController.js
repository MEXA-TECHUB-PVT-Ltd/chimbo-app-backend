import OccupationTypes from "../models/occupationTypeModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
    const existing = await OccupationTypes.findOne({ name: req.body.name });
    if (existing) {
        return res.json({
            success: false,
            status: 400,
            message: "Occupation Type with this name already exists",
        });
    }

    const occupationType = await OccupationTypes.create({ ...req.body });
    if (!occupationType) {
        return res.json({
            success: false,
            status: 500,
            message: "Occupation Type could not be created",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Occupation Type added successfully",
        occupationType,
    });
});

export const update = catchAsync(async (req, res, next) => {
    const existing = await OccupationTypes.findOne({ _id: req.body.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Occupation Type not found",
        });
    }

    const occupationType = await OccupationTypes.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (occupationType) {
        return res.json({
            success: true,
            status: 200,
            message: "Occupation Type updated successfully",
            occupationType,
        });
    }

    return res.json({
        success: false,
        status: 500,
        message: "Occupation Type could not be updated",
    });
});

export const getAll = catchAsync(async (req, res, next) => {
    const occupationTypes = await OccupationTypes.find();
    if (occupationTypes.length > 0) {
        return res.json({
            success: true,
            status: 200,
            message: "Occupation Types found",
            occupationTypes,
        });
    }
    return res.json({
        success: false,
        status: 404,
        message: "Occupation Types Not found",
    });
});

export const get = catchAsync(async (req, res, next) => {
    const occupationType = await OccupationTypes.findOne({ _id: req.params.id });
    if (!occupationType) {
        return res.json({
            success: false,
            status: 404,
            message: "Occupation Type Not found",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Occupation Type found",
        occupationType,
    });
});

export const del = catchAsync(async (req, res, next) => {
    const existing = await OccupationTypes.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Occupation Type not found",
        });
    }

    const occupationType = await OccupationTypes.findByIdAndDelete(existing._id);
    if (!occupationType) {
        return res.json({
            success: false,
            status: 500,
            message: "Occupation Type could not be deleted",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Occupation Type deleted successfully",
        occupationType,
    });
});
