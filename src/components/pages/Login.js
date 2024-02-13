// import React, { useState } from "react";

// function Login() {
//   const [loginType, setLoginType] = useState("PosP");
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "lightblue",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           height: "100%",
//           width: 450,
//         }}
//       >
//         <div style={{ display: "flex" }}>
//           <strong
//             style={{
//               padding: 10,
//               backgroundColor: loginType === "PosP" ? "#358E93" : "white",
//               color: loginType === "PosP" ? "white" : "black",
//               width: 215,
//               margin: 5,
//               textAlign: "center",
//               cursor: "pointer",
//             }}
//             onClick={() => setLoginType("PosP")}
//           >
//             PosP
//           </strong>
//           <strong
//             style={{
//               padding: 10,
//               backgroundColor: loginType === "Employee" ? "#358E93" : "white",
//               color: loginType === "Employee" ? "white" : "black",
//               width: 215,
//               margin: 5,
//               textAlign: "center",
//               cursor: "pointer",
//             }}
//             onClick={() => setLoginType("Employee")}
//           >
//             Employee
//           </strong>
//         </div>
//         <h4 style={{ marginTop: 20, marginBottom: 20 }}>
//           Welcome to Retro Insurance {loginType} Login
//         </h4>

//         <label>
//           <strong>Email</strong>
//         </label>
//         <input
//           type="email"
//           placeholder="abc@gmail.com"
//           style={{ padding: 10, borderRadius: 8, marginBottom: 10 }}
//         />

//         <label for="formFile" class="form-label">
//           <strong> Password</strong>
//         </label>
//         <input
//           type="password"
//           placeholder="Pancard No"
//           style={{ padding: 10, borderRadius: 8 }}
//         />
//         <button
//           style={{
//             width: 200,
//             alignSelf: "center",
//             margin: 20,
//             padding: 10,
//             backgroundColor: "#358E93",
//             color: "white",
//             borderWidth: 0,
//           }}
//         >
//           <strong> Sign in </strong>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  loginUser,
  sendErrorMessage,
  sendSuccessMessage,
  tokenUserLogin,
} from "../services/userServices";
import cookie from "react-cookies";
import { useDispatch, useSelector } from "react-redux";
import { saveUserDetails } from "../../store/actions/userAction";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
// import { toast } from "material-react-toastify";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState();
  const [isTokenFound, setTokenFound] = useState(false);
  const [loginAs, setLoginAs] = useState("pos");
  const status = useSelector((state) => state?.root?.addedPos?.status);
  console.log(status, "POS Status");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlQuery = new URLSearchParams(location.search);
    let token = urlQuery.get("id");
    let Data = {
      access_token: token,
      fcm_token: fcmToken ? fcmToken : "sadfdfgfdgh",
    };
    if (token && fcmToken) {
      tokenUserLogin(Data)
        .then((response) => {
          if (response.status === true) {
            cookie.save("userDetails", response.data);
            cookie.save("token", response.data.access_token);
            dispatch(saveUserDetails(response.data));
            navigate(`/home`);
          } else {
            toast.error("You are not authorize for login in this panel", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        })
        .catch((error) => console.log(error));
    }
  }, [fcmToken]);

  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getToken(setTokenFound);
      if (data) {
        console.log("token is", data);
      }
      setFcmToken(data);
      return data;
    }

    tokenFunc();
  }, [setTokenFound]);

  const handleLogin = (data) => {
    // navigate(`/offlineQuote`);
    let Data = {
      ...data,
      fcm_token: fcmToken ? fcmToken : "sadfdfgfdgh",
    };
    setLoading(true);
    // Coordinator //Pos //Ops
    loginUser(Data).then((response) => {
      if (response?.status === true) {
        if (response?.data?.type == "pos" && loginAs != "pos") {
          setLoading(false);
          toast.error("Please login with Posp ");
          toast.error("Please login with Posp ");
          return;
        }
        if (response?.data?.type == "service-provider" && loginAs != "pos") {
          setLoading(false);
          toast.error("Please login with Posp ");

          return;
        }
        if (
          (response.data.type == "employee" && loginAs != "employee") ||
          (response.data.type == "national_head" && loginAs != "employee") ||
          (response.data.type == "branch_head" && loginAs != "employee") ||
          (response.data.type == "district_head" && loginAs != "employee") ||
          (response.data.type == "state_head" && loginAs != "employee") ||
          (response.data.type == "zonal_head" && loginAs != "employee") ||
          (response.data.type == "ops" && loginAs != "employee")
        ) {
          setLoading(false);
          toast.error("Please login with Employee ");
          return;
        }
        if (
          response.data.type == "service-provider" ||
          response.data.type == "employee" ||
          response.data.type == "pos" ||
          response.data.type == "branch_head" ||
          response.data.type == "district_head" ||
          response.data.type == "state_head" ||
          response.data.type == "zonal_head" ||
          response.data.type == "national_head" ||
          response.data.type == "ops"
        ) {
          console.log(response?.data, "Login Data");

          sendSuccessMessage(response);
          cookie.save("userDetails", response?.data);
          cookie.save("postoken", response?.data?.access_token);
          console.log("posToken hnfikuwahbiufkchbajkuerdfb", response);
          dispatch(saveUserDetails(response?.data));
          if (
            response?.data?.addedPos?.isTrainee === true &&
            response?.data?.isVerified === false
          ) {
            navigate("/training");
          } else if (response?.data?.isVerified === true) {
            navigate(`/offlineQuote`);
          }
          navigate(`/home`);
        } else if (response.data.type == "ops") {
          sendSuccessMessage(response);
          cookie.save("userDetails", response.data);
          cookie.save("postoken", response.data.access_token);
          dispatch(saveUserDetails(response.data));
          navigate(`/home`);
        } else {
          toast.error("You are not authorize for login in this panel");
        }
      } else {
        setLoading(false);
        sendErrorMessage(response);
      }
    });
  };
  return (
    <>
      <ToastContainer />
      <div className="maindiv">
        <div className="image-info">
          <img
            src="/assets/images/homeinsurance.png"
            alt="Avatar"
            class="avatar"
          />
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="form-pos-login">
          <h2>Welcome To FIT {loginAs == "pos" ? "PosP" : "Employee"} Login</h2>
          <div className="container">
            <label
              for="uname"
              className="label-class-name"
              style={{ width: "5rem" }}
            >
              <b>Email</b>
            </label>

            <input
              className="forget-input"
              type="email"
              placeholder="Enter Username"
              name="uname"
              {...register("emailAddress", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <p className="mb-0 f-error">{errors?.email?.message}</p>

            <label for="pass" className="label-class-name">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="pass"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <p className="mb-0 f-error">{errors?.password?.message}</p>
          </div>

          <div className="container-1">
            <button className="submitButtonLogin" type="submit" id="btn-size">
              {loading == true ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
          <br />
          <br />
          <label className="remember">
            {/* <input type="checkbox" checked="checked" name="remember"/>Remember me */}
            <span className="forgot-password-class">
              <Link to="/forgetpassword">Forgot Password?</Link>
            </span>
          </label>
          {/* <hr /> */}
          {/* <div className='he-sign'>
   <span>Don't have an account with us ?</span><span><a href=''>SIGNUP</a> <a href=''>SKIP LOGIN <span>{'>>'}</span></a></span>
  </div> */}
        </form>
      </div>
    </>
  );
};

export default Login;
