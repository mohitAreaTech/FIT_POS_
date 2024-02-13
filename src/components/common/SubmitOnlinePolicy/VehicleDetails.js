import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import { useForm } from "react-hook-form";
import { dispatchQuickQuote, selectedPlanAction } from "../../../store/actions/userAction";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  kotakIssueApi,
  savePolicyToDatabase,
  shriramGenerateProposal,
  ShriramGeneratPolicy,
} from "../../utility/TPApiCall";
import moment from "moment";
import ShriramKYCForm from "./PaymentPages/ShriramKYCForm";
import { GetDataWithToken } from "../../../api/apiHelper";
import { sendErrorInfo } from "../../services/userServices";


const VehicleDetails = ({ rtoData, activeTab, toggle, insurerData, financierData, cityData }) => {
  const type = useSelector((state) => state?.root?.userDetails.type);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });
  const [RegistrationNumber, setRegistrationNumner] = useState("");
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const [disabled, setDisabled] = useState("");
  const selectedPlan = useSelector((state) => state.root.selectedPlan);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Hpn, setHpn] = useState(false);
  const [isValidPUC, setIsValidPUC] = useState(false);
  const [rtoCode, setRtoCode] = useState("");
  const [relianceRto, setRelianceRto] = useState([]);
  const [selectedRelianceRTO, setSelRelianceRTO] = useState("");
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  useEffect(() => {
    setDisabled("");

    reset({
      RegistrationNumber: apiRequestQQ.RegistrationNumber,
      PrePolicyNumber: apiRequestQQ.PrePolicyNumber,
      PrePolicyEndDate: apiRequestQQ.PrePolicyEndDate,
      PreviousInsuranceClaimed: apiRequestQQ.PreviousInsuranceClaimed,
      PreInsurerCode: apiRequestQQ.PreInsurerCode,
      PreviousInsurancePolicyNumber: apiRequestQQ.PreviousInsurancePolicyNumber,
    });
    setRegistrationNumner(apiRequestQQ.RegistrationNumber);
    let rtoNumber = apiRequestQQ.RegistrationNumber.split("-");
    if (apiRequestQQ.IsVehicleNew) {
      setRtoCode(apiRequestQQ.RtoCode);
    } else {
      setRtoCode(rtoNumber[0] + rtoNumber[1]);
    }
    let RTOCode = apiRequestQQ.RtoCode ? apiRequestQQ.RtoCode : rtoNumber[0] + rtoNumber[1];
    GetDataWithToken("motor/getRelianceRto", "").then((response) => {
      if (response.status === true) {
        let i = 0;
        let arr = [];
        while (i < response.data.length) {
          let item = response.data[i];
          if (item.Region_Code == RTOCode.slice(0, 2) + "-" + RTOCode.slice(2, 4)) {
            arr.push({
              value: item.Model_Region_ID_PK,
              label: item.Region_Code + " " + item.Region_Name,
            });
          }
          i++;
        }
        setRelianceRto(arr);
      }
    });
  }, []);
  useEffect(() => {
    if (activeTab == 3 && selectedPlan.Api_name === "Shriram") {
      const { FatherName, MotherName, AadharNo, PassportPic, AadharBackPic } = apiRequestQQ.KYC;

      if (FatherName == "" || MotherName == "" || AadharNo == "" || PassportPic == "" || AadharBackPic == "") {
        setDisabled("");
        setModal(true);
      }
    }
  }, [activeTab]);
  useEffect(() => {
    if (selectedPlan.Api_name == "Reliance" && relianceRto.length > 0) {
      setSelRelianceRTO(relianceRto[0].value);
      dispatchQuickQuote("RelianceRTOCode", relianceRto[0].value);
    }
  }, [relianceRto]);
  const selectRtoCity = (val) => {
    dispatchQuickQuote("RtoCode", val.value);
  };
  const submitVehicleDetails = (data) => {
    if (selectedPlan.Api_name == "Reliance" && isValidPUC == false) {
      return sendErrorInfo("Please select valid PUC");
    }
    dispatchQuickQuote("RegistrationNumber", RegistrationNumber);
    for (let key in data) {
      dispatchQuickQuote(key, data[key]);
    }
    const newData = { ...apiRequestQQ, ...data };
    let policyData = { ...newData, ...selectedPlan };

    savePolicyToDatabase(policyData);
    setDisabled("disabled");
    if (selectedPlan.Api_name === "Shriram") {
      const { FatherName, MotherName, AadharNo, PassportPic, AadharBackPic } = apiRequestQQ.KYC;

      if (FatherName == "" || MotherName == "" || AadharNo == "" || PassportPic == "" || AadharBackPic == "") {
        setDisabled("");
        setModal(true);
      } else {
        setDisabled("disabled");
        generateShriramPolicy(newData);
      }
    } else if (selectedPlan.Api_name === "Kotak") {
      // alert("kotak clicked");

      kotakIssueApi(newData)
        .then((response) => {
          console.log("response", response);
          if (response.status === true) {
            if (response.data.Fn_Save_Partner_Private_Car_ProposalResult.vErrorMessage === "Success") {
              // alert("kotak success");
              let data = { ...selectedPlan };
              data.vProposalNumber = response.data.Fn_Save_Partner_Private_Car_ProposalResult.vProposalNumber;
              data.vProductCode = response.data.Fn_Save_Partner_Private_Car_ProposalResult.vProductCode;
              data.vPolicyNumber = response.data.Fn_Save_Partner_Private_Car_ProposalResult.vPolicyNumber;
              dispatch(selectedPlanAction(data));
              navigate('/policyOverview');
            } else {
              alert("Something went wrong, Try Again");
              // navigate("/");
              setDisabled("");
            }
          } else {
            setDisabled("");
          }
        })
        .catch((err) => {
          console.log(err);
          setDisabled("");
        });
    } else if (selectedPlan.Api_name === "Royal") {
      RoyalSundramGenerateProposal(newData)
        .then((response) => {
          if (response.status === true) {
            const { PREMIUMDETAILS, proposalResult } = response.data;
            const { Status, DATA } = PREMIUMDETAILS;
            if (Status.StatusCode === "S-0005") {
              console.log(PREMIUMDETAILS);
              setDisabled("");
              navigate('/policyOverview');
            } else {
              setDisabled("");
              alert(Status.Message);
            }
          } else {
            setDisabled("");
          }
        })
        .catch((err) => {
          console.log(err);
          setDisabled("");
        });
    } else {
      navigate('/policyOverview');
    }
  };

  const generateShriramPolicy = (newData) => {
    ShriramGeneratPolicys(newData).then((response) => {
      if (response.status === true) {
        setDisabled("");
        const { GenerateProposalResult } = response.data;
        if (GenerateProposalResult && GenerateProposalResult.ERROR_CODE == "0") {
          dispatchQuickQuote("ApiId", GenerateProposalResult.POL_SYS_ID);
          dispatchQuickQuote("policyId", GenerateProposalResult.PROPOSAL_NO);
          navigate('/policyOverview');
        } else {
          alert(response.data.MessageResult.ErrorMessage);
        }
      } else {
        setDisabled("");
      }
    });
  };
  const setRegistrationValue = (val) => {
    let number = "";
    let stateCode = val.substring(3, 5);
    let rtoCode = val.substring(6, 8);
    let plateNumber = val.substring(9, 13);
    if (val.length <= 2) {
      if (val.match(/^[A-Za-z]+$/)) {
        number = val;
        if (val.length === 2) {
          number = number + "-";
        }
      } else {
        number = "";
      }
    } else if (val.length > 3 && val.length <= 5) {
      if (stateCode.match(/^[0-9]+$/)) {
        if (val.length > 3 && val.length < 5) {
          number = RegistrationNumber + stateCode;
        }
        if (val.length === 5) {
          number = RegistrationNumber + val.charAt(4) + "-";
        }
      } else {
        stateCode = "";
        number = RegistrationNumber + stateCode;
      }
    }
    if (val.length > 6 && val.length <= 8) {
      console.log("rto code", rtoCode);
      if (rtoCode.match(/^[A-Za-z]+$/)) {
        number = val;
        if (val.length === 8) {
          number = number + "-";
        }
      } else {
        number = "";
      }
    } else if (val.length > 9 && val.length <= 14) {
      if (plateNumber.match(/^[0-9]+$/)) {
        number = val;
      }
    }
    setRegistrationNumner(number);
  };

  const changeHpnState = (e) => {
    const { checked, value } = e.target;
    dispatchQuickQuote("IsHypothecation", checked);
    setHpn(checked);
  };

  const changePUCState = (e) => {
    const { checked, value } = e.target;
    dispatchQuickQuote("IsValidPuc", checked);
    setIsValidPUC(checked);
  };
  const handleSetHpnBank = (val) => {
    // console.log("hpn-----------", val);
    dispatchQuickQuote("HpnBank", val.value);
    dispatchQuickQuote("HpnHDFCID", val.HDFCId);
  };

  const handleSetHpnCity = (val) => {
    // console.log("hpn city", val);
    dispatchQuickQuote("HpnCity", val.City);
  };
  const handleSelectPincode = (val) => {
    console.log("value", val);
    dispatchQuickQuote("RelianceRTOCode", val.value);
    setSelRelianceRTO(val.value);
  };
  return (
    <div className="card p-4 mt-3">
      <form onSubmit={handleSubmit(submitVehicleDetails)}>
        <p className="mb-0 fs-2 fw-bold">Vehicle Details</p>
        <div className="othervoption mt-3">
          <div className="row mx-0 px-0">
            {apiRequestQQ.IsVehicleNew === false && (
              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="text"
                      {...register("RegistrationNumber")}
                      value={RegistrationNumber}
                      onChange={(e) => setRegistrationValue(e.target.value)}
                      className="form-control"
                      id="fsa12"
                      placeholder=" Enter Registration Number"
                      disabled={true}
                    />
                    <label htmlFor="fsa12">
                      Enter Registration Number
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            {selectedPlan.Api_name != "Reliance" && rtoCode != "" && (
              <div className="col-lg-4">
                <div className="position-relative mb-3">
                  <div className="form-floating pincode">
                    <ReactSelect
                      options={rtoData}
                      placeholder="Select RTO Location"
                      onChange={(val) => selectRtoCity(val)}
                      value={rtoData.filter((option) => option.value === rtoCode)}
                    />
                  </div>
                </div>
              </div>
            )}
            {selectedPlan.Api_name == "Reliance" && (
              <div className="col-lg-4 ">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <ReactSelect
                      options={relianceRto}
                      onChange={(val) => handleSelectPincode(val)}
                      placeholder="Select RTO Location"
                      value={relianceRto.filter((option) => option.value === selectedRelianceRTO)}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="col-lg-4 pe-lg-0">
              <div className="position-relative mb-3">
                <div className="form-floating ">
                  <input
                    type="text"
                    {...register("EngineNumber", {
                      required: "Engine Number is required",
                      pattern: {
                        value: /^[a-z0-9]+$/i,
                        message: "Invalid value",
                      },
                      minLength: {
                        value: apiRequestQQ.IsVehicleNew === true ? 17 : 5,
                        message: apiRequestQQ.IsVehicleNew === true
                        ? "Value must be 17 number"
                        : "Value must be minumum 5 number",
                      },
                    })}
                    className="form-control"
                    style={{textTransform:'uppercase'}}
                    id="fsa112"
                    placeholder="Enter Engine No."
                    maxLength="17"
                  />
                  <label htmlFor="fsa112">
                    Engine No
                    <span className="text-danger">*</span>
                  </label>

                  <p className="f-error">{errors?.EngineNumber?.message}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 ps-lg-0">
              <div className="position-relative mb-3">
                <div className="form-floating ">
                  <input
                    type="text"
                    {...register("ChassisNumber", {
                      required: "Chassis Number is required",
                      pattern: {
                        value: /^[a-z0-9]+$/i,
                        message: "Invalid value",
                      },
                      minLength: {
                        value: apiRequestQQ.IsVehicleNew === true ? 17 : 5,
                        message:
                          apiRequestQQ.IsVehicleNew === true
                            ? "Value must be 17 number"
                            : "Value must be minumum 5 number",
                      },
                    })}
                    className="form-control"
                    id="fsa112"
                    placeholder="Enter Chassis No."
                    maxLength="17"
                  />
                  <label htmlFor="fsa112">
                    Chassis No.
                    <span className="text-danger">*</span>
                  </label>

                  <p className="f-error">{errors?.ChassisNumber?.message}</p>
                </div>
              </div>
            </div>
            {apiRequestQQ.IsVehicleNew === false && (
              <>
                <div className="col-lg-4">
                  <div className="position-relative mb-3">
                    <div className="form-floating ">
                      <input
                        type="text"
                        {...register("PrePolicyNumber")}
                        className="form-control"
                        id="fsaIO"
                        placeholder="Enter Previous Year Policy Number"
                      />
                      <label htmlFor="fsaIO">
                        Previous Policy Number
                        <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            {apiRequestQQ.NewPolicyType === "ODOnly" && selectedPlan.Api_name != "Kotak" && (
              <>
                <div className="col-lg-4">
                  <div className="position-relative mb-3">
                    <div className="form-floating ">
                      <input
                        type="text"
                        {...register("PreTPPolicyNumber")}
                        className="form-control"
                        id="fsaIO"
                        placeholder="Enter Previous Year Policy Number"
                      />
                      <label htmlFor="fsaIO">
                        Previous TP Policy Number
                        <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 pe-lg-0">
                  <div className="position-relative mb-3">
                    <div className={"form-floating position-relative mb-4"}>
                      <select
                        name={"PreInsurerCode"}
                        className="form-select"
                        id={"s12lio"}
                        {...register("PreTPInsurerCode")}
                      >
                        <option value="">Select</option>
                        {insurerData.map((item, index) => (
                          <option key={index} value={item.value}>
                            {item.option}
                          </option>
                        ))}
                      </select>

                      {/*----- Input Label -----*/}
                      <label htmlFor={"s12lio"} className="d-block w-100">
                        Previous TP Policy Provider
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 ">
                  <div className="position-relative mb-3">
                    <div className="form-floating ">
                      <input
                        type="date"
                        {...register("PreTPPolicyEndDate")}
                        className="form-control"
                        id="fsaIO"
                        placeholder="Enter Previous Year Policy Number"
                        min={apiRequestQQ.RegistrationDate}
                        max={moment(apiRequestQQ.RegistrationDate, "YYYY-MM-DD").add(5, "year").format("YYYY-MM-DD")}
                      />
                      <label htmlFor="fsaIO">
                        Previous TP End Date
                        <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="row">
              <div className="col-5 hypothentication">
                <div className="form-group form-check d-block position-relative  mt-3 mb-4 text-start hypothentication">
                  <input
                    type="checkbox"
                    className="form-check-input d-none hypothentication"
                    id="hpn"
                    onChange={(e) => changeHpnState(e)}
                  />
                  <label className="form-check-label ps-4 checkboxlabel mt-0 fs-5 hypothentication" htmlFor="hpn">
                    Hypothecation?
                  </label>
                </div>
              </div>
              <div className="col-5 hypothentication">
                <div className="form-group form-check d-block position-relative  mt-3 mb-4 text-start hypothentication">
                  <input
                    type="checkbox"
                    className="form-check-input d-none hypothentication"
                    id="PUCVALID"
                    onChange={(e) => changePUCState(e)}
                  />
                  <label className="form-check-label ps-4 checkboxlabel mt-0 fs-5 hypothentication" htmlFor="PUCVALID">
                    Is Valid PUC Available?
                  </label>
                </div>
              </div>
            </div>
            {Hpn === true && (
              <>
                <div className="col-lg-4 ">
                  <div className="position-relative mb-3">
                    <div className="form-floating ">
                      <ReactSelect
                        options={financierData}
                        onChange={(val) => handleSetHpnBank(val)}
                        placeholder="Select finance bank"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 ">
                  <div className="position-relative mb-3">
                    <div className="form-floating ">
                      <ReactSelect
                        options={cityData}
                        onChange={(val) => handleSetHpnCity(val)}
                        placeholder="Select finance city"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {isValidPUC === true && (
              <>
                <div className="col-lg-4">
                  <div className="position-relative mb-3">
                    <div className="form-floating ">
                      <input
                        type="text"
                        {...register("PUCNumber", {
                          required: "Field is required",
                        })}
                        className="form-control"
                        id="fsaIO"
                        placeholder="Enter PUC Number"
                      />
                      <label htmlFor="fsaIO">
                        PUC Number
                        <span className="text-danger">*</span>
                      </label>
                      <p className="f-error">{errors?.PUCNumber?.message}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="position-relative mb-3">
                    <div className="form-floating ">
                      <input
                        type="date"
                        {...register("PUCValidUpto", {
                          required: "Field is required",
                        })}
                        className="form-control"
                        id="fsaIO"
                        min={moment().format("YYYY-MM-DD")}
                      />
                      <label htmlFor="fsaIO">
                        Puc Valid Upto
                        <span className="text-danger">*</span>
                      </label>
                      <p className="f-error">{errors?.PUCValidUpto?.message}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="col-12" />
            <div className="col-lg-2 col-sm-6 mx-lg-0 mx-auto col-12 px-lg-0">
              <button type="submit" disabled={disabled} className="btn nextBtn btn-primary mb-5 mt-3 py-6 w-100 fs-4 fw-bold">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
      <ShriramKYCForm modal={modal} setModal={(val) => setModal(val)} toggleModal={toggleModal} />
    </div>
  );
};

export default VehicleDetails;
