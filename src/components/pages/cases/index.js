
import React, { useEffect, useRef, useState } from "react";
import Header from "../common/Header";
import { Link } from "react-router-dom";
import { GetData, GetDataWithToken } from "../../api/apiHelper";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import Loader from "../common/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { downloadBase64File } from "../utility/TPApiCall";







const Cases = () => {



    
    const navigate = useNavigate()
  return (
   
    <div>
      <h3>Cases page</h3>
     
    </div>
  )
}

export default Cases;