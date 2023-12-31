import React from "react";
import "./Home.css";
import { useEffect, lazy, Suspense } from "react";
import Story from "./Story";
import { useGlobals } from "../contexts/Globals";
import CreatePostCard from "./CreatePostCard";
import { usePostContext } from "../contexts/PostContext";
import EditPost from "./EditPost";

const Animation = lazy(() => import("./Animation"));

const Home = () => {
  const { showCreatePostMobile, setShowCreatePostMobile, setEditPost } =
    usePostContext();
  useEffect(() => {
    console.log("home component loaded");
  }, []);
  const { windowWidth } = useGlobals();

  return (
    <div className="homeDiv">
      {showCreatePostMobile && <EditPost />}
      <div className="homeContainer">
        <Suspense fallback={<div>Loading...</div>}>
          <Animation />
        </Suspense>
        {windowWidth <= 800 && (
          <div
            style={{ marginRight: "0.5rem", marginLeft: "0.2rem" }}
            onClick={() => {
              setEditPost(false);
              setShowCreatePostMobile(true);
            }}
          >
            <CreatePostCard message={"Share Your feelings to others by post"} />
          </div>
        )}
        <h1 className="storyHeading">Top stories for you</h1>
        <Story />
      </div>
    </div>
  );
};

export default Home;
