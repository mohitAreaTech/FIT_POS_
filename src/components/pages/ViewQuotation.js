import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetDataWithToken, PostDataWithToken } from "../../api/apiHelper";
import { sendSuccessMessage } from "../services/userServices";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import swal from "sweetalert";
import Header from "../common/Header";
import ModalImage from "react-modal-image";
import Loader from "../common/Loader";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from "react-redux";
import SideBar from "../common/SideBar";

const ViewQuotation = () => {
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const navigate = useNavigate();
  const id = location.state.allDetail;
  const [singlePolicyData, setSinglePolicyData] = useState(null);
  const [companyName, setCompanyName] = useState([]);
  const [previousAddon, setPreviousAddon] = useState([]);
  const [requiredAddon, setRequiredAddon] = useState([]);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [singleImage, setSingleImage] = useState("");
  const [singleImageName, setSingleImageName] = useState("");
  const [showSinglModal, setShowSingleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const type = useSelector((state) => state?.root?.userDetails.type);

  const toggleSingle = () => {
    setShowSingleModal(!showSinglModal);
  };

  console.log("select", selectedQuotationId);

  const [reason, setReason] = useState("");

  console.log("hi hi", id);

  useEffect(() => {
    setLoading(true);
    GetDataWithToken(`pos/get-lead-detail/${id}`, "").then((response) => {
      if (response.status == true) {
        setLoading(false);
        console.log("bjsjj", response.data);
        setSinglePolicyData(response.data);
        let companyNa =
          response?.data?.leadInsurance?.motorInsurance?.required_insurance_company?.split(
            ","
          );
        setCompanyName(companyNa);
        let preAddon =
          response?.data?.leadInsurance?.motorInsurance?.previous_policy_add_on?.split(
            ","
          );
        setPreviousAddon(preAddon);
        let reqAddon =
          response?.data?.leadInsurance?.motorInsurance?.required_add_on?.split(",");
        setRequiredAddon(reqAddon);
      }
    });
  }, [id]);

  const submitQuotation = () => {
    if (selectedQuotationId !== null) {
      let data = {
        accept: true,
        accepted_quotation: selectedQuotationId,
      };
      PostDataWithToken(`pos/quotation/${id}`, data).then((response) => {
        if (response.status == true) {
          navigate('/cases');
          sendSuccessMessage(response);
          setSelectedQuotationId(null);
        }
      });
    } else {
      toast.error("Please select any one quotation");
      // swal("Error", "Please select any one quotation", "error");
    }
  };

  const rejectQuotation = () => {
    if (reason !== "") {
      let data = {
        accept: false,
        remark: reason,
      };
      PostDataWithToken(`pos/quotation/${id}`, data).then((response) => {
        if (response.status == true) {
          navigate('/cases');
          sendSuccessMessage(response);
        }
      });
    } else {
      toast.error("please fill reason");
      // swal("Error", "please fill reason", "error");
    }
  };

  // const getDocumentVal = (docType) => {
  // 	let docArr = userDetails?.user?.documents;
  // 	if (docArr) {
  // 		const index = docArr.findIndex((item) => item.DocumentType == docType);
  // 		if (index > -1) {
  // 			return docArr[index];
  // 		}
  // 	}
  // };

  const handleView = (image, name) => {
    setSingleImage(image);
    setSingleImageName(name);
    toggleSingle();
  };

  return (
    <>
    <SideBar />
    <section class='home-section'>
      <div class='home-content'>
        <div id='main_div'>
          <Header />
        </div>
      </div>
      
        <section className="content-body px-3">
          <div className="container-fluid">
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

                <div className="card p-4 mt-5 border-0">
                  <small className="fw-bold fs-3">Quotes</small>
                  <div className="othervoption mt-3">
                    <div className="d-flex my-4 justify-content-between align-items-center">
                      {/* <h1 className="text-warning">
												<i className="fas fa-clock" />
												Please Wait! we will send you quote shortly.
											</h1> */}
                      {/* <a href="ofreq.html" className="btn btn-outline-danger px-4 py-3">
												Cancel
											</a> */}
                    </div>
                    <small className="fw-bold fs-3 mb-4 d-block text-decoration-underline">
                      Policy Details
                    </small>
                    <div className="row mx-0 px-0">
                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Vehicle Type</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.vehicle_type
                          }
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Case Type</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {singlePolicyData?.leadInsurance?.motorInsurance?.case_type?.replace(
                            /_/g,
                            " "
                          )}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Policy Cover</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {singlePolicyData?.leadInsurance?.motorInsurance?.policy_type?.replace(
                            /_/g,
                            " "
                          )}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Registration No.</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.vehicle_no
                          }
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Vehicle Make</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.vehicle_make
                          }
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Vehicle Modal</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.vehicle_model
                          }
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Fule Type</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.fuel_type
                          }
                        </small>
                      </div>
                      {singlePolicyData?.leadInsurance?.motorInsurance
                        ?.registration_date !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Registration Date</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.registration_date
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance
                        ?.vehicle_mfg_yr !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Manufacturing Date</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.vehicle_mfg_yr
                              }
                            </small>
                          </div>
                        )}

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Vehicle variant</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.vehicle_variant
                          }
                        </small>
                      </div>
                      {singlePolicyData?.type == "offline" && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                          <small class="fs-5 fw-bold">
                            Expected Final Premium
                          </small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {
                              singlePolicyData?.leadInsurance?.motorInsurance
                                ?.expected_final_premium
                            }
                          </small>
                        </div>
                      )}
                      {singlePolicyData?.leadInsurance?.motorInsurance
                        ?.chassis_no !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Chassis no</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.chassis_no
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.engine_no !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Engine no</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.engine_no
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance
                        ?.net_premium !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Net premium</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.net_premium
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance
                        ?.od_net_premium !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Od net premium</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.od_net_premium
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.owner_driver !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Owner driver</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.owner_driver
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.passenger !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Passenger</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.passenger
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.pcv_gcv_misc !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">pcv gcv misc</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.pcv_gcv_misc
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance?.policy_no !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Policy no</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.policy_no
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance
                        ?.tax_amount !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Tax amount</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.tax_amount
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.terrorism_prem !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">
                              Terrorism premium
                            </small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.terrorism_prem
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.tran_amt && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">
                              Transaction amount
                            </small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.tran_amt
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.motorInsurance
                        ?.gross_premium !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Gross Premium</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.gross_premium
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.gaskit_installed !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Gaskit installed</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.gaskit_installed
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.gaskit_status !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Gaskit No</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.gaskit_status
                              }
                            </small>
                          </div>
                        )}

                      {/* 
                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-2 fw-bold">
                          Gaskit Installed Outside
                        </small>

                        <small className="fs-2">
                          -{" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.gaskit_outside
                          }
                        </small>
                      </div> */}
                      {singlePolicyData?.leadInsurance?.motorInsurance
                        ?.policy_status !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Policy status</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.policy_status
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.previous_policy_discount && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">
                              Previous Policy discount
                            </small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.previous_policy_discount
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.previous_policy_idv && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">
                              Previous Policy idv
                            </small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.previous_policy_idv
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.type == "offline" && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                          <small class="fs-5 fw-bold">Require discount</small>
                          <br />
                          <small className="fs-6">
                            {" "}
                            {
                              singlePolicyData?.leadInsurance?.motorInsurance
                                ?.require_discount
                            }
                          </small>
                        </div>
                      )}
                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.previous_policy_insurance_company !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">
                              Previous Policy insurance company -
                            </small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.previous_policy_insurance_company
                              }
                            </small>
                          </div>
                        )}

                      {/* <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
													<small class="fs-2 fw-bold">Require idv</small>
		
													<small className="fs-2">- {singlePolicyData?.leadInsurance?.motorInsurance?.require_idv}</small>
												</div> */}

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Require idv</small>
                        <br />
                        <small className="fs-6">
                          {" "}
                          {
                            singlePolicyData?.leadInsurance?.motorInsurance
                              ?.require_idv
                          }
                        </small>
                      </div>
                      {singlePolicyData?.type == "offline" &&
                        previousAddon?.length > 0 && (
                          <div className="col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">
                              Previous Policy add_on
                            </small>
                            <br />
                            <>
                              <div className="d-flex flex-wrap">
                                {previousAddon &&
                                  previousAddon?.map((item, key) => (
                                    <p className="mb-0 fs-2 me-3" key={key}>
                                      {key + 1}. {item}
                                    </p>
                                  ))}
                              </div>
                            </>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" && (
                        <div className="col-12 ps-lg-0 mb-4">
                          <small class="fs-5 fw-bold">Require addon</small>
                          <br />
                          <>
                            <div className="d-flex flex-wrap">
                              {requiredAddon &&
                                requiredAddon?.map((item, key) => (
                                  <p className="mb-0 fs-2 me-3" key={key}>
                                    {key + 1}. {item}
                                  </p>
                                ))}
                            </div>
                          </>
                        </div>
                      )}

                      <div className="col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">
                          Require insurance company
                        </small>
                        <br />
                        <>
                          <div className="d-flex flex-wrap">
                            {companyName &&
                              companyName?.map((item, key) => (
                                <p className="fs-2 mb-0 me-3" key={key}>
                                  {key + 1}. {item}
                                </p>
                              ))}
                          </div>
                        </>
                      </div>

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.quotation !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">
                              Generated Policy Insurance company Name
                            </small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {singlePolicyData?.quotation?.quotation}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.insurance_branch !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">
                              Insurance Branch Name
                            </small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.insurance_branch
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.type == "offline" &&
                        singlePolicyData?.leadInsurance?.motorInsurance
                          ?.broker_name !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small class="fs-5 fw-bold">Broker name</small>
                            <br />
                            <small className="fs-6">
                              {" "}
                              {
                                singlePolicyData?.leadInsurance?.motorInsurance
                                  ?.broker_name
                              }
                            </small>
                          </div>
                        )}
                    </div>
                    <small className="fw-bold fs-4 mb-4 d-block text-decoration-underline">
                      Customer Details
                    </small>
                    <div className="row mx-0 px-0">
                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold ">First Name</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.first_name}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Last Name</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.last_name}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Email</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.email}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">phone</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.phone}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">gender</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.gender}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">DOB</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.dob}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">City</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.city}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">State</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.state}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Pincode</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.pincode}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Address_line1</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.address_line1}
                        </small>
                      </div>

                      {/* <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
													<small class="fs-2 fw-bold">Aadhar card No</small>
		
													<small className="fs-2">- {singlePolicyData?.customer?.aadhar_card}</small>
												</div>
		
												<div className="col-lg-3 col-12 pe-lg-0 mb-4">
													<small class="fs-2 fw-bold">Pancard No</small>
		
													<small className="fs-2">- {singlePolicyData?.customer?.pan_card}</small>
												</div> */}

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Marital status</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.marital_status
                            ? singlePolicyData?.customer?.marital_status
                            : "Na"}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Occupation</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.occupation
                            ? singlePolicyData?.customer?.occupation
                            : "Na"}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Nominee name</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.nominee_name
                            ? singlePolicyData?.customer?.nominee_name
                            : "Na"}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Nominee relation</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.nominee_relation
                            ? singlePolicyData?.customer?.nominee_relation
                            : "Na"}
                        </small>
                        :
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small class="fs-5 fw-bold">Nominee age</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.nominee_age
                            ? singlePolicyData?.customer?.nominee_age
                            : "Na"}
                        </small>
                      </div>
                    </div>



                    <div className="row">
                      {singlePolicyData?.policy_documents &&
                        singlePolicyData?.policy_documents.length > 0 &&
                        singlePolicyData?.policy_documents.map((item, key) => (
                          <div
                            className="col-xl-2 col-lg-3 col-md-4 col-12 ps-lg-0"
                            key={key}
                          >
                            <div className="position-relative mb-5 text-center">
                              <div className="doccont">
                                {/* <img src={item?.image} className="docprev" alt="img" /> */}
                                {item?.image?.includes("pdf") ? (
                                  <a href={item?.image} target="_blank">
                                    <img
                                      src="/assets/images/pdf.png"
                                      className="docprev"
                                      alt="img"
                                    />
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
                              <p className="my-3 fs-3">{item?.document_type}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="row">
                      <small className="fw-bold fs-2 mb-4 d-block text-decoration-underline">
                        Provide quotation
                      </small>

                      {singlePolicyData?.leadInsurance?.motorInsurance?.quotations &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.quotations
                          ?.length > 0 &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.quotations?.map(
                          (item, key) => (
                            <div
                              className="col-xl-2 col-lg-3 col-md-4 col-12 ps-lg-0"
                              key={key}
                            >
                              {console.log("bgj", item)}
                              <div className="position-relative mb-5 text-center">
                                <div
                                  className={
                                    selectedQuotationId == item?.id ||
                                      item?.id ==
                                      singlePolicyData?.accepted_quotation
                                      ? "doccont select-quotation"
                                      : "doccont"
                                  }
                                  onClick={() => {
                                    if (
                                      singlePolicyData.accepted_quotation !==
                                      null
                                    ) {
                                      setSelectedQuotationId(null);
                                    } else {
                                      setSelectedQuotationId(item?.id);
                                    }
                                  }}
                                >
                                  {item?.attachment?.includes("pdf") ? (
                                    // <a href={item?.attachment} target="_blank">
                                    <img
                                      src="/assets/images/pdf.png"
                                      className="docprev"
                                      alt="img"
                                    />
                                  ) : (
                                    // </a>
                                    <img
                                      src={item?.attachment}
                                      className="docprev"
                                      alt="img"
                                    />
                                  )}
                                  {/* <ModalImage
																	small={item?.attachment}
																	large={item?.attachment}
																	alt={item?.quotation}
																	className="docprev"
																/> */}
                                </div>

                                <p className="my-3 fs-3 w-100 text-truncate">
                                  {item?.quotation}
                                </p>
                                {item?.attachment?.includes("pdf") ? (
                                  <a
                                    className="btn btn-primary fs-2 px-5 py-3"
                                    href={item?.attachment}
                                    target="_blank"
                                  >
                                    View Doc
                                  </a>
                                ) : (
                                  <button
                                    className="btn btn-primary fs-4 px-4 py-6"
                                    onClick={() =>
                                      handleView(
                                        item?.attachment,
                                        item?.quotation
                                      )
                                    }
                                  >
                                    View Doc
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        )}

                      {singlePolicyData?.quotation == null &&
                        singlePolicyData?.leadInsurance?.motorInsurance?.quotations
                          .length > 0 &&
                        singlePolicyData?.remark == null &&
                        singlePolicyData?.quotation_generated == false ? (
                        <div className="col-lg-2 col-12 mb-4">
                          <button
                            className="btn btn-success me-3"
                            onClick={submitQuotation}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => [
                              toggle(),
                              setSelectedQuotationId(null),
                            ]}
                          >
                            Reject
                          </button>
                        </div>
                      ) : singlePolicyData?.quotation == null &&
                        singlePolicyData?.quotation_generated == true ? (
                        <div className="col-lg-2 col-12 mb-4">
                          <button
                            className="btn btn-success me-3"
                            onClick={submitQuotation}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => [
                              toggle(),
                              setSelectedQuotationId(null),
                            ]}
                          >
                            Reject
                          </button>
                        </div>
                      ) : singlePolicyData?.isAccepted == null &&
                        singlePolicyData?.accepted_quotation == null &&
                        singlePolicyData?.quotation_generated == false ? (
                        <div className="col-lg-2 col-12 mb-4">
                          <br />
                          <small className="fw-bold fs-4 text-danger">
                            Quotation Rejected{" "}
                          </small>
                        </div>
                      ) : (
                        singlePolicyData?.quotation !== null &&
                        singlePolicyData?.quotation_generated == true && (
                          <div className="col-lg-2 col-12 mb-4">
                            <br />
                            <small className="fw-bold fs-4 text-success">
                              Quotation Accepted{" "}
                            </small>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      

      <Modal isOpen={modal} centered toggle={toggle} className={modal}>
        <ModalHeader toggle={toggle}>
          Give reason for reject quotation
        </ModalHeader>
        <ModalBody>
          <div className="col-lg-12 col-12 ps-lg-0">
            <div className="position-relative">
              <div className="form-floating inother">
                <input
                  type="text"
                  className="form-control"
                  id="Cusname"
                  onChange={(e) => setReason(e.target.value)}
                  placeholder=" Enter Customer Pincode"
                />
                <label htmlFor="Cusname">
                  Reason
                  <span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="text-end mt-5">
              <button className="btn btn-primary " onClick={rejectQuotation}>
                submit
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={showSinglModal}
        centered
        toggle={toggleSingle}
        className={`{showSinglModal} modal-xl modal-dialog-scrollable`}
      >
        <ModalHeader toggle={toggleSingle}>
          <p className="my-3 fs-2">{singleImageName}</p>
        </ModalHeader>

        <ModalBody>
          <div className={""}>
            <img
              src={singleImage}
              className="docprevmodal w-100 h-atuo"
              alt="img"
            />
          </div>
        </ModalBody>
      </Modal>
      </section>
    </>
  );
};

export default ViewQuotation;
