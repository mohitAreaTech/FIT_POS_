import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { APPURL } from "../../../../api/apiHelper";
import { makeid } from "../../../../store/reducers/userReducers";
const SHA512 = require("crypto-js/sha512");
const KotakPayment = () => {
  const selectedPlan = useSelector((state) => state.root.selectedPlan);
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const userDetails = useSelector((state) => state.root.userDetails);
  const [randomId, setRandomId] = useState("");
  const [hashedVal, setHashedVal] = useState("");

  const ProductInfo =
    apiRequestQQ.NewPolicyType == "ThirdParty"
      ? "Private Car Liability Only Policy"
      : "Private Car Comprehensive";
  useEffect(() => {
    let rdId = makeid(24) + "-" + userDetails.type;
    setRandomId(rdId);
    console.log(
      "hash value",
      `KoXBAd|${rdId}|${selectedPlan.FinalPremium}|${selectedPlan.insurer}|${apiRequestQQ.FirstName}|${apiRequestQQ.Email}|{RETRO INSURANCE BROKER PRIVATE LIMITED}|${selectedPlan.PolicyId}|${selectedPlan.ApiId}|${ProductInfo}|${selectedPlan?.vProposalNumber}||||||uM9IRHYR`
    );
    let hashedValue = SHA512(
      `KoXBAd|${rdId}|${selectedPlan.FinalPremium}|${selectedPlan.insurer}|${apiRequestQQ.FirstName}|${apiRequestQQ?.Email}|{RETRO INSURANCE BROKER PRIVATE LIMITED|${selectedPlan.PolicyId}|${selectedPlan.ApiId}|${ProductInfo}|${selectedPlan?.vProposalNumber}||||||uM9IRHYR`
    ).toString();
    setHashedVal(hashedValue);
  }, []);
  return (
    <>
      <form
        method="post"
        id="kotak-form"
        action="https://secure.payu.in/_payment"
      >
        <input type="text" value={hashedVal} name="hash" hidden />
        <input type="text" value={"KoXBAd"} name="key" hidden />
        <input type="text" value={randomId} name="txnid" hidden />
        <input
          type="text"
          value={selectedPlan.FinalPremium}
          name="amount"
          hidden
        />
        <input
          type="text"
          value={selectedPlan.insurer}
          name="productinfo"
          hidden
        />
        <input
          type="text"
          value={apiRequestQQ.FirstName}
          name="firstname"
          hidden
        />
        <input type="text" value={apiRequestQQ?.Email} name="email" hidden />
        <input
          type="text"
          value={apiRequestQQ?.MobileNumber}
          name="phone"
          hidden
        />
        <input
          type="text"
          value={apiRequestQQ?.LastName}
          name="lastname"
          hidden
        />
        <input
          type="text"
          value={`${APPURL()}api/v1/motor/successPage`}
          name="surl"
          hidden
        />
        <input
          type="text"
          value={`${APPURL()}api/v1/motor/errorpage`}
          name="furl"
          hidden
        />
        <input
          type="text"
          value={`${APPURL()}api/v1/motor/errorpage`}
          name="curl"
          hidden
        />
        <input
          type="text"
          value={"RETRO INSURANCE BROKER PRIVATE LIMITED"}
          name="udf1"
          hidden
        />
        <input type="text" value={selectedPlan.PolicyId} name="udf2" hidden />
        <input type="text" value={selectedPlan.ApiId} name="udf3" hidden />
        <input type="text" value={ProductInfo} name="udf4" hidden />
        <input
          type="text"
          value={selectedPlan?.vProposalNumber}
          name="udf5"
          hidden
        />
        {/* {/ <input type="text" value={selectedPlan?.Api_name} name="udf5" hidden /> /} */}
        <button type="submit" className="btn btn-primary fs-3 px-4 py-2">
          Buy <span> {selectedPlan.FinalPremium}</span>
        </button>
      </form>
    </>
  );
};

export default KotakPayment;
