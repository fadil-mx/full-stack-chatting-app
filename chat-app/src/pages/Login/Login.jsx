import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";

const Login = () => {
  const [curstate, setCurstate] = useState("signup");

  return (
    <div className="login">
      <img src={assets.logo_big} className="logo" alt="" />
      <form className="login-form">
        <h2>{curstate === "signup" ? "Sign up" : "Login"}</h2>
        <input type="text" placeholder="Username" className="form-input" />
        {curstate === "signup" ? (
          <input type="email" placeholder="email" className="form-input" />
        ) : null}
        <input type="password" placeholder="Password" className="form-input" />
        <button type="submit">
          {curstate === "signup" ? "Create account" : "Login"}
        </button>
        <div className="login-terms ">
          <input type="checkbox" />
          <p>Agree to terms of use and privacy policy</p>
        </div>
        <div className="login-forgot">
          {curstate === "signup" ? (
            <p className=" login-toggle">
              Already have an account{" "}
              <span onClick={() => setCurstate("login")}>Click here</span>
            </p>
          ) : (
            <p className=" login-toggle">
              Create an account{" "}
              <span onClick={() => setCurstate("signup")}>Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
