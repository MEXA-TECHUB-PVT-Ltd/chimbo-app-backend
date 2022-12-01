import { Router } from "express";
const route = Router();
import path from 'path';
import multer from 'multer';
import { add, login, updatePassword, getByEmail, verifyOtp, changePassword, getByID, update } from "../controllers/adminController.js";
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
/***************Routes************/
route.put("/add", add);
route.post("/login", login);

route.patch("/update-password", updatePassword);
route.post("/getByEmail", getByEmail);
route.get("/get/:id", getByID);
route.patch("/update-admin", update);
route.post("/verifyOtp", verifyOtp);
route.patch("/changePassword", changePassword);
route.put("/uploadPfp", upload.single('profile-photo'), (req, res) => {
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
