import React, { useEffect, useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { singup, loginuser, resetpassword } from "../../config/firebase";

const Login = () => {
  const [curstate, setCurstate] = useState("signup");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  // useEffect(() => {
  //   console.log(username, email, password);
  // }, [username, email, password]);

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      if (curstate === "signup") {
        await singup(username, email, password);
      } else {
        await loginuser(email, password);
      }
    } catch (error) {
      console.error(error.message);
      alert(error.message); // or use toast for better UI feedback
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} className="logo" alt="" />
      <form onSubmit={submithandler} className="login-form">
        <h2>{curstate === "signup" ? "Sign up" : "Login"}</h2>
        {curstate === "signup" ? (
          <input
            onChange={(e) => {
              setusername(e.target.value);
            }}
            type="text"
            placeholder="Username"
            className="form-input"
          />
        ) : null}
        <input
          onChange={(e) => {
            setemail(e.target.value);
          }}
          type="email"
          placeholder="Email"
          className="form-input"
        />

        <input
          onChange={(e) => {
            setpassword(e.target.value);
          }}
          type="password"
          placeholder="Password"
          className="form-input"
        />
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
          {curstate === "login" ? (
            <p className=" login-toggle">
              Forgot password{" "}
              <span onClick={() => resetpassword(email)}>reset here</span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
