import { Router } from "express";
const route = Router();

import { createChat, findChat, userChats } from "../controllers/chatController.js"


route.post('/', createChat);
route.get('/:userId', userChats);

route.get('/find/:firstId/:secondId', findChat);


/***************Routes************/


export default route;

