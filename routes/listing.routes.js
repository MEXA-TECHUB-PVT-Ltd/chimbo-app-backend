import express from 'express';
import path from 'path';
import multer from 'multer';
const router = express.Router();
import chklisting from '../middleware/listingMiddleware.js';
import {
    getAll, get, add, del, update, getListingsInsidePolygon, filter, uploadImages, getCountOfDocs,
    getByUser, uploadVideo, getIDs, searchByCity, chartData,getIDsByLocation,AddLikeByUserId
} from "../controllers/listingController.js";
// Upload Image 
const multerMiddleWareStorage = multer.diskStorage({
    destination: (req, res, callBack) => {
        callBack(null, 'image-uploads/')
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, callBack) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        callBack(null, true)
    } else {
        callBack(null, false)
    }
}

const upload = multer({
    storage: multerMiddleWareStorage,
    limits: {
        fileSize: 1000000000 // 1000000000 Bytes = 1000 MB 
    },
    fileFilter: fileFilter,
})
// Upload Video 
const multerMiddleWareStorageVideo = multer.diskStorage({
    destination: (req, res, callBack) => {
        callBack(null, 'video-uploads/')
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname))
    }
})
const fileFilterVideo = (req, file, callBack) => {
    if (!file.mimetype.match(/\.(mp4|MPEG-4|mkv)$/)) {
        callBack(null, true)
    } else {
        callBack(null, false)
    }
}
const uploadVideoData = multer({
    storage: multerMiddleWareStorageVideo,
    limits: {
        fileSize: 1000000000 // 1000000000 Bytes = 1000 MB 
    },
    fileFilter: fileFilterVideo,
})
// Routes
router.get("/getAll", getAll);
router.post("/charData", chartData);
router.get("/getCount", getCountOfDocs);
router.post("/getInPolygon", getListingsInsidePolygon);
router.get("/getIDs", getIDs);
router.post("/getByUser/:id", getByUser);
router.post("/get/:id", get);
router.get("/likeListing/:userId/:ListingId", AddLikeByUserId);

router.get("/get-listing-by-userID-location/:userId/:userLat/:userLong",getIDsByLocation);

router.post("/filter", filter);
router.post("/searchByCity", searchByCity);


router.post("/upload-images",upload.array('listing-images', 5), (req, res) => { // upload limit of 5 images
    try {
        const images = []
        req.files.filter(image => {
            images.push(image.path)
        })
        res.status(200).send({ images: images })
    } catch (error) {
        res.send(error)
    }
})
router.post("/upload-video", uploadVideoData.single('video'), (req, res) => {
    try {
        const videoUpload = req.file.path
        if(req.file.path===null){
            res.json({message:"Only Image File Allowed"})
        }else{
            res.json(videoUpload)
        }
    } catch (error) {
        res.send(error)
    }})

router.put("/add", chklisting, add);
router.delete("/delete/:id", del);
router.patch("/update", update);

export default router;
