import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDHDeYvDhfsg0ZApoL_b_s-WmzgyC8AZRM",
  authDomain: "chat-app-71513.firebaseapp.com",
  projectId: "chat-app-71513",
  storageBucket: "chat-app-71513.appspot.com",
  messagingSenderId: "68105447409",
  appId: "1:68105447409:web:7c90758c02cdc4e1a14650",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const singup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avathar: "",
      bio: "Hey ,There i am online",
      lastseen: Date.now(),
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });
  } catch (error) {
    console.error(error.message);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const loginuser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error.message);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error.message);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

export { singup, loginuser, logout, auth, db };
