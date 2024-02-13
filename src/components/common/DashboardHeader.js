import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import HomeSection from "./SubmitOnlinePolicy/HomeSection";
import {
  dispatchResetQuickQuote,
  resetQuickQuoteResults,
  resetSelectedPlan,
} from "../../store/actions/userAction";
import { GetDataWithToken } from "../../api/apiHelper";
import { Link } from "react-router-dom";

function DashboardHeader() {
  const data = useSelector((state) => state?.root?.userDetails);

  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const type = useSelector((state) => state?.root?.userDetails.type);
  const [modal1, setModal1] = useState(false);
  const toggleModal1 = () => setModal1(!modal1);

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [vType, setVtype] = useState({ vehivleType: null, vehicleModel: null });

  const dispatch = useDispatch([]);
  useEffect(() => {
    if (apiRequestQQ?.VariantCode.Digit === undefined) {
      dispatchResetQuickQuote();
    }
    if (
      apiRequestQQ?.ManufaturingDate != "" &&
      apiRequestQQ?.RegistrationDate != ""
    ) {
      dispatchResetQuickQuote();
      dispatch(resetQuickQuoteResults());
      dispatch(resetSelectedPlan());
    }

    GetDataWithToken("admin/get-permission", "").then((response) => {
      if (response?.status == true) {
      }
    });
  }, []);
  const setVehicleType = (vehicleType, vehicleModel) => {
    setVtype({
      vehicleModel: vehicleModel,
      vehivleType: vehicleType,
    });
  };

  const secondModal = () => {
    setModal1(false);
    setModal(true);
  };

  return (
    <>
      <section className="profile-insurance">
        <div className=" ">
          {/* <div className='col-lg-4'>
            <div className='detail-box'>
              <h3 className='profile-heading'>
                <img src='./assets/img/icon-6.png' alt='' /> Relationship
                Manager
              </h3>
              <h4 className='profile-name'>
                {data.name} - {data.addedPos?.userName}
              </h4>
              <span className='phone-n'>
                <i className='bx bxs-phone'></i> {data.phone}
              </span>
              <span className='email-id'>
                <i className='bx bx-envelope'></i> {data.email}
              </span>
            </div>
            <div className='detail-box'>
              <h3 className='profile-heading'>
                <img src='./assets/img/icon-7.png' alt='' />
                Tele Relationship Manager
              </h3>
              <h4 className='profile-name'>Venkatesh Reddy - SIB393</h4>
              <span className='phone-n'>
                <i className='bx bxs-phone'></i> 9658214037
              </span>
              <span className='email-id'>
                <i className='bx bx-envelope'></i> Support@flaskitsolutions.com
              </span>
            </div>
          </div> */}
          {/* <div className="fs-8">
            <ul className="insurance-list row">
              <li className="col-sm mx-3 p-3">
                <img src="./assets/img/health.png" alt="" />
                <h5>Health Insurance</h5>
                <span>coming soon...</span>
                <a href="#">Click Here</a>
              </li>
              <li
                className="col-sm mx-3"
                onClick={() => {
                  setVehicleType("2w", "MotorBike");
                  toggleModal();
                }}
                style={{ cursor: "pointer" }}
              >
                <img src="./assets/img/Bike.png" alt="" />
                <h5>Bike Insurance</h5>
              </li>
              <li
                className="col-sm mx-3"
                onClick={() => {
                  setVehicleType("4w", "Pvt Car");
                  toggleModal();
                }}
                style={{ cursor: "pointer" }}
              >
                <img src="./assets/img/Car.png" alt="" />
                <h5>Car Insurance</h5>
              </li>
              <li
                className="col-sm mx-3"
                onClick={() => {
                  setVehicleType("pcv", "Passenger Carrying");
                  toggleModal();
                }}
                style={{ cursor: "pointer" }}
              >
                <img src="./assets/img/pcv.png" alt="" />
                <h5>PCV Insurance</h5>
              </li>
              <li
                className="col-sm mx-3"
                onClick={() => {
                  setVehicleType("gcv", "Goods Carrying");
                  toggleModal();
                }}
                style={{ cursor: "pointer" }}
              >
                <img src="./assets/img/gcv.png" alt="" />
                <h5>GCV Insurance</h5>
              </li>
              <li className="col-sm mx-3">
                <img src="./assets/img/traval.png" alt="" />
                <h5>Travel Insurance</h5>
                <a href="#">Click Here</a>
                <span>coming soon...</span>
              </li>
            </ul>
          </div> */}
        </div>
      </section>
      <HomeSection
        modal={modal}
        setModal={(val) => setModal(val)}
        toggleModal={toggleModal}
        vehicleType={vType.vehivleType}
        VehicleModel={vType.vehicleModel}
      />
    </>
  );
}

export default DashboardHeader;
