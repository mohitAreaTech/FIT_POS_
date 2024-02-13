import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PostData } from "../../api/apiHelper";
import { sendErrorMessage, sendSuccessMessage } from "../services/userServices";
import "./Login.css";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ mode: "onBlur" });
  const navigate = useNavigate();
  const loaction = useLocation();

  const userEmail = loaction?.state?.email;

  const password = watch("password");

  const handleReset = (data) => {
    console.log("reset pass", data);
    let Data = {
      email: userEmail,
      password: data.passwordRepeat,
      otp: data.otp,
    };
    PostData("auth/reset", Data).then((response) => {
      if (response.status === true) {
        console.log("first", response.data);
        navigate("/");
        sendSuccessMessage(response);
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

        {/*----- Login form container start -----*/}

        <form onSubmit={handleSubmit(handleReset)} className="form-pos-login">
          <h2>Reset PosP Password</h2>
          <div className="container">
            <label htmlFor="upass" className="label-class-name">
              Enter Otp
              <span className="text-danger">*</span>
            </label>

            <input
              type="number"
              // className="form-control"
              id="upass"
              placeholder="Enter Otp"
              {...register("otp", {
                required: "Otp is required",
              })}
            />
            <p className="mb-0  f-error">{errors?.otp?.message}</p>

            <label htmlFor="upass" className="label-class-name">
              New Password
              <span className="text-danger">*</span>
            </label>

            <input
              type="password"
              id="upass"
              placeholder=" New Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <p className="mb-0 f-error">{errors?.password?.message}</p>

            <label htmlFor="upass2" className="label-class-name">
              Confirm Password
              <span className="text-danger">*</span>
            </label>

            <input
              type="password"
              id="upass2"
              placeholder="Confirm Password"
              {...register("passwordRepeat", {
                required: `Password is required`,
                validate: (value) =>
                  value === password || `The password do not match`,
                minLength: {
                  value: 6,
                  message: `Password length must be at least 6 characters long`,
                },
              })}
            />

            <p className="mb-0 f-error">{errors?.passwordRepeat?.message}</p>
          </div>
          <div className="container-1">
            <button className="submitButtonLogin" type="submit">
              Submit
            </button>
          </div>
        </form>

        {/*----- Login form container End -----*/}
      </div>
    </>
  );
};

export default ResetPassword;
