import React from "react";
import "./Chatbox.css";
import assets from "../../assets/assets";
const Chatbox = () => {
  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>
          fadil Shereef{" "}
          <img className="dote" src={assets.green_dot} alt="status" />
        </p>
        <img className="help" src={assets.help_icon} alt="" />
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
          <img src={assets.gallery_icon} alt="image" />
          <img src={assets.send_button} alt="send image" />
        </label>
      </div>
    </div>
  );
};

export default Chatbox;
