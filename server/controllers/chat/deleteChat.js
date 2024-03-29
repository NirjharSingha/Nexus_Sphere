import asyncHandler from "express-async-handler";
import InboxMessage from "../../models/InboxMessage.js";

const deleteChat = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const deletedChat = await InboxMessage.findByIdAndDelete(chatId);

    if (deletedChat) {
      res.status(200).json({
        message: "Chat deleted successfully",
        chat: deletedChat,
      });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default deleteChat;
