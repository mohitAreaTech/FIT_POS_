import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./IsAuthenticate";

const CheckAuth = () => {
  const type = useSelector((state) => state?.root?.userDetails.isVerified);
  console.log("type print ", type)
if(type === false) {
  return !isAuthenticated() ? <Outlet /> : <Navigate to={'/training'} />
}else {
  return !isAuthenticated() ? <Outlet /> : <Navigate to={'/home'} />
}
  

}

export default CheckAuth