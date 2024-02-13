// import "./App.css";
// import Header from "./components/common/Header";

// import SideBar from "./components/common/SideBar";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Dashboard from "./components/pages/Dashboard";
// import Profile from "./components/pages/Profile";
// import Training from "./components/pages/Training";

// import Login from "./components/pages/Login";
// import { Provider, useSelector } from "react-redux";
// import store from "./store";

// function App() {
//   const type = useSelector((state) => state?.root?.userDetails.type);

//   console.log(type);

//   return (

//     <Provider store={store}>
//       <BrowserRouter>
//         <Routes>
//           <Route element={<Login />} path="/" />
//           <Route element={<Dashboard />} path={`/${type}/home`} />
//           <Route element={<Profile />} path="/profile" />
//           <Route element={<Training />} path="/training" />
//         </Routes>
//       </BrowserRouter>
//     </Provider>

//   );
// }

// export default App;

import "./App.css";
import AllRoutes from "./components/Routes/AllRoutes";
import { useState } from "react";
import { onMessageListener } from "./firebase";
import { Provider } from "react-redux";
import store from "./store";
// import { toast } from 'material-react-toastify';

function App() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });

  onMessageListener()
    .then((payload) => {
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log("notification payload", payload);

      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  if (show == true) {
    // toast.info(`${notification?.title},  ${notification?.body}`, {

    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: true,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    // });
    setShow(false);
    // setNotification({ title: "", body: "" })
  }

  return (
    // <Provider store={store}>
    <AllRoutes />
    // </Provider>
  );
}

export default App;
