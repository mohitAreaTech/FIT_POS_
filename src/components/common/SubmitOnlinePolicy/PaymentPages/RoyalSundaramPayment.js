import React from "react";
import { useSelector } from "react-redux";

const RoyalSundaramPayment = () => {
  const selectedPlan = useSelector((state) => state.root.selectedPlan);
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const agentId = apiRequestQQ.VehicleType == "4w" ? "BA502116" : "BA508314";
  return (
    <>
      {/* {apiRequestQQ.VehicleType == "4w" ? (
        <form
          id="PostForm"
          name="PostForm"
          autoComplete="off"
          action="https://www.royalsundaram.net/web/dtctest/paymentgateway"
          method="post"
        >
          <input type="hidden" name="reqType" id="reqType" value="JSON" />
          <input type="hidden" name="process" value="paymentOption" />
          <input type="hidden" name="apikey" id="apikey" value="310ZQmv/bYJMYrWQ1iYa7s43084=" />
          <input type="hidden" name="agentId" id="agentId" value="BA502116" />
          <input type="hidden" name="premium" value={selectedPlan.FinalPremium} />
          <input type="hidden" name="quoteId" id="quoteId" value={selectedPlan.ApiId} />
          <input type="hidden" name="version_no" id="version_no" value="12345" />
          <input type="hidden" name="strFirstName" id="strFirstName" value={apiRequestQQ.FirstName} />
          <input type="hidden" name="strEmail" id="strEmail" value={apiRequestQQ.Email} />
          <input type="hidden" name="strMobileNo" id="strMobileNo" value={apiRequestQQ.MobileNumber} />
          <input type="hidden" name="isQuickRenew" id="isQuickRenew" value="No" />
          <input type="hidden" name="returnUrl" id="returnUrl" value={process.env.REACT_APP_SUCCESS_URL} />
          <input type="hidden" value="privatePassengerCar" name="vehicleSubLine" id="motorshieldonline" />
          <input
            type="hidden"
            value={selectedPlan?.ElectricAmount ? selectedPlan?.ElectricAmount : 0}
            name="elc_value"
            id="elc_value"
          />
          <input type="hidden" name="crossSellProduct" id="crossSellProduct" defaultValue />
          <input type="hidden" name="crossSellQuoteid" id="crossSellQuoteid" defaultValue />
          <input type="hidden" name="newSystem" id="newSystem" value="Yes" />
          <input type="hidden" name="callingApp" id="callingApp" value="motorshieldonline" />
          <input
            type="hidden"
            value={selectedPlan?.nonElectricalAmount ? selectedPlan?.nonElectricalAmount : 0}
            name="nonelc_value"
            id="nonelc_value"
          />
          <input type="hidden" value="billdesk" name="paymentType" />
          <input type="hidden" value="billdesk" name="paymentgateway" />
          <button type="submit" className="btn btn-primary fs-3 px-4 py-2">
            Buy <span> {selectedPlan.FinalPremium}</span>
          </button>
        </form>
      ) : ( */}
      <form
        id="PostForm"
        name="PostForm"
        autoComplete="off"
        action="https://www.royalsundaram.net/web/test/paymentgateway"
        method="post"
      >
        <input type="hidden" name="reqType" id="reqType" value="JSON" />
        <input type="hidden" name="process" value="paymentOption" />
        <input type="hidden" name="apikey" id="apikey" value="310ZQmv/bYJMYrWQ1iYa7s43084=" />
        <input type="hidden" name="agentId" id="agentId" value={agentId} />
        <input type="hidden" name="premium" value={selectedPlan.FinalPremium} />
        <input type="hidden" name="quoteId" id="quoteId" value={selectedPlan.ApiId} />
        <input type="hidden" name="version_no" id="version_no" value={12345} />
        <input type="hidden" name="strFirstName" id="strFirstName" value={apiRequestQQ.FirstName} />
        <input type="hidden" name="strEmail" id="strEmail" value={apiRequestQQ.Email} />
        <input type="hidden" name="strMobileNo" id="strMobileNo" value={apiRequestQQ.MobileNumber} />
        <input type="hidden" name="isQuickRenew" id="isQuickRenew" value="No" />
        <input type="hidden" name="returnUrl" id="returnUrl" value={process.env.REACT_APP_SUCCESS_URL} />
        <input type="hidden" value="privatePassengerCar" name="vehicleSubLine" id="privatePassengerCar" />
        <input
          type="hidden"
          value={selectedPlan?.ElectricAmount ? selectedPlan?.ElectricAmount : 0}
          name="elc_value"
          id="elc_value"
        />
        <input
          type="hidden"
          value={selectedPlan?.nonElectricalAmount ? selectedPlan?.nonElectricalAmount : 0}
          name="nonelc_value"
          id="nonelc_value"
        />
        <input type="hidden" value="billdesk" name="paymentType" />
        <button type="submit" className="btn btn-primary fs-3 px-4 py-2">
          Buy <span> {selectedPlan.FinalPremium}</span>
        </button>
      </form>
      {/* )} */}
    </>
  );
};

export default RoyalSundaramPayment;
