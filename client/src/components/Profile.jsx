import React from "react";
import "./Profile.css";
import { useEffect, useState } from "react";
import UpdateProfile from "./UpdateProfile";
import axios from "axios";
import Loading from "./Loading";
import { MdEdit } from "react-icons/md";
import { useGlobals } from "../contexts/Globals";

const Profile = ({ profileCode, setShowFriendProfile, friendEmail }) => {
  const { setIsValidJWT } = useGlobals();
  const [profileData, setProfileData] = useState({});
  const [showLoading, setShowLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      setShowLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/profile?friendEmail=${friendEmail}`,
        {
          headers: {
            token: token,
          },
        }
      );
      if (response) {
        setProfileData(response.data);
        setShowLoading(false);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("inside status code");
        setIsValidJWT(false);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const handleUpdateProfile = () => {
    setShowUpdateProfile((prevState) => !prevState);
  };

  useEffect(() => {
    if (shouldFetch == true) {
      fetchProfileData();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  return (
    <>
      {showUpdateProfile && (
        <UpdateProfile
          profileData={profileData}
          handleMount={handleUpdateProfile}
          fetchProfileData={setShouldFetch}
        />
      )}
      {showLoading && (
        <div className="loadingContainer">
          <Loading />
        </div>
      )}
      {!showLoading && (
        <div
          className="profileContainer"
          style={
            profileCode === 0
              ? { gridTemplateRows: "2fr 7fr 2.5rem" }
              : { minWidth: "100%", gridTemplateRows: "2fr 7fr" }
          }
        >
          <div className="profileImageContainer">
            <img src={profileData.profilePic} className="profileImage" />
            <button
              className="friendProfileCross"
              onClick={() => setShowFriendProfile(false)}
            >
              X
            </button>
          </div>
          {!(
            profileCode === 0 ||
            profileData.profileStatus === "Public" ||
            (profileCode === 1 && profileData.profileStatus !== "Locked")
          ) && (
            <p className="profileWarningText">
              Sorry, the user has locked his profile
            </p>
          )}
          {(profileCode === 0 ||
            profileData.profileStatus === "Public" ||
            (profileCode === 1 && profileData.profileStatus !== "Locked")) && (
            <>
              <div
                className={
                  profileCode === 0
                    ? "profileInfoContainer"
                    : "friendProfileInfoContainer"
                }
              >
                <div className="profileInfo">
                  <div className="profileLine">
                    Name:
                    <span className="profileAns">{profileData.name}</span>
                  </div>
                  <div className="profileLine">
                    Email:{" "}
                    <span className="profileAns">{profileData.email}</span>
                  </div>
                  <div className="profileLine">
                    Gender:{" "}
                    <span className="profileAns">{profileData.gender}</span>
                  </div>
                  <div className="profileLine">
                    Country:{" "}
                    <span className="profileAns">{profileData.country}</span>
                  </div>
                  <div className="profileLine">
                    City: <span className="profileAns">{profileData.city}</span>
                  </div>
                  <div className="profileLine">
                    Date of Birth:
                    <span className="profileAns">
                      {profileData.dob != null && profileData.dob !== ""
                        ? profileData.dob.substring(0, 10)
                        : profileData.dob}
                    </span>
                  </div>
                  <div className="profileLine">
                    School:
                    <span className="profileAns">{profileData.school}</span>
                  </div>
                  <div className="profileLine">
                    College:
                    <span className="profileAns">{profileData.college}</span>
                  </div>
                  <div className="profileLine">
                    University:
                    <span className="profileAns">{profileData.university}</span>
                  </div>
                  <div className="profileLine">
                    Workplace:
                    <span className="profileAns">{profileData.workplace}</span>
                  </div>
                  <div className="profileLine">
                    Contact number:
                    <span className="profileAns">
                      {profileData.contactNumber}
                    </span>
                  </div>
                  <div className="profileLine">
                    Relationship status:
                    <span className="profileAns">
                      {profileData.relationshipStatus}
                    </span>
                  </div>
                  <div className="profileLine">
                    Profile status:
                    <span className="profileAns">
                      {profileData.profileStatus}
                    </span>
                  </div>
                  <div className="profileLine">
                    Why are you on this website:
                  </div>
                  <div className="profileEassy">
                    {profileData.reasonOfBeingHere}
                  </div>
                  <div className="profileLine">About Yourself:</div>
                  <div className="profileEassy">
                    {profileData.aboutYourself}
                  </div>
                </div>
              </div>
              {profileCode === 0 && (
                <div className="updateProfileButtonContainer">
                  <div
                    className="profileUpdateButton"
                    onClick={handleUpdateProfile}
                  >
                    <MdEdit />
                    Edit
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
