import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import SideBar from "./components/common/SideBar";
import Header from "./components/common/Header";
import { Provider } from "react-redux";
import store from "./store";
import { ToastContainer } from "react-toastify";
import throttle from "lodash/throttle";
import { saveState } from "./components/utility/LocalStorage";
store.subscribe(
  throttle(() => {
    saveState({
      root: store.getState().root,
    });
  }, 1000)
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <SideBar /> */}
    <Provider store={store}>
      <App />
      <ToastContainer autoClose={2000} hideProgressBar closeOnClick rtl={false} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
