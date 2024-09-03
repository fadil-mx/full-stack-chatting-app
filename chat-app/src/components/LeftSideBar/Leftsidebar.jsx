import React from "react";
import "./Leftsidebar.css";
import assets from "../../assets/assets";

const Leftsidebar = () => {
  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="logo" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="menu" />
            <div className="menu-edit">
              <p>Edit profile</p>
              <hr />
              <p>Log out</p>
            </div>
          </div>
        </div>
        <div className="search-bar">
          <img src={assets.search_icon} alt="search" width={16} />
          <input type="text" name="" placeholder="Search here..." />
        </div>
      </div>
      <div className="ls-list">
        <div className="friends">
          <img src={assets.profile_img} alt="" />
          <div>
            <p>John Doe</p>
            <span>Hey there! I am using chatapp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leftsidebar;
