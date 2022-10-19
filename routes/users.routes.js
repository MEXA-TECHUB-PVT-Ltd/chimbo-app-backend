// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
import { Router } from "express";
const route = Router();
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
    uploadPfp,
} from "../controllers/userController.js";

import imageUploader from "../utils/profilePictureUploader.js";
import auth from "../middleware/auth.js";

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
route.patch("/changePassword", changePassword);
route.put(
    "/uploadPfp",
    [auth, (...rest) => imageUploader("profile-photo", ...rest)],
    uploadPfp
);

export default route;
