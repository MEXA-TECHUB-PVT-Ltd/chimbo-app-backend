import floorModel from "../models/floorModel.js";
import listingModel from "../models/listingModel.js";
import userModel from "../models/userModel.js";
import wishlistModel from "../models/wishlistModel.js";
import WishListItems from "../models/wishlistModel.js";
import catchAsync from "../utils/catchAsync.js";

export const add = catchAsync(async (req, res) => {
    const { listingId, userId } = req.body;
    const existing = await WishListItems.findOne({ listingId, userId });

    if (existing) {
        return res.json({
            success: false,
            status: 400,
            message: "Item already added",
        });
    }

    const wishListItem = await WishListItems.create({ listingId, userId });
    if (!wishListItem) {
        return res.json({
            success: false,
            status: 500,
            message: "Item could not be added",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Item added successfully",
        wishListItem,
    });
});

export const getAll = catchAsync(async (_, res) => {
    const wishListItems = await WishListItems.find();

    if (wishListItems.length > 0) {
        return res.json({
            success: true,
            status: 200,
            message: "Wish List Items found",
            wishListItems: wishListItems,
        });
    }
    return res.json({
        success: false,
        status: 404,
        message: "Wish List Items Not found",
    });
});

export const getByUser = catchAsync(async (req, res) => {
    const wishListItems = await WishListItems.find({ userId: req.params.userId });
    console.log(wishListItems);
    if (wishListItems.length == 0) {
        return res.json({
            success: false,
            status: 404,
            message: "Wish List Items Not found",

        });
    }

    for (let i = 0; i < wishListItems.length; i++) {
        var data = {};
        data = await listingModel.findOne({ _id: wishListItems[i].listingId }, "price beds m2 floor city streetName streetNo advertiser imagePaths floor")
        console.log(data);
        var obj = wishListItems[i].toObject();
        obj.listingDetails = data;

        var floors = {};
        var advertisers = {};
        if (obj.listingDetails?.floor !== undefined) {
            floors = await floorModel.findOne({ _id: obj.listingDetails.floor }, "name")
            obj.listingDetails.floor = floors;
        }
        else {
            obj.listingDetails?.floor === null ? null : "";
        }
        if (obj.listingDetails?.advertiser !== undefined) {
            advertisers = await userModel.findOne({ _id: obj.listingDetails.advertiser }, "phoneNo");
            console.log(advertisers);
            // var obj = wishListItems[i].listingDetails.toObject();
            obj.listingDetails.advertiser = advertisers;
            // wishListItems[i].listingDetails = obj;
        }
        else {
            obj.listingDetails?.advertiser === null ? null : "";
        }
        wishListItems[i] = obj

        console.log("hasnt");

    }

    // for (let i = 0; i < wishListItems.length; i++) {

    // }
    console.log(wishListItems);
    if (wishListItems.length < 0) {
        return res.json({
            success: false,
            status: 404,
            message: "Wish List Items Not found",

        });
    }


    return res.json({
        success: true,
        status: 200,
        message: "Wish List Items found",
        listing: wishListItems
    });
});

export const get = catchAsync(async (req, res) => {
    const wishListItem = await WishListItems.findOne({ _id: req.params.id });

    if (wishListItem) {
        return res.json({
            success: true,
            status: 200,
            message: "Wish List Item found",
            wishListItem: wishListItem,
        });
    }
    return res.json({
        success: false,
        status: 400,
        message: "Wish List Item Not found",
    });
});

export const del = catchAsync(async (req, res) => {
    const existing = await WishListItems.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Wish List Item not found",
        });
    }

    const deleted = await WishListItems.findByIdAndDelete(existing._id);
    if (!deleted) {
        return res.json({
            success: false,
            status: 500,
            message: "Wish List Item could not be deleted",
        });
    }

    return res.status(201).json({
        success: true,
        status: 200,
        message: "Wish List Item deleted successfully",
        wishListItem: deleted,
    });
});
