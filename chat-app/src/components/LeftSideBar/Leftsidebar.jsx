import React, { useContext, useState } from "react";
import "./Leftsidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { appcontext } from "../../context/appcontext";

const Leftsidebar = () => {
  const navigate = useNavigate();
  const { userdata, chatdata, chatuser, setchatuser, setmessagesId } =
    useContext(appcontext);
  const [user, setuser] = useState(null);
  const [search, setsearch] = useState(false);
  // using collection() function to get a reference to the 'users' collection
  //and query() function to get a query object that will fetch the user document where the name field is equal to the input value.
  //The getDocs() function is used to fetch the documents that match the query.
  // const inputhandler = async (e) => {
  //   try {
  //     const input = e.target.value;
  //     if (input) {
  //       setsearch(true);
  //       const userref = collection(db, "users");
  //       const q = query(userref, where("name", "==", input.toLowerCase()));
  //       const querySnapshot = await getDocs(q);
  //       if (
  //         !querySnapshot.empty &&
  //         querySnapshot.docs[0].data().id !== userdata.id
  //       ) {
  //         // console.log(querySnapshot);
  //         let firstDoc = querySnapshot.docs[0];
  //         // Access the first document
  //         // console.log(firstDoc.data());
  //         setuser(firstDoc.data());
  //       } else {
  //         setuser(null);
  //       }
  //     } else {
  //       setsearch(false);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const inputhandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setsearch(true);
        const userref = collection(db, "users");
        const q = query(userref, where("name", "==", input.toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (
          !querySnapshot.empty &&
          querySnapshot.docs[0].data().id !== userdata.id
        ) {
          // console.log(querySnapshot);
          let userExist = false;
          let firstDoc = querySnapshot.docs[0];
          chatdata.map((user) => {
            if (user.rId === querySnapshot.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            // Access the first document
            // console.log(firstDoc.data());
            setuser(firstDoc.data());
          }
        } else {
          setuser(null);
        }
      } else {
        setsearch(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addChat = async () => {
    const messageref = collection(db, "messages");
    const chatref = collection(db, "chats");
    try {
      const newmessageref = doc(messageref);
      await setDoc(newmessageref, {
        createAt: serverTimestamp(),
        message: [],
      });

      await updateDoc(doc(chatref, user.id), {
        chatData: arrayUnion({
          messageId: newmessageref.id,
          lastmessage: "",
          rId: userdata.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      await updateDoc(doc(chatref, userdata.id), {
        chatData: arrayUnion({
          messageId: newmessageref.id,
          lastmessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const setchat = async (item) => {
    console.log(item);
    setmessagesId(item.messageId);
    setchatuser(item);
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="logo" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="menu" />
            <div className="menu-edit">
              <p
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Edit profile
              </p>
              <hr />
              <p>Log out</p>
            </div>
          </div>
        </div>
        <div className="search-bar">
          <img src={assets.search_icon} alt="search" width={16} />
          <input
            onChange={inputhandler}
            type="text"
            name=""
            placeholder="Search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {search && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avathar} alt="" />
            <div>
              <p>{user.name}</p>
              <span>Hey there! I am using chatapp</span>
            </div>
          </div>
        ) : (
          chatdata.map((item, index) => {
            return (
              <div
                onClick={() => {
                  setchat(item);
                }}
                key={index}
                className="friends"
              >
                <img src={item.userData.avathar} alt="" />
                <div>
                  <p>{item.userData.name}</p>
                  <span>{item.lastmessage}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leftsidebar;
