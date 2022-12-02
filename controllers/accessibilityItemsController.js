import AccessibilityItems from "../models/accessibilityItemModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
    const existing = await AccessibilityItems.findOne({ name: req.body.name });
    if (existing) {
        return res.json({
            success: false,
            status: 400,
            message: "Accessibility Item with this name already exists",
        });
    }

    const accessibilityItem = await AccessibilityItems.create({ name: req.body.name });
    if (!accessibilityItem) {
        return res.json({
            success: false,
            status: 500,
            message: "Accessibility Item could not be created",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Accessibility Item added successfully",
        accessibilityItem,
    });
});

export const update = catchAsync(async (req, res, next) => {
    const existing = await AccessibilityItems.findOne({ _id: req.body.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Accessibility Item not found",
        });
    }

    const accessibilityItem = await AccessibilityItems.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (accessibilityItem) {
        return res.json({
            success: true,
            status: 200,
            message: "Accessibility Item updated successfully",
            accessibilityItem,
        });
    }

    return res.json({
        success: false,
        status: 500,
        message: "Accessibility Item could not be updated",
    });
});

export const getAll = catchAsync(async (req, res, next) => {
    const accessibilityItems = await AccessibilityItems.find();
    if (accessibilityItems.length > 0) {
        return res.json({
            success: true,
            status: 200,
            message: "Accessibility Items found",
            accessibilityItems,
        });
    }
    return res.json({
        success: false,
        status: 404,
        message: "Accessibility Items Not found",
    });
});

export const get = catchAsync(async (req, res, next) => {
    const accessibilityItem = await AccessibilityItems.findOne({ _id: req.params.id });
    if (!accessibilityItem) {
        return res.json({
            success: false,
            status: 404,
            message: "Accessibility Item Not found",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Accessibility Item found",
        accessibilityItem,
    });
});

export const del = catchAsync(async (req, res, next) => {
    const existing = await AccessibilityItems.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Accessibility Item not found",
        });
    }

    const accessibilityItem = await AccessibilityItems.findByIdAndDelete(existing._id);
    if (!accessibilityItem) {
        return res.json({
            success: false,
            status: 500,
            message: "Accessibility Item could not be deleted",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Accessibility Item deleted successfully",
        accessibilityItem,
    });
});
