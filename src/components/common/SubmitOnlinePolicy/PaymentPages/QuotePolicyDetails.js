import moment from 'moment'
import React from 'react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
const QuotePolicyDetails = ({
  submitPolicyDetails = () => {},
  insurerData,
  regYear,
  isNewVehicle
}) => {
  const {
    handleSubmit: handleSubmit1,
    register: register1,
    watch: watch1,
    formState: { errors: errors1 }
  } = useForm({ mode: 'onBlur' })
  const apiRequestQQ = useSelector(state => state.root.apiRequestQQ)
  const previousPolicyKnow = useRef(null)
  previousPolicyKnow.current = watch1('PolicyStatus')

  const ManufaturingDate = useRef(null)
  ManufaturingDate.current = watch1('ManufaturingDate')

  const RegistrationDate = useRef(null)
  RegistrationDate.current = watch1('RegistrationDate')
  let minDate =
    previousPolicyKnow.current === 'continue'
      ? moment().format(`YYYY-MM-DD`)
      : previousPolicyKnow.current === 'expired within 90 day'
      ? moment().subtract(90, 'day').format(`YYYY-MM-DD`)
      : previousPolicyKnow.current === 'expired above 90 day'
      ? moment().subtract(180, 'day').format(`YYYY-MM-DD`)
      : ''
  let maxDate =
    previousPolicyKnow.current === 'continue'
      ? moment().add(90, 'day').format(`YYYY-MM-DD`)
      : previousPolicyKnow.current === 'expired above 90 day'
      ? moment().subtract(90, 'day').format(`YYYY-MM-DD`)
      : moment().format(`YYYY-MM-DD`)

  return (
    <form className='car-company' onSubmit={handleSubmit1(submitPolicyDetails)}>
      <div className='row m-0 pe-lg-5 '>
        {isNewVehicle === false && (
          <div className='col-lg-6 col-md-6 mt-3 ps-lg-0'>
            <div className='form-floating position-relative undefined'>
              <span className='text-secondary'>Select Policy Type</span>
              <select
                name='PolicyStatus'
                {...register1('PolicyStatus', {
                  required: 'Field is required'
                })}
                // style={{marginTop:0}}
                className='form-select'
                style={{ height: 'calc(1.8rem + 10px)', border: '1px solid' }}
                id='idxx0'
              >
                <option value=''>Select </option>
                <option value='continue'>Not Expired</option>
                <option value='expired within 90 day'>
                  Expired Within 90 days
                </option>
                <option value='expired above 90 day'>
                  Expired Above 90 days
                </option>
                <option value='false'>
                  No Information About Previous Policy
                </option>
              </select>
              {/* <label htmlFor="idxx0" className="d-block w-100">
                Select Policy Type
              </label> */}
            </div>
            <p className='f-error'>{errors1?.PolicyStatus?.message}</p>
          </div>
        )}

        <div className='col-lg-6 col-md-6 mt-3 pe-lg-0 '>
          <div className='form-floating position-relative undefined'>
            <span className='text-secondary'>New Policy Type</span>
            <select
              name='NewPolicyType'
              {...register1('NewPolicyType', {
                required: 'Field is required'
              })}
              className='form-select'
              style={{ height: 'calc(1.8rem + 10px)', border: '1px solid' }}
              id='idxx1'
            >
              <option value=''>Select</option>
              {apiRequestQQ.IsVehicleNew == true ? (
                <option selected value='Comprehensive'>
                  Bundled
                </option>
              ) : (
                <>
                  <option value='Comprehensive'>Comprehensive</option>
                  <option value='ThirdParty'>Third Party</option>
                  <option value='ODOnly'>StandAlone OD</option>
                </>
              )}
            </select>
            {/* <label htmlFor="idxx1" className="d-block w-100">
              New policy type?
            </label> */}
          </div>
          <p className='f-error'>{errors1?.NewPolicyType?.message}</p>
        </div>
        {isNewVehicle === false && (
          <>
            <div className='col-lg-6 col-md-6 mt-3 ps-lg-0 '>
              <div className='form-floating position-relative undefined'>
                <span className='text-secondary'>Previous Policy Type</span>
                <select
                  name='PreviousPolicyType'
                  {...register1('PreviousPolicyType', {
                    required: 'Field is required'
                  })}
                  className='form-select'
                  style={{ height: 'calc(1.8rem + 10px)', border: '1px solid' }}
                  id='idxx2'
                >
                  <option value>Select</option>
                  <option value='Comprehensive'>Comprehensive</option>
                  <option value='ThirdParty'>Third Party</option>
                  <option value='ODOnly'>StandAlone OD</option>
                  <option value='Bundled'>Bundled</option>
                </select>
                {/* <label htmlFor="idxx2" className="d-block w-100">
                  Previous policy type?
                </label> */}
              </div>
              <p className='f-error' />
            </div>
            {previousPolicyKnow.current != 'false' && (
              <div className='col-lg-6 col-md-6 mt-3 pe-lg-0'>
                <div className='form-floating position-relative undefined'>
                  <span className='text-secondary'>
                    Previous Policy Insurer
                  </span>
                  <select
                    name='PreInsurerCode'
                    {...register1('PreInsurerCode', {
                      required: 'Field is required'
                    })}
                    className='form-select'
                    style={{
                      height: 'calc(1.8rem + 10px)',
                      border: '1px solid'
                    }}
                    id='idxx3'
                  >
                    <option value>Select</option>
                    {insurerData &&
                      insurerData.length > 0 &&
                      insurerData.map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.option}
                        </option>
                      ))}
                  </select>
                  {/* <label htmlFor="idxx3" className="d-block w-100">
                    Previous Policy Insurer
                  </label> */}
                </div>
                <p className='f-error'>{errors1?.PreInsurerCode?.message}</p>
              </div>
            )}
          </>
        )}

        <div
          className={
            isNewVehicle === false
              ? 'col-lg-6 col-md-6 mt-3 ps-lg-0'
              : 'col-lg-6 col-md-6 mt-3 pe-lg-0'
          }
        >
          <div className='form-floating position-relative'>
            <span className='text-secondary'>Mfg. month of the year</span>
            <input
              {...register1('ManufaturingDate', {
                required: 'Field is required'
              })}
              style={{
                paddingTop: 0,
                paddingBottom: 0,
                height: 'calc(1.8rem + 10px)',
                border: '1px solid'
              }}
              name='ManufaturingDate'
              type='date'
              id='idxx4'
              // style={{height:40}}
              className='datepicker form-control w-100'
              data-date-format='mm/dd/yyyy'
              defaultValue={moment()
                .startOf('month')
                .format(`${regYear}-MM-DD`)}
            />
            {/* <label className="w-100" htmlFor="idxx4">
              Mfg. month of the year
            </label> */}
          </div>
          <p className='f-error'>{errors1?.ManufaturingDate?.message}</p>
        </div>
        <div className='col-lg-6 col-md-6 mt-3 pe-lg-0'>
          <div className='form-floating position-relative'>
            <span className='text-secondary'>Reg. date of your car</span>
            <input
              {...register1('RegistrationDate', {
                required: 'Field is required'
              })}
              style={{
                paddingTop: 0,
                paddingBottom: 0,
                height: 'calc(1.8rem + 10px)',
                border: '1px solid'
              }}
              name='RegistrationDate'
              type='date'
              id='idxx5'
              className='datepicker form-control w-100'
              data-date-format='mm/dd/yyyy'
              defaultValue={
                isNewVehicle === false
                  ? moment().add(1, 'day').format(`${regYear}-MM-DD`)
                  : isNewVehicle === true
                  ? moment().format(`${regYear}-MM-DD`)
                  : ''
              }
              min={ManufaturingDate.current}
              max={moment(ManufaturingDate.current, 'YYYY-MM-DD')
                .add(1, 'year')
                .format('YYYY-MM-DD')}
            />
            {/* <label className="w-100" htmlFor="idxx5">
              Reg. date of your car
            </label> */}
          </div>
          <p className='f-error'>{errors1?.RegistrationDate?.message}</p>
        </div>
        {isNewVehicle == false && previousPolicyKnow.current != 'false' && (
          <div className='col-lg-6 col-md-6 mt-3 ps-lg-0'>
            <div className='form-floating position-relative'>
              <span className='text-secondary'>
                Prev. year policy expire date
              </span>
              <input
                {...register1('PrePolicyEndDate', {
                  required: 'Field is required'
                })}
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  height: 'calc(1.8rem + 10px)',
                  border: '1px solid'
                }}
                name='PrePolicyEndDate'
                type='date'
                min={minDate}
                max={maxDate}
                id='idxx6'
                className='datepicker form-control w-100'
                data-date-format='mm/dd/yyyy'
                defaultValue
              />
              {/* <label className="w-100" htmlFor="idxx6">
                Prev. year policy expiry date
              </label> */}
            </div>
            <p className='f-error'>{errors1?.PrePolicyEndDate?.message}</p>
          </div>
        )}

        <div className='col-lg-6 col-md-6 mt-3 pe-lg-0'>
          <div className='form-floating position-relative undefined'>
            <span className='text-secondary'>Vehicle owned by</span>
            <select
              name='CustomerType'
              {...register1('CustomerType', {
                required: 'Field is required'
              })}
              className='form-select'
              style={{ height: 'calc(1.8rem + 10px)', border: '1px solid' }}
              id='idxx7'
            >
              <option value>Select</option>
              <option value='INDIVIDUAL'>Individual</option>
              <option value='COMPANY'>Organization</option>
            </select>
            {/* <label htmlFor="idxx7" className="d-block w-100">
              Vehicle Owned By
            </label> */}
          </div>
          <p className='f-error'>{errors1?.CustomerType?.message}</p>
        </div>
        {isNewVehicle === false && previousPolicyKnow.current != 'false' && (
          <>
            <div className='col-lg-6 col-md-6 mt-3 ps-lg-0'>
              <div className='form-floating position-relative undefined'>
                <span className='text-secondary'>
                  Previous no claim bonus (NCB)
                </span>
                <select
                  name='PreviousNoClaimBonus'
                  {...register1('PreviousNoClaimBonus', {
                    required: 'Field is required'
                  })}
                  className='form-select'
                  style={{ height: 'calc(1.8rem + 10px)', border: '1px solid' }}
                  id='idxx8'
                >
                  <option value>Select</option>
                  <option value={0}>0%</option>
                  <option value={20}>20%</option>
                  <option value={25}>25%</option>
                  <option value={35}>35%</option>
                  <option value={45}>45%</option>
                  <option value={50}>50%</option>
                </select>
                {/* <label htmlFor="idxx8" className="d-block w-100">
                  Previous No Claim Bonus (NCB)
                </label> */}
              </div>
              <p className='f-error'>
                {errors1?.PreviousNoClaimBonus?.message}
              </p>
            </div>
            <div className='col-lg-6 col-md-6 mt-3 pe-lg-0'>
              <div className='form-floating position-relative undefined'>
                <span className='text-secondary'>
                  Claim made in expiring policy?
                </span>
                <select
                  {...register1('PreviousInsuranceClaimed', {
                    required: 'Field is required'
                  })}
                  name='PreviousInsuranceClaimed'
                  className='form-select'
                  style={{ height: 'calc(1.8rem + 10px)', border: '1px solid' }}
                  id='idxx9'
                >
                  <option value>Select</option>
                  <option value='true'>Yes</option>
                  <option value='false'>No</option>
                </select>
                {/* <label htmlFor="idxx9" className="d-block w-100">
                  Claim made in expiring policy?
                </label> */}
              </div>
              <p className='f-error'>
                {errors1?.PreviousInsuranceClaimed?.message}
              </p>
            </div>
          </>
        )}

        <div className='col-12'>
          <div
            style={{ marginTop: 20 }}
            className='form-btns d-flex justify-content-center align-items-center mt-3 w-100'
          >
            <button
              type='submit'
              className='btn btn-primary'
              style={{ width: 250, marginTop: 20 }}
            >
              Get Prefered Quote
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default QuotePolicyDetails
