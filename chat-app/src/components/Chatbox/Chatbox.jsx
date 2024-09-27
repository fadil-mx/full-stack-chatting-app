import React, { useContext, useEffect, useState } from "react";
import "./Chatbox.css";
import assets from "../../assets/assets";
import { appcontext } from "../../context/appcontext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import upload from "../../../lib/upload";

const Chatbox = () => {
  const {
    userdata,
    chatdata,
    chatuser,
    setchatuser,
    messagesId,
    messages,
    setmessages,
    setmessagesId,
    chatvisible,
    setchatvisible,
  } = useContext(appcontext);

  const [input, setinput] = useState("");

  const sendmessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            senderId: userdata.id,
            message: input,
            createdAt: new Date(),
          }),
        });
        const userId = [chatuser.rId, userdata.id];
        userId.forEach(async (id) => {
          const userchatref = doc(db, "chats", id);
          const userchatsnapshot = await getDoc(userchatref);
          if (userchatsnapshot.exists()) {
            const userchatdata = userchatsnapshot.data();
            // console.log(userchatdata.chatData[0]);
            const chatindex = userchatdata.chatData.findIndex(
              (c) => c.messageId === messagesId
            );
            userchatdata.chatData[chatindex].lastmessage = input.slice(0, 30);
            userchatdata.chatData[chatindex].updatedAt = new Date();
            if (userchatdata.chatData[chatindex].rId === userdata.id) {
              userchatdata.chatData[chatindex].messageSeen = false;
            }
            await updateDoc(userchatref, {
              chatData: userchatdata.chatData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
    setinput("");
  };

  const settime = (timestamp) => {
    let date = timestamp.toDate();

    let hours = date.getHours();

    let minutes = date.getMinutes();
    console.log(minutes);
    if (hours > 12) {
      return (hours = hours - 12 + ":" + minutes + "PM");
    } else {
      return (hours = hours + ":" + minutes + "AM");
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unsub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setmessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse());
      });
      return () => {
        unsub();
      };
    }
  }, [messagesId]);

  const sendimage = async (e) => {
    try {
      const fileurl = await upload(e.target.files[0]);
      if (fileurl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            senderId: userdata.id,
            image: fileurl,
            createdAt: new Date(),
          }),
        });
        const userId = [chatuser.rId, userdata.id];
        userId.forEach(async (id) => {
          const userchatref = doc(db, "chats", id);
          const userchatsnapshot = await getDoc(userchatref);
          if (userchatsnapshot.exists()) {
            const userchatdata = userchatsnapshot.data();
            // console.log(userchatdata.chatData[0]);
            const chatindex = userchatdata.chatData.findIndex(
              (c) => c.messageId === messagesId
            );
            userchatdata.chatData[chatindex].lastmessage = "image";
            userchatdata.chatData[chatindex].updatedAt = new Date();
            if (userchatdata.chatData[chatindex].rId === userdata.id) {
              userchatdata.chatData[chatindex].messageSeen = false;
            }
            await updateDoc(userchatref, {
              chatData: userchatdata.chatData,
            });
          }
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return chatuser ? (
    <div className={`chat-box ${chatvisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={chatuser.userData.avathar} alt="" />
        <p>
          {chatuser.userData.name}
          {Date.now() - chatuser.userData.lastseen <= 60000 ? (
            <img src={assets.green_dot} alt="" className="dot" />
          ) : null}
        </p>
        <img className="help" src={assets.help_icon} alt="" />

        <img
          onClick={() => {
            setchatvisible(false);
          }}
          src={assets.arrow_icon}
          className="arrow"
          alt="arrowimg"
        />
      </div>

      <div className="chat-msg">
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={
                message.senderId === userdata.id ? "sender-msg" : "reciver-msg"
              }
            >
              {message.image ? (
                <img className="msg-img" src={message.image} alt="error" />
              ) : (
                <p className="msg">{message.message}</p>
              )}
              <div>
                <img
                  src={
                    message.senderId === userdata.id
                      ? userdata.avathar
                      : chatuser.userData.avathar
                  }
                  alt=""
                />
                <p>{settime(message.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => {
            setinput(e.target.value);
          }}
          value={input}
          type="text"
          name="text"
          id=""
          placeholder="Send a message"
        />
        <input
          onChange={sendimage}
          type="file"
          name="file"
          id="image"
          accept="image/png,image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} className="chat-img" alt="image" />
        </label>
        <img
          onClick={sendmessage}
          src={assets.send_button}
          className="chat-img"
          alt="send image"
        />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatvisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>
        Welcome to chatapp
        <br />
        Select a chat to start
      </p>
    </div>
  );
};

export default Chatbox;
