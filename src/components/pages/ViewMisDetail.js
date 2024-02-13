import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GetDataWithToken } from "../../api/apiHelper";
import ModalImage from "react-modal-image";
// import Loader from "../common/Loader";
import { useSelector } from "react-redux";
import SideBar from "../common/SideBar";
// import { sendErrorMessage, sendSuccessMessage } from "../../services/userServices";

const ViewMisDetail = () => {
  const [singlePolicyData, setSinglePolicyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const type = useSelector((state) => state?.root?.userDetails.type);

  const location = useLocation();
  const id = location?.state?.allDetail;
  const navigate = useNavigate();


  useEffect(() => {
    setLoading(true);
    GetDataWithToken(`pos/get-lead-detail/${id}`, "").then((response) => {
      if (response.status == true) {
        console.log("bjsjj", response.data);
        setSinglePolicyData(response.data);
        setLoading(false);
      }
    });
  }, [""]);

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
            {/* <!------- row Start -------> */}
            <div className="row">
              <div className="col-xl-12">
                <div className="d-md-flex my-4 justify-content-between align-items-center ">
                  <h1 className="fs-3">Get Your Vehicle Insurance Quote Now</h1>

                  <nav>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item fs-5">
                        <Link to="/home">Home</Link>
                      </li>
                      <li className="breadcrumb-item fs-5">
                        <Link to="/submitOfflinePolicy">Request Offline Policy</Link>
                      </li>
                      <li className="breadcrumb-item active fs-5">
                        Basic Details
                      </li>
                    </ol>
                  </nav>
                </div>

                <div className="card p-4 border-0">
                  <small className="fw-bold fs-3">Quotes</small>
                  <div className="othervoption mt-3">
                    <div className="d-flex my-4 justify-content-between align-items-center">
                      {singlePolicyData?.status == "policy-generated" ? (
                        <>
                          <h1 className="text-success fs-2">
                            <i className="fas fa-clock" />
                            Policy generated successfully
                          </h1>

                          {/* <div>
															<Link to={'/EditSubmitOfflinePolicy'} state={{ allDetail: singlePolicyData }} className='btn btn-danger' type='button'> Action</Link>
														</div> */}
                        </>
                      ) : (
                        <h1 className="text-warning fs-2">
                          <i className="fas fa-clock" />
                          Please Wait! we will process shortly.
                        </h1>
                      )}
                      {/* <Link href="ofreq.html" className="btn btn-outline-danger px-4 py-3">
													Cancel
												</Link> */}

                      {type == 'ops' && singlePolicyData?.status == "pending"
                        ?
                        <span
                          onClick={() => handleAssign(singlePolicyData?.id)}
                          className="btn btn-primary rounded-0 fs-4 px-4 py-2"
                        >
                          Assign to me
                        </span>
                        :
                        <></>
                      }

                      {type == 'ops' && singlePolicyData?.status == "under-ops" ?
                        <Link to={`/${type}/mispolicygenerate`} state={{ allData: singlePolicyData }}
                          className="btn btn-primary rounded-0 fs-4 px-4 py-2"
                        >
                          Generate policy
                        </Link>
                        :
                        <></>
                      }
                    </div>

                    <small className="fw-bold fs-3 mb-4 d-block text-decoration-underline">
                      Policy Details
                    </small>
                    <div className="row mx-0 px-0">

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Policy no</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.leadInsurance?.misInsurance?.policy_no}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Registration No.</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.leadInsurance?.misInsurance?.vehicle_no}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Vehicle Type</small>
                        <br />
                        <small className="fs-6">
                          {
                            singlePolicyData?.leadInsurance?.misInsurance
                              ?.vehicle_type
                          }
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Case Type</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.leadInsurance?.misInsurance?.case_type.replace(
                            /_/g,
                            " "
                          )}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Policy Cover</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.leadInsurance?.misInsurance?.policy_type.replace(
                            /_/g,
                            " "
                          )}
                        </small>
                      </div>



                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Rto</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.leadInsurance?.misInsurance?.rto}
                        </small>
                      </div>


                      {/* <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-2 fw-bold">Payment mode</small>
                        <br />
                        <small className="fs-2">
                          {
                            singlePolicyData?.leadInsurance?.misInsurance
                              ?.payment_mode
                          }
                        </small>
                      </div> */}

                      {singlePolicyData?.leadInsurance?.misInsurance?.TP_premium !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">TP premium</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.TP_premium
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.tp_cover !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">TP cover</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.tp_cover
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.addons !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Addons</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.addons
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.misInsurance?.chassis_no !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Chassis no</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.chassis_no
                              }
                            </small>
                          </div>
                        )}
                      {singlePolicyData?.leadInsurance?.misInsurance?.discount !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Discount</small>
                            <br />
                            <small className="fs-6">
                              {singlePolicyData?.leadInsurance?.misInsurance?.discount}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.engine_no !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Engine no</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.engine_no
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.fuel_type !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Fuel type </small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.fuel_type
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.gross_premium !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Gross premium </small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.gross_premium
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.idv !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">IDV</small>
                            <br />
                            <small className="fs-6">
                              {singlePolicyData?.leadInsurance?.misInsurance?.idv}
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.net_premium !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Net premium</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.net_premium
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.od_premium !==
                        null ? (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                          <small className="fs-5 fw-bold">Od premium</small>
                          <br />
                          <small className="fs-6">
                            {
                              singlePolicyData?.leadInsurance?.misInsurance
                                ?.od_premium
                            }
                          </small>
                        </div>
                      ) : (
                        <></>
                      )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.od_net_premium !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Od net premium</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.od_net_premium
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.commisanalbe_premium !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">COMMISONABLE premium</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.commisanalbe_premium
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.policy_expiry !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Policy expiry</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.policy_expiry
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.policy_issue !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Policy issue</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.policy_issue
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.insurance_company !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">
                              Insurance company
                            </small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.insurance_company
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.insurance_branch !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Insurance branch</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.insurance_branch
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.broker_name !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Broker name</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.broker_name
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.cc_gcv_str !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">CC/Gcv/Str</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.cc_gcv_str
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.policy_start !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Policy start</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.policy_start
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.policy_status !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Policy status</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.policy_status
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.pos_name_Code !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Pos name Code</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.pos_name_Code
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.rm_name_Code !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Rm name Code</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.rm_name_Code
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance?.tax_amount !==
                        null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Tax amount</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.tax_amount
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.vehicle_make !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Vehicle make</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.vehicle_make
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.vehicle_mfg_yr !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Vehicle mfg_yr</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.vehicle_mfg_yr
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.registration_date !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Vehicle registration date</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.registration_date
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.vehicle_model !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Vehicle Model</small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.vehicle_model
                              }
                            </small>
                          </div>
                        )}

                      {singlePolicyData?.leadInsurance?.misInsurance
                        ?.vehicle_variant !== null && (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">
                              Vehicle Variant
                            </small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.vehicle_variant
                              }
                            </small>
                          </div>
                        )}
                    </div>

                    <small className="fw-bold fs-3 mb-4 d-block text-decoration-underline">
                      Customer Details
                    </small>
                    <div className="row mx-0 px-0">
                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">First Name</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.first_name}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Last Name</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.last_name}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Email</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.email}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">phone</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.phone}
                        </small>
                      </div>

                      <div className="col-lg-3 col-12 mb-4">
                        <small className="fs-5 fw-bold">Address</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.address_line1}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">City</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.city}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">State</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.state}
                        </small>
                      </div>

                      <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                        <small className="fs-5 fw-bold">Pincode</small>
                        <br />
                        <small className="fs-6">
                          {singlePolicyData?.customer?.pincode}
                        </small>
                      </div>

                      {type == 'ops' && <>
                        {singlePolicyData?.leadInsurance?.misInsurance?.remark_internal_ops !== null ? (
                          <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                            <small className="fs-5 fw-bold">Remark for ops </small>
                            <br />
                            <small className="fs-6">
                              {
                                singlePolicyData?.leadInsurance?.misInsurance
                                  ?.remark_internal_ops ? singlePolicyData?.leadInsurance?.misInsurance
                                  ?.remark_internal_ops : '-'
                              }
                            </small>
                          </div>
                        ) : <></>}

                      </>}

                      {singlePolicyData?.leadInsurance?.misInsurance?.remark_pos !== null && (
                        <div className="col-xl-2 col-lg-3 col-md-6 col-12 ps-lg-0 mb-4">
                          <small className="fs-5 fw-bold">Remark for pos </small>
                          <br />
                          <small className="fs-6">
                            {
                              singlePolicyData?.leadInsurance?.misInsurance?.remark_pos
                            }
                          </small>
                        </div>
                      )}


                    </div>



                    <div className="row">
                      {singlePolicyData?.policy_documents &&
                        singlePolicyData?.policy_documents.length > 0 &&
                        singlePolicyData?.policy_documents.map((item, key) => (
                          <div
                            className="col-xl-2 col-lg-3 col-md-4 col-6 "
                            key={key}
                          >
                            <div className="position-relative mb-5 text-start">
                              <div className="doccont">
                                {/* <img src={item?.image} className="docprev" alt="img" /> */}
                                {item?.image?.includes("pdf") ? (
                                  <Link href={item?.image} target="_blank">
                                    <img
                                      src="/assets/images/pdf.png"
                                      className="docprev"
                                      alt="img"
                                    />
                                  </Link>
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
                              <p className="my-3 fs-6    fw-bold">
                                {item?.document_type}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default ViewMisDetail;
