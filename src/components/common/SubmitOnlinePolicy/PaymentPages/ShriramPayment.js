import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const ShriramPayment = () => {
  const selectedPlan = useSelector((state) => state.root.selectedPlan);

  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const paymentData = {
    DbFrom: "NOVA",
    QuoteId: apiRequestQQ.ApiId,
    amount: selectedPlan.FinalPremium,
    application: "RETROINSURANCE",
    createdBy: "LC331",
    description: apiRequestQQ.policyId + "-" + apiRequestQQ.ApiId,
    isForWeb: "true",
    paymentFrom: "CCAVENUE",
    prodCode: "MOT-PRD-001",
    sourceUrl: process.env.REACT_APP_SUCCESS_URL,
  };

  return (
    <>
      <form
        method="post"
        action="https://novaapiuat.shriramgi.com/uatnovapymt/mydefaultcc.aspx"
      >
        {Object.keys(paymentData).map((item, i) => (
          <input type="text" value={paymentData[item]} name={item} hidden />
        ))}

        <input
          type="submit"
          value={paymentData?.amount}
          className="btn btn-primary fs-3 px-4 py-2"
        ></input>
      </form>
    </>
  );
};

export default ShriramPayment;

const getVehicleProductType = (vehicleType) => {
  // Goods Carrying   Passenger Carrying
  // Miscellaneous    Pvt Car
  // MotorBike        Trailer  Scooter
  switch (vehicleType) {
    case "4w":
      return "MOT-PRD-001";
    case "2w":
      return "MOT-PRD-002";
    case "gcv":
      return "MOT-PRD-003";
    case "gcv":
      return "MOT-PRD-004";
    case "pcv":
      return "MOT-PRD-005";
    case "Miscellaneous":
      return "MOT-PRD-006";
    default:
      return "MOT-PRD-001";
  }
};
