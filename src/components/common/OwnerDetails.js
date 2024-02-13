import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GetData } from "../../api/apiHelper";
import { addressLine, ownerDetailInput } from "./InputData/InsuranceInputData";
import SelectList from "./InputData/SelectList";
import InputField from "./Tags/InputField";

const OwnerDetails = ({ finalOwnerData, toggleTab, allData }) => {
  const [pincode, setPincode] = useState(null);
  console.log("all data", allData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (allData !== null) {
      reset({
        city: allData?.customer?.city,
        state: allData?.customer?.state,
        first_name: allData?.customer?.first_name,
        last_name: allData?.customer?.last_name,
        email: allData?.customer?.email,
        phone: allData?.customer?.phone,
        dob: allData?.customer?.dob,
        // pan_card: allData?.customer?.pan_card,
        // aadhar_card: allData?.customer?.aadhar_card,
        address_line1: allData?.customer?.address_line1,
        address_line2: allData?.customer?.address_line2,
        address_line3: allData?.customer?.address_line3,
      });
      setPincode(allData?.customer?.pincode);
    }
  }, []);

  const submitOwnerDetail = (data) => {
    console.log("first", data);
    toggleTab("5");
    finalOwnerData({ ...data, pincode });
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

  const handleSetValue = (e) => {
    setPincode(e);
  };

  return (
    <>
      <div className="card p-4 mt-3">
        <form onSubmit={handleSubmit(submitOwnerDetail)}>
          <small className="fw-bold fs-3">Owner Details</small>
          <div className="othervoption mt-3">
            <div className="row mx-0 px-0">
              <div className="col-12" />
              {ownerDetailInput &&
                ownerDetailInput.length > 0 &&
                ownerDetailInput.map((item, index) => {
                  if (item.type === "text" || item.type === "date" || item.type === "number" || item.type === "email") {
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
            </div>
          </div>
          <small className="fw-bold fs-3">Address On RC</small>
          <div className="othervoption mt-3">
            <div className="row mx-0 px-0">
              {addressLine &&
                addressLine.length > 0 &&
                addressLine.map((item, index) => {
                  if (item.type === "text" || item.type === "date" || item.type === "number") {
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

              <div className="col-lg-4 col-12 ps-lg-0">
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
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
                <span className="text-danger">{errors?.pincode?.message}</span>
              </div>

              <div className="col-lg-4 col-12">
                <div className="position-relative">
                  <div className="form-floating inother">
                    <input
                      type="text"
                      className="form-control"
                      id="Cusname"
                      {...register("city", {
                        required: "Field is required",
                      })}
                      placeholder=" Enter City"
                    />
                    <label htmlFor="Cusname">
                      City
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
                <span className="text-danger">{errors?.city?.message}</span>
              </div>

              <div className="col-lg-4 col-12 pe-lg-0">
                <div className="position-relative">
                  <div className="form-floating inother">
                    <input
                      type="text"
                      className="form-control"
                      id="Cusname"
                      {...register("state", {
                        required: "Field is required",
                      })}
                      placeholder=" Enter State"
                    />
                    <label htmlFor="Cusname">
                      State
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
                <span className="text-danger">{errors?.state?.message}</span>
              </div>
            </div>

            <div className="col-lg-3 col-12 ps-lg-0">
              <button type="submit" className="btn btn-primary mt-5 mt-3 fs-2 py-3 w-50">
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default OwnerDetails;
