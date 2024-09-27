import React, { useContext, useEffect, useState } from "react";
import "./Rightsidebar.css";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import { appcontext } from "../../context/appcontext";
const Rightsidebar = () => {
  const {
    userdata,
    chatdata,
    chatuser,
    messages,
    messagesId,
    setchatuser,
    setmessagesId,
  } = useContext(appcontext);

  const [msgimg, setmsgimg] = useState([]);
  const [online, setIsOnline] = useState(false);

  useEffect(() => {
    let tempvar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempvar.push(msg.image);
      }
    });
    // console.log(tempvar);
    setmsgimg(tempvar);
    // console.log(msgimg);
  }, [messages]);

  return chatuser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatuser.userData.avathar} alt="" />
        <h3>
          {chatuser.userData.username}
          {Date.now() - chatuser.userData.lastseen <= 60000 ? (
            <img src={assets.green_dot} alt="" className="dot" />
          ) : null}
        </h3>
        <p>{chatuser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgimg.map((img, index) => {
            return (
              <img
                onClick={() => {
                  window.open(img);
                }}
                key={index}
                src={img}
                alt=""
              />
            );
          })}
        </div>
      </div>
      <button
        onClick={() => {
          logout();
        }}
      >
        Log Out
      </button>
    </div>
  ) : (
    <div className="rs">
      <button
        onClick={() => {
          logout();
        }}
      >
        Log Out
      </button>
    </div>
  );
};

export default Rightsidebar;
