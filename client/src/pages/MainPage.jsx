import React from "react";
import "./MainPage.css";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../components/Home";
import { Routes, Route } from "react-router-dom";
import Groups from "../components/Groups";
import Friends from "../components/Friends";
import Profile from "../components/Profile";
import Chat from "../components/Chat";
import PostComponent from "../components/PostComponent";
import FriendOptions from "../components/FriendOptions";
import CreateStory from "../components/CreateStory";
import { useGlobals } from "../contexts/Globals";
import { usePostContext } from "../contexts/PostContext";
import UserSession from "../components/UserSession";
import PreviewStory from "../components/PreviewStory";
import DisplayStory from "../components/DisplayStory";
import GroupsBar from "../components/GroupsBar";
import EditPost from "../components/EditPost";

const MainPage = () => {
  const { isValidJWT, windowWidth } = useGlobals();
  const { editPost } = usePostContext();
  return (
    <>
      {editPost && <EditPost />}
      {!isValidJWT && <UserSession />}
      <div className="mainPage">
        <div className="navComponent">
          <Navbar />
        </div>
        <div className="footerComponent">
          <Footer />
        </div>
        <div className="mainContainer">
          {windowWidth >= 1150 && (
            <div className="chatComponent">
              <Chat />
            </div>
          )}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="mainComponent">
                    <Home />
                  </div>
                  <div className="leftComponent">
                    <Profile profileCode={0} />
                  </div>
                </>
              }
            />
            <Route
              path="/posts/*"
              element={
                <div className="doubleColumn">
                  <PostComponent />
                </div>
              }
            />
            <Route
              path="/friends"
              element={
                <>
                  <div className="mainComponent">
                    <Friends />
                  </div>
                  <div className="leftComponent">
                    <FriendOptions />
                  </div>
                </>
              }
            />
            <Route
              path="/groups"
              element={
                <>
                  <div className="mainComponent">
                    <Groups />
                  </div>
                  <div className="leftComponent">
                    <GroupsBar />
                  </div>
                </>
              }
            />
            <Route
              path="/stories"
              element={
                <div className="doubleColumn">
                  <DisplayStory />
                </div>
              }
            />
            <Route
              path="/createStory"
              element={
                <>
                  <div className="mainComponent">
                    <PreviewStory />
                  </div>
                  <div className="leftComponent">
                    <CreateStory />
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default MainPage;
