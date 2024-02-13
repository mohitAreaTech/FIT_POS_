import { toast } from "react-toastify";
import { PostDataWithToken, PostImageDataWithToken } from "../../api/apiHelper";
import store from "../../store";
import {
  dispatchQuickQuote,
  quickQuoteResult,
  setLeadId,
} from "../../store/actions/userAction";
import {
  quickQuotePayloadObj,
  createOnlinePolicyObj,
  createQuotePayloadObj,
} from "../../store/reducers/userReducers";
import { policyResultArr } from "./MakeModelArr";
import axios from "axios";
import moment from "moment";
import { sendErrorMessage } from "../services/userServices";
// Logo, Api_name, PolicyId, ApiId, RegisterNumber, Make, Model, variant,
// BasicODPremium, BasicTPPremium, PAForOwner, NetPremium, GST, FinalPremium,
// MinIdv, MaxIdv, StartDate, EndDate, discount, insurer

export const createCustomer = (postdata) => {
  let formData = new FormData();
  for (let key in postdata) {
    formData.append(key, postdata[key]);
  }
  PostImageDataWithToken("motor/create-customer", formData).then((response) => {
    if (response.status === true) {
      dispatchQuickQuote("customerId", response.data.id);
    } else {
      toast.info(response.message);
    }
  });
};

export const savePolicyToDatabase = (apiRequestQQ) => {
  let obj = createOnlinePolicyObj(apiRequestQQ);
  let formData = new FormData();
  for (let key in obj) {
    formData.append(key, obj[key]);
  }
  formData.append("posId", store.getState().root.userDetails.id);
  formData.append("customerId", store.getState().root.apiRequestQQ.customerId);
  PostImageDataWithToken("motor/fill-policy-data", formData).then(
    (response) => {
      if (response.status === true) {
        console.log("uploaded policy id ", response.data);
        dispatchQuickQuote("policyIdDb", response.data.id);
        dispatchQuickQuote("leadId", response.data.leadId);
      } else {
        toast.info(response.message);
      }
    }
  );
};
export const uploadFileAttechment = (file, policyId) => {
  let formData = new FormData();
  formData.append("final_policy", file);
  formData.append("policyId", policyId);
  PostImageDataWithToken("motor/upload-final-policy", formData).then(
    (response) => {
      if (response.status === true) {
        console.log("file uoloaded");
      } else {
        toast.info(response.message);
      }
    }
  );
};

export const changePolicyStatus = (status, leadId) => {
  let postdata = {
    status: status,
    leadId: leadId,
  };
  PostDataWithToken("motor/change-lead-status", postdata).then((response) => {
    if (response.status === true) {
      console.log("status changed");
    } else {
      toast.info(response.message);
    }
  });
};

export const digitAPICall = (apiRequestQQ) => {
  PostDataWithToken("motor/digit", quickQuotePayloadObj(apiRequestQQ))
    .then((response) => {
      if (response.status === true) {
        let {
          enquiryId,
          contract,
          vehicle,
          netPremium,
          grossPremium,
          serviceTax,
          discounts,
        } = response.data;

        let ncbDiscount = 0;
        if (discounts?.otherDiscounts && discounts.otherDiscounts.length > 0) {
          let index = discounts.otherDiscounts.findIndex(
            (item) => item.discountType === "NCB_DISCOUNT"
          );
          if (index > -1) {
            ncbDiscount =
              discounts.otherDiscounts &&
              discounts.otherDiscounts[index].discountAmount;
          }
        }
        store.dispatch(
          quickQuoteResult(
            policyResultArr(
              "../assets/images/logos/partners/digit.png",
              "digit",
              "",
              enquiryId,
              vehicle.licensePlateNumber,
              vehicle.make,
              vehicle.model,
              "",
              contract.coverages.ownDamage.netPremium,
              contract.coverages.thirdPartyLiability.netPremium,
              contract.coverages.personalAccident.selection === true
                ? contract.coverages.personalAccident.netPremium
                : false,
              netPremium,
              serviceTax.totalTax,
              grossPremium,
              vehicle.vehicleIDV.minimumIdv || 0,
              vehicle.vehicleIDV.maximumIdv || 0,
              vehicle.vehicleIDV.idv || 0,
              contract.startDate,
              contract.endDate,
              discounts.totalLoadingAmount,
              "Go Digit General Insurance Ltd",
              apiRequestQQ.NewPolicyType,
              contract.coverages.addons.roadSideAssistance.selection === true
                ? contract.coverages.addons.roadSideAssistance.netPremium
                : false,
              contract.coverages.addons.engineProtection.selection === true
                ? contract.coverages.addons.engineProtection?.netPremium
                : false,
              contract.coverages.addons.tyreProtection.selection === true
                ? contract.coverages.addons.tyreProtection?.netPremium
                : false,
              contract.coverages.addons.rimProtection.selection === true
                ? contract.coverages.addons.rimProtection?.netPremium
                : false,
              contract.coverages.addons.consumables.selection === true
                ? contract.coverages.addons.consumables?.netPremium
                : false,
              contract.coverages.accessories.electrical.selection,
              contract.coverages.accessories.nonElectrical.selection,
              contract.coverages.addons.returnToInvoice.selection === true
                ? contract.coverages.addons.returnToInvoice?.netPremium
                : false,
              false,
              false,
              false,
              contract.coverages.unnamedPA.unnamedPaidDriver.selection === true
                ? contract.coverages.unnamedPA.unnamedPaidDriver?.netPremium
                : false,
              contract.coverages.addons.personalBelonging.selection === true
                ? contract.coverages.addons.personalBelonging?.netPremium
                : false,
              false,
              contract.coverages.addons.keyAndLockProtect.selection === true
                ? contract.coverages.addons.keyAndLockProtect?.netPremium
                : false,
              contract.coverages.personalAccident.selection === true
                ? contract.coverages.personalAccident.netPremium
                : 0,
              contract.coverages.unnamedPA.unnamedPaidDriver.selection === true
                ? contract.coverages.unnamedPA.unnamedPaidDriver.netPremium
                : 0,
              contract.coverages.accessories.electrical.selection === true
                ? contract.coverages.accessories.electrical.insuredAmount
                : 0,
              contract.coverages.accessories.nonElectrical.selection === true
                ? contract.coverages.accessories.nonElectrical.insuredAmount
                : 0,
              0,
              ncbDiscount,
              contract.coverages.accessories.cng.selection,
              contract.coverages.legalLiability.paidDriverLL.selection === true
                ? contract.coverages.legalLiability.paidDriverLL.insuredAmount
                : false
            )
          )
        );
      } else {
        sendErrorMessage(response);
      }
    })
    .catch((err) => console.log(err));
};

export const digitCreateQuoteApiCall = async (apiRequestQQ) => {
  try {
    let response = await PostDataWithToken(
      "motor/digit-create-quote",
      createQuotePayloadObj(apiRequestQQ)
    );
    return response;
  } catch (err) {
    console.log(err);
    alert("something went wrong");
  }
};

export const digitPaymentApi = (applicationId) => {
  let postData = {
    applicationId: applicationId,
    cancelReturnUrl: process.env.REACT_APP_ERROR_URL,
    successReturnUrl: process.env.REACT_APP_SUCCESS_URL,
  };
  PostDataWithToken("motor/digit-payment", postData).then((response) => {
    if (response.status === true) {
      window.location.href = response.data;
    }
  });
};

export const downloadDigitPdf = (applicationId) => {
  let postData = {
    policyId: applicationId,
  };
  PostDataWithToken("motor/digit-pdf-download", postData).then((res) => {
    if (res.status === true) {
      window.location.href = res.data.schedulePath;
    }
  });
};

//Bajaj

export const bajajApiCall = (apiRequestQQ) => {
  PostDataWithToken("motor/bajaj", quickQuotePayloadObj(apiRequestQQ))
    .then((response) => {
      if (response.status === true) {
        if (response.data.errorcode === 0) {
          let { transactionid, premiumsummerylist, premiumdetails } =
            response.data;
          console.log("response data", response.data);
          store.dispatch(
            quickQuoteResult(
              policyResultArr(
                "../assets/images/logos/partners/bajaj.png",
                "bajaj",
                "",
                transactionid,
                apiRequestQQ.RegistrationNumber,
                apiRequestQQ.MakeName,
                apiRequestQQ.MakeName,
                "",
                getDataOfBajajAct(premiumsummerylist, "OD", "od"),
                getDataOfBajajAct(premiumsummerylist, "ACT", "act"),
                getDataOfBajajAct(premiumsummerylist, "PA_DFT", "act"),
                premiumdetails.netpremium,
                premiumdetails.servicetax,
                premiumdetails.finalpremium,
                parseInt(premiumdetails.totaliev) -
                  (parseInt(premiumdetails.totaliev) * 30) / 100,
                parseInt(premiumdetails.totaliev) +
                  (parseInt(premiumdetails.totaliev) * 30) / 100,
                premiumdetails.totaliev,
                apiRequestQQ.PolicyStartDate,
                apiRequestQQ.PolicyEndDate,
                getDataOfBajajAct(premiumsummerylist, "COMMDISC", "od"),
                "Bajaj Allianz General Insurance Company Limited",
                apiRequestQQ.NewPolicyType,
                getDataOfBajajAct(premiumsummerylist, "S1", "od"),
                getDataOfBajajAct(premiumsummerylist, "S4", "od"),
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                getDataOfBajajAct(premiumsummerylist, "PA", "act"),
                getDataOfBajajAct(premiumsummerylist, "S14", "od"),
                getDataOfBajajAct(premiumsummerylist, "S3", "od"),
                getDataOfBajajAct(premiumsummerylist, "S13", "od"),
                0,
                0,
                0,
                premiumdetails.ncbamt,
                getDataOfBajajAct(premiumsummerylist, "CNG", "act"),
                getDataOfBajajAct(premiumsummerylist, "LLO", "act")
              )
            )
          );
        }
      } else {
        sendErrorMessage(response);
      }
    })
    .catch((err) => console.log(err));
};

export const bajajIssueApi = (apiRequestQQ) => {
  PostDataWithToken(
    "motor/bajajIssuePolicy",
    createQuotePayloadObj(apiRequestQQ)
  )
    .then((response) => {
      if (response.status === true) {
        console.log(response.data);
        if (response.data.errorcode === 0) {
          window.location.href = `http://webservicesint.bajajallianz.com/Insurance/WS/new_cc_payment.jsp?requestId=${apiRequestQQ.PaymentId}&Username=webservice@retroinsuracne.com&sourceName=WS_MOTOR`;
        }
      } else {
        sendErrorMessage(response);
      }
    })
    .catch((err) => console.log(err));
};

export const downloadBajajPdf = (applicationId) => {
  let postData = {
    policynum: applicationId,
  };
  PostDataWithToken("motor/bajaj-pdf-download", postData).then((res) => {
    if (res.status === true) {
      console.log("response.data.fileByteObj", res.data.fileByteObj);
      downloadBase64File(res.data.fileByteObj, "PEIB_" + applicationId);
      // window.location.href = res.data.schedulePath;
    }
  });
};

//HDFC

export const HDFCCalculatePremium = (apiRequestQQ) => {
  PostDataWithToken("motor/HDFC", quickQuotePayloadObj(apiRequestQQ))
    .then((response) => {
      if (response.status === true) {
        console.log("congratulations", response.data);

        let policyData =
          apiRequestQQ.VehicleType == "4w"
            ? response.data.Resp_PvtCar
            : apiRequestQQ.VehicleType == "2w"
            ? response.data.Resp_TW
            : apiRequestQQ.VehicleType == "gcv"
            ? response.data.Resp_GCV
            : apiRequestQQ.VehicleType == "pcv" && response.data.Resp_PCV;
        const { TransactionID } = response.data;
        dispatchQuickQuote("PaymentAmount", policyData.Total_Premium);
        store.dispatch(
          quickQuoteResult(
            policyResultArr(
              "../assets/images/logos/partners/hdfc.png",
              "HDFC",
              "",
              TransactionID,
              apiRequestQQ.RegistrationNumber,
              apiRequestQQ.MakeName,
              apiRequestQQ.MakeName,
              apiRequestQQ.VariantName,
              policyData.Basic_OD_Premium,
              policyData.Basic_TP_Premium,
              policyData.PAOwnerDriver_Premium,
              policyData.Net_Premium,
              policyData.Service_Tax,
              policyData.Total_Premium,
              parseInt(policyData.IDV) - (parseInt(policyData.IDV) * 30) / 100,
              parseInt(policyData.IDV) + (parseInt(policyData.IDV) * 30) / 100,
              policyData.IDV,
              apiRequestQQ.PolicyStartDate,
              apiRequestQQ.PolicyEndDate,
              "",
              "HDFC ERGO GENERAL INSURANCE COMPANY LTD",
              apiRequestQQ.NewPolicyType,
              false,
              policyData.Vehicle_Base_ENG_Premium != 0
                ? policyData.Vehicle_Base_ENG_Premium
                : false,
              false,
              false,
              policyData.Vehicle_Base_COC_Premium != 0
                ? policyData.Vehicle_Base_COC_Premium
                : false,
              policyData.Electical_Acc_Premium != 0
                ? policyData.Electical_Acc_Premium
                : false,
              policyData.NonElectical_Acc_Premium != 0
                ? policyData.NonElectical_Acc_Premium
                : false,
              policyData.Vehicle_Base_RTI_Premium != 0
                ? policyData.Vehicle_Base_RTI_Premium
                : false,
              false,
              policyData.Vehicle_Base_NCB_Premium != 0
                ? policyData.Vehicle_Base_NCB_Premium
                : false,
              policyData.VoluntartDisc_premium != 0
                ? policyData.VoluntartDisc_premium
                : false,
              policyData.UnnamedPerson_premium != 0
                ? policyData.UnnamedPerson_premium
                : false,
              policyData.Loss_of_Use_Premium != 0
                ? policyData.Loss_of_Use_Premium
                : false,
              policyData.Vehicle_Base_ZD_Premium != 0
                ? policyData.Vehicle_Base_ZD_Premium
                : false,
              false,
              policyData.PAOwnerDriver_Premium,
              policyData.UnnamedPerson_premium,
              policyData.Electical_Acc_Premium,
              policyData.NonElectical_Acc_Premium,
              policyData.VoluntartDisc_premium,
              policyData.NCBBonusDisc_Premium,
              policyData.BiFuel_Kit_TP_Premium +
                policyData.BiFuel_Kit_OD_Premium,
              policyData.PaidDriver_Premium != 0
                ? policyData.PaidDriver_Premium
                : false
            )
          )
        );
      }
    })
    .catch((err) => console.log(err));
};

const getDataOfBajajAct = (premiumsummerylist, paramref, key) => {
  console.log("get data of bajaj", paramref, key);
  const index = premiumsummerylist.findIndex(
    (item) => item.paramref === paramref
  );
  if (index > -1) {
    console.log("----------", premiumsummerylist[index][key]);
    return premiumsummerylist[index][key];
  } else {
    return false;
  }
};

//Shriram

export const shriramGenerateProposal = (apiRequestQQ, state) => {
  PostDataWithToken("motor/shriram", quickQuotePayloadObj(apiRequestQQ))
    .then((response) => {
      if (response.status === true) {
        const { GetQuotResult } = response.data;
        const { POL_SYS_ID, CoverDtlList, VehicleIDV, PROPOSAL_NO } =
          GetQuotResult;
        // dispatchQuickQuote("PaymentAmount", policyData.Total_Premium);
        if (GetQuotResult.ERROR_CODE == 0) {
          store.dispatch(
            quickQuoteResult(
              policyResultArr(
                "../assets/images/logos/partners/shriram.png",
                "Shriram",
                PROPOSAL_NO,
                POL_SYS_ID,
                apiRequestQQ.RegistrationNumber,
                apiRequestQQ.MakeName,
                apiRequestQQ.MakeName,
                apiRequestQQ.VariantName,
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Basic Premium - 1 Year - OD"
                    : "Basic Premium - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "TP Total"
                    : "Basic Premium - TP"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "GR36B3-PA-Paid Driver, Conductor,Cleaner - 3 Year - TP"
                    : "GR36B3-PA-Paid Driver, Conductor,Cleaner - TP"
                ),
                getShriramData(CoverDtlList, "Total Premium"),
                apiRequestQQ.IsVehicleNew === true
                  ? getShriramData(CoverDtlList, "IGST(18.00%)")
                  : parseFloat(getShriramData(CoverDtlList, "CGST(0.00%)")) +
                      parseFloat(
                        getShriramData(CoverDtlList, "SGST/UTGST(0.00%)")
                      ),
                getShriramData(CoverDtlList, "Total Amount"),
                parseInt(VehicleIDV) - (parseInt(VehicleIDV) * 30) / 100,
                parseInt(VehicleIDV) + (parseInt(VehicleIDV) * 30) / 100,
                VehicleIDV,
                apiRequestQQ.PolicyStartDate,
                apiRequestQQ.PolicyEndDate,
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "De-Tariff Discount - 1 Year - OD"
                    : "De-Tariff Discount - OD"
                ),
                "SHRIRAM GENERAL INSURANCE COMPANY LTD",
                apiRequestQQ.NewPolicyType,
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Road Side Assistance - 1 Year - OD"
                    : "Road Side Assistance - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Engine Protector - 1 Year - OD"
                    : "Engine Protector Loading - OD"
                ),
                false,
                false,
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Consumable - 1 Year - OD"
                    : "Consumable - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "GR41-Cover For Electrical and Electronic Accessories - 1 Year - OD"
                    : "GR41-Cover For Electrical and Electronic Accessories - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Cover For Non Electrical Accessories - 1 Year - OD"
                    : "Cover For Non Electrical Accessories - OD"
                ),
                false,
                false,
                false,
                false,
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "GR36B2-PA Cover For Passengers (Un-Named Persons) - 1 Year - TP"
                    : "GR36B2-PA Cover For Passengers (Un-Named Persons) - TP"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Personal Belonging - 1 Year - OD"
                    : "Personal Belonging - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Nil Depreciation Loading - 1 Year - OD"
                    : "Nil Depreciation Loading - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Key Replacement - 1 Year - OD"
                    : "Key Replacement - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "GR36B3-PA-Paid Driver, Conductor,Cleaner - 3 Year - TP"
                    : "GR36B3-PA-Paid Driver, Conductor,Cleaner - TP"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "GR36B2-PA Cover For Passengers (Un-Named Persons) - 1 Year - TP"
                    : "GR36B2-PA Cover For Passengers (Un-Named Persons) - TP"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "GR41-Cover For Electrical and Electronic Accessories - 1 Year - OD"
                    : "GR41-Cover For Electrical and Electronic Accessories - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Cover For Non Electrical Accessories - 1 Year - OD"
                    : "Cover For Non Electrical Accessories - OD"
                ),
                false,
                getShriramData(CoverDtlList, "NCB Discount  - OD"),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "GR42-Outbuilt CNG/LPG-Kit-Cover - 1 Year - TP"
                    : "GR42-Outbuilt CNG/LPG-Kit-Cover - OD"
                ),
                getShriramData(
                  CoverDtlList,
                  apiRequestQQ.IsVehicleNew == true
                    ? "Legal Liability Coverages For Paid Driver - TP"
                    : "Legal Liability Coverages For Paid Driver - TP"
                )
              )
            )
          );
        }
      }
    })
    .catch((err) => console.log(err));
};

export const ShriramGeneratPolicy = async (apiRequestQQ) => {
  try {
    let response = await PostDataWithToken(
      "motor/shriram-create-quote",
      createQuotePayloadObj(apiRequestQQ)
    );
    return response;
  } catch (err) {
    console.log(err);
    alert("something went wrong");
  }
};
const getShriramData = (CoverDtlList, CoverDesc) => {
  const index = CoverDtlList.findIndex((item) => item.CoverDesc === CoverDesc);
  if (index > -1) {
    return CoverDtlList[index].Premium;
  } else {
    return false;
  }
};

export function downloadBase64File(fileName, contentBase64) {
  const linkSource = `data:application/pdf;base64,${contentBase64}`;
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  downloadLink.href = linkSource;
  downloadLink.target = "_self";
  downloadLink.download = fileName;
  downloadLink.click();
}

//Kotak------------------------------------------------

export const KotakAPICall = async (apiRequestQQ) => {
  const response = await PostDataWithToken(
    "motor/kotak",
    quickQuotePayloadObj(apiRequestQQ)
  );
  if (response.status === true) {
    if (response.data.vErrorMsg === "Success") {
      const data = response.data;
      dispatchQuickQuote("KGIStatus", true);
      store.dispatch(
        quickQuoteResult(
          policyResultArr(
            "../assets/images/logos/partners/kotak.png",
            "Kotak",
            data.vWorkFlowID,
            data.vQuoteId,
            apiRequestQQ.RegistrationNumber,
            data.vMake,
            data.vModel,
            data.vVariant,
            data.vOwnDamagePremium,
            data.vBasicTPPremium,
            data.vPACoverForOwnDriver !== "-"
              ? data.vPACoverForOwnDriver
              : false,
            data.vNetPremium,
            data.vGSTAmount,
            data.vTotalPremium,
            parseInt(data.vFinalIDV) - (parseInt(data.vFinalIDV) * 30) / 100,
            parseInt(data.vFinalIDV) + (parseInt(data.vFinalIDV) * 30) / 100,
            data.vFinalIDV,
            moment(data.vPolicyStartDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
            moment(data.vPolicyEndDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
            "",
            "KOTAK MAHINDRA GENERAL INSURANCE COMPANY LTD.",
            apiRequestQQ.NewPolicyType,
            data.vRSA != "0" ? data.vRSA : false,
            data.vEngineProtect != "0" ? data.vEngineProtect : false,
            data.nTyreCoverPremium != "0" ? data.nTyreCoverPremium : false,
            false,
            data.vConsumableCover != "0" ? data.vConsumableCover : false,
            data.vElectronicSI != "0" ? data.vElectronicSI : false,
            data.vNonElectronicSI != "0" ? data.vNonElectronicSI : false,
            data.vReturnToInvoice != "0" ? data.vReturnToInvoice : false,
            false,
            data.nNCBProtectPremium != "0" ? data.nNCBProtectPremium : false,
            data.vVoluntaryDeduction != "0" ? data.vVoluntaryDeduction : false,
            data.vPAForUnnamedPassengerPremium != "0"
              ? data.vPAForUnnamedPassengerPremium
              : false,
            data.nLossPersonalBelongingsPremium != "0"
              ? data.nLossPersonalBelongingsPremium
              : false,
            data.vDepreciationCover != "0" ? data.vDepreciationCover : false,
            data.nKeyReplacementPremium != 0
              ? data.nKeyReplacementPremium
              : false,
            data.vPACoverForOwnDriver !== "-"
              ? data.vPACoverForOwnDriver
              : false,
            data.vPAForUnnamedPassengerPremium != "0"
              ? data.vPAForUnnamedPassengerPremium
              : false,
            data.vElectronicSI != "0" ? data.vElectronicSI : 0,
            data.vNonElectronicSI != "0" ? data.vNonElectronicSI : 0,
            data.vVoluntaryDeduction != "0" ? data.vVoluntaryDeduction : 0,
            data.vNCB,
            parseFloat(data.vCngLpgKitPremium) +
              parseFloat(data.vCngLpgKitPremiumTP),
            data.vLegalLiabilityPaidDriverNo
          )
        )
      );
    } else {
      dispatchQuickQuote("KGIStatus", false);
    }
  } else {
    sendErrorMessage(response);
  }
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(response.data);
    }, 1800)
  );
};

export const kotakIssueApi = async (apiRequestQQ) => {
  try {
    const response = await PostDataWithToken(
      "motor/saveKotakProposal",
      createQuotePayloadObj(apiRequestQQ)
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
// Reliance ki API
export const RelianceAPICall = (apiRequestQQ) => {
  PostDataWithToken("motor/reliance", quickQuotePayloadObj(apiRequestQQ))
    .then((response) => {
      if (response.status === true) {
        if (response.data.MotorPolicy.status == "1") {
          const data = response.data.MotorPolicy;
          store.dispatch(
            quickQuoteResult(
              policyResultArr(
                "../assets/images/logos/partners/relience.png",
                "Reliance",
                data.QuoteNo,
                data.EndorsementNo,
                apiRequestQQ.RegistrationNumber,
                apiRequestQQ.MakeName,
                apiRequestQQ.ModelName,
                apiRequestQQ.VariantName,
                data.TotalOD,
                data.TotalLiabilityPremium,
                getRelianceValues(
                  data.lstPricingResponse,
                  "PA to Owner Driver"
                ),
                data.NetPremium,
                getRelianceTotalTax(data.LstTaxComponentDetails.TaxComponent),
                data.FinalPremium,
                parseInt(data.IDV) - (parseInt(data.IDV) * 10) / 100,
                parseInt(data.IDV) + (parseInt(data.IDV) * 10) / 100,
                data.IDV,
                apiRequestQQ.PolicyStartDate,
                apiRequestQQ.PolicyEndDate,
                false,
                "Reliance General Insurance Co Ltd",
                apiRequestQQ.NewPolicyType,
                false,
                false,
                false,
                false,
                false,
                getRelianceValues(
                  data.lstPricingResponse,
                  "Electrical Accessories"
                ),
                getRelianceValues(
                  data.lstPricingResponse,
                  "Non Electrical Accessories"
                ),
                false,
                false,
                false,
                getRelianceValues(
                  data.lstPricingResponse,
                  "Voluntary Deductible"
                ),
                getRelianceValues(
                  data.lstPricingResponse,
                  "PA to Unnamed Passenger"
                ),
                false,
                getRelianceValues(data.lstPricingResponse, "Nil Depreciation"),
                false,
                getRelianceValues(
                  data.lstPricingResponse,
                  "PA to Owner Driver"
                ),
                getRelianceValues(
                  data.lstPricingResponse,
                  "PA to Unnamed Passenger"
                ),
                getRelianceValues(
                  data.lstPricingResponse,
                  "Electrical Accessories"
                ),
                getRelianceValues(
                  data.lstPricingResponse,
                  "Non Electrical Accessories"
                ),
                getRelianceValues(
                  data.lstPricingResponse,
                  "Voluntary Deductible"
                ),
                getRelianceValues(data.lstPricingResponse, "NCB"),
                apiRequestQQ.NewPolicyType == "ThirdParty"
                  ? parseFloat(
                      getRelianceValues(
                        data.lstPricingResponse,
                        "Bifuel Kit TP"
                      )
                    )
                  : apiRequestQQ.NewPolicyType == "ODOnly"
                  ? parseFloat(
                      getRelianceValues(data.lstPricingResponse, "Bifuel Kit")
                    )
                  : parseFloat(
                      getRelianceValues(
                        data.lstPricingResponse,
                        "Bifuel Kit TP"
                      )
                    ) +
                    parseFloat(
                      getRelianceValues(data.lstPricingResponse, "Bifuel Kit")
                    ),
                getRelianceValues(
                  data.lstPricingResponse,
                  "Liability to Paid Driver"
                )
              )
            )
          );
        }
      } else {
        sendErrorMessage(response);
      }
    })
    .catch((err) => console.log(err));
};

export const relianceGenerateProposal = (apiRequestQQ) => {
  PostDataWithToken(
    "motor/relianceGenerateProposal",
    createQuotePayloadObj(apiRequestQQ)
  )
    .then((response) => {
      if (response.status === true) {
        if (response.data.MotorPolicy.status == "1") {
          const data = response.data.MotorPolicy;
          let paymentUrl = `https://rzonews.reliancegeneral.co.in/PaymentIntegration/PaymentIntegration?ProposalNo=${data.ProposalNo}&userID=100002&ProposalAmount=${data.FinalPremium}&PaymentType=1&Responseurl=${process.env.REACT_APP_SUCCESS_URL}&CKYC=${apiRequestQQ.KYC.Reliance}&IsDocumentUpload=False&PanNo=${apiRequestQQ.PanNumber}&IsForm60=false`;
          console.log("payment url------->", paymentUrl);
          // alert(paymentUrl);
          window.location.href = paymentUrl;
          // alert(paymentUrl);
        }
      } else {
        sendErrorMessage(response);
      }
    })
    .catch((err) => console.log(err));
};

const getRelianceValues = (arr, CoverageName) => {
  if (Array.isArray(arr)) {
    let index = arr.findIndex((item) => item.CoverageName === CoverageName);
    if (index > -1) {
      if (CoverageName === "OD Discount") {
        let index2 = arr.findIndex(
          (item) => item.CoverageName === "Automobile Association Membership"
        );
        if (index > -1) {
          return arr[index].Premium;
        } else {
          return arr[index].Premium;
        }
      } else {
        return arr[index].Premium;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const getRelianceTotalTax = (TaxComponent) => {
  let totalTax = 0;
  let i = 0;
  while (i < TaxComponent.length) {
    totalTax = totalTax + parseFloat(TaxComponent[i].Amount);
    i++;
  }
  return totalTax;
};

// Future General api---------------------------------------

export const FutureGeneralQuickQuote = (apiRequestQQ) => {
  PostDataWithToken("motor/futuregeneral", quickQuotePayloadObj(apiRequestQQ))
    .then((response) => {
      if (response.status === true) {
        if (response.data.Root.Policy.Status === "Successful") {
          const data = response.data.Root.Policy;
          const table = response.data.Root.Policy.NewDataSet.Table1;
          store.dispatch(
            quickQuoteResult(
              policyResultArr(
                "../assets/images/logos/partners/fg.png",
                "Future",
                data.NewDataSet.Table.PolNo,
                data.ProductUINNo,
                apiRequestQQ.RegistrationNumber,
                apiRequestQQ.MakeName,
                apiRequestQQ.ModelName,
                apiRequestQQ.VariantName,
                getFutureGenValue(table, "IDV", "OD"),
                getFutureGenValue(table, "Gross Premium", "TP"),
                getFutureGenValue(table, "CPA", "TP") > 0
                  ? getFutureGenValue(table, "CPA", "TP")
                  : false,
                getFutureGenValue(table, "PrmDue", "OP") +
                  getFutureGenValue(table, "PrmDue", "TP") -
                  getFutureGenValue(table, "ServTax", "OD") +
                  getFutureGenValue(table, "ServTax", "TP"),
                getFutureGenValue(table, "ServTax", "OD") +
                  getFutureGenValue(table, "ServTax", "TP"),
                Math.round(
                  getFutureGenValue(table, "PrmDue", "OD") +
                    getFutureGenValue(table, "PrmDue", "TP")
                ),
                apiRequestQQ.NewPolicyType != "ThirdParty"
                  ? parseInt(data.VehicleIDV) -
                      (parseInt(data.VehicleIDV) * 30) / 100
                  : 0,
                apiRequestQQ.NewPolicyType != "ThirdParty"
                  ? parseInt(data.VehicleIDV) +
                      (parseInt(data.VehicleIDV) * 30) / 100
                  : 0,
                data.VehicleIDV,
                apiRequestQQ.PolicyStartDate,
                apiRequestQQ.PolicyEndDate,
                false,
                "FUTURE GENERALI INDIA INSURANCE COMPANY LTD.",
                apiRequestQQ.NewPolicyType,
                getFutureGenValue(table, "RODSA", "OD") > 0
                  ? getFutureGenValue(table, "RODSA", "OD")
                  : false,
                getFutureGenValue(table, "ENGPR", "OD") > 0
                  ? getFutureGenValue(table, "ENGPR", "OD")
                  : false,
                getFutureGenValue(table, 1, "OD") > 0
                  ? getFutureGenValue(table, 1, "OD")
                  : false,
                false,
                getFutureGenValue(table, "CONSM", "OD") > 0
                  ? getFutureGenValue(table, "CONSM", "OD")
                  : false,
                getFutureGenValue(table, "EAV", "OD") > 0
                  ? getFutureGenValue(table, "EAV", "OD")
                  : false,
                getFutureGenValue(table, "NEA", "OD") > 0
                  ? getFutureGenValue(table, "NEA", "OD")
                  : false,
                getFutureGenValue(table, 6, "OD") > 0
                  ? getFutureGenValue(table, 6, "OD")
                  : false,
                false,
                getFutureGenValue(table, 4, "OD") > 0
                  ? getFutureGenValue(table, 4, "OD")
                  : false,
                getFutureGenValue(table, "VD", "OD") > 0
                  ? getFutureGenValue(table, "VD", "OD")
                  : false,
                getFutureGenValue(table, "APA", "TP") > 0
                  ? getFutureGenValue(table, "APA", "TP")
                  : false,
                false,
                getFutureGenValue(table, "ZODEP", "OD") > 0
                  ? getFutureGenValue(table, "ZODEP", "OD")
                  : false,
                false,
                getFutureGenValue(table, "CPA", "TP") > 0
                  ? getFutureGenValue(table, "CPA", "TP")
                  : false,
                getFutureGenValue(table, "APA", "TP") > 0
                  ? getFutureGenValue(table, "APA", "TP")
                  : false,
                getFutureGenValue(table, "EAV", "OD") > 0
                  ? getFutureGenValue(table, "EAV", "OD")
                  : false,
                getFutureGenValue(table, "NEA", "OD") > 0
                  ? getFutureGenValue(table, "NEA", "OD")
                  : false,
                getFutureGenValue(table, "VD", "OD") > 0
                  ? getFutureGenValue(table, "VD", "OD")
                  : false,
                getFutureGenValue(table, "NCB", "OD")
                  ? getFutureGenValue(table, "NCB", "OD")
                  : false,
                getFutureGenValue(table, "CNG", "TP") > 0
                  ? getFutureGenValue(table, "CNG", "TP")
                  : false,
                getFutureGenValue(table, "LLDE", "TP") > 0
                  ? getFutureGenValue(table, "LLDE", "TP")
                  : false
              )
            )
          );
        }
      } else {
        sendErrorMessage(response);
      }
    })
    .catch((err) => console.log(err));
};

const getFutureGenValue = (arr, Code, Type) => {
  let index = arr.findIndex((val) => val.Code === Code && val.Type === Type);
  if (index > -1) {
    return arr[index].BOValue;
  } else {
    return 0;
  }
};

// Royal Sundram api call
export const RoyalSundramAPICall = (apiRequestQQ) => {
  PostDataWithToken("motor/royalsundram", quickQuotePayloadObj(apiRequestQQ))
    .then((response) => {
      if (response.status === true) {
        console.log("response .data. royal . sundram", response.data);
        const { PREMIUMDETAILS } = response.data;
        const { Status, DATA } = PREMIUMDETAILS;
        if (Status.StatusCode === "S-0002") {
          // tyre
          const data = response.data;
          store.dispatch(
            quickQuoteResult(
              policyResultArr(
                "../assets/images/logos/partners/royal.jpg",
                "Royal",
                DATA.QUOTE_ID,
                DATA.QUOTE_ID,
                apiRequestQQ.RegistrationNumber,
                apiRequestQQ.MakeName,
                apiRequestQQ.ModelName,
                apiRequestQQ.VariantName,
                DATA.OD_PREMIUM.TOTAL_OD_PREMIUM,
                DATA.LIABILITY.BASIC_PREMIUM_INCLUDING_PREMIUM_FOR_TPPD,
                DATA.LIABILITY.UNDER_SECTION_III_OWNER_DRIVER !== "0.0"
                  ? DATA.LIABILITY.UNDER_SECTION_III_OWNER_DRIVER
                  : false,
                DATA.PACKAGE_PREMIUM,
                DATA.CGST + DATA.SGST,
                DATA.GROSS_PREMIUM,
                DATA.MINIMUM_IDV || 0,
                DATA.MAXIMUM_IDV || 0,
                DATA.MODEL_IDV ? DATA.MODEL_IDV : DATA?.IDV,
                apiRequestQQ.PolicyStartDate,
                apiRequestQQ.PolicyEndDate,
                DATA.CAMPAIGN_DISCOUNT,
                "Royal Sundaram General Insurance Co Ltd",
                apiRequestQQ.NewPolicyType,
                false,
                DATA.OD_PREMIUM.ENGINE_PROTECTOR != "0.0"
                  ? DATA.OD_PREMIUM.ENGINE_PROTECTOR
                  : false,
                DATA.OD_PREMIUM.TYRE_COVER != "0.0"
                  ? DATA.OD_PREMIUM.TYRE_COVER
                  : false,
                false,
                false,
                DATA.OD_PREMIUM.ELECTRICAL_ACCESSORIES != "0.0"
                  ? DATA.OD_PREMIUM.ELECTRICAL_ACCESSORIES
                  : false,
                DATA.OD_PREMIUM.NON_ELECTRICAL_ACCESSORIES != "0.0"
                  ? DATA.OD_PREMIUM.NON_ELECTRICAL_ACCESSORIES
                  : false,
                false,
                false,
                DATA.OD_PREMIUM.NCB_PROTECTOR != "0.0"
                  ? DATA.OD_PREMIUM.NCB_PROTECTOR
                  : false,
                DATA.OD_PREMIUM.VOLUNTARY_DEDUCTABLE != "0.0"
                  ? DATA.OD_PREMIUM.VOLUNTARY_DEDUCTABLE
                  : false,
                DATA.LIABILITY.UNNAMED_PASSENGRS != "0.0"
                  ? DATA.LIABILITY.UNNAMED_PASSENGRS
                  : false,
                DATA.OD_PREMIUM.LOSS_OF_BAGGAGE != "0.0"
                  ? DATA.OD_PREMIUM.LOSS_OF_BAGGAGE
                  : false,
                DATA.OD_PREMIUM.DEPRECIATION_WAIVER != "0.0"
                  ? DATA.OD_PREMIUM.DEPRECIATION_WAIVER
                  : false,
                DATA.OD_PREMIUM.KEY_REPLACEMENT != "0.0"
                  ? DATA.OD_PREMIUM.KEY_REPLACEMENT
                  : false,
                DATA.LIABILITY.UNDER_SECTION_III_OWNER_DRIVER !== "0.0"
                  ? DATA.LIABILITY.UNDER_SECTION_III_OWNER_DRIVER
                  : false,
                DATA.LIABILITY.UNNAMED_PASSENGRS != "0.0"
                  ? DATA.LIABILITY.UNNAMED_PASSENGRS
                  : false,
                DATA.OD_PREMIUM.ELECTRICAL_ACCESSORIES != "0.0"
                  ? DATA.OD_PREMIUM.ELECTRICAL_ACCESSORIES
                  : false,
                DATA.OD_PREMIUM.NON_ELECTRICAL_ACCESSORIES != "0.0"
                  ? DATA.OD_PREMIUM.NON_ELECTRICAL_ACCESSORIES
                  : false,
                DATA.OD_PREMIUM.VOLUNTARY_DEDUCTABLE != "0.0"
                  ? DATA.OD_PREMIUM.VOLUNTARY_DEDUCTABLE
                  : 0,
                DATA.NO_CLAIM_BONUS,
                DATA.LIABILITY.BI_FUEL_KIT_CNG,
                DATA.LIABILITY.TO_PAID_DRIVERS
              )
            )
          );
        }
      } else {
        sendErrorMessage(response);
      }
    })
    .catch((err) => console.log(err));
};

export const RoyalSundramGenerateProposal = async (apiRequestQQ) => {
  try {
    const response = await PostDataWithToken(
      "motor/royalSundramProposal",
      createQuotePayloadObj(apiRequestQQ)
    );
    return response;
  } catch (err) {
    console.log("err---", err);
  }
};
