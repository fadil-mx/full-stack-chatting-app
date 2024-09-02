import React from "react";
import "./Chatbox.css";
import assets from "../../assets/assets";
const Chatbox = () => {
  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>
          fadil Shereef
          <img className="dot" src={assets.green_dot} alt="status" />
        </p>
        <img className="help" src={assets.help_icon} alt="" />
      </div>

      <div className="chat-msg">
        <div className="sender-msg">
          <p className="msg">heii there! I am using chatapp</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2.50</p>
          </div>
        </div>
        <div className="sender-msg">
          <img className="msg-img" src={assets.pic1} alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2.50</p>
          </div>
        </div>
        <div className="reciver-msg">
          <p className="msg">heii there! I am using chatapp</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2.50</p>
          </div>
        </div>
      </div>

      <div className="chat-input">
        <input type="text" name="text" id="" placeholder="Send a message" />
        <input
          type="file"
          name="file"
          id="image"
          accept="image/png,image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} className="chat-img" alt="image" />
        </label>
        <img src={assets.send_button} className="chat-img" alt="send image" />
      </div>
    </div>
  );
};

export default Chatbox;
