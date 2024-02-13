import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./IsAuthenticate.js";

const CheckEmployeeRoute = () => {
  const userDetails = useSelector((state) => state?.root?.userDetails);
  const type = useSelector((state) => state?.root?.userDetails.type);

  return isAuthenticated() && userDetails?.type == "employee" ? (
    <Outlet />
  ) : (
    <Navigate to={"/home"} />
  );
};

export default CheckEmployeeRoute;
