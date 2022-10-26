

import { Router } from "express";
const route = Router();
import {
    getChatImages,
    addChatImage,



} from "../controllers/chatImageController.js";

route.get("/:chatId", getChatImages)
route.post("/", addChatImage)


export default route;