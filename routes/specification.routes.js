import { Router } from "express";
const route = Router();
import { add, update, getAll, get, del } from "../controllers/specificationController.js";
import auth from '../middleware/auth.js'

/***************Routes************/
route.get("/getAll", getAll);
route.get("/get/:id", get);

route.put("/add", auth, add);
route.patch("/update", auth, update);
route.delete("/delete/:id", auth, del);

export default route;
