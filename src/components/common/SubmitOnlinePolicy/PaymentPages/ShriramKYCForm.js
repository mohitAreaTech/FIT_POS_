import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, ModalBody } from "reactstrap";
import { dispatchQuickQuote } from "../../../../store/actions/userAction";

const ShriramKYCForm = ({ modal, setModal, toggleModal = () => {} }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  const [kycDocs, setKycDocs] = useState({
    aadhar: null,
    pic: null,
  });

  const handleUploadPanFile = async (e, type) => {
    const { files } = e.target;
    if (type == "Aadhar") {
      const base64Img = await toBase64(files[0]);
      dispatchQuickQuote("KYC." + "AadharBackPic", base64Img.split(",")[1]);
      setKycDocs({
        ...kycDocs,
        aadhar: base64Img,
      });
    } else if (type == "Pic") {
      const base64Img = await toBase64(files[0]);
      dispatchQuickQuote("KYC." + "PassportPic", base64Img.split(",")[1]);
      setKycDocs({
        ...kycDocs,
        pic: base64Img,
      });
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      console.log("file", file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const submitKYC = (data) => {
    const { FatherName, MotherName, AadharNo } = data;
    dispatchQuickQuote("KYC." + "FatherName", FatherName);
    dispatchQuickQuote("KYC." + "MotherName", MotherName);
    dispatchQuickQuote("KYC." + "AadharNo", AadharNo);
    toggleModal();
  };
  return (
    <Modal isOpen={modal} toggle={toggleModal} size="xl">
      <ModalBody>
        <form onSubmit={handleSubmit(submitKYC)}>
          <p className="mb-0 fs-1 fw-bold">KYC Verification</p>
          <div className="othervoption mt-3">
            <div className="row mx-0 px-0">
              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-5">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="fsa1"
                      {...register("FatherName", {
                        required: "FatherName is required",
                      })}
                      placeholder="Father Name"
                    />
                    <label htmlFor="fsa1">
                      Father Name
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.FatherName?.message}</p>
                </div>
              </div>
              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-5">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="fsa1"
                      {...register("MotherName", {
                        required: "Mother Name is required",
                      })}
                      placeholder="Mother Name"
                    />
                    <label htmlFor="fsa1">
                      Mother Name
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.MotherName?.message}</p>
                </div>
              </div>
              <div className="col-lg-4 ps-lg-0">
                <div className="position-relative mb-5">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="fsa1"
                      {...register("AadharNo", {
                        required: "Aadhar No is required",
                        pattern: {
                          value: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
                          message: "Invalid Aadhar Number",
                        },
                      })}
                      placeholder="Your Aadhar Number"
                    />
                    <label htmlFor="fsa1">
                      Your Aadhar Number
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <p className="m-0 f-error">{errors?.AadharNo?.message}</p>
                </div>
              </div>
              <div className="col-lg-4 col-sm-4  col-6 mb-5">
                <input
                  type="file"
                  className="d-none"
                  id={"AadharBackPic"}
                  name={"AadharBackPic"}
                  {...register("AadharBackPic", {
                    required: "Passport size photo is requried",
                    onChange: (e) => handleUploadPanFile(e, "Aadhar"),
                  })}
                  accept={"image/*"}
                />

                <label htmlFor={"AadharBackPic"} className="">
                  <p className="fs-2 text-decoration-underline fw-bold">Aadhar Back Image</p>
                  <img
                    src={kycDocs.aadhar ? kycDocs.aadhar : "./assets/images/Addimg.png"}
                    className=" d-block"
                    style={{ objectFit: "contain", height: "150px", width: "150px" }}
                  />
                </label>
                <p className="m-0 f-error">{errors?.AadharBackPic?.message}</p>
              </div>
              <div className="col-lg-4 col-sm-4  col-6 mb-5">
                <input
                  type="file"
                  className="d-none"
                  id={"PassportPic"}
                  name={"PassportPic"}
                  {...register("PassportPic", {
                    required: "Passport size photo is requried",
                    onChange: (e) => handleUploadPanFile(e, "Pic"),
                  })}
                  accept={"image/*"}
                />

                <label htmlFor={"PassportPic"} className="">
                  <p className="fs-2 text-decoration-underline fw-bold">Passport Size Photo</p>
                  <img
                    src={kycDocs.pic ? kycDocs.pic : "./assets/images/Addimg.png"}
                    className=" d-block"
                    style={{ objectFit: "contain", height: "150px", width: "150px" }}
                  />
                </label>
                <p className="m-0 f-error">{errors?.PassportPic?.message}</p>
              </div>
              <div className="col-12" />
              <div className="col-lg-2 col-sm-6 mx-lg-0 mx-auto col-12 px-lg-0">
                <button type="submit" className="btn btn-primary mb-5 mt-3 py-3 w-100 fs-1 fw-bold">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default ShriramKYCForm;
