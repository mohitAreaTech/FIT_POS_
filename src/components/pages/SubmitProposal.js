import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import {
  getFiancierBankData,
  getVehiclePincode,
  getVehiclePreviousInsurer,
  getVehicleRto
} from '../services/masterService'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OwnerDetails from '../common/SubmitOnlinePolicy/OwnerDetails'
import NomineeDetails from '../common/SubmitOnlinePolicy/NomineeDetails'
import VehicleDetails from '../common/SubmitOnlinePolicy/VehicleDetails'
const SubmitProposal = () => {
  const [activeTab, setActiveTab] = React.useState(1)
  const toggle = tab => setActiveTab(tab)
  const [state, setState] = React.useState([])
  const [rtoData, setRtoData] = React.useState([])
  const [pincodeData, setPincodeData] = React.useState([])
  const navigate = useNavigate()
  const [cityData, setCityData] = useState([])
  const [financierData, setFinancierData] = useState([])
  const [insurerData, setInsurerData] = React.useState([])
  const selectedPlan = useSelector(state => state.root.selectedPlan)
  const apiRequestQQ = useSelector(state => state.root.apiRequestQQ)
  useEffect(() => {
    // getStates()
    //   .then(response => {
    //     if (response.state === true) {
    //       let i = 0;
    //       let arr = []
    //       while (i < response.data.length) {
    //         arr.push({
    //           value: response.data[i].Digit_Code,
    //           label: response.data[i].State_Name,
    //         })
    //         i++
    //       }
    //       setState(arr);
    //     }
    //   }).catch(err => console.log(err));
    getVehiclePincode()
      .then(response => {
        if (response.status === true) {
          let i = 0
          let arr = []
          let arr1 = []
          let j = 0
          while (i < response.data.length) {
            arr.push({
              value: response.data[i].Pin_Code,
              label:
                response.data[i].Pin_Code + ' - ' + response.data[i].District,
              District: response.data[i].District,
              City: response.data[i].City
            })

            i++
          }
          while (j < response.data.length) {
            arr1.push({
              value: response.data[j].Pin_Code,
              label: response.data[j].District,
              District: response.data[j].District,
              City: response.data[j].City
            })

            j++
          }
          setPincodeData(arr)
          setCityData(arr1)
        }
      })
      .catch(err => console.log(err))

    getFiancierBankData()
      .then(response => {
        if (response.status === true) {
          let i = 0
          let arr = []
          while (i < response.data.length) {
            arr.push({
              value: response.data[i].bank_name,
              label: response.data[i].bank_name
            })

            i++
          }
          setFinancierData(arr)
        }
      })
      .catch(err => console.log(err))

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
    getVehicleRto().then(response => {
      if (response.status === true) {
        let data = response.data
        let i = 0
        let arr = []
        while (i < data.length) {
          let item = data[i]
          arr.push({
            label: item.registered_city_name + ' (' + item.RTO_Code + ')',
            value: item.RTO_Code,
            registered_state_name: item?.registered_state_name,
            id: item.id
          })
          i++
        }
        setRtoData(arr)
      }
    })
  }, [])

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div>
      {/* <SideBar /> */}

      {/* <section class="home-section"> */}
      <div class='home-content'>
        <div id='main_div'>
          <Header />
        </div>
        <section className='content-body px-lg-5 px-3 mt-5'>
          <button
            onClick={() => handleBack()}
            style={{
              border: 'none',
              borderRadius: '5px',
              backgroundColor: 'lightblue',
              padding: '5px 10px'
            }}
          >
            Back
          </button>
          <div className='container-fluid'>
            {/*----- row Start -----*/}
            <div className='row'>
              <div className='col-xl-12'>
                {/* <div className="d-flex my-4 justify-content-between align-items-center">
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
							</div> */}
                {/*----- Quote Process Step Tab -----*/}
                <Nav className='nav nav-pills pillwizard mb-5 text-center justify-content-center'>
                  <NavItem className='nav-item position-relative'>
                    <NavLink
                      className={
                        activeTab == '1' || activeTab == '2'
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      // onClick={() => toggleTab("1")}
                    >
                      Basic Details
                    </NavLink>
                  </NavItem>
                  <NavItem className='nav-item position-relative'>
                    <NavLink
                      className={
                        activeTab == '2'
                          ? 'nav-link active toggle-none'
                          : 'nav-link  toggle-none'
                      }
                      // onClick={() => toggleTab("2")}
                    >
                      Nominee Details
                    </NavLink>
                  </NavItem>
                  <NavItem className='nav-item position-relative'>
                    <NavLink
                      className={
                        activeTab == '3'
                          ? 'nav-link active toggle-none'
                          : 'nav-link  toggle-none'
                      }
                      // onClick={() => toggleTab("2")}
                    >
                      Vehicle Details
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}>
                    <OwnerDetails
                      pincodeData={pincodeData}
                      state={state}
                      activeTab={activeTab}
                      toggle={tab => toggle(tab)}
                    />
                  </TabPane>

                  <TabPane tabId={2}>
                    <NomineeDetails
                      activeTab={activeTab}
                      toggle={tab => toggle(tab)}
                    />
                  </TabPane>
                  <TabPane tabId={3}>
                    <VehicleDetails
                      cityData={cityData.reduce(
                        (c, n) =>
                          c.find(el => el.District == n.District)
                            ? c
                            : [...c, n],
                        []
                      )}
                      insurerData={insurerData}
                      financierData={financierData}
                      rtoData={rtoData}
                      activeTab={activeTab}
                      toggle={tab => toggle(tab)}
                    />
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </div>
          {/*----- row End -----*/}
        </section>
      </div>
      {/* </section> */}
    </div>
  )
}

export default SubmitProposal
