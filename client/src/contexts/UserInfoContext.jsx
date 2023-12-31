import React, { createContext, useContext } from "react";
import axios from "axios";

const UserInfoContext = createContext();

export function useUserInfoContext() {
  return useContext(UserInfoContext);
}

const UserInfoProvider = ({ children }) => {
  const getUserInfo = async (email) => {
    if (email !== undefined) {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/profile/info/${email}`
      );
      const userInfo = {
        name: response.data.name,
        profilePic: response.data.profilePic,
      };
      return userInfo;
    }
  };

  return (
    <UserInfoContext.Provider value={{ getUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
