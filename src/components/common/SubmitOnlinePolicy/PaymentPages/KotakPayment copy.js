import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { APPURL, PostDataWithToken } from "../../../api/apiHelper";
import { makeid } from "../../../store/reducers/userReducers";
const SHA512 = require("crypto-js/sha512");
const KotakPayment = () => {
  const selectedPlan = useSelector((state) => state.root.selectedPlan);
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const [randomId, setRandomId] = useState("");
  const [hashedVal, setHashedVal] = useState("");
  const ProductInfo =
    apiRequestQQ.NewPolicyType == "ThirdParty"
      ? "Private Car Liability Only Policy"
      : apiRequestQQ.NewPolicyType == "ODOnly"
      ? "ODOnly"
      : "Private Car Comprehensive";
  useEffect(() => {
    let rdId = makeid(24);
    setRandomId(rdId);

    let hashedValue = SHA512(
      `an7rIU|${rdId}|${selectedPlan.FinalPremium}|${selectedPlan.insurer}|${apiRequestQQ.FirstName}|${apiRequestQQ.Email}|${selectedPlan.PolicyId}|${selectedPlan.ApiId}|${ProductInfo}|${selectedPlan?.vProposalNumber}|${selectedPlan?.Api_name}||||||8MUr8LS7`
    ).toString();
    setHashedVal(hashedValue);
    console.log("hashed value", hashedValue);
  }, []);

  // const submitPayData = (e) => {
  //   e.preventDefault();
  //   // PaymentUrl: "https://test.payu.in/_payment",
  //   // PaymentMethod: "POST",
  //   let data = {
  //     key: "an7rIU",
  //     txnid: randomId,
  //     amount: selectedPlan.FinalPremium,
  //     productinfo: selectedPlan.insurer,
  //     firstname: apiRequestQQ.FirstName,
  //     email: apiRequestQQ?.Email,
  //     phone: apiRequestQQ?.MobileNumber,
  //     surl: process.env.REACT_APP_SUCCESS_URL,
  //     furl: process.env.REACT_APP_ERROR_URL,
  //     curl: process.env.REACT_APP_ERROR_URL,
  //     hash: hashedVal,
  //   };
  //   PostDataWithToken("motor/generateKotakPayment", data).then((res) => {
  //     console.log("pay data response---", res);
  //   });
  //   // axios
  //   //   .post("https://test.payu.in/_payment", data, {
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //       Accept: "application/json",
  //   //     },
  //   //   })
  //   //   .then((res) => {
  //   //     console.log("pay data response---", data);
  //   //   });
  // };

  return (
    <>
      <form method="post" id="kotak-form" action="https://test.payu.in/_payment">
        {}
        <input type="text" value={hashedVal} name="hash" hidden />
        <input type="text" value={"an7rIU"} name="key" hidden />
        <input type="text" value={randomId} name="txnid" hidden />
        <input type="text" value={selectedPlan.FinalPremium} name="amount" hidden />
        <input type="text" value={selectedPlan.insurer} name="productinfo" hidden />
        <input type="text" value={apiRequestQQ.FirstName} name="firstname" hidden />
        <input type="text" value={apiRequestQQ?.Email} name="email" hidden />
        <input type="text" value={apiRequestQQ?.MobileNumber} name="phone" hidden />
        <input type="text" value={apiRequestQQ?.LastName} name="lastname" hidden />
        {/* <input type="text" value={process.env.REACT_APP_SUCCESS_URL} name="surl" hidden />
        <input type="text" value={process.env.REACT_APP_ERROR_URL} name="furl" hidden />
        <input type="text" value={process.env.REACT_APP_ERROR_URL} name="curl" hidden /> */}
        <input type="text" value={`${APPURL()}api/v1/motor/successPage`} name="surl" hidden />
        <input type="text" value={`${APPURL()}api/v1/motor/errorpage`} name="furl" hidden />
        <input type="text" value={`${APPURL()}api/v1/motor/errorpage`} name="curl" hidden />
        <input type="text" value={selectedPlan.PolicyId} name="udf1" hidden />
        <input type="text" value={selectedPlan.ApiId} name="udf2" hidden />
        <input type="text" value={ProductInfo} name="udf3" hidden />
        <input type="text" value={selectedPlan?.vProposalNumber} name="udf4" hidden />
        <input type="text" value={selectedPlan?.Api_name} name="udf5" hidden />
        <button type="submit" className="btn btn-primary fs-3 px-4 py-2">
          Buy <span> {selectedPlan.FinalPremium}</span>
        </button>
      </form>
    </>
  );
};

export default KotakPayment;
