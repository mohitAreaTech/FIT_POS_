import React from "react";
import SideBar from "../../common/SideBar";
import Header from "../../common/Header";
import { useNavigate } from "react-router-dom";

const OfflineQuote = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <SideBar />

      <section class="">
        <div class="">
          <div id="main_div">
            <Header />
          </div>
        </div>
        <div>
          <div className="col-lg-8 mt-4">
            <ul className="insurance-list">
              <li
                onClick={() => navigate("/submitOfflinePolicy")}
                style={{ cursor: "pointer" }}
              >
                <img src="./assets/images/submit-offline.png" alt="" />
                <h5>Submit Offline Policy</h5>
              </li>
              <li
                onClick={() => navigate("/requestOfflinePolicy")}
                style={{ cursor: "pointer" }}
              >
                <img src="./assets/images/request-offline.png" alt="" />
                <h5>Request Offline Policy</h5>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfflineQuote;
