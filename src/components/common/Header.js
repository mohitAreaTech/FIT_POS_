import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import {
  dispatchQuickQuote,
  saveUserDetails,
} from "../../store/actions/userAction";
import SideBar from "./SideBar";

function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [openMenuResponsive, setOpenMenuResponsive] = useState(false);
  const data = useSelector((state) => state?.root?.userDetails);
  console.log("DATAD", data);
  console.log("data profile", data.profile_picture);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [allNotification, setAllNotification] = useState([])

  // useEffect(() => {
  //   GetDataWithToken('admin/get-notification', '').then(response => {
  //     if (response.status == true) {
  //       setAllNotification(response.data)
  //     }
  //   })
  // }, [''])

  console.log("WINDIWQ", window.location.pathname);

  const logotu = () => {
    ClearUserData().then((res) => {
      navigate("/");
    });
  };

  const ClearUserData = () => {
    return new Promise((resolve, reject) => {
      cookie.remove("userDetails");
      cookie.remove("postoken");

      dispatch(saveUserDetails({}));
      resolve("done");
    });
  };

  console.log("openMenuResponsive", openMenuResponsive);

  const handleResponsive = () => {
    console.log("HANDLE RESPONSIVENESS");

    dispatchQuickQuote("openSideBar", openMenuResponsive);
    setOpenMenuResponsive(!openMenuResponsive);
  };

  return (
    <div className="">
      <header className="header">
        <i
          className="fas fa-bars header__menu"
          onClick={() => handleResponsive()}
        ></i>
        <div className="header__search">
          <input className="header__input" placeholder="Search..." />
        </div>
        <div className="sidenav_det">
          <div className="sidenav__profile-title text-dark">{data.name}</div>
          <div className="id-number">{data.addedPos?.userName}</div>
        </div>
        <div
          className="header__avatar"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          <div
            className={`dropdown ${dropdownVisible ? "visible" : "invisible"}`}
          >
            <ul className="dropdown__list">
              <li className="dropdown__list-item">
                <span className="dropdown__icon">
                  <i className="far fa-user"></i>
                </span>
                <Link className="dropdown__title">my profile</Link>
              </li>
              <Link to="javascript:void(0);" onClick={logotu}>
                <li className="dropdown__list-item">
                  <span className="dropdown__icon">
                    <i className="fas fa-sign-out-alt"></i>
                  </span>
                  <span className="dropdown__title">log out</span>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </header>
    </div>
    // <header>
    //   <button classNameName="toggel">
    //     <img src="assets/img/bar.png" alt="img" />
    //   </button>

    //   <div classNameName="profile-id">
    //     <div classNameName="profile-photo">
    //       <img src={data.profile_picture} alt="" />
    //     </div>
    //     <div classNameName="profile-detail">
    //       <strong classNameName="name">{data.name}</strong>
    //       <span classNameName="id-number">{data.addedPos?.userName}</span>
    //     </div>
    //   </div>
    //   <div classNameName="header-links d-flex">
    //     <ul style={{ marginRight: 8 }}>
    //       {window?.location?.pathname === "/training" ? (
    //         ""
    //       ) : (
    //         <li>
    //           <Link to="/home">
    //             <img src="assets/img/home.png" alt="" />
    //           </Link>
    //         </li>
    //       )}
    //     </ul>
    //     <div
    //       classNameName="header-links d-flex btn-group"
    //       style={{ width: "4rem" }}
    //     >
    //       <button
    //         type="button"
    //         classNameName="btn btn-outline-primary dropdown-toggle toggle-none p-2 rounded-circle my-0"
    //         data-bs-toggle="dropdown"
    //       >
    //         <img
    //           src={
    //             data?.profile_picture
    //               ? data?.profile_picture
    //               : "/assets/images/userimg.jpeg"
    //           }
    //           classNameName="user-img"
    //           alt=""
    //         />
    //       </button>
    //       {/*----- DropDown items -----*/}
    //       <ul classNameName="dropdown-menu p-6 ">
    //         {window?.location?.pathname === "/training" ? (
    //           ""
    //         ) : (
    //           <li classNameName=" position-relative d-flex flex-column p-2">
    //             <Link
    //               classNameName="bi bi-person-lines-fill dropdown-item"
    //               style={{ width: "130px", backgroundColor: "#5" }}
    //               to={"/profile"}
    //             >
    //               {/* <i classNameName="fas fa-user-plus me-4 danger"></i> */}
    //               Profile
    //             </Link>
    //           </li>
    //         )}

    //         <li classNameName="position-relative d-flex flex-column p-2">
    //           <Link
    //             classNameName="bi bi-box-arrow-right dropdown-item "
    //             style={{ width: "130px", backgroundColor: "rgb(38 144 208)" }}
    //             to="javascript:void(0);"
    //             onClick={logotu}
    //           >
    //             Log out
    //           </Link>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>

    //   {/* For Logout Dropdown */}
    // </header>
  );
}

export default Header;
