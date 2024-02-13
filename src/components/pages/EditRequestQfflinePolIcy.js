import React, { useEffect, useState } from "react";
// import { NavLink } from 'react-router-dom'
import Header from "../common/Header";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import BasicDetails from "../common/BasicDetails";
// import PolicyDetails from "../common/PolicyDetails";
// import Documents from "../common/Documents";
// import OwnerDetails from "../common/OwnerDetails";
// import PersonalDetails from "../common/PersonalDetails";
// import { GetData, GetDataWithToken, PostDataWithToken, PostImageDataWithToken } from "../../api/apiHelper";
// import { sendErrorMessage, sendSuccessMessage } from "../Services/userServices";
// import { createCustomer, submitInsuranceData } from "../Services/posServices";
import { useLocation, useNavigate } from "react-router-dom";
// import EditPersonalDetail from "../common/EditPersonalDetail";
import EditDocument from "../common/EditDocument";
import { useSelector } from "react-redux";

const EditRequestQfflinePolIcy = () => {
	const type = useSelector((state) => state?.root?.userDetails.type);
	const location = useLocation()
	const allSingleData = location?.state?.allDetail
	
	const [activeTab, setActiveTab] = useState("1");
	const [customerId, setCustomerId] = useState(null);
	const [callFillDataApi, setCallFillDataApi] = useState(false)


	const navigate = useNavigate();
	const [allData, setAllData] = useState({
		basicDetails: {},
		policyDetail: {},
		document: [],
	});

	const [personalData, setPersonalData] = useState({
		ownerDetail: {},
		personalDetail: {},
	});




	const toggleTab = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	console.log("ALL DATA COM", allData);
	console.log("all data 2", personalData);

	// if (
	// 	Object.keys(allData.basicDetails).length > 0 &&
	// 	Object.keys(allData.policyDetail).length > 0 &&
	// 	allData.document.length > 0
	// ) {
	// 	let formData = new FormData();
	// 	Object.keys(allData?.basicDetails).forEach((key) => {
	// 		formData.append(key, allData?.basicDetails[key]);
	// 	});
	// 	Object.keys(allData.policyDetail).forEach((key) => {
	// 		formData.append(key, allData.policyDetail[key]);
	// 	});
	// 	// formData.append('customerId', customerId)
	// 	formData.append("leadType", 1);
	// 	formData.append('type', "offline")
	// 	formData.append('id', allSingleData?.customer?.motorInsurance?.id)

	// 	let ImageData = new FormData();
	// 	let IdArr = []
	// 	// allSingleData?.policy_documents?.filter((e) => e?.id == allData.document.id)
	// 	for (let index = 0; index < allData.document.length; index++) {

	// 		for (let j = 0; j < allSingleData?.policy_documents.length; j++) {
	// 			if (allData.document[index].id == allSingleData?.policy_documents[j].id) {
	// 				IdArr.push(allData.document[index].id)
	// 				console.log("khgk", allData.document[index].id)
	// 			}
	// 		}

	// 	}
	// 	allData.document?.map((item) => {
	// 		ImageData.append(item?.column, item?.image);
	// 	});
	// 	ImageData.append("id", `[${IdArr}]`);
	// 	PostImageDataWithToken(`pos/update-lead`, formData).then((response) => {
	// 		if (response.status === true) {
	// 			console.log("response data", response.data.id);
	// 			setCustomerId(response.data.id);
	// 			// setLoading(false)
	// 			// sendSuccessMessage(response);
	// 			setCallFillDataApi(false)
	// 			PostImageDataWithToken('pos/update-image', ImageData).then((response) => {
	// 				if (response.status === true) {
	// 					console.log("response data", response.data.id);
	// 					setAllData({
	// 						basicDetails: {},
	// 						policyDetail: {},
	// 						document: [],
	// 					});
	// 				}
	// 			})
	// 			// navigate('/quotations')
	// 		} else {
	// 			// setLoading(false)
	// 			// sendErrorMessage(response)
	// 		}
	// 	});
	// }

	// if (
	// 	customerApi == true &&
	// 	Object.keys(personalData.ownerDetail).length > 0 &&
	// 	Object.keys(personalData.personalDetail).length > 0
	// ) {
	// 	console.log("bhjk", activeTab);
	// 	let finalData = {
	// 		id: allSingleData?.customerId,
	// 		...personalData.ownerDetail,
	// 		...personalData.personalDetail,
	// 	};

	// 	console.log("bhjk", finalData);
	// 	PostDataWithToken(`pos/update-customer`, finalData).then((response) => {
	// 		if (response.status === true) {
	// 			console.log("response data", response.data.id);
	// 			// setCustomerId(response.data.id)
	// 			// setLoading(false)
	// 			sendSuccessMessage(response);
	// 			setAllData({
	// 				basicDetails: {},
	// 				policyDetail: {},
	// 				document: [],
	// 			});
	// 			setPersonalData({
	// 				ownerDetail: {},
	// 				personalDetail: {},
	// 			});
	// 			navigate(`/${type}/cases`);
	// 		} else {
	// 			// setLoading(false)
	// 			sendErrorMessage(response);
	// 		}
	// 	});
	// }
	// }
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
							</div>

							<Nav tabs className="nav nav-pills pillwizard mb-3 text-center justify-content-center">
								<NavItem className="nav-item position-relative">
									<NavLink
										className={
											Object.keys(allData.basicDetails).length > 0 || activeTab == "1"
												? "nav-link active"
												: "nav-link"
										}
										onClick={() => toggleTab("1")}
									>
										Basic Details
									</NavLink>
								</NavItem>
								<NavItem className="nav-item position-relative">
									<NavLink
										className={
											activeTab == "2"
												? "nav-link active"
												: "nav-link"
										}
										onClick={() => toggleTab("2")}
									>
										Document
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
								<TabPane tabId="1">
									{/* my proflle start */}
									<BasicDetails
										allData={allSingleData}
										toggleTab={(tab) => setActiveTab(tab)}
										finalData={(e) => setAllData({ ...allData, basicDetails: { ...e } })}
									/>
									{/* my profile end */}
								</TabPane>
							</TabContent>
							<TabContent activeTab={activeTab}>
								<TabPane tabId="2">
									{/* my proflle start */}
									<EditDocument
										allData={allSingleData}
										allPolicyData={allData}
										toggleTab={(tab) => setActiveTab(tab)}
									/>
									{/* my profile end */}
								</TabPane>
							</TabContent>
							{/* <TabContent activeTab={activeTab}>
								<TabPane tabId="3">
									<EditDocument
										allData={allSingleData}
										toggleTab={(tab) => setActiveTab(tab)}
										finalDocumentData={(e) => setAllData({ ...allData, document: [...e] })}
										callApi={(e) => setCallFillDataApi(e)}
									/>
								</TabPane>
							</TabContent> */}
							{/* <TabContent activeTab={activeTab}>
								<TabPane tabId="4">
									<OwnerDetails
										allData={allSingleData}
										toggleTab={(tab) => setActiveTab(tab)}
										finalOwnerData={(e) => setPersonalData({ ...personalData, ownerDetail: { ...e } })}
									/>
								</TabPane>
							</TabContent> */}
							{/* <TabContent activeTab={activeTab}>
								<TabPane tabId="5">
									<EditPersonalDetail
										allData={allSingleData}
										toggleTab={(e) => setCustomerApi(e)}
										finalPersonalData={(e) => setPersonalData({ ...personalData, personalDetail: { ...e } })}
										FinalApi={(e) => setCallFinalApi(e)}
									/>
								</TabPane>
							</TabContent> */}

						</div>
					</div>
				</div>
				{/*----- row End -----*/}
			</section>
			{/*----- Content Body Section End -----*/}
			{/* apple */}
		</>
	);
};

export default EditRequestQfflinePolIcy;
