import React, { useEffect, useState } from "react";
import {
  addressLine,
  NomineeInput,
  ownerDetailInput,
  personalDetailInput,
  POSPolicyInputs,
  PreferPolicyDetails,
} from "./InputData/InsuranceInputData";
import InputField from "./Tags/InputField";
import { useForm } from "react-hook-form";
import SelectList from "./InputData/SelectList";
import { GetData, PostData, PostDataWithToken } from "../../api/apiHelper";
import { MultiSelect } from "react-multi-select-component";
import { sendErrorMessage } from "../services/userServices";
// import { Helmet } from 'react-helmet'

const BasicDetails = ({ finalData, toggleTab, allData }) => {
  // console.log("allSingleData",allData)
  const [vehicle_make, setMake] = useState("");
  const [allRtoCode, setAllRtoCode] = useState([]);
  const [vehicle_type, setVehicle_type] = useState("");

  const [vehicle_model, setVehicle_model] = useState("");

  const [vehicleMake, setVehicleMake] = useState([]);
  const [vehicleModal, setVehicleModal] = useState([]);
  const [vehicleVariant, setVehiclVariant] = useState([]);
  const [allAddons, setAllAddons] = useState([]);
  const [allCompany, setAllCompany] = useState([]);
  const [requiredAddon, setRequiredAddon] = useState([]);
  const [preferedInc, setPreferedInc] = useState([]);
  const [pincode, setPincode] = useState(null);
  const [nomineeRelaton, setNomineeRelaton] = useState([]);
  const [gaskitStatus, setGaskitStatus] = useState(null);
  const [gaskitInstalled, setGaskitInstalled] = useState(null);
  const [fuel_type, setfuel_type] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ mode: "onBlur" });

  // const gasKit = watch("gaskit_installed")
  // const fuelCheck = watch("fuel_type");
  // const gasKitStatus = watch("gaskit_status")

  // console.log("bbbbbbbbbbbbbbb", gasKit, vvvv)

  useEffect(() => {
    if (allData !== undefined) {
      reset({
        rto: allData?.customer?.motorInsurance?.rto,
        vehicle_variant: allData?.customer?.motorInsurance?.vehicle_variant,
        fuel_type: allData?.customer?.motorInsurance?.fuel_type,
        case_type: allData?.customer?.motorInsurance?.case_type,
        policy_type: allData?.customer?.motorInsurance?.policy_type,
        vehicle_no: allData?.customer?.motorInsurance?.vehicle_no,
        registration_date: allData?.customer?.motorInsurance?.registration_date,
        vehicle_mfg_yr: allData?.customer?.motorInsurance?.vehicle_mfg_yr,
        gaskit_installed: allData?.customer?.motorInsurance?.gaskit_installed,
        gaskit_status: allData?.customer?.motorInsurance?.gaskit_status,
        // gaskit_outside: allData?.customer?.motorInsurance?.gaskit_outside,
        reason: allData?.customer?.motorInsurance?.reason,
        remark: allData?.customer?.motorInsurance?.remarks,
        require_idv: allData?.customer?.motorInsurance?.require_idv,
        require_discount: allData?.customer?.motorInsurance?.require_discount,
        expected_final_premium:
          allData?.customer?.motorInsurance?.expected_final_premium,
        city: allData?.customer?.city,
        state: allData?.customer?.state,
        first_name: `${allData?.customer?.first_name}' '${allData?.customer?.last_name}`,
        // last_name: allData?.customer?.last_name,
        email: allData?.customer?.email,
        phone: allData?.customer?.phone,
        dob: allData?.customer?.dob,
        address_line1: allData?.customer?.address_line1,
        // address_line2: allData?.customer?.address_line2,
        // address_line3: allData?.customer?.address_line3,
        // gender: allData?.customer?.gender,
        // marital_status: allData?.customer?.marital_status,
        // occupation: allData?.customer?.occupation,
        nominee_name: allData?.customer?.nominee_name,
        nominee_relation: allData?.customer?.nominee_relation,
        nominee_age: allData?.customer?.nominee_age,
      });
      let reqaddon =
        allData?.customer?.motorInsurance?.required_add_on.split(",");
      let preCompany =
        allData?.customer?.motorInsurance?.required_insurance_company.split(
          ","
        );
      let reqAddon = [];
      let preInc = [];
      setfuel_type(allData?.customer?.motorInsurance?.fuel_type);
      setGaskitInstalled(allData?.customer?.motorInsurance?.gaskit_installed);
      setGaskitStatus(allData?.customer?.motorInsurance?.gaskit_status);
      setVehicle_type(allData?.customer?.motorInsurance?.vehicle_type);
      setMake(allData?.customer?.motorInsurance?.vehicle_make);
      setVehicle_model(allData?.customer?.motorInsurance?.vehicle_model);
      setPincode(allData?.customer?.pincode);
      getMake2(allData?.customer?.motorInsurance?.vehicle_type);
      getModal2(allData?.customer?.motorInsurance?.vehicle_make);
      getVariant2(allData?.customer?.motorInsurance?.vehicle_model);

      reqaddon?.map((item) => {
        reqAddon.push({
          label: item,
          value: item,
        });
      });
      setRequiredAddon(reqAddon);
      preCompany?.map((item) => {
        preInc.push({
          label: item,
          value: item,
        });
      });
      setPreferedInc(preInc);
    }
  }, [""]);

  const getMake2 = (e) => {
    setVehicle_type(e);
    let data = {
      Vehicle_Type: e,
    };
    PostData(`motor/make`, data).then((response) => {
      if (response.status == true) {
        console.log("first", response.data);
        setVehicleMake(response.data);
      }
    });
  };

  const getModal2 = (e) => {
    setMake(e);
    let data = {
      Vehicle_Type: allData?.customer?.motorInsurance?.vehicle_type,
      make: e,
    };
    PostData(`motor/model`, data).then((response) => {
      if (response.status == true) {
        console.log("first 2", response.data);
        setVehicleModal(response.data);
        setVehicle_model(allData?.customer?.motorInsurance?.vehicle_model);
      }
    });
  };
  const getVariant2 = (e) => {
    setVehicle_model(e);
    let data = {
      Vehicle_Type: allData?.customer?.motorInsurance?.vehicle_type,
      make: allData?.customer?.motorInsurance?.vehicle_make,
      model: e,
    };
    PostData(`motor/variant`, data).then((response) => {
      if (response.status == true) {
        console.log("first 3", response.data);
        setVehiclVariant(response.data);
        reset({
          vehicle_variant: allData?.customer?.motorInsurance?.vehicle_variant,
        });
      }
    });
  };

  useEffect(() => {
    if (pincode?.length >= 6) {
      GetData(`pos/get-city?pincode=${pincode}`, "").then((response) => {
        if (response.status == true) {
          console.log("first fgfhfdsdf", response.data.City);
          reset({
            city: response?.data?.City,
            state: response?.data?.State,
          });
        }
      });
    }
  }, [pincode]);

  const submitInsurance = (data) => {
    let reqAddon = [];
    let preInc = [];
    let firstName = data.first_name?.split(" ");

    requiredAddon.map((item) => {
      reqAddon.push(item.value);
    });
    preferedInc.map((item) => {
      preInc.push(item.value);
    });
    console.log("fin all", {
      ...data,
      vehicle_make,
      vehicle_no: data.vehicle_no.toUpperCase(),
    });

    const Data = {
      leadType: 2,
      vehicle_no: data.vehicle_no.toUpperCase(),
      policy_no: data.policy_no,
    };

    PostDataWithToken("pos/check-policy", Data).then((response) => {
      if (response.status == true) {
        toggleTab("2");
        finalData({
          ...data,
          required_insurance_company: preInc.toString(),
          pincode,
          first_name: firstName?.[0],
          last_name: firstName?.[1],
          required_add_on: reqAddon.toString(),
          vehicle_make,
          vehicle_type,
          vehicle_model,
          vehicle_no: data.vehicle_no.toUpperCase(),
          gaskit_installed: gaskitInstalled,
          gaskit_status: gaskitStatus,
          fuel_type: fuel_type,
        });
      } else {
        sendErrorMessage(response);
      }
    });
  };

  const handleSetValue = (e) => {
    setPincode(e);
  };

  const getMake = (e) => {
    setVehicle_type(e);
    let data = {
      Vehicle_Type: e,
    };
    PostData(`motor/make`, data).then((response) => {
      if (response.status == true) {
        console.log("first", response.data);
        setVehicleMake(response.data);
      }
    });
  };

  useEffect(() => {
    GetData(`pos/get-rto`, "").then((response) => {
      if (response.status == true) {
        // console.log("first rto", response.data)
        setAllRtoCode(response.data);
        setTimeout(() => {
          reset({
            rto: allData?.customer?.motorInsurance?.rto,
          });
        }, 1000);
      }
    });

    GetData("pos/get-nominee", "").then((response) => {
      if (response.status == true) {
        console.log("nkkdk", response.data);
        setNomineeRelaton(response.data);
        setTimeout(() => {
          reset({
            nominee_relation: allData?.customer?.nominee_relation,
          });
        }, 1000);
      }
    });

    GetData("pos/addons", "").then((response) => {
      if (response.status == true) {
        console.log("jkhdkhd", response.data);
        let arr = [];
        response.data.map((item) => {
          arr.push({
            label: item.addons,
            value: item.addons,
          });
        });
        setAllAddons(arr);
      }
    });

    GetData(`pos/get-company`, "").then((response) => {
      if (response.status == true) {
        console.log("first rto", response.data);
        let arr = [];
        response.data.map((item) => {
          arr.push({
            label: item.name,
            value: item.name,
          });
        });
        setAllCompany(arr);
        reset({
          previous_policy_insurance_company:
            allData?.customer?.motorInsurance
              ?.previous_policy_insurance_company,
        });
      }
    });
  }, [""]);

  const getModal = (e) => {
    setMake(e);
    let data = {
      Vehicle_Type: vehicle_type,
      make: e,
    };
    PostData(`motor/model`, data).then((response) => {
      if (response.status == true) {
        console.log("first 2", response.data);
        setVehicleModal(response.data);
        setVehicle_model(allData?.customer?.motorInsurance?.vehicle_model);
      }
    });
  };

  const getVariant = (e) => {
    setVehicle_model(e);
    let data = {
      Vehicle_Type: vehicle_type,
      make: vehicle_make,
      model: e,
    };
    PostData(`motor/variant`, data).then((response) => {
      if (response.status == true) {
        console.log("first 3", response.data);
        setVehiclVariant(response.data);
        reset({
          vehicle_variant: allData?.customer?.motorInsurance?.vehicle_variant,
        });
      }
    });
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

  const handlerto = (e) => {
    // console.log("fddd", value.slice(0, 4))

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

    if (e.target.value.length > 3) {
      console.log("fgdgfd", e.target.value.slice(0, 4).toUpperCase());

      let fvalue = e.target.value.slice(0, 2).toUpperCase();
      let lvalue = e.target.value.slice(3, 5).toUpperCase();
      console.log("first", fvalue, lvalue);
      reset({
        rto: fvalue + lvalue,
      });
    }
  };

  return (
    <>
      <script>
        {`
             $(function () {
              $("#make9").select2();
          });
  
          `}
        {`
             $(function () {
              $("#modal').select2();
          });
  
          `}
        {`
             $(function () {
              $('#variant').select2();
          });
  
          `}
        {`
             $(function () {
              $('#fuel').select2();
          });
          `}
        {`
             $(function () {
              $('#Vehi').select2();
          });
          `}
      </script>
      <div className="card p-4 mt-3">
        <p className="fs-3 fw-bold mb-4">Basic Details</p>
        <div className="othervoption">
          <form onSubmit={handleSubmit(submitInsurance)}>
            <div className="row mx-0 px-0">
              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    {...register("vehicle_no", {
                      required: "This Field is required",
                      pattern: {
                        value:
                          /^[A-Z|a-z]{2}\-?[0-9]{1,2}\-?[A-Z|a-z]{0,3}\-?[0-9]{4}$/,
                        message: "Incorrect registration numner",
                      },
                      onChange: (e) => handlerto(e),
                    })}
                    className="form-control text-uppercase"
                    id="vinpuut"
                    placeholder="Enter Vehicle Registration Number"
                  />
                  <label htmlFor="vinpuut">
                    Enter Vehicle Registration Number
                    <span className="text-danger">*</span>
                  </label>

                  <p className="mb-0 f-error">{errors?.vehicle_no?.message}</p>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      style={{ paddingLeft: "13px" }}
                      value={vehicle_type}
                      id="Vehi"
                      onChange={(e) => getMake(e.target.value)}
                    >
                      <option className="d-none" value="">
                        Select Vehicle type
                      </option>
                      <option value={"Pvt Car"}>Pvt Car</option>
                      <option value="MotorBike">MotorBike</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Passenger Carrying">
                        Passenger Carrying
                      </option>
                      <option value="Goods Carrying">Goods Carrying</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                      <option value="Trailer">Trailer</option>
                    </select>
                    {/* <label htmlFor="Vehi" className="floatinglabel">
											Vehicle type
											<span className="mb-0 f-error">*</span>
										</label> */}

                    {/* <p className="mb-0 f-error">{errors?.vehicle_type?.message}</p> */}
                  </div>
                  {/* {vehicletypeError == true && <span className="mb-0 f-error">This Field is required</span>} */}
                </div>
              </div>

              {POSPolicyInputs &&
                POSPolicyInputs.length > 0 &&
                POSPolicyInputs.map((item, index) => {
                  if (
                    item.type === "text" ||
                    item.type === "date" ||
                    item.type === "number"
                  ) {
                    return (
                      <>
                        {/* {console.log("class333===", item)} */}
                        <InputField
                          label={item.option}
                          showclass={item.customprop}
                          type={item.type}
                          id={"policy" + index}
                          placeholder={item.placeholder}
                          name={item.name}
                          register={register(`${item.name}`, item.validation)}
                          error={errors[item.name]?.message}
                        />
                      </>
                    );
                  } else if (item.type === "select") {
                    return (
                      <>
                        {/* {console.log("class333===", item.customprop)} */}
                        <SelectList
                          id={"sel" + index}
                          showclass={item.customprop}
                          option={item.data}
                          label={item.option}
                          name={item.name}
                          placeholder={item.placeholder}
                          error={errors[item.name]?.message}
                          register={register(item.name, item.validation)}
                        />
                      </>
                    );
                  }
                })}

              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      style={{ paddingLeft: "13px" }}
                      className="form-select"
                      id="Make9"
                      value={vehicle_make}
                      onChange={(e) => getModal(e.target.value)}
                    >
                      <option className="d-none" value="">
                        Select Make
                      </option>
                      {vehicleMake &&
                        vehicleMake.length > 0 &&
                        vehicleMake.map((item, index) => (
                          <option key={index} value={item.Make}>
                            {item.Make}
                          </option>
                        ))}
                    </select>
                    {/* <label htmlFor="Make9" className="floatinglabel">
											Make
											
										</label> */}

                    {/* <p className="mb-0 f-error">{errors?.vehicle_make?.message}</p> */}
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      style={{ paddingLeft: "13px" }}
                      className="form-select"
                      id="modal"
                      value={vehicle_model}
                      onChange={(e) => getVariant(e.target.value)}
                    >
                      <option className="d-none" value="">
                        Select Model
                      </option>
                      {vehicleModal &&
                        vehicleModal.length > 0 &&
                        vehicleModal.map((item, index) => (
                          <option key={index} value={item.Model}>
                            {item.Model}
                          </option>
                        ))}
                    </select>

                    {/* <label htmlFor="modal" className="floatinglabel">
											Model
											
										</label> */}

                    {/* <p className="mb-0 f-error">{errors?.vehicle_model?.message}</p> */}
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      style={{ paddingLeft: "13px" }}
                      className="form-select"
                      id="variant"
                      {...register("vehicle_variant", {
                        // required: "Field is required",
                      })}
                    >
                      <option className="d-none" value="">
                        Select Variant
                      </option>
                      {vehicleVariant &&
                        vehicleVariant.length > 0 &&
                        vehicleVariant.map((item, index) => (
                          <option key={index} value={item.Variant}>
                            {item.Variant}
                          </option>
                        ))}
                    </select>

                    {/* <label htmlFor="variant" className="floatinglabel">
											Variant
											
										</label> */}
                    <span className="mb-0 f-error">
                      {errors?.vehicle_variant?.message}
                    </span>
                    {/* <p className="mb-0 f-error">{errors?.vehicle_variant?.message}</p> */}
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      style={{ paddingLeft: "13px" }}
                      className="form-select"
                      id="RTO"
                      {...register("rto", {
                        // required: "Field is required",
                      })}
                    >
                      <option className="d-none" value="">
                        Select RTO City
                      </option>
                      {allRtoCode &&
                        allRtoCode.length > 0 &&
                        allRtoCode.map((item, key) => (
                          <option value={item?.RTO_Code}>
                            {item?.registered_city_name} ({item?.RTO_Code})
                          </option>
                        ))}
                    </select>
                    {/* <label htmlFor="RTO" className="floatinglabel">
											RTO/city
										</label> */}
                  </div>
                  <span className="mb-0 f-error">{errors?.rto?.message}</span>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      style={{ paddingLeft: "13px" }}
                      className="form-select"
                      id="fuel"
                      onChange={(e) => setfuel_type(e.target.value)}
                      value={fuel_type}
                      // {...register("fuel_type", {
                      // 	// required: "Field is required",
                      // })}
                    >
                      <option className="d-none" value="">
                        Select Fuel type
                      </option>
                      <option value={"petrol"}>Petrol</option>
                      <option value={"diesel"}>Diesel</option>
                      <option value={"Battery"}>Battery</option>
                      {/* <option value={"CNG"}>CNG</option> */}
                      <option value={"Electric"}>Electric</option>
                      {/* <option value={"LPG"}>LPG</option> */}
                      <option value={"Petrol/CNG"}>Petrol/CNG</option>
                      <option value={"Petrol/LPG"}>Petrol/LPG</option>
                    </select>

                    {/* className={gasKit == "CNG" || gasKit == "LPG" ? "d-none" : ""}  */}

                    {/* <label htmlFor="fuel" className="floatinglabel">
											Fuel type
											
										</label> */}
                  </div>
                  <span className="mb-0 f-error">
                    {errors?.fuel_type?.message}
                  </span>
                </div>
              </div>

              {fuel_type == "Petrol/CNG" || fuel_type == "Petrol/LPG" ? (
                <div className="col-xl-3 col-lg-4 col-md-6 col-12 col-12">
                  <div className="position-relative mb-3">
                    <div className="form-floating">
                      <select
                        style={{ paddingLeft: "13px" }}
                        className="form-select"
                        id="gaskitIns"
                        value={gaskitInstalled}
                        // {...register("gaskit_installed", {
                        // 	// required: false,
                        // })}
                        onChange={(e) => setGaskitInstalled(e.target.value)}
                      >
                        <option className="d-none" value="">
                          Select Gaskit installed
                        </option>

                        <option value={"CNG/Inbuilt"}>CNG/Inbuilt</option>
                        <option value={"CNG/OutSide"}>CNG/OutSide</option>
                        <option value={"LPG/Inbuilt"}>LPG/Inbuilt</option>
                        <option value={"LPG/OutSide"}>LPG/OutSide</option>
                      </select>
                      {/* <label htmlFor="gaskitIns" className="floatinglabel">
												Gaskit installed
											</label> */}
                    </div>
                    {/* <span className="mb-0 f-error">{errors?.gaskit_installed?.message}</span> */}
                  </div>
                </div>
              ) : (
                <></>
              )}

              {gaskitInstalled == "CNG/OutSide" ||
              gaskitInstalled == "LPG/OutSide" ? (
                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      value={gaskitStatus}
                      // {...register("gaskit_status", {

                      // 	// required: gasKit == "CNG/OutSide" || gasKit == "LPG/OutSide" ? "This Field is required" : false,
                      // })}
                      onChange={(e) => setGaskitStatus(e.target.value)}
                      className="form-control"
                      style={{ paddingBottom: "0px", paddingLeft: "13px" }}
                      // maxLength={10}
                      id="gaskit_status"
                      placeholder="Enter Gaskit company name"
                    />
                    {/* <label htmlFor="gaskit_status">
											Enter Gaskit No
											
										</label> */}
                    {/* <p className="mb-0 f-error">{errors?.gaskit_status?.message}</p> */}
                  </div>
                </div>
              ) : (
                <></>
              )}

              {/* <div className="col-xl-3 col-lg-4 col-md-6 col-12 col-12">
								<div className="position-relative mb-5">
									<div className="form-floating">
										<select
											className="form-select"
											id="gaskit-out"
											{...register("gaskit_outside", {
												required: gasKitStatus == null || gasKitStatus == '' ? false : "This Field is required",
											})}
										>
											<option className="d-none" value="">
												Select Gaskit Installed Outside
											</option>

											<option value={"Yes"}>Yes</option>
											<option value={"No"}>No</option>


										</select>
										<label htmlFor="gaskit-out" className="floatinglabel">
											Gaskit installed Outside
										</label>
									</div>
									<span className="mb-0 f-error">{errors?.gaskit_outside?.message}</span>
								</div>
							</div> */}

              <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      style={{ paddingLeft: "13px" }}
                      className="form-select"
                      id="reason"
                      {...register("reason", {
                        // required: 'This field is required',
                      })}
                    >
                      <option className="d-none" value="">
                        Select Prefered Reason
                      </option>
                      <option>High IDV</option>
                      <option>Discount Not Avaiable</option>
                      <option>Reason 1</option>
                      <option>Reason</option>
                    </select>
                    {/* <label htmlFor="reason">
											Reason for offline quote
											
										</label> */}

                    <span className="mb-0 f-error">
                      {errors?.reason?.message}
                    </span>
                  </div>
                </div>
              </div>
              {ownerDetailInput &&
                ownerDetailInput.length > 0 &&
                ownerDetailInput.map((item, index) => {
                  if (
                    item.type === "text" ||
                    item.type === "date" ||
                    item.type === "number" ||
                    item.type === "email"
                  ) {
                    return (
                      <>
                        <InputField
                          label={item.option}
                          showclass={item.customprop}
                          type={item.type}
                          id={"policy" + index}
                          placeholder={item.placeholder}
                          name={item.name}
                          register={register(`${item.name}`, item.validation)}
                          error={errors[item.name]?.message}
                        />
                      </>
                    );
                  } else if (item.type === "select") {
                    return (
                      <>
                        <SelectList
                          id={"sel" + index}
                          showclass={item.customprop}
                          option={item.data}
                          label={item.option}
                          name={item.name}
                          placeholder={item.placeholder}
                          error={errors[item.name]?.message}
                          register={register(item.name, item.validation)}
                        />
                      </>
                    );
                  }
                })}
              {addressLine &&
                addressLine.length > 0 &&
                addressLine.map((item, index) => {
                  if (
                    item.type === "text" ||
                    item.type === "date" ||
                    item.type === "number"
                  ) {
                    return (
                      <>
                        <InputField
                          label={item.option}
                          showclass={item.customprop}
                          type={item.type}
                          id={"policy" + index}
                          placeholder={item.placeholder}
                          name={item.name}
                          register={register(`${item.name}`, item.validation)}
                          error={errors[item.name]?.message}
                        />
                      </>
                    );
                  } else if (item.type === "select") {
                    return (
                      <>
                        <SelectList
                          id={"sel" + index}
                          showclass={item.customprop}
                          option={item.data}
                          label={item.option}
                          name={item.name}
                          placeholder={item.placeholder}
                          error={errors[item.name]?.message}
                          register={register(item.name, item.validation)}
                        />
                      </>
                    );
                  }
                })}

              <div className="col-xl-3 col-lg-4 col-md-6 col-12 col-12 mb-3">
                <div className="position-relative">
                  <div className="form-floating inother">
                    <input
                      type="number"
                      className="form-control"
                      value={pincode}
                      id="Cusname"
                      onChange={(e) => handleSetValue(e.target.value)}
                      placeholder=" Enter Customer Pincode"
                    />
                    <label htmlFor="Cusname">
                      Pincode
                      {/* <span className="text-danger">*</span> */}
                    </label>
                  </div>
                </div>
                <span className="text-danger">{errors?.pincode?.message}</span>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 col-12 col-12 mb-3">
                <div className="position-relative">
                  <div className="form-floating inother">
                    <input
                      type="text"
                      className="form-control"
                      id="Cusname"
                      {...register("city", {
                        // required: "Field is required",
                      })}
                      placeholder=" Enter City"
                    />
                    <label htmlFor="Cusname">
                      City
                      {/* <span className="text-danger">*</span> */}
                    </label>
                  </div>
                </div>
                <span className="text-danger">{errors?.city?.message}</span>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 col-12 col-12 mb-3">
                <div className="position-relative">
                  <div className="form-floating inother">
                    <input
                      type="text"
                      className="form-control"
                      id="Cusname"
                      {...register("state", {
                        // required: "Field is required",
                      })}
                      placeholder=" Enter State"
                    />
                    <label htmlFor="Cusname">
                      State
                      {/* <span className="text-danger">*</span> */}
                    </label>
                  </div>
                </div>
                <span className="text-danger">{errors?.state?.message}</span>
              </div>

              {NomineeInput &&
                NomineeInput.length > 0 &&
                NomineeInput.map((item, index) => {
                  if (
                    item.type === "text" ||
                    item.type === "date" ||
                    item.type === "number" ||
                    item.type === "email"
                  ) {
                    return (
                      <>
                        <InputField
                          label={item.option}
                          showclass={item.customprop}
                          type={item.type}
                          id={"policy" + index}
                          placeholder={item.placeholder}
                          name={item.name}
                          register={register(`${item.name}`, item.validation)}
                          error={errors[item.name]?.message}
                        />
                      </>
                    );
                  } else if (item.type === "select") {
                    return (
                      <>
                        <SelectList
                          id={"sel" + index}
                          showclass={item.customprop}
                          option={item.data}
                          label={item.option}
                          name={item.name}
                          placeholder={item.placeholder}
                          error={errors[item.name]?.message}
                          register={register(item.name, item.validation)}
                        />
                      </>
                    );
                  }
                })}

              <div className="col-xl-3 col-lg-4 col-md-6 col-12 col-12">
                <div className="position-relative mb-3">
                  <div className="form-floating">
                    <select
                      style={{ paddingLeft: "13px" }}
                      className="form-select"
                      {...register("nominee_relation", {
                        // required: "Field is required",
                      })}
                      id="insurer1"
                    >
                      <option className="d-none" value="">
                        Select Nominee relation
                      </option>
                      {nomineeRelaton &&
                        nomineeRelaton.length > 0 &&
                        nomineeRelaton.map((item, i) => (
                          <option value={item.relation} key={i}>
                            {item.relation}
                          </option>
                        ))}
                    </select>
                    {/* <label htmlFor="insurer1" className="floatinglabel">
											Nominee relation
										</label> */}
                  </div>
                  <span className="text-danger">
                    {errors?.nominee_relation?.message}
                  </span>
                </div>
              </div>

              {/* <div className="othervoption mt-3">
								<div className="row mx-0 px-0">

									{
										personalDetailInput && personalDetailInput.length > 0 && personalDetailInput.map((item, index) => {
											if (item.type === 'text' || item.type === "date" || item.type === "number" || item.type === 'email') {
												return <>
													<InputField label={item.option} showclass={item.customprop} type={item.type} id={"policy" + index} placeholder={item.placeholder} name={item.name} register={register(`${item.name}`, item.validation)}
														error={errors[item.name]?.message} />
												</>
											} else if (item.type === "select") {
												return <>
													<SelectList id={"sel" + index} showclass={item.customprop} option={item.data} label={item.option} name={item.name} placeholder={item.placeholder}
														error={errors[item.name]?.message} register={register(item.name, item.validation)}
													/>
												</>
											}

										})}

								</div>
							</div> */}

              <div className="col-12 mb-3">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    placeholder="Remark/Comments"
                    id="remark"
                    defaultValue={""}
                    {...register("remark", {
                      // required: false,
                    })}
                  />
                  <label htmlFor="remark">Remarks/Comments</label>
                </div>
              </div>

              <div className="othervoption mt-3">
                <div className="alert alert-primary  fade show mb-4">
                  <div className="row mx-0 px-0  align-items-center">
                    {PreferPolicyDetails &&
                      PreferPolicyDetails.length > 0 &&
                      PreferPolicyDetails.map((item, index) => {
                        if (
                          item.type === "text" ||
                          item.type === "date" ||
                          item.type === "number"
                        ) {
                          return (
                            <>
                              <InputField
                                label={item.option}
                                showclass={item.customprop}
                                type={item.type}
                                id={"policy" + index}
                                placeholder={item.placeholder}
                                name={item.name}
                                register={register(
                                  `${item.name}`,
                                  item.validation
                                )}
                                error={errors[item.name]?.message}
                              />
                            </>
                          );
                        } else if (item.type === "select") {
                          return (
                            <>
                              <SelectList
                                id={"sel" + index}
                                showclass={item.customprop}
                                option={item.data}
                                label={item.option}
                                name={item.name}
                                placeholder={item.placeholder}
                                error={errors[item.name]?.message}
                                register={register(item.name, item.validation)}
                              />
                            </>
                          );
                        }
                      })}

                    <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                      <div className=" mb-3 form-floating">
                        <MultiSelect
                          options={allCompany}
                          value={preferedInc}
                          onChange={setPreferedInc}
                          // labelledBy={"Select Previous addon"}
                          isCreatable={true}
                        />

                        <label htmlFor="modal" className="npm-lable">
                          Select Prefered Insurer
                          {/* <span className="text-danger">*</span> */}
                        </label>
                      </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                      <div className=" mb-3">
                        <div className="form-floating">
                          <MultiSelect
                            options={allAddons}
                            value={requiredAddon}
                            onChange={setRequiredAddon}
                            labelledBy={"Select Previous addon"}
                            isCreatable={true}
                          />

                          <label htmlFor="modal" className="npm-lable">
                            Select Prefered addon
                            {/* <span className="text-danger">*</span> */}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12" />

              <div
                className="col-lg-3 col-12 ps-lg-0 "
                style={{ marginLeft: "10px" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary mb-5 mt-3 fs-4 py-6 w-50"
                >
                  Next
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BasicDetails;
