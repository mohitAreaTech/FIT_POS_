import React, { useEffect, useRef, useState } from 'react'
import Header from '../common/Header'
import SideBar from '../common/SideBar'
import { Link } from 'react-router-dom'
import { GetData, GetDataWithToken } from '../../api/apiHelper'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Loader from '../common/Loader'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSelector } from 'react-redux'
import { downloadBase64File } from '../utility/TPApiCall'
import '../common/allQuotelist.css'

const Cases = () => {
  const todayDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1} `
  const type = useSelector(state => state?.root?.userDetails.type)
  const [myAllLeads, setAllLeads] = useState([])
  const [mySaveLeads, setMySaveLeads] = useState([])
  const [myFilterAllLeads, setAllFilterLeads] = useState([])
  const [callApi, setCallApi] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab2, setActiveTab2] = useState('1')

  const [activeTab, setActiveTab] = useState('1')
  const [filterValue, setFilterValue] = useState({
    startDate: null,
    endDate: null,
    VehicleNo: null,
    policyType: null,
    vehicleType: null,
    name: null
  })
  const [status, setStatus] = useState('pending')
  const [cases, setCases] = useState('')
  const [defaultFilterValue, setDefaultFilterValue] = useState({
    startDate: '',
    endDate: '',
    VehicleNo: '',
    policyType: '',
    vehicleType: '',
    name: ''
  })
  const messagesEndRef = useRef(null)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange

  const scrollToBottom = () => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    setLoading(true)
    GetDataWithToken(
      `pos/my-leads?status=${status}&month=${todayDate}`,
      ''
    ).then(response => {
      if (response.status == true) {
        setLoading(false)
        console.log('hdsvvvvvvvvvvvvvv', response.data)
        if (status == 'under-ops') {
          let filterData = response.data.filter(
            e => e.quotation_generated == true || e.isAccepted == false
          )
          setAllLeads(filterData)
          setMySaveLeads(filterData)
        } else {
          setMySaveLeads(response.data)
          setAllLeads(response.data)
        }
        setAllFilterLeads([])
      }
    })
  }, [status])

  useEffect(() => {
    if (callApi == true) {
      if (filterValue.VehicleNo !== null) {
        const filterLeadsData = mySaveLeads?.filter(
          e =>
            e?.leadInsurance?.motorInsurance?.vehicle_no ==
            filterValue.VehicleNo.toUpperCase()
        )
        const filterLeadsData2 = mySaveLeads?.filter(
          e =>
            e?.leadInsurance?.misInsurance?.vehicle_no ==
            filterValue.VehicleNo.toUpperCase()
        )
        setAllLeads([...filterLeadsData, ...filterLeadsData2])
        setCallApi(false)
        scrollToBottom()
      }

      if (filterValue.name !== null) {
        const filterLeadsData3 = mySaveLeads?.filter(
          e => e?.customer?.first_name.toLowerCase() == filterValue.name
        )

        setAllLeads([...filterLeadsData3])
        setCallApi(false)
        scrollToBottom()
      }

      if (filterValue.policyType !== null) {
        const filterLeadsData = mySaveLeads?.filter(
          e =>
            e?.leadInsurance?.motorInsurance?.policy_type ==
            filterValue.policyType
        )
        const filterLeadsData2 = mySaveLeads?.filter(
          e =>
            e?.leadInsurance?.misInsurance?.policy_type ==
            filterValue.policyType
        )
        setAllLeads([...filterLeadsData, ...filterLeadsData2])
        setCallApi(false)
        scrollToBottom()
      }
      if (filterValue.vehicleType !== null) {
        const filterLeadsData = mySaveLeads?.filter(
          e =>
            e?.leadInsurance?.motorInsurance?.vehicle_type ==
            filterValue.vehicleType
        )
        const filterLeadsData2 = mySaveLeads?.filter(
          e =>
            e?.leadInsurance?.misInsurance?.vehicle_type ==
            filterValue.vehicleType
        )
        setAllLeads([...filterLeadsData, ...filterLeadsData2])
        setCallApi(false)
        scrollToBottom()
      }
      if (startDate !== null && endDate !== null) {
        setLoading(true)
        GetDataWithToken(
          `pos/get-leads?start=${startDate}&end=${endDate}`,
          ''
        ).then(response => {
          if (response.status == true) {
            setLoading(false)
            if (status == '') {
              console.log('fiterd =======', response.data)

              setAllFilterLeads(response.data)
              setAllLeads([])
              scrollToBottom()
            } else {
              console.log('status ==================', status)
              const filterLeadsData = response.data.filter(
                e => e?.customer?.lead?.status === status
              )
              console.log('fiterd =======', filterLeadsData)
              setAllFilterLeads(filterLeadsData)
              setAllLeads([])
              scrollToBottom()
            }

            setCallApi(false)
            setFilterValue({
              startDate: null,
              endDate: null,
              VehicleNo: null,
              policyType: null,
              vehicleType: null,
              name: null
            })
          }
        })
      }
      setCallApi(false)
    }
  }, [callApi])

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const handleDownloadPdf = item => {
    if (item?.leadInsurance?.motorInsurance?.file_type == 'link') {
      window.location.href =
        item?.leadInsurance?.motorInsurance?.file &&
        item?.leadInsurance?.motorInsurance?.file.replaceAll('"', '')
    } else {
      downloadBase64File(
        'PEIB+' + item?.customer?.first_name,
        item?.leadInsurance?.motorInsurance?.file
      )
    }
  }

  const handleDownloadFilterPdf = item => {
    if (item?.file_type == 'link') {
      window.location.href = item?.file && item?.file.replaceAll('"', '')
    } else {
      downloadBase64File('PEIB+' + item?.customer?.first_name, item?.file)
    }
  }

  const AllFilterCasesLead = () => {
    return (
      <div className='table-responsive'>
        <table
          className='table text-capitalize pt-5 table-bordered display nowrap'
          id='quoteTable3'
        >
          <thead className='bg-primary'>
            <tr>
              <th>Customer Name</th>
              <th>Vehicle No</th>
              <th>Policy Type</th>
              <th>Vehicle Type</th>
              <th>Status</th>
              <th>Case Type</th>
              <th>Lead Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class='table-group-divider'>
            {myFilterAllLeads &&
              myFilterAllLeads.length > 0 &&
              myFilterAllLeads.map((item, index) => (
                <>
                  {item?.customer?.lead?.leadtype?.type ===
                  'Motor Insurance Lead' ? (
                    <tr key={index}>
                      <td>
                        {item?.status == 'under-ops' ? (
                          <Link
                            to={'/vehicleQuotationDetail'}
                            state={{ allDetail: item?.customer?.lead?.id }}
                            className='btn btn-outline-primary fs-6'
                          >
                            <i className='fas fa-eye' />
                            View
                          </Link>
                        ) : (
                          <Link
                            to={'/vehicleDetail'}
                            state={{ allDetail: item?.customer?.lead?.id }}
                            className='btn btn-outline-primary fs-6'
                            // Adjust the font size as needed
                          >
                            <i className='fas fa-eye' />
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>
                        {item?.customer?.first_name} {item?.customer?.last_name}
                      </td>
                      <td>{item?.vehicle_no}</td>
                      <td>{item?.policy_type?.replace(/_/g, ' ')}</td>
                      <td>{item?.vehicle_type}</td>
                      <td>
                        {item?.customer?.lead?.status == 'booking-pending'
                          ? 'Issued'
                          : item?.customer?.lead?.status == 'policy-generated'
                          ? 'Booked'
                          : item?.customer?.lead?.status}
                      </td>
                      <td>{item?.case_type?.replace(/_/g, ' ')}</td>
                      <td>{item?.customer?.lead?.type}</td>
                      <td>
                        {status == 'under-ops' ? (
                          <Link
                            to={'/misDetail'}
                            state={{ allDetail: item?.customer?.lead?.id }}
                            className='btn btn-outline-primary'
                          >
                            <i className='fas fa-eye ' />
                            View
                          </Link>
                        ) : status === 'document-pending' ? (
                          <Link
                            to={'/misDetai'}
                            state={{ allDetail: item?.customer?.lead?.id }}
                            className='btn btn-outline-primary'
                          >
                            <i className='fas fa-eye' />
                            View Remarks
                          </Link>
                        ) : (
                          <Link
                            to={'/misDetail'}
                            state={{ allDetail: item?.customer?.lead?.id }}
                            className='btn btn-outline-primary px-2 fs-4'
                          >
                            <i
                              className='fas fa-eye'
                              style={{ fontSize: '5px' }}
                            />
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </div>
    )
  }

  console.log('fdsa', cases)

  const ALLcasesTable = () => {
    return (
      <div className='table-responsive'>
        <table
          className='table text-capitalize pt-5 table-bordered display nowrap'
          id='quoteTable'
          style={{ width: '100%' }}
        >
          <thead className='bg-primary' >
            <tr>
              <th>Customer Name</th>
              <th>Vehicle No</th>
              <th>Policy Type</th>
              <th>Vehicle Type</th>
              <th>Status</th>
              <th>Case Type</th>
              <th>Lead Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class='table-group-divider'>
            {cases !== '' ? (
              <>
                {myAllLeads && myAllLeads.length > 0 ? (
                  <>
                    {myAllLeads &&
                      myAllLeads.length > 0 &&
                      myAllLeads
                        ?.filter(item => item?.type == cases)
                        .map((item, index) => (
                          <>
                            {item?.leadInsurance?.motorInsurance !== null ? (
                              <tr key={index}>
                                <td>
                                  {item?.customer?.first_name}{' '}
                                  {item?.customer?.last_name}
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.motorInsurance
                                      ?.vehicle_no
                                  }
                                </td>
                                <td>
                                  {item?.leadInsurance?.motorInsurance?.policy_type?.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.motorInsurance
                                      ?.vehicle_type
                                  }
                                </td>
                                <td>
                                  {item?.status == 'booking-pending'
                                    ? 'Issued'
                                    : item?.status == 'policy-generated'
                                    ? 'Booked'
                                    : item?.status}
                                </td>
                                <td>
                                  {item?.leadInsurance?.motorInsurance?.case_type?.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </td>
                                <td>{item?.type}</td>
                                <td>
                                  {item?.status == 'under-ops' ? (
                                    <Link
                                      to={'/vehicleDetail'}
                                      state={{ allDetail: item?.id }}
                                      //   style={{ fontSize: '5px' }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye me-2' />
                                      View1
                                    </Link>
                                  ) : (
                                    <Link
                                    to={'/vehicleDetail'}
                                      state={{ allDetail: item?.id }}
                                      //   style={{ fontSize: '5px' }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye me-2' />
                                      View2
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            ) : (
                              <tr key={index}>
                                <td>
                                  {item?.customer?.first_name}{' '}
                                  {item?.customer?.last_name}
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.misInsurance
                                      ?.vehicle_no
                                  }
                                </td>
                                <td>
                                  {item?.leadInsurance?.misInsurance?.policy_type?.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.misInsurance
                                      ?.vehicle_type
                                  }
                                </td>
                                <td>{item.status?.replace(/-/g, ' ')}</td>
                                <td>
                                  {item?.leadInsurance?.misInsurance?.case_type?.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </td>
                                <td>{item?.type}</td>
                                <td>
                                  {status == 'under-ops' ? (
                                    <Link
                                      to={'/misDetail'}
                                      state={{ allDetail: item?.id }}
                                      //   style={{ fontSize: '5px' }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye' />
                                      View3
                                    </Link>
                                  ) : status === 'document-pending' ? (
                                    <Link
                                    to={'/misDetail'}
                                      state={{ allDetail: item?.id }}
                                      //   style={{ fontSize: '5px' }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye' />
                                      View Remarks
                                    </Link>
                                  ) : (
                                    <Link
                                    to={'/misDetail'}
                                      state={{ allDetail: item?.id }}
                                      //   style={{ fontSize: '5px' }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye me-2' />
                                      View4
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <p className='text-center mt-3 fw-bold '>No data yet</p>
                    </td>
                  </tr>
                )}
              </>
            ) : (
              <>
                {myAllLeads && myAllLeads.length > 0 ? (
                  <>
                    {myAllLeads &&
                      myAllLeads.length > 0 &&
                      myAllLeads?.map((item, index) => (
                        <>
                          {item?.leadInsurance?.motorInsurance !== null ? (
                            <tr key={index}>
                              <td>
                                {item?.customer?.first_name}{' '}
                                {item?.customer?.last_name}
                              </td>
                              <td>
                                {
                                  item?.leadInsurance?.motorInsurance
                                    ?.vehicle_no
                                }
                              </td>
                              <td>
                                {item?.leadInsurance?.motorInsurance?.policy_type?.replace(
                                  /_/g,
                                  ' '
                                )}
                              </td>
                              <td>
                                {
                                  item?.leadInsurance?.motorInsurance
                                    ?.vehicle_type
                                }
                              </td>
                              <td>
                                {item?.status == 'booking-pending'
                                  ? 'Issued'
                                  : item?.status == 'policy-generated'
                                  ? 'Booked'
                                  : item?.status}
                              </td>
                              <td>
                                {item?.leadInsurance?.motorInsurance?.case_type?.replace(
                                  /_/g,
                                  ' '
                                )}
                              </td>
                              <td>{item?.type}</td>
                              <td>
                                {item?.status == 'under-ops' ? (
                                  <Link
                                    to={'/vehicleQuotationDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye me-2' />
                                    View5
                                  </Link>
                                ) : (
                                  <Link
                                    to={'/vehicleDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye me-2' />
                                    View5
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ) : (
                            <tr key={index}>
                              <td>
                                {item?.customer?.first_name}{' '}
                                {item?.customer?.last_name}
                              </td>
                              <td>
                                {item?.leadInsurance?.misInsurance?.vehicle_no}
                              </td>
                              <td>
                                {item?.leadInsurance?.misInsurance?.policy_type?.replace(
                                  /_/g,
                                  ' '
                                )}
                              </td>
                              <td>
                                {
                                  item?.leadInsurance?.misInsurance
                                    ?.vehicle_type
                                }
                              </td>
                              <td>
                                {item?.status == 'booking-pending'
                                  ? 'Issued'
                                  : item?.status == 'policy-generated'
                                  ? 'Booked'
                                  : item?.status}
                              </td>
                              <td>
                                {item?.leadInsurance?.misInsurance?.case_type?.replace(
                                  /_/g,
                                  ' '
                                )}
                              </td>
                              <td>{item?.type}</td>
                              <td>
                                {status == 'under-ops' ? (
                                  <Link
                                    to={'/misDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye' />
                                    View6
                                  </Link>
                                ) : status === 'document-pending' ? (
                                  <Link
                                    to={'/misDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye' />
                                    View Remarks
                                  </Link>
                                ) : (
                                  <Link
                                  to={'/misDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye me-2' />
                                    View6
                                  </Link>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <p className='text-center mt-3 fw-bold '>No data yet</p>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  const AllFinalFilterCases = () => {
    return (
      <div className='table-responsive'>
        <table
          className='table text-capitalize pt-5 table-bordered display nowrap'
          id='quoteTable3'
          style={{ width: '100%' }}
        >
          <thead className='bg-primary'>
            <tr>
              {status == 'policy-generated' || status == 'booking-pending' ? (
                <th>Policy No</th>
              ) : (
                <></>
              )}
              <th>Customer Name</th>
              <th>Vehicle No</th>
              <th>Policy Type</th>
              <th>Insurance Name</th>
              <th>Vehicle Type</th>
              {/* <th>Status</th> */}
              <th>Case Type</th>
              <th>Lead Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class='table-group-divider'>
            {cases !== '' ? (
              <>
                {myFilterAllLeads &&
                  myFilterAllLeads.length > 0 &&
                  myFilterAllLeads
                    ?.filter(item => item?.customer?.lead?.type == cases)
                    .map((item, index) => (
                      <>
                        {item?.customer?.lead?.leadtype?.type ===
                        'Motor Insurance Lead' ? (
                          <tr key={index}>
                            {status == 'policy-generated' ||
                            status == 'booking-pending' ? (
                              <td
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDownloadFilterPdf(item)}
                              >
                                {item?.policy_no}
                              </td>
                            ) : (
                              <></>
                            )}
                            <td>
                              {item?.customer?.first_name}{' '}
                              {item?.customer?.last_name}
                            </td>
                            <td>{item?.vehicle_no}</td>
                            <td>{item?.policy_type?.replace(/_/g, ' ')}</td>
                            <td>
                              {item?.customer?.lead?.type == 'offline'
                                ? item?.customer?.lead?.quotation?.quotation
                                : item?.insurance_company}
                            </td>
                            <td>{item?.vehicle_type}</td>
                            {/* <td>
                              {item?.customer?.lead?.status == "booking-pending" ? "Issued" : item?.customer?.lead?.status == 'policy-generated' ? 'Booked' : item?.customer?.lead?.status}
                            </td> */}
                            <td>{item?.case_type?.replace(/_/g, ' ')}</td>
                            <td>{item?.customer?.lead?.type}</td>
                            <td>
                              {status === 'under-ops' ? (
                                <Link
                                  to={'/vehicleQuotationDetail'}
                                  state={{
                                    allDetail: item?.customer?.lead?.id
                                  }}
                                  className='btn btn-outline-primary fs-6'
                                >
                                  <i className='fas fa-eye' />
                                  View quotation
                                </Link>
                              ) : status === 'document-pending' ? (
                                <Link
                                  to={'/vehicleDetail'}
                                  state={{
                                    allDetail: item?.customer?.lead?.id
                                  }}
                                  className='btn btn-outline-primary fs-6'
                                >
                                  <i className='fas fa-eye' />
                                  View Remarks
                                </Link>
                              ) : (
                                <Link
                                  to={'/vehicleDetail'}
                                  state={{
                                    allDetail: item?.customer?.lead?.id
                                  }}
                                  className='btn btn-outline-primary fs-6'
                                >
                                  <i className='fas fa-eye' />
                                  View7
                                </Link>
                              )}
                            </td>
                          </tr>
                        ) : (
                          <tr key={index}>
                            {status == 'policy-generated' ||
                            status == 'booking-pending' ? (
                              <td>{item?.policy_no}</td>
                            ) : (
                              <></>
                            )}
                            <td>
                              {item?.customer?.first_name}{' '}
                              {item?.customer?.last_name}
                            </td>
                            <td>{item?.vehicle_no}</td>
                            <td>{item?.policy_type?.replace(/_/g, ' ')}</td>
                            <td>{item?.insurance_company}</td>
                            <td>{item?.vehicle_type}</td>
                            {/* <td>
                              {item?.customer?.lead?.status == "booking-pending" ? "Issued" : item?.customer?.lead?.status == 'policy-generated' ? 'Booked' : item?.customer?.lead?.status}
                            </td> */}
                            <td>{item?.case_type?.replace(/_/g, ' ')}</td>
                            <td>{item?.customer?.lead?.type}</td>
                            <td>
                              {status == 'under-ops' ? (
                                <Link
                                  to={'/misDetail'}
                                  state={{
                                    allDetail: item?.customer?.lead?.id
                                  }}
                                  className='btn btn-outline-primary fs-6'
                                >
                                  <i className='fas fa-eye' />
                                  View8
                                </Link>
                              ) : status === 'document-pending' ? (
                                <Link
                                  to={'/misDetail'}
                                  state={{
                                    allDetail: item?.customer?.lead?.id
                                  }}
                                  className='btn btn-outline-primary fs-6'
                                >
                                  <i className='fas fa-eye' />
                                  View Remarks
                                </Link>
                              ) : (
                                <Link
                                  to={'/misDetail'}
                                  state={{
                                    allDetail: item?.customer?.lead?.id
                                  }}
                                  className='btn btn-outline-primary fs-6'
                                >
                                  <i className='fas fa-eye' />
                                  View9
                                </Link>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
              </>
            ) : (
              <>
                {myFilterAllLeads &&
                  myFilterAllLeads.length > 0 &&
                  myFilterAllLeads.map((item, index) => (
                    <>
                      {item?.customer?.lead?.leadtype?.type ===
                      'Motor Insurance Lead' ? (
                        <tr key={index}>
                          {status == 'policy-generated' ||
                          status == 'booking-pending' ? (
                            <td
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDownloadFilterPdf(item)}
                            >
                              {item?.policy_no}
                            </td>
                          ) : (
                            <></>
                          )}
                          <td>
                            {item?.customer?.first_name}{' '}
                            {item?.customer?.last_name}
                          </td>
                          <td>{item?.vehicle_no}</td>
                          <td>{item?.policy_type?.replace(/_/g, ' ')}</td>
                          <td>
                            {item?.customer?.lead?.type == 'offline'
                              ? item?.customer?.lead?.quotation?.quotation
                              : item?.insurance_company}
                          </td>
                          <td>{item?.vehicle_type}</td>
                          {/* <td>
                            {item?.customer?.lead?.status == "booking-pending" ? "Issued" : item?.customer?.lead?.status == 'policy-generated' ? 'Booked' : item?.customer?.lead?.status}
                          </td> */}
                          <td>{item?.case_type?.replace(/_/g, ' ')}</td>
                          <td>{item?.customer?.lead?.type}</td>
                          <td>
                            {status === 'under-ops' ? (
                              <Link
                                to={'/vehicleQuotationDetail'}
                                state={{ allDetail: item?.customer?.lead?.id }}
                                className='btn btn-outline-primary fs-6'
                              >
                                <i className='fas fa-eye' />
                                View quotation
                              </Link>
                            ) : status === 'document-pending' ? (
                              <Link
                                to={'/vehicleDetail'}
                                state={{ allDetail: item?.customer?.lead?.id }}
                                className='btn btn-outline-primary fs-6'
                              >
                                <i className='fas fa-eye' />
                                View Remarks
                              </Link>
                            ) : (
                              <Link
                                to={'/vehicleDetail'}
                                state={{ allDetail: item?.customer?.lead?.id }}
                                className='btn btn-outline-primary fs-6'
                              >
                                <i className='fas fa-eye' />
                                View10
                              </Link>
                            )}
                          </td>
                        </tr>
                      ) : (
                        <tr key={index}>
                          {status == 'policy-generated' ||
                          status == 'booking-pending' ? (
                            <td>{item?.policy_no}</td>
                          ) : (
                            <></>
                          )}
                          <td>
                            {item?.customer?.first_name}{' '}
                            {item?.customer?.last_name}
                          </td>
                          <td>{item?.vehicle_no}</td>
                          <td>{item?.policy_type?.replace(/_/g, ' ')}</td>
                          <td>{item?.insurance_company}</td>
                          <td>{item?.vehicle_type}</td>
                          {/* <td>
                            {item?.customer?.lead?.status == "booking-pending" ? "Issued" : item?.customer?.lead?.status == 'policy-generated' ? 'Booked' : item?.customer?.lead?.status}
                          </td> */}
                          <td>{item?.case_type?.replace(/_/g, ' ')}</td>
                          <td>{item?.customer?.lead?.type}</td>
                          <td>
                            {status == 'under-ops' ? (
                              <Link
                                to={'/misDetail'}
                                state={{ allDetail: item?.customer?.lead?.id }}
                                className='btn btn-outline-primary fs-6'
                              >
                                <i className='fas fa-eye' />
                                View11
                              </Link>
                            ) : status === 'document-pending' ? (
                              <Link
                                to={'/misDetail'}
                                state={{ allDetail: item?.customer?.lead?.id }}
                                className='btn btn-outline-primary fs-6'
                              >
                                <i className='fas fa-eye' />
                                View Remarks
                              </Link>
                            ) : (
                              <Link
                                to={'/misDetail'}
                                state={{ allDetail: item?.customer?.lead?.id }}
                                className='btn btn-outline-primary fs-6'
                              >
                                <i className='fas fa-eye' />
                                View12
                              </Link>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  const AllFinalCasesTable = () => {
    return (
      <div className='table-responsive'>
        <table
          className='table text-capitalize pt-5 table-bordered display nowrap'
          id='quoteTable'
          style={{ width: '100%' }}
        >
          <thead className='bg-primary'>
            <tr>
              {status == 'policy-generated' || status == 'booking-pending' ? (
                <th>Policy No</th>
              ) : (
                <></>
              )}
              <th>Customer Name</th>
              <th>Vehicle No</th>
              <th>Policy Type</th>
              <th>Insurance Name</th>
              <th>Vehicle Type</th>
              {/* <th>Status</th> */}
              <th>Case Type</th>
              <th>Lead Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class='table-group-divider'>
            {cases !== '' ? (
              <>
                {myAllLeads && myAllLeads.length > 0 ? (
                  <>
                    {myAllLeads &&
                      myAllLeads.length > 0 &&
                      myAllLeads
                        ?.filter(item => item?.type == cases)
                        .map((item, index) => (
                          <>
                            {item?.leadInsurance?.motorInsurance !== null ? (
                              <tr key={index}>
                                {status == 'policy-generated' ||
                                status == 'booking-pending' ? (
                                  <td
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleDownloadPdf(item)}
                                  >
                                    {
                                      item?.leadInsurance?.motorInsurance
                                        ?.policy_no
                                    }
                                  </td>
                                ) : (
                                  <></>
                                )}
                                <td>
                                  {item?.customer?.first_name}{' '}
                                  {item?.customer?.last_name}
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.motorInsurance
                                      ?.vehicle_no
                                  }
                                </td>
                                <td>
                                  {item?.leadInsurance?.motorInsurance?.policy_type?.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </td>
                                <td>
                                  {item?.type == 'offline'
                                    ? item?.quotation?.quotation
                                    : item?.leadInsurance?.motorInsurance
                                        ?.insurance_company}
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.motorInsurance
                                      ?.vehicle_type
                                  }
                                </td>
                                {/* <td>{item?.status == "booking-pending" ? "Issued" : item?.status == 'policy-generated' ? 'Booked' : item?.status}</td> */}
                                <td>
                                  {item?.leadInsurance?.motorInsurance?.case_type?.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </td>
                                <td>{item?.type}</td>
                                <td>
                                  {status === 'under-ops' ? (
                                    <Link
                                      to={'/vehicleQuotationDetail'}
                                      state={{ allDetail: item?.id }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye' />
                                      View quotation
                                    </Link>
                                  ) : status === 'document-pending' ? (
                                    <Link
                                      to={'/vehicleDetail'}
                                      state={{ allDetail: item?.id }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye' />
                                      View Remarks
                                    </Link>
                                  ) : (
                                    <Link
                                    to={'/vehicleDetail'}
                                      state={{ allDetail: item?.id }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye me-2' />
                                      View13
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            ) : (
                              <tr key={index}>
                                {status == 'policy-generated' ||
                                status == 'booking-pending' ? (
                                  <td>
                                    {
                                      item?.leadInsurance?.misInsurance
                                        ?.policy_no
                                    }
                                  </td>
                                ) : (
                                  <></>
                                )}
                                <td>
                                  {item?.customer?.first_name}{' '}
                                  {item?.customer?.last_name}
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.misInsurance
                                      ?.vehicle_no
                                  }
                                </td>
                                <td>
                                  {item?.leadInsurance?.misInsurance?.policy_type?.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.misInsurance
                                      ?.insurance_company
                                  }
                                </td>
                                <td>
                                  {
                                    item?.leadInsurance?.misInsurance
                                      ?.vehicle_type
                                  }
                                </td>
                                {/* <td>{item?.status == "booking-pending" ? "Issued" : item?.status == 'policy-generated' ? 'Booked' : item?.status}</td> */}
                                <td>
                                  {item?.leadInsurance?.misInsurance?.case_type?.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </td>
                                <td>{item?.type}</td>
                                <td>
                                  {status == 'under-ops' ? (
                                    <Link
                                      to={'/misDetail'}
                                      state={{ allDetail: item?.id }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye' />
                                      View14
                                    </Link>
                                  ) : status === 'document-pending' ? (
                                    <Link
                                      to={'/misDetail'}
                                      state={{ allDetail: item?.id }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye' />
                                      View Remarks
                                    </Link>
                                  ) : (
                                    <Link
                                      to={'/misDetail'}
                                      state={{ allDetail: item?.id }}
                                      className='btn btn-outline-primary fs-6'
                                    >
                                      <i className='fas fa-eye me-2' />
                                      View15
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <p className='text-center mt-3'>No data yet</p>
                    </td>
                  </tr>
                )}
              </>
            ) : (
              <>
                {myAllLeads && myAllLeads.length > 0 ? (
                  <>
                    {myAllLeads &&
                      myAllLeads.length > 0 &&
                      myAllLeads.map((item, index) => (
                        <>
                          {item?.leadInsurance?.motorInsurance !== null ? (
                            <tr key={index}>
                              {status == 'policy-generated' ||
                              status == 'booking-pending' ? (
                                <td
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleDownloadPdf(item)}
                                >
                                  {
                                    item?.leadInsurance?.motorInsurance
                                      ?.policy_no
                                  }
                                </td>
                              ) : (
                                <></>
                              )}
                              <td>
                                {item?.customer?.first_name}{' '}
                                {item?.customer?.last_name}
                              </td>
                              <td>
                                {
                                  item?.leadInsurance?.motorInsurance
                                    ?.vehicle_no
                                }
                              </td>
                              <td>
                                {item?.leadInsurance?.motorInsurance?.policy_type?.replace(
                                  /_/g,
                                  ' '
                                )}
                              </td>
                              <td>
                                {item?.type == 'offline'
                                  ? item?.quotation?.quotation
                                  : item?.leadInsurance?.motorInsurance
                                      ?.insurance_company}
                              </td>
                              <td>
                                {
                                  item?.leadInsurance?.motorInsurance
                                    ?.vehicle_type
                                }
                              </td>
                              {/* <td>{item?.status == "booking-pending" ? "Issued" : item?.status == 'policy-generated' ? 'Booked' : item?.status}</td> */}
                              <td>
                                {item?.leadInsurance?.motorInsurance?.case_type?.replace(
                                  /_/g,
                                  ' '
                                )}
                              </td>
                              <td>{item?.type}</td>
                              <td>
                                {status === 'under-ops' ? (
                                  <Link
                                    to={'/vehicleQuotationDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye' />
                                    View quotation
                                  </Link>
                                ) : status === 'document-pending' ? (
                                  <Link
                                    to={'/vehicleDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye' />
                                    View Remarks
                                  </Link>
                                ) : (
                                  <Link
                                    to={'/vehicleDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye me-2' />
                                    View16
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ) : (
                            <tr key={index}>
                              {status == 'policy-generated' ||
                              status == 'booking-pending' ? (
                                <td>
                                  {item?.leadInsurance?.misInsurance?.policy_no}
                                </td>
                              ) : (
                                <></>
                              )}
                              <td>
                                {item?.customer?.first_name}{' '}
                                {item?.customer?.last_name}
                              </td>
                              <td>
                                {item?.leadInsurance?.misInsurance?.vehicle_no}
                              </td>
                              <td>
                                {item?.leadInsurance?.misInsurance?.policy_type?.replace(
                                  /_/g,
                                  ' '
                                )}
                              </td>
                              <td>
                                {
                                  item?.leadInsurance?.misInsurance
                                    ?.insurance_company
                                }
                              </td>
                              <td>
                                {
                                  item?.leadInsurance?.misInsurance
                                    ?.vehicle_type
                                }
                              </td>
                              {/* <td>{item?.status == "booking-pending" ? "Issued" : item?.status == 'policy-generated' ? 'Booked' : item?.status}</td> */}
                              <td>
                                {item?.leadInsurance?.misInsurance?.case_type?.replace(
                                  /_/g,
                                  ' '
                                )}
                              </td>
                              <td>{item?.type}</td>
                              <td>
                                {status == 'under-ops' ? (
                                  <Link
                                  to={'/misDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye' />
                                    View17
                                  </Link>
                                ) : status === 'document-pending' ? (
                                  <Link
                                  to={'/misDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye' />
                                    View Remarks
                                  </Link>
                                ) : (
                                  <Link
                                    to={'/misDetail'}
                                    state={{ allDetail: item?.id }}
                                    className='btn btn-outline-primary fs-6'
                                  >
                                    <i className='fas fa-eye me-2' />
                                    View18
                                  </Link>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <p className='text-center mt-3'>No data yet</p>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  const resetSingleFilter = () => {
    setDateRange([null, null])
    setDefaultFilterValue({
      startDate: '',
      endDate: '',
      VehicleNo: '',
      policyType: '',
      vehicleType: '',
      name: ''
    })
  }

  const resetFilter = () => {
    toggleTab('1')
    GetDataWithToken(`pos/my-leads?status=${''}&month=${todayDate}`, '').then(
      response => {
        if (response.status == true) {
          scrollToBottom()
          console.log('hds', response.data)
          setAllLeads(response.data)
          setAllFilterLeads([])
        }
      }
    )
    setFilterValue({
      startDate: null,
      endDate: null,
      VehicleNo: null,
      policyType: null,
      vehicleType: null,
      name: null
    })

    setDefaultFilterValue({
      startDate: '',
      endDate: '',
      VehicleNo: '',
      policyType: '',
      vehicleType: '',
      name: ''
    })
    setDateRange([null, null])
  }

  const handleSearch = e => {
    setFilterValue({
      ...filterValue,
      VehicleNo: e
    })
    setDefaultFilterValue({
      ...defaultFilterValue,
      VehicleNo: e
    })
    if (e.length >= 10) {
      setCallApi(true)
    }
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

        {/*----- Content Body Section Start -----*/}
       
          <section className='content-body px-lg-5 px-3 cases'>
            <div className='container-fluid'>
              {/*----- row Start -----*/}
              <div className='row'>
                <div className='col-xl-12'>
                  {/*----- Insurance Type Tab -----*/}
                  <h1 className='mt-3'>Cases</h1>

                  <nav className='my-4'>
                    <div className='nav nav-tabs row mx-0 px-0' id='nav-tab'>
                      <div className='col-md-6 d-flex order-lg-1 order-2 mb-4'>
                        <NavItem>
                          <NavLink
                            className={
                              activeTab2 == '1' ? 'nav-link active' : 'nav-link'
                            }
                            data-bs-toggle='tab'
                            data-bs-target='#Allcases'
                            type='button'
                            onClick={() => {
                              setCases('')
                              setActiveTab2('1')
                            }}
                          >
                            All Cases
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            className={
                              activeTab2 == '2' ? 'nav-link active' : 'nav-link'
                            }
                            data-bs-toggle='tab'
                            data-bs-target='#offline'
                            type='button'
                            onClick={() => {
                              setCases('offline')
                              setActiveTab2('2')
                            }}
                          >
                            Offline Cases
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            className={
                              activeTab2 == '3' ? 'nav-link active' : 'nav-link'
                            }
                            data-bs-toggle='tab'
                            data-bs-target='#Onlinecases'
                            type='button'
                            onClick={() => {
                              setCases('online')
                              setActiveTab2('3')
                            }}
                          >
                            Online Cases
                          </NavLink>
                        </NavItem>

                        {/* <button
												className="nav-link"
												data-bs-toggle="tab"
												data-bs-target="#Offlinecases"
												type="button"
											>
												Offline Cases
											</button> */}
                      </div>

                      <div className='col-md-6 ms-auto text-lg-end order-lg-2 order-1 mb-lg-0 mb-4'>
                        <Link
                          to={'/requestOfflinePolicy'}
                          className='btn btn-primary me-3 px-4 py-2 fs-6'
                        >
                          Request Offline Policy
                        </Link>
                        {type === 'ops' ? (
                          <Link
                            to={'/mispolicygenerate'}
                            className='btn btn-primary me-3 px-2 py-2 fs-6' // Adjusted padding and removed inline style
                          >
                            Submit Offline Policy
                          </Link>
                        ) : (
                          <Link
                            to={'/submitOfflinePolicy'}
                            className='btn btn-primary px-4 py-2 fs-6' // Adjusted padding
                          >
                            Submit Offline Policy
                          </Link>
                        )}
                      </div>
                    </div>
                  </nav>

                  <div className='tab-pane fade show active' id='expertcar'>
                    <div className='tab-content'>
                      <TabContent activeTab={activeTab2}>
                        <TabPane tabId='1'>
                          <div className='card p-4'>
                            <div className='othervoption'>
                              <div className='row mx-0 px-0 align-items-center'>
                                <div className='col-lg-3 col-md-6 ps-lg-0'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating inother'>
                                      <input
                                        type='text'
                                        className='form-control text-uppercase'
                                        id='msearch'
                                        value={defaultFilterValue.VehicleNo}
                                        placeholder='Search By Reg Number'
                                        onChange={e => {
                                          handleSearch(e.target.value)
                                        }}
                                      />
                                      <label htmlFor='msearch'>
                                        Search By Reg Number
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating inother'>
                                      <input
                                        type='text'
                                        className='form-control text-capitalize'
                                        id='msearchd'
                                        value={defaultFilterValue.name}
                                        placeholder='Search By Reg Number'
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            name: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            name: e.target.value
                                          })
                                        ]}
                                      />
                                      <label htmlFor='msearchd'>
                                        Search By Name
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6 col-12'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating'>
                                      <select
                                        className='form-select'
                                        style={{
                                          paddingTop: '20px',
                                          paddingLeft: '12px'
                                        }}
                                        id='vtyp1'
                                        value={defaultFilterValue.policyType}
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            policyType: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            policyType: e.target.value
                                          })
                                        ]}
                                      >
                                        <option className='d-none' selected=''>
                                          Select Policy Type
                                        </option>
                                        <option value='comprehensive'>
                                          Comprehensive
                                        </option>
                                        <option value='third_party'>
                                          Third party
                                        </option>
                                        <option value='own_damage'>
                                          Own damage
                                        </option>
                                      </select>
                                      <label
                                        htmlFor='vtyp1'
                                        className='floatinglabel'
                                        style={{ fontSize: '14px' }}
                                      >
                                        Policy Type
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6 col-12 pe-lg-0'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating'>
                                      <select
                                        className='form-select'
                                        style={{
                                          paddingTop: '20px',
                                          paddingLeft: '12px'
                                        }}
                                        id='vtyp1'
                                        value={defaultFilterValue.vehicleType}
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            vehicleType: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            vehicleType: e.target.value
                                          })
                                        ]}
                                      >
                                        <option className='d-none' selected=''>
                                          Select Vehicle Type
                                        </option>
                                        <option value='Pvt Car'>
                                          Private Car
                                        </option>
                                        <option value='MotorBike'>
                                          MotorBike
                                        </option>
                                        <option value='Scooter'>Scooter</option>
                                        <option value='PCV'>
                                          Passenger Carrying
                                        </option>
                                        <option value='Goods Carrying'>
                                          Goods Carrying
                                        </option>
                                        <option value='Miscellaneous'>
                                          Miscellaneous
                                        </option>
                                        <option value='Trailer'>Trailer</option>
                                      </select>
                                      <label
                                        htmlFor='vtyp1'
                                        className='floatinglabel'
                                        style={{ fontSize: '14px' }}
                                      >
                                        Vehicle Type
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6 ps-lg-0'>
                                  <div className='position-relative form-floating mb-5 px-4 ps-lg-0'>
                                    <DatePicker
                                      selectsRange={true}
                                      // selected={bookTime.data}
                                      className={
                                        'form-control floatingdate py-3 px-2'
                                      }
                                      placeholderText='Enter Date Range'
                                      startDate={startDate}
                                      endDate={endDate}
                                      onChange={update => {
                                        setDateRange(update)
                                        setCallApi(true)
                                      }}
                                      // isClearable={true}
                                    />
                                  </div>
                                </div>

                                <div className='col-lg-3 col-12 '>
                                  <button
                                    className='btn btn-primary px-4 py-3 fs-6  mb-lg-5'
                                    type='button'
                                    onClick={resetFilter}
                                  >
                                    Reset Filter
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='othervoption'>
                            <div className='row mx-0 px-0 align-items-center'>
                              <div className='col-12 px-0'>
                                <Nav tabs className='my-5 outputtable'>
                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '1'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('1'),
                                        setStatus('pending'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Proposal
                                    </NavLink>
                                  </NavItem>

                                  {/* <NavItem className="nav nav-tabs mb-3">
                                  <NavLink
                                    className={
                                      activeTab == "2"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    onClick={() => [
                                      toggleTab("2"),
                                      setStatus("pending"),
                                      resetSingleFilter(),
                                    ]}
                                  >
                                    Proposal Pending
                                  </NavLink>
                                </NavItem> */}

                                  {/* <NavItem className="nav nav-tabs mb-3">
                                  <NavLink
                                    className={
                                      activeTab == "8"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    onClick={() => [
                                      toggleTab("8"),
                                      setStatus("under-ops"),
                                      resetSingleFilter(),
                                    ]}
                                  >
                                    Quotation
                                  </NavLink>
                                </NavItem> */}

                                  {/* <NavItem className="nav nav-tabs mb-3">
                                  <NavLink
                                    className={
                                      activeTab == "3"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    onClick={() => [
                                      toggleTab("3"),
                                      setStatus("document-pending"),
                                      resetSingleFilter(),
                                    ]}
                                  >
                                    Document Pending
                                  </NavLink>
                                </NavItem> */}
                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '4'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('4'),
                                        setStatus('payment-pending'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Payment Pending
                                    </NavLink>
                                  </NavItem>

                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '7'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('7'),
                                        setStatus('booking-rejected'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Inspection
                                    </NavLink>
                                  </NavItem>

                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '6'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('6'),
                                        setStatus('booking-pending'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Issued
                                    </NavLink>
                                  </NavItem>

                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '5'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('5'),
                                        setStatus('policy-generated'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Booked
                                    </NavLink>
                                  </NavItem>
                                </Nav>
                              </div>

                              <div className='col-12 px-0'>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='1'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                    </div>
                                  </TabPane>
                                </TabContent>

                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='2'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                    </div>
                                  </TabPane>
                                </TabContent>

                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='3'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>

                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='4'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFinalFilterCases />
                                      ) : (
                                        <AllFinalCasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='5'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFinalFilterCases />
                                      ) : (
                                        <AllFinalCasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='6'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFinalFilterCases />
                                      ) : (
                                        <AllFinalCasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='7'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='8'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <div
                                  style={{ float: 'left', clear: 'both' }}
                                  ref={messagesEndRef}
                                />
                              </div>
                            </div>
                          </div>
                        </TabPane>
                      </TabContent>

                      <TabContent activeTab={activeTab2}>
                        <TabPane tabId='2'>
                          <div className='card p-4'>
                            <div className='othervoption'>
                              <div className='row mx-0 px-0 align-items-center'>
                                <div className='col-lg-3 col-md-6 ps-lg-0'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating inother'>
                                      <input
                                        type='text'
                                        className='form-control text-uppercase'
                                        id='msearch'
                                        value={defaultFilterValue.VehicleNo}
                                        placeholder='Search By Reg Number'
                                        onChange={e => {
                                          handleSearch(e.target.value)
                                        }}
                                      />
                                      <label htmlFor='msearch'>
                                        Search By Reg Number
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating inother'>
                                      <input
                                        type='text'
                                        className='form-control text-capitalize'
                                        id='msearchd'
                                        value={defaultFilterValue.name}
                                        placeholder='Search By Reg Number'
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            name: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            name: e.target.value
                                          })
                                        ]}
                                      />
                                      <label htmlFor='msearchd'>
                                        Search By Name
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6 col-12'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating'>
                                      <select
                                        className='form-select'
                                        style={{
                                          paddingTop: '20px',
                                          paddingLeft: '12px'
                                        }}
                                        id='vtyp1'
                                        value={defaultFilterValue.policyType}
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            policyType: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            policyType: e.target.value
                                          })
                                        ]}
                                      >
                                        <option className='d-none' selected=''>
                                          Select Policy Type
                                        </option>
                                        <option value='comprehensive'>
                                          Comprehensive
                                        </option>
                                        <option value='third_party'>
                                          Third party
                                        </option>
                                        <option value='own_damage'>
                                          Own damage
                                        </option>
                                      </select>
                                      <label
                                        htmlFor='vtyp1'
                                        className='floatinglabel'
                                      >
                                        Policy Type
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6 col-12 pe-lg-0'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating'>
                                      <select
                                        className='form-select'
                                        style={{
                                          paddingTop: '20px',
                                          paddingLeft: '12px'
                                        }}
                                        id='vtyp1'
                                        value={defaultFilterValue.vehicleType}
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            vehicleType: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            vehicleType: e.target.value
                                          })
                                        ]}
                                      >
                                        <option className='d-none' selected=''>
                                          Select Vehicle Type
                                        </option>
                                        <option value='Pvt Car'>
                                          Private Car
                                        </option>
                                        <option value='MotorBike'>
                                          MotorBike
                                        </option>
                                        <option value='Scooter'>Scooter</option>
                                        <option value='PCV'>
                                          Passenger Carrying
                                        </option>
                                        <option value='Goods Carrying'>
                                          Goods Carrying
                                        </option>
                                        <option value='Miscellaneous'>
                                          Miscellaneous
                                        </option>
                                        <option value='Trailer'>Trailer</option>
                                      </select>
                                      <label
                                        htmlFor='vtyp1'
                                        className='floatinglabel'
                                      >
                                        Vehicle Type
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="col-lg-3 col-12 ps-0">
																<div className="position-relative form-floating mb-5">
																	<input type="date" className="form-control floatingdate"
																		id="drange" placeholder="Date Range"
																		value={defaultFilterValue.startDate}
																		onChange={(e) => [setFilterValue({
																			...filterValue,
																			startDate: e.target.value
																		}), setCallApi(true),
																		setDefaultFilterValue({
																			...defaultFilterValue,
																			startDate: e.target.value
																		})
																		]}
																	/>

																	<label for="drange" className="floatinglabel">
																		Date Range Start
																	</label>
																</div>
															</div>
															<div className="col-lg-3 col-12">
																<div className="position-relative form-floating mb-5">
																	<input type="date" className="form-control floatingdate"
																		id="drange2" placeholder="Date Range"
																		value={defaultFilterValue.endDate}
																		onChange={(e) => [setFilterValue({
																			...filterValue,
																			endDate: e.target.value
																		}), setCallApi(true),
																		setDefaultFilterValue({
																			...defaultFilterValue,
																			endDate: e.target.value
																		})]}
																	/>

																	<label for="drange2" className="floatinglabel">
																		Date Range End
																	</label>
																</div>
															</div> */}

                                <div className='col-lg-3 col-md-6 col-12 ps-lg-0'>
                                  <div className='position-relative form-floating mb-5'>
                                    <DatePicker
                                      selectsRange={true}
                                      // selected={bookTime.data}
                                      className={
                                        'form-control floatingdate py-3'
                                      }
                                      placeholderText='Enter Date Range'
                                      startDate={startDate}
                                      endDate={endDate}
                                      onChange={update => {
                                        setDateRange(update)
                                        setCallApi(true)
                                      }}
                                      // isClearable={true}
                                    />
                                  </div>
                                </div>

                                <div className='col-lg-3 col-12'>
                                  <button
                                    className='btn btn-primary px-4 py-3 fs-6  mb-lg-5'
                                    type='button'
                                    onClick={resetFilter}
                                  >
                                    {' '}
                                    Reset Filter
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='othervoption'>
                            <div className='row mx-0 px-0 align-items-center'>
                              <div className='col-12 px-0'>
                                <Nav tabs className='my-5 outputtable'>
                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '1'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('1'),
                                        setStatus('pending'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Proposal
                                    </NavLink>
                                  </NavItem>

                                  {/* <NavItem className="nav nav-tabs mb-3">
                                  <NavLink
                                    className={
                                      activeTab == "2"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    onClick={() => [
                                      toggleTab("2"),
                                      setStatus("pending"),
                                      resetSingleFilter(),
                                    ]}
                                  >
                                    Proposal Pending
                                  </NavLink>
                                </NavItem> */}

                                  {/* <NavItem className="nav nav-tabs mb-3">
                                  <NavLink
                                    className={
                                      activeTab == "8"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    onClick={() => [
                                      toggleTab("8"),
                                      setStatus("under-ops"),
                                      resetSingleFilter(),
                                    ]}
                                  >
                                    Quotation
                                  </NavLink>
                                </NavItem> */}

                                  {/* <NavItem className="nav nav-tabs mb-3">
                                  <NavLink
                                    className={
                                      activeTab == "3"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    onClick={() => [
                                      toggleTab("3"),
                                      setStatus("document-pending"),
                                      resetSingleFilter(),
                                    ]}
                                  >
                                    Document Pending
                                  </NavLink>
                                </NavItem> */}
                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '4'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('4'),
                                        setStatus('payment-pending'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Payment Pending
                                    </NavLink>
                                  </NavItem>

                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '7'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('7'),
                                        setStatus('booking-rejected'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Inspection
                                    </NavLink>
                                  </NavItem>

                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '6'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('6'),
                                        setStatus('booking-pending'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Issued
                                    </NavLink>
                                  </NavItem>

                                  <NavItem className='nav nav-tabs mb-3'>
                                    <NavLink
                                      className={
                                        activeTab == '5'
                                          ? 'nav-link active'
                                          : 'nav-link'
                                      }
                                      onClick={() => [
                                        toggleTab('5'),
                                        setStatus('policy-generated'),
                                        resetSingleFilter()
                                      ]}
                                    >
                                      Booked
                                    </NavLink>
                                  </NavItem>
                                </Nav>
                              </div>
                              <div className='col-12 px-0'>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='1'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                    </div>
                                  </TabPane>
                                </TabContent>

                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='2'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                    </div>
                                  </TabPane>
                                </TabContent>

                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='3'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>

                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='4'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFinalFilterCases />
                                      ) : (
                                        <AllFinalCasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='5'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFinalFilterCases />
                                      ) : (
                                        <AllFinalCasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='6'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFinalFilterCases />
                                      ) : (
                                        <AllFinalCasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='7'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <TabContent activeTab={activeTab}>
                                  <TabPane tabId='8'>
                                    <div className='card p-0 border-0'>
                                      {myFilterAllLeads.length > 0 ? (
                                        <AllFilterCasesLead />
                                      ) : (
                                        <ALLcasesTable />
                                      )}
                                      {/* <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} /> */}
                                    </div>
                                  </TabPane>
                                </TabContent>
                                <div
                                  style={{ float: 'left', clear: 'both' }}
                                  ref={messagesEndRef}
                                />
                              </div>
                            </div>
                          </div>
                        </TabPane>
                      </TabContent>

                      <TabContent activeTab={activeTab2}>
                        <TabPane tabId='3'>
                          <div className='card p-4'>
                            <div className='othervoption'>
                              <div className='row mx-0 px-0 align-items-center'>
                                <div className='col-lg-3 col-md-6 ps-lg-0'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating inother'>
                                      <input
                                        type='text'
                                        className='form-control text-uppercase'
                                        id='msearch'
                                        value={defaultFilterValue.VehicleNo}
                                        placeholder='Search By Reg Number'
                                        onChange={e => {
                                          handleSearch(e.target.value)
                                        }}
                                      />
                                      <label htmlFor='msearch'>
                                        Search By Reg Number
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating inother'>
                                      <input
                                        type='text'
                                        className='form-control text-capitalize'
                                        id='msearchd'
                                        value={defaultFilterValue.name}
                                        placeholder='Search By Reg Number'
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            name: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            name: e.target.value
                                          })
                                        ]}
                                      />
                                      <label htmlFor='msearchd'>
                                        Search By Name
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6 col-12'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating'>
                                      <select
                                        className='form-select'
                                        style={{
                                          paddingTop: '20px',
                                          paddingLeft: '12px'
                                        }}
                                        id='vtyp1'
                                        value={defaultFilterValue.policyType}
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            policyType: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            policyType: e.target.value
                                          })
                                        ]}
                                      >
                                        <option className='d-none' selected=''>
                                          Select Policy Type
                                        </option>
                                        <option value='comprehensive'>
                                          Comprehensive
                                        </option>
                                        <option value='third_party'>
                                          Third party
                                        </option>
                                        <option value='own_damage'>
                                          Own damage
                                        </option>
                                      </select>
                                      <label
                                        htmlFor='vtyp1'
                                        className='floatinglabel'
                                      >
                                        Policy Type
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className='col-lg-3 col-md-6 col-12 pe-lg-0'>
                                  <div className='position-relative mb-3'>
                                    <div className='form-floating'>
                                      <select
                                        className='form-select'
                                        style={{
                                          paddingTop: '20px',
                                          paddingLeft: '12px'
                                        }}
                                        id='vtyp1'
                                        value={defaultFilterValue.vehicleType}
                                        onChange={e => [
                                          setFilterValue({
                                            ...filterValue,
                                            vehicleType: e.target.value
                                          }),
                                          setCallApi(true),
                                          setDefaultFilterValue({
                                            ...defaultFilterValue,
                                            vehicleType: e.target.value
                                          })
                                        ]}
                                      >
                                        <option className='d-none' selected=''>
                                          Select Vehicle Type
                                        </option>
                                        <option value='Pvt Car'>
                                          Private Car
                                        </option>
                                        <option value='MotorBike'>
                                          MotorBike
                                        </option>
                                        <option value='Scooter'>Scooter</option>
                                        <option value='PCV'>
                                          Passenger Carrying
                                        </option>
                                        <option value='Goods Carrying'>
                                          Goods Carrying
                                        </option>
                                        <option value='Miscellaneous'>
                                          Miscellaneous
                                        </option>
                                        <option value='Trailer'>Trailer</option>
                                      </select>
                                      <label
                                        htmlFor='vtyp1'
                                        className='floatinglabel'
                                      >
                                        Vehicle Type
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="col-lg-3 col-12 ps-0">
																<div className="position-relative form-floating mb-5">
																	<input type="date" className="form-control floatingdate"
																		id="drange" placeholder="Date Range"
																		value={defaultFilterValue.startDate}
																		onChange={(e) => [setFilterValue({
																			...filterValue,
																			startDate: e.target.value
																		}), setCallApi(true),
																		setDefaultFilterValue({
																			...defaultFilterValue,
																			startDate: e.target.value
																		})
																		]}
																	/>

																	<label for="drange" className="floatinglabel">
																		Date Range Start
																	</label>
																</div>
															</div>
															<div className="col-lg-3 col-12">
																<div className="position-relative form-floating mb-5">
																	<input type="date" className="form-control floatingdate"
																		id="drange2" placeholder="Date Range"
																		value={defaultFilterValue.endDate}
																		onChange={(e) => [setFilterValue({
																			...filterValue,
																			endDate: e.target.value
																		}), setCallApi(true),
																		setDefaultFilterValue({
																			...defaultFilterValue,
																			endDate: e.target.value
																		})]}
																	/>

																	<label for="drange2" className="floatinglabel">
																		Date Range End
																	</label>
																</div>
															</div> */}

                                <div className='col-lg-3 col-md-6 col-12 ps-lg-0'>
                                  <div className='position-relative form-floating mb-5'>
                                    <DatePicker
                                      selectsRange={true}
                                      // selected={bookTime.data}
                                      className={
                                        'form-control floatingdate py-3'
                                      }
                                      placeholderText='Enter Date Range'
                                      startDate={startDate}
                                      endDate={endDate}
                                      onChange={update => {
                                        setDateRange(update)
                                        setCallApi(true)
                                      }}
                                      // isClearable={true}
                                    />
                                  </div>
                                </div>

                                <div className='col-lg-3 col-12'>
                                  <button
                                    className='btn btn-primary px-4 py-3 fs-6 mb-5'
                                    type='button'
                                    onClick={resetFilter}
                                  >
                                    {' '}
                                    Reset Filter
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='othervoption'>
                            <div className='row mx-0 px-0 align-items-center'>
                              <div className='col-12 px-0'>
                                {/* <TabContent activeTab={activeTab}>
                                <TabPane tabId="1"> */}
                                <div className='card p-0 border-0'>
                                  {myFilterAllLeads.length > 0 ? (
                                    <AllFinalFilterCases />
                                  ) : (
                                    <AllFinalCasesTable />
                                  )}
                                </div>
                                {/* </TabPane>
                              </TabContent> */}
                              </div>
                            </div>
                          </div>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*----- row End -----*/}
          </section>
      
      </section>
      {/*----- Content Body Section End -----*/}
    </>
  )
}

export default Cases
