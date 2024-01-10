import React, { useRef, useEffect } from "react";

const ChatCardSideBar = ({ flag, setState, handleEdit }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setState(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="chatSideBar"
      style={flag === 1 ? { left: "120px" } : { right: "45px" }}
    >
      <button className="chatSidebarButton">Reply</button>
      {flag === 1 && (
        <button className="chatSidebarButton" onClick={handleEdit}>
          Edit
        </button>
      )}
      {flag === 1 && <button className="chatSidebarButton">Delete</button>}
      {flag !== 1 && <button className="chatSidebarButton">React</button>}
    </div>
  );
};

export default ChatCardSideBar;
