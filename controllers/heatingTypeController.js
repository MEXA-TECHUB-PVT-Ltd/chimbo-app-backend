import HeatingTypes from "../models/heatingTypeModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
    const existing = await HeatingTypes.findOne({ name: req.body.name });
    if (existing) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Heating Type with this name already exists",
        });
    }

    const heatingType = await HeatingTypes.create({ ...req.body });
    if (!heatingType) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Heating Type could not be created",
        });
    }

    return res.status(200).json({
        success: true,
        status: 200,
        message: "Heating Type added successfully",
        heatingType,
    });
});

export const update = catchAsync(async (req, res, next) => {
    const existing = await HeatingTypes.findOne({ _id: req.body.id });
    if (!existing) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Heating Type not found",
        });
    }

    const heatingType = await HeatingTypes.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (heatingType) {
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Heating Type updated successfully",
            heatingType,
        });
    }

    return res.status(500).json({
        success: false,
        status: 500,
        message: "Heating Type could not be updated",
    });
});

export const getAll = catchAsync(async (req, res, next) => {
    const heatingTypes = await HeatingTypes.find();
    if (heatingTypes.length > 0) {
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Heating Types found",
            heatingTypes,
        });
    }
    return res.status(404).json({
        success: false,
        status: 404,
        message: "Heating Types Not found",
    });
});

export const get = catchAsync(async (req, res, next) => {
    const heatingType = await HeatingTypes.findOne({ _id: req.params.id });
    if (!heatingType) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Heating Type Not found",
        });
    }

    return res.status(200).json({
        success: true,
        status: 200,
        message: "Heating Type found",
        heatingType,
    });
});

export const del = catchAsync(async (req, res, next) => {
    console.log(req);
    const existing = await HeatingTypes.findOne({ _id: req.params.id });
    if (!existing) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Heating Type not found",
        });
    }

    const heatingType = await HeatingTypes.findByIdAndDelete(existing._id);
    if (!heatingType) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Heating Type could not be deleted",
        });
    }

    return res.status(200).json({
        success: true,
        status: 200,
        message: "Heating Type deleted successfully",
        heatingType,
    });
});
