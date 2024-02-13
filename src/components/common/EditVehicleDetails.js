import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactSelect from 'react-select'

import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { dispatchQuickQuote } from '../../store/actions/userAction'
import {
  getBajajMMV,
  getVehicleMake,
  getVehicleModel,
  getVehicleVariant
} from '../services/masterService'
const EditVehicleDetails = ({ modal, toggleModal, updateMMV = () => {} }) => {
  const [makeData, setMakeData] = React.useState([])
  const [modelData, setModelData] = React.useState([])
  const [variantData, setVariantData] = React.useState([])
  const [fuelTypes, setFuelTypes] = useState([])
  // const [vehicleModel, setVehicleModel] = React.useState("");
  const [newFilter, setNewFilter] = useState({})
  const apiRequestQQ = useSelector(state => state.root.apiRequestQQ)
  const vehicleModel =
    apiRequestQQ.VehicleType === '4w'
      ? 'Pvt Car'
      : apiRequestQQ.VehicleType === '2w'
      ? 'MotorBike'
      : apiRequestQQ.VehicleType === 'gcv'
      ? 'Goods Carrying'
      : apiRequestQQ.VehicleType === 'pcv' && 'Passenger Carrying'

  useEffect(() => {
    // setVehicleModel(VehicleModel);
    if (modal == false) {
      setNewFilter({
        ...newFilter,
        VariantName: apiRequestQQ.VariantName,
        RegistrationDate: apiRequestQQ.RegistrationDate,
        ManufaturingDate: apiRequestQQ.ManufaturingDate,
        MakeName: apiRequestQQ.MakeName,
        ModelName: apiRequestQQ.ModelName,
        FuelType: apiRequestQQ.FuelType
      })
    }

    if (modal === true) {
      getVehicleMake({ Vehicle_Type: vehicleModel }).then(response => {
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
      handleSelectMake(apiRequestQQ.MakeName)
      handleSelectModel(apiRequestQQ.ModelName)
    }
  }, [modal])

  const handleSelectMake = make => {
    setNewFilter(prevState => ({ ...prevState, MakeName: make }))
    // dispatchQuickQuote("MakeName", make);
    getVehicleModel({ make: make, Vehicle_Type: vehicleModel }).then(
      response => {
        if (response.status === true) {
          // toggleTab(activeTab + 1);
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
      }
    )
  }

  const handleSelectModel = model => {
    dispatchQuickQuote('ModelName', model)
    setNewFilter(prevState => ({ ...prevState, ModelName: model }))
    getVehicleVariant({
      make: apiRequestQQ.MakeName,
      model: model,
      Vehicle_Type: vehicleModel
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
        setFuelTypes(fuelarr)
        let i = 0
        let arr = []
        while (i < data.length) {
          let item = data[i]
          arr.push({
            label: item.Variant,
            value: item.Vehicle_Code,
            Fuel_Type: item.Fuel_Type,
            Cubic_Capacity: item.Cubic_Capacity,
            HDFC: item.HDFC,
            Shriram: item.Shriram,
            Kotak: item.Kotak,
            Reliance: item.Reliance
          })
          i++
        }
        setVariantData(arr)

        // toggleTab(activeTab + 1);
      }
    })
  }

  const handleSelectPetrolType = val => {
    dispatchQuickQuote('FuelType', val)
    setNewFilter(prevState => ({ ...prevState, FuelType: val }))
    // toggleTab(activeTab + 1);
  }

  const handleSelectVariant = variant => {
    console.log('variant ---------', variant)

    // dispatchQuickQuote("VariantCode.Digit", variant.value);
    // dispatchQuickQuote("VariantCode.HDFC", variant.HDFC);
    // dispatchQuickQuote("VariantCode.Shriram", variant.Shriram);
    setNewFilter(prevState => ({ ...prevState, Digit: variant.value }))
    setNewFilter(prevState => ({ ...prevState, HDFC: variant.HDFC }))
    setNewFilter(prevState => ({ ...prevState, Shriram: variant.Shriram }))
    setNewFilter(prevState => ({ ...prevState, Kotak: variant.Kotak }))
    setNewFilter(prevState => ({ ...prevState, Reliance: variant.Reliance }))
    let postdata = {
      VehicleType: apiRequestQQ.VehicleType,
      Make: apiRequestQQ.MakeName,
      Model: apiRequestQQ.ModelName,
      Variant: variant.label,
      CC: variant.Cubic_Capacity,
      fuelType: variant.Fuel_Type
    }
    setNewFilter(prevState => ({ ...prevState, VariantName: variant.label }))
    setNewFilter(prevState => ({ ...prevState, FuelType: variant.Fuel_Type }))
    getBajajMMV(postdata).then(response => {
      if (response.status === true) {
        if (response?.data) {
          setNewFilter(prevState => ({
            ...prevState,
            Bajaj: response.data.vehiclecode
          }))
          setNewFilter(prevState => ({
            ...prevState,
            VehicleMakeCode: response.data.vehiclemakecode
          }))
          setNewFilter(prevState => ({
            ...prevState,
            VehicleModelCode: response.data.vehiclemodelcode
          }))
          setNewFilter(prevState => ({
            ...prevState,
            VehicleSubTypeCode: response.data.vehiclesubtypecode
          }))
          setNewFilter(prevState => ({
            ...prevState,
            CarryingCapacity: response.data.carryingcapacity
          }))
          setNewFilter(prevState => ({
            ...prevState,
            CubicCapacity: response.data.cubiccapacity
          }))
          // setNewFilter(prevState=>({...prevState, VariantName: response.data.vehiclesubtype });
        } else {
          setNewFilter(prevState => ({
            ...prevState,
            VariantName: variant.label
          }))
        }
      } else {
        setNewFilter(prevState => ({
          ...prevState,
          VariantName: variant.label
        }))
      }
    })
    // toggleTab(activeTab + 1);
  }

  const handleUpdateMMV = () => {
    for (let key in newFilter) {
      if (
        key == 'Digit' ||
        key == 'Shriram' ||
        key == 'HDFC' ||
        key == 'Bajaj'
      ) {
        dispatchQuickQuote('VariantCode.' + key, newFilter[key])
      } else {
        dispatchQuickQuote(key, newFilter[key])
      }
    }
    toggleModal(!modal)
    updateMMV()
  }

  console.log(newFilter.FuelType, 'Fuel type')
  console.log(
    variantData.filter(option => option.label === newFilter.VariantName),
    'Varient'
  )
  return (
    <Modal isOpen={modal} toggle={toggleModal} size='lg'>
      <ModalHeader className='px-lg-4 d-flex justify-content-between'>
       Edit Vehicle Details
        <button
          type='button'
          className='btn-close justify-content-end'
          data-bs-dismiss='modal'
          aria-label='Close'
        />
      </ModalHeader>
      <ModalBody>
        <div className='row px-4' >
          <div className='col-lg-6 ps-lg-0 mt-2'>
            <div className='form-group'>
              <label>Manufacture</label>

              <div class='form-floating' style={{border:'1px solid #ced4da'}}>
                <ReactSelect
                  value={makeData.filter(
                    option => option.label === newFilter.MakeName
                  )}
                  options={makeData}
                  name='make'
                  placeholder='Select Manufacturer'
                  onChange={val => handleSelectMake(val.value)}
                />
              </div>
            </div>
          </div>
          <div className='col-lg-6 pe-lg-0 mt-2'>
            <div className='form-group'>
              <label>Model</label>
              <div class='form-floating'style={{border:'1px solid #ced4da'}}>
                <ReactSelect
                  options={modelData}
                  name='model'
                  value={modelData.filter(
                    option => option.label === newFilter.ModelName
                  )}
                  placeholder='Select vehicle modal'
                  onChange={val => handleSelectModel(val.value)}
                />
              </div>
            </div>
          </div>
          <div className='col-lg-6 ps-lg-0 mt-2'>
            <div className='form-group'>
              <label> Fuel Type</label>
              <select
                className='form-control '
                style={{border:'1px solid #ced4da'}}
                defaultValue={newFilter.FuelType}
                onChange={e => handleSelectPetrolType(e.target.value)}
              >
                <option>Select Fuel Type</option>
                {fuelTypes.includes('Petrol') && (
                  <option className='Petrol'>Petrol</option>
                )}
                {fuelTypes.includes('Diesel') && (
                  <option className='Diesel'>Diesel</option>
                )}
                {fuelTypes.includes('Battery') && (
                  <option className='Battery'>Electric</option>
                )}
                {fuelTypes.includes('CNG') && <option value='CNG'>CNG</option>}
                {fuelTypes.includes('LPG') && <option value='LPG'>LPG</option>}
                <option className='Petrol'>Petrol</option>
                <option className='Diesel'>Diesel</option>
                <option className='Electric'>Electric</option>
                <option className='CNG'>CNG</option>
                <option className='LPG'>LPG</option>
              </select>
            </div>
          </div>
          <div className='col-lg-6 pe-lg-0 mt-2'>
            <div className='form-group'>
              <label> Variant</label>
              <div class='form-floating' style={{border:'1px solid #ced4da', }}>
                <ReactSelect
                  value={variantData.filter(
                    option => option.label === newFilter.VariantName
                  )}
                  options={variantData.filter(
                    item => item.Fuel_Type == newFilter.FuelType
                  )}
                  name='model'
                  placeholder='Select vehicle varient'
                  onChange={val => handleSelectVariant(val)}
                />
              </div>
            </div>
          </div>
          <div className='col-lg-6 ps-le-0 mt-2'>
            <div className='form-group'>
              <label>Manufacture Date</label>
              <input
                className='form-control'
                defaultValue={newFilter.ManufaturingDate}
                type='date'
              />{' '}
            </div>
          </div>
          <div className='col-lg-6 pe-ls-0 mt-2'>
            <div className='form-group'>
              <label>Registration Date </label>
              <input
                defaultValue={newFilter.RegistrationDate}
                className='form-control'
                type='date'
              />
            </div>
          </div>
          <div className='col-lg-12 ps-le-0 mt-2'>
            <button
              type='button'
              onClick={() => handleUpdateMMV()}
              className='btn btn-primary fs-5 px-4 py-2 mt-3'
            >
              Update
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default EditVehicleDetails
