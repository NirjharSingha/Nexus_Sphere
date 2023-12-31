import React from "react";
import "./GroupStream.css";
import CreatePostCard from "./CreatePostCard";
import { useGroupContext } from "../contexts/GroupContext";
import GroupPosts from "./GroupPosts";

const GroupStream = () => {
  const { setIsGroupPost, access } = useGroupContext();

  const handleClick = () => {
    setIsGroupPost(true);
  };

  return (
    <div className="grpStream">
      {(access === 1 || access === 2) && (
        <CreatePostCard
          handleClick={handleClick}
          message={"Create post in this group"}
        />
      )}
      {access === 3 && (
        <p
          className="createPostCard"
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            fontFamily: "Courier New",
          }}
        >
          You are not a member of this group. You cannot post here.
        </p>
      )}
      <GroupPosts />
    </div>
  );
};

export default GroupStream;
