import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { useForm } from "react-hook-form";
import { Document, InsurerData, SubmitOfflinePolicyDocument } from "../common/InputData/InsuranceInputData";
// import { submitInsuranceData } from "../Services/posServices";
import { GetData, PostDataWithToken, PostImageDataWithToken } from "../../api/apiHelper";

import { useLocation, useNavigate } from "react-router-dom";
import { sendErrorMessage, sendSuccessMessage } from "../services/userServices";
// import { Helmet } from "react-helmet";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
const EditSubmitOfflinePolicy = () => {
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
        setDocumentName('')
    }
    const location = useLocation()
    const [documentName, setDocumentName] = useState('')
    const singleData = location.state.allDetail
    console.log("first fghj", singleData)
    const [pincode, setPincode] = useState(null)
    const [allRtoCode, setAllRtoCode] = useState([])
    const [allCompany, setAllCompany] = useState([])

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ mode: "onBlur" });
    const [images, setImages] = useState([])
    const [PreviewImages, setPreviewImages] = useState([])


    const [policyDetails, setPolicyDetails] = useState({});
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        reset({
            policy_no: singleData?.customer?.misInsurance?.policy_no,
            case_type: singleData?.customer?.misInsurance?.case_type,
            policy_type: singleData?.customer?.misInsurance?.policy_type,
            vehicle_type: singleData?.customer?.misInsurance?.vehicle_type,
            vehicle_no: singleData?.customer?.misInsurance?.vehicle_no,
            first_name: singleData?.customer?.first_name,
            last_name: singleData?.customer?.last_name,
            phone: singleData?.customer?.phone,
            email: singleData?.customer?.email,
            city: singleData?.customer?.city,
            state: singleData?.customer?.state,
            insurance_company: singleData?.customer?.misInsurance?.insurance_company,
            payment_mode: singleData?.customer?.misInsurance?.payment_mode,


        })
        setPincode(singleData?.customer?.pincode)

        let arr = []

        singleData?.policy_documents?.map((item) => {
            arr.push({
                column: item?.document_type,
                image: item?.image,
                preview: item?.image,
                id: item?.id
            })
        })

        setImages(arr)
    }, [''])

    useEffect(() => {
        if (pincode?.length >= 6) {
            GetData(`pos/get-city?pincode=${pincode}`, '')
                .then((response) => {
                    if (response.status == true) {
                        console.log("first fgfhfdsdf", response.data.City)
                        reset({
                            city: response?.data?.City,
                            state: response?.data?.State
                        })
                    }
                })
        }
    }, [pincode])

    useEffect(() => {
        GetData(`pos/get-rto`, '')
            .then((response) => {
                if (response.status == true) {
                    console.log("first rto", response.data)
                    setAllRtoCode(response.data)
                    reset({
                        rto: singleData?.customer?.misInsurance?.rto,
                    })
                }
            })

        GetData(`pos/get-company`, '')
            .then((response) => {
                if (response.status == true) {
                    console.log("first rto", response.data)
                    setAllCompany(response.data)
                    reset({
                        insurance_company: singleData?.customer?.misInsurance?.insurance_company,
                    })
                }
            })

    }, [''])



    const handleUploadFile = (e, column) => {
        const FilterImg = images.filter(e => e.column !== column)
        const FilterImgId = images.filter(e => e.column == column)
        const file = e.target.files[0];
        let arr = [...FilterImg];
        arr.push({
            column,
            image: file,
            preview: URL.createObjectURL(file),
            id: FilterImgId?.id
        })
        setImages(arr);
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

    const onSubmit = (data) => {
        setPolicyDetails(data);
        setActiveTab("2");
    };


    const handleSubmitPolicy = () => {
        const formData = new FormData();
        for (let key in policyDetails) {
            formData.append(key, policyDetails[key]);
        }

        formData.append("pincode", pincode)
        formData.append("leadType", 2);
        formData.append('type', "offline")
        formData.append('id', singleData?.customer?.misInsurance?.id)

        let ImageData = new FormData();
        let IdArr = []


        images?.forEach((item) => {
            ImageData.append(item?.column, item?.image);
            IdArr.push(item.id)
        });
        ImageData.append("id", `[${IdArr}]`);
        PostImageDataWithToken(`pos/update-lead`, formData).then((response) => {
            if (response.status === true) {
                console.log("response data", response.data.id);
                // setCustomerId(response.data.id);
                // setLoading(false)
                // sendSuccessMessage(response);
                // setCallFillDataApi(false)


                PostImageDataWithToken('pos/update-image', ImageData).then((response) => {
                    if (response.status === true) {
                        console.log("response data", response.data.id);
                        sendSuccessMessage(response);
                    }
                })
                // navigate('/quotations')
            } else {
                // setLoading(false)
                // sendErrorMessage(response)
            }
        });
    };



    console.log("hh", images)
    return (
        <>

            <Header />
            {/*----- Content Body Section Start -----*/}
            <section className="content-body px-lg-5 px-3 mt-5">
                <div className="container-fluid">
                    {/*----- row Start -----*/}
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="d-flex my-4 justify-content-between align-items-center">
                                <h1 className="">Get Your Vehicle Insurance Quote Now</h1>
                                <nav>
                                    {/* <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="NewPos.html">Home</a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="ofreq.html">Reques Offline Policy</a>
                                        </li>
                                        <li className="breadcrumb-item active">Basic Details</li>
                                    </ol> */}
                                </nav>
                            </div>
                            {/*----- Quote Process Step Tab -----*/}
                            <Nav className="nav nav-pills pillwizard mb-3 text-center justify-content-center">
                                <NavItem className="nav-item position-relative">
                                    <NavLink className="nav-link active" onClick={() => toggleTab("1")}>
                                        Basic Details
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item position-relative">
                                    <NavLink className="nav-link  toggle-none" onClick={() => toggleTab("2")}>
                                        Documents
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="card p-4 mt-3">
                                            <p className="mb-4 fs-2 fw-bold">Basic Details</p>
                                            <div className="othervoption mt-5">
                                                <div className="row mx-0 px-0">
                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative">
                                                            <div className="form-floating inother">
                                                                <input
                                                                    type="text"
                                                                    {...register("policy_no", {
                                                                        required: "Field is required",
                                                                    })}
                                                                    className="form-control"
                                                                    id="pnum"
                                                                    placeholder=" Enter Policy Number"
                                                                />
                                                                <label htmlFor="pnum">
                                                                    Enter Policy Number
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                            <span className="text-danger">{errors?.policy_no?.message}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-12">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating">
                                                                <select
                                                                    className="form-select"
                                                                    {...register("case_type", {
                                                                        required: "Field is required",
                                                                    })}
                                                                    id="casetype"
                                                                >
                                                                    <option className="d-none" value="">
                                                                        Select Case Type
                                                                    </option>
                                                                    <option value="rollover">Rollover</option>
                                                                    <option value="new">New</option>
                                                                    <option value="used">Used</option>
                                                                    <option value="rollover_breakin">Rollover breakin</option>
                                                                </select>
                                                                <label htmlFor="casetype">
                                                                    Case type
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                            <span className="text-danger">{errors?.case_type?.message}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating">
                                                                <select
                                                                    className="form-select"
                                                                    {...register("policy_type", {
                                                                        required: "field is required",
                                                                    })}
                                                                    id="polytype"
                                                                >
                                                                    <option className="d-none" value="">
                                                                        Select Policy Type
                                                                    </option>
                                                                    <option value="comprehensive"> Comprehensive</option>
                                                                    <option value="third_party">Third party</option>
                                                                    <option value="own_damage">Own damage</option>
                                                                </select>
                                                                <label htmlFor="polytype">
                                                                    Policy type
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                            <span className="text-danger">{errors?.policy_type?.message}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating">
                                                                <select
                                                                    className="form-select"
                                                                    {...register("vehicle_type", {
                                                                        required: "Field is required",
                                                                    })}
                                                                    id="vtype"
                                                                >
                                                                    <option className="d-none" value="">
                                                                        Select Vehicle type
                                                                    </option>
                                                                    <option value={"Pvt Car"}>Pvt Car</option>
                                                                    <option value="MotorBike">MotorBike</option>
                                                                    <option value="Scooter">Scooter</option>
                                                                    <option value="Passenger Carrying">Passenger Carrying</option>
                                                                    <option value="Goods Carrying">Goods Carrying</option>
                                                                    <option value="Miscellaneous">Miscellaneous</option>
                                                                    <option value="Trailer">Trailer</option>
                                                                </select>
                                                                <label htmlFor="vtype">
                                                                    Vehicle type
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{errors?.vehicle_type?.message}</span>
                                                    </div>
                                                    <div className="col-lg-4 col-12">
                                                        <div className="position-relative">
                                                            <div className="form-floating inother">
                                                                <input
                                                                    type="input"
                                                                    {...register("vehicle_no", {
                                                                        required: "Field is required",
                                                                        pattern: {
                                                                            value: /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/,
                                                                            message: "Incorrect registration numner",
                                                                        },
                                                                    })}
                                                                    className="form-control"
                                                                    id="VNM3"
                                                                    placeholder=" Enter Vehicle Registration Number"
                                                                />
                                                                <label htmlFor="VNM3">
                                                                    Enter Vehicle Registration Number
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                            <span className="text-danger">{errors?.vehicle_no?.message}</span>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating inother">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="Cusname"
                                                                    {...register("first_name", {
                                                                        required: "Field is required",
                                                                    })}
                                                                    placeholder=" Enter Customer Name"
                                                                />
                                                                <label htmlFor="Cusname">
                                                                    Customer First Name
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{errors?.first_name?.message}</span>
                                                    </div>

                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating inother">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="Cusname"
                                                                    {...register("last_name", {
                                                                        required: "Field is required",
                                                                    })}
                                                                    placeholder=" Enter Customer Last Name"
                                                                />
                                                                <label htmlFor="Cusname">
                                                                    Customer Last Name
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{errors?.last_name?.message}</span>
                                                    </div>

                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating inother">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    id="Cusname"
                                                                    {...register("phone", {
                                                                        required: "Field is required",
                                                                    })}
                                                                    placeholder=" Enter Customer Phone no"
                                                                />
                                                                <label htmlFor="Cusname">
                                                                    Customer Phone No
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{errors?.phone?.message}</span>
                                                    </div>

                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating inother">
                                                                <input
                                                                    type="email"
                                                                    className="form-control"
                                                                    id="Cusname"
                                                                    {...register("email", {
                                                                        // required: "Field is required",
                                                                    })}
                                                                    placeholder=" Enter Customer Email"
                                                                />
                                                                <label htmlFor="Cusname">
                                                                    Customer Email
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{errors?.email?.message}</span>
                                                    </div>

                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating inother">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="Cusname"
                                                                    onChange={(e) => setPincode(e.target.value)}
                                                                    min={"6"}
                                                                    maxLength={"6"}
                                                                    placeholder=" Enter Customer Pincode"
                                                                    value={pincode}
                                                                />
                                                                <label htmlFor="Cusname">
                                                                    Pincode
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{errors?.pincode?.message}</span>
                                                    </div>

                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
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
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{errors?.city?.message}</span>
                                                    </div>

                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
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
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <span className="text-danger">{errors?.state?.message}</span>
                                                    </div>

                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating">
                                                                <select
                                                                    className="form-select"
                                                                    {...register("insurance_company", {
                                                                        required: "Field is required",
                                                                    })}
                                                                    id="insurer1"
                                                                >
                                                                    <option className="d-none" value="">
                                                                        Select Insurer
                                                                    </option>
                                                                    {allCompany && allCompany.length > 0 && allCompany.map((item, i) => (
                                                                        <option value={item.name} key={i}>{item.name}</option>
                                                                    ))}
                                                                </select>
                                                                <label htmlFor="insurer1" className="floatinglabel">
                                                                    Insurer Name
                                                                </label>
                                                            </div>
                                                            <span className="text-danger">{errors?.required_insurance_company?.message}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-12">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating">
                                                                <select
                                                                    className="form-select"
                                                                    {...register("payment_mode", {
                                                                        required: "Field is required",
                                                                    })}
                                                                    id="paymode"
                                                                >
                                                                    <option className="d-none" value="">
                                                                        Select Payment Mode
                                                                    </option>
                                                                    <option value="online ">Online </option>
                                                                    <option value="cheque">Cheque</option>
                                                                    <option value="DD">DD</option>
                                                                </select>
                                                                <label htmlFor="paymode">
                                                                    Payment Mode
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                            </div>
                                                            <span className="text-danger">{errors?.payment_mode?.message}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-12 ps-lg-0">
                                                        <div className="position-relative mb-5">
                                                            <div className="form-floating">
                                                                <select
                                                                    className="form-select"
                                                                    id="RTO"
                                                                    {...register("rto", {
                                                                        required: "Field is required",
                                                                    })}
                                                                >
                                                                    <option className="d-none" value="">
                                                                        Select RTO City
                                                                    </option>
                                                                    {allRtoCode && allRtoCode.length > 0 && allRtoCode.map((item, key) => (

                                                                        <option value={item?.RTO_Code}>{item?.registered_city_name} ({item?.RTO_Code})</option>
                                                                    ))}
                                                                </select>
                                                                <label htmlFor="RTO" className="floatinglabel">
                                                                    RTO/city
                                                                </label>
                                                            </div>
                                                            <span className="text-danger">{errors?.rto?.message}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-12" />
                                                    <div className="col-lg-3 col-12 ps-lg-0">
                                                        <button type="submit" className="btn btn-primary mb-5 mt-3 py-3 w-100">
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </TabPane>
                            </TabContent>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="2">
                                    <div className="card p-4 mt-3">
                                        <small className="fw-bold">Documents</small>
                                        <div className="othervoption mt-3">
                                            <div className="row mx-0 px-0">
                                                {
                                                    SubmitOfflinePolicyDocument && SubmitOfflinePolicyDocument.length > 0 && SubmitOfflinePolicyDocument.map((item, index) => (

                                                        <div className="col-lg-2 ps-lg-0">
                                                            <div className="position-relative mb-5 text-center">
                                                                <div className="doccont">
                                                                    <input type="file" className="d-none" id={"abc" + index}
                                                                        name={item.name} onChange={(e) => handleUploadFile(e, item.name)}
                                                                        accept={item.type == 'file' ? "image/*" : ''} />
                                                                    <label htmlFor={"abc" + index}>
                                                                        {
                                                                            images.find(img => img.column === item.name)?.preview ?
                                                                                <img src={images.find(img => img.column === item.name)?.preview} className="docprev" alt="img" />
                                                                                : <img src="/assets/images/Addimg.png" className="docprev" alt="img" />
                                                                        }
                                                                    </label>
                                                                </div>
                                                                <p className="my-3 fs-3">{item.option}</p>
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
                                                    <a
                                                        href="javascript:void(0);"
                                                        className="btn btn-primary mb-5 mt-3 py-3 w-100"
                                                        onClick={() => handleSubmitPolicy()}
                                                    >
                                                        Next
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabPane>
                            </TabContent>
                        </div>
                    </div>
                </div>
                {/*----- row End -----*/}
            </section>
            {/*----- Content Body Section End -----*/}
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
                                                <img src={images.find(img => img.column === documentName)?.preview} className="docprev" alt="img" />
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
    );
};

export default EditSubmitOfflinePolicy;
