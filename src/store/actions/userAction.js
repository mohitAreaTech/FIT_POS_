import {
  LOGGED_USER_DETAILS,
  QUICK_QUOTE_PAYLOAD,
  QUICK_QUOTE_RESULTS,
  RESET_QUICK_QUOTE_PAYLOAD,
  RESET_QUICK_QUOTE_RESULTS,
  RESET_SELECTED_PLAN,
  SELECTED_PLAN,
  SET_LEAD_ID,
  SUBMIT_OFFLINE,
} from "../types";
import store from "../index";

export const submitOfflinePolicy = (payload) => {
  return {
    type: SUBMIT_OFFLINE,
    payload,
  };
};

export const dispatchSubmitOffline = (key, value) => {
  let obj = {
    [key]: value,
    // value: value
  };
  store.dispatch(submitOfflinePolicy(obj));
};

export const saveUserDetails = (payload) => {
  return {
    type: LOGGED_USER_DETAILS,
    payload,
  };
};

export const quickQuotePayload = (payload) => {
  return {
    type: QUICK_QUOTE_PAYLOAD,
    payload,
  };
};

export const setLeadId = (payload) => {
  return {
    type: SET_LEAD_ID,
    payload,
  };
};

export const quickQuoteResult = (payload) => {
  return {
    type: QUICK_QUOTE_RESULTS,
    payload,
  };
};

export const selectedPlanAction = (payload) => {
  return {
    type: SELECTED_PLAN,
    payload,
  };
};

export const resetapiRequestQQ = (payload) => {
  return {
    type: RESET_QUICK_QUOTE_PAYLOAD,
    payload,
  };
};

export const resetSelectedPlan = () => {
  return {
    type: RESET_SELECTED_PLAN,
  };
};

export const resetQuickQuoteResults = () => {
  return {
    type: RESET_QUICK_QUOTE_RESULTS,
  };
};

export const dispatchQuickQuote = (key, value) => {
  let obj = {
    key: key,
    value: value,
  };
  store.dispatch(quickQuotePayload(obj));
};

export const dispatchResetQuickQuote = (key, value) => {
  let obj = {
    isFiltered: false,
    policyIdDb: "",
    leadId: "",
    VehicleType: "",
    CustomerType: "",
    IsPreviousInsurerKnown: true,
    Salutation: "Mr",
    RegistrationDate: "",
    RegistrationNumber: "",
    PolicyEndDate: "",
    PolicyStartDate: "",
    PreInsurerCode: "",
    PrePolicyNumber: "",
    ProductCode: "",
    ManufaturingDate: "",
    VariantCode: {
      Digit: "",
      Bajaj: "",
      HDFC: "",
      Shriram: "",
      Kotak: "",
      Reliance: "",
      Future: "",
      Royal: "",
    },
    Email: "",
    FirstName: "",
    LastName: "",
    MobileNumber: "",
    FlatNumber: "",
    StreetNumber: "",
    Street: "",
    District: "",
    City: "",
    State: "",
    StateCode: "",
    Country: "",
    Pincode: "",
    Dob: "",
    Gender: "",
    PrePolicyEndDate: "",
    MakeName: "",
    ModelName: "",
    VariantName: "",
    PolicyType: "Renewal",
    RegistrationYear: "",
    PreviousPolicyType: "",
    NewPolicyType: "",
    FuelType: "",
    customerId: "",
    ApiId: "",
    policyId: "",
    RtoCode: "",
    EngineNumber: "",
    ChassisNumber: "",
    NomineeFirstName: "",
    NomineeLastName: "",
    NomineeDateOfBirth: "",
    NomineeRelationship: "",
    PreviousInsuranceClaimed: false,
    Idv: 0,
    PreviousNoClaimBonus: "0",
    CurrentNoClaimBonus: "",
    PersonalAccident: {
      Selection: false,
      InsuredAmount: false,
      CoverTerm: false,
    },
    AddOns: {
      RoadSideAssistance: false,
      EngineProtection: false,
      TyreProtection: false,
      RimProtection: false,
      Consumables: false,
      IsElectricalAccessories: false,
      IsNonElectricalAccessories: false,
      IsCngAccessories: false,
      PersonalAccident: false,
      InvoiceCover: false,
      EngineGearBox: false,
      NCBProtection: false,
      VoluntaryDeductive: false,
      PassengerCover: false,
      LossOfPersonalBelongings: false,
      ZeroDepriciationCover: false,
      KeyReplacement: false,
      LiabilitiesToPaidDriver: false,
      ElectricAmount: 0,
      NonElectricAmount: 0,
      CNGValue: 0,
      PassengerCoverAmount: 0,
      VoluntaryDeductiveAmount: 0,
      discount: 0,
      NoOfLegelDrives: 0,
    },
    PaymentAmount: 0,
    PaymentId: "",
    CubicCapacity: "",
    CarryingCapacity: "",
    VehicleMakeCode: "",
    VehicleModelCode: "",
    VehicleSubTypeCode: "",
    RegistrationCity: "",
    IsVehicleNew: false,
    applicationId: "",
    PolicyStatus: "continue",
    PanNumber: "",
    PanImage: "",
    IsHypothecation: false,
    HpnBank: "",
    HpnCity: "",
    PreTPPolicyNumber: "",
    PreTPInsurerCode: "",
    PreTPPolicyEndDate: "",
    GSTNo: "",
    IsValidPuc: false,
    PUCNumber: "",
    PUCValidUpto: "",
    RelianceRTOCode: "",
    KGIStatus: false,
    IsInternalCNG: false,
    KYC: {
      HDFC: "",
      Future: "",
      Reliance: "",
      Kotak: "",
      RoyalRefNo: "",
      Royal: "",
      Shriram: "",
      AadharNo: "",
      FatherName: "",
      MotherName: "",
      AadharBackPic: "",
      PassportPic: "",
    },
  };
  store.dispatch(resetapiRequestQQ(obj));
  store.dispatch(setLeadId(""));
};

export function generateArrayOfYears() {
  var max = new Date().getFullYear();
  var min = max - 18;
  var years = [];

  for (var i = max; i >= min; i--) {
    years.push(i);
  }
  return years;
}
