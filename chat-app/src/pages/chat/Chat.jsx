import React from "react";
import "./Chat.css";
import Leftsidebar from "../../components/LeftSideBar/Leftsidebar";
import Chatbox from "../../components/Chatbox/Chatbox";
import Rightsidebar from "../../components/Rightsidebar/Rightsidebar";
const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-container">
        <Leftsidebar />
        <Chatbox />
        <Rightsidebar />
      </div>
    </div>
  );
};
export default Chat;
