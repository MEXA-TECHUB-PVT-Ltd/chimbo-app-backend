import Specifications from "../models/specificationTypeModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res) => {
    const existing = await Specifications.findOne({ name: req.body.name });
    if (existing) {
        return res.json({
            success: false,
            status: 400,
            message: "Specification with this name already exists",
        });
    }

    const specification = await Specifications.create({ ...req.body });
    if (!specification) {
        return res.json({
            success: false,
            status: 500,
            message: "Specification could not be created",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Specification added successfully",
        specification,
    });
});

export const update = catchAsync(async (req, res) => {
    const existing = await Specifications.findOne({ _id: req.body.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Specification not found",
        });
    }

    const specification = await Specifications.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
            type: req.body.type,
        },
        { new: true }
    );

    if (specification) {
        return res.json({
            success: true,
            status: 200,
            message: "Specification updated successfully",
            specification,
        });
    }

    return res.json({
        success: false,
        status: 500,
        message: "Specification could not be updated",
    });
});

export const getAll = catchAsync(async (req, res) => {
    const specifications = await Specifications.find();
    if (specifications.length > 0) {
        return res.json({
            success: true,
            status: 200,
            message: "Specifications found",
            specifications,
        });
    }
    return res.json({
        success: false,
        status: 404,
        message: "Specifications Not found",
    });
});

export const get = catchAsync(async (req, res) => {
    const specification = await Specifications.findOne({ _id: req.params.id });
    if (!specification) {
        return res.json({
            success: false,
            status: 404,
            message: "Specification Not found",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Specification found",
        specification,
    });
});

export const del = catchAsync(async (req, res) => {
    const existing = await Specifications.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Speicfication not found",
        });
    }

    const specification = await Specifications.findByIdAndDelete(existing._id);
    if (!specification) {
        return res.json({
            success: false,
            status: 500,
            message: "Specification could not be deleted",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Speicfication deleted successfully",
        specification,
    });
});
