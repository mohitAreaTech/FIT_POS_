import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
// import store from "./store";
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
// import Training from "../pages/Training";
import AllQuotelist from '../common/AllQuotelist'
import SubmitProposal from '../pages/SubmitProposal'
import PolicyOverview from '../pages/PolicyOverview'
import SubmitOfflinePolicy from '../pages/offlinePolicy/SubmitOfflinePolicy'
import RequestOfflinePolicy from '../pages/offlinePolicy/RequestOfflinePolicy'
import OfflineQuote from '../pages/offlinePolicy'
import Cases from '../pages/cases'
import VehicleDetails from '../common/SubmitOnlinePolicy/VehicleDetails'
import VehicleDetail from '../pages/offlinePolicy/vehicleDetail'
import ViewMisDetail from '../pages/ViewMisDetail'
import ViewQuotation from '../pages/ViewQuotation'
import EditRequestQfflinePolIcy from '../pages/EditRequestQfflinePolIcy'
import EditSubmitOfflinePolicy from '../pages/EditSubmitOfflinePolicy'
import AuthRoute from './AuthRoute'
import CheckAuth from './CheckAuth'
import Training from '../pages/Training'
import PosExam from '../pages/PosExam'
import ForgetPassword from '../pages/ForgetPassword'
import ResetPassword from '../pages/ResetPassword'
import TotalPolicy from '../pages/offlinePolicy/totalPolicy'
import TotalGeneratedPolicy from '../pages/offlinePolicy/totalGeneratedPolicy'
function AllRoutes () {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CheckAuth />}>
          <Route path='/' element={<Login />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
        </Route>

        <Route element={<AuthRoute />}>
          <Route element={<Dashboard />} path='/home' />
          <Route element={<Profile />} path='/profile' />
          <Route element={<AllQuotelist />} path='/quotelist' />
          <Route element={<SubmitProposal />} path='/submitProposal' />
          <Route element={<PolicyOverview />} path='/policyOverview' />
          <Route element={<OfflineQuote />} path='/offlineQuote' />
          <Route element={<Cases />} path='/cases' />
          <Route element={<VehicleDetail />} path='/vehicleDetail' />
          <Route element={<ViewQuotation />} path={'/vehicleQuotationDetail'} />
          <Route element={<ViewMisDetail />} path='/misDetail' />
          <Route element={<Training />} path='/training' />
          <Route element={<PosExam />} path='/posExam' />
          <Route
            element={<SubmitOfflinePolicy />}
            path='/submitOfflinePolicy'
          />
          <Route element={<TotalPolicy />} path='/pendingPolicy' />
          <Route element={<TotalGeneratedPolicy />} path='/generatedPolicy' />
          <Route
            element={<RequestOfflinePolicy />}
            path='/requestOfflinePolicy'
          />
          <Route
            path={'/EditOfflinePolicy'}
            element={<EditRequestQfflinePolIcy />}
          />
          <Route
            path={'/EditSubmitOfflinePolicy'}
            element={<EditSubmitOfflinePolicy />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AllRoutes
