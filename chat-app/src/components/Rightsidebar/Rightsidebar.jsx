import React from "react";
import "./Rightsidebar.css";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
const Rightsidebar = () => {
  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>
          Fadil Shereef <img src={assets.green_dot} alt="" className="dot" />
        </h3>
        <p>Hey, There i am Fadil Shereef Using Chat App</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
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
  );
};

export default Rightsidebar;
