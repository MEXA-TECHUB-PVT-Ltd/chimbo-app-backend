// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
import { Router } from "express";
const route = Router();
import path from 'path';
import multer from 'multer';
import {
    login,
    add,
    update,
    updatePassword,
    get,
    del,
    block,
    unblock,
    verifyOtp,
    getAll,
    getByEmail,
    changePassword,
    updateUserData,
    uploadPfp,
} from "../controllers/userController.js";

import imageUploader from "../utils/profilePictureUploader.js";
import auth from "../middleware/auth.js";
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
route.get("/getAll", getAll);
route.get("/get/:id", get);
route.put("/add", add);
route.post("/login", login);

route.patch("/update", update);
route.patch("/update-password", updatePassword);
route.delete("/delete/:id", del);
route.patch("/block", block);
route.patch("/unblock", unblock);
route.post("/getByEmail", getByEmail);
route.post("/verifyOtp", verifyOtp);
route.put("/updateUserData", updateUserData)

route.patch("/changePassword", changePassword);
route.put( "/uploadPfp" ,upload.single('profile-photo'), (req, res) => {
        try {
            const imageUpload = req.file.path
            console.log(req.file.path)
            if(req.file.path===null){
                res.json({message:"Only Image File Allowed"})
            }else{
                res.json(imageUpload)
            }
        } catch (error) {
            res.send(error)
        }
    });

export default route;
