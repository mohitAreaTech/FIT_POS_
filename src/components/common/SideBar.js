import { data } from "jquery";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { dispatchQuickQuote } from "../../store/actions/userAction";
import { useMediaQuery } from "react-responsive";
const OfflineLinks = ["/offlineQuote", "/submitOfflinePolicy"];
function SideBar() {
  const [checkActive, setCheckActive] = useState(false);
  const data = useSelector((state) => state?.root?.userDetails);
  const apiRequestQQ = useSelector((state) => state?.root?.apiRequestQQ);
  const [showOfflineQuote, setShowOfflineQuote] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const navigate = useNavigate();
  const checkPosPolicyBarActive = () => {
    setCheckActive(!checkActive);
    // let check = OfflineLinks.includes(location.pathname);
    // console.log("check", check);
    // if (check) {
    //   return true;
    // } else {
    //   return false;
    // }
  };

  const checkSubmitPolicyActive = () => {
    let check = location.pathname;
    if (check === "/submitOfflinePolicy") {
      return true;
    } else {
      return false;
    }
  };
  const checkOfflinePolicyActive = () => {
    let check = location.pathname;
    // console.log("check", check === "/pos-certified")
    if (check === "/submitOfflinePolicy") {
      return true;
    } else {
      return false;
    }
  };

 

  function toggleArrowRotation() {
    document.getElementById("arrow-icon").classNameList.toggle("rotate-arrow");
  }

  return (
    <aside
      className={`${
        isMobile && apiRequestQQ?.openSideBar
          ? "sidenav"
          : isMobile === false
          ? "sidenav"
          : ""
      } `}
    >
      <div className="sidenav__brand">
        <a className="sidenav__brand-link" href="#">
          <img src="assets/img/logo1.png" alt="" />
        </a>
        <i className="fas fa-times sidenav__brand-close"></i>
      </div>
      
      <div className="row--align-v-center row--align-h-center">
        <ul className="navList">
          <li>
            <div className="navList__subheading row row--align-v-center" onClick={()=> navigate('/home')}>
              <span className="navList__subheading-icon">
                <i>
                  <img src="assets/img/deshbord.png" alt="" />
                </i>
              </span>
              <span className="navList__subheading-title">Dashboard</span>
            </div>
          </li>
          <li>
            <div className="navList__subheading row row--align-v-center">
              <span className="navList__subheading-icon">
                <i>
                  <img src="assets/img/OfflineQuote.png" alt="" />
                </i>
              </span>
              <span
                className="navList__subheading-title"
                onClick={() => setShowOfflineQuote(!showOfflineQuote)}
              >
                Offline Quote
              </span>
            </div>
            {showOfflineQuote && (
              <ul className="">
                <li
                  className="nav-item"
                  onClick={() =>
                    dispatchQuickQuote(
                      "openSideBar",
                      !apiRequestQQ?.openSideBar
                    )
                  }
                >
                  <Link
                    to="/submitOfflinePolicy"
                    className={
                      checkSubmitPolicyActive() ? "nav-link active" : "nav-link"
                    }
                  >
                    <span className="navList__subheading-icon">
                      <i>
                        <img src="assets/img/OfflineQuote.png" alt="" />
                      </i>
                    </span>
                    <span className="nav-title">Submit Offline Policy</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      checkOfflinePolicyActive()
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    <span className="navList__subheading-icon">
                      <i>
                        <img src="assets/img/OfflineQuote.png" alt="" />
                      </i>
                    </span>
                    <span className="nav-title">Request Offline Policy</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <div className="navList__subheading row row--align-v-center" onClick={()=> navigate('/pendingPolicy')}>
              <span className="navList__subheading-icon">
                <i>
                  <img src="assets/img/deshbord.png" alt="" />
                </i>
              </span>
              <span className="navList__subheading-title">Total Pending Policy</span>
            </div>
          </li>
          <li>
            <div className="navList__subheading row row--align-v-center" onClick={()=> navigate('/generatedPolicy')}>
              <span className="navList__subheading-icon">
                <i>
                  <img src="assets/img/deshbord.png" alt="" />
                </i>
              </span>
              <span className="navList__subheading-title">Total Generated Policy</span>
            </div>
          </li>
        </ul>
      </div>
    </aside>
   
 
  );
}

export default SideBar;
