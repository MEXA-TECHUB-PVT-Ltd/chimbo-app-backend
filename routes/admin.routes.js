import { Router } from "express";
const route = Router();
import imageUploader from "../utils/profilePictureUploader.js";
import { add, login, updatePassword, getByEmail, verifyOtp, changePassword, uploadPfp, getByID, update } from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

/***************Routes************/
route.put("/add", add);
route.post("/login", login);

route.patch("/update-password", auth, updatePassword);
route.post("/getByEmail", getByEmail);
route.get("/get/:id", getByID);
route.patch("/update-admin", update);
route.post("/verifyOtp", verifyOtp);
route.patch("/changePassword", changePassword);
route.put(
    "/uploadPfp",
    [(...rest) => imageUploader("profile-photo", ...rest)],
    uploadPfp
);
export default route;
