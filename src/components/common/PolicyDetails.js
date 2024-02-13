import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { GetData } from '../../api/apiHelper';
import { PreferPolicyDetails, PreviousPolicyDetail } from './InputData/InsuranceInputData'
import SelectList from './InputData/SelectList';
import InputField from './Tags/InputField';
// import { Multiselect } from "multiselect-react-dropdown";
import { MultiSelect } from "react-multi-select-component";
// import Select from "react-select";



const PolicyDetails = ({ finalPolicyData, toggleTab, allData }) => {
	const [allAddons, setAllAddons] = useState([])
	const [allCompany, setAllCompany] = useState([])

	const [previousAddon, setPreviousAddon] = useState([]);
	const [requiredAddon, setRequiredAddon] = useState([]);
	const [preferedInc, setPreferedInc] = useState([]);

	useEffect(() => {
		if (allData !== null) {
			reset({

				previous_policy_add_on: allData?.customer?.motorInsurance?.previous_policy_add_on,
				required_insurance_company: allData?.customer?.motorInsurance?.required_insurance_company,
				required_add_on: allData?.customer?.motorInsurance?.required_add_on,
				reason: allData?.customer?.motorInsurance?.reason,
				remark: allData?.customer?.motorInsurance?.remarks,
				policy_status: allData?.customer?.motorInsurance?.policy_status,
				previous_policy_idv: allData?.customer?.motorInsurance?.previous_policy_idv,
				previous_policy_discount: allData?.customer?.motorInsurance?.previous_policy_discount,
				require_idv: allData?.customer?.motorInsurance?.require_idv,
				expected_final_premium: allData?.customer?.motorInsurance?.expected_final_premium,
				require_discount: allData?.customer?.motorInsurance?.require_discount,
			})
			let preaddon = allData?.customer?.motorInsurance?.previous_policy_add_on.split(",")
			let reqaddon = allData?.customer?.motorInsurance?.required_add_on.split(",")
			let preCompany = allData?.customer?.motorInsurance?.required_insurance_company.split(',')
			let preAddon = []
			let reqAddon = []
			let preInc = []
			preaddon?.map((item) => {
				preAddon.push({
					label: item,
					value: item,
				})
			})
			setPreviousAddon(preAddon)
			reqaddon?.map((item) => {
				reqAddon.push({
					label: item,
					value: item
				})
			})
			setRequiredAddon(reqAddon)
			preCompany?.map((item) => {
				preInc.push({
					label: item,
					value: item
				})
			})
			setPreferedInc(preInc)
		}
	}, [''])

	console.log("all other data", previousAddon, requiredAddon, preferedInc)


	// const handleSelect = (selectedList) => {
	// 	setPreviousAddon(selectedList)
	// };

	// const handleRemove = (selectedList) => {
	// 	setPreviousAddon(selectedList);
	// };


	// const handleSelectInc = (selectedList) => {
	// 	setPreferedInc(selectedList)
	// };

	// const handleRemoveInc = (selectedList) => {
	// 	setPreferedInc(selectedList);
	// };

	// const handleSelectReqAddon = (selectedList) => {
	// 	setRequiredAddon(selectedList)
	// };

	// const handleRemoveReqAddon = (selectedList) => {
	// 	setRequiredAddon(selectedList);
	// };



	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm({ mode: "onBlur" });

	useEffect(() => {
		GetData("pos/addons", '')
			.then((response) => {
				if (response.status == true) {
					console.log("jkhdkhd", response.data)
					let arr = []
					response.data.map((item) => {
						arr.push({
							label: item.addons,
							value: item.addons
						})
					})
					setAllAddons(arr)
				}
			})

		GetData(`pos/get-company`, '')
			.then((response) => {
				if (response.status == true) {
					console.log("first rto", response.data)
					let arr = []
					response.data.map((item) => {
						arr.push({
							label: item.name,
							value: item.name
						})
					})
					setAllCompany(arr)
					reset({
						previous_policy_insurance_company: allData?.customer?.motorInsurance?.previous_policy_insurance_company,
					})
				}
			})

	}, [''])

	const submitPolicyDetails = (data) => {
		let preAddon = []
		let reqAddon = []
		let preInc = []
		previousAddon.map((item) => {
			preAddon.push(item.value)
		})
		requiredAddon.map((item) => {
			reqAddon.push(item.value)
		})
		preferedInc.map((item) => {
			preInc.push(item.value)
		})

		console.log("fin all", { ...data })
		toggleTab("3")
		finalPolicyData({
			...data, required_insurance_company: preInc.toString(),
			required_add_on: reqAddon.toString(),
			previous_policy_add_on: preAddon.toString(),
		})
	}

	return (
		<>
			<div className="card p-4 mt-3">
				{/* <small className="fw-bold fs-2 mb-2">Previous Policy Details</small> */}

				<form onSubmit={handleSubmit(submitPolicyDetails)} >
					{/* <div className="othervoption">
						<div className="row mx-0 px-0  align-items-center">

							{
								PreviousPolicyDetail && PreviousPolicyDetail.length > 0 && PreviousPolicyDetail.map((item, index) => {
									if (item.type === 'text' || item.type === "date" || item.type === "number") {
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

							<div className="col-lg-4 col-12 ps-lg-0">
								<div className="position-relative mb-5">
									<div className="form-floating mt-4">
										<select
											className="form-select"
											{...register("previous_policy_insurance_company", {
												required: "Field is required",
											})}
											id="insurer1"
										>
											<option className="d-none" value="">
												Select Previous Insurer
											</option>
											{allCompany && allCompany.length > 0 && allCompany.map((item, i) => (
												<option value={item.value} key={i}>{item.value}</option>
											))}
										</select>

										<label htmlFor="insurer1" className="floatinglabel">
											Previous Insurer
										</label>
									</div>

									<span className="mb-0 f-error">{errors?.previous_policy_insurance_company?.message}</span>
								</div>
							</div>

							<div className="col-lg-4">
								<div className="form-floating mb-4">
									<MultiSelect
										options={allAddons}
										value={previousAddon}
										onChange={setPreviousAddon}
										labelledBy={"Select Previous addon"}
										isCreatable={true}
									/>

									<label htmlFor="modal" className="npm-lable">
										Select Previous addon
										<span className="text-danger">*</span>
									</label>

								</div>
							</div>
						</div>
					</div> */}

					<small className="fw-bold fs-2">Prefered Quote Details</small>

					<div className="othervoption mt-3">
						<div className="alert alert-primary  fade show mb-4">
							<div className="row mx-0 px-0  align-items-center">
								{
									PreferPolicyDetails && PreferPolicyDetails.length > 0 && PreferPolicyDetails.map((item, index) => {
										if (item.type === 'text' || item.type === "date" || item.type === "number") {
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


								<div className="col-lg-4 ps-lg-0">
									<div className=" mb-5 form-floating">
										<MultiSelect
											options={allCompany}
											value={preferedInc}
											onChange={setPreferedInc}
											// labelledBy={"Select Previous addon"}
											isCreatable={true}
										/>

										<label htmlFor="modal" className="npm-lable">
											Select Prefered Insurer
											<span className="text-danger">*</span>
										</label>



									</div>
								</div>

								<div className="col-lg-4">
									<div className=" mb-5">
										<div className="form-floating">

											<MultiSelect
												options={allAddons}
												value={requiredAddon}
												onChange={setRequiredAddon}
												labelledBy={"Select Previous addon"}
												isCreatable={true}
											/>

											<label htmlFor="modal" className='npm-lable' >
												Select Prefered addon
												<span className="text-danger">*</span>
											</label>

										</div>
									</div>
								</div>

							</div>
						</div>

					</div>

					<div className="othervoption mt-5 pt-3">
						<div className="col-lg-4 ps-lg-0">
							<div className="position-relative mb-5">
								<div className="form-floating">
									<select className="form-select" id="reason"
										{...register("reason", {
											required: 'This field is required',
										})}
									>
										<option className="d-none" value="">
											Select Prefered Reason
										</option>
										<option>High IDV</option>
										<option>Discount Not Avaiable</option>
										<option>Reason 1</option>
										<option>Reason</option>
									</select>
									<label htmlFor="reason">
										Reason for offline quote
										<span className="text-danger">*</span>
									</label>

									<span className="mb-0 f-error">{errors?.reason?.message}</span>
								</div>
							</div>
						</div>
						<div className="col-12 ps-lg-0">
							<div className="form-floating">
								<textarea
									className="form-control"
									placeholder="Remark/Comments"
									id="remark"
									defaultValue={""}
									{...register("remark", {
										required: false,
									})}
								/>
								<label htmlFor="remark">Remarks/Comments</label>
							</div>
						</div>
						<div className="col-lg-3 col-12 ps-lg-0 mt-5">
							<button
								type='submit'
								className="btn btn-primary mb-5 mt-3 fs-2 py-3 w-50"
							>
								Next
							</button>
						</div>
					</div>
				</form>
			</div >
		</>
	)
}

export default PolicyDetails