import React from "react";
import { useSelector } from "react-redux";
const FutureGeneralKYCRedirect = ({ url, proposalNo, kycno }) => {
  const userDetails = useSelector((state) => state.root.userDetails);
  return (
    <div className="row">
      <div className="col-lg-3"></div>
      <div className="col-lg-6 text-center">
        <table>
          <tbody>
            <tr>
              <td>
                <strong>You are being redirected to KYC portal</strong>
              </td>
            </tr>
            <tr>
              <td>
                <font color="blue">Please wait ...</font>
              </td>
            </tr>
            <tr>
              <td>(Please Click on KYC Verification Button)</td>
            </tr>
            <tr>
              <td>(Please do not press 'Refresh' or 'Back' button)</td>
            </tr>
          </tbody>
        </table>
        <form
          id="kycRedirectionForm"
          name="kycRedirectionForm"
          method="post"
          action={url}
        >
          <input
            type="hidden"
            name="Aggregator_KYC_Req_No"
            id="Aggregator_KYC_Req_No"
            defaultValue={proposalNo}
          />
          <input
            type="hidden"
            name="IC_KYC_No"
            id="IC_KYC_No"
            defaultValue={kycno}
          />
          <input
            type="hidden"
            name="Aggregator_Return_URL"
            id="Aggregator_Return_URL"
            defaultValue={`https://pos.flaskitsolutions.com/proposal`}
          />
          <button className="btn btn-primary mb-5 mt-3 py-3 w-100 fs-1 fw-bold">
            KYC Verification
          </button>
        </form>
      </div>
      <div className="col-lg-3"></div>
    </div>
  );
};

export default FutureGeneralKYCRedirect;
