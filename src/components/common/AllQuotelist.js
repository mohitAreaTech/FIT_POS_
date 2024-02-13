import React, { useEffect, useState, useNa } from 'react'
import './allQuotelist.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useNavigation } from 'react-router-dom'
import Header from './Header'
import {
  dispatchQuickQuote,
  resetQuickQuoteResults,
  selectedPlanAction
} from '../../store/actions/userAction'
import {
  FutureGeneralQuickQuote,
  HDFCCalculatePremium,
  KotakAPICall,
  RelianceAPICall,
  RoyalSundramAPICall,
  bajajApiCall,
  digitAPICall,
  shriramGenerateProposal
} from '../utility/TPApiCall'
import { getVehiclePreviousInsurer } from '../services/masterService'
import moment from 'moment'
import EditVehicleDetails from './EditVehicleDetails'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import ReactSelect from 'react-select'
import Select from 'react-select'
import SideBar from './SideBar'

const AllQuotelist = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [modelIdv, setModelIdv] = useState('')
  const [NewPolicyType, SetNewPolicyType] = useState('')
  const [prevoisNCB, setPrevoiusNCB] = useState(0)
  const [insurerData, setInsurerData] = useState([])
  const [idvInput, setIdvInput] = useState(false)
  const [idv, setIdv] = useState(0)
  const [customIdv, setCustomIdv] = useState('')
  const QuickQouteResult = useSelector(state => state?.root?.QuickQouteResult)
  const apiRequestQQ = useSelector(state => state?.root?.apiRequestQQ)
  const [loading, setLoading] = useState(
    QuickQouteResult.length > 0 ? false : true
  )
  const [filter, setFilter] = useState({
    RoadSideAssistance: false,
    EngineProtection: false,
    TyreProtection: false,
    RimProtection: false,
    Consumables: false,
    IsElectricalAccessories: false,
    IsNonElectricalAccessories: false,
    PersonalAccident: false,
    InvoiceCover: false,
    EngineGearBox: false,
    NCBProtection: false,
    VoluntaryDeductive: false,
    PassengerCover: false,
    LossOfPersonalBelongings: false,
    ZeroDepriciationCover: false,
    KeyReplacement: false,
    LiabilitiesToPaidDriver: false,
    ElectricAmount: 0,
    NonElectricAmount: 0,
    PassengerCoverAmount: 0,
    VoluntaryDeductiveAmount: 0,
    NoOfLegelDrives: 0
  })
  const [modal1, setModal1] = useState(false)
  const toggleModal1 = () => setModal1(!modal1)

  const [modal2, setModal2] = useState(false)
  const toggleModal2 = () => setModal2(!modal2)
  const [planDetail, setPlanDetail] = useState(null)

  const [ODModal, setODModal] = useState(false)
  const toggleODModal = () => setODModal(!ODModal)

  const toggleModal = () => setModal(!modal)
  const [modal, setModal] = useState(false)

  const [idvModal, setIdvModal] = useState(false)
  const toggleIdvModal = () => setIdvModal(!idvModal)

  useEffect(() => {
    // setPrevoiusNCB(apiRequestQQ.PreviousNoClaimBonus)
    // if (apiRequestQQ.PanImage === '' || apiRequestQQ.PanNumber === '') {
    //   toggleModal1()
    // }
  }, [])

  useEffect(() => {
    if (loading === true) {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
    if (apiRequestQQ.NewPolicyType == 'ODOnly') {
      getVehiclePreviousInsurer().then(response => {
        if (response.status === true) {
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
    }
  }, [loading])

  useEffect(() => {
    setPrevoiusNCB(apiRequestQQ.PreviousNoClaimBonus)
    let addOns = apiRequestQQ.AddOns
    if (apiRequestQQ.isFiltered === true) {
      let obj = new Object()
      for (let key in addOns) {
        obj[key] = addOns[key]
      }
      setFilter(obj)
    }
  }, [apiRequestQQ])

  const Covres = [
    {
      label: 'Personal Accident Cover',
      value: 'PersonalAccident',
      type: 'select'
    },
    {
      label: 'Electrical Accessories',
      value: 'IsElectricalAccessories',
      type: 'input',
      min: '1000',
      inputName: 'ElectricAmount'
    },
    {
      label: 'Non-Electrical Accessories',
      value: 'IsNonElectricalAccessories',
      type: 'input',
      min: '1000',
      inputName: 'NonElectricAmount'
    },
    {
      label: 'Is Bi-fuel Kit?',
      value: 'IsCngAccessories',
      type: 'input',
      min: 0,
      inputName: 'CNGValue'
    },
    {
      label: 'Passenger Cover',
      value: 'PassengerCover',
      type: 'input',
      min: '10000',
      inputName: 'PassengerCoverAmount'
    },
    {
      label: 'Legal Liability to Paid Driver?',
      value: 'LiabilitiesToPaidDriver',
      type: 'input',
      min: '10000',
      inputName: 'NoOfLegelDrives'
    }
  ]

  const addOnsData = [
    { label: 'Zero Dep Cover', value: 'ZeroDepriciationCover', type: 'select' },
    {
      label: 'Road Side Assistance',
      value: 'RoadSideAssistance',
      type: 'select'
    },
    { label: 'Consumables', value: 'Consumables', type: 'select' },
    { label: 'Key Replacement', value: 'KeyReplacement', type: 'select' },
    { label: 'Invoice Cover', value: 'InvoiceCover', type: 'select' },
    { label: 'Engine Gearbox Cover', value: 'EngineGearBox', type: 'select' },
    { label: 'NCB Protection', value: 'NCBProtection', type: 'select' },
    {
      label: 'Loss Of Personal Belongings',
      value: 'LossOfPersonalBelongings',
      type: 'select'
    },
    { value: 'EngineProtection', label: 'Engine Protection', type: 'select' },
    { value: 'TyreProtection', label: 'Tyre Protection', type: 'select' },
    { value: 'RimProtection', label: 'Rim Protection', type: 'select' },

    {
      label: 'Voluntary Deductive',
      value: 'VoluntaryDeductive',
      type: 'input',
      min: 0,
      inputName: 'VoluntaryDeductiveAmount'
    }
  ]

  const selectUserPlan = item => {
    dispatch(selectedPlanAction(item))
    dispatchQuickQuote('ApiId', item?.ApiId)
    dispatchQuickQuote('PaymentId', item.ApiId)
    if (item?.idv === 0 && item.Api_name == 'digit') {
      dispatchQuickQuote('Idv', null)
    } else {
      dispatchQuickQuote('Idv', item.idv)
    }
    if (item.Api_name === 'Kotak') {
      if (apiRequestQQ.NewPolicyType == 'ODOnly') {
        return toggleODModal()
      } else {
        dispatchQuickQuote('ApiId', item?.ApiId)
        dispatchQuickQuote('PaymentId', item.PolicyId)
      }
    }
    if (item.Api_name === 'Future') {
      dispatchQuickQuote('AddOns.' + 'discount', item.discount)
      dispatchQuickQuote('Idv', item.idv)
    } else if (item.Api_name === 'Royal') {
      dispatchQuickQuote('Idv', item.idv)
      dispatchQuickQuote('ApiId', item?.ApiId)
      dispatchQuickQuote('PaymentAmount', item.FinalPremium)
    }
    dispatchQuickQuote('PolicyStartDate', item.StartDate)
    dispatchQuickQuote('PolicyEndDate', item.EndDate)
    navigate('/submitProposal')
  }

  const handleSelectChange = e => {
    const selectedValue = e.target.value

    if (selectedValue === 'bestValue') {
      setIdvInput(false)
    } else if (selectedValue === 'ownIDV') {
      setIdvInput(true)
    }
  }

  const handleFilterOptions = (cover, item, idv) => {
    console.log(cover, item, 'handleFilterOptions')
    SetNewPolicyType(cover)
    dispatchQuickQuote('isFiltered', true)
    let newData = { ...apiRequestQQ }
    if (filter.IsCngAccessories === true && apiRequestQQ.FuelType != 'CNG') {
      newData.FuelType = 'CNG'
      dispatchQuickQuote('FuelType', 'CNG')
    } else if (
      filter.IsCngAccessories === false &&
      apiRequestQQ.IsInternalCNG != true
    ) {
      newData.FuelType = 'Petrol'
      dispatchQuickQuote('FuelType', 'Petrol')
    }
    for (let key in filter) {
      newData[key] = filter[key]

      dispatchQuickQuote('AddOns.' + key, filter[key])
    }
    // if (NewPolicyType != '') {
    //   newData['NewPolicyType'] = NewPolicyType
    //   dispatchQuickQuote('NewPolicyType', NewPolicyType)
    // }
    if (cover != '') {
      newData['NewPolicyType'] = cover
      dispatchQuickQuote('NewPolicyType', cover)
    }
    console.log('New Data', newData)
    if (item && apiRequestQQ.IsVehicleNew === false) {
      newData['CurrentNoClaimBonus'] = item
      dispatchQuickQuote('CurrentNoClaimBonus', item)
    }
    if (idv > 0) {
      newData['Idv'] = idv
      dispatchQuickQuote('Idv', idv)
    }
    // setLoading(true)
    dispatch(resetQuickQuoteResults())
    // document.getElementById('idvmeasure').classList.remove('idvcustomshow')
    // document.getElementById('addcover').classList.remove('idvcustomshow')
    // document.getElementById('addon').classList.remove('idvcustomshow')
    setTimeout(() => {
      // if (
      //   moment().format('YYYY') - apiRequestQQ.RegistrationYear <= 15 &&
      //   apiRequestQQ.PolicyStatus == 'continue'
      // ) {
      //   HDFCCalculatePremium(newData)
      // }
      bajajApiCall(newData)
      // shriramGenerateProposal(newData)

      // FutureGeneralQuickQuote(newData)
      // RoyalSundramAPICall(newData)
      digitAPICall(newData)
      if (apiRequestQQ.PreInsurerCode != '152') {
        KotakAPICall(newData)
      }
      // if (
      //   moment().format("YYYY") - newData.RegistrationYear <= 15 &&
      //   (newData.NewPolicyType == "ThirdParty" || newData.PolicyStatus == "continue") &&
      //   newData.NewPolicyType != "ODOnly"
      // ) {
      //   RelianceAPICall(newData);
      // }

      if (
        moment().format('YYYY') - apiRequestQQ.RegistrationYear <= 15 &&
        apiRequestQQ.PolicyStatus == 'continue'
      ) {
        RelianceAPICall(newData)
      }
    }, 500)
    setIdvModal(false)
  }

  const handleChangeFilter = e => {
    const { name, checked } = e.target
    setFilter({ ...filter, [name]: checked })
  }

  const handleChangeValue = e => {
    const { name, value } = e.target
    setFilter({ ...filter, [name]: parseFloat(value) })
  }

  const handleChangeNCB = item => {
    setPrevoiusNCB(item)
    handleFilterOptions('', item)
  }

  const getMinMaxIdv = arr => {
    let minimumIdv = Math.pow(10, 1000)
    let maximumIdv = -1
    let minMaxIdvRange // this will store the values for idv range of min & max

    for (let i = 0; i < arr.length; i++) {
      minMaxIdvRange = arr[i]?.MinMaxIdv
      const splitedRange = minMaxIdvRange.split(' - ') // we will store the splited range here
      console.log('splited Range', splitedRange)
      for (let j = 0; j < splitedRange.length; j++) {
        if (splitedRange[j] < minimumIdv) {
          minimumIdv = splitedRange[j]
        }
        if (splitedRange[j + 1] > maximumIdv) {
          maximumIdv = splitedRange[j + 1]
          console.log(maximumIdv, j, 'maximum idv')
        }
      }
    }
    return { minimumIdv, maximumIdv }
  }

  const range = getMinMaxIdv(QuickQouteResult)
  console.log('RANGE OF IDVS ', range)

  // const splitFunc = (minMaxIDV) => {

  // }

  return (
    <div>
      <div class='home-content'>
        <div id='main_div'>
          <Header />
        </div>
      </div>
      <div className='quotaion-container'>
        <section className='left-section'>
          <div className='no-shadow-card'>
            <div className='linear-div' style={{ marginTop: 10 }}>
              <p className='semibold-text'>Your Vehicle Details</p>
              <p
                className='edit-btn'
                onClick={() => setModal(true)}
                style={{ cursor: 'pointer' }}
              >
                Edit
              </p>
            </div>
            <div className='line'></div>
            <div
              className='linear-div'
              style={{
                justifyContent: 'flex-start'
              }}
            >
              {apiRequestQQ?.VehicleType === '4w' ? (
                <img src='./assets/img/pvt_car.png' height={29} width={42} />
              ) : (
                <img src='./assets/img/Bike1.png' height={29} width={42} />
              )}

              <p className='small-text' style={{ marginLeft: 10 }}>
                Vehicle <br />
                <p style={{ marginTop: 0 }} className='semibold-text'>
                  {apiRequestQQ?.MakeName} {apiRequestQQ?.ModelName}
                </p>
              </p>
            </div>
            <div className='linear-div'>
              <p className='small-text'>
                Year <br />{' '}
                <p className='semibold-text'>
                  {apiRequestQQ?.RegistrationYear}
                </p>
              </p>
              <p className='small-text'>
                RTO <br />{' '}
                <p className='semibold-text'>
                  {apiRequestQQ?.RTOCityName} ({apiRequestQQ?.RegistrationCity})
                </p>
              </p>
            </div>
          </div>

          {apiRequestQQ?.NewPolicyType !== 'ThirdParty' ? (
            <div className='no-shadow-card'>
              <div className='linear-div'>
                <p className='semibold-text'>Insured value (IDV)</p>{' '}
                <p
                  className='edit-btn'
                  onClick={() => setIdvModal(true)}
                  style={{ cursor: 'pointer' }}
                >
                  Edit
                </p>
              </div>
              <div className='line'></div>
              <p style={{ margin: 10, fontSize: 14, fontWeight: 300 }}>
                Currently Set For Lowest Price:{' '}
                <strong>{apiRequestQQ?.Idv}</strong>
              </p>
            </div>
          ) : (
            ''
          )}

          <div className='no-shadow-card'>
            <div className='linear-div'>
              <p className='semibold-text'>No claim bonus</p>
            </div>
            <div className='line'></div>
            <p
              style={{
                margin: 10,
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.8
              }}
            >
              Currently applicable NCB:{' '}
              {apiRequestQQ?.CurrentNoClaimBonus
                ? apiRequestQQ?.CurrentNoClaimBonus
                : apiRequestQQ?.PreviousNoClaimBonus === '0'
                ? '20'
                : apiRequestQQ?.PreviousNoClaimBonus === '20'
                ? '25'
                : apiRequestQQ?.PreviousNoClaimBonus === '25'
                ? '35'
                : apiRequestQQ?.PreviousNoClaimBonus === '35'
                ? '45'
                : apiRequestQQ?.PreviousNoClaimBonus === '45'
                ? '50'
                : ''}
              % <br />
              Previous Year NCB: {apiRequestQQ?.PreviousNoClaimBonus}% <br />
              Claims in last policy: N/A
            </p>
          </div>

          <div className='no-shadow-card'>
            <p className='semibold-text' style={{ margin: 10 }}>
              Plan Duration: 1 year
            </p>
          </div>
        </section>

        <section className='main-section mt-4'>
          <div className='bikecoverplanform'>
            <form>
              <ul className='row'>
                <div className='row mx-0 px-0'>
                  <li className='col col-xl-3 col-lg-3 col-md-6 col-12'>
                    <select
                      onChange={e => {
                        handleChangeNCB(e?.target?.value)
                      }}
                    >
                      <option key='' value=''>
                        Select NCB
                      </option>
                      <option key='0' value='0'>
                        0 %
                      </option>
                      <option key='20' value='20'>
                        20 %
                      </option>
                      <option key='25' value='25'>
                        25 %
                      </option>
                      <option key='35' value='35'>
                        35 %
                      </option>
                      <option key='45' value='45'>
                        45 %
                      </option>
                      <option key='50' value='50'>
                        50 %
                      </option>
                    </select>
                  </li>

                  <li className='col col-xl-3 col-lg-3 col-md-6 col-12'>
                    <div
                      className='position-relative'
                      onClick={showdown1}
                      style={{ cursor: 'pointer' }}
                    >
                      <p
                        className='mb-2 py-2 fs-6'
                        style={{
                          fontWeight: 400,
                          border: '1px solid #00b0cb',
                          borderRadius: '8px',
                          color: '#969696',
                          paddingLeft: '15px',
                          background: 'white',
                          display: 'flex',
                          paddingTop: '8px',
                          justifyContent: 'space-between'
                        }}
                      >
                        Additional Covers
                        <img
                          className='fs-6 mb-2'
                          src='./assets/img/down-arrow.png'
                          width={23}
                          style={{ paddingTop: '6px', paddingRight: '3px' }}
                        />
                      </p>
                    </div>

                    <div
                      id='addcover'
                      className='idvcustom shadow'
                      onMouseLeave={showdown1}
                    >
                      <button
                        type='button'
                        class='btn-close position-absolute d-lg-none d-block'
                        style={{ top: 10, right: 10 }}
                      ></button>

                      {Covres.filter(item =>
                        apiRequestQQ.VehicleType === '2w' ||
                        apiRequestQQ.FuelType == 'Diesel'
                          ? item.value !== 'IsCngAccessories' && item
                          : item
                      ).map((item, index) => (
                        <div className='form-check d-flex flex-column mb-3'>
                          <input
                            type='checkbox'
                            className={`form-check-input ${
                              apiRequestQQ?.NewPolicyType === 'ThirdParty' &&
                              (item?.label === 'Electrical Accessories' ||
                                item?.label === 'Non-Electrical Accessories' ||
                                item?.label === 'Is Bi-fuel Kit?')
                                ? 'disable_addon'
                                : ''
                            }`}
                            name={item.value}
                            checked={
                              filter[item.value] === true ? 'checked' : ''
                            }
                            id={'day' + index}
                            onChange={e => handleChangeFilter(e)}
                          />
                          <div
                            className={`form-check-label  fs-8  ${
                              apiRequestQQ?.NewPolicyType === 'ThirdParty' &&
                              (item?.label === 'Electrical Accessories' ||
                                item?.label === 'Non-Electrical Accessories' ||
                                item?.label === 'Is Bi-fuel Kit?')
                                ? 'disable_addon'
                                : ''
                            }`}
                            style={{
                              paddingLeft: '10px',
                              marginTop: '-20px'
                            }}
                            htmlFor={'day' + index}
                          >
                            {item.label}
                          </div>
                          {item.type == 'input' && filter[item.value] === true && (
                            <>
                              {item.value === 'PassengerCover' ? (
                                <select
                                  className='form-control'
                                  style={{
                                    marginLeft: '10px',
                                    marginTop: '5px'
                                  }}
                                  name={item.inputName}
                                  onChange={e =>
                                    handleChangeValue(e, item.value)
                                  }
                                >
                                  <option value='0'>Select Sum Insured</option>
                                  <option value='10000'>10000</option>
                                  <option value='20000'>20000</option>
                                  <option value='30000'>30000</option>
                                  <option value='40000'>40000</option>
                                  <option value='50000'>50000</option>
                                  <option value='100000'>100000</option>
                                  {apiRequestQQ.VehicleType == '4w' && (
                                    <>
                                      <option value='120000'>120000</option>
                                      <option value='150000'>150000</option>
                                      <option value='200000'>200000</option>
                                    </>
                                  )}
                                </select>
                              ) : item.value == 'LiabilitiesToPaidDriver' ? (
                                <select
                                  className='form-control'
                                  style={{
                                    marginLeft: '10px',
                                    marginTop: '5px'
                                  }}
                                  name={item.inputName}
                                  onChange={e =>
                                    handleChangeValue(e, item.value)
                                  }
                                >
                                  <option value='0'>
                                    Select No Of Drivers
                                  </option>
                                  <option value='1'>1</option>
                                  <option value='2'>2</option>
                                </select>
                              ) : (
                                <input
                                  type='number'
                                  min={item.min}
                                  name={item.inputName}
                                  onChange={e =>
                                    handleChangeValue(e, item.value)
                                  }
                                  className='form-control'
                                  style={{
                                    marginLeft: '10px',
                                    marginTop: '5px'
                                  }}
                                />
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </li>

                  <li className='col col-xl-3 col-lg-3 col-md-6 col-12'>
                    <div
                      className={`position-relative ${
                        apiRequestQQ?.NewPolicyType === 'ThirdParty'
                          ? 'disable_addon'
                          : ''
                      }`}
                      onClick={showdown2}
                      style={{ cursor: 'pointer' }}
                    >
                      <p
                        className='mb-2 py-2 fs-6'
                        style={{
                          fontWeight: 400,
                          border: '1px solid #00b0cb',
                          borderRadius: '8px',
                          color: '#969696',
                          paddingLeft: '15px',
                          background: 'white',
                          display: 'flex',
                          paddingTop: '8px',
                          justifyContent: 'space-between'
                        }}
                      >
                        Addons
                        <img
                          className='fs-6 mb-2'
                          src='./assets/img/down-arrow.png'
                          width={23}
                          style={{ paddingTop: '6px', paddingRight: '3px' }}
                        />
                      </p>
                    </div>
                    <div
                      id='addon'
                      className='idvcustom shadow'
                      onMouseLeave={showdown2}
                    >
                      <button
                        type='button'
                        className='btn-close position-absolute d-lg-none d-block'
                        style={{ top: 10, right: 10 }}
                      ></button>
                      {addOnsData.map((item, index) => (
                        <div className='form-check mb-3'>
                          <input
                            type='checkbox'
                            value={item.value}
                            className='form-check-input'
                            name={item.value}
                            checked={
                              filter[item.value] === true ? 'checked' : ''
                            }
                            id={'day' + index}
                            onChange={e => handleChangeFilter(e)}
                          />
                          <div
                            className='form-check-label fs-8'
                            htmlFor={'day' + index}
                          >
                            {item.label}
                          </div>
                          {item.type == 'input' &&
                            filter[item.value] === true && (
                              <input
                                type='number'
                                min={item.min}
                                name={item.inputName}
                                value={filter[item.inputName]}
                                onChange={e => handleChangeValue(e, item.value)}
                                className='form-control'
                              />
                            )}
                        </div>
                      ))}
                    </div>

                    <div className='modalashadow'></div>
                  </li>
                </div>

                <div className='row col-12'>
                  <li className='coverbutton'>
                    <button
                      className={
                        apiRequestQQ?.NewPolicyType === 'Comprehensive'
                          ? 'active'
                          : ''
                      }
                      onClick={e => {
                        e?.preventDefault()
                        handleFilterOptions('Comprehensive')
                      }}
                    >
                      Comprehensive cover
                    </button>
                    <button
                      className={
                        apiRequestQQ?.NewPolicyType === 'ThirdParty'
                          ? 'active'
                          : ''
                      }
                      onClick={e => {
                        e?.preventDefault()
                        handleFilterOptions('ThirdParty')
                      }}
                    >
                      Third party only cover
                    </button>
                    <button
                      className={
                        apiRequestQQ?.NewPolicyType === 'ODOnly' ? 'active' : ''
                      }
                      style={{ marginRight: '10px' }}
                      onClick={e => {
                        e?.preventDefault()
                        handleFilterOptions('ODOnly')
                      }}
                    >
                      OD only cover
                    </button>
                  </li>
                </div>
              </ul>
            </form>
          </div>

          <p className='headline'>
            {QuickQouteResult?.length}{' '}
            {apiRequestQQ?.NewPolicyType === 'Comprehensive'
              ? 'Comprehensive'
              : apiRequestQQ?.NewPolicyType === 'ThirdParty'
              ? 'Third Party'
              : apiRequestQQ?.NewPolicyType === 'ODOnly'
              ? 'Own Damage'
              : ''}{' '}
            Plans
          </p>
          <p className='sub-headline'>
            {apiRequestQQ?.NewPolicyType === 'Comprehensive'
              ? 'Covers Damages To Your Vehicle And Third-Party'
              : apiRequestQQ?.NewPolicyType === 'ThirdParty'
              ? 'Covers Damages To Third-Party'
              : apiRequestQQ?.NewPolicyType === 'ODOnly'
              ? 'Covers Damages To Your Vehicle'
              : ''}
          </p>
          {QuickQouteResult &&
            QuickQouteResult.length > 0 &&
            QuickQouteResult.map((item, index) => {
              if (typeof item?.FinalPremium === 'number') {
                var priceWithoutINR = item?.FinalPremium.toString().replace(
                  'INR ',
                  ''
                )
              } else if (typeof item?.FinalPremium === 'string') {
                var priceWithoutINR = item?.FinalPremium.replace('INR ', '')
              } else {
                var priceWithoutINR = item?.FinalPremium
              }

              var splitNumbers = item.MinMaxIdv.split(' - ')
              var minIDV = splitNumbers[0]
              var maxIDV = splitNumbers[1]
              return (
                <div className='shadow-card'>
                  <div className='col-12 d-flex justify-content-between'>
                    <img
                      // className='col-2'
                      src={item?.Logo}
                      width='115px'
                      height='45px'
                      style={{
                        border: 'none',
                        borderRadius: '5px',
                        marginLeft: '10px'
                      }}
                    />

                    {apiRequestQQ?.NewPolicyType !== 'ThirdParty' ? (
                      <>
                        <p
                          className='semibold-text col-1'
                          style={{ marginLeft: '40px', textAlign: 'center' }}
                        >
                          IDV <br /> <strong>{item?.idv}</strong>
                        </p>
                        <p
                          className='semibold-text col-4'
                          style={{ textAlign: 'center' }}
                        >
                          Min-Max <br />{' '}
                          <strong>
                            {' '}
                            {Math.round(minIDV)}
                            {' - '}
                            {Math.round(maxIDV)}
                          </strong>
                        </p>
                      </>
                    ) : (
                      <p
                        className='col-5 fs-6'
                        style={{ textAlign: 'center', fontWeight: 'lighter' }}
                      >
                        <strong>Cover: </strong>Third Party
                      </p>
                    )}

                    <div
                      className='price-div col-2'
                      onClick={() => {
                        toggleModal2()
                        setPlanDetail(item)
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* <p
                      className='price-txt'
                      onClick={() => selectUserPlan(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item?.FinalPremium}
                    </p> */}
                      <p
                        className='price-txt'
                        onClick={() => setModelIdv(item)}
                      >
                        &#8377;{Math.round(priceWithoutINR)}
                      </p>
                    </div>
                  </div>

                  {/* <div className='row mt-2 pl-6' style={{ marginLeft: '10px' }}> */}
                  <div
                    className='adons col-12 mt-2'
                    style={{ marginLeft: '50px', fontSize: '13px' }}
                  >
                    {apiRequestQQ?.NewPolicyType !== 'ThirdParty' ? (
                      <ul className='p-0 row  d-flex-column'>
                        {item.PersonalAccident != false && (
                          <li className='col-lg-3 ps-lg-0 mb-1'>
                            <span>
                              <span
                                className={
                                  item.PersonalAccident === false
                                    ? 'text-danger'
                                    : 'text-success'
                                }
                              >
                                {' '}
                                {item.PersonalAccident === false ? (
                                  <span className='fa fa-times'>
                                    <img
                                      style={{ width: '12px' }}
                                      src='./assets/img/crossed.png'
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <img
                                      style={{ width: '12px' }}
                                      src='./assets/img/check.png'
                                    />
                                  </span>
                                )}
                              </span>{' '}
                              Personal Accident
                            </span>
                          </li>
                        )}
                        {apiRequestQQ.isFiltered === true && (
                          <>
                            {filter.RoadSideAssistance === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.RoadSideAssistance === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.RoadSideAssistance === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Road Side Assistance
                                </span>
                              </li>
                            )}

                            {filter.EngineProtection === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.EngineProtection === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.EngineProtection === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Engine Protection
                                </span>
                              </li>
                            )}

                            {filter.TyreProtection === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.TyreProtection === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.TyreProtection === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Tyre Protection
                                </span>
                              </li>
                            )}

                            {filter.RimProtection === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.RimProtection === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.RimProtection === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Rim Protection
                                </span>
                              </li>
                            )}

                            {filter.Consumables === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.Consumables === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.Consumables === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Consumables
                                </span>
                              </li>
                            )}

                            {filter.IsElectricalAccessories === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.IsElectricalAccessories === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.IsElectricalAccessories === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Electrical Accessories
                                </span>
                              </li>
                            )}

                            {filter.IsNonElectricalAccessories === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.IsNonElectricalAccessories === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.IsNonElectricalAccessories ===
                                    false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Non Electrical Accessories
                                </span>
                              </li>
                            )}

                            {filter.InvoiceCover === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.InvoiceCover === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.InvoiceCover === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Invoice Cover
                                </span>
                              </li>
                            )}

                            {filter.EngineGearBox === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.EngineGearBox === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.EngineGearBox === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Engine GearBox
                                </span>
                              </li>
                            )}

                            {filter.VoluntaryDeductive === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.VoluntaryDeductive === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.VoluntaryDeductive === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Voluntary Deductive
                                </span>
                              </li>
                            )}

                            {filter.PassengerCover === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.PassengerCover === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.PassengerCover === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Passenger Cover
                                </span>
                              </li>
                            )}

                            {filter.LossOfPersonalBelongings === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.LossOfPersonalBelongings === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.LossOfPersonalBelongings === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Loss Of Personal Belongings
                                </span>
                              </li>
                            )}

                            {filter.ZeroDepriciationCover === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.ZeroDepriciationCover === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.ZeroDepriciationCover === false ? (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Zero DepriciationCover
                                </span>
                              </li>
                            )}

                            {filter.KeyReplacement === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.KeyReplacement === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.KeyReplacement === false ? (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  KeyReplacement
                                </span>
                              </li>
                            )}

                            {filter.LiabilitiesToPaidDriver === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.DriverLiability === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.DriverLiability === false ? (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Liabilities To PaidDriver
                                </span>
                              </li>
                            )}
                          </>
                        )}
                      </ul>
                    ) : (
                      <ul className='p-0 row  d-flex-column'>
                        {item.PersonalAccident != false && (
                          <li className='col-lg-3 ps-lg-0 mb-1'>
                            <span>
                              <span
                                className={
                                  item.PersonalAccident === false
                                    ? 'text-danger'
                                    : 'text-success'
                                }
                              >
                                {' '}
                                {item.PersonalAccident === false ? (
                                  <span className='fa fa-times'>
                                    <img
                                      style={{ width: '12px' }}
                                      src='./assets/img/crossed.png'
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <img
                                      style={{ width: '12px' }}
                                      src='./assets/img/check.png'
                                    />
                                  </span>
                                )}
                              </span>{' '}
                              Personal Accident
                            </span>
                          </li>
                        )}
                        {apiRequestQQ.isFiltered === true && (
                          <>
                            {filter.PassengerCover === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.PassengerCover === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.PassengerCover === false ? (
                                      <span className='fa fa-times'>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Passenger Cover
                                </span>
                              </li>
                            )}
                            {filter.LiabilitiesToPaidDriver === true && (
                              <li className='col-lg-3 ps-lg-0 mb-1'>
                                <span>
                                  <span
                                    className={
                                      item.DriverLiability === false
                                        ? 'text-danger'
                                        : 'text-success'
                                    }
                                  >
                                    {' '}
                                    {item.DriverLiability === false ? (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/crossed.png'
                                        />
                                      </span>
                                    ) : (
                                      <span>
                                        <img
                                          style={{ width: '12px' }}
                                          src='./assets/img/check.png'
                                        />
                                      </span>
                                    )}
                                  </span>{' '}
                                  Liabilities To PaidDriver
                                </span>
                              </li>
                            )}
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                  {/* </div> */}
                </div>
              )
            })}
        </section>
      </div>
      <EditVehicleDetails
        modal={modal}
        toggleModal={toggleModal}
        updateMMV={() => handleFilterOptions('', '', '')}
      />

      <Modal isOpen={idvModal} toggle={toggleIdvModal} size='sm'>
        <ModalHeader className='px-lg-4'>
          Select IDV
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='modal'
            aria-label='Close'
            onClick={() => setIdvModal(false)}
          />
        </ModalHeader>
        <ModalBody>
          <label
            className='form-check-label fs-8'
            style={{ background: 'white' }}
            htmlFor='aacche12'
          >
            Choose Your Own IDV
          </label>
          <div>
            <div className='form-floating mt-3'>
              <input
                type='number'
                className='form-control mb-3'
                onChange={e => setIdv(e?.target?.value)}
                placeholder='Please Enter your custom IDV'
              />
              <div htmlFor='floatingSelect'>Select IDV Value</div>
            </div>
            <div className='d-flex justify-content-between align-items-center my-2'>
              <small>
                {Math.round(range?.minimumIdv) +
                  ' - ' +
                  Math.round(range?.maximumIdv)}
              </small>
            </div>
            <button
              href='javascript:void(0)'
              onClick={() => handleFilterOptions('', '', idv)}
              className='btn btn-primary fs-6 px-3 py-2 mt-3'
            >
              Update
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* Premium Breakup */}
      <Modal
        isOpen={modal2}
        toggle={toggleModal2}
        centered
        className='custom-modal'
      >
        <ModalHeader toggle={toggleModal2} className='px-lg-sm-4'>
          <p className='m-0 fs-8'>Plan Detail</p>
        </ModalHeader>

        <ModalBody className='px-lg-4'>
          <div className='d-lg-flex d-md-flex d-xs-flex align-items-center justify-content-between'>
            <img
              src={planDetail?.Logo}
              className='nvimg'
              alt=''
              style={{ width: '100px' }}
            />
            <h1 className='ms-3 text-center my-lg-0 my-2 fs-6'>
              {planDetail?.insurer}
              <p
                className='fs-8 text-muted text-decoration-underline mt-lg-0 mt-1'
                style={{ color: '#01b0cb' }}
              >
                ({planDetail?.policyType})
              </p>
            </h1>

            <a
              href='javascript:void(0)'
              onClick={() => selectUserPlan(planDetail)}
              className='btn px-4 p-2 fs-8'
              style={{
                fontWeight: 500,
                border: 'none',
                background: '#01b0cb',
                color: 'white'
              }}
            >
              BUY NOW
              {/* {planDetail?.FinalPremium} */}
            </a>
          </div>

          <div
            className='row mx-0 p-2  mt-2 justify-content-between'
            style={{ background: '#01b0cb' }}
          >
            <div className='col-lg-4 col-6 ps-lg-0'>
              <small className='fs-8'>Cover Value (IDV)</small>
              <p>
                {apiRequestQQ?.NewPolicyType !== 'ThirdParty' ? (
                  <>{Math.round(modelIdv.idv)}</>
                ) : (
                  <small className='col-5 fs-8'>
                    <strong>Cover: </strong>Third Party
                  </small>
                )}
              </p>
            </div>

            <div className='col-lg-4 col-6text-center d-none'>
              <small className='fs-8'>Tenure</small>
              <p className='fw-bold'>1 year OD + 3 year TP</p>
            </div>

            <div className='col-lg-4 col-6 ps-lg-0 pe-lg-0 text-end'>
              <small className='fs-8'>Policy Start Date</small>
              <p className='fw-bold'>
                {moment(planDetail?.StartDate, 'YYYY-MM-DD').format(
                  'DD MMM, YYYY'
                )}
              </p>
            </div>
          </div>

          <div className='row mx-0 p-1  mt-1'>
            <div className='col-12 px-0'>
              <h1 className='fs-4 '>Premium Breakup</h1>
            </div>
            <div className='col-lg-12 px-0'>
              <small
                className='fw-bold fs-6 text-decoration-underline mt-1 d-block  mb-1'
                style={{ color: '#01b0cb' }}
              >
                Basic Covers
              </small>
            </div>

            <div className='col-lg-12 px-0'>
              <table className='table  fs-8' style={{ fontSize: '12px' }}>
                <tbody>
                  <tr>
                    <th>Basic Own Damage</th>
                    <td style={{ textAlign: 'end' }}>
                      {typeof planDetail?.BasicODPremium === 'number'
                        ? Math.round(
                            planDetail?.BasicODPremium.toString().replace(
                              'INR',
                              ''
                            )
                          )
                        : typeof planDetail?.BasicODPremium === 'string'
                        ? Math.round(
                            planDetail?.BasicODPremium.replace('INR', '')
                          )
                        : Math.round(planDetail?.BasicODPremium)}
                      {/* {Math.round(planDetail?.BasicODPremium)} */}
                    </td>
                  </tr>
                  <tr>
                    <th>Basic Third Parth Premium</th>
                    <td style={{ textAlign: 'end' }}>
                      {typeof planDetail?.BasicTPPremium === 'number'
                        ? Math.round(
                            planDetail?.BasicTPPremium.toString().replace(
                              'INR',
                              ''
                            )
                          )
                        : typeof planDetail?.BasicTPPremium === 'string'
                        ? Math.round(
                            planDetail?.BasicTPPremium.replace('INR', '')
                          )
                        : Math.round(planDetail?.BasicTPPremium)}
                      {/* {Math.round(planDetail?.BasicTPPremium)} */}
                    </td>
                  </tr>
                  {planDetail?.IsElectricalAccessories != false && (
                    <tr>
                      <th>Electrical Accessories Premium</th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.IsElectricalAccessories === 'number'
                          ? Math.round(
                              planDetail?.IsElectricalAccessories.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.IsElectricalAccessories ===
                            'string'
                          ? Math.round(
                              planDetail?.IsElectricalAccessories.replace(
                                'INR',
                                ''
                              )
                            )
                          : Math.round(planDetail?.IsElectricalAccessories)}
                        {/* {Math.round(planDetail?.IsElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.IsNonElectricalAccessories != false && (
                    <tr>
                      <th>Non Electrical Accessories Premium</th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.IsNonElectricalAccessories ===
                        'number'
                          ? Math.round(
                              planDetail?.IsNonElectricalAccessories.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.IsNonElectricalAccessories ===
                            'string'
                          ? Math.round(
                              planDetail?.IsNonElectricalAccessories.replace(
                                'INR',
                                ''
                              )
                            )
                          : Math.round(planDetail?.IsNonElectricalAccessories)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.CNGValue != false && (
                    <tr>
                      <th>Fuel Kit TP</th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.CNGValue === 'number'
                          ? Math.round(
                              planDetail?.CNGValue.toString().replace('INR', '')
                            )
                          : typeof planDetail?.CNGValue === 'string'
                          ? Math.round(planDetail?.CNGValue.replace('INR', ''))
                          : Math.round(planDetail?.CNGValue)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className='col-lg-12 px-0'>
              <small
                className='fw-bold fs-6 text-decoration-underline mt-1 d-block mb-1'
                style={{ color: '#01b0cb' }}
              >
                Add-on Covers
              </small>
            </div>

            <div className='col-lg-12 px-0'>
              <table className='table fs-8' style={{ fontSize: '12px' }}>
                <tbody>
                  {planDetail?.RoadSideAssistance != false && (
                    <tr>
                      <th>Road Side Assistance</th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.RoadSideAssistance === 'number'
                          ? Math.round(
                              planDetail?.RoadSideAssistance.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.RoadSideAssistance === 'string'
                          ? Math.round(
                              planDetail?.RoadSideAssistance.replace('INR', '')
                            )
                          : Math.round(planDetail?.RoadSideAssistance)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.EngineProtection != false && (
                    <tr>
                      <th>Engine Protection</th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.EngineProtection === 'number'
                          ? Math.round(
                              planDetail?.EngineProtection.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.EngineProtection === 'string'
                          ? Math.round(
                              planDetail?.EngineProtection.replace('INR', '')
                            )
                          : Math.round(planDetail?.EngineProtection)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.TyreProtection != false && (
                    <tr>
                      <th>Tyre Protection </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.TyreProtection === 'number'
                          ? Math.round(
                              planDetail?.TyreProtection.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.TyreProtection === 'string'
                          ? Math.round(
                              planDetail?.TyreProtection.replace('INR', '')
                            )
                          : Math.round(planDetail?.TyreProtection)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.RimProtection != false && (
                    <tr>
                      <th>Rim Protection </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.RimProtection === 'number'
                          ? Math.round(
                              planDetail?.RimProtection.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.RimProtection === 'string'
                          ? Math.round(
                              planDetail?.RimProtection.replace('INR', '')
                            )
                          : Math.round(planDetail?.RimProtection)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.Consumables != false && (
                    <tr>
                      <th>Consumables </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.Consumables === 'number'
                          ? Math.round(
                              planDetail?.Consumables.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.Consumables === 'string'
                          ? Math.round(
                              planDetail?.Consumables.replace('INR', '')
                            )
                          : Math.round(planDetail?.Consumables)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.PersonalAccident != false && (
                    <tr>
                      <th>Personal Accident </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.PersonalAccident === 'number'
                          ? Math.round(
                              planDetail?.PersonalAccident.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.PersonalAccident === 'string'
                          ? Math.round(
                              planDetail?.PersonalAccident.replace('INR', '')
                            )
                          : Math.round(planDetail?.PersonalAccident)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.InvoiceCover != false && (
                    <tr>
                      <th>Invoice Cover </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.InvoiceCover === 'number'
                          ? Math.round(
                              planDetail?.InvoiceCover.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.InvoiceCover === 'string'
                          ? Math.round(
                              planDetail?.InvoiceCover.replace('INR', '')
                            )
                          : Math.round(planDetail?.InvoiceCover)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.EngineGearBox != false && (
                    <tr>
                      <th>Engine GearBox </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.EngineGearBox === 'number'
                          ? Math.round(
                              planDetail?.EngineGearBox.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.EngineGearBox === 'string'
                          ? Math.round(
                              planDetail?.EngineGearBox.replace('INR', '')
                            )
                          : Math.round(planDetail?.EngineGearBox)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}

                  {planDetail?.PassengerCover != false && (
                    <tr>
                      <th>Passenger Cover </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.PassengerCover === 'number'
                          ? Math.round(
                              planDetail?.PassengerCover.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.PassengerCover === 'string'
                          ? Math.round(
                              planDetail?.PassengerCover.replace('INR', '')
                            )
                          : Math.round(planDetail?.PassengerCover)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.LossOfPersonalBelongings != false && (
                    <tr>
                      <th>Loss Of PersonalBelongings </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.LossOfPersonalBelongings ===
                        'number'
                          ? Math.round(
                              planDetail?.LossOfPersonalBelongings.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.LossOfPersonalBelongings ===
                            'string'
                          ? Math.round(
                              planDetail?.LossOfPersonalBelongings.replace(
                                'INR',
                                ''
                              )
                            )
                          : Math.round(planDetail?.LossOfPersonalBelongings)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.ZeroDepriciationCover != false && (
                    <tr>
                      <th>Zero DepriciationCover </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.ZeroDepriciationCover === 'number'
                          ? Math.round(
                              planDetail?.ZeroDepriciationCover.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.ZeroDepriciationCover ===
                            'string'
                          ? Math.round(
                              planDetail?.ZeroDepriciationCover.replace(
                                'INR',
                                ''
                              )
                            )
                          : Math.round(planDetail?.ZeroDepriciationCover)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.KeyReplacement != false && (
                    <tr>
                      <th>KeyReplacement </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.KeyReplacement === 'number'
                          ? Math.round(
                              planDetail?.KeyReplacement.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.KeyReplacement === 'string'
                          ? Math.round(
                              planDetail?.KeyReplacement.replace('INR', '')
                            )
                          : Math.round(planDetail?.KeyReplacement)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.NCBProtection != false && (
                    <tr>
                      <th>Liabilities TO Paid Driver </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.NCBProtection === 'number'
                          ? Math.round(
                              planDetail?.NCBProtection.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.NCBProtection === 'string'
                          ? Math.round(
                              planDetail?.NCBProtection.replace('INR', '')
                            )
                          : Math.round(planDetail?.NCBProtection)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                  {planDetail?.DriverLiability != false && (
                    <tr>
                      <th>Liabilities TO Paid Driver </th>
                      <td style={{ textAlign: 'end' }}>
                        {typeof planDetail?.DriverLiability === 'number'
                          ? Math.round(
                              planDetail?.DriverLiability.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          : typeof planDetail?.DriverLiability === 'string'
                          ? Math.round(
                              planDetail?.DriverLiability.replace('INR', '')
                            )
                          : Math.round(planDetail?.DriverLiability)}
                        {/* {Math.round(planDetail?.IsNonElectricalAccessories)} */}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className='col-lg-12 px-0'>
              <small
                className='fw-bold fs-6 text-decoration-underline mt-1 d-block mb-1'
                style={{ color: '#01b0cb' }}
              >
                Discounts
              </small>
            </div>
            <div className='col-lg-12 px-0'>
              <table className='table  fs-8' style={{ fontSize: '12px' }}>
                <tbody>

                  {planDetail?.VoluntaryDeductive != false && (
                    <tr>
                      <th>Voluntary Deductive </th>
                      <td style={{ textAlign: 'end' }}>
                        {
                          planDetail?.VoluntaryDeductive === true ? (
                            <span>(Included)</span>
                          ) : typeof planDetail?.VoluntaryDeductive ===
                            'number' ? (
                            Math.round(
                              planDetail?.VoluntaryDeductive.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          ) : typeof planDetail?.VoluntaryDeductive ===
                            'string' ? (
                            Math.round(
                              planDetail?.VoluntaryDeductive.replace('INR', '')
                            )
                          ) : (
                            planDetail?.VoluntaryDeductive
                          )
                          // Math.round(planDetail?.VoluntaryDeductive)
                        }
                      </td>
                    </tr>
                  )}

                  {planDetail?.NCBDiscount != false && (
                    <tr>
                      <th>NCB Discount </th>
                      <td style={{ textAlign: 'end' }}>
                        {' '}
                        {
                          planDetail?.NCBDiscount === true ? (
                            <span>(Included)</span>
                          ) : typeof planDetail?.NCBDiscount === 'number' ? (
                            Math.round(
                              planDetail?.NCBDiscount.toString().replace(
                                'INR',
                                ''
                              )
                            )
                          ) : typeof planDetail?.NCBDiscount === 'string' ? (
                            Math.round(
                              planDetail?.NCBDiscount.replace('INR', '')
                            )
                          ) : (
                            planDetail?.NCBDiscount
                          )
                          // Math.round(planDetail?.NCBDiscount)
                        }
                      </td>
                    </tr>
                  )}

                  {planDetail?.discount != false && (
                    <tr>
                      <th>OD Discount </th>
                      <td style={{ textAlign: 'end' }}>
                        {' '}
                        {
                          planDetail?.discount === true ? (
                            <span>(Included)</span>
                          ) : typeof planDetail?.discount === 'number' ? (
                            Math.round(
                              planDetail?.discount.toString().replace('INR', '')
                            )
                          ) : typeof planDetail?.discount === 'string' ? (
                            Math.round(planDetail?.discount.replace('INR', ''))
                          ) : (
                            planDetail?.discount || '0'
                          )
                          // Math.round(planDetail?.discount)
                        }
                      </td>
                    </tr>
                  )}

                  {planDetail?.GST != false && (
                    <tr>
                      <th>GST (18%) </th>
                      <td style={{ textAlign: 'end' }}>
                        {' '}
                        {
                          planDetail?.GST === true ? (
                            <span>(Included)</span>
                          ) : typeof planDetail?.GST === 'number' ? (
                            Math.round(
                              planDetail?.GST.toString().replace('INR', '')
                            )
                          ) : typeof planDetail?.GST === 'string' ? (
                            Math.round(planDetail?.GST.replace('INR', ''))
                          ) : (
                            planDetail?.GST
                          )
                          // Math.round(planDetail?.GST)
                        }
                      </td>
                    </tr>
                  )}
                  
                </tbody>
              </table>
            </div>

            <div className='col-12 px-0'>
              <div className='card mt-2'>
                <div className='card-footer border-0 d-flex justify-content-between'>
                  <h2 className='mb-0 fs-6'>Total Payble</h2>
                  <p className='mb-0 fs-8'>
                    {' '}
                    {
                      planDetail?.FinalPremium === true ? (
                        <span>(Included)</span>
                      ) : typeof planDetail?.FinalPremium === 'number' ? (
                        Math.round(
                          planDetail?.FinalPremium.toString().replace('INR', '')
                        )
                      ) : typeof planDetail?.FinalPremium === 'string' ? (
                        Math.round(planDetail?.FinalPremium.replace('INR', ''))
                      ) : (
                        planDetail?.FinalPremium
                      )
                      // Math.round(planDetail?.FinalPremium)
                    }
                    {/* {Math.round(planDetail?.FinalPremium)} */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default AllQuotelist

// function showdown () {
//   document.getElementById('idvmeasure').classList.toggle('idvcustomshow')
// }

function showdown1 () {
  document.getElementById('addcover').classList.toggle('idvcustomshow')
}

function showdown2 () {
  document.getElementById('addon').classList.toggle('idvcustomshow')
}
