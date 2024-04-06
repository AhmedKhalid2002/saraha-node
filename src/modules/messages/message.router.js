import { Router } from "express";
import { isAuthuntication } from "../../middlewares/authuntication.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { messageSchema } from "./message.schema.js";
import * as messageController from "./message.controller.js";
const messageRouter=Router()

messageRouter.post("/createMessage",isAuthuntication,validation(messageSchema),messageController.createMessage);

messageRouter.delete("/:id",isAuthuntication,messageController.deleteMessage)

messageRouter.put("/:id",isAuthuntication,messageController.readMessage)

messageRouter.get("/",isAuthuntication,messageController.allMessage)


export default messageRouter;