import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { dispatchQuickQuote } from "../../../store/actions/userAction";
import { getStates, getVehiclePincode } from "../../services/masterService";
import { createCustomer } from "../../utility/TPApiCall";
import ReactSelect from "../Tags/ReactSelect";
import { MultiSelect } from "react-multi-select-component";
import FutureGeneralKYCRedirect from "../../common/SubmitOnlinePolicy/PaymentPages/FutureGeneralKYCRedirect";
import moment from "moment";
import { PostDataWithToken } from "../../../api/apiHelper";
import { sendSuccessInfo } from "../../services/userServices";
const OwnerDetails = ({ state, activeTab, toggle, pincodeData }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });
  // const [pincodeData, setPincodeData] = React.useState([]);
  const type = useSelector((state) => state?.root?.userDetails.type);
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const selectedPlan = useSelector((state) => state.root.selectedPlan);
  const [futureKYC, setFutureKyc] = useState(false);
  const [futureKYCData, setFutureKYCData] = useState({});
  const [stateName, setState] = useState("");
  const [disabled, setDisabled] = useState("");
  const [pan, setPan] = useState({
    number: "",
    image: "",
    error: "",
  });
  const [stateData, setStateData] = useState([]);
  useEffect(() => {
    reset({
      Email: apiRequestQQ.Email,
      FirstName: apiRequestQQ.FirstName,
      LastName: apiRequestQQ.LastName,
      MobileNumber: apiRequestQQ.MobileNumber,
      PanNumber: apiRequestQQ.PanNumber,
      ...(apiRequestQQ.Dob && { Dob: apiRequestQQ.Dob }),
      ...(apiRequestQQ.Gender && { Gender: apiRequestQQ.Gender }),
      ...(apiRequestQQ.Street && { Street: apiRequestQQ.Street }),
      ...(apiRequestQQ.StreetNumber && {
        StreetNumber: apiRequestQQ.StreetNumber,
      }),
      ...(apiRequestQQ.Area && { Area: apiRequestQQ.Area }),
      ...(apiRequestQQ.State && { State: apiRequestQQ.State }),
      ...(apiRequestQQ.District && { District: apiRequestQQ.District }),
    });
    if (apiRequestQQ.PanImage != "") {
      setPan({
        image: "data:image/jpeg;base64," + apiRequestQQ.PanImage,
        number: apiRequestQQ.PanNumber,
      });
    }
    if (selectedPlan.Api_name === "HDFC") {
      checkHDFCKYCStatus(apiRequestQQ.MobileNumber, false);
    }
  }, []);
  const handleSelectState = (val) => {
    // setState(val.label)
    dispatchQuickQuote("State", val);
    let index = stateData.findIndex((item) => item.STATEDESC == val);
    if (index > -1) {
      dispatchQuickQuote("StateCode", stateData[index].Digit_Code);
    }
  };

  const handleSelectPincode = (val) => {
    reset({ City: val.City });
    dispatchQuickQuote("Pincode", val.value);

    dispatchQuickQuote("District", val.District);
    dispatchQuickQuote("City", val.City);
    getStates(val.value)
      .then((response) => {
        if (response.status === true) {
          let stats = response.data[0];
          setStateData(response.data[0]);
          reset({ State: stats.STATEDESC });
          dispatchQuickQuote("State", stats.STATEDESC);
          dispatchQuickQuote("StateCode", stats.Digit_Code);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSaveUser = (data) => {
    if (apiRequestQQ.PanImage == "") {
      return setPan({ ...pan, error: "Pan Image is required" });
    }
    for (let key in data) {
      if (key != "KycNumber") {
        dispatchQuickQuote(key, data[key]);
      } else if (key == "KycNumber") {
        dispatchQuickQuote("KYC." + "Shriram", data[key] || "");
      }
    }
    let postData = {
      name: data.FirstName + " " + data.LastName,
      email: data.Email,
      phone: data.MobileNumber,
      dob: data.Dob,
      city: data.City,
      state: stateName,
      address: data.StreetNumber + " " + data.Street + " " + data.Area,
      customerId: apiRequestQQ.customerId,
    };

    createCustomer(postData);
    if (selectedPlan.Api_name === "HDFC") {
      checkHDFCKYCStatus(data.MobileNumber, true);
    } else if (selectedPlan.Api_name === "bajaj") {
      checkBajajKYCStatus(
        data.PanNumber ? data.PanNumber : apiRequestQQ.PanNumber,
        data.Dob,
        data.Gender
      );
    } else if (selectedPlan.Api_name == "Future") {
      FutureGeneralUserKyc(
        data.PanNumber ? data.PanNumber : apiRequestQQ.PanNumber,
        data.Dob,
        postData.name,
        data.Gender
      );
    } else if (selectedPlan.Api_name == "Reliance") {
      checkRelianceKYCDetails(
        data.PanNumber ? data.PanNumber : apiRequestQQ.PanNumber,
        data.Dob
      );
    } else if (selectedPlan.Api_name == "Kotak") {
      checkKotakKycDetails(
        data.PanNumber ? data.PanNumber : apiRequestQQ.PanNumber,
        data
      );
    } else if (selectedPlan.Api_name == "Royal") {
      royalSundramKYCDetails(
        data.FirstName,
        data.LastName,
        data.PanNumber ? data.PanNumber : apiRequestQQ.PanNumber,
        data.Dob
      );
    } else {
      setTimeout(() => {
        apiRequestQQ.CustomerType == "INDIVIDUAL"
          ? toggle(activeTab + 1)
          : toggle(activeTab + 2);
      }, 1000);
    }
    // setTimeout(() => {
    //   toggle(activeTab + 1);
    // }, 400);
  };

  const checkHDFCKYCStatus = (mobileNumber, redirect) => {
    PostDataWithToken("kyc/hdfc-kyc", { MobileNumber: mobileNumber }).then(
      (response) => {
        if (response.status === true) {
          console.log("hdfc kyc response", response.data.kyc_id);
          if (response.data.iskycVerified == 1) {
            dispatchQuickQuote("KYC." + "HDFC", response.data.kyc_id);
            if (redirect === true) {
              setTimeout(() => {
                toggle(activeTab + 1);
              }, 500);
            }
          } else {
            alert("You have to complete your HDFC E-kyc first");
            window.open(response.data.redirect_link, "_blank");
          }
        }
      }
    );
  };
  const checkBajajKYCStatus = (pannumber, dob, gender) => {
    let postData = {
      docNumber: pannumber,
      fieldValue: selectedPlan.ApiId,
      dob: dob,
      gender: gender == "Male" ? "M" : "F",
      customerType: apiRequestQQ.CustomerType === "INDIVIDUAL" ? "I" : "C",
      vehicleType: apiRequestQQ.VehicleType,
      IsVehicleNew: apiRequestQQ.IsVehicleNew,
      policyType: apiRequestQQ.NewPolicyType,
    };
    PostDataWithToken("kyc/bajaj-kyc", postData).then((response) => {
      if (response.status === true) {
        const { ckycNumber, ckycStatus, errCode } = response.data;
        console.log("cyck", ckycNumber && errCode == "0");
        if (ckycNumber == null && ckycStatus == "NA") {
          let panImage = apiRequestQQ.PanImage;
          let kycData = {
            fieldValue: selectedPlan.ApiId,
            PanNumber: pannumber,
            PanImage: panImage,
          };
          PostDataWithToken("kyc/bajaj-kyc-document", kycData).then(
            (result) => {
              if (result.data.errorCode == "0") {
                toggle(activeTab + 1);
              } else {
                alert("Please recheck your information and try again");
              }
            }
          );
        } else if (ckycNumber && errCode == "0") {
          toggle(activeTab + 1);
        } else {
          alert("Please recheck your information and try again");
        }
      }
    });
  };

  const handleUploadPanFile = async (file) => {
    const base64Img = await toBase64(file[0]);
    setPan({ ...pan, image: base64Img, error: "" });
    dispatchQuickQuote("PanImage", base64Img.split(",")[1]);
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      console.log("file", file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChangePanValue = (value) => {
    setPan({ ...pan, number: value, error: "" });
  };

  const FutureGeneralUserKyc = (pannumber, dob, full_name, gender) => {
    setDisabled("disabled");
    let postData = {
      customer_type: apiRequestQQ.CustomerType === "INDIVIDUAL" ? "I" : "C",
      PanNumber: pannumber,
      dob: dob,
      full_name: full_name,
      gender: gender == "Male" ? "M" : "F",
    };
    PostDataWithToken("kyc/future-general-kyc", postData).then((response) => {
      if (response.status === true) {
        console.log("resposen data", response.data);
        let { result, proposal_id, url, req_id } = response.data;
        if (result?.ckyc_number) {
          setDisabled("");
          sendSuccessInfo(
            "Your Future KYC is successfully generated " + result?.ckyc_number
          );
          dispatchQuickQuote("KYC." + "Future", result?.ckyc_number);
          toggle(activeTab + 1);
        } else if (isValidHttpUrl(url) === true) {
          setDisabled("");
          setFutureKyc(true);
          setFutureKYCData({
            kycno: req_id,
            proposalNo: proposal_id,
            url: url,
          });
          // window.open(url, "_blank");
        } else if (proposal_id) {
          PostDataWithToken("kyc/future-general-kycStatus", {
            proposal_id: proposal_id,
          }).then((response) => {
            if (
              response.data?.kyc_data?.CKYC?.result?.PERSONAL_DETAILS?.CKYC_NO
            ) {
              if (response.status === true) {
                sendSuccessInfo(
                  "Your Future KYC is successfully generated " +
                    response.data?.kyc_data?.CKYC?.result?.PERSONAL_DETAILS
                      ?.CKYC_NO
                );
                dispatchQuickQuote(
                  "KYC." + "Future",
                  response.data?.kyc_data?.CKYC?.result?.PERSONAL_DETAILS
                    ?.CKYC_NO
                );
                toggle(activeTab + 1);
                setDisabled("");
              } else {
                setDisabled("");
                alert("KYC is not generated please try again ");
              }
            }
          });
        }
      }
    });
  };

  const checkRelianceKYCDetails = (pan, dob) => {
    setDisabled("disabled");
    let postData = {
      PanNumber: pan,
      DOB: moment(dob, "YYYY-MM-DD").format("DD-MM-YYYY"),
      ReturnURL: `https://pos.flaskitsolutions.com/submitProposal`,
    };
    PostDataWithToken("kyc/reliance-kyc", postData)
      .then((response) => {
        if (response.status === true) {
          setDisabled("");
          if (
            response.data.success == true &&
            response.data.KYC_Verified == "true"
          ) {
            let kycNumber =
              response.data?.kyc_data?.CKYC?.result?.PERSONAL_DETAILS?.CKYC_NO;
            dispatchQuickQuote("KYC." + "Reliance", kycNumber);
            apiRequestQQ.CustomerType == "INDIVIDUAL"
              ? toggle(activeTab + 1)
              : toggle(activeTab + 2);
          } else if (response.data.Endpoint_2_URL) {
            alert("You have to complete your Reliance E-kyc first");
            window.location.href = response.data.Endpoint_2_URL;
          } else {
            alert(response.data.message);
          }
        } else {
          setDisabled("");
        }
      })
      .catch((err) => setDisabled(""));
  };

  const checkKotakKycDetails = (pannumber, formData) => {
    setDisabled("disabled");
    let postData = {
      PanNumber: pannumber,
      DOB: formData.Dob,
      FirstName: formData.FirstName,
      LastName: formData.LastName,
      CINNumber: formData.CINNumber,
      ProposalNumber: "",
      ClientCallBackURL: `https://pos.flaskitsolutions.com/submitProposal`,
      requestId: apiRequestQQ.ApiId,
      Gender: formData.Gender === "Male" ? "M" : "F",
      CustomerType: apiRequestQQ.CustomerType === "COMPANY" ? "C" : "I",
    };
    PostDataWithToken("kyc/kotak-kyc", postData)
      .then((response) => {
        if (response.status === true) {
          if (
            response.data.KYCNumber &&
            response.data.KYCStatus == "CKYCSuccess"
          ) {
            setDisabled("");
            dispatchQuickQuote("KYC." + "Kotak", response.data.KYCNumber);
            const {
              KYCCorAdd1,
              KYCCorAdd2,
              KYCFirstName,
              KYCLastName,
              KYCMiddleName,
            } = response.data;
            KYCFirstName && dispatchQuickQuote("FirstName", KYCFirstName);
            KYCLastName && dispatchQuickQuote("LastName", KYCLastName);
            KYCLastName && dispatchQuickQuote("MiddleName", KYCMiddleName);
            // KYCCorAdd1 && dispatchQuickQuote("StreetNumber", KYCCorAdd1);
            // KYCCorAdd2 && dispatchQuickQuote("Street", KYCCorAdd2);
            // verifyKotakApi(apiRequestQQ.ApiId, response.data.TokenId);
            apiRequestQQ.CustomerType == "INDIVIDUAL"
              ? toggle(activeTab + 1)
              : toggle(activeTab + 2);
          } else if (response.data.RequestURL) {
            alert("You have to complete your Kotak E-kyc first");
            window.location.href = response.data.RequestURL;
            setDisabled("");
          } else {
            setDisabled("");
            alert(
              response.data?.ExceptionErrorMsg
                ? response.data?.ExceptionErrorMsg
                : "Please try again"
            );
          }
        }
      })
      .catch((err) => setDisabled(""));
  };

  const verifyKotakApi = (requestid, tokenId) => {
    let postData = {
      requestid: requestid,
      tokenId: tokenId,
    };
    PostDataWithToken("kyc/verify-kotak-kyc", postData).then((response) => {
      if (response.status === true) {
        console.log(response.data);
      }
    });
  };

  // Royal Sundram API
  const royalSundramKYCDetails = (fname, lname, pan, dob) => {
    setDisabled("disabled");
    let postData = {
      FirstName: fname,
      LastName: lname,
      PanNumber: pan,
      Dob: dob,
      QuoteId: apiRequestQQ.ApiId,
      CustomerType: apiRequestQQ.CustomerType === "INDIVIDUAL" ? "I" : "C",
      ReturnURL: `https://pos.flaskitsolutions.com/submitProposal`,
    };
    PostDataWithToken("kyc/royal-kyc-status", {
      QuoteId: apiRequestQQ.ApiId,
    }).then((response) => {
      if (response.data.applicationStatus == "Failure") {
        PostDataWithToken("kyc/royal-sundram-kyc", postData)
          .then((response) => {
            if (response.status === true) {
              if (response.data.url != null) {
                setDisabled("");
                alert("You have to complete your Royal Sundram E-kyc first");
                window.location.href = response.data.url;
              } else if (response.data.kycStatus === true) {
                sendSuccessInfo(
                  "Your Royal Sundram KYC is successfully generated " +
                    response.data?.kycDetails.ckycNo
                );
                dispatchQuickQuote(
                  "KYC." + "Royal",
                  response.data?.kycDetails.ckycNo
                );
                dispatchQuickQuote(
                  "KYC." + "RoyalRefNo",
                  response.data?.kycRefNo
                );
                dispatchQuickQuote(
                  "FirstName",
                  response.data?.kycDetails.firstName
                );
                dispatchQuickQuote(
                  "LastName",
                  response.data?.kycDetails.lastName
                );
                dispatchQuickQuote(
                  "MiddleName",
                  response.data?.kycDetails.middleName
                );

                apiRequestQQ.CustomerType == "INDIVIDUAL"
                  ? toggle(activeTab + 1)
                  : toggle(activeTab + 2);
                setDisabled("");
              } else {
                setDisabled("");
                alert("KYC not done please retry again");
              }
            }
          })
          .catch((err) => {
            console.log("err", err);
            setDisabled("");
          });
      } else if (response.data.applicationStatus == "Success") {
        dispatchQuickQuote("KYC." + "Royal", response.data.ckycNo);
        dispatchQuickQuote("KYC." + "RoyalRefNo", response.data?.kycRefNo);
        dispatchQuickQuote("FirstName", response.data.firstName);
        dispatchQuickQuote("LastName", response.data.lastName);
        dispatchQuickQuote("MiddleName", response.data.middleName);

        apiRequestQQ.CustomerType == "INDIVIDUAL"
          ? toggle(activeTab + 1)
          : toggle(activeTab + 2);
        setDisabled("");
      }
    });
  };

  return (
    <div className="card p-4 mt-3">
      {futureKYC ? (
        <FutureGeneralKYCRedirect
          kycno={futureKYCData?.kycno}
          proposalNo={futureKYCData?.proposalNo}
          url={futureKYCData?.url}
        />
      ) : (
        <form onSubmit={handleSubmit(handleSaveUser)}>
          <p className="mb-0 fs-3 fw-bold">Personal Details</p>
          <div className="othervoption mt-3">
            <div className="row mx-0 px-0">
              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      {...register("Salutation", {
                        required: "Salutation is required",
                      })}
                      className="form-select"
                      style={{
                        paddingLeft: 12,
                        paddingTop: 25,
                        height: "calc(2.8rem + 10px)",
                        border: "1px solid lightgray",
                      }}
                      id="gen"
                    >
                      {apiRequestQQ.CustomerType === "INDIVIDUAL" ? (
                        <>
                          <option value="Mr" selected>
                            MR.
                          </option>
                          <option value="Miss">MISS.</option>
                          <option value="Mrs">MRS.</option>
                        </>
                      ) : (
                        <option value="M/S" selected>
                          M/S
                        </option>
                      )}
                    </select>
                    <label htmlFor="gen">
                      Salutation
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.Salutation?.message}</p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      {...register("FirstName", {
                        required: "First Name is required",
                      })}
                      id="fsa1"
                      placeholder="Owner Nam as m"
                    />
                    <label htmlFor="fsa1">
                      First Name
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.FirstName?.message}</p>
                </div>
              </div>

              <div className="col-lg-4 pe-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="text"
                      className="form-control"
                      {...register("LastName", {
                        required: "Last Name is required",
                      })}
                      id="fsa1s"
                      placeholder="Owner Nam as m"
                    />
                    <label htmlFor="fsa1s">
                      Last Name
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.LastName?.message}</p>
                </div>
              </div>

              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      {...register("Gender", {
                        required: "Gender is required",
                      })}
                      className="form-select"
                      style={{
                        paddingLeft: 12,
                        paddingTop: 25,
                        height: "calc(2.8rem + 10px)",
                        border: "1px solid lightgray",
                      }}
                      id="gen"
                    >
                      <option className="d-none" selected value="">
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <label htmlFor="gen">
                      Gender
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.Gender?.message}</p>
                </div>
              </div>

              <div className="col-lg-4 ">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="date"
                      className="datepicker form-control"
                      {...register("Dob", {
                        required:
                          selectedPlan.Api_name == "Kotak" &&
                          apiRequestQQ.CustomerType === "COMPANY"
                            ? "Field is required"
                            : "Date of Birth is required",
                      })}
                      max={
                        apiRequestQQ.CustomerType === "COMPANY"
                          ? moment().format("YYYY-MM-DD")
                          : moment().subtract("18", "year").format("YYYY-MM-DD")
                      }
                      id="dob"
                      placeholder="Date of birth"
                    />
                    <label htmlFor="dob">
                      {apiRequestQQ.CustomerType === "COMPANY"
                        ? "Incorporation Year"
                        : "Date of Birth"}
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.Dob?.message}</p>
                </div>
              </div>

              <div className="col-lg-4 pe-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="text"
                      {...register("MobileNumber", {
                        required: "Mobile Number is required",
                        pattern: {
                          value:
                            /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                          message: "Invalid Mobile Number",
                        },
                      })}
                      className="form-control"
                      id="fsaqw"
                      placeholder="Mobile Number"
                      maxLength="10"
                    />
                    <label htmlFor="fsaqw">
                      Mobile Number
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.MobileNumber?.message}</p>
                </div>
              </div>

              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="email"
                      className="form-control"
                      {...register("Email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                          message: "Invalid Email",
                        },
                      })}
                      id="fsaemail"
                      placeholder="Enter email"
                    />
                    <label htmlFor="fsaemail">
                      Email Address
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.Email?.message}</p>
                </div>
              </div>

              <div className="col-lg-4 ">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="text"
                      className="form-control"
                      {...register("StreetNumber")}
                      id="fsa1m"
                      placeholder="Owner Nam as m"
                    />
                    <label htmlFor="fsa1m">
                      House/Street Number
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 pe-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="text"
                      className="form-control"
                      {...register("Street")}
                      id="fsa1ss"
                      placeholder="Owner Nam as m"
                    />
                    <label htmlFor="fsa1ss">
                      Street
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="text"
                      className="form-control"
                      {...register("Area")}
                      id="fsa1ar"
                      placeholder="Owner Nam as m"
                    />
                    <label htmlFor="fsa1ar">
                      Area
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 ">
                <div className="position-relative mb-3">
                  <div
                    className="form-floating pincode"
                    style={{
                      height: "calc(3rem + 10px)",
                      border: "1px solid lightgray",
                      borderRadius: "6px",
                    }}
                  >
                    <ReactSelect
                      options={pincodeData}
                      onChange={(val) => handleSelectPincode(val)}
                      placeholder="Select area pincode"
                      defaultValue={apiRequestQQ.Pincode}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-4 pe-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      list="browsers"
                      {...register("State")}
                      onChange={(e) => handleSelectState(e.target.value)}
                      className="form-control"
                      name="myBrowser"
                    />
                    <label htmlFor="fsa">
                      State
                      <span className="text-danger">*</span>
                    </label>
                    <datalist id="browsers">
                      {stateData &&
                        stateData.length &&
                        stateData.map((item, index) => {
                          return (
                            <option
                              onClick={() => handleSelectState(item)}
                              key={index}
                            >
                              {item?.PC_CODE}
                            </option>
                          );
                        })}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-3">
                  <div className="form-floating ">
                    <input
                      type="text"
                      className="form-control"
                      {...register("City")}
                      id="fsa"
                      placeholder="communication address"
                    />
                    <label htmlFor="fsa">
                      City
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
              </div>

              {apiRequestQQ.CustomerType === "COMPANY" && (
                <div className="col-lg-4 ps-lg-0">
                  <div className="position-relative mb-3">
                    <div className="form-floating ">
                      <input
                        type="text"
                        className="form-control"
                        {...register("GSTNo", {
                          required: "Field is required",
                        })}
                        id="fsa"
                        placeholder="Company GST Number"
                      />
                      <label htmlFor="fsa">
                        Company GST No.
                        <span className="text-danger">*</span>
                      </label>
                    </div>
                    <p className="m-0 f-error">{errors?.GSTNo?.message}</p>
                  </div>
                </div>
              )}

              <>
                {selectedPlan.Api_name == "Shriram" && (
                  <div className="col-lg-4 ps-lg-0">
                    <div className="position-relative mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="fsa1"
                          {...register("KycNumber")}
                          placeholder="KYC Number"
                        />
                        <label htmlFor="fsa1">
                          KYC Number
                          <span className="text-danger">*</span>
                        </label>
                      </div>
                      <p className="m-0 f-error">
                        {errors?.KycNumber?.message}
                      </p>
                    </div>
                  </div>
                )}
                {selectedPlan.Api_name == "Kotak" &&
                  apiRequestQQ.CustomerType === "COMPANY" && (
                    <div className="col-lg-4 ps-lg-0">
                      <div className="position-relative mb-3">
                        <div className="form-floating ">
                          <input
                            type="text"
                            {...register("CINNumber", {
                              required: "CIN Number is required",
                            })}
                            className="form-control"
                            id="fsaqw13"
                            placeholder="CIN Number"
                          />
                          <label htmlFor="fsaqw13">
                            CIN Number
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <p className="m-0 f-error">
                          {errors?.CINNumber?.message}
                        </p>
                      </div>
                    </div>
                  )}

                <div className="col-lg-4 ps-lg-01">
                  <div className="position-relative mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        style={{ textTransform: "uppercase" }}
                        id="fsa1"
                        {...register("PanNumber", {
                          required: "Pan is required",
                          pattern: {
                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                            message: "Invalid Pan Number",
                          },
                        })}
                        onChange={(e) => handleChangePanValue(e.target.value)}
                        placeholder="Pan Car Number"
                      />
                      <label htmlFor="fsa1">
                        Pan Card Number
                        <span className="text-danger">*</span>
                      </label>
                    </div>
                    <p className="m-0 f-error">{errors?.PanNumber?.message}</p>
                  </div>
                </div>

                <div className="col-lg-4 col-sm-4  col-6 mb-3">
                  <input
                    type="file"
                    className="d-none"
                    id={"panImage"}
                    name={"panImage"}
                    onChange={(e) => handleUploadPanFile(e.target.files)}
                    accept={"image/*"}
                  />

                  <label htmlFor={"panImage"} className="">
                    <p className="fs-2 text-decoration-underline fw-bold">
                      Pan Card
                    </p>
                    <img
                      src={
                        pan.image ? pan.image : "../assets/images/Addimg.png"
                      }
                      className=" d-block"
                      style={{
                        objectFit: "contain",
                        height: "120px",
                        width: "120px",
                      }}
                    />
                  </label>
                  <p className="m-0 f-error">{pan.error}</p>
                </div>
              </>

              <div className="col-lg-12 ">
                <div className="col-lg-2 col-sm-6 mx-lg-0 mx-auto col-12 px-lg-0">
                  <button
                    disabled={disabled}
                    type="submit"
                    className="btn btn-primary nextBtn mb-9 mt-3 py-1 w-100 fs-3 fw-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default OwnerDetails;
