import React, { useContext, useEffect, useState } from "react";
import "./Profileupdate.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import upload from "../../../lib/upload";
import { appcontext } from "../../context/appcontext";

const ProfileUpdate = () => {
  const { setuserdata } = useContext(appcontext);
  const [image, setimage] = useState(null);
  const [name, setname] = useState("");
  const [bio, setbio] = useState("");
  const [uid, setuid] = useState("");
  const [previmage, setprevimage] = useState("");
  const navigate = useNavigate();

  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!previmage && !image) {
        toast.error("Please upload profile image");
        return;
      }
      const docref = doc(db, "users", uid);
      if (image) {
        const imgurl = await upload(image);
        console.log(imgurl);
        setprevimage(imgurl);
        await updateDoc(docref, {
          avathar: imgurl,
          name: name,
          bio: bio,
        });
      } else {
        await updateDoc(docref, {
          name: name,
          bio: bio,
        });
      }
      const docrefdata = await getDoc(docref);
      setuserdata(docrefdata.data());
      navigate("/chat");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setuid(user.uid);
          const docsnap = await getDoc(doc(db, "users", user.uid));
          if (docsnap.data().name) {
            setname(docsnap.data().name);
          }
          if (docsnap.data().bio) {
            setbio(docsnap.data().bio);
          }
          if (docsnap.data().avathar) {
            setprevimage(docsnap.data().avathar);
          }
        } else {
          navigate("/");
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  }, []);
  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avathar" className="avathar">
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt="avathar"
            />
            <input
              onChange={(e) => {
                setimage(e.target.files[0]);
              }}
              type="file"
              name=""
              id="avathar"
              hidden
            />
            upload profile image
          </label>
          <input
            onChange={(e) => {
              setname(e.target.value);
            }}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => {
              setbio(e.target.value);
            }}
            name=""
            placeholder="Write profile bio"
            required
            value={bio}
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          src={
            image
              ? URL.createObjectURL(image)
              : previmage
              ? previmage
              : assets.avatar_icon
          }
          alt="logo"
          className="chat-logo"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
