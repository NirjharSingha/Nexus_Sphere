import React from "react";
import "./ChatCard.css";
import { BsThreeDots } from "react-icons/bs";
import { useState, useRef } from "react";
import jwtDecode from "jwt-decode";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaLaughSquint, FaSadCry, FaAngry } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import ChatCardSideBar from "./ChatCardSideBar";
import ChatLikes from "./ChatLikes";
import { useChat } from "../contexts/ChatContext";
import axios from "axios";

const ChatCard = ({ chat }) => {
  const [shouldDisplayAllLikes, setShouldDisplayAllLikes] = useState(false);
  const imageRef = useRef([]);
  const {
    _id,
    sender,
    receiver,
    messageText,
    messageAttachments,
    time,
    react,
    replyId,
    updatedAt,
    deletedAt,
  } = chat;

  const {
    selectedFiles,
    setSelectedFiles,
    inputValue,
    setInputValue,
    chats,
    setChats,
    chatToEdit,
    setChatToEdit,
    prevFiles,
    setPrevFiles,
  } = useChat();

  const [selectedLike, setSelectedLike] = useState(react);
  const currentUser = jwtDecode(localStorage.getItem("token")).email;
  const flag = sender === currentUser ? 1 : 0;
  const [showChatSideBar, setShowChatSideBar] = useState(false);

  const toggleFullscreen = (index) => {
    const imageElement = imageRef.current[index];

    if (!document.fullscreenElement) {
      if (imageElement.requestFullscreen) {
        imageElement.requestFullscreen();
      } else if (imageElement.mozRequestFullScreen) {
        imageElement.mozRequestFullScreen();
      } else if (imageElement.webkitRequestFullscreen) {
        imageElement.webkitRequestFullscreen();
      } else if (imageElement.msRequestFullscreen) {
        imageElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleEdit = () => {
    setInputValue(messageText);
    setSelectedFiles(messageAttachments);
    setPrevFiles(messageAttachments);
    setChatToEdit(_id);
    setShowChatSideBar(false);
  };

  const handleDelete = async () => {
    console.log("inside delete");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/chat/deleteChat/${_id}`,
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.status == 200) {
        console.log("chat deleted successfully");
        // setShowEdit(false);
        // setYourPostArray((prevPosts) => {
        //   return prevPosts.filter((post) => post._id !== response.data.id);
        // });
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("inside status code");
        setIsValidJWT(false);
      }
    }
  };

  return (
    <div
      className="singleChatCon"
      style={flag === 1 ? { flexDirection: "row-reverse" } : {}}
    >
      <div
        className="singleChat"
        style={
          flag === 1
            ? {
                borderTopRightRadius: "0",
                borderTopLeftRadius: "0.9rem",
                backgroundColor: "#50b5f8",
                justifySelf: "flex-end",
              }
            : {}
        }
      >
        <div className="singleChatMessage">{messageText}</div>
        {messageAttachments.map((attachment, index) => (
          <div key={index}>
            {attachment.endsWith(".jpg") ||
            attachment.endsWith(".png") ||
            attachment.endsWith(".jpeg") ? (
              <img
                key={index}
                src={attachment}
                alt=""
                width={200}
                height={200}
                ref={(el) => (imageRef.current[index] = el)}
                onClick={() => toggleFullscreen(index)}
                style={{ maxWidth: "200px" }}
                className="postFiles"
              />
            ) : attachment.endsWith(".mp4") ? (
              <video controls width="200">
                <source src={attachment} controls className="postFiles" />
              </video>
            ) : (
              <p key={index}></p>
            )}
          </div>
        ))}
        <div
          className="singleChatTime"
          style={
            selectedLike !== "" && flag === 0
              ? { paddingRight: "1.2rem", fontSize: "0.8rem" }
              : { fontSize: "0.65rem" }
          }
        >
          {new Date(time).toLocaleString()}
        </div>
        {selectedLike !== "" && (
          <div
            className="chatReactContainer"
            style={flag === 1 ? { left: "0" } : { right: "0" }}
          >
            {selectedLike === "like" ? (
              <AiFillLike
                className="iconFlex blue"
                style={{ fontSize: "1rem" }}
              />
            ) : selectedLike === "dislike" ? (
              <AiFillDislike
                className="iconFlex blue"
                style={{ fontSize: "1rem" }}
              />
            ) : selectedLike === "laugh" ? (
              <FaLaughSquint
                className="iconFlex yellow"
                style={{ fontSize: "1rem" }}
              />
            ) : selectedLike === "angry" ? (
              <FaAngry className="iconFlex red" style={{ fontSize: "1rem" }} />
            ) : selectedLike === "sad" ? (
              <FaSadCry
                className="iconFlex yellow"
                style={{ fontSize: "1rem" }}
              />
            ) : selectedLike === "love" ? (
              <FcLike className="iconFlex" style={{ fontSize: "1rem" }} />
            ) : (
              <AiOutlineLike
                className="likeIcon iconFlex"
                style={{ fontSize: "1rem" }}
              />
            )}
          </div>
        )}
      </div>
      <BsThreeDots
        style={{ color: "grey", cursor: "pointer", margin: "0.2rem" }}
        onClick={() => setShowChatSideBar(true)}
      />
      {showChatSideBar && (
        <ChatCardSideBar
          flag={flag}
          setState={setShowChatSideBar}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
      {shouldDisplayAllLikes && (
        <ChatLikes
          flag={flag}
          setSelectedLike={setSelectedLike}
          setShouldDisplayAllLikes={setShouldDisplayAllLikes}
        />
      )}
    </div>
  );
};

export default ChatCard;