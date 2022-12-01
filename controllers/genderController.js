import Genders from "../models/genderModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
    const existing = await Genders.findOne({ name: req.body.name });
    if (existing) {
        return res.json({
            success: false,
            status: 400,
            message: "Gender with this name already exists",
        });
    }

    const gender = await Genders.create({ ...req.body });
    if (!gender) {
        return res.json({
            success: false,
            status: 500,
            message: "Gender could not be created",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Gender added successfully",
        gender,
    });
});

export const update = catchAsync(async (req, res, next) => {
    const existing = await Genders.findOne({ _id: req.body.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Gender not found",
        });
    }

    const gender = await Genders.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (gender) {
        return res.json({
            success: true,
            status: 200,
            message: "Gender updated successfully",
            gender,
        });
    }

    return res.json({
        success: false,
        status: 404,
        message: "Gender could not be updated",
    });
});

export const getAll = catchAsync(async (req, res, next) => {
    const genders = await Genders.find();
    if (genders.length > 0) {
        return res.json({
            success: true,
            status: 200,
            message: "Genders found",
            genders,
        });
    }
    return res.json({
        success: false,
        status: 404,
        message: "Genders Not found",
    });
});

export const get = catchAsync(async (req, res, next) => {
    const gender = await Genders.findOne({ _id: req.params.id });
    if (!gender) {
        return res.json({
            success: false,
            status: 404,
            message: "Genders Not found",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Gender found",
        gender,
    });
});

export const del = catchAsync(async (req, res, next) => {
    const existing = await Genders.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Gender not found",
        });
    }

    const deletedGender = await Genders.findByIdAndDelete(existing._id);
    if (!deletedGender) {
        return res.json({
            success: false,
            status: 500,
            message: "Gender could not be deleted",
        });
    }

    return res.status(201).json({
        success: true,
        status: 200,
        message: "Gender deleted successfully",
        gender: deletedGender,
    });
});
