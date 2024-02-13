import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PostData } from "../../api/apiHelper";
import { useForm } from "react-hook-form";
import { sendErrorMessage } from "../services/userServices";
import "./Login.css";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const navigate = useNavigate();

  const handleForget = (data) => {
    PostData("auth/forget", data).then((response) => {
      if (response.status === true) {
        console.log("first", response.data);
        navigate("/resetpassword", { state: { email: data.email } });
      } else {
        sendErrorMessage(response);
      }
    });
  };

  return (
    <>
      <div className="maindiv">
        <div className="image-info">
          <img
            src="/assets/images/LoginScreen-1.png"
            alt="Avatar"
            class="avatar"
          />
        </div>

        <div className="login-wrap">
          <form onSubmit={handleSubmit(handleForget)} className="">
            <h2>Enter PosP Email</h2>
            <div className="container">
              <label htmlFor="umail">
                Enter Email
                <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="umail"
                placeholder="Enter User Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                })}
              />

              <p className="mb-0 f-error">{errors?.email?.message}</p>
            </div>

            <div className="container-1">
              <button className="submitButtonLogin" type="submit">
                Submit
              </button>
            </div>
            <label className="remember">
              {/* <input type="checkbox" checked="checked" name="remember"/>Remember me */}
              <span className="forgot-password-class">
                <Link to="/">Already Have an account? Login</Link>
              </span>
            </label>
          </form>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
