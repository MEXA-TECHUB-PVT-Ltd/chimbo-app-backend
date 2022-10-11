import Floors from "../models/floorModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
    const existing = await Floors.findOne({ name: req.body.name });
    if (existing) {
        return res.json({
            success: false,
            status: 400,
            message: "Floor with this name already exists",
        });
    }

    const Floor = await Floors.create({ ...req.body });
    if (!Floor) {
        return res.json({
            success: false,
            status: 500,
            message: "Floor could not be created",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Floor added successfully",
        Floor,
    });
});

export const update = catchAsync(async (req, res, next) => {
    const existing = await Floors.findOne({ _id: req.body.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Floor not found",
        });
    }

    const Floor = await Floors.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (Floor) {
        return res.json({
            success: true,
            status: 200,
            message: "Floor updated successfully",
            Floor,
        });
    }

    return res.json({
        success: false,
        status: 404,
        message: "Floor could not be updated",
    });
});

export const getAll = catchAsync(async (req, res, next) => {
    const floors = await Floors.find();
    if (floors.length > 0) {
        return res.json({
            success: true,
            status: 200,
            message: "Floors found",
            floors,
        });
    }
    return res.json({
        success: false,
        status: 404,
        message: "Floors Not found",
    });
});

export const get = catchAsync(async (req, res, next) => {
    const Floor = await Floors.findOne({ _id: req.params.id });
    if (!Floor) {
        return res.json({
            success: false,
            status: 404,
            message: "Floors Not found",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Floor found",
        Floor,
    });
});

export const del = catchAsync(async (req, res, next) => {
    const existing = await Floors.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Floor not found",
        });
    }

    const deletedFloor = await Floors.findByIdAndDelete(existing._id);
    if (!deletedFloor) {
        return res.json({
            success: false,
            status: 500,
            message: "Floor could not be deleted",
        });
    }

    return res.status(201).json({
        success: true,
        status: 200,
        message: "Floor deleted successfully",
        Floor: deletedFloor,
    });
});
