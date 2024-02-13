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
const initialState = {
  userDetails: {},
  apiRequestQQ: {
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
  },
  submitOffline: {},
  policyLdId: "",
  QuickQouteResult: [],
  selectedPlan: {},
};
const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    case QUICK_QUOTE_PAYLOAD:
      const { key, value } = action.payload;
      let obj = { ...state.apiRequestQQ };
      // console.log("key-----", key);
      if (key.includes(".")) {
        let reqKey = key.split(".");
        // console.log("req obj--------------", obj[reqKey[0]][reqKey[1]]);
        obj[reqKey[0]][reqKey[1]] = value;
      } else {
        obj[key] = value;
      }
      return {
        ...state,
        apiRequestQQ: obj,
      };
    case SUBMIT_OFFLINE:
      return {
        ...state,
        submitOffline: {
          ...state.submitOffline,
          ...action.payload,
        },
      };
    case QUICK_QUOTE_RESULTS:
      let data = [...state.QuickQouteResult];
      let index = data.findIndex(
        (item) => item.insurer === action.payload.insurer
      );
      if (index > -1) {
        data[index] = action.payload;
      } else {
        data.push(action.payload);
      }
      return {
        ...state,
        QuickQouteResult: data,
      };
    case SELECTED_PLAN:
      return {
        ...state,
        selectedPlan: action.payload,
      };
    case RESET_QUICK_QUOTE_PAYLOAD:
      return {
        ...state,
        apiRequestQQ: action.payload,
      };
    case RESET_QUICK_QUOTE_RESULTS:
      return {
        ...state,
        QuickQouteResult: [],
      };
    case RESET_SELECTED_PLAN:
      return {
        ...state,
        selectedPlan: {},
      };
    case SET_LEAD_ID:
      return {
        ...state,
        policyLdId: action.payload,
      };
    default:
      return state;
  }
};
export default userReducers;
export const quickQuotePayloadObj = (obj) => {
  return {
    BrokerId: "SARL",
    CompanyCode: "DIGIT",
    VehicleType: obj.VehicleType,
    NewPolicyType: obj.NewPolicyType,
    UniqueId: makeid(24),

    Contactdetails: {
      Salutation: obj.Salutation,
      Email: obj.Email,
      FirstName: obj.FirstName,
      LastName: obj.LastName,
      MiddleName: obj.MiddleName,
      MobileNumber: obj.MobileNumber,
      OTPNumber: "20359",
      SubProductID: 2,
      FlatNumber: obj.FlatNumber,
      StreetNumber: obj.StreetNumber,
      Street: obj.Street,
      District: obj.District,
      StateCode: obj.StateCode,
      State: obj.State,
      City: obj.City,
      Country: obj.Country,
      Pincode: obj.Pincode,
      Dob: obj.Dob,
      Gender: obj.Gender && obj.Gender.toUpperCase(),
      PanNumber: obj.PanNumber,
      PanImage: obj.PanImage,
      GSTNo: obj.GSTNo,
    },
    AddOns: {
      RoadSideAssistance: obj.AddOns.RoadSideAssistance,
      EngineProtection: obj.AddOns.EngineProtection,
      TyreProtection: obj.AddOns.TyreProtection,
      RimProtection: obj.AddOns.RimProtection,
      Consumables: obj.AddOns.Consumables,
      IsElectricalAccessories: obj.AddOns.IsElectricalAccessories,
      IsNonElectricalAccessories: obj.AddOns.IsNonElectricalAccessories,
      IsCngAccessories: obj.AddOns.IsCngAccessories,
      PersonalAccident: obj.AddOns.PersonalAccident,
      InvoiceCover: obj.AddOns.InvoiceCover,
      EngineGearBox: obj.AddOns.EngineGearBox,
      NCBProtection: obj.AddOns.NCBProtection,
      VoluntaryDeductive: obj.AddOns.VoluntaryDeductive,
      PassengerCover: obj.AddOns.PassengerCover,
      LossOfPersonalBelongings: obj.AddOns.LossOfPersonalBelongings,
      ZeroDepriciationCover: obj.AddOns.ZeroDepriciationCover,
      KeyReplacement: obj.AddOns.KeyReplacement,
      ElectricAmount:
        obj.AddOns.IsElectricalAccessories == true
          ? obj.AddOns.ElectricAmount
          : 0,
      NonElectricAmount:
        obj.AddOns.IsNonElectricalAccessories == true
          ? obj.AddOns.NonElectricAmount
          : 0,
      VoluntaryDeductiveAmount:
        obj.AddOns.VoluntaryDeductive == true
          ? obj.AddOns.VoluntaryDeductiveAmount
          : 0,
      PassengerCoverAmount:
        obj.AddOns.PassengerCover === true
          ? obj.AddOns.PassengerCoverAmount
          : 0,
      CNGValue: obj.AddOns.CNGValue,
      discount: obj.AddOns.discount,
      LiabilitiesToPaidDriver: obj.AddOns.LiabilitiesToPaidDriver,
      NoOfLegelDrives: obj.AddOns.NoOfLegelDrives,
    },
    Hypothecation: {
      IsHypothecation: obj.IsHypothecation,
      HpnCity: obj.HpnCity,
      HpnBank: obj.HpnBank,
      HDFC: obj.HpnHDFCID,
    },
    CustomerType: obj.CustomerType,
    DeviceId: "Web",

    IsPreviousInsurerKnown: obj.IsPreviousInsurerKnown,
    IsBreakingCase: true,
    IsExistingPACover: false,
    IsODOnly: false,
    IsOwnerChanged: false,
    IsPOSIncluded: false,
    IsRecalculateQuote: false,
    IsThirdPartyOnly: false,
    IsValidLicence: true,
    LoginUserId: 0,
    MakeName: obj.MakeName,
    ModelName: obj.ModelName,
    NewBusinessPolicyType: "0",
    OrganizationName: null,
    PrevPolicyExpiryStatus: obj.PolicyStatus,
    PlanId: 74,
    PolicyEndDate: obj.PolicyEndDate,
    PolicyStartDate: obj.PolicyStartDate,
    PolicyType: "Renewal",
    PreviousPolicyDetails: {
      InsurerCode: obj.PreInsurerCode,
      IsPreviousInsuranceClaimed: obj.PreviousInsuranceClaimed,
      PolicyEndDate: obj.PrePolicyEndDate,
      PolicyNumber: obj.PrePolicyNumber,
      PreviousNoClaimBonus:
        obj.PreviousInsuranceClaimed == "false" ? obj.PreviousNoClaimBonus : 0,
      PreviousPolicyType: obj.PreviousPolicyType,
    },
    PreviousTpPolicyDetails: {
      PreTPInsurerCode: obj.PreTPInsurerCode,
      PreTPPolicyNumber: obj.PreTPPolicyNumber,
      PreTPPolicyEndDate: obj.PreTPPolicyEndDate,
    },
    PreviousPolicyDetailsRequired: true,
    ProductCode: obj.ProductCode,
    QuotationNumber: "SARLMTRPC2022071516433185",
    RTOCityName: obj.RtoCode,
    RequestedAddOnList: [],
    SubProductCode: 2,
    Uid: "3292d524-b60d-4c14-aff7-1e07d096af4a",
    VariantName: obj.VariantName,
    VehicleDetails: {
      IsVehicleNew: obj.IsVehicleNew,
      BPRtoId: "976",
      BimaPostRTOId: "976",
      ManufaturingDate: obj.ManufaturingDate,
      PurchaseDate: "2014-04-01",
      RegistrationDate: obj.RegistrationDate,
      RegistrationNumber: obj.RegistrationNumber,
      VariantCode: {
        Bajaj: obj.VariantCode.Bajaj,
        Digit: obj.VariantCode.Digit,
        HDFC: obj.VariantCode.HDFC,
        Shriram: obj.VariantCode.Shriram,
        Kotak: obj.VariantCode.Kotak,
        Reliance: parseInt(obj.VariantCode.Reliance),
        Future: obj.VariantCode.Future,
        Royal: obj.VariantCode.Royal,
      },

      RegistrationYear: obj.RegistrationYear,
      Idv: obj.Idv,
      EngineNumber: obj.EngineNumber,
      ChassisNumber: obj.ChassisNumber,
      VehicleMakeCode: obj.VehicleMakeCode,
      VehicleModelCode: obj.VehicleModelCode,
      VehicleSubTypeCode: obj.VehicleSubTypeCode,
      CarryingCapacity: obj.CarryingCapacity,
      CubicCapacity: obj.CubicCapacity,
      Color: obj.Color,
      NCB: "0",
      RegistrationCity: obj.RegistrationCity,
      MakeName: obj.MakeName,
      ModelName: obj.ModelName,
      VariantName: obj.VariantName,
      FuelType: obj.FuelType,
      IsValidPuc: obj.IsValidPuc,
      PUCNumber: obj.PUCNumber,
      PUCValidUpto: obj.PUCValidUpto,
    },
  };
};

export const createQuotePayloadObj = (reqObj) => {
  return {
    BrokerId: "SARL",
    CompanyCode: "DIGIT",
    UniqueId: reqObj.ApiId,
    VehicleType: reqObj.VehicleType,
    NewPolicyType: reqObj.NewPolicyType,
    PolicyEndDate: reqObj.PolicyEndDate,
    PolicyStartDate: reqObj.PolicyStartDate,
    PaymentAmount: reqObj.PaymentAmount,
    PaymentId: reqObj.PaymentId,
    RelianceRTOCode: reqObj.RelianceRTOCode,
    KYC: {
      HDFC: reqObj.KYC.HDFC,
      Future: reqObj.KYC.Future,
      Reliance: reqObj.KYC.Reliance,
      RoyalRefNo: reqObj.KYC.RoyalRefNo,
      Royal: reqObj.KYC.Royal,
      Shriram: reqObj.KYC.Shriram,
      AadharNo: reqObj.KYC.AadharNo,
      FatherName: reqObj.KYC.FatherName,
      MotherName: reqObj.KYC.MotherName,
      AadharBackPic: reqObj.KYC.AadharBackPic,
      PassportPic: reqObj.KYC.PassportPic,
    },
    Contactdetails: {
      Salutation: reqObj.Salutation,
      Email: reqObj.Email,
      FirstName: reqObj.FirstName,
      LastName: reqObj.LastName,
      MiddleName: reqObj.MiddleName,
      MobileNumber: reqObj.MobileNumber,
      OTPNumber: "20359",
      SubProductID: 2,
      FlatNumber: reqObj.FlatNumber,
      StreetNumber: reqObj.StreetNumber,
      Street: reqObj.Street,
      District: reqObj.District,
      StateCode: reqObj.StateCode,
      State: reqObj.State,
      City: reqObj.City,
      Country: reqObj.Country,
      Pincode: reqObj.Pincode,
      Dob: reqObj.Dob,
      Gender: reqObj.Gender && reqObj.Gender.toUpperCase(),
      PanNumber: reqObj.PanNumber,
      PanImage: reqObj.PanImage,
      GSTNo: reqObj.GSTNo,
    },
    AddOns: {
      RoadSideAssistance: reqObj.AddOns.RoadSideAssistance,
      EngineProtection: reqObj.AddOns.EngineProtection,
      TyreProtection: reqObj.AddOns.TyreProtection,
      RimProtection: reqObj.AddOns.RimProtection,
      Consumables: reqObj.AddOns.Consumables,
      IsElectricalAccessories: reqObj.AddOns.IsElectricalAccessories,
      IsNonElectricalAccessories: reqObj.AddOns.IsNonElectricalAccessories,
      IsCngAccessories: reqObj.AddOns.IsCngAccessories,
      PersonalAccident: reqObj.AddOns.PersonalAccident,
      InvoiceCover: reqObj.AddOns.InvoiceCover,
      EngineGearBox: reqObj.AddOns.EngineGearBox,
      NCBProtection: reqObj.AddOns.NCBProtection,
      VoluntaryDeductive: reqObj.AddOns.VoluntaryDeductive,
      PassengerCover: reqObj.AddOns.PassengerCover,
      LossOfPersonalBelongings: reqObj.AddOns.LossOfPersonalBelongings,
      ZeroDepriciationCover: reqObj.AddOns.ZeroDepriciationCover,
      KeyReplacement: reqObj.AddOns.KeyReplacement,
      ElectricAmount:
        reqObj.AddOns.IsElectricalAccessories == true
          ? reqObj.AddOns.ElectricAmount
          : 0,
      NonElectricAmount:
        reqObj.AddOns.IsNonElectricalAccessories == true
          ? reqObj.AddOns.NonElectricAmount
          : 0,
      VoluntaryDeductiveAmount:
        reqObj.AddOns.VoluntaryDeductive == true
          ? reqObj.AddOns.VoluntaryDeductiveAmount
          : 0,
      PassengerCoverAmount:
        reqObj.AddOns.PassengerCover === true
          ? reqObj.AddOns.PassengerCoverAmount
          : 0,
      CNGValue: reqObj.AddOns.CNGValue,
      discount: reqObj.AddOns.discount,
      LiabilitiesToPaidDriver: reqObj.AddOns.LiabilitiesToPaidDriver,
      NoOfLegelDrives: reqObj.AddOns.NoOfLegelDrives,
    },
    Hypothecation: {
      IsHypothecation: reqObj.IsHypothecation,
      HpnCity: reqObj.HpnCity,
      HpnBank: reqObj.HpnBank,
      HDFC: reqObj.HpnHDFCID,
    },
    CustomerType: reqObj.CustomerType,
    DeviceId: "Web",

    IsPreviousInsurerKnown: reqObj.IsPreviousInsurerKnown,
    IsBreakingCase: true,
    IsExistingPACover: false,
    IsODOnly: false,
    IsOwnerChanged: false,
    IsPOSIncluded: false,
    IsRecalculateQuote: false,
    IsThirdPartyOnly: false,
    IsValidLicence: true,
    LoginUserId: 0,
    MakeName: reqObj.MakeName,
    ModelName: reqObj.ModelName,
    NewBusinessPolicyType: "0",
    OrganizationName: null,

    PrevPolicyExpiryStatus: reqObj.PolicyStatus,

    PlanId: 74,
    PolicyEndDate: reqObj.PolicyEndDate,
    PolicyStartDate: reqObj.PolicyStartDate,
    PolicyType: "Renewal",
    PreviousPolicyDetails: {
      InsurerCode: reqObj.PreInsurerCode,
      IsPreviousInsuranceClaimed: reqObj.PreviousInsuranceClaimed,
      PolicyEndDate: reqObj.PrePolicyEndDate,
      PolicyNumber: reqObj.PrePolicyNumber,
      PreviousNoClaimBonus:
        reqObj.PreviousInsuranceClaimed == "false"
          ? reqObj.PreviousNoClaimBonus
          : 0,
      PreviousPolicyType: reqObj.PreviousPolicyType,
    },
    PreviousTpPolicyDetails: {
      PreTPInsurerCode: reqObj.PreTPInsurerCode,
      PreTPPolicyNumber: reqObj.PreTPPolicyNumber,
      PreTPPolicyEndDate: reqObj.PreTPPolicyEndDate,
    },
    PreviousPolicyDetailsRequired: true,
    ProductCode: reqObj.ProductCode,
    QuotationNumber: "SARLMTRPC2022071516433185",
    RTOCityName: reqObj.RtoCode,
    RequestedAddOnList: [],
    SubProductCode: 2,
    Uid: "3292d524-b60d-4c14-aff7-1e07d096af4a",
    VariantName: reqObj.VariantCode,
    VehicleDetails: {
      IsVehicleNew: reqObj.IsVehicleNew,
      BPRtoId: "976",
      BimaPostRTOId: "976",
      ManufaturingDate: reqObj.ManufaturingDate,
      PurchaseDate: reqObj.ManufaturingDate,
      RegistrationDate: reqObj.RegistrationDate,
      RegistrationNumber: reqObj.RegistrationNumber,
      VariantCode: {
        Bajaj: reqObj.VariantCode.Bajaj,
        Digit: reqObj.VariantCode.Digit,
        HDFC: reqObj.VariantCode.HDFC,
        Shriram: reqObj.VariantCode.Shriram,
        Kotak: reqObj.VariantCode.Kotak,
        Reliance: parseInt(reqObj.VariantCode.Reliance),
        Future: reqObj.VariantCode.Future,
        Royal: reqObj.VariantCode.Royal,
      },
      RegistrationYear: reqObj.RegistrationYear,
      Idv: reqObj.Idv,
      EngineNumber: reqObj.EngineNumber,
      ChassisNumber: reqObj.ChassisNumber,
      VehicleMakeCode: reqObj.VehicleMakeCode,
      VehicleModelCode: reqObj.VehicleModelCode,
      VehicleSubTypeCode: reqObj.VehicleSubTypeCode,
      CarryingCapacity: reqObj.CarryingCapacity,
      CubicCapacity: reqObj.CubicCapacity,
      Color: reqObj.Color,
      NCB: "0",
      RegistrationCity: reqObj.RegistrationCity,
      MakeName: reqObj.MakeName,
      ModelName: reqObj.ModelName,
      VariantName: reqObj.VariantName,
      FuelType: reqObj.FuelType,
      IsValidPuc: reqObj.IsValidPuc,
      PUCNumber: reqObj.PUCNumber,
      PUCValidUpto: reqObj.PUCValidUpto,
    },
    Nominee: {
      FirstName: reqObj.NomineeFirstName,
      LastName: reqObj.NomineeLastName,
      Relationship: reqObj.NomineeRelationship,
      DateOfBirth: reqObj.NomineeDateOfBirth,
    },
  };
};
export const createOnlinePolicyObj = (body) => {
  let obj = {
    ...(body?.RegistrationNumber && { vehicle_no: body?.RegistrationNumber }),
    ...(body?.RegistrationYear && { vehicle_mfg_yr: body?.RegistrationYear }),
    ...(body?.FuelType && { fuel_type: body?.FuelType }),
    ...(body?.VehicleType && {
      vehicle_type:
        body?.VehicleType === "2w"
          ? "MotorBike"
          : body?.VehicleType === "4w"
          ? "Pvt Car"
          : body?.VehicleType === "gcv"
          ? "Goods Carrying"
          : body?.VehicleType === "pcv" && "Passenger Carrying",
    }),
    ...(body?.MakeName && { vehicle_make: body?.MakeName }),
    ...(body?.ModelName && { vehicle_model: body?.ModelName }),
    ...(body?.VariantName && { vehicle_variant: body?.VariantName }),
    ...(body?.rm_name_Code && { rm_name_Code: body?.rm_name_Code }),
    ...(body?.NewPolicyType && {
      policy_type:
        body?.NewPolicyType === "Comprehensive"
          ? "comprehensive"
          : body?.NewPolicyType == "ThirdParty"
          ? "third_party"
          : "own_damage",
    }),
    ...(body?.gaskit_installed && { gaskit_installed: body?.gaskit_installed }),
    policy_status: "continue",
    ...(body?.required_add_on && { required_add_on: body?.required_add_on }),
    ...(body.insurer && { insurance_company: body.insurer }),
    ...(body.ApiId && { policy_no: body.ApiId }),
    ...(body?.idv && { require_idv: body?.idv }),
    ...(body?.require_discount && { require_discount: body?.require_discount }),
    ...(body?.expected_final_premium && {
      expected_final_premium: body?.expected_final_premium,
    }),
    ...(body?.policyIdDb && { policyId: body?.policyIdDb }),
    ...(body?.PolicyStartDate && { policy_starts: body?.PolicyStartDate }),
    ...(body?.PolicyEndDate && { policy_expires: body?.PolicyEndDate }),
    ...(body?.PolicyStartDate && { policy_issue: body?.PolicyStartDate }),
    ...(body?.PolicyStartDate && { policy_recieve: body?.PolicyStartDate }),
    ...(body?.BasicODPremium && { od_net_premium: body?.BasicODPremium }),
    ...(body?.terrorism_premium && {
      terrorism_premium: body?.terrorism_premium,
    }),
    ...(body?.NetPremium && { tax_amount: body?.GST }),
    ...(body?.NetPremium && { net_premium: body?.NetPremium }),
    ...(body?.EngineNumber && { engine_no: body?.EngineNumber }),
    ...(body?.ChassisNumber && { chassis_no: body?.ChassisNumber }),
    ...(body?.FinalPremium && { gross_premium: body?.FinalPremium }),
    ...(body?.file && { file: body?.file }),
    ...(body?.file_type && { file_type: body?.file_type }),
    case_type: body.IsVehicleNew === true ? "new" : "rollover",
  };
  const newObj = new Object();
  for (let key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
