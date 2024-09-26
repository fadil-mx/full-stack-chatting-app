import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import Leftsidebar from "../../components/LeftSideBar/Leftsidebar";
import Chatbox from "../../components/Chatbox/Chatbox";
import Rightsidebar from "../../components/Rightsidebar/Rightsidebar";
import { appcontext } from "../../context/appcontext";
const Chat = () => {
  const { chatdata, userdata } = useContext(appcontext);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    if (chatdata && userdata) {
      setloading(false);
    }
  }, [chatdata, userdata]);
  return (
    <div className="chat">
      {loading ? (
        <p className="loading">loading...</p>
      ) : (
        <div className="chat-container">
          <Leftsidebar />
          <Chatbox />
          <Rightsidebar />
        </div>
      )}
    </div>
  );
};
export default Chat;
