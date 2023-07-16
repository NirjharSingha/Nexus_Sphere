import React from "react";
import { useEffect, useState, useRef } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { BsFillReplyFill, BsEmojiSmile } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidSend } from "react-icons/bi";
import EmojiList from "./EmojiList";
import "./CommentCard.css";

const CommentCard = () => {
  const [showReply, setShowReply] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const commentCardRef = useRef(null);

  useEffect(() => {
    console.log("Comment card loaded");

    const handleOutsideClick = (event) => {
      if (
        commentCardRef.current &&
        !commentCardRef.current.contains(event.target)
      ) {
        setShowReply(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleEmojiClick = () => {
    setShowEmojis((prev) => !prev);
  };

  return (
    <div ref={commentCardRef}>
      <div className="comment">
        <div className="commentFirstRow">
          <img
            src="http://localhost:5000/uploads/1688751295691-database.png"
            alt=""
            className="commentUserProfilePic"
          />
          <h3 className="commentUserName">User name</h3>
        </div>
        <div className="commentSecondRow">
          {new Date(Date.now()).toLocaleString()}
        </div>
        <div className="commentThirdRow">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo
          optio laudantium error dolor consequatur facilis repellat, molestias
          quasi ut tenetur facere sapiente ipsam? Temporibus architecto quos
          iure quisquam at cupiditate nostrum quae? Ex nulla reprehenderit vitae
          facere amet sit fugit nobis ratione! Culpa temporibus eum molestias
          placeat delectus nobis illo!
        </div>
        <div className="commentForthRow">
          <AiOutlineLike className="commentIcons blue" />
          <BsFillReplyFill
            className="commentIcons blue"
            onClick={() => {
              setShowReply((prev) => !prev);
              setShowEmojis(false);
            }}
          />
          <FaEdit className="commentIcons blue" />
          <MdDelete className="commentIcons blue" />
        </div>
      </div>
      {showReply && (
        <div>
          {showEmojis && (
            <div className="emojiClass">
              <EmojiList setInputValue={setInputValue} />
            </div>
          )}

          <div className="commentFifthRow">
            <BsEmojiSmile
              className="commentEmojiIcon"
              onClick={handleEmojiClick}
            />
            <input
              type="text"
              className="commentReply"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <BiSolidSend className="commentSubmitIcon" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
