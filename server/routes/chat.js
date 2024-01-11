import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import getChatUsers from "../controllers/chat/getChatUsers.js";
import upload from "../middlewares/multer.js";
import createChat from "../controllers/chat/createChat.js";
import getChats from "../controllers/chat/getChats.js";
import editChat from "../controllers/chat/editChat.js";
import deleteChat from "../controllers/chat/deleteChat.js";

const router = express.Router();

router.get("/getChatUsers", verifyJWT, getChatUsers);
router.post(
  "/createChat",
  [verifyJWT, upload.array("chatAttachments")],
  createChat
);
router.put("/editChat", [verifyJWT, upload.array("chatAttachments")], editChat);
router.delete("/deleteChat/:chatId", verifyJWT, deleteChat);
router.get("/getChats/:userId2", verifyJWT, getChats);

export default router;