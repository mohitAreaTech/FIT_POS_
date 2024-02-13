import React, { useState } from 'react'
// import { NavLink } from 'react-router-dom'
// import Header from "../common/Header";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import BasicDetails from '../../common/BasicDetails'
// import PolicyDetails from "../common/PolicyDetails";
import Documents from '../../common/Documents'
// import OwnerDetails from "../common/OwnerDetails";
// import PersonalDetails from "../common/PersonalDetails";
// import { GetData, PostDataWithToken } from "../../api/apiHelper";
// import { sendErrorMessage, sendSuccessMessage } from "../Services/userServices";
// import { createCustomer, submitInsuranceData } from "../Services/posServices";
import { useNavigate } from 'react-router-dom'
import SideBar from '../../common/SideBar'
import Header from '../../common/Header'

const RequestOfflinePolicy = () => {
  const [activeTab, setActiveTab] = useState('1')
  // const [customerId, setCustomerId] = useState(null);
  // const [loading, setLoading] = useState(false)
  // const type = useSelector((state) => state?.root?.userDetails.type);

  const navigate = useNavigate()
  const [allData, setAllData] = useState({
    basicDetails: {}
  })
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  console.log('ALL DATA COM', allData)

  return (
    <>
      <div>
        <SideBar />

        <section class='home-section'>
          <div class='home-content'>
            <div id='main_div'>
              <Header />
            </div>

            {/* <Header /> */}
            {/*----- Content Body Section Start -----*/}
            <section className='content-body px-lg-5 px-3 mt-5'>
              <div className='container-fluid'>
                {/*----- row Start -----*/}
                <div className='row'>
                  <div className='col-xl-12'>
                    <div className='d-flex my-4 justify-content-between align-items-center d-none'>
                      <nav>
                        <ol className='breadcrumb'>
                          <li className='breadcrumb-item'>
                            <a href='NewPos.html'>Home</a>
                          </li>
                          <li className='breadcrumb-item'>
                            <a href='ofreq.html'>Reques Offline Policy</a>
                          </li>
                          <li className='breadcrumb-item active'>
                            Basic Details
                          </li>
                        </ol>
                      </nav>
                    </div>

                    <Nav
                      tabs
                      className='nav nav-pills pillwizard text-center justify-content-center mb-5'
                    >
                      <NavItem className='nav-item position-relative'>
                        <NavLink
                          className={
                            Object.keys(allData.basicDetails).length > 0 ||
                            activeTab == '1'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          onClick={() => toggleTab('1')}
                        >
                          Basic Details
                        </NavLink>
                      </NavItem>

                      <NavItem className='nav-item position-relative'>
                        <NavLink
                          className={
                            activeTab == '2' ? 'nav-link active' : 'nav-link'
                          }
                          onClick={() => toggleTab('2')}
                        >
                          Documents
                        </NavLink>
                      </NavItem>
                      {/* <NavItem className="nav-item position-relative">
									<NavLink
										className={
											allData.document.length > 0 || activeTab == "3" || activeTab == "4" || activeTab == "5"
												? "nav-link active"
												: "nav-link"
										}
										onClick={() => toggleTab("3")}
									>
										Documents
									</NavLink>
								</NavItem>
								<NavItem className="nav-item position-relative">
									<NavLink
										className={
											Object.keys(personalData.ownerDetail).length > 0 || activeTab == "4" || activeTab == "5"
												? "nav-link active"
												: "nav-link"
										}
										onClick={() => toggleTab("4")}
									>
										Owner Details
									</NavLink>
								</NavItem>

								<NavItem className="nav-item position-relative">
									<NavLink
										className={
											Object.keys(personalData.personalDetail).length > 0 || activeTab == "5"
												? "nav-link active toggle-none"
												: "nav-link toggle-none"
										}
										onClick={() => toggleTab("5")}
									>
										Personal Details
									</NavLink>
								</NavItem> */}
                    </Nav>

                    <TabContent activeTab={activeTab}>
                      <TabPane tabId='1'>
                        {/* my proflle start */}
                        <BasicDetails
                          toggleTab={tab => setActiveTab(tab)}
                          finalData={e =>
                            setAllData({ ...allData, basicDetails: { ...e } })
                          }
                        />
                        {/* my profile end */}
                      </TabPane>
                    </TabContent>

                    <TabContent activeTab={activeTab}>
                      <TabPane tabId='2'>
                        {/* my proflle start */}

                        <Documents
                          toggleTab={tab => setActiveTab(tab)}
                          allPolicyData={allData}
                        />

                        {/* <PolicyDetails
										toggleTab={(tab) => setActiveTab(tab)}
										finalPolicyData={(e) => setAllData({ ...allData, policyDetail: { ...e } })}
									/> */}
                        {/* my profile end */}
                      </TabPane>
                    </TabContent>
                    {/* <TabContent activeTab={activeTab}>
								<TabPane tabId="3">
									<Documents
										toggleTab={(tab) => setActiveTab(tab)}
										finalDocumentData={(e) => setAllData({ ...allData, document: [...e] })}
										callApi={(e) => setCallFillDataApi(e)}
									/>
								</TabPane>
							</TabContent>
							<TabContent activeTab={activeTab}>
								<TabPane tabId="4">

									<OwnerDetails
										toggleTab={(tab) => setActiveTab(tab)}
										finalOwnerData={(e) => setPersonalData({ ...personalData, ownerDetail: { ...e } })}
									/>
					
								</TabPane>
							</TabContent>
							<TabContent activeTab={activeTab}>
								<TabPane tabId="5">
							
									<PersonalDetails
										toggleTab={(e) => setCustomerApi(e)}
										finalPersonalData={(e) => setPersonalData({ ...personalData, personalDetail: { ...e } })}
										policyData={allData}
										personal={personalData}
									/>
								</TabPane>
							</TabContent> */}
                  </div>
                </div>
              </div>
              {/*----- row End -----*/}
            </section>
            {/*----- Content Body Section End -----*/}
          </div>
        </section>
      </div>
    </>
  )
}

export default RequestOfflinePolicy
