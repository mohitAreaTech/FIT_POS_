import React, { useEffect, useState } from 'react'
// import Header from "../common/Header";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { useForm } from 'react-hook-form'
import {
  Document,
  InsurerData,
  SubmitOfflinePolicyDocument
} from '../../common/InputData/InsuranceInputData'
import { submitInsuranceData } from '../../services/posServices'
import {
  GetData,
  GetDataWithToken,
  PostDataWithToken,
  PostImageDataWithToken
} from '../../../api/apiHelper'

import { useLocation, useNavigate } from 'react-router-dom'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { useSelector } from 'react-redux'
import SideBar from '../../common/SideBar'
import Header from '../../common/Header'
import { dispatchSubmitOffline } from '../../../store/actions/userAction'
import ReactSelect from 'react-select'
import {
  getVehicleMake,
  getVehicleModel,
  getVehiclePreviousInsurer,
  getVehicleVariant
} from '../../services/masterService'
import { toast } from 'react-toastify'
const SubmitOfflinePolicy = () => {
  const type = useSelector(state => state?.root?.userDetails.type)
  const apiRequestQQ = useSelector(state => state?.root?.apiRequestQQ)
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
    setDocumentName('')
  }
  const location = useLocation()
  const [documentName, setDocumentName] = useState('')
  // const singleData = location.state.allDetail
  // console.log("first fghj",singleData)
  const [pincode, setPincode] = useState(null)
  const [allRtoCode, setAllRtoCode] = useState([])
  const [allCompany, setAllCompany] = useState([])

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('1')
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1
  } = useForm({ mode: 'onBlur' })

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2
  } = useForm({ mode: 'onBlur' })

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
    reset: reset3
  } = useForm({ mode: 'onBlur' })

  const [images, setImages] = useState([])
  const [PreviewImages, setPreviewImages] = useState([])
  const [allPos, setAllPos] = useState([])
  const [loading, setLoading] = useState(false)
  const [RegistrationNumber, setRegistrationNumner] = useState('')
  const [vType, setVType] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [variant, setVariant] = useState('')
  const [makeData, setMakeData] = useState([])
  const [modelData, setModelData] = useState([])
  const [variantData, setVariantData] = useState([])
  const [caseType, setCaseType] = useState('')
  const [policyType, setPolicyType] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [policyDetails, setPolicyDetails] = useState({})
  const [insurerData, setInsurerData] = useState([])
  const [currentInsurer, setCurrentInsurer] = useState('')
  const submitOflineData = useSelector(state => state?.root?.submitOffline)
  const userDetails = useSelector(state => state?.root?.userDetails)
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }
  const [addFiles, setAddFiles] = useState({
    currentIssuedPolicy: null,
    currentIssuedPolicyPreview: null,
    rcFront: null,
    rcFrontPreview: null,
    rcBack: null,
    rcBackPreview: null,
    previousPolicy: null,
    previousPolicyPreview: null,
    salesLetter: null,
    salesLetterPreview: null,
    otherDocument: null,
    otherDocumentPreview: null
  })

  const handleUploadDocs = (e, type) => {
    console.log(e, type, 'Image New Function')
    if (!e.target.files[0].type.includes('image')) {
      console.log('Please Upload Image File')
    }
    if (type === 'current_issued_policy') {
      setAddFiles({
        ...addFiles,
        currentIssuedPolicy: e.target.files[0],
        currentIssuedPolicyPreview: URL.createObjectURL(e.target.files[0])
      })
    } else if (type === 'rc_front') {
      setAddFiles({
        ...addFiles,
        rcFront: e.target.files[0],
        rcFrontPreview: URL.createObjectURL(e.target.files[0])
      })
    } else if (type === 'rc_back') {
      setAddFiles({
        ...addFiles,
        rcBack: e.target.files[0],
        rcBackPreview: URL.createObjectURL(e.target.files[0])
      })
    } else if (type === 'previous_policy') {
      setAddFiles({
        ...addFiles,
        previousPolicy: e.target.files[0],
        previousPolicyPreview: URL.createObjectURL(e.target.files[0])
      })
    } else if (type === 'sales_letter') {
      setAddFiles({
        ...addFiles,
        salesLetter: e.target.files[0],
        salesLetterPreview: URL.createObjectURL(e.target.files[0])
      })
    } else if (type === 'other') {
      setAddFiles({
        ...addFiles,
        otherDocument: e.target.files[0],
        otherDocumentPreview: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  useEffect(() => {
    getVehiclePreviousInsurer().then(response => {
      if (
        response?.status === true &&
        response?.message === 'All Previous Insurers Fetched Successfully'
      ) {
        let i = 0
        let data = response.data
        let arr = []
        while (i < data.length) {
          let item = data[i]
          arr.push({
            option: item.Name,
            value: item.Digit_Code
          })
          i++
        }
        setInsurerData(arr)
      }
    })
  }, [])

  const handleUploadFile = (e, fieldname) => {
    console.log('e field Name', e, fieldname)
    const FilterImg = images.filter(img => img.fieldname !== fieldname)

    const file = e?.target?.files[0]

    if (file) {
      let arr = [...FilterImg]
      arr.push({
        fieldname,
        image: {
          file, // Save the entire file object
          preview: URL.createObjectURL(file)
        }
      })
      setImages(arr)
      console.log(arr)
    }
  }

  const handleUploadOtherFile = (e, column) => {
    const file = e.target.files[0]
    let arr = []
    arr.push({
      column,
      image: file,
      preview: URL.createObjectURL(file)
    })
    setPreviewImages([...PreviewImages, ...arr])
    setImages([...images, ...arr])
    toggle()
  }

  useEffect(() => {
    if (pincode?.length >= 6) {
      GetData(`pos/get-city?pincode=${pincode}`, '').then(response => {
        if (response.status == true) {
          console.log('first fgfhfdsdf', response.data.City)
          reset1({
            city: response?.data?.City,
            state: response?.data?.State
          })
        }
      })
    }
  }, [pincode])

  const formatReg = e => {
    var t = e
    t = t.replace(/-/g, '')
    var o = new Array(4)
    ;(o[0] = t.slice(0, 2)), (o[1] = ''), (o[2] = ''), (o[3] = '')
    try {
      isNaN(t.slice(2, 4))
        ? isNaN(t.slice(3, 4))
          ? (isNaN(t.slice(2, 3)) || (o[1] = t.slice(2, 3)),
            isNaN(t.slice(3, 4)) && (o[2] = t.slice(3, 4)))
          : (o[1] = t.slice(2, 3) + t.slice(3, 4))
        : (o[1] = t.slice(2, 4)),
        isNaN(t.slice(4, 8))
          ? ((o[2] = o[2] + t.slice(4, 5)),
            1 == isNaN(t.slice(5, 6)) && 1 == isNaN(t.slice(6, 7))
              ? (o[2] = o[2] + t.slice(5, 7))
              : (isNaN(t.slice(5, 6))
                  ? (o[2] = o[2] + t.slice(5, 6))
                  : (o[3] = o[3] + t.slice(5, 6)),
                isNaN(t.slice(6, 7)) || (o[3] = o[3] + t.slice(6, 7))),
            isNaN(t.slice(7, 11)) || (o[3] = o[3] + t.slice(7, 11)))
          : (o[3] = o[3] + t.slice(4, 8))
    } catch (e) {}
    return o
      .join('-')
      .replace(/ /g, '')
      .replace(/--/g, '-')
      .replace(/-\s*$/, '')
      .replace(/[^- 0-9 a-z A-z]/g, '')
  }

  const handlerto = e => {
    // console.log("fddd", value.slice(0, 4))

    if (navigator.userAgent.match(/UCBrowser/)) return !1
    var t = document.querySelector('#vinpuut').value,
      o = e.keyCode
    if (
      -1 != navigator.userAgent.indexOf('MSIE') ||
      1 == !!document.documentMode
    ) {
      if (32 == o || 8 == o) return !1
      t.length >= 3 && (t = formatReg(t)),
        t.length >= 5 && (t = formatReg(t)),
        t.length >= 7 && (t = formatReg(t)),
        (document.querySelector('#vinpuut').value = t.toUpperCase())
    } else
      setTimeout(function () {
        if (32 == o || 8 == o) return !1
        ;(t = document.querySelector('#vinpuut').value).length >= 3 &&
          (t = formatReg(t)),
          t.length >= 5 && (t = formatReg(t)),
          t.length >= 7 && (t = formatReg(t)),
          (document.querySelector('#vinpuut').value = t.toUpperCase())
      }, 100)

    if (e.target.value.length > 3) {
      console.log('fgdgfd', e.target.value.slice(0, 4).toUpperCase())

      let fvalue = e.target.value.slice(0, 2).toUpperCase()
      let lvalue = e.target.value.slice(3, 5).toUpperCase()
      console.log('first', fvalue, lvalue)
      reset1({
        rto: fvalue + lvalue
      })
    }
  }

  // Registration Number Regex

  const setRegistrationValue = e => {
    if (navigator.userAgent.match(/UCBrowser/)) return !1
    var t = document.querySelector('#vinpuut').value,
      o = e.keyCode
    if (
      -1 != navigator.userAgent.indexOf('MSIE') ||
      1 == !!document.documentMode
    ) {
      if (32 == o || 8 == o) return !1
      t.length >= 3 && (t = formatReg(t)),
        t.length >= 5 && (t = formatReg(t)),
        t.length >= 7 && (t = formatReg(t)),
        (document.querySelector('#vinpuut').value = t.toUpperCase())
    } else
      setTimeout(function () {
        if (32 == o || 8 == o) return !1
        ;(t = document.querySelector('#vinpuut').value).length >= 3 &&
          (t = formatReg(t)),
          t.length >= 5 && (t = formatReg(t)),
          t.length >= 7 && (t = formatReg(t)),
          (document.querySelector('#vinpuut').value = t.toUpperCase())
      }, 100)
    setRegistrationNumner(t)
  }

  // Get Make
  useEffect(() => {
    getVehicleMake({ Vehicle_Type: vType }).then(response => {
      if (response.status === true) {
        let data = response.data
        let i = 0
        let arr = []
        while (i < data.length) {
          let item = data[i]
          arr.push({
            label: item.Make,
            value: item.Make
          })
          i++
        }
        setMakeData(arr)
      }
    })
  }, [vType])

  const handleSelectMake = make => {
    setMake(make)
    getVehicleModel({ make: make, Vehicle_Type: vType }).then(response => {
      if (response.status === true) {
        let data = response.data
        let i = 0
        let arr = []
        while (i < data.length) {
          let item = data[i]
          arr.push({
            label: item.Model,
            value: item.Model
          })
          i++
        }
        setModelData(arr)
      }
    })
  }

  const handleSelectModel = model => {
    setModel(model)
    getVehicleVariant({
      make: make,
      model: model,
      Vehicle_Type: vType
    }).then(response => {
      if (response.status === true) {
        let data = response.data
        let fuelTypeArr = data.filter(
          (v, i, a) => a.findIndex(v2 => v2.Fuel_Type === v.Fuel_Type) === i
        )
        let j = 0
        let fuelarr = []
        while (j < fuelTypeArr.length) {
          fuelarr.push(fuelTypeArr[j].Fuel_Type)
          j++
        }
        let i = 0
        let arr = []
        while (i < data.length) {
          let item = data[i]
          arr.push({
            label: item.Variant,
            value: item.Vehicle_Code,
            Fuel_Type: item.Fuel_Type,
            Cubic_Capacity: item.Cubic_Capacity,
            Seating_Capacity: item.Seating_Capacity,
            HDFC: item.HDFC,
            Shriram: item.Shriram,
            Kotak: item.Kotak,
            Reliance: item.Reliance,
            Future: item.Future,
            Royal: item.Royal
          })
          i++
        }
        setVariantData(arr)
      }
    })
  }

  const handleSelectVariant = val => {
    setVariant(val?.label)
  }

  // Basic Details Submission
  const submitBasicDetails = data => {
    console.log(data, 'dataaa')
    dispatchSubmitOffline('FullName', data?.FullName)
    dispatchSubmitOffline('city', data?.city)
    dispatchSubmitOffline('email', data?.email)
    dispatchSubmitOffline('phone', data?.phone)
    dispatchSubmitOffline('state', data?.state)
    dispatchSubmitOffline('pincode', pincode)
    setActiveTab('2')
  }

  // Vehicle Details Submission
  const submitVehicleDetails = data => {
    dispatchSubmitOffline('RegistrationNumber', RegistrationNumber)
    dispatchSubmitOffline('VehicleType', vType)
    dispatchSubmitOffline('Make', make)
    dispatchSubmitOffline('Model', model)
    dispatchSubmitOffline('Variant', variant)
    dispatchSubmitOffline('CaseType', caseType)
    dispatchSubmitOffline('PolicyType', policyType)
    dispatchSubmitOffline('PolicyNumber', policyNumber)
    dispatchSubmitOffline('CurrentInsurer', currentInsurer)

    setActiveTab('3')
  }

  // Submit Offline Policy
  const submitOfflinePolicy = () => {
    const min = 10000000000
    const max = 99999999999
    const randomNumber = Math.floor(Math.random() * (max - min + 1) + min)
    console.log('submitOflineData?.policyType', submitOflineData)
    let data = {
      UniquePolicyId: randomNumber, // generate Random Unique id for this
      customerDetails: {
        customerName: submitOflineData?.FullName,
        customerMobileNumber: submitOflineData?.phone,
        customerEmailAddress: submitOflineData?.email,
        customerPincode: submitOflineData?.pincode,
        customerCity: submitOflineData?.city,
        customerState: submitOflineData?.state
      },
      pos_data: userDetails, // this will be in json format where i need all the details of pos from frontend
      vehicleDetails: {
        vehicleNumber: submitOflineData?.RegistrationNumber,
        vehicleMake: submitOflineData?.Make,
        vehicleModel: submitOflineData?.Model,
        vehicleVariant: submitOflineData?.Variant,
        caseType: submitOflineData?.CaseType,
        policyType: submitOflineData?.PolicyType,
        vehicleCategory: submitOflineData?.VehicleType,
        currentInsurer: submitOflineData?.CurrentInsurer,
        policy_number: submitOflineData?.PolicyNumber
      },
      Images: images,
      userType: 'pos'
    }

    const formData = new FormData()
    formData.append('UniquePolicyId', data.UniquePolicyId)
    formData.append('customerDetails', JSON.stringify(data.customerDetails))
    formData.append('pos_data', JSON.stringify(data.pos_data))
    formData.append('vehicleDetails', JSON.stringify(data.vehicleDetails))
    formData.append('userType', data.userType)
    formData.append('currentIssuedPolicy', addFiles.currentIssuedPolicy)
    formData.append('rcFront', addFiles.rcFront)
    formData.append('rcBack', addFiles.rcBack)
    formData.append('previousPolicy', addFiles.previousPolicy)
    formData.append('salesLetter', addFiles.salesLetter)
    formData.append('otherDocument', addFiles.otherDocument)

    const CurrentIssuedPolicy = addFiles.currentIssuedPolicy
    const rcFront = addFiles.rcFront
    const rcBack = addFiles.rcBack

    console.log(CurrentIssuedPolicy, rcBack, rcFront, '&&&&&&&&&')

    // if (CurrentIssuedPolicy && rcBack && rcFront) {
    PostImageDataWithToken('admin/add_submit_data', formData).then(res => {
      if (res?.success) {
        toast(res?.message, { type: 'success' })
        navigate('/pendingPolicy')
      } else {
        toast(res?.message, { type: 'error' })
      }
    })
    // }
    // else {
    //   toast('Please select Current Policy, RC-Front & RC-Back', {
    //     type: 'error'
    //   })
    // }
  }

  console.log('******', images)

  return (
    <>
      <div className=''>
        <SideBar />

        <section class=''>
          <div class=''>
            {/* <div id="main_div"> */}
            <Header />
            {/* </div> */}

            {/* <Header /> */}
            {/*----- Content Body Section Start -----*/}
            <section
              className={`${
                apiRequestQQ?.openSideBar ? 'content-body' : 'd-none'
              }`}
            >
              <div className='container-fluid'>
                {/*----- row Start -----*/}
                <div className='row'>
                  <div className='col-xl-12'>
                    {/*----- Quote Process Step Tab -----*/}
                    <Nav className='nav nav-pills pillwizard    text-center justify-content-center SubmitTitle-div'>
                      <NavItem className='nav-item position-relative'>
                        <NavLink
                          className={
                            activeTab === '1' || activeTab === '2' || activeTab === '3'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          // onClick={() => activeTab === '2' || '3' ? toggleTab("1") : toggleTab('1')}
                        >
                          Basic Details
                        </NavLink>
                      </NavItem>
                      <NavItem className='nav-item position-relative'>
                        <NavLink
                          className={
                            activeTab === '2' || activeTab === '3'
                              ? 'nav-link active toggle-none'
                              : 'nav-link  toggle-none'
                          }
                          // onClick={() => toggleTab("2")}
                        >
                          Vehicle Details
                        </NavLink>
                      </NavItem>
                      <NavItem className='nav-item position-relative'>
                        <NavLink
                          className={
                            activeTab === '3'
                              ? 'nav-link active toggle-none'
                              : 'nav-link  toggle-none'
                          }
                          // onClick={() => toggleTab("2")}
                        >
                          Documents
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent activeTab={activeTab}>
                      <TabPane tabId='1'>
                        <form onSubmit={handleSubmit1(submitBasicDetails)}>
                          <div className='card  mt-3 SubmitOffline-div'>
                            <div className='othervoption'>
                              <div className='row mx-0 px-0'>
                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant input-group'>
                                      <input
                                        type='text'
                                        className='did-floating-input'
                                        id='Cusname'
                                        {...register1('FullName', {
                                          required: 'Field is required',
                                          pattern: {
                                            message: `Please fill valid phone no`
                                          }
                                        })}
                                        placeholder=''
                                      />
                                      {/* <span className="text-danger">*</span> */}
                                      <label className='did-floating-label'>
                                        Customer Full Name
                                      </label>
                                    </div>
                                    <span className='text-danger mb-3'>
                                      {errors1?.FullName?.message}
                                    </span>
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant input-group'>
                                      <input
                                        type='number'
                                        className='did-floating-input'
                                        // className="form-control"
                                        id='Cusname'
                                        {...register1('phone', {
                                          required: 'Field is required',
                                          pattern: {
                                            value:
                                              /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/,
                                            message: 'Invalid Mobile Number'
                                          }
                                        })}
                                        onInput={e =>
                                          (e.target.value =
                                            e.target.value.slice(0, 10))
                                        }
                                        placeholder=''
                                      />
                                      <label className='did-floating-label'>
                                        Contact Number
                                        {/* <span className="text-danger">*</span> */}
                                      </label>
                                    </div>
                                    <span className='text-danger'>
                                      {errors1?.phone?.message}
                                    </span>
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant input-group'>
                                      <input
                                        type='email'
                                        className='did-floating-input'
                                        // className="form-control"
                                        id='Cusname'
                                        {...register1('email', {
                                          required: 'Field is required',
                                          pattern: {
                                            value:
                                              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                            message: 'Incorrect email format'
                                          }
                                        })}
                                        placeholder=''
                                      />
                                      <label className='did-floating-label'>
                                        Email Address
                                        {/* <span className="text-danger">*</span> */}
                                      </label>
                                    </div>
                                    <span className='text-danger mb-3'>
                                      {errors1?.email?.message}
                                    </span>
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant input-group'>
                                      <input
                                        type='text'
                                        className='did-floating-input'
                                        // className="form-control"
                                        id='Cusname'
                                        {...register1('pincode', {
                                          required: 'Field is Required',
                                          onChange: e =>
                                            setPincode(e.target.value)
                                        })}
                                        min={'6'}
                                        maxLength={'6'}
                                        placeholder=''
                                      />
                                      <label className='did-floating-label'>
                                        Pincode
                                        {/* <span className="text-danger">*</span> */}
                                      </label>
                                    </div>
                                    <span className='text-danger'>
                                      {errors1?.pincode?.message}
                                    </span>
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant input-group'>
                                      <input
                                        type='text'
                                        className='did-floating-input'
                                        // className="form-control"
                                        id='Cusname'
                                        {...register1('city', {
                                          required: 'Field is required'
                                        })}
                                        placeholder=''
                                      />
                                      <label className='did-floating-label'>
                                        City
                                        {/* <span className="text-danger">*</span> */}
                                      </label>
                                    </div>
                                    <span className='text-danger mb-3'>
                                      {errors1?.city?.message}
                                    </span>
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant input-group'>
                                      <input
                                        type='text'
                                        className='did-floating-input'
                                        // className="form-control"
                                        id='Cusname'
                                        {...register1('state', {
                                          required: 'Field is required'
                                        })}
                                        placeholder=''
                                      />
                                      <label className='did-floating-label'>
                                        State
                                        {/* <span className="text-danger">*</span> */}
                                      </label>
                                    </div>
                                    <span className='text-danger mb-3'>
                                      {errors1?.state?.message}
                                    </span>
                                  </div>
                                </div>

                                <div className='col-12' />
                                <div className='col-lg-12 col-12 ps-lg-0 d-flex justify-content-center'>
                                  <button
                                    type='submit'
                                    className='btn btn-primary d-flex justify-content-center updated-button'
                                  >
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
                      <TabPane tabId='2'>
                        <form onSubmit={handleSubmit2(submitVehicleDetails)}>
                          <div className='card SubmitOffline-div mt-3'>
                            <div className='othervoption mt-3'>
                              <div className='row mx-0 px-0'>
                                {/* Registration Number */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant input-group'>
                                      <input
                                        type='text'
                                        className='did-floating-input'
                                        // className="form-control"
                                        id='vinpuut'
                                        {...register2('VehicleNumber', {
                                          required: 'Field is required',
                                          onChange: e =>
                                            setRegistrationValue(
                                              e?.target?.value
                                            )
                                        })}
                                        placeholder=''
                                      />
                                      <label className='did-floating-label'>
                                        Vehicle Number
                                        {/* <span className="text-danger">*</span> */}
                                      </label>
                                    </div>
                                    <span className='text-danger'>
                                      {errors2?.VehicleNumber?.message}
                                    </span>
                                  </div>
                                </div>

                                {/* Vehicle Type */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant'>
                                      <select
                                        className='did-floating-select text-truncate'
                                        id='vType'
                                        name='vType'
                                        {...register2('vType', {
                                          required:
                                            'Please Select Vehicle Type',
                                          onChange: e =>
                                            setVType(e?.target?.value)
                                        })}
                                      >
                                        <option key='' value='' selected>
                                          Select Vehicle Type
                                        </option>
                                        <option key='' value='Pvt Car'>
                                          Pvt Car
                                        </option>
                                        <option key='' value='MotorBike'>
                                          Two Wheeler
                                        </option>
                                        <option
                                          key=''
                                          value='Passenger Carrying'
                                        >
                                          Passenger Carrying Vehicle (PCV)
                                        </option>
                                        <option key='' value='Goods Carrying'>
                                          Goods Carrying Vehicle (GCV)
                                        </option>
                                        <option key='' value='misd'>
                                          MISD
                                        </option>
                                        <option key='' value='trailer'>
                                          Trailer
                                        </option>
                                      </select>
                                      {/* <label htmlFor="Cusname">
                                        Vehicle Type
                                        <span className="text-danger">*</span>
                                      </label> */}
                                    </div>
                                    <span className='text-danger'>
                                      {errors2?.vType?.message}
                                    </span>
                                  </div>
                                </div>

                                {/* Make */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div>
                                      <ReactSelect
                                        options={makeData}
                                        // className="text-truncate"
                                        // className=""
                                        name='make'
                                        placeholder='Select Manufacturer'
                                        onChange={val =>
                                          handleSelectMake(val.value)
                                        }
                                      />
                                    </div>
                                    <span className='text-danger'>
                                      {errors2?.Make?.message}
                                    </span>
                                  </div>
                                </div>

                                {/* Model */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div>
                                      <ReactSelect
                                        options={modelData}
                                        // className="text-truncate"
                                        // className="form-select"
                                        name='model'
                                        placeholder='Select vehicle modal'
                                        onChange={val =>
                                          handleSelectModel(val.value)
                                        }
                                      />
                                    </div>
                                    <span className='text-danger'>
                                      {errors2?.Make?.message}
                                    </span>
                                  </div>
                                </div>

                                {/* Variant */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div>
                                      <ReactSelect
                                        options={variantData}
                                        // className="form-select"
                                        name='make'
                                        placeholder='Select Variant'
                                        onChange={val =>
                                          handleSelectVariant(val)
                                        }
                                      />
                                    </div>
                                    <span className='text-danger'>
                                      {errors2?.Make?.message}
                                    </span>
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contont'>
                                      <select
                                        className='did-floating-select text-truncate'
                                        onChange={e =>
                                          setCaseType(e?.target?.value)
                                        }
                                      >
                                        <option>Select Case Type</option>
                                        <option value='new'>New</option>
                                        <option value='rollover'>
                                          Rollover
                                        </option>
                                        <option value='rollover-breakin'>
                                          Rollover Break in
                                        </option>
                                        <option value='used'>
                                          Used Vehicle
                                        </option>
                                      </select>

                                      {/* <label htmlFor="Cusname">
                                        Case Type
                                        <span className="text-danger">*</span>
                                      </label> */}
                                    </div>
                                    {/* <span className="text-danger">
                                      {errors?.city?.message}
                                    </span> */}
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant'>
                                      <select
                                        className='did-floating-select text-truncate'
                                        onChange={e =>
                                          setPolicyType(e?.target?.value)
                                        }
                                      >
                                        <option>Select Policy Type</option>
                                        <option value='Comprehensive'>
                                          Comprehensive
                                        </option>
                                        <option value='ThirdParty'>
                                          Third Party
                                        </option>
                                        <option value='ODOnly'>
                                          Own Damage
                                        </option>
                                      </select>

                                      {/* <label htmlFor="Cusname">
                                        Policy Type
                                        <span className="text-danger">*</span>
                                      </label> */}
                                    </div>
                                    {/* <span className="text-danger">
                                      {errors?.city?.message}
                                    </span> */}
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='did-floating-contant input-group'>
                                      <input
                                        type='text'
                                        className='did-floating-input'
                                        // className="form-control"
                                        id='policy_number'
                                        {...register2('policy_number', {
                                          required: 'Field is required',
                                          onChange: e =>
                                            setPolicyNumber(e?.target?.value)
                                        })}
                                        placeholder=''
                                      />
                                      <label className='did-floating-label'>
                                        Policy Number
                                        {/* <span className="text-danger">*</span> */}
                                      </label>
                                    </div>
                                    <span className='text-danger'>
                                      {errors2?.policy_number?.message}
                                    </span>
                                  </div>
                                </div>

                                <div className='col-xl-3 col-lg-6 col-md-6 col-12 col-sm-6'>
                                  <div className='position-relative'>
                                    <div className='did-floating-label-content'>
                                      <select
                                        className='did-floating-select'
                                        id='currentInsurer'
                                        name='currentInsurer'
                                        {...register2('currentInsurer', {
                                          required: 'Field is required',
                                          onChange: e =>
                                            setCurrentInsurer(e?.target?.value)
                                        })}
                                      >
                                        <option className='d-none' selected>
                                          Current Policy Insurer
                                        </option>
                                        {insurerData &&
                                          insurerData.length > 0 &&
                                          insurerData.map((item, i) => (
                                            <option key={i} value={item.option}>
                                              {item.option}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>
                                  {errors2?.currentInsurer && (
                                    <span className='text-danger'>
                                      {errors2?.currentInsurer?.message}
                                    </span>
                                  )}
                                </div>

                                <div className='col-12' />
                                <div className='col-lg-12 col-12 ps-lg-0 d-flex justify-content-center gy-3'>
                                  <button
                                    type='submit'
                                    onClick={() => toggleTab('1')}
                                    className='btn btn-outline-primary d-flex justify-content-center updated-button me-5'
                                  >
                                    Previous
                                  </button>
                                  <button
                                    type='submit'
                                    className='btn btn-primary d-flex justify-content-center updated-button'
                                  >
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
                      <TabPane tabId='3'>
                        <div className='card SubmitOffline-div mt-3'>
                          <div className='othervoption mt-3'>
                            <div className='row mx-0 px-0'>
                              {SubmitOfflinePolicyDocument &&
                                SubmitOfflinePolicyDocument.length > 0 &&
                                SubmitOfflinePolicyDocument.map(
                                  (item, index) => (
                                    <div className='col-xl-4 col-lg-4 col-md-4 col-12 d-flex justify-content-center'>
                                      <div className='position-relative mb-5'>
                                        <p className='my-3 text-update'>
                                          {item.option}
                                        </p>
                                        <div className='doccont'>
                                          <input
                                            type='file'
                                            className=''
                                            id={'abc' + index}
                                            name={item.name}
                                            onChange={e =>
                                              // handleUploadFile(e, item.name)
                                              handleUploadDocs(e, item?.name)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}

                              <div
                                className='col-4
                              '
                              />

                              <div className='col-xl-12 col-lg-3 col-md-4 col-12 d-flex justify-content-center'>
                                <button
                                  type='submit'
                                  onClick={() => toggleTab('2')}
                                  className='btn btn-outline-primary d-flex justify-content-center updated-button me-5'
                                >
                                  Previous
                                </button>
                                <a
                                  href='javascript:void(0);'
                                  className='btn btn-primary updated-button'
                                  onClick={() => submitOfflinePolicy()}
                                >
                                  {loading == true ? (
                                    <span className='spinner-border spinner-border-sm'></span>
                                  ) : (
                                    'Submit'
                                  )}
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
            <Modal
              isOpen={modal}
              centered
              toggle={toggle}
              className='modal update-button2'
            >
              <ModalHeader toggle={toggle}>Add more file</ModalHeader>
              <ModalBody>
                <div className='col-lg-12 col-12 ps-lg-0 '>
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
                          onChange={e => handleUploadOtherFile(e, documentName)}
                        />
                        <label htmlFor={'abc'}>
                          {images.find(img => img.column === documentName)
                            ?.preview ? (
                            <img
                              src={
                                images.find(img => img.column === documentName)
                                  ?.preview
                              }
                              className='docprev'
                              alt='img'
                            />
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

                  {/* <div className='text-end mt-5'>
							<button className='btn btn-primary ' onClick={toggle}>
								submit
							</button>
						</div> */}
                </div>
              </ModalBody>
            </Modal>
          </div>
        </section>
      </div>
    </>
  )
}

export default SubmitOfflinePolicy
