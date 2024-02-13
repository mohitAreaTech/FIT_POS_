importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyBnodchri04EGb9FvZAmd0RhFVuAAhGz3g",
  authDomain: "retroinsurance-59e45.firebaseapp.com",
  projectId: "retroinsurance-59e45",
  storageBucket: "retroinsurance-59e45.appspot.com",
  messagingSenderId: "1049550970204",
  appId: "1:1049550970204:web:0e2b317e986654cc25b599",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("recive Background message", payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };

  // const notification = {
  //   notificationTitle,
  //   notificationOptions
  // }

  // notification.onclick = function () {
  //   console.log("hello ==============================///////////////////////??????????????????///")
  //   window.open('https://arabboard.org/afrad/');
  // };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
