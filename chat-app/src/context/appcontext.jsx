import { createContext, useState } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const appcontext = createContext();

const AppcontextProvider = (props) => {
  const navigate = useNavigate();
  const [userdata, setuserdata] = useState(null);
  const [chatdata, setchatdata] = useState(null);
  const [messagesId, setmessagesId] = useState(null);
  const [messages, setmessages] = useState([]);
  const [chatuser, setchatuser] = useState(null);

  const loaduserdata = async (uid) => {
    try {
      // fetch data from db
      const userref = doc(db, "users", uid);
      const usersnap = await getDoc(userref);
      const userdata = usersnap.data();
      setuserdata(userdata);
      if (userdata.avathar && userdata.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }
      await updateDoc(userref, {
        lastseen: Date.now(),
      });
      setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userdata, {
            lastseen: Date.now(),
          });
        }
      }, 60000);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (userdata) {
      const chatref = doc(db, "chats", userdata.id);
      const unsub = onSnapshot(chatref, async (res) => {
        const chatitems = res.data().chatData;
        const tempData = [];
        for (const item of chatitems) {
          const userref = doc(db, "users", item.rId);
          const userSnap = await getDoc(userref);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }
        setchatdata(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });
      return () => {
        unsub();
      };
    }
  }, [userdata]);

  const values = {
    userdata,
    chatdata,
    setuserdata,
    setchatdata,
    loaduserdata,
    messages,
    setmessages,
    messagesId,
    setmessagesId,
    chatuser,
    setchatuser,
  };
  return (
    <appcontext.Provider value={values}>{props.children}</appcontext.Provider>
  );
};

export default AppcontextProvider;
