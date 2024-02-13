import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { makeid } from "../../../../store/reducers/userReducers";
const SHA512 = require("crypto-js/sha512");
const FutureGeneralPayment = () => {
  const selectedPlan = useSelector((state) => state.root.selectedPlan);
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const [randomId, setRandomId] = useState("");
  const [randomId2, setRandomId2] = useState("");
  const [hashedVal, setHashedVal] = useState("");
  const ProductInfo =
    apiRequestQQ.NewPolicyType == "ThirdParty" ? "Private Car Liability Only Policy" : "Private Car Comprehensive";
  useEffect(() => {
    let rdId = makeid(24);
    setRandomId(rdId);

    let rdId2 = makeid(24);
    setRandomId2(rdId2);

    let hashedValue = SHA512(
      `${randomId}|3|${process.env.REACT_APP_SUCCESS_URL}|${randomId2}|${selectedPlan.FinalPremium}|NA|NA|${apiRequestQQ.FirstName}|${apiRequestQQ.LastName}|${apiRequestQQ?.MobileNumber}|${apiRequestQQ?.Email}|"`
    ).toString();
    setHashedVal(hashedValue);
    console.log("hashed value", hashedValue);
  }, []);
  return (
    <>
      <form
        method="post"
        id="future-form"
        action="http://online.futuregenerali.in/Ecom_NL/WEBAPPLN/UI/Common/WebAggPay.aspx"
      >
        <input type="text" value={randomId} name="TransactionID" hidden />
        <input type="text" value={"3"} name="PaymentOption" hidden />
        <input type="text" value={process.env.REACT_APP_SUCCESS_URL} name="ResponseURL" hidden />
        <input type="text" value={randomId2} name="ProposalNumber" hidden />
        <input type="text" value={selectedPlan.FinalPremium} name="PremiumAmount" hidden />
        <input type="text" value={"NA"} name="UserIdentifier" hidden />
        <input type="text" value={"NA"} name="UserId" hidden />
        <input type="text" value={apiRequestQQ.FirstName} name="FirstName" hidden />
        <input type="text" value={apiRequestQQ.LastName} name="LastName" hidden />
        <input type="text" value={apiRequestQQ?.MobileNumber} name="Mobile" hidden />
        <input type="text" value={apiRequestQQ?.Email} name="Email" hidden />
        <input type="text" value={hashedVal} name="CheckSum" hidden />
        <button type="submit" className="btn btn-primary fs-3 px-4 py-2">
          Buy <span> {selectedPlan.FinalPremium}</span>
        </button>
      </form>
    </>
  );
};

export default FutureGeneralPayment;
