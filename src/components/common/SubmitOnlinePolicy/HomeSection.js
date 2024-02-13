import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { TabContent, TabPane, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useRef } from "react";
import { useState } from "react";
import moment from "moment";
import {
  getBajajMMV,
  getVehicleMake,
  getVehicleModel,
  getVehiclePreviousInsurer,
  getVehicleRto,
  getVehicleVariant,
} from "../../services/masterService";
import InputBox from "../../common/Tags/InputBox";
import SelectList from "../../common/Tags/SelectList";
import RadioBox from "../../common/Tags/RadioBox";
import {
  bikePolicyInfoArr,
  fourWheelerModel,
  gcvVehiclePolicyInfoArr,
  pcvVehiclePolicyInfoArr,
  pvtCarPolicyInfoArr,
  twoWheelerMake,
} from "../../utility/MakeModelArr";
import ReactSelect from "../../common/Tags/ReactSelect";
import {
  dispatchQuickQuote,
  generateArrayOfYears,
} from "../../../store/actions/userAction";
import {
  bajajApiCall,
  digitAPICall,
  FutureGeneralQuickQuote,
  HDFCCalculatePremium,
  KotakAPICall,
  RelianceAPICall,
  RoyalSundramAPICall,
  savePolicyToDatabase,
  shriramGenerateProposal,
} from "../../utility/TPApiCall";
import QuotePolicyDetails from "./PaymentPages/QuotePolicyDetails";
const HomeSection = ({
  modal,
  setModal,
  VehicleModel,
  vehicleType,
  toggleModal = () => {},
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const {
    handleSubmit: handleSubmit1,
    register: register1,
    watch: watch1,
    formState: { errors: errors1 },
  } = useForm({ mode: "onBlur" });
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const type = useSelector((state) => state?.root?.userDetails.type);
  // const toggleModal = () => setModal(!modal);
  // const showModal = () => {
  //   document.getElementById("modal-container").removeAttribute("class");
  //   document.getElementById("modal-container").classList.add("three");
  //   document.body.classList.add("modal-active");
  // };

  // const hideModel = () => {
  //   document.getElementById("modal-container").classList.add("out");
  //   document.body.classList.remove("modal-active");
  // };

  const [vehicleModel, setVehicleModel] = React.useState("");
  const [quickPick, setQuickPick] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState(1);
  const [makeData, setMakeData] = React.useState([]);
  const [modelData, setModelData] = React.useState([]);
  const [variantData, setVariantData] = React.useState([]);
  const [insurerData, setInsurerData] = React.useState([]);
  const [rtoData, setRtoData] = React.useState([]);
  const [RegistrationNumber, setRegistrationNumner] = useState("");
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [regYear, setRegYear] = useState("");
  const [policyInputs, setPolicyInputs] = React.useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);

  const previousPolicyKnow = useRef(null);
  previousPolicyKnow.current = watch1("PolicyStatus");

  useEffect(() => {
    if (policyInputs.length > 0) {
      let vehicleArray =
        vehicleModel === "Pvt Car"
          ? pvtCarPolicyInfoArr
          : vehicleModel === "MotorBike"
          ? bikePolicyInfoArr
          : vehicleModel === "Goods Carrying"
          ? gcvVehiclePolicyInfoArr
          : vehicleModel === "Passenger Carrying" && pcvVehiclePolicyInfoArr;
      const index1 = vehicleArray.findIndex(
        (item) => item.name === "PreviousPolicyType"
      );
      const index2 = vehicleArray.findIndex(
        (item) => item.name === "PreInsurerCode"
      );
      const index3 = vehicleArray.findIndex(
        (item) => item.name === "PrePolicyEndDate"
      );
      const index4 = vehicleArray.findIndex(
        (item) => item.name === "PreviousNoClaimBonus"
      );
      const index5 = vehicleArray.findIndex(
        (item) => item.name === "claim_made"
      );

      const arr = [...vehicleArray];
      if (watch1("PolicyStatus") == "false") {
        let indexes = [index1, index2, index3, index4, index5];
        while (indexes.length) {
          arr.splice(indexes.pop(), 1);
        }

        setPolicyInputs(arr);
      } else {
        arr[index1] = vehicleArray[index1];
        arr[index2] = vehicleArray[index2];
        arr[index3] = vehicleArray[index3];

        setPolicyInputs(arr);
      }
    }
  }, [previousPolicyKnow.current]);

  useEffect(() => {
    if (modal === true && activeTab != 1) {
      setActiveTab(1);
    }
  }, [modal]);

  useEffect(() => {
    getVehicleRto().then((response) => {
      if (response.status === true) {
        let data = response.data;
        let i = 0;
        let arr = [];
        while (i < data.length) {
          let item = data[i];
          arr.push({
            label: item.registered_city_name + " (" + item.RTO_Code + ")",
            value: item.RTO_Code,
            registered_state_name: item?.registered_state_name,
            id: item.id,
            registered_city_name: item.registered_city_name,
          });
          i++;
        }
        setRtoData(arr);
      }
    });

    getVehiclePreviousInsurer().then((response) => {
      if (response.status === true) {
        let i = 0;
        let data = response.data;
        let arr = [];
        while (i < data.length) {
          let item = data[i];
          arr.push({
            option: item.Name,
            value: item.Digit_Code,
          });
          i++;
        }
        setInsurerData(arr);
      }
    });
  }, []);

  useEffect(() => {
    if (VehicleModel) {
      setVehicleType();
    }
  }, [VehicleModel]);
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const setVehicleType = () => {
    VehicleModel === "Pvt Car"
      ? setPolicyInputs(pvtCarPolicyInfoArr)
      : VehicleModel === "MotorBike"
      ? setPolicyInputs(bikePolicyInfoArr)
      : VehicleModel === "Goods Carrying"
      ? setPolicyInputs(gcvVehiclePolicyInfoArr)
      : VehicleModel === "Passenger Carrying" &&
        setPolicyInputs(pcvVehiclePolicyInfoArr);
    setVehicleModel(VehicleModel);

    getVehicleMake({ Vehicle_Type: VehicleModel }).then((response) => {
      if (response.status === true) {
        let data = response.data;
        let i = 0;
        let arr = [];
        while (i < data.length) {
          let item = data[i];
          arr.push({
            label: item.Make,
            value: item.Make,
          });
          i++;
        }
        setMakeData(arr);
      }
    });
    dispatchQuickQuote("VehicleType", vehicleType);
    VehicleModel === "MotorBike"
      ? setQuickPick(twoWheelerMake)
      : VehicleModel === "Pvt Car" && setQuickPick(fourWheelerModel);
  };

  const handleSelectMake = (make) => {
    dispatchQuickQuote("MakeName", make);
    dispatchQuickQuote("ModelName", "");
    dispatchQuickQuote("VariantName", "");
    getVehicleModel({ make: make, Vehicle_Type: vehicleModel }).then(
      (response) => {
        if (response.status === true) {
          toggleTab(activeTab + 1);
          let data = response.data;
          let i = 0;
          let arr = [];
          while (i < data.length) {
            let item = data[i];
            arr.push({
              label: item.Model,
              value: item.Model,
            });
            i++;
          }
          setModelData(arr);
        }
      }
    );
  };

  const handleSelectModel = (model) => {
    dispatchQuickQuote("ModelName", model);
    dispatchQuickQuote("VariantName", "");
    getVehicleVariant({
      make: apiRequestQQ.MakeName,
      model: model,
      Vehicle_Type: vehicleModel,
    }).then((response) => {
      if (response.status === true) {
        let data = response.data;
        let fuelTypeArr = data.filter(
          (v, i, a) => a.findIndex((v2) => v2.Fuel_Type === v.Fuel_Type) === i
        );
        let j = 0;
        let fuelarr = [];
        while (j < fuelTypeArr.length) {
          fuelarr.push(fuelTypeArr[j].Fuel_Type);
          j++;
        }
        setFuelTypes(fuelarr);
        let i = 0;
        let arr = [];
        while (i < data.length) {
          let item = data[i];
          arr.push({
            label: item.Variant,
            value: item.Vehicle_Code,
            Fuel_Type: item.Fuel_Type,
            Cubic_Capacity: item.Cubic_Capacity,
            Seating_Capacity: item.Seating_Capacity,
            HDFC: item.HDFC,
            Shriram: item.Shriram,
            Kotak: item.Kotak,
            Reliance: item.Reliance,
            Future: item.Future,
            Royal: item.Royal,
          });
          i++;
        }
        setVariantData(arr);

        toggleTab(activeTab + 1);
      }
    });
  };

  const handleSelectPetrolType = (val) => {
    if (val == "CNG" || val == "LPG") {
      dispatchQuickQuote("IsInternalCNG", true);
    }
    dispatchQuickQuote("FuelType", val);
    toggleTab(activeTab + 1);
  };

  const submitUserDetails = (data) => {
    let newData = {
      FirstName: data.fullname.split(" ")[0],
      LastName: data.fullname.split(" ")[1],
      Email: data.Email,
      MobileNumber: data.MobileNumber,
    };

    for (let key in newData) {
      dispatchQuickQuote(key, newData[key]);
    }
    let postData = {
      name: newData.FirstName + "" + newData.LastName,
      email: newData.Email,
      phone: newData.MobileNumber,
    };

    setActiveTab(activeTab + 1);
    // createCustomer(postData)
  };

  const handleSelectVariant = (variant) => {
    console.log("variant ---------", variant);

    dispatchQuickQuote("VariantCode.Digit", variant.value);
    dispatchQuickQuote("VariantCode.HDFC", variant.HDFC);
    dispatchQuickQuote("VariantCode.Shriram", variant.Shriram);
    dispatchQuickQuote("VariantCode.Kotak", variant.Kotak);
    dispatchQuickQuote("VariantCode.Reliance", variant.Reliance);
    dispatchQuickQuote("VariantCode.Future", variant.Future);
    dispatchQuickQuote("VariantCode.Royal", variant.Royal);
    let postdata = {
      VehicleType: apiRequestQQ.VehicleType,
      Make: apiRequestQQ.MakeName,
      Model: apiRequestQQ.ModelName,
      Variant: variant.label,
      CC: variant.Cubic_Capacity,
      fuelType: variant.Fuel_Type,
    };

    dispatchQuickQuote("FuelType", variant.Fuel_Type);
    dispatchQuickQuote("VariantName", variant.label);
    dispatchQuickQuote("CarryingCapacity", variant.Seating_Capacity);
    dispatchQuickQuote("CubicCapacity", variant.Cubic_Capacity);
    getBajajMMV(postdata).then((response) => {
      if (response.status === true) {
        if (response?.data) {
          dispatchQuickQuote("VariantCode.Bajaj", response.data.vehiclecode);
          dispatchQuickQuote("VehicleMakeCode", response.data.vehiclemakecode);
          dispatchQuickQuote(
            "VehicleModelCode",
            response.data.vehiclemodelcode
          );
          dispatchQuickQuote(
            "VehicleSubTypeCode",
            response.data.vehiclesubtypecode
          );
          dispatchQuickQuote(
            "CarryingCapacity",
            response.data.carryingcapacity
          );
          dispatchQuickQuote("CubicCapacity", response.data.cubiccapacity);
          // dispatchQuickQuote("VariantName", response.data.vehiclesubtype);
        } else {
          dispatchQuickQuote("VariantName", variant.label);
        }
      } else {
        dispatchQuickQuote("VariantName", variant.label);
      }
    });
    toggleTab(activeTab + 1);
  };

  const submitRegistrationNumber = () => {
    getPolicyTenuare();
    let rtocode = RegistrationNumber.substring(0, 5)
      .replaceAll("-", "")
      .toUpperCase();
    let index = rtoData.findIndex((item) => item.value === rtocode);
    dispatchQuickQuote(
      "RegistrationCity",
      rtoData[index]?.registered_city_name.toUpperCase()
    );
    dispatchQuickQuote("State", rtoData[index]?.registered_state_name);
    dispatchQuickQuote("IsVehicleNew", false);
    setIsNewVehicle(false);
    dispatchQuickQuote("RegistrationNumber", RegistrationNumber.toUpperCase());

    apiRequestQQ.PolicyType === "Renewal"
      ? toggleTab(activeTab + 2)
      : toggleTab(activeTab + 1);
  };

  const selectVehicleYear = (year) => {
    setRegYear(year);
    dispatchQuickQuote("RegistrationYear", year);
    toggleTab(activeTab + 1);
  };
  const navigate = useNavigate();

  const submitPolicyDetails = (data) => {
    let newData = { ...apiRequestQQ };
    if (
      checkIfDateIsIn3Month(data.PrePolicyEndDate) &&
      apiRequestQQ.IsVehicleNew === false &&
      apiRequestQQ.PolicyStatus == "continue"
    ) {
      const startDate = moment(data.PrePolicyEndDate)
        .add(1, "day")
        .format("YYYY-MM-DD");
      const endDate = moment(startDate, "YYYY-MM-DD")
        .add(1, "year")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      dispatchQuickQuote("PolicyStartDate", startDate);
      dispatchQuickQuote("PolicyEndDate", endDate);
      newData.PolicyStartDate = startDate;
      newData.PolicyEndDate = endDate;
    } else {
      const startDate = moment().add(1, "day").format("YYYY-MM-DD");
      const endDate = moment(startDate, "YYYY-MM-DD")
        .add(1, "year")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      dispatchQuickQuote("PolicyStartDate", startDate);
      dispatchQuickQuote("PolicyEndDate", endDate);
      newData.PolicyStartDate = startDate;
      newData.PolicyEndDate = endDate;
    }

    for (let key in data) {
      if (Object.keys(apiRequestQQ).includes(key)) {
        if (key === "PolicyStatus" && watch1("PolicyStatus") == "false") {
          dispatchQuickQuote("IsPreviousInsurerKnown", false);
        }
        newData[key] = data[key];
        dispatchQuickQuote(key, data[key]);
      }
    }

    setTimeout(() => {
      // savePolicyToDatabase(newData)
      digitAPICall(newData);
      bajajApiCall(newData);

      // shriramGenerateProposal(newData, false);
      if (newData.PreInsurerCode != "152") {
        KotakAPICall(newData);
      }
      // if (
      //   moment().format("YYYY") - newData.RegistrationYear <= 15 &&
      //   (newData.NewPolicyType == "ThirdParty" || newData.PolicyStatus == "continue") &&
      //   newData.NewPolicyType != "ODOnly"
      // ) {
      //   RelianceAPICall(newData);
      // }
      if (
        moment().format("YYYY") - apiRequestQQ.RegistrationYear <= 15 &&
        apiRequestQQ.PolicyStatus == "continue"
      ) {
        RelianceAPICall(newData);
      }
      // FutureGeneralQuickQuote(newData);
      // RoyalSundramAPICall(newData);
      // if (moment().format("YYYY") - apiRequestQQ.RegistrationYear <= 15 && newData.PolicyStatus == "continue") {
      //   HDFCCalculatePremium(newData);
      // }
      navigate("/quotelist");
    }, 2000);
  };
  const formatReg = (e) => {
    var t = e;
    t = t.replace(/-/g, "");
    var o = new Array(4);
    (o[0] = t.slice(0, 2)), (o[1] = ""), (o[2] = ""), (o[3] = "");
    try {
      isNaN(t.slice(2, 4))
        ? isNaN(t.slice(3, 4))
          ? (isNaN(t.slice(2, 3)) || (o[1] = t.slice(2, 3)),
            isNaN(t.slice(3, 4)) && (o[2] = t.slice(3, 4)))
          : (o[1] = t.slice(2, 3) + t.slice(3, 4))
        : (o[1] = t.slice(2, 4)),
        isNaN(t.slice(4, 8))
          ? ((o[2] = o[2] + t.slice(4, 5)),
            1 == isNaN(t.slice(5, 6)) && 1 == isNaN(t.slice(6, 7))
              ? (o[2] = o[2] + t.slice(5, 7))
              : (isNaN(t.slice(5, 6))
                  ? (o[2] = o[2] + t.slice(5, 6))
                  : (o[3] = o[3] + t.slice(5, 6)),
                isNaN(t.slice(6, 7)) || (o[3] = o[3] + t.slice(6, 7))),
            isNaN(t.slice(7, 11)) || (o[3] = o[3] + t.slice(7, 11)))
          : (o[3] = o[3] + t.slice(4, 8));
    } catch (e) {}
    return o
      .join("-")
      .replace(/ /g, "")
      .replace(/--/g, "-")
      .replace(/-\s*$/, "")
      .replace(/[^- 0-9 a-z A-z]/g, "");
  };

  const setRegistrationValue = (e) => {
    if (navigator.userAgent.match(/UCBrowser/)) return !1;
    var t = document.querySelector("#vinpuut").value,
      o = e.keyCode;
    if (
      -1 != navigator.userAgent.indexOf("MSIE") ||
      1 == !!document.documentMode
    ) {
      if (32 == o || 8 == o) return !1;
      t.length >= 3 && (t = formatReg(t)),
        t.length >= 5 && (t = formatReg(t)),
        t.length >= 7 && (t = formatReg(t)),
        (document.querySelector("#vinpuut").value = t.toUpperCase());
    } else
      setTimeout(function () {
        if (32 == o || 8 == o) return !1;
        (t = document.querySelector("#vinpuut").value).length >= 3 &&
          (t = formatReg(t)),
          t.length >= 5 && (t = formatReg(t)),
          t.length >= 7 && (t = formatReg(t)),
          (document.querySelector("#vinpuut").value = t.toUpperCase());
      }, 100);
    setRegistrationNumner(t);
  };

  const handleSelectRtoCity = (val) => {
    dispatchQuickQuote("State", val?.registered_state_name);
    getPolicyTenuare();
    dispatchQuickQuote("RtoCode", val.value);
    dispatchQuickQuote(
      "RegistrationCity",
      val.registered_city_name.toUpperCase()
    );
    toggleTab(activeTab + 1);
  };

  
  const getPolicyTenuare = () => {
    if (isNewVehicle === true && vehicleType == "2w") {
      const startDate = moment().format("YYYY-MM-DD");
      const endDate = moment()
        .add(5, "year")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      dispatchQuickQuote("PolicyStartDate", startDate);
      dispatchQuickQuote("PolicyEndDate", endDate);
    } else if (isNewVehicle === true && vehicleType == "4w") {
      const startDate = moment().format("YYYY-MM-DD");
      const endDate = moment()
        .add(3, "year")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      dispatchQuickQuote("PolicyStartDate", startDate);
      dispatchQuickQuote("PolicyEndDate", endDate);
    } else {
      const startDate = moment().format("YYYY-MM-DD");
      const endDate = moment()
        .add(1, "year")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      dispatchQuickQuote("PolicyStartDate", startDate);
      dispatchQuickQuote("PolicyEndDate", endDate);
    }
  };

  return (
    <>
      <Modal
        isOpen={modal}
        size="xl"
        className=" modal-dialog-centered MYmmvmodal"
        toggle={toggleModal}
        id="MMVMODAL"
      >
        <ModalBody className="p-0">
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal()}
            data-bs-dismiss="modal"
            aria-label="Close"
          />
          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <div class="mmvcard h-100 step-1 my-0 py-0">
                <div class="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-center">
                  <div class="row mx-0 px-0 text-center justify-content-between align-items-center h-100">
                    <div class="col-md-5  col-12 ps-lg-0">
                      <div class="mmvcard__img">
                        <img
                          src={
                            vehicleType == "4w"
                              ? "./assets/images/insuasperreqcar.png"
                              : vehicleType == "2w"
                              ? "./assets/images/insuasperreqbike.png"
                              : vehicleType == "pcv"
                              ? "./assets/images/insuasperreqpcv.png"
                              : vehicleType == "gcv" &&
                                "./assets/images/insuasperreqgcv.png"
                          }
                          class="w-100 carmodalimg ps-lg-5 "
                          alt=""
                        />
                      </div>
                    </div>

                    <div class="col-md-7 col-12">
                      <div class="container-fluid p-lg-5">
                        <aside class="title text-start fw-bold fs-3 mt-lg-0 mt-3">
                          <span>
                            {vehicleType == "4w"
                              ? "Car Insurance"
                              : vehicleType == "2w"
                              ? "Bike Insurance"
                              : vehicleType == "pcv"
                              ? "Pcv Insurance"
                              : "Gcv Insurance"}
                          </span>
                        </aside>

                        <p class="fs-6 my-1 text-start">
                          A comprehensive car insurance policy offers complete
                          protection to you. It covers not only the costs
                          incurred on damages to a third party but also the
                          damages to your car.
                        </p>

                        <div class="vehicleInputs mt-5 mb-lg-0 mb-5 w-75">
                          <div class="form-floating text-start">
                            <input
                              type="text"
                              className="form-control"
                              id="vinpuut"
                              // value={RegistrationNumber}
                              style={{ textTransform: "uppercase" }}
                              onChange={(e) => setRegistrationValue(e)}
                              placeholder="Enter Your Vehicle Registration Number"
                            />
                            <label htmlFor="vinpuut">
                              Enter Your Registration Number
                            </label>

                            {/* <p className="m-0 f-error">Input invalid</p> */}
                          </div>

                          <div className="text-start mt-4">
                            <a
                              href="javascript:void(0)"
                              onClick={() => submitRegistrationNumber()}
                              style={{
                                border: "none",
                                borderRadius: "2px",
                                marginTop: 0,
                              }}
                              className="btn btn-primary get-quotebtn d-inline-flex position-relative px-3 py-1 text-start fs-5"
                            >
                              Get Your Quote
                            </a>
                            {/* <p className="fs-3 mb-0 mt-5 fw-bold text-decoration-underline">
                              <a href="javascript:void(0)" className="ms-1">
                                Don't know car number? Click here
                              </a>
                            </p> */}

                            <p
                              className="fs-6 mb-0 mt-1 fw-bold"
                              style={{ textDecoration: "none" }}
                            >
                              <a
                                href="javascript:void(0)"
                                onClick={() => {
                                  dispatchQuickQuote("IsVehicleNew", true);
                                  setIsNewVehicle(true);
                                  setActiveTab(2);
                                }}
                                className="ms-1"
                              >
                                Bought a new{" "}
                                {vehicleType == "2w"
                                  ? "bike"
                                  : vehicleType == "4w"
                                  ? "car"
                                  : "vehicle"}
                                ?
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tabId={2}>
              <div class="mmvcard h-100 p-1 pe-0">
                <div
                  style={{ margin: 30 }}
                  class="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-start"
                >
                  <div class="d-flex justify-content-between align-items-center pe-2 w-100">
                    <p class="fs-3 fw-bold">Search RTO City-Code</p>
                  </div>

                  <div class="input-group mb-3 w-50">
                    {/* <span
                      class="input-group-text border-end-0 fs-3 px-3 rounded-0"
                      id="basic-addon1"
                    >
                      <i class="fas fa-search"></i>
                    </span> */}

                    <div class="form-floating">
                      <ReactSelect
                        options={rtoData}
                        name="rto"
                        placeholder="Select RTO Location"
                        onChange={(val) => handleSelectRtoCity(val)}
                      />
                    </div>
                  </div>

                  <div className="car-company gen-info d-flex flex-wrap mt-5">
                    {/*----- input form car select -----*/}
                    {rtoData &&
                      rtoData.length > 0 &&
                      rtoData
                        .filter(
                          (item) => item?.registered_state_name === "RAJASTHAN"
                        )

                        .slice(0, 20)
                        .map((item, index) => (
                          <>
                            <input
                              type="radio"
                              className="form-control d-none"
                              id={"rto" + item.id}
                              name="regcitycode"
                              onClick={() => handleSelectRtoCity(item)}
                            />
                            <label htmlFor={"rto" + item.id} className="shadow">
                              <span style={{ fontSize: 14 }}>{item.value}</span>
                              <i className="fas fa-check-circle text-success" />
                            </label>
                          </>
                        ))}
                  </div>

                  <div class="form-btns d-flex justify-content-between align-items-center pe-5 w-100 mt-auto">
                    <button
                      onClick={() => toggleTab(activeTab - 1)}
                      class="btn btn-primary"
                    >
                      Previous
                    </button>
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tabId={3}>
              <div class="mmvcard h-100 p-lg-5 p-4 pe-lg-0 pe-4">
                <div className="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-start">
                  <div className="d-flex justify-content-between align-items-center pe-lg-5 w-100 mt-lg-3 mt-5">
                    <p class="fs-3 fw-bold">What is your Vehicle brand?</p>
                  </div>

                  <div class="input-group mb-3 w-50">
                    {/* <span
                      class="input-group-text border-end-0 fs-3 px-3 rounded-0"
                      id="basic-addon1"
                    >
                      <i class="fas fa-search"></i>
                    </span> */}

                    <div class="form-floating">
                      <ReactSelect
                        options={makeData}
                        name="make"
                        placeholder="Select Manufacturer"
                        onChange={(val) => handleSelectMake(val.value)}
                      />
                    </div>
                  </div>

                  <div className="car-company d-flex flex-wrap justify-content-lg-start justify-content-center mt-5">
                    {/*----- input form car select -----*/}
                    {quickPick.map((item, i) => (
                      <>
                        <input
                          type="radio"
                          onClick={() => handleSelectMake(item.value)}
                          value={item.value}
                          className="form-control d-none"
                          id={"idx" + i}
                          name={"make"}
                        />
                        <label htmlFor={"idx" + i}>
                          <img
                            src={item.image}
                            alt=""
                            // style={{ objectFit: "contain" }}
                          />
                          <i className="fas fa-check-circle text-success" />
                        </label>
                      </>
                    ))}
                  </div>

                  <div class="form-btns d-flex justify-content-between align-items-center pe-lg-5 mt-lg-auto w-100 mb-lg-0 mt-5 mb-3">
                    <button
                      onClick={() => toggleTab(activeTab - 1)}
                      class="btn btn-primary"
                    >
                      Previous
                    </button>

                    {/* <button
                      disabled={apiRequestQQ?.MakeName == ""}
                      onClick={() => toggleTab(activeTab + 1)}
                      class="btn btn-primary fs-2 px-5 py-3"
                    >
                      Next
                    </button> */}
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tabId={4}>
              <div class="mmvcard h-100 p-lg-5 p-4 pe-lg-0 pe-4">
                <div className="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-start">
                  <div className="d-flex justify-content-between align-items-center pe-lg-5 w-100 mt-lg-3 mt-5">
                    <p class="fs-3 fw-bold">Search Car Modal?</p>
                  </div>
                  <div class="input-group mb-3 w-50">
                    {/* <span
                      class="input-group-text border-end-0 fs-3 px-3 rounded-0"
                      id="basic-addon1"
                    >
                      <i class="fas fa-search"></i>
                    </span> */}

                    <div class="form-floating ">
                      <ReactSelect
                        options={modelData}
                        name="model"
                        placeholder="Select vehicle modal"
                        onChange={(val) => handleSelectModel(val.value)}
                      />
                    </div>
                  </div>

                  <div
                    style={{ alignItems: "stretch" }}
                    className="car-company d-flex flex-wrap justify-content-lg-start justify-content-center mt-5 gen-info"
                  >
                    {modelData &&
                      modelData.length > 0 &&
                      modelData.slice(0, 20).map((item, index) => (
                        <>
                          <input
                            type="radio"
                            style={{ display: "hidden" }}
                            onClick={() => handleSelectModel(item.value)}
                            className="form-control d-none"
                            id={"rto11" + index}
                            name="carComanY"
                          />
                          <label
                            htmlFor={"rto11" + index}
                            className="shadow"
                            style={{ height: "content-fit" }}
                          >
                            <span style={{ fontSize: 14 }}>{item.value}</span>
                          </label>
                        </>
                      ))}
                  </div>
                  <div class="form-btns d-flex justify-content-between align-items-center pe-lg-5 mt-lg-auto w-100 mb-lg-0 mt-5 mb-3">
                    <button
                      onClick={() => toggleTab(activeTab - 1)}
                      class="btn btn-primary"
                    >
                      Previous
                    </button>

                    {/* <button
                      disabled={apiRequestQQ?.ModelName == ""}
                      onClick={() => toggleTab(activeTab + 1)}
                      class="btn btn-primary fs-2 px-5 py-3"
                    >
                      Next
                    </button> */}
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tabId={5}>
              <div class="mmvcard h-100 p-lg-5 p-4 pe-lg-0 pe-4">
                <div className="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-start">
                  <div className="d-flex justify-content-between align-items-center pe-lg-5 w-100 mt-lg-3 mt-5">
                    <p class="fs-3 fw-bold">Select Your Fuel Type?</p>
                  </div>

                  <div className="car-company d-flex flex-wrap justify-content-lg-start justify-content-center mt-5 gen-info">
                    {fuelTypes.includes("Petrol") && (
                      <>
                        <input
                          type="radio"
                          onClick={() => handleSelectPetrolType("Petrol")}
                          className="form-control d-none"
                          id={"rto11petrol"}
                          name="carComanY"
                        />
                        <label htmlFor={"rto11petrol"} className="shadow">
                          <span style={{ fontSize: 14 }}>Petrol</span>
                          {/* <i className="fas fa-check-circle text-success" /> */}
                        </label>
                      </>
                    )}
                    {fuelTypes.includes("Diesel") && (
                      <>
                        <input
                          type="radio"
                          onClick={() => handleSelectPetrolType("Diesel")}
                          className="form-control d-none"
                          id={"rto11diesal"}
                          name="carComanY"
                        />
                        <label htmlFor={"rto11diesal"} className="shadow">
                          <span style={{ fontSize: 14 }}>Diesel</span>
                          {/* <i className="fas fa-check-circle text-success" /> */}
                        </label>
                      </>
                    )}
                    {fuelTypes.includes("Battery") && (
                      <>
                        <input
                          type="radio"
                          onClick={() => handleSelectPetrolType("Battery")}
                          className="form-control d-none"
                          id={"rto11ele"}
                          name="carComanY"
                        />
                        <label htmlFor={"rto11ele"} className="shadow">
                          <span style={{ fontSize: 14 }}>Electric</span>
                          {/* <i className="fas fa-check-circle text-success" /> */}
                        </label>
                      </>
                    )}
                    {fuelTypes.includes("CNG") && (
                      <>
                        <input
                          type="radio"
                          onClick={() => handleSelectPetrolType("CNG")}
                          className="form-control d-none"
                          id={"rto11cng"}
                          name="carComanY"
                        />
                        <label htmlFor={"rto11cng"} className="shadow">
                          <span style={{ fontSize: 14 }}>CNG</span>
                        </label>
                      </>
                    )}
                    {fuelTypes.includes("LPG") && (
                      <>
                        <input
                          type="radio"
                          onClick={() => handleSelectPetrolType("LPG")}
                          className="form-control d-none"
                          id={"rto11lpg"}
                          name="carComanY"
                        />
                        <label htmlFor={"rto11lpg"} className="shadow">
                          <span style={{ fontSize: 14 }}>LPG</span>
                        </label>
                      </>
                    )}
                    {/* <div class="form-floating m-0">
                      <input type="text" class="form-control rounded-0" id="searchinput" placeholder="Search Here" />

                      <label for="searchinput" class="w-auto d-block">
                        Enter KIt Number
                      </label>
                    </div> */}
                  </div>
                  <div class="form-btns d-flex justify-content-between align-items-center pe-lg-5 mt-lg-auto w-100 mb-lg-0 mt-5 mb-3">
                    <button
                      onClick={() => toggleTab(activeTab - 1)}
                      class="btn btn-primary"
                    >
                      Previous
                    </button>

                    {/* <button
                      disabled={apiRequestQQ?.fuelTypes == ""}
                      onClick={() => toggleTab(activeTab + 1)}
                      class="btn btn-primary fs-2 px-5 py-3"
                    >
                      Next
                    </button> */}
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tabId={6}>
              <div class="mmvcard h-100 p-lg-5 p-4 pe-lg-0 pe-4">
                <div className="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-start">
                  <div className="d-flex justify-content-between align-items-center pe-lg-5 w-100 mt-lg-3 mt-5">
                    <p class="fs-3 fw-bold">Search varient</p>
                  </div>

                  <div class="input-group mb-3 w-50">
                    {/* <span
                      class="input-group-text border-end-0 fs-3 px-3 rounded-0"
                      id="basic-addon1"
                    >
                      <i class="fas fa-search"></i>
                    </span> */}

                    <div class="form-floating">
                      <ReactSelect
                        options={variantData.filter(
                          (item) => item.Fuel_Type == apiRequestQQ.FuelType
                        )}
                        name="model"
                        placeholder="Select vehicle varient"
                        onChange={(val) => handleSelectVariant(val)}
                      />
                    </div>
                  </div>

                  <div className="car-company d-flex flex-wrap justify-content-lg-start justify-content-center mt-5 gen-info">
                    {/*----- input form car select -----*/}
                    {variantData &&
                      variantData.length > 0 &&
                      variantData
                        .filter(
                          (item) => item.Fuel_Type == apiRequestQQ.FuelType
                        )
                        .slice(0, 20)
                        .map((item, index) => (
                          <>
                            <input
                              type="radio"
                              className="form-control d-none"
                              id={"rot12" + index}
                              name="carComanY11"
                            />
                            <label
                              htmlFor={"rot12" + index}
                              onClick={() => handleSelectVariant(item)}
                              value={item.value}
                              className="shadow"
                            >
                              <span style={{ fontSize: 13 }}>{item.label}</span>
                              {/* <i className="fas fa-check-circle text-success" /> */}
                            </label>
                          </>
                        ))}
                  </div>
                  <div class="form-btns d-flex justify-content-between align-items-center pe-lg-5 mt-lg-auto w-100 mb-lg-0 mt-5 mb-3">
                    <button
                      onClick={() => toggleTab(activeTab - 1)}
                      class="btn btn-primary"
                    >
                      Previous
                    </button>

                    {/* <button
                      disabled={apiRequestQQ?.VariantName == ""}
                      onClick={() => toggleTab(activeTab + 1)}
                      class="btn btn-primary fs-2 px-5 py-3"
                    >
                      Next
                    </button> */}
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tabId={7}>
              <div class="mmvcard h-100 p-lg-5 p-4 pe-lg-0 pe-4">
                <div className="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-start">
                  <div className="d-flex justify-content-between align-items-center pe-lg-5 w-100 mt-lg-3 mt-5">
                    <p class="fs-3 fw-bold">Search Vehicle Reg. Year?</p>
                  </div>

                  <div className="car-company d-flex flex-wrap justify-content-lg-start justify-content-center mt-5 gen-info">
                    {/*----- input form car select -----*/}

                    {generateArrayOfYears()
                      .filter((item, i) => {
                        if (isNewVehicle === true) {
                          return i < 1;
                        } else {
                          return i > 0;
                        }
                      })
                      .map((item, index) => (
                        <>
                          <input
                            type="radio"
                            className="form-control d-none"
                            onClick={() => selectVehicleYear(item)}
                            value={item}
                            id={"yrr" + index}
                            name="CArYear"
                          />
                          <label htmlFor={"yrr" + index} className="shadow">
                            <spa style={{ fontSize: 14 }} n>
                              {item}
                            </spa>
                            {/* <i className="fas fa-check-circle text-success" /> */}
                          </label>
                        </>
                      ))}
                  </div>
                  <div class="form-btns d-flex justify-content-between align-items-center pe-lg-5 mt-lg-auto w-100 mb-lg-0 mt-5 mb-3">
                    <button
                      onClick={() => toggleTab(activeTab - 1)}
                      class="btn btn-primary"
                    >
                      Previous
                    </button>

                    {/* <button
                      disabled={apiRequestQQ?.RegistrationYear == ""}
                      onClick={() => toggleTab(activeTab + 1)}
                      class="btn btn-primary fs-2 px-5 py-3"
                    >
                      Next
                    </button> */}
                  </div>
                </div>
              </div>
            </TabPane>

            {/* <TabPane tabId={8}>
              <form onSubmit={handleSubmit(submitUserDetails)}>
                <div class="mmvcard h-100 fineladdition">
                  <div className="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-center">
                    <div className="row mx-0 px-0 text-center justify-content-between align-items-center h-100 w-100">
                      <div class="col-lg-5 col-12 ps-lg-0">
                        <div class="mmvcard__img">
                          <img src="https://flaskitsolutions.com/assets/images/insuasperreqcar.png" class="w-100 carmodalimg ps-lg-5" alt="" />
                        </div>
                      </div>

                      <div className="col-lg-7 col-12">
                        <div className="container-fluid p-lg-5">
                          <aside class="title text-start mt-lg-0 mt-3">
                            <span class="herotitle mb-0">"Fill Your Personal Details"</span>
                          </aside>

                          <p class="fs-2 m-0 text-start">(Just one more step for your prefered quote)</p>

                          <div className="vehicleInputs mt-5 mb-lg-0 mb-5">
                            <div className="form-floating text-start">
                              <input
                                type="text"
                                className="form-control"
                                {...register("fullname")}
                                id="mname"
                                placeholder="Enter Name"
                              />
                              <label htmlFor="mname">Enter First Name</label>

                            </div>

                            <div className="form-floating text-start my-5">
                              <input
                                type="text"
                                {...register("Email", {
                                  required: "Email is required",
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "Invalid email address",
                                  },
                                })}
                                className="form-control"
                                id="emailuser"
                                placeholder="Enter Name"
                              />
                              <label htmlFor="emailuser">Enter Email</label>


                              <p className="m-0 f-error">{errors?.Email?.message}</p>
                            </div>
                            <div className="form-floating text-start">
                              <input
                                type="text"
                                {...register("MobileNumber", {
                                  required: "Mobile is required",
                                  pattern: {
                                    value: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                    message: "Invalid Mobile Number",
                                  },
                                })}
                                className="form-control mt-5"
                                id="mmobie"
                                placeholder="Mobile Number"
                                maxLength="10"
                              />
                              <label htmlFor="mmobie">Mobile Number</label>
                              <p className="m-0 f-error">{errors?.MobileNumber?.message}</p>
                            </div>

                            <div className="form-group form-check d-block position-relative  mt-5 mb-4 text-start">
                              <input type="checkbox" className="form-check-input d-none" id="day" />
                              <label className="form-check-label ps-4 checkboxlabel mt-2 fs-3" htmlFor="day">
                                Check this to accept
                                <Link to={"/privacyandcondition"} href="#" className="mx-2 fw-bold d-inline-block">
                                  terms and conditions
                                </Link>
                                and
                                <Link to={"/privacyandcondition"} href="#" className="mx-2 fw-bold d-inline-block">
                                  privacy policy
                                </Link>
                              </label>
                            </div>

                            <div className="text-start mt-5">
                              <button
                                type="submit"
                                className="btn btn-primary get-quotebtn d-inline-flex position-relative px-5 py-3 text-start fs-3"
                              >
                                Get Your Quote
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </TabPane> */}

            <TabPane tabId={8}>
              {activeTab === 8 && (
                <div class="mmvcard h-100 p-lg-5 p-4 pe-lg-0 pe-4">
                  <div className="mmvcard__content h-100 d-flex flex-column justify-content-between align-items-start">
                    <div className="d-flex justify-content-between align-items-center pe-lg-5 w-100 mt-lg-3 mt-5">
                      <p class="fs-sm-1 fs-2 fw-bold">
                        Fill Vehicle and Previous policy details
                      </p>
                    </div>

                    <QuotePolicyDetails
                      regYear={regYear}
                      isNewVehicle={isNewVehicle}
                      insurerData={insurerData}
                      submitPolicyDetails={(data) => submitPolicyDetails(data)}
                    />
                  </div>
                </div>
              )}
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>
    </>
  );
};

export default HomeSection;

const checkIfDateIsIn3Month = (dateToCheck) => {
  console.log("check to date", moment().diff(dateToCheck, "days"));
  return (
    moment().diff(dateToCheck, "days") > -90 &&
    moment().diff(dateToCheck, "days") <= 0
  );
};
