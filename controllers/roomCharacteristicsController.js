import RoomCharacteristics from "../models/roomCharacteristicsModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
    const existing = await RoomCharacteristics.findOne({ name: req.body.name });
    if (existing) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Room Characteristics with this name already exists",
        });
    }

    const roomCharacteristic = await RoomCharacteristics.create({ ...req.body });
    if (!roomCharacteristic) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Room Characteristic could not be created",
        });
    }

    return res.status(200).json({
        success: true,
        status: 200,
        message: "Room Characteristic added successfully",
        roomCharacteristic,
    });
});

export const update = catchAsync(async (req, res, next) => {
    const existing = await RoomCharacteristics.findOne({ _id: req.body.id });
    if (!existing) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Room Characteristic not found",
        });
    }

    const roomCharacteristic = await RoomCharacteristics.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
            type: req.body.type,
        },
        { new: true }
    );

    if (roomCharacteristic) {
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Room Characteristics updated successfully",
            roomCharacteristic,
        });
    }

    return res.status(500).json({
        success: false,
        status: 500,
        message: "Room Characteristics could not be updated",
    });
});

export const getAll = catchAsync(async (req, res, next) => {
    const roomCharacteristics = await RoomCharacteristics.find();
    if (roomCharacteristics.length > 0) {
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Room Characteristics found",
            roomCharacteristics,
        });
    }
    return res.status(404).json({
        success: false,
        status: 404,
        message: "Room Characteristics Not found",
    });
});

export const get = catchAsync(async (req, res, next) => {
    const roomCharacteristic = await RoomCharacteristics.findOne({
        _id: req.params.id,
    });
    if (!roomCharacteristic) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Room Characteristics Not found",
        });
    }

    return res.status(200).json({
        success: true,
        status: 200,
        message: "Room Characteristics found",
        roomCharacteristic,
    });
});

export const del = catchAsync(async (req, res, next) => {
    const existing = await RoomCharacteristics.findOne({ _id: req.params.id });
    if (!existing) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Room Characteristics not found",
        });
    }

    const roomCharacteristic = await RoomCharacteristics.findByIdAndDelete(
        existing._id
    );
    if (!roomCharacteristic) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Room Characteristics could not be deleted",
        });
    }

    return res.status(200).json({
        success: true,
        status: 200,
        message: "Room Characteristics deleted successfully",
        roomCharacteristic,
    });
});
