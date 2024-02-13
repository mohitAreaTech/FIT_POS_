import React from "react";
// import { Redirect, Route } from "react-router";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./IsAuthenticate.js";

const AuthRoute = () => {

  return isAuthenticated() ? <Outlet /> : <Navigate to={'/'} />

};

export default AuthRoute;