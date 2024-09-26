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
    console.log(date);
    let hours = date.getHours();
    console.log(hours);
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

  return chatuser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatuser.userData.avathar} alt="" />
        <p>
          {chatuser.userData.name}
          <img className="dot" src={assets.green_dot} alt="status" />
        </p>
        <img className="help" src={assets.help_icon} alt="" />
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
              <p className="msg">{message.message}</p>
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
    <div className="chat-welcome">
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
