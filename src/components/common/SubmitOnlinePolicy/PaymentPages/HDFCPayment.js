import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { generateHDFCChecksum } from "../../../services/masterService";
import { dispatchQuickQuote } from "../../../../store/actions/userAction";
// import { sendErrorMessage } from "../../../Services/posServices";
const HDFCPayment = () => {
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const [checkSumData, setCheckSumData] = useState(null);
  let today = moment().format("YYYY-MM-DD");
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // console.log("randint", rndInt);

  let valArr = [];
  useEffect(() => {
    generateNumber();
    let checksumdata = {
      TransactionNo: `1085${today.replaceAll("-", "")}${valArr.sort().join("")}`,
      TotalAmount: apiRequestQQ.PaymentAmount,
      AppID: "10243",
      SubscriptionID: "S000000290",
      SuccessUrl: process.env.REACT_APP_SUCCESS_URL,
      FailureUrl: process.env.REACT_APP_ERROR_URL,
      Source: "POST",
    };
    generateHDFCChecksum(checksumdata).then((response) => {
      if (response.status === true) {
        checksumdata.Chksum = response.data;
        console.log(checksumdata);
        setCheckSumData(checksumdata);
        dispatchQuickQuote("PaymentId", checksumdata.TransactionNo);
      } else {
        alert("Something went wrong");
        // sendErrorMessage(response);
      }
    });

    // soap();
  }, []);

  const generateNumber = () => {
    const rndInt = randomIntFromInterval(0, 9);
    if (valArr.length < 5) {
      if (valArr.includes(rndInt) === false) {
        valArr.push(rndInt);
      }
      generateNumber();
    }
  };
  return (
    <>
      <form method="post" action="http://202.191.196.210/UAT/OnlineProducts/CCPGISUBSCRIBER/MakePayment.aspx">
        <input type="text" value={checkSumData?.TransactionNo} name="Trnsno" hidden />
        <input type="text" value={checkSumData?.TotalAmount} name="Amt" hidden />
        <input type="text" value={checkSumData?.AppID} name="Appid" hidden />
        <input type="text" value={checkSumData?.SubscriptionID} name="Subid" hidden />
        <input type="text" value={checkSumData?.SuccessUrl} name="Surl" hidden />
        <input type="text" value={checkSumData?.FailureUrl} name="Furl" hidden />
        <input type="text" value={checkSumData?.Source} name="Src" hidden />
        <input type="text" value={checkSumData?.Chksum} name="Chksum" hidden />
        <button type="submit" className="btn btn-primary fs-3 px-4 py-2">
          Buy <span> {checkSumData?.TotalAmount}</span>
        </button>
      </form>
    </>
  );
};

export default HDFCPayment;
