import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import { sendSseDataToClients } from "../../utils/sse.js";
import Notification from "../../models/Notification.js";

const updatedFriends = asyncHandler(async (req, res) => {
  const friendEmail = req.body.friendEmail;
  const option = req.body.option;
  const action = req.body.action;
  const notificationMessage = req.body.notificationMessage;
  const userEmail = req.email;

  if (action === "add") {
    await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { [option]: friendEmail } },
      { new: true }
    );
  } else if (action === "remove") {
    await User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { [option]: friendEmail } },
      { new: true }
    );
  }

  if (option === "friends") {
    if (action === "add") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $push: { [option]: userEmail } },
        { new: true }
      );
    } else if (action === "remove") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $pull: { [option]: userEmail } },
        { new: true }
      );
    }
  }

  if (option === "friendRequestSend") {
    if (action === "add") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $push: { friendRequestReceived: userEmail } },
        { new: true }
      );
    } else if (action === "remove") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $pull: { friendRequestReceived: userEmail } },
        { new: true }
      );
    }
  }

  if (option === "friendRequestReceived") {
    if (action === "add") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $push: { friendRequestSend: userEmail } },
        { new: true }
      );
    } else if (action === "remove") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $pull: { friendRequestSend: userEmail } },
        { new: true }
      );
    }
  }

  if (option === "followers") {
    if (action === "add") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $push: { followings: userEmail } },
        { new: true }
      );
    } else if (action === "remove") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $pull: { followings: userEmail } },
        { new: true }
      );
    }
  }

  if (option === "followings") {
    if (action === "add") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $push: { followers: userEmail } },
        { new: true }
      );
    } else if (action === "remove") {
      await User.findOneAndUpdate(
        { email: friendEmail },
        { $pull: { followers: userEmail } },
        { new: true }
      );
    }
  }

  res.json({ message: "friends updated" });

  if (notificationMessage !== "" && notificationMessage !== undefined) {
    const notification = new Notification({
      userEmail: friendEmail,
      message: notificationMessage,
      time: new Date(Date.now()).toLocaleString(),
      isSeen: false,
    });

    await notification.save();
    sendSseDataToClients(notificationMessage, friendEmail);
  }
});

export default updatedFriends;
