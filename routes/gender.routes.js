import { Router } from "express";
const route = Router();
import { add, update, getAll, get, del } from "../controllers/genderController.js";
import auth from "../middleware/auth.js";

/***************Routes************/
route.get("/getAll", getAll);
route.get("/get/:id", get);

route.put("/add", add);
route.patch("/update", update);
route.delete("/delete/:id", del);

export default route;
