

import { Router } from "express";
const route = Router();
import {
    addMessage,
    getMessages,
    deleteMessage,


} from "../controllers/messageController.js";
route.post('/', addMessage);
route.get('/:chatId', getMessages);
route.delete("/:m_id", deleteMessage)

export default route;