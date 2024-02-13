import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
// import { toast } from "react-toastify";

// console.log("first",process.env.REACT_APP_FCM_KEY)
// const publicKey = process.env.REACT_APP_FCM_KEY;
const publicKey =
  "BEpTUBwVdUZ-Z-vLXeDpVLjzGvqhH83s30dFK3xsCeEXpHrnIM8fHA5MXe3oVBtGGRer8K7Iy8v2S1z-TOco9cU";

const firebaseConfig = {
  apiKey: "AIzaSyBnodchri04EGb9FvZAmd0RhFVuAAhGz3g",
  authDomain: "retroinsurance-59e45.firebaseapp.com",
  projectId: "retroinsurance-59e45",
  storageBucket: "retroinsurance-59e45.appspot.com",
  messagingSenderId: "1049550970204",
  appId: "1:1049550970204:web:0e2b317e986654cc25b599",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
// firebase.initializeApp(firebaseConfig);
let messaging = null;
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
}

export const getToken = async (setTokenFound) => {
  let currentToken = "";

  try {
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
      console.log("message by firebase", payload);
      //   toast.info( `${payload?.data?.title}, : ${payload?.data?.body}`,   {

      //     });
    });
  });

export default firebase;
