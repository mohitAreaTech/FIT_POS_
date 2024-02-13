import React, { useEffect, useState, useNa } from 'react'
import './allQuotelist.css'
import { useSelector } from 'react-redux'
import { useNavigate, useNavigation } from 'react-router-dom'
import Header from './Header'

const AllQuotelist = () => {
  const QuickQouteResult = useSelector(state => state?.root?.QuickQouteResult)
  const apiRequestQQ = useSelector(state => state?.root?.apiRequestQQ)
  const navigate = useNavigate()

  const handleNavigation = () => {
    navigate('/submitProposal')
  }

  return (
    <>
      <div className='insuranceplansec'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 col-lg-3'>
              <div className='yourvehicledetail'>
                <div className='vehicledetailtop'>
                  <h2>Your Vehicle Details</h2>
                  <div className='editopt'>
                    <a href='#'>Edit</a>
                  </div>
                </div>
                <div className='vehiclenames'>
                  <div className='vehicleicons'>
                    <img
                      src='img/bikeiconsm.png'
                      alt='img'
                      className='img-fluid'
                    />
                  </div>
                  <div className='vehiclenameoptions'>
                    Vehicle
                    <span>Bajaj Avenger</span>
                  </div>
                </div>
                <div className='vehicleyearopt'>
                  <div className='vehyear'>
                    Year
                    <span>2012</span>
                  </div>

                  <div className='vehyear'>
                    RTO
                    <span>DL2S (New Delhi)</span>
                  </div>
                </div>
              </div>

              <div className='yourvehicledetail'>
                <div className='vehicledetailtop'>
                  <h2>Insured value (IDV)</h2>
                  <div className='editopt'>
                    <a href='#'>Edit</a>
                  </div>
                </div>
                <div className='insurelowprice'>
                  Currently set for lowest price: <span>₹22,522</span>
                </div>
              </div>

              <div className='noclaimbonus'>
                <div className='vehicledetailtop'>
                  <h2>No claim bonus</h2>
                </div>
                <div className='claimlist'>
                  <ul>
                    <li>Current applicable NCB : N/A</li>
                    <li>Previous year NCB : N/A</li>
                    <li>Claims in last policy : N/A</li>
                  </ul>
                </div>
              </div>
              <div className='planduration'>
                <select className='form-select'>
                  <option>Plan Duration : 1 Year</option>
                  <option>Plan Duration : 3 Year</option>
                  <option>Plan Duration : 5 Year</option>
                  <option>Plan Duration : 7 Year</option>
                </select>
              </div>
            </div>
            <div className='col-md-12 col-lg-9'>
              <div className='bikecoverplanform'>
                <form>
                  <ul>
                    <li>
                      <label>Bike IDV</label>
                      <select>
                        <option>Select</option>
                        <option>Bike 123</option>
                      </select>
                    </li>

                    <li>
                      <label>Eligible NCB</label>
                      <select>
                        <option>Eligible</option>
                        <option>Eligible 1</option>
                      </select>
                    </li>

                    <li>
                      <label>Addons & Covers</label>
                      <select>
                        <option>Covers</option>
                        <option>Covers 123</option>
                      </select>
                    </li>

                    <li className='coverbutton'>
                      <button className='active'>Comprehensive cover</button>
                      <button>Third party only cover</button>
                    </li>
                  </ul>
                </form>
              </div>

              <div className='Comprehensiveplans'>
                <h2>6 Comprehensive plans</h2>
                <h3>Covers damages to your vehicle and third-party</h3>
              </div>

              <div className='comprehplanlist'>
                <div className='cmpylogoicon'>
                  <img
                    src='img/nationalinsimg.png'
                    className='img-fluid'
                    alt='img'
                  />
                </div>
                <div className='idv'>
                  IDV
                  <span>₹22,522</span>
                </div>
                <div className='idv'>
                  Claims Settled
                  <span>93%</span>
                </div>

                <button className='planpricebtn'>₹730</button>
              </div>

              <div className='comprehplanlist'>
                <div className='cmpylogoicon'>
                  <img
                    src='img/unitedindia.png'
                    className='img-fluid'
                    alt='img'
                  />
                </div>
                <div className='idv'>
                  IDV
                  <span>₹22,522</span>
                </div>
                <div className='idv'>
                  Claims Settled
                  <span>93%</span>
                </div>

                <button className='planpricebtn'>₹730</button>
              </div>

              <div className='comprehplanlist'>
                <div className='cmpylogoicon'>
                  <img src='img/oriental.png' className='img-fluid' alt='img' />
                </div>
                <div className='idv'>
                  IDV
                  <span>₹22,522</span>
                </div>
                <div className='idv'>
                  Claims Settled
                  <span>93%</span>
                </div>

                <button className='planpricebtn'>₹730</button>
              </div>

              <div className='comprehplanlist'>
                <div className='cmpylogoicon'>
                  <img
                    src='img/kotakgeneral.png'
                    className='img-fluid'
                    alt='img'
                  />
                </div>
                <div className='idv'>
                  IDV
                  <span>₹22,522</span>
                </div>
                <div className='idv'>
                  Claims Settled
                  <span>93%</span>
                </div>

                <button className='planpricebtn'>₹730</button>
              </div>

              <div className='comprehplanlist'>
                <div className='cmpylogoicon'>
                  <img src='img/cholams.png' className='img-fluid' alt='img' />
                </div>
                <div className='idv'>
                  IDV
                  <span>₹22,522</span>
                </div>
                <div className='idv'>
                  Claims Settled
                  <span>93%</span>
                </div>

                <button className='planpricebtn'>₹730</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AllQuotelist
