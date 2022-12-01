import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";

const storage = multer.diskStorage({
    destination: "public/images/listings",
    filename: (_, file, cb) => {
        cb(null, uuidv4() + "_" + Date.now() + extname(file.originalname));
    },
});

const fileFilter = (_, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "video/mp4",
        "video/mov",
        "video/avi",
        "video/mkv",
        "video/flv",
        "video/wmv",
        "video/ogg",
        "video/svg",
        "video/avchd",
        "video/f4v",
        "video/swf",
        "video/webm",
        "video/mpeg-2",];
    if (!allowedTypes.includes(file.mimetype)) {

        cb(new Error("File Format not supported"), false);

    }
    else {
        cb(null, true);
    }
};

const uploader = multer({ storage, fileFilter });

export default (fieldName, maxCount, req, res, next) => {

    const upload = uploader.array(fieldName, maxCount);

    upload(req, res, (e) => {
        try {
            if (e instanceof multer.MulterError) {
                throw e;
            } else if (e) {
                throw "File format not supported";
            }
            next();
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    });
};


// // localhost:3000/api/accessibility-items/add
// localhost:3000/api/genders/add
// localhost:3000/api/heating-types/add
// localhost:3000/api/listing-features/add
// localhost:3000/api/listings/upload-images
// localhost:3000/api/listings/upload-video
// localhost:3000/api/listing-types/add
// localhost:3000/api/occupation-types/add
// localhost:3000/api/property-types/add
// localhost:3000/api/room-characteristics/add
// localhost:3000/api/specifications/add
// localhost:3000/api/user/add
// localhost:3000/api/wishlist/add