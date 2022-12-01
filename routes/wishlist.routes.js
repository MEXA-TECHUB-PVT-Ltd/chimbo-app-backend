import { Router } from "express";
const route = Router();
import { add, getAll, get, del, getByUser } from "../controllers/wishlistController.js";
import auth from "../middleware/auth.js";

/***************Routes************/
route.get("/getAll", getAll);
route.get("/get/:id", get);

route.get("/getByUser/:userId", getByUser);
route.put("/add", add);
route.delete("/delete/:id", del);

export default route;
