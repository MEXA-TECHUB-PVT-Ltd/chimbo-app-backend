import { Router } from "express";
const route = Router();

import { createChat, findChat, userChats, getAllMsgs } from "../controllers/chatController.js"


route.post('/', createChat);
route.get('/:userId', userChats);
route.get('/all-msgs/:chatId', getAllMsgs);
route.get('/find/:firstId/:secondId', findChat);


/***************Routes************/


export default route;

