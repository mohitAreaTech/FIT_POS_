import moment from 'moment'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import Header from '../common/Header'
import Loader from '../common/Loader'
import ModalImage from 'react-modal-image'
import HDFCPayment from '../common/SubmitOnlinePolicy/PaymentPages/HDFCPayment'
import ShriramPayment from '../common/SubmitOnlinePolicy/PaymentPages/ShriramPayment'
import KotakPayment from '../common/SubmitOnlinePolicy/PaymentPages/KotakPayment'
import FutureGeneralPayment from '../common/SubmitOnlinePolicy/PaymentPages/FutureGeneralPayment'
import RoyalSundaramPayment from '../common/SubmitOnlinePolicy/PaymentPages/RoyalSundaramPayment'
import {
  bajajIssueApi,
  digitCreateQuoteApiCall,
  digitPaymentApi,
  relianceGenerateProposal,
  savePolicyToDatabase
} from '../utility/TPApiCall'
import {
  dispatchQuickQuote,
  selectedPlanAction
} from '../../store/actions/userAction'
import { sendErrorMessage, sendSuccessMessage } from '../services/userServices'
import { GetDataWithToken, PostImageDataWithToken } from '../../api/apiHelper'
const PolicyOverview = () => {
  const apiRequestQQ = useSelector(state => state.root.apiRequestQQ)
  const selectedPlan = useSelector(state => state.root.selectedPlan)
  console.log('selected plan', selectedPlan)
  const QuickQouteResult = useSelector(state => state.root.QuickQouteResult)
  const [singlePolicyData, setSinglePolicyData] = useState(null)
  const [companyName, setCompanyName] = useState([])
  const [previousAddon, setPreviousAddon] = useState([])
  const [requiredAddon, setRequiredAddon] = useState([])
  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState('')
  const toggle = () => setModal(!modal)
  const toggle2 = () => setModal2(!modal2)

  const [images, setImages] = useState({
    column: '',
    image: '',
    preview: ''
  })
  const [otherDocument, setOtherDocument] = useState({
    column: '',
    image: '',
    preview: ''
  })
  const [documentName, setDocumentName] = useState('')
  const location = useLocation()
  const handleUploadOtherFile = (e, column) => {
    const file = e.target.files[0]
    let arr = []
    setImages({
      column,
      image: file,
      preview: URL.createObjectURL(file)
    })
    // setPreviewImages([...PreviewImages, ...arr])
    // setImages([...images, ...arr]);
    // toggle()
  }

  const handleUploadFile = (e, column) => {
    const file = e.target.files[0]
    let arr = []
    setOtherDocument({
      column,
      image: file,
      preview: URL.createObjectURL(file)
    })
    // setPreviewImages([...PreviewImages, ...arr])
    // setImages([...images, ...arr]);
    // toggle()
  }

  const handleScreenShot = () => {
    if (images.image !== '') {
    	const ImageData = new FormData()
    	ImageData.append(images.column, images.image)
    	PostImageDataWithToken(`send-payment/${id}`, ImageData).then((response) => {
    		if (response.status == true) {
    			setImages({
    				column: '',
    				image: '',
    				preview: ''
    			})
    			console.log("yes")
    			sendSuccessMessage(response)
    			GetDataWithToken(`get-lead-detail/${id}`, '').then((response) => {
    				if (response.status == true) {
    					console.log("bjsjj", response.data)
    					setSinglePolicyData(response.data)
    					let companyNa = response?.data?.customer?.motorInsurance?.required_insurance_company.split(',')
    					setCompanyName(companyNa)
    					let preAddon = response?.data?.customer?.motorInsurance?.previous_policy_add_on.split(',')
    					setPreviousAddon(preAddon)
    					let reqAddon = response?.data?.customer?.motorInsurance?.required_add_on.split(',')
    					setRequiredAddon(reqAddon)
    				}
    			})
    			toggle()
    		} else {
    			sendErrorMessage(response);
    		}
    	})
    } else {
    	toast.error("Please Add Payment Screen Shot")
    	// swal("Error", "Insurance 1 is Required", "error");
    }
  }

  const handleUploadDocument = () => {
    if (documentName !== '') {
    	const ImageData = new FormData()
    	ImageData.append(otherDocument.column, otherDocument.image)
    	PostImageDataWithToken(`add-image/${id}`, ImageData).then((response) => {
    		if (response.status == true) {
    			setOtherDocument({
    				column: '',
    				image: '',
    				preview: ''
    			})
    			console.log("yes")
    			sendSuccessMessage(response)
    			GetDataWithToken(`pos/get-lead-detail/${id}`, '').then((response) => {
    				if (response.status == true) {
    					console.log("bjsjj", response.data)
    					setSinglePolicyData(response.data)
    					let companyNa = response?.data?.customer?.motorInsurance?.required_insurance_company.split(',')
    					setCompanyName(companyNa)
    					let preAddon = response?.data?.customer?.motorInsurance?.previous_policy_add_on.split(',')
    					setPreviousAddon(preAddon)
    					let reqAddon = response?.data?.customer?.motorInsurance?.required_add_on.split(',')
    					setRequiredAddon(reqAddon)
    				}
    			})
    			toggle2()
    		} else {
    			sendErrorMessage(response);
    		}
    	})
    } else {
    	toast.error("Please fill Document Name")
    	// swal("Error", "Please fill Document Name", "error");
    }
  }
  const dispatch = useDispatch()
  useEffect(() => {
    if (selectedPlan.Api_name === 'Shriram') {
      let index = QuickQouteResult.findIndex(
        item => item.Api_name === 'Shriram'
      )
      dispatch(selectedPlanAction(QuickQouteResult[index]))
    }
    dispatchQuickQuote('PaymentAmount', selectedPlan.FinalPremium)
  }, [QuickQouteResult])

  const createQuote = e => {
    e.preventDefault()
    setDisabled('disabled')
    if (selectedPlan.Api_name === 'bajaj') {
      bajajIssueApi(apiRequestQQ)
    } else if (selectedPlan.Api_name === 'digit') {
      digitCreateQuoteApiCall(apiRequestQQ)
        .then(response => {
          if (
            response?.status === true &&
            response?.data?.error?.httpCode === 200
          ) {
            dispatchQuickQuote('applicationId', response.data.applicationId)
            dispatchQuickQuote('ApiId', response.data.policyNumber)
            savePolicy(response.data.policyNumber)
            if (
              response.data.policyStatus === 'INCOMPLETE' &&
              apiRequestQQ.PolicyStatus == 'continue'
            ) {
              digitPaymentApi(response.data.applicationId)
            } else if (
              response.data.policyStatus != 'INCOMPLETE' &&
              apiRequestQQ.PolicyStatus != 'continue'
            ) {
              sendSuccessInfo(
                'Complete your vehicle incepection once insurer send you verification link via SMS, Find inscpection status in my inspections'
              )
              setTimeout(() => {
                navigate('/')
              }, 2000)
            }
          } else {
            sendErrorMessage(response)
            setDisabled('')
          }
        })
        .catch(err => {
          console.log(err)
          setDisabled('')
        })
    } else if (selectedPlan.Api_name === 'Shriram') {
      // shriramGenerateProposal(apiRequestQQ, true);
    } else if (selectedPlan.Api_name === 'Reliance') {
      relianceGenerateProposal(apiRequestQQ)
    }
    let data = { ...apiRequestQQ, ...selectedPlan }

    // setTimeout(() => {
    //   setDisabled("");
    // }, 10000);
  }
  const savePolicy = apiId => {
    let data = { ...apiRequestQQ, ...selectedPlan }
    if (apiId) {
      data.ApiId = apiId
    }
    savePolicyToDatabase(data)
  }
  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <section className='content-body px-lg-5 px-3 mt-5'>
          <div className='container-fluid'>
            {/* <!------- row Start -------> */}
            <div className='row'>
              <div className='col-xl-12'>
                <div className='card p-4 border-0'>
                  <div className='othervoption mb-3'>
                    <div className='d-flex my-4 justify-content-between align-items-center'>
                      <div className=''>
                        <img src={selectedPlan.Logo} alt='' />
                      </div>

                      <h1 className='ms-4 text-decoration-underline'>
                        {selectedPlan.insurer}
                      </h1>

                      {apiRequestQQ.PolicyStatus == 'continue' ||
                      apiRequestQQ.NewPolicyType == 'ThirdParty' ? (
                        selectedPlan.Api_name === 'HDFC' ? (
                          <HDFCPayment />
                        ) : selectedPlan.Api_name === 'Shriram' ? (
                          <ShriramPayment />
                        ) : selectedPlan.Api_name === 'Kotak' ? (
                          <KotakPayment />
                        ) : selectedPlan.Api_name === 'Future' ? (
                          <FutureGeneralPayment />
                        ) : selectedPlan.Api_name === 'Royal' ? (
                          <RoyalSundaramPayment />
                        ) : (
                          <button
                            disabled={disabled}
                            onClick={e => createQuote(e)}
                            className='btn btn-primary fs-3 px-4 py-2 fw-bold'
                          >
                            {apiRequestQQ.PolicyStatus != 'continue' &&
                            apiRequestQQ.NewPolicyType != 'ThirdParty' ? (
                              'Raise Inspection'
                            ) : (
                              <>
                                Buy <span> {selectedPlan.FinalPremium}</span>
                              </>
                            )}
                          </button>
                        )
                      ) : (
                        <button
                          disabled={disabled}
                          onClick={e => createQuote(e)}
                          className='btn btn-primary fs-3 px-4 py-2 fw-bold'
                        >
                          {apiRequestQQ.PolicyStatus != 'continue' &&
                          apiRequestQQ.NewPolicyType != 'ThirdParty' ? (
                            'Raise Inspection'
                          ) : (
                            <>
                              Buy <span> {selectedPlan.FinalPremium}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <small className='fw-bold fs-2 mb-4 d-block text-decoration-underline'>
                      Customer Details
                    </small>
                    <div className='row mx-0 px-0'>
                      <div className='col-lg-3 ps-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold  '>First Name</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.FirstName}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold '>Last Name</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.LastName}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Email</small>

                        <small className='fs-6 '>- {apiRequestQQ.Email}</small>
                      </div>

                      <div className='col-lg-3 pe-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>phone</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.MobileNumber}
                        </small>
                      </div>

                      <div className='col-lg-3 ps-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>gender</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.Gender}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>DOB</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.Dob}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>City</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.City}
                        </small>
                      </div>

                      <div className='col-lg-3 pe-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>State</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.State}
                        </small>
                      </div>

                      <div className='col-lg-3 ps-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Pincode</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.Pincode}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Address_line1</small>

                        <small className='fs-6 ms-3'>
                          -{' '}
                          {apiRequestQQ.StreetNumber + '' + apiRequestQQ.Street}
                        </small>
                      </div>

                      {/* <div className="col-lg-3 col-12 mb-4">
                                            <small class="fs-2 fw-bold">Aadhar card No</small>

                                            <small className="fs-6 ms-3">- {singlePolicyData?.customer?.aadhar_card}</small>
                                        </div>

                                        <div className="col-lg-3 col-12 pe-lg-0 mb-4">
                                            <small class="fs-2 fw-bold">Pancard No</small>

                                            <small className="fs-6 ms-3">- {singlePolicyData?.customer?.pan_card}</small>
                                        </div> */}

                      <div className='col-lg-3  col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Nominee name</small>

                        <small className='fs-6 ms-3'>
                          -{' '}
                          {apiRequestQQ?.NomineeFirstName +
                            ' ' +
                            apiRequestQQ?.NomineeLastName}
                        </small>
                      </div>

                      <div className='col-lg-3 pe-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Nominee relation</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ?.NomineeRelationship}
                        </small>
                      </div>

                      <div className='col-lg-3 ps-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Nominee DOB</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ?.NomineeDateOfBirth}
                        </small>
                      </div>
                    </div>

                    <small className='fw-bold fs-2   mb-4 mt-5 d-block text-decoration-underline'>
                      Policy Details
                    </small>

                    <div className='row mx-0 px-0'>
                      <div className='col-lg-3 ps-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Vehicle Type</small>

                        <small className='fs-6 ms-3'>
                          -{' '}
                          {apiRequestQQ.VehicleType == '4w'
                            ? 'PVT Car'
                            : apiRequestQQ.VehicleType == '2w' && 'Moter Bike'}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Policy Cover</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.NewPolicyType}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Registration No.</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ?.RegistrationNumber}
                        </small>
                      </div>

                      <div className='col-lg-3 pe-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Vehicle Make</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.MakeName}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-4 ps-lg-0'>
                        <small class='fs-5 fw-bold'>Vehicle Modal</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.ModelName}
                        </small>
                      </div>

                      <div className='col-lg-3  col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Fule Type</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.FuelType}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Vehicle variant</small>

                        <small className='fs-6 ms-3'>
                          - {apiRequestQQ.VariantName}
                        </small>
                      </div>

                      <div className='col-lg-3 pe-lg-0  col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Registration Date</small>

                        <small className='fs-5 '>
                          -{' '}
                          {moment(
                            apiRequestQQ.RegistrationDate,
                            'YYYY-MM-DD'
                          ).format('DD MMM, YYYY')}
                        </small>
                      </div>

                      <div className='col-lg-3 ps-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Manufacturing Date</small>

                        <small className='fs-5 ms-3'>
                          -{' '}
                          {moment(
                            apiRequestQQ.ManufaturingDate,
                            'YYYY-MM-DD'
                          ).format('DD MMM, YYYY')}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>
                          Expected Final Premium
                        </small>

                        <small className='fs-6 ms-3'>
                          - {selectedPlan.FinalPremium}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Gaskit installed</small>

                        <small className='fs-6 ms-3'>- No</small>
                      </div>

                      <div className='col-lg-3 pe-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Gaskit No</small>

                        <small className='fs-6 ms-3'>- N/A</small>
                      </div>

                      <div className='col-lg-3 ps-lg-0 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>
                          Gaskit Installed Outside
                        </small>

                        <small className='fs-6 ms-3'>- N/A</small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>Policy status</small>

                        <small className='fs-6 ms-3'>
                          -{' '}
                          {apiRequestQQ.IsVehicleNew === true
                            ? 'New Business'
                            : 'Rollover'}
                        </small>
                      </div>

                      <div className='col-lg-3 col-12 mb-0'>
                        <small class='fs-5 fw-bold'>
                          Previous Policy discount
                        </small>

                        <small className='fs-6 ms-3'>
                          - {selectedPlan?.discount}
                        </small>
                      </div>

                      {/* <div className="col-lg-3 col-12 mb-4">
                                            <small class="fs-2 fw-bold">Require idv</small>

                                            <small className="fs-6 ms-3">- {singlePolicyData?.customer?.motorInsurance?.require_idv}</small>
                                        </div> */}

                      <div className='col-lg-3 col-12 pd-lg-0 mb-0'>
                        <small class='fs-5 fw-bold'>Require idv</small>

                        <small className='fs-6 ms-3'>
                          - {selectedPlan?.idv}
                        </small>
                      </div>
                    </div>

                    <small className='fw-bold fs-2 mb-4 mt-5 d-block text-decoration-underline'>
                      Policy Documents
                    </small>

                    <div className='row justify-content-start'>
                      {singlePolicyData?.policy_documents &&
                        singlePolicyData?.policy_documents.length > 0 &&
                        singlePolicyData?.policy_documents.map((item, key) => (
                          <div className='col-lg-2' key={key}>
                            <div className='position-relative mb-5'>
                              <div className='doccont'>
                                {/* <img src={item?.image} className="docprev" alt="img" /> */}
                                {item?.image?.includes('pdf') ? (
                                  <a href={item?.image} target='_blank'>
                                    <img
                                      src='/assets/images/pdf.png'
                                      className='docprev'
                                      alt='img'
                                    />
                                  </a>
                                ) : (
                                  <ModalImage
                                    small={item?.image}
                                    large={item?.image}
                                    alt={item?.document_type}
                                    className='docprev'
                                  />
                                )}

                                {/* <small>Require insurance company</small> */}
                              </div>

                              <p className='my-3 fs-2 fw-bold'>
                                {item?.document_type}
                              </p>
                            </div>
                          </div>
                        ))}

                      {singlePolicyData?.quotation == null && (
                        <div className='col-lg-3'>
                          <button
                            className=' col-lg-12 btn btn-primary mt-3 mb-5 mt-3 fs-4 py-3'
                            onClick={toggle2}
                          >
                            Add More Document
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Modal isOpen={modal} centered toggle={toggle} className={modal}>
        <ModalHeader toggle={toggle}>Add payment Screen Shot</ModalHeader>
        <ModalBody>
          <div className='col-lg-2 ps-lg-0'>
            <div className='position-relative mb-5 text-center'>
              <div className='doccont'>
                <input
                  type='file'
                  className='d-none'
                  id={'abc'}
                  name={'image'}
                  onChange={e => handleUploadOtherFile(e, 'payment-image')}
                />
                <label htmlFor={'abc'}>
                  {images?.preview ? (
                    images?.image?.type?.includes('pdf') ? (
                      <img
                        src='/assets/images/pdf.png'
                        className='docprev'
                        alt='img'
                      />
                    ) : (
                      <img
                        src={images?.preview}
                        className='docprev'
                        alt='img'
                      />
                    )
                  ) : (
                    <img
                      src='/assets/images/Addimg.png'
                      className='docprev'
                      alt='img'
                    />
                  )}
                </label>
              </div>
              {/* <p className="my-3 fs-3">{item.option}</p> */}
            </div>
          </div>

          <div className='text-end mt-5'>
            <button className='btn btn-primary ' onClick={handleScreenShot}>
              submit
            </button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={modal2} centered toggle={toggle2} className={modal2}>
        <ModalHeader toggle={toggle2}>Add more file</ModalHeader>
        <ModalBody>
          <div className='col-lg-12 col-12 ps-lg-0'>
            <div className='col-lg-12 ps-lg-0'>
              <div className='position-relative mb-5'>
                <div className='form-floating inother'>
                  <input
                    type='text'
                    className='form-control'
                    id='Cusname'
                    onChange={e => setDocumentName(e.target.value)}
                    placeholder=' Enter Customer Pincode'
                  />
                  <label htmlFor='Cusname'>
                    Document Name
                    <span className='text-danger'>*</span>
                  </label>
                </div>
              </div>
            </div>

            <div className='col-lg-2 ps-lg-0'>
              <div className='position-relative mb-5 text-center'>
                <div className='doccont'>
                  <input
                    type='file'
                    className='d-none'
                    id={'abc'}
                    name={'image'}
                    onChange={e => handleUploadFile(e, documentName)}
                  />
                  <label htmlFor={'abc'}>
                    {otherDocument?.preview ? (
                      otherDocument?.image?.type?.includes('pdf') ? (
                        <img
                          src='/assets/images/pdf.png'
                          className='docprev'
                          alt='img'
                        />
                      ) : (
                        <img
                          src={otherDocument?.preview}
                          className='docprev'
                          alt='img'
                        />
                      )
                    ) : (
                      <img
                        src='/assets/images/Addimg.png'
                        className='docprev'
                        alt='img'
                      />
                    )}
                  </label>
                </div>
                {/* <p className="my-3 fs-3">{item.option}</p> */}
              </div>
            </div>

            <div className='text-end mt-5'>
              <button
                className='btn btn-primary '
                onClick={() => handleUploadDocument()}
              >
                submit
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default PolicyOverview
