import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { dispatchQuickQuote } from "../../../store/actions/userAction";
import { createCustomer } from "../../utility/TPApiCall";

const NomineeDetails = ({ activeTab, toggle }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);
  const submitNomineeDetails = (data) => {
    let postData = {
      name: apiRequestQQ.FirstName + " " + apiRequestQQ.LastName,
      email: apiRequestQQ.Email,
      phone: apiRequestQQ.MobileNumber,
      dob: apiRequestQQ.Dob,
      city: apiRequestQQ.City,
      state: apiRequestQQ.State,
      address: apiRequestQQ.StreetNumber + " " + apiRequestQQ.Street + " " + apiRequestQQ.Area,
      pincode: apiRequestQQ.Pincode,
      gender: apiRequestQQ.Gender,
      nominee_name: data.NomineeFirstName + " " + data.NomineeLastName,
      nominee_relation: data.NomineeRelationship,
      nominee_age: moment().diff(data.NomineeDateOfBirth, "years"),
    };
    if (apiRequestQQ.customerId) {
      postData.customerId = apiRequestQQ.customerId;
    }
    createCustomer(postData);
    if (apiRequestQQ.customerId) {
      postData.customerId = apiRequestQQ.customerId;
    }
    createCustomer(postData);
    for (let key in data) {
      dispatchQuickQuote(key, data[key]);
    }

    toggle(activeTab + 1);
  };
  return (
    <div className="card p-4 mt-3">
      <form onSubmit={handleSubmit(submitNomineeDetails)}>
        <p className="mb-0 fs-2 fw-bold">Nominee Details</p>
        <div className="othervoption mt-3">
          <div className="row mx-0 px-0">
            <div className="col-lg-4 ps-lg-0">
              <div className="position-relative mb-3">
                <div className="form-floating ">
                  <input
                    type="text"
                    {...register("NomineeFirstName", {
                      required: "First Name is required",
                    })}
                    className="form-control"
                    id="fsa1n"
                    placeholder=" Enter nominee name"
                  />
                  <label htmlFor="fsa1n">
                    Nominee First Name
                    <span className="text-danger">*</span>
                  </label>

                  <p className="f-error">{errors?.NomineeFirstName?.message}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="position-relative mb-3">
                <div className="form-floating ">
                  <input
                    type="text"
                    {...register("NomineeLastName", {
                      required: "Last Name is required",
                    })}
                    className="form-control"
                    id="fsa1op"
                    placeholder=" Enter nominee name"
                  />
                  <label htmlFor="fsa1op">
                    Nominee Last Name
                    <span className="text-danger">*</span>
                  </label>
                </div>

                <p className="f-error">{errors?.NomineeLastName?.message}</p>
              </div>
            </div>

            <div className="col-lg-4 pe-lg-0">
              <div className="position-relative mb-3">
                <div className="form-floating ">
                  <input
                    type="date"
                    {...register("NomineeDateOfBirth", {
                      required: "Date of Birth is required",
                    })}
                    max={moment().subtract("18", "year").format("YYYY-MM-DD")}
                    className="form-control"
                    id="fsa2dob"
                    placeholder="Enter nominee age"
                  />
                  <label htmlFor="fsa2dob">
                    Enter Nominee DOB
                    <span className="text-danger">*</span>
                  </label>
                </div>

                <p className="f-error">{errors?.NomineeDateOfBirth?.message}</p>
              </div>
            </div>

            <div className="col-lg-4 ps-lg-0">
              <div className="position-relative mb-3">
                <div className="form-floating">
                  <select className="form-select" id="casetype1as" style={{paddingTop:0, paddingTop:25, height:'calc(2.8rem + 10px)', border: '1px solid lightgray'}}>
                    <option className="d-none"  selected>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                  <label htmlFor="casetype1as">
                    Nominee Gender
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="position-relative mb-3">
                <div className="form-floating">
                  <select
                    className="form-select"
                    style={{paddingTop:0, paddingTop:25, height:'calc(2.8rem + 10px)', border: '1px solid lightgray'}}
                    id="casetype1lk"
                    {...register("NomineeRelationship", {
                      required: "Relationship with Nominee is required",
                    })}
                  >
                    <option className="d-none" selected>
                      Select Relationship with nominee
                    </option>
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="BROTHER">Brother</option>
                    <option value="SISTER">Sister</option>
                    <option value="SON">Son</option>
                    <option value="DAUGHTER">Daughter</option>
                    <option value="HUSBAND">Husband</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <label htmlFor="casetype1lk">
                    Relationship
                    <span className="text-danger">*</span>
                  </label>
                </div>
                <span className="text-danger">{errors?.NomineeRelationship?.message}</span>
              </div>
            </div>

            <div className="col-12" />

            <div className="col-lg-2 col-sm-6 mx-lg-0 mx-auto col-12 px-lg-0">
              <button type="submit" className="btn nextBtn btn-primary mb-5 mt-3 py-6 w-100 fs-4 fw-bold">
                Next
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NomineeDetails;
