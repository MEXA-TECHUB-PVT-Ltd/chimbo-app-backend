import express from 'express';
const router = express.Router();

import auth from "../middleware/auth.js";

import imageUploader from "../utils/listingImageUploader.js";
import videoUploader from "../utils/listingVideoUploader.js";
import chklisting from '../middleware/listingMiddleware.js';
import {
    getAll, get, add, del, update, getListingsInsidePolygon, filter, uploadImages, getCountOfDocs,
    getByUser, uploadVideo, getIDs, searchByCity, chartData
} from "../controllers/listingController.js";

// Routes
router.get("/getAll", getAll);
router.post("/charData", chartData);
router.get("/getCount", getCountOfDocs);
router.post("/getInPolygon", getListingsInsidePolygon);
router.get("/getIDs", getIDs);
router.get("/getByUser/:id", getByUser);
router.post("/get/:id", get);
router.post("/filter", auth, filter);
router.post("/searchByCity", searchByCity);

router.post(
    "/upload-images",
    [(...rest) => imageUploader("listing-images", 10, ...rest)],
    uploadImages
);
router.post(
    "/upload-video",
    [auth, (...rest) => videoUploader("listing-video", ...rest)],
    uploadVideo
);

router.put("/add", chklisting, add);
router.delete("/delete/:id", del);
router.patch("/update", auth, update);

export default router;
