import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GetDataWithToken, PostDataWithToken, PostImageDataWithToken } from "../../../api/apiHelper";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Header from "../../common/Header";
import ModalImage from "react-modal-image";
import { sendErrorMessage, sendSuccessMessage } from "../../services/userServices";
import swal from "sweetalert";
// import Loader from "../common/Loader";
// import { toast } from "material-react-toastify";

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from "react-redux";
import { downloadBase64File } from "../../utility/TPApiCall";
import { useForm } from "react-hook-form";
import SideBar from "../../common/SideBar";



const   VehicleDetail = () => {
    const type = useSelector((state) => state?.root?.userDetails.type);
  const apiRequestQQ = useSelector((state) => state.root.apiRequestQQ);

  const [singlePolicyData, setSinglePolicyData] = useState(null);
  const [companyName, setCompanyName] = useState([]);
  const [previousAddon, setPreviousAddon] = useState([]);
  const [requiredAddon, setRequiredAddon] = useState([]);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });
  const navigate = useNavigate();

  const toggle = () => setModal(!modal);
  const toggle2 = () => setModal2(!modal2);

  const [images, setImages] = useState({
    column: "",
    image: "",
    preview: "",
  });
  const [otherDocument, setOtherDocument] = useState({
    column: "",
    image: "",
    preview: "",
  });
  const [documentName, setDocumentName] = useState("");

  const location = useLocation();
  const id = location?.state?.allDetail;

  // console.log("hi hi", singlePolicyData)

  useEffect(() => {
    setLoading(true);
    GetDataWithToken(`pos/get-lead-detail/${id}`, "").then((response) => {
      if (response.status == true) {
        setLoading(false);
        console.log("bjsjj", response.data);
        setSinglePolicyData(response.data);
        let companyNa = response?.data?.leadInsurance?.motorInsurance?.required_insurance_company?.split(",");
        setCompanyName(companyNa);
        let preAddon = response?.data?.leadInsurance?.motorInsurance?.previous_policy_add_on?.split(",");
        setPreviousAddon(preAddon);
        let reqAddon = response?.data?.leadInsurance?.motorInsurance?.required_add_on?.split(",");
        setRequiredAddon(reqAddon);
      }
    });
  }, [id]);

  const handleUploadOtherFile = (e, column) => {
    const file = e.target.files[0];
    let arr = [];
    setImages({
      column,
      image: file,
      preview: URL.createObjectURL(file),
    });
    // setPreviewImages([...PreviewImages, ...arr])
    // setImages([...images, ...arr]);
    // toggle()
  };

  const handleUploadFile = (e, column) => {
    const file = e.target.files[0];
    let arr = [];
    setOtherDocument({
      column,
      image: file,
      preview: URL.createObjectURL(file),
    });
    // setPreviewImages([...PreviewImages, ...arr])
    // setImages([...images, ...arr]);
    // toggle()
  };

  const handleScreenShot = () => {
    if (images.image !== "") {
      const ImageData = new FormData();
      ImageData.append(images.column, images.image);
      PostImageDataWithToken(`pos/send-payment/${id}`, ImageData).then((response) => {
        if (response.status == true) {
          setImages({
            column: "",
            image: "",
            preview: "",
          });
          console.log("yes");
          sendSuccessMessage(response);
          GetDataWithToken(`pos/get-lead-detail/${id}`, "").then((response) => {
            if (response.status == true) {
              console.log("bjsjj", response.data);
              setSinglePolicyData(response.data);
              let companyNa = response?.data?.leadInsurance?.motorInsurance?.required_insurance_company?.split(",");
              setCompanyName(companyNa);
              let preAddon = response?.data?.leadInsurance?.motorInsurance?.previous_policy_add_on?.split(",");
              setPreviousAddon(preAddon);
              let reqAddon = response?.data?.leadInsurance?.motorInsurance?.required_add_on?.split(",");
              setRequiredAddon(reqAddon);
            }
          });
          toggle();
        } else {
          sendErrorMessage(response);
        }
      });
    } else {
      toast.error("Please Add Payment Screen Shot");
      // swal("Error", "Insurance 1 is Required", "error");
    }
  };

  const handleUploadDocument = () => {
    if (documentName !== "") {
      const ImageData = new FormData();
      ImageData.append(otherDocument.column, otherDocument.image);
      PostImageDataWithToken(`pos/add-image/${id}`, ImageData).then((response) => {
        if (response.status == true) {
          setOtherDocument({
            column: "",
            image: "",
            preview: "",
          });
          console.log("yes");
          sendSuccessMessage(response);
          GetDataWithToken(`pos/get-lead-detail/${id}`, "").then((response) => {
            if (response.status == true) {
              console.log("bjsjj", response.data);
              setSinglePolicyData(response.data);
              let companyNa = response?.data?.leadInsurance?.motorInsurance?.required_insurance_company?.split(",");
              setCompanyName(companyNa);
              let preAddon = response?.data?.leadInsurance?.motorInsurance?.previous_policy_add_on?.split(",");
              setPreviousAddon(preAddon);
              let reqAddon = response?.data?.leadInsurance?.motorInsurance?.required_add_on?.split(",");
              setRequiredAddon(reqAddon);
            }
          });
          toggle2();
        } else {
          sendErrorMessage(response);
        }
      });
    } else {
      toast.error("Please fill Document Name");
      // swal("Error", "Please fill Document Name", "error");
    }
  };

  const handleAssign = (id) => {
    GetDataWithToken(`co/assign-lead/${id}`, "").then((response) => {
      if (response.status == true) {
        sendSuccessMessage(response);
        navigate(`/${type}/mypool`);
      } else {
        sendErrorMessage(response);
      }
    });
  };

  const handleDownloadPdf = () => {
    if (singlePolicyData?.leadInsurance?.motorInsurance?.file_type == "link") {
      window.location.href =
        singlePolicyData?.leadInsurance?.motorInsurance?.file &&
        singlePolicyData?.leadInsurance?.motorInsurance?.file.replaceAll('"', "");
    } else {
      downloadBase64File(
        "PEIB+" + singlePolicyData?.customer?.first_name,
        singlePolicyData?.leadInsurance?.motorInsurance?.file &&
        singlePolicyData?.leadInsurance?.motorInsurance?.file.replace(/['"]+/g, "")
      );
    }
  };

  const handleCopyClick = (e) => {
    // Create a temporary element to hold the text
    const url = `${window.location.origin}/sharepolicy/${apiRequestQQ?.leadId}`
    console.log(`${window.location.origin}/sharepolicy/${apiRequestQQ?.leadId}`)
    const tempElement = document.createElement('textarea');
    tempElement.value = url;
    document.body.appendChild(tempElement);

    tempElement.select();
    document.execCommand('copy');

    // Remove the temporary element
    document.body.removeChild(tempElement);


  };

  const handelSendUrl = (data) => {
    setLoader(true)

    PostDataWithToken(`admin/send-url-email`, data).then((response) => {
      if (response.status == true) {
        reset()
        setLoader(false)
        sendSuccessMessage(response)
        document.getElementById('ShareURL').classList.remove('show')
      } else {
        console.log("err", response.data.message)
      }
    })
    console.log("jhgfd", data)
  }
 return (
    <>
    <SideBar />
    <section class='home-section'>
      <div class='home-content'>
        <div id='main_div'>
          <Header />
        </div>
      </div>
      
        <section className="content-body px-lg-5 px-3 mt-5">
          <div className="container-fluid">
            {console.log("comapneyname", companyName)}
            {/* <!------- row Start -------> */}
            <div className="row">
              <div className="col-xl-12">
                <div className="d-flex my-4 justify-content-between align-items-center d-none">
                  <h1 className="">Get Your Vehicle Insurance Quote Now</h1>

                  <nav>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="NewPos.html">Home</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="ofreq.html">Reques Offline Policy</a>
                      </li>
                      <li className="breadcrumb-item active">Basic Details</li>
                    </ol>
                  </nav>
                </div>

                <div className="card p-1 border-0">
                  <small className="fw-bold fs-3">Quotes</small>

                  <div className="othervoption mt-0">
                    <div className="d-flex my-3 justify-content-between align-items-center">
                      {singlePolicyData?.remark !== null ? (
                        <>
                          <h1 className="text-danger fs-3">
                            <i className="fas fa-clock me-2" />
                            Remark in this fields {singlePolicyData?.remark} please clear this remarks
                          </h1>

                          <div>
                            <Link
                              to={'/EditOfflinePolicy'}
                              state={{ allDetail: singlePolicyData }}
                              className="btn btn-danger"
                              type="button"
                            >
                              {" "}
                              Action
                            </Link>
                          </div>
                        </>
                      ) : singlePolicyData?.status == "policy-generated" ? (
                        <h1 className="text-success fs-4">
                          <i className="fas fa-clock me-2" />
                          Policy generated successfully
                        </h1>
                      ) : singlePolicyData?.status == "booking-pending" ? (
                        <h1 className="text-success fs-4">
                          <i className="fas fa-clock me-2" />
                          Please wait your policy in under review
                        </h1>
                      ) : singlePolicyData?.status == "payment-pending" &&
                        singlePolicyData?.transactions.length == 0 ? (
                        <>
                          <h1 className="text-warning fs-4">
                            <i className="fas fa-clock me-0" />
                            Your payment is pending please clear payment
                          </h1>

                          <h2 style={{fontSize:'18px'}}>
                            Payment Url is
                            <a
                              href={singlePolicyData?.payment_url}
                              class="ms-2 fs-5 text-primary fw-bold text-decoration-underline"
                              target="_blank"
                            >
                              {singlePolicyData?.payment_url}
                            </a>
                          </h2>

                          <button className="btn btn-primary" onClick={toggle}>
                            Add payment ScreenShot
                          </button>
                        </>
                      ) : singlePolicyData?.status == "payment-pending" && singlePolicyData?.transactions.length > 0 ? (
                        <h1 className="text-success fs-4">
                          <i className="fas fa-clock me-2" />
                          Payment successfully
                        </h1>
                      ) : (
                        <h1 className="text-warning fs-4">
                          <i className="fas fa-clock me-1" />
                          Please Wait! we will send you quote shortly.
                        </h1>
                      )}
                      {/* <a href="ofreq.html" className="btn btn-outline-danger px-4 py-3">
													Cancel
												</a> */}

                      {type == "ops" && singlePolicyData?.status == "pending" ? (
                        <span
                          onClick={() => handleAssign(singlePolicyData?.id)}
                          className="btn btn-primary rounded-0 fs-4 px-4 py-2"
                        >
                          Assign to me
                        </span>
                      ) : (
                        <></>
                      )}

                      {singlePolicyData?.type == "online" && singlePolicyData?.status == "payment-pending" && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <button
                            className="btn btn-primary fs-4 px-4 py-2 me-3 fw-bold"
                            data-bs-toggle="collapse" data-bs-target="#ShareURL" aria-expanded="false" aria-controls="ShareURL"
                          >
                            Share URL
                          </button>
                        </div>
                      )}



                      {singlePolicyData?.type == "online" && singlePolicyData?.leadInsurance?.motorInsurance.file && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <button
                            className="btn btn-primary  fs-4 px-4 py-2 fw-bold"
                            onClick={() => handleDownloadPdf()}
                          >
                            Download Policy <i class="fas fa-file-download ms-1"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    <div class="share-collpase collapse" id="ShareURL">
                      <div class="card card-body">
                        <div className="d-flex align-items-center justify-content-start">
                          <p className="mb-0">{`${window.location.origin}/sharepolicy/${singlePolicyData?.id}`}</p>
                          <a onClick={() => handleCopyClick()} href="javascript:void(0)" className="btn btn-primary ms-2">
                            <i class="fas fa-copy"></i>
                          </a>
                        </div>
                        <form onSubmit={handleSubmit(handelSendUrl)}>
                          <div className="row justify-content-end">
                            <div className="col-12">
                              <div className="form-floating my-4">
                                <input
                                  type="email"
                                  className="form-control"
                                  id="email"
                                  placeholder="Enter Email"
                                  {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                      value:
                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                      message: "Invalid email address",
                                    },
                                  })}
                                />

                                <label htmlFor="email">
                                  Enter email<span className="text-danger">*</span>
                                </label>
                                <span className="text-danger">
                                  {errors.email && errors.email.message}
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="URL"
                                  defaultValue={`${window.location.origin}/sharepolicy/${apiRequestQQ?.leadId}`}
                                  placeholder="URL"
                                  {...register("url", {
                                    required: "URL is required",

                                  })}
                                />

                                <label htmlFor="URL">
                                  URL<span className="text-danger">*</span>
                                </label>
                                <span className="text-danger">
                                  {errors.url && errors.url.message}
                                </span>
                              </div>
                            </div>
                            <div className="col-12 text-end">
                              <button
                                className="btn btn-primary fs-6 px-4 py-2 mt-4 fw-bold"
                              >
                                {loader == true ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  "Submit"
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>

                    <small className="fw-bold fs-3 mb-3 mt-3 d-block text-decoration-underline">Policy Details</small>

                    <div className="row mx-0 px-0">
                      {singlePolicyData?.leadInsurance?.motorInsurance?.policy_no !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Policy no</small>
                          <br />
                          <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.policy_no}</small>
                        </div>
                      )}

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Registration No.</small>
                        <br />
                        <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.vehicle_no}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Vehicle Type</small>
                        <br />
                        <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.vehicle_type}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Case Type</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {singlePolicyData?.leadInsurance?.motorInsurance?.case_type?.replace(/_/g, " ")}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Policy Cover</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {singlePolicyData?.leadInsurance?.motorInsurance?.policy_type?.replace(/_/g, " ")}
                        </small>
                      </div>

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.rto !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Rto</small>
                            <br />
                            <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.rto}</small>
                          </div>
                        )}

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Vehicle Make</small>
                        <br />
                        <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.vehicle_make}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Vehicle Modal</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {singlePolicyData?.leadInsurance?.motorInsurance?.vehicle_model}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Fule Type</small>
                        <br />
                        <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.fuel_type}</small>
                      </div>
                      {singlePolicyData?.leadInsurance?.motorInsurance?.registration_date !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Registration Date</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.registration_date}
                          </small>
                        </div>
                      )}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.vehicle_mfg_yr !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Manufacturing Date</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.vehicle_mfg_yr}
                          </small>
                        </div>
                      )}

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Vehicle variant</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {singlePolicyData?.leadInsurance?.motorInsurance?.vehicle_variant}
                        </small>
                      </div>
                      {singlePolicyData?.type == "offline" && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Expected Final Premium</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.expected_final_premium}
                          </small>
                        </div>
                      )}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.chassis_no !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Chassis no</small>
                          <br />
                          <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.chassis_no}</small>
                        </div>
                      )}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.engine_no !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Engine no</small>
                          <br />
                          <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.engine_no}</small>
                        </div>
                      )}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.net_premium !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Net premium</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.net_premium}
                          </small>
                        </div>
                      )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.owner_driver !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Od premium</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.owner_driver}
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.od_net_premium !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Od net premium</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.od_net_premium}
                          </small>
                        </div>
                      )}

                      {singlePolicyData?.leadInsurance?.motorInsurance?.commisanalbe_premium !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">COMMISONABLE premium</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.commisanalbe_premium}
                          </small>
                        </div>
                      )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.addons !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Addons</small>
                            <br />
                            <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.addons}</small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.passenger !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Passenger</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.passenger}
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.pcv_gcv_misc !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">pcv gcv misc</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.pcv_gcv_misc}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.policy_start !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Policy start</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.policy_start}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.policy_expiry !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Policy expiry</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.policy_expiry}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.policy_issue !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Policy issue</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.policy_issue}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.policy_receive !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Policy receive</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.policy_receive}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.motorInsurance?.tax_amount !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Tax amount</small>
                          <br />
                          <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.tax_amount}</small>
                        </div>
                      )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.terrorism_prem !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Tp premium</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.terrorism_prem}
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.tp_cover !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Tp cover</small>
                            <br />
                            <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.tp_cover}</small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.tran_amt && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Transaction amount</small>
                            <br />
                            <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.tran_amt}</small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.gross_premium !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Gross Premium</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.gross_premium}
                          </small>
                        </div>
                      )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.gaskit_installed !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Gaskit installed</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.gaskit_installed}
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.gaskit_status !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Gaskit No</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.gaskit_status}
                            </small>
                          </div>
                        )}

                      {/* 
                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">
                          Gaskit Installed Outside
                        </small>

                        <small className="fs-5">
                          -{" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.gaskit_outside
                          }
                        </small>
                      </div> */}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.policy_status !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Policy status</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.policy_status}
                          </small>
                        </div>
                      )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.previous_policy_discount && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Previous Policy discount</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.previous_policy_discount}
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.previous_policy_idv && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Previous Policy idv</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.previous_policy_idv}
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Require discount</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {singlePolicyData?.leadInsurance?.motorInsurance?.require_discount}
                          </small>
                        </div>
                      )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.previous_policy_insurance_company !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Previous Policy insurance company -</small>
                            <br />
                            <small className="fs-6">
                              {singlePolicyData?.leadInsurance?.motorInsurance?.previous_policy_insurance_company}
                            </small>
                          </div>
                        )}

                      {/* <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
													<small class="fs-5 fw-bold">Require idv</small>
		
													<small className="fs-5">- {singlePolicyData?.leadInsurance?.motorInsurance?.require_idv}</small>
												</div> */}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.reason !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Reason</small>
                            <br />
                            <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.reason}</small>
                          </div>
                        )}

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Require idv</small>
                        <br />
                        <small className="fs-6"> {singlePolicyData?.leadInsurance?.motorInsurance?.require_idv}</small>
                      </div>

                      {singlePolicyData?.type == "offline" && previousAddon?.length > 0 && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Previous Policy add_on</small>
                          <br />
                          {previousAddon &&
                            previousAddon?.map((item, key) => (
                              <p className="mb-0 fs-5" key={key}>
                                {key + 1}. {item}
                              </p>
                            ))}
                        </div>
                      )}

                      {singlePolicyData?.type == "offline" && (
                        <div className="col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Require addon</small>
                          <br />
                          <>
                            <div className="d-flex flex-wrap">
                              {requiredAddon &&
                                requiredAddon?.map((item, key) => (
                                  <p className="mb-0 fs-5 me-3" key={key}>
                                    {key + 1}. {item}
                                  </p>
                                ))}
                            </div>
                          </>
                        </div>
                      )}

                      <div className="col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Require insurance company</small>
                        <br />
                        <>
                          <div className="d-flex flex-wrap">
                            {companyName ? (
                              companyName &&
                              companyName?.map((item, key) => (
                                <p className="fs-5 mb-0 me-3" key={key}>
                                  {key + 1}. {item}
                                </p>
                              ))
                            ) : (
                              <p>{singlePolicyData?.leadInsurance?.motorInsurance?.insurance_company}</p>
                            )}
                          </div>
                        </>
                      </div>

                      {singlePolicyData?.type == "offline" && singlePolicyData?.quotation !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                          <small class="fs-5 fw-bold">Generated Policy Insurance company Name</small>
                          <br />
                          <small className="fs-5"> {singlePolicyData?.quotation?.quotation}</small>
                        </div>
                      )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.insurance_branch !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Insurance Branch Name</small>
                            <br />
                            <small className="fs-5">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.insurance_branch}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.broker_name !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                            <small class="fs-5 fw-bold">Broker name</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.leadInsurance?.motorInsurance?.broker_name}
                            </small>
                          </div>
                        )}
                    </div>

                    <small className="fw-bold fs-2 mb-3 d-block text-decoration-underline">Customer Details</small>
                    <div className="row mx-0 px-0">
                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold ">First Name</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.first_name}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Last Name</small>
                        <br />
                        <small className="fs-6 ms-3">{singlePolicyData?.customer?.last_name}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Email</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.email}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">phone</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.phone}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">gender</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.gender}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">DOB</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.dob}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">City</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.city}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">State</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.state}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Pincode</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.pincode}</small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Address_line1</small>
                        <br />
                        <small className="fs-6">{singlePolicyData?.customer?.address_line1}</small>
                      </div>

                      {/* <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
													<small class="fs-5 fw-bold">Aadhar card No</small>
		
													<small className="fs-5">- {singlePolicyData?.customer?.aadhar_card}</small>
												</div>
		
												<div className="col-lg-3 col-12 pe-lg-0 mb-3">
													<small class="fs-5 fw-bold">Pancard No</small>
		
													<small className="fs-5">- {singlePolicyData?.customer?.pan_card}</small>
												</div> */}

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Marital status</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.marital_status
                            ? singlePolicyData?.customer?.marital_status
                            : "Na"}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Occupation</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.occupation ? singlePolicyData?.customer?.occupation : "Na"}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Nominee name</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.nominee_name ? singlePolicyData?.customer?.nominee_name : "Na"}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold">Nominee relation</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.nominee_relation
                            ? singlePolicyData?.customer?.nominee_relation
                            : "Na"}
                        </small>
                        :
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-3">
                        <small class="fs-5 fw-bold" >Nominee age</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.nominee_age ? singlePolicyData?.customer?.nominee_age : "Na"}
                        </small>
                      </div>
                    </div>

                    <small className="fw-bold fs-2 mb-3 mt-5 d-block text-decoration-underline">Policy Documents</small>

                    <div className="row justify-content-start">
                      {singlePolicyData?.policy_documents &&
                        singlePolicyData?.policy_documents.length > 0 &&
                        singlePolicyData?.policy_documents.map((item, key) => (
                          <div className="col-xl-2 col-lg-3 col-md-4 col-12 ps-lg-0" key={key}>
                            <div className="position-relative mb-3">
                              <div className="doccont">
                                {/* <img src={item?.image} className="docprev" alt="img" /> */}
                                {item?.image?.includes("pdf") ? (
                                  <a href={item?.image} target="_blank">
                                    <img src="/assets/images/pdf.png" className="docprev" alt="img" />
                                  </a>
                                ) : (
                                  <ModalImage
                                    small={item?.image}
                                    large={item?.image}
                                    alt={item?.document_type}
                                    className="docprev"
                                  />
                                )}

                                {/* <small>Require insurance company</small> */}
                              </div>

                              <p className="my-3 fs-5 fw-bold">{item?.document_type}</p>
                            </div>
                          </div>
                        ))}

                      {singlePolicyData?.quotation == null && (
                        <div className="col-lg-2">
                          <button className="btn btn-primary" onClick={toggle2}>
                            Add More Document
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="row justify-content-start">
                      {singlePolicyData?.quotation !== null && (
                        <>
                          <div className="col-lg-2">
                            <small className="fw-bold fs-4 mb-3 mt-5 d-block text-decoration-underline">
                              Accepted quotation
                            </small>
                            <div className="position-relative mb-3">
                              <div className="doccont">
                                {/* <img src={item?.image} className="docprev" alt="img" /> */}
                                {singlePolicyData?.quotation?.attachment?.includes("pdf") ? (
                                  <a href={singlePolicyData?.quotation?.attachment} target="_blank">
                                    <img src="/assets/images/pdf.png" className="docprev" alt="img" />
                                  </a>
                                ) : (
                                  <ModalImage
                                    small={singlePolicyData?.quotation?.attachment}
                                    large={singlePolicyData?.quotation?.attachment}
                                    alt={singlePolicyData?.quotation?.quotation}
                                    className="docprev"
                                  />
                                )}

                                {/* <small>Require insurance company</small> */}
                              </div>

                              <p className="my-3 fs-5 fw-bold">{singlePolicyData?.quotation?.quotation}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {singlePolicyData?.transactions.length > 0 && (
                        <>
                          <div className="col-lg-2">
                            <small className="fw-bold fs-4 mb-3 mt-5 d-block text-decoration-underline">
                              Payment ScreenShot
                            </small>
                            <div className="position-relative mb-5">
                              <div className="doccont">
                                {/* <img src={item?.image} className="docprev" alt="img" /> */}
                                {singlePolicyData?.transactions?.[0]?.transaction_proof?.includes("pdf") ? (
                                  <a href={singlePolicyData?.transactions?.[0]?.transaction_proof} target="_blank">
                                    <img src="/assets/images/pdf.png" className="docprev" alt="img" />
                                  </a>
                                ) : (
                                  <ModalImage
                                    small={singlePolicyData?.transactions?.[0]?.transaction_proof}
                                    large={singlePolicyData?.transactions?.[0]?.transaction_proof}
                                    alt={singlePolicyData?.transactions?.[0]?.transaction_proof}
                                    className="docprev"
                                  />
                                )}

                                {/* <small>Require insurance company</small> */}
                              </div>

                              <p className="my-3 fs-5 fw-bold">{singlePolicyData?.transactions?.[0]?.transactionId}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {singlePolicyData?.leadInsurance.motorInsurance?.final_policy !== null && (
                        <>
                          <div className="col-lg-2">
                            <small className="fw-bold fs-4 mb-3 mt-5 d-block text-decoration-underline">
                              Final Generated Policy Attachment
                            </small>
                            <div className="position-relative mb-5">
                              <div className="doccont">
                                {/* <img src={item?.image} className="docprev" alt="img" /> */}
                                {singlePolicyData?.leadInsurance?.motorInsurance?.final_policy?.includes("pdf") ? (
                                  <a
                                    href={singlePolicyData?.leadInsurance?.motorInsurance?.final_policy}
                                    target="_blank"
                                  >
                                    <img src="/assets/images/pdf.png" className="docprev" alt="img" />
                                  </a>
                                ) : (
                                  <ModalImage
                                    small={singlePolicyData?.leadInsurance?.motorInsurance?.final_policy}
                                    large={singlePolicyData?.leadInsurance?.motorInsurance?.final_policy}
                                    alt={singlePolicyData?.leadInsurance?.motorInsurance?.final_policy}
                                    className="docprev"
                                  />
                                )}

                                {/* <small>Require insurance company</small> */}
                              </div>

                              <p className="my-3 fs-5 fw-bold">{singlePolicyData?.transactions?.[0]?.transactionId}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      

      <Modal isOpen={modal} centered toggle={toggle} className={modal}>
        <ModalHeader toggle={toggle}>Add payment Screen Shot</ModalHeader>
        <ModalBody>
          <div className="col-lg-2 ps-lg-0">
            <div className="position-relative mb-5 text-center">
              <div className="doccont">
                <input
                  type="file"
                  className="d-none"
                  id={"abc"}
                  name={"image"}
                  onChange={(e) => handleUploadOtherFile(e, "payment-image")}
                />
                <label htmlFor={"abc"}>
                  {images?.preview ? (
                    images?.image?.type?.includes("pdf") ? (
                      <img src="/assets/images/pdf.png" className="docprev" alt="img" />
                    ) : (
                      <img src={images?.preview} className="docprev" alt="img" />
                    )
                  ) : (
                    <img src="/assets/images/Addimg.png" className="docprev" alt="img" />
                  )}
                </label>
              </div>
              {/* <p className="my-3 fs-3">{item.option}</p> */}
            </div>
          </div>

          <div className="text-end mt-5">
            <button className="btn btn-primary " onClick={handleScreenShot}>
              submit
            </button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={modal2} centered toggle={toggle2} className={modal2}>
        <ModalHeader toggle={toggle2}>Add more file</ModalHeader>
        <ModalBody>
          <div className="col-lg-12 col-12 ps-lg-0">
            <div className="col-lg-12 ps-lg-0">
              <div className="position-relative mb-5">
                <div className="form-floating inother">
                  <input
                    type="text"
                    className="form-control"
                    id="Cusname"
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder=" Enter Customer Pincode"
                  />
                  <label htmlFor="Cusname">
                    Document Name
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="col-lg-2 ps-lg-0">
              <div className="position-relative mb-5 text-center">
                <div className="doccont">
                  <input
                    type="file"
                    className="d-none"
                    id={"abc"}
                    name={"image"}
                    onChange={(e) => handleUploadFile(e, documentName)}
                  />
                  <label htmlFor={"abc"}>
                    {otherDocument?.preview ? (
                      otherDocument?.image?.type?.includes("pdf") ? (
                        <img src="/assets/images/pdf.png" className="docprev" alt="img" />
                      ) : (
                        <img src={otherDocument?.preview} className="docprev" alt="img" />
                      )
                    ) : (
                      <img src="/assets/images/Addimg.png" className="docprev" alt="img" />
                    )}
                  </label>
                </div>
                {/* <p className="my-3 fs-3">{item.option}</p> */}
              </div>
            </div>

            <div className="text-end mt-5">
              <button className="btn btn-primary " onClick={() => handleUploadDocument()}>
                submit
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      </section>
</>
 )

}


export default VehicleDetail;