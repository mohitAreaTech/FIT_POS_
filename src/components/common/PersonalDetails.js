import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GetData, PostDataWithToken } from '../../api/apiHelper'
// import { submitInsuranceData } from '../Services/posServices'
import { sendErrorMessage, sendSuccessMessage } from '../services/userServices'
import { NomineeInput, personalDetailInput } from './InputData/InsuranceInputData'
import SelectList from './InputData/SelectList'
import InputField from './Tags/InputField'

const PersonalDetails = ({ finalPersonalData, toggleTab, allData, policyData, personal }) => {
	const [nomineeRelaton, setNomineeRelaton] = useState([])
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const type = useSelector((state) => state?.root?.userDetails.type);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm({ mode: "onBlur" });

	useEffect(() => {
		if (allData !== null) {
			reset({
				gender: allData?.customer?.gender,
				marital_status: allData?.customer?.marital_status,
				occupation: allData?.customer?.occupation,
				nominee_name: allData?.customer?.nominee_name,
				nominee_relation: allData?.customer?.nominee_relation,
				nominee_age: allData?.customer?.nominee_age,


			})
		}

		GetData('pos/get-nominee', '')
			.then((response) => {
				if (response.status == true) {
					console.log("nkkdk", response.data)
					setNomineeRelaton(response.data)
				}
			})
	}, [])

	const submitPersonalDetail = (data) => {
		toggleTab(true)
		finalPersonalData({ ...data })

		if (
			Object.keys(personal.ownerDetail).length > 0 &&
			Object.keys(policyData.basicDetails).length > 0 &&
			Object.keys(policyData.policyDetail).length > 0 &&
			policyData.document.length > 0
		) {


			// console.log("bhjk", activeTab);
			let finalData = {
				...personal.ownerDetail,
				...data,
			};
			console.log("bhjk", finalData);
			let formData = new FormData();
			Object.keys(policyData?.basicDetails).forEach((key) => {
				formData.append(key, policyData?.basicDetails[key]);
			});
			Object.keys(policyData.policyDetail).forEach((key) => {
				formData.append(key, policyData.policyDetail[key]);
			});
			policyData.document?.forEach((item) => {
				formData.append(item?.column, item?.image);
			});
			// formData.append('customerId', customerId)
			formData.append("leadType", 1);
			formData.append('type', "offline")

			setLoading(true)

			submitInsuranceData(formData).then((response) => {
				if (response.status === true) {
					console.log("response data", response.data.id);
					// setCustomerId(response.data.id);
					// setLoading(false)
					// sendSuccessMessage(response);
					// setCallFillDataApi(false)
					// setAllData({
					// 	basicDetails: {},
					// 	policyDetail: {},
					// 	document: [],
					// });

					PostDataWithToken(`pos/create-customer/${response.data.id}`, finalData).then((response) => {
						if (response.status === true) {
							console.log("response data", response.data.id);
							// setCustomerId(response.data.id)
							// setLoading(false)
							sendSuccessMessage(response);
							// setAllData({
							// 	basicDetails: {},
							// 	policyDetail: {},
							// 	document: [],
							// });
							// setPersonalData({
							// 	ownerDetail: {},
							// 	personalDetail: {},
							// });
							navigate(`/${type}/cases`);
						} else {
							setLoading(false)
							sendErrorMessage(response);
						}
					});
					// navigate('/quotations')
				} else {
					setLoading(false)
					sendErrorMessage(response)
				}
			});

		}
	}
	return (
		<>
			<div className="card p-4 mt-3">
				<form onSubmit={handleSubmit(submitPersonalDetail)}>
					<small className="fw-bold fs-3">Personal Details</small>
					<div className="othervoption mt-3">
						<div className="row mx-0 px-0">

							{
								personalDetailInput && personalDetailInput.length > 0 && personalDetailInput.map((item, index) => {
									if (item.type === 'text' || item.type === "date" || item.type === "number" || item.type === 'email') {
										return <>
											<InputField label={item.option} showclass={item.customprop} type={item.type} id={"policy" + index} placeholder={item.placeholder} name={item.name} register={register(`${item.name}`, item.validation)}
												error={errors[item.name]?.message} />
										</>
									} else if (item.type === "select") {
										return <>
											<SelectList id={"sel" + index} showclass={item.customprop} option={item.data} label={item.option} name={item.name} placeholder={item.placeholder}
												error={errors[item.name]?.message} register={register(item.name, item.validation)}
											/>
										</>
									}

								})}

						</div>
					</div>
					<small className="fw-bold fs-3">Nominee Details</small>
					<div className="othervoption mt-3">
						<div className="row mx-0 px-0">
							{
								NomineeInput && NomineeInput.length > 0 && NomineeInput.map((item, index) => {
									if (item.type === 'text' || item.type === "date" || item.type === "number" || item.type === 'email') {
										return <>
											<InputField label={item.option} showclass={item.customprop} type={item.type} id={"policy" + index} placeholder={item.placeholder} name={item.name} register={register(`${item.name}`, item.validation)}
												error={errors[item.name]?.message} />
										</>
									} else if (item.type === "select") {
										return <>
											<SelectList id={"sel" + index} showclass={item.customprop} option={item.data} label={item.option} name={item.name} placeholder={item.placeholder}
												error={errors[item.name]?.message} register={register(item.name, item.validation)}
											/>
										</>
									}

								})}

							<div className="col-lg-4 col-12 pe-lg-0">
								<div className="position-relative mb-5">
									<div className="form-floating">
										<select
											className="form-select"
											{...register("nominee_relation", {
												required: "Field is required",
											})}
											id="insurer1"
										>
											<option className="d-none" value="">
												Select Nominee relation
											</option>
											{nomineeRelaton && nomineeRelaton.length > 0 && nomineeRelaton.map((item, i) => (
												<option value={item.relation} key={i}>{item.relation}</option>
											))}
										</select>
										<label htmlFor="insurer1" className="floatinglabel">
											Nominee relation
										</label>
									</div>
									<span className="text-danger">{errors?.nominee_relation?.message}</span>
								</div>
							</div>

							<div className="col-lg-3 col-12 ps-lg-0">
								<button
									type='submit'
									className="btn btn-primary mt-5 mt-3 fs-2 py-3 w-50"
								>
									{loading == true ? <span className="spinner-border spinner-border-sm"></span> : "Submit"}
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	)
}

export default PersonalDetails