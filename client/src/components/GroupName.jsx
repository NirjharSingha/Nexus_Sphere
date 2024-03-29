import React, { useState } from "react";
import ItemCard from "./ItemCard";
import { BsFillGearFill } from "react-icons/bs";
import { useGlobals } from "../contexts/Globals";
import axios from "axios";
import { useGroupContext } from "../contexts/GroupContext";
import ConfirmWindow from "./ConfirmWindow";
import jwtDecode from "jwt-decode";
import { useFileContext } from "../contexts/FileContext";
import { useNavigate } from "react-router-dom";

const GroupName = ({ group, flag }) => {
  const [show, setShow] = useState(false);
  const { deleteFile } = useFileContext();
  const { _id, groupName, groupImage } = group;
  const { setIsValidJWT, windowWidth } = useGlobals();
  const navigate = useNavigate();
  const {
    setGroupsYouCreated,
    setGroupsYouJoined,
    setReqSent,
    setInvitationReceived,
    setSuggestGroups,
    setShowAlertMsg,
    setAlertMsg,
    setIsEditGroup,
    setGroupToEdit,
    selectedGroup,
    setSelectedGroup,
  } = useGroupContext();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
    setShow(false);
  };

  const handleAction = async (action, option, notificationMessage) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/group/addOrRemove`,
        {
          option: option,
          action: action,
          groupId: _id,
          email: jwtDecode(localStorage.getItem("token")).email,
          notificationMessage: notificationMessage,
          notificationTarget: group.admin,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.status == 200) {
        if (action === "remove" && option === "allMembers") {
          setAlertMsg(`You left the group`);
          setGroupsYouJoined((prev) =>
            prev.filter((group) => group._id !== _id)
          );
        } else if (action === "remove" && option === "reqReceived") {
          setAlertMsg(`Request canceled`);
          setReqSent((prev) => prev.filter((group) => group._id !== _id));
        } else if (action === "add" && option === "reqReceived") {
          setAlertMsg(`Request sent successfully`);
          setReqSent((prev) => [...prev, group]);
        } else if (action === "remove" && option === "invitationSent") {
          setInvitationReceived((prev) =>
            prev.filter((group) => group._id !== _id)
          );
        } else if (action === "remove" && option === "suggessions") {
          setSuggestGroups((prev) => prev.filter((group) => group._id !== _id));
        }
        if (windowWidth < 800 || selectedGroup !== null) {
          setShowAlertMsg(true);
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        setIsValidJWT(false);
      }
    }
  };

  const deleteGroup = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/group/deleteGroup/${_id}`,
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.status == 200) {
        if (groupImage !== "") {
          deleteFile([groupImage]);
        }
        setGroupsYouCreated((prev) =>
          prev.filter((group) => group._id !== _id)
        );
        setAlertMsg("Group deleted successfully");
        setShowAlertMsg(true);
      }
    } catch (error) {
      if (error.response.status === 401) {
        setIsValidJWT(false);
      }
    }
  };
  return (
    <>
      {showConfirm && (
        <ConfirmWindow
          handleAction={deleteGroup}
          setShowConfirm={setShowConfirm}
          flag="group"
          isConfirmWindow={true}
        />
      )}
      <div
        className="groupItem"
        style={
          show && selectedGroup && selectedGroup._id === group._id
            ? {
                borderBottomLeftRadius: "0",
                borderBottomRightRadius: "0",
                border: "3px solid rgb(30, 150, 194)",
              }
            : show
            ? { borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }
            : selectedGroup && selectedGroup._id === group._id
            ? { border: "3px solid rgb(30, 150, 194)" }
            : {}
        }
      >
        <div
          className="groupItem2"
          onClick={() => {
            setSelectedGroup(group);
            if (windowWidth < 800) {
              navigate("/main/groups/id");
            }
          }}
        >
          <ItemCard
            containerClass="groupItem2"
            imgClass="storyProfilePic"
            nameClass="optionListName"
            shouldDisplayImg={groupImage !== ""}
            imgSrc={groupImage}
            icon="/group.png"
            name={groupName}
          />
        </div>
        <BsFillGearFill
          className="groupBarIcon"
          onClick={() => setShow((prev) => !prev)}
        />
      </div>
      {show && flag === 1 && (
        <div className="groupBarBtnContainer">
          <button
            className={`groupBarButton groupBarButton2`}
            onClick={() => {
              setIsEditGroup(true);
              setGroupToEdit(group);
              setShow(false);
            }}
          >
            Edit
          </button>
          <button
            className={`groupBarButton groupBarButton2`}
            style={{ justifySelf: "end" }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
      {show && flag === 2 && (
        <button
          className={`groupBarButton`}
          onClick={() => handleAction("remove", "allMembers", "")}
        >
          Leave Group
        </button>
      )}
      {show && flag === 3 && (
        <button
          className={`groupBarButton`}
          onClick={() => handleAction("remove", "reqReceived", "")}
        >
          Cancel Request
        </button>
      )}
      {show && flag === 4 && (
        <div className="groupBarBtnContainer">
          <button
            className={`groupBarButton groupBarButton2`}
            onClick={() => {
              handleAction("remove", "invitationSent", "");
              handleAction("add", "reqReceived", "");
            }}
          >
            Accept
          </button>
          <button
            className={`groupBarButton groupBarButton2`}
            style={{ justifySelf: "end" }}
            onClick={() => {
              setAlertMsg("Invitation declined");
              handleAction("remove", "invitationSent", "");
            }}
          >
            Decline
          </button>
        </div>
      )}
      {show && flag === 5 && (
        <button
          className={`groupBarButton`}
          onClick={() => {
            handleAction(
              "add",
              "reqReceived",
              `${
                jwtDecode(localStorage.getItem("token")).email
              } has requested to join your group ${group.groupName}`
            );
            handleAction("remove", "suggessions", "");
          }}
        >
          Join Group
        </button>
      )}
    </>
  );
};

export default GroupName;
