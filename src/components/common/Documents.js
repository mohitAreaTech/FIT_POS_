import React, { useEffect, useState } from "react";
import { Document } from "./InputData/InsuranceInputData";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { submitInsuranceData } from "../services/posServices";
import { PostDataWithToken } from "../../api/apiHelper";
import { sendErrorMessage, sendSuccessMessage } from "../services/userServices";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import { Viewer, Worker } from '@react-pdf-viewer/core'

const Documents = ({ allPolicyData, toggleTab, allData }) => {
  // const [rcError, setRcError] = useState(false);
  // const [insuranceError, setInsuranceError] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const type = useSelector((state) => state?.root?.userDetails.type);

  const [images, setImages] = useState([
    {
      column: "rc_front",
      preview: "",
      image: "",
    },
    {
      column: "insurance_01",
      preview: "",
      image: "",
    },
  ]);
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    setDocumentName("");
  };
  const [documentName, setDocumentName] = useState("");
  const [PreviewImages, setPreviewImages] = useState([]);

  const handleUploadFile = (e, column) => {
    if (allData !== null) {
      const FilterImg = images.filter((e) => e.column !== column);
      const FilterImgId = allData?.policy_documents?.filter(
        (e) => e?.document_type === column
      );
      console.log("hjh", FilterImgId);
      const file = e.target.files[0];
      let arr = [...FilterImg];
      arr.push({
        column,
        image: file,
        preview: URL.createObjectURL(file),
        id: FilterImgId?.[0]?.id,
      });
      setImages(arr);
      console.log("bbbbbbb", arr);
    } else {
      const FilterImg = images.filter((e) => e.column !== column);
      // const FilterImgId = allData?.policy_documents?.filter(e => e?.document_type === column)
      // console.log("hjh", FilterImgId)
      const file = e.target.files[0];
      let arr = [...FilterImg];
      arr.push({
        column,
        image: file,
        preview: URL.createObjectURL(file),
        // id: FilterImgId?.[0]?.id
      });
      setImages(arr);
      console.log("bbbbbbb", arr);
    }
  };

  const handleUploadOtherFile = (e, column) => {
    const file = e.target.files[0];
    let arr = [];
    arr.push({
      column,
      image: file,
      preview: URL.createObjectURL(file),
    });
    setPreviewImages([...PreviewImages, ...arr]);
    setImages([...images, ...arr]);
    toggle();
  };

  useEffect(() => {
    if (allData !== null) {
      let arr = [];
      allData?.policy_documents?.map((item) => {
        arr.push({
          column: item?.document_type,
          image: item?.image,
          preview: item?.image,
          // id: item?.id
        });
      });
      setImages(arr);
    }
  }, [""]);

  const submitDocumentDetails = () => {
    if (!images.find((img) => img.column === "rc_front")?.preview) {
      toast.error("Rc Front is Required");
      return;
    }
    if (!images.find((img) => img.column === "insurance_01")?.preview) {
      toast.error("Insurance 1 is Required");
      return;
    }
    console.log("fin all", images);
    // toggleTab("4")
    if (Object.keys(allPolicyData.basicDetails).length > 0) {
      // console.log("bhjk", activeTab);
      // let finalData = {
      // 	...personal.ownerDetail,
      // 	...data,
      // };
      // console.log("bhjk", finalData);
      let formData = new FormData();
      Object.keys(allPolicyData?.basicDetails).forEach((key) => {
        formData.append(key, allPolicyData?.basicDetails[key]);
      });
      images?.forEach((item) => {
        formData.append(item?.column, item?.image);
      });
      // formData.append('customerId', customerId)
      formData.append("leadType", 1);
      formData.append("type", "offline");
      setLoading(true);
      submitInsuranceData(formData).then((response) => {
        if (response.status === true) {
          console.log("response data", response.data.id);

          PostDataWithToken(
            `pos/create-customer/${response.data.id}`,
            allPolicyData?.basicDetails
          ).then((response) => {
            if (response.status === true) {
              console.log("response data", response.data.id);
              sendSuccessMessage(response);
              navigate('/cases');
            } else {
              setLoading(false);
              sendErrorMessage(response);
            }
          });
          // navigate('/quotations')
        } else {
          setLoading(false);
          sendErrorMessage(response);
        }
      });
    }
  };

  return (
    <>
      <div className="card p-4 mt-3">
        <small className="fw-bold fs-3">Documents</small>
        <div className="othervoption mt-3">
          <div className="row mx-0 px-0">
           
            {Document &&
              Document.length > 0 &&
              Document.map((item, index) => (
                <div className="col-xl-2 col-lg-3 col-md-4 col-12 ">
                  <div className="position-relative mb-3">
                    <div className="doccont">
                      <input
                     
                        type="file"
                        className="d-none"
                        id={"abc" + index}
                        name={item.name}
                        onChange={(e) => handleUploadFile(e, item.name)}
                      />
                      <label htmlFor={"abc" + index}>
                        {images.find((img) => img.column === item.name)
                          ?.preview ? (
                          images
                            .find((img) => img.column === item.name)
                            ?.image?.type?.includes("pdf") ? (
                            <img
                            
                              src="/assets/images/pdf.png"
                              className="docprev"
                              alt="img"
                            />
                          ) : (
                            <img
                              src={
                                images.find((img) => img.column === item.name)
                                  ?.preview
                              }
                              className="docprev"
                              alt="img"
                            />
                          )
                        ) : (
                          <img
                            src="/assets/images/Addimg.png"
                            className="docprev"
                            alt="img"
                          />
                        )}
                      </label>
                    </div>
                    <p className="my-2 fs-6">{item.option}</p>
                  </div>
                </div>
              ))}

            {PreviewImages &&
              PreviewImages.length > 0 &&
              PreviewImages.map((item, index) => (
                <div className="col-xl-2 col-lg-3 col-md-4 col-12" key={index}>
                  <div className="position-relative mb-5 ">
                    <div className="doccont">
                      {item?.image?.type?.includes("pdf") ? (
                        <img
                          src="/assets/images/pdf.png"
                          className="docprev"
                          alt="img"
                        />
                      ) : (
                        <img
                          src={item?.preview}
                          className="docprev"
                          alt="img"
                        />
                      )}
                    </div>
                    <p className="my-3 fs-3">{item.column}</p>
                  </div>
                </div>
              ))}
            <div>
              <button
                className="btn btn-primary mb-2 mt-3 fs-6 py-3"
                onClick={toggle}
              >
                Add More document
              </button>
            </div>

            <div className="col-12" />

            <div className="col-lg-12 d-flex justify-content-center col-12 ps-lg-0 mt-5">
              <button
                className="btn btn-primary mt-3 fs-6 py-3 w-25"
                onClick={() => submitDocumentDetails()}
              >
                {loading == true ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Submit"
                )}
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

            <div className="col-xl-2 col-lg-3 col-md-4 col-12">
              <div className="position-relative mb-5 text-center">
                <div className="doccont">
                  <input
                    type="file"
                    className="d-none"
                    id={"abc"}
                    name={"image"}
                    onChange={(e) => handleUploadOtherFile(e, documentName)}
                  />
                  <label htmlFor={"abc"}>
                    {images.find((img) => img.column === documentName)
                      ?.preview ? (
                      images
                        .find((img) => img.column === documentName)
                        ?.image?.type?.includes("pdf") ? (
                        <img
                          src="/assets/images/pdf.png"
                          className="docprev"
                          alt="img"
                        />
                      ) : (
                        <img
                          src={
                            images.find((img) => img.column === documentName)
                              ?.preview
                          }
                          className="docprev"
                          alt="img"
                        />
                      )
                    ) : (
                      <img
                        src="/assets/images/Addimg.png"
                        className="docprev"
                        alt="img"
                      />
                    )}
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
  );
};

export default Documents;
