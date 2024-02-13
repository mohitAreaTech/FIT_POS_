import React, { useEffect, useState } from 'react'
import { Document } from './InputData/InsuranceInputData'
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import swal from "sweetalert";
import { Viewer, Worker } from '@react-pdf-viewer/core'
// import { toast } from 'material-react-toastify';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { sendErrorMessage, sendSuccessMessage } from '../services/userServices';
import { PostDataWithToken, PostImageDataWithToken } from '../../api/apiHelper';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const EditDocument = ({ allPolicyData, allData, toggleTab }) => {
  // const [rcError, setRcError] = useState(false);
  // const [insuranceError, setInsuranceError] = useState(false);

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const type = useSelector((state) => state?.root?.userDetails.type);

  const [images, setImages] = useState([{
    column: "rc_front",
    preview: '',
    image: ''
  },
  {
    column: "insurance_01",
    preview: '',
    image: ''
  },
  ])
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    setDocumentName('')
  }
  const [documentName, setDocumentName] = useState('')
  const [PreviewImages, setPreviewImages] = useState([])

  const handleUploadFile = (e, column) => {
    // if (column == 'rc_front') {
    //   setRcError(false)
    // }
    // if (column == 'insurance_01') {
    //   // setInsuranceError(false)
    // }
    if (allData !== null) {
      const FilterImg = images.filter(e => e.column !== column)
      const FilterImgId = allData?.policy_documents?.filter(e => e?.document_type === column)
      console.log("hjh", FilterImgId)
      const file = e.target.files[0];
      let arr = [...FilterImg];
      arr.push({
        column,
        image: file,
        preview: URL.createObjectURL(file),
        id: FilterImgId?.[0]?.id
      })
      setImages(arr);
      console.log("bbbbbbb", arr)
    } else {
      const FilterImg = images.filter(e => e.column !== column)
      // const FilterImgId = allData?.policy_documents?.filter(e => e?.document_type === column)
      // console.log("hjh", FilterImgId)
      const file = e.target.files[0];
      let arr = [...FilterImg];
      arr.push({
        column,
        image: file,
        preview: URL.createObjectURL(file),
        // id: FilterImgId?.[0]?.id
      })
      setImages(arr);
      console.log("bbbbbbb", arr)
    }

  }

  const handleUploadOtherFile = (e, column) => {

    const file = e.target.files[0];
    let arr = [];
    arr.push({
      column,
      image: file,
      preview: URL.createObjectURL(file)
    })
    setPreviewImages([...PreviewImages, ...arr])
    setImages([...images, ...arr]);
    toggle()
  }

  useEffect(() => {
    if (allData !== null) {
      let arr = []

      allData?.policy_documents?.map((item) => {
        arr.push({
          column: item?.document_type,
          image: item?.image,
          preview: item?.image,
          // id: item?.id
        })
      })

      setImages(arr)
    }
  }, [''])



  const submitDocumentDetails = () => {
    if (!images.find(img => img.column === "rc_front")?.preview) {
      // setRcError(true)
      toast.error("Rc Front is Requires")
      return
    }
    if (!images.find(img => img.column === "insurance_01")?.preview) {
      // setInsuranceError(true)
      toast.error("Insurance 1 is Required")
      return
    }
    console.log("fin all", images)
    // callApi(true)
    // toggleTab("4")
    // finalDocumentData(images)
    setLoading(true)

    if (
      Object.keys(allPolicyData.basicDetails).length > 0
    ) {
      let formData = new FormData();
      Object.keys(allPolicyData?.basicDetails).forEach((key) => {
        formData.append(key, allPolicyData?.basicDetails[key])
      });
      // formData.append('customerId', customerId)
      formData.append("leadType", 1);
      formData.append('type', "offline")
      formData.append('id', allData?.customer?.motorInsurance?.id)
      // formData2.append('id', allData?.customerId)

      let allCustomerData = {
        id: allData?.customerId,
        ...allPolicyData.basicDetails
      }

      let ImageData = new FormData();
      let IdArr = []
      // allSingleData?.policy_documents?.filter((e) => e?.id == allData.document.id)
      for (let index = 0; index < images.length; index++) {

        for (let j = 0; j < allData?.policy_documents.length; j++) {
          if (images[index].id == allData?.policy_documents[j].id) {
            IdArr.push(images[index].id)
            console.log("khgk", images[index].id)
          }
        }

      }
      images?.map((item) => {
        ImageData.append(item?.column, item?.image);
      });
      ImageData.append("id", `[${IdArr}]`);
      PostImageDataWithToken(`pos/update-lead`, formData).then((response) => {
        if (response.status === true) {
          console.log("response data", response.data.id);
          // setCustomerId(response.data.id);
          // setCallFillDataApi(false)
          PostImageDataWithToken('pos/update-image', ImageData).then((response) => {
            if (response.status === true) {
              console.log("response data", response.data.id);
            }
          })
          // navigate('/quotations')
        } else {
          // setLoading(false)
          // sendErrorMessage(response)
        }
      });

      PostDataWithToken(`pos/update-customer`, allCustomerData).then((response) => {
        if (response.status === true) {
          console.log("response data", response.data.id);
          sendSuccessMessage(response);
          navigate(`/${type}/cases`);
        } else {
          // setLoading(false)
          sendErrorMessage(response);
          setLoading(false)
        }
      });
    }

    // if (
    //   customerApi == true &&
    //   Object.keys(personalData.ownerDetail).length > 0 &&
    //   Object.keys(personalData.personalDetail).length > 0
    // ) {
    //   console.log("bhjk", activeTab);
    //   let finalData = {
    //     id: allSingleData?.customerId,
    //     ...personalData.ownerDetail,
    //     ...personalData.personalDetail,
    //   };

    //   console.log("bhjk", finalData);
    //   PostDataWithToken(`pos/update-customer`, finalData).then((response) => {
    //     if (response.status === true) {
    //       console.log("response data", response.data.id);
    //       // setCustomerId(response.data.id)
    //       // setLoading(false)
    //       sendSuccessMessage(response);
    //       setAllData({
    //         basicDetails: {},
    //         policyDetail: {},
    //         document: [],
    //       });
    //       setPersonalData({
    //         ownerDetail: {},
    //         personalDetail: {},
    //       });
    //       navigate(`/${type}/cases`);
    //     } else {
    //       // setLoading(false)
    //       sendErrorMessage(response);
    //     }
    //   });
    // }
  }

  return (
    <>
      <div className="card p-4 mt-3">
        <small className="fw-bold fs-2">Documents</small>
        <div className="othervoption mt-3">
          <div className="row mx-0 px-0">
            {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.7.570/build/pdf.worker.min.js">
							<Viewer
								initialPage={0}
								fileUrl={"https://decentraland.org/whitepaper.pdf"}
							// plugins={[highlightPluginInstance]}
							/>
						</Worker> */}
            {
              images && images.length > 0 && images.map((item, index) => (

                <div className="col-lg-2 ps-lg-0">
                  <div className="position-relative mb-5">
                    <div className="doccont">
                      <input type="file" className="d-none" id={"abc" + index}
                        name={item.column} onChange={(e) => handleUploadFile(e, item.column)}
                      />
                      <label htmlFor={"abc" + index}>
                        {
                          images.find(img => img.column === item.column)?.preview ? (
                            images.find(img => img.column === item.column)?.image?.type?.includes("pdf") ?
                              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.7.570/build/pdf.worker.min.js">
                                <div style={{ width: "200px" }}>
                                  <Viewer
                                    // initialPage={0}
                                    fileUrl={images.find(img => img.column === item.column)?.preview}
                                  // plugins={[highlightPluginInstance]}
                                  />
                                </div>
                              </Worker>
                              : <img src={images.find(img => img.column === item.column)?.preview} className="docprev" alt="img" />
                          )

                            : <img src="/assets/images/Addimg.png" className="docprev" alt="img" />
                        }
                      </label>
                    </div>
                    <p className="my-3 fs-3">{item.column}</p>
                  </div>
                </div>
              ))
            }


            {PreviewImages && PreviewImages.length > 0 && PreviewImages.map((item, index) => (
              <div className="col-lg-2 ps-lg-0" key={index}>
                <div className="position-relative mb-5 text-center">
                  <div className="doccont">
                    {
                      <img src={item?.preview} className="docprev" alt="img" />
                    }
                  </div>
                  <p className="my-3 fs-3">{item.column}</p>
                </div>
              </div>
            ))

            }
            <div >
              <button className="btn btn-primary" onClick={toggle}>Add More document</button>
            </div>
            <div className="col-12" />
            <div className="col-lg-3 col-12 ps-lg-0">
              <button

                className="btn btn-primary mb-5 mt-3 py-3 w-100"
                onClick={() => submitDocumentDetails()}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={modal} centered toggle={toggle} className={modal}>
        <ModalHeader toggle={toggle}>Add more file</ModalHeader>
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
                  <input type="file" className="d-none" id={"abc"}
                    name={"image"} onChange={(e) => handleUploadOtherFile(e, documentName)}
                  />
                  <label htmlFor={"abc"}>
                    {
                      images.find(img => img.column === documentName)?.preview ?
                        images.find(img => img.column === documentName)?.image?.type?.includes("pdf") ?
                          <img src="/assets/images/pdf.png" className="docprev" alt="img" />
                          : <img src={images.find(img => img.column === documentName)?.preview} className="docprev" alt="img" />
                        : <img src="/assets/images/Addimg.png" className="docprev" alt="img" />
                    }


                  </label>
                </div>
                {/* <p className="my-3 fs-3">{item.option}</p> */}
              </div>


            </div>

            {/* <div className='text-end mt-5'>
							<button className='btn btn-primary ' onClick={toggle}>
								submit
							</button>
						</div> */}
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default EditDocument