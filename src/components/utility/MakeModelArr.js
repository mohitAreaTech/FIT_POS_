import moment from "moment";
import store from "../../store/index";

export const twoWheelerMake = [
  {
    image: "../assets/images/logos/bikes/hero.png",
    value: "HERO MOTOCORP",
  },
  {
    image: "../assets/images/logos/bikes/honda.png",
    value: "HONDA",
  },
  {
    image: "../assets/images/logos/bikes/bajaj.png",
    value: "BAJAJ",
  },
  {
    image: "../assets/images/logos/bikes/tvs.png",
    value: "TVS",
  },
  {
    image: "../assets/images/logos/bikes/ROYAL_ENFIELD.png",
    value: "ROYAL ENFIELD",
  },
  {
    image: "../assets/images/logos/bikes/MAHINDRA.png",
    value: "MAHINDRA AND MAHINDRA",
  },
  {
    image: "../assets/images/logos/bikes/HEROHONDA.png",
    value: "HERO HONDA",
  },
  {
    image: "../assets/images/logos/bikes/yamaha.png",
    value: "YAMAHA",
  },
  {
    image: "../assets/images/logos/bikes/KTM.png",
    value: "KTM",
  },
  {
    image: "../assets/images/logos/bikes/jawa.png",
    value: "JAWA",
  },
  {
    image: "../assets/images/logos/bikes/lml.png",
    value: "LML",
  },
  {
    image: "../assets/images/logos/bikes/HYOSUNG.png",
    value: "HYOSUNG",
  },
];

export const fourWheelerModel = [
  {
    image: "../assets/images/logos/cars/suzuki.png",
    value: "MARUTI SUZUKI",
  },
  {
    image: "../assets/images/logos/cars/tata.png",
    value: "TATA",
  },
  {
    image: "../assets/images/logos/cars/honda.png",
    value: "HONDA",
  },
  {
    image: "../assets/images/logos/cars/ford.png",
    value: "FORD",
  },
  {
    image: "../assets/images/logos/cars/hyundai.png",
    value: "HYUNDAI",
  },
  {
    image: "../assets/images/logos/cars/kia.png",
    value: "KIA",
  },
  {
    image: "../assets/images/logos/cars/mahindra.png",
    value: "MAHINDRA AND MAHINDRA",
  },
  {
    image: "../assets/images/logos/cars/mg.png",
    value: "MORRIS GARAGES",
  },
  {
    image: "../assets/images/logos/cars/nissan.png",
    value: "NISSAN MOTORS",
  },
  {
    image: "../assets/images/logos/cars/renault.png",
    value: "RENAULT",
  },
  {
    image: "../assets/images/logos/cars/skoda.png",
    value: "SKODA",
  },
  {
    image: "../assets/images/logos/cars/toyota.png",
    value: "TOYOTA",
  },
  {
    image: "../assets/images/logos/cars/wv.png",
    value: "VOLKSWAGEN",
  },
  {
    image: "../assets/images/logos/cars/volvo.png",
    value: "VOLVO",
  },
  {
    image: "../assets/images/logos/cars/audi.png",
    value: "AUDI",
  },
  {
    image: "../assets/images/logos/cars/bmw.png",
    value: "BMW",
  },
];

export const pvtCarPolicyInfoArr = [
  {
    label: "Select Policy Type",
    name: "PolicyStatus",
    type: "select",
    placeholder: "Policy Type",
    validation: {
      required: false,
    },
    data: [
      { value: "continue", option: "Continue" },
      { value: "expired within 90 day", option: "Expired Within 90 days" },
      { value: "expired above 90 day", option: "Expired Above 90 days" },
      { value: "false", option: "No Information About Previous Policy" },
    ],
  },
  {
    label: "New policy type?",
    name: "NewPolicyType",
    type: "select",
    placeholder: "New Policy Type",
    validation: {
      required: "Field is required",
    },
    data: [
      { value: "Comprehensive", option: "Comprehensive" },
      { value: "ThirdParty", option: "Third Party" },
    ],
  },
  {
    label: "Previous policy type?",
    name: "PreviousPolicyType",
    type: "select",
    placeholder: "Previous Policy Type",
    validation: {
      required: false,
    },
    data: [
      { value: "Comprehensive", option: "Comprehensive" },
      { value: "ThirdParty", option: "Third Party" },
    ],
  },
  {
    label: "Previous Policy Insurer",
    name: "PreInsurerCode",
    type: "select",
    placeholder: "Previous Policy Insurer",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Mfg. month of the year",
    name: "ManufaturingDate",
    type: "date",
    validation: {
      require: "Field is required",
    },
  },
  {
    label: "Reg. date of your car",
    name: "RegistrationDate",
    type: "date",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Prev. year policy expiry date",
    name: "PrePolicyEndDate",
    type: "date",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Vehicle Owned By",
    name: "CustomerType",
    type: "select",
    data: [
      { value: "INDIVIDUAL", option: "Individual" },
      { value: "COMPANY", option: "Organization" },
    ],
    validation: {
      required: false,
    },
  },
  {
    label: "Previous No Claim Bonus (NCB)",
    name: "PreviousNoClaimBonus",
    type: "select",
    placeholder: "Previous No Claim Bonus (NCB)",
    validation: {
      required: false,
    },
    data: [
      { value: "0", option: "0%" },
      { value: "20", option: "20%" },
      { value: "25", option: "25%" },
      { value: "35", option: "35%" },
      { value: "45", option: "45%" },
      { value: "50", option: "50%" },
    ],
  },
  {
    label: "Claim made in expiring policy?",
    name: "claim_made",
    type: "select",
    data: [
      { value: "Yes", option: "Yes" },
      { value: "No", option: "No" },
    ],
    validation: {
      required: false,
    },
  },
];

export const bikePolicyInfoArr = [
  {
    label: "Select Policy Type",
    name: "PolicyStatus",
    type: "select",
    placeholder: "Policy Type",
    validation: {
      required: false,
    },
    data: [
      { value: "continue", option: "Continue" },
      { value: "expired within 90 day", option: "Expired Within 90 days" },
      { value: "expired above 90 day", option: "Expired Above 90 days" },
      { value: "false", option: "No Information About Previous Policy" },
    ],
  },
  {
    label: "New policy type?",
    name: "NewPolicyType",
    type: "select",
    placeholder: "New Policy Type",
    validation: {
      required: "Field is required",
    },
    data: [
      { value: "Comprehensive", option: "Comprehensive" },
      { value: "ThirdParty", option: "Third Party" },
    ],
  },
  {
    label: "Previous policy type?",
    name: "PreviousPolicyType",
    type: "select",
    placeholder: "Previous Policy Type",
    validation: {
      required: false,
    },
    data: [
      { value: "Comprehensive", option: "Comprehensive" },
      { value: "ThirdParty", option: "Third Party" },
    ],
  },
  {
    label: "Previous Policy Insurer",
    name: "PreInsurerCode",
    type: "select",
    placeholder: "Previous Policy Insurer",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Mfg. month of the year",
    name: "ManufaturingDate",
    type: "date",
    validation: {
      require: "Field is required",
    },
  },
  {
    label: "Reg. date of your car",
    name: "RegistrationDate",
    type: "date",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Prev. year policy expiry date",
    name: "PrePolicyEndDate",
    type: "date",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Previous No Claim Bonus (NCB)",
    name: "PreviousNoClaimBonus",
    type: "select",
    placeholder: "Previous No Claim Bonus (NCB)",
    validation: {
      required: false,
    },
    data: [
      { value: "0", option: "0%" },
      { value: "20", option: "20%" },
      { value: "25", option: "25%" },
      { value: "35", option: "35%" },
      { value: "45", option: "45%" },
      { value: "50", option: "50%" },
    ],
  },
  {
    label: "Vehicle Owned By",
    name: "CustomerType",
    type: "select",
    data: [
      { value: "INDIVIDUAL", option: "Individual" },
      { value: "COMPANY", option: "Organization" },
    ],
    validation: {
      required: false,
    },
  },
  {
    label: "Claim made in expiring policy?",
    name: "claim_made",
    type: "select",
    data: [
      { value: "Yes", option: "Yes" },
      { value: "No", option: "No" },
    ],
    validation: {
      required: false,
    },
  },
];

export const pcvVehiclePolicyInfoArr = [
  {
    label: "Select Policy Type",
    name: "PolicyStatus",
    type: "select",
    placeholder: "Policy Type",
    validation: {
      required: false,
    },
    data: [
      { value: "continue", option: "Continue" },
      { value: "expired within 90 day", option: "Expired Within 90 days" },
      { value: "expired above 90 day", option: "Expired Above 90 days" },
      { value: "false", option: "No Information About Previous Policy" },
    ],
  },
  {
    label: "New policy type?",
    name: "NewPolicyType",
    type: "select",
    placeholder: "New Policy Type",
    validation: {
      required: "Field is required",
    },
    data: [
      { value: "Comprehensive", option: "Comprehensive" },
      { value: "ThirdParty", option: "Third Party" },
    ],
  },
  {
    label: "Previous policy type?",
    name: "PreviousPolicyType",
    type: "select",
    placeholder: "Previous Policy Type",
    validation: {
      required: false,
    },
    data: [
      { value: "Comprehensive", option: "Comprehensive" },
      { value: "ThirdParty", option: "Third Party" },
    ],
  },
  {
    label: "Previous Policy Insurer",
    name: "PreInsurerCode",
    type: "select",
    placeholder: "Previous Policy Insurer",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Mfg. month of the year",
    name: "ManufaturingDate",
    type: "date",
    validation: {
      require: "Field is required",
    },
  },
  {
    label: "Reg. date of your car",
    name: "RegistrationDate",
    type: "date",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Prev. year policy expiry date",
    name: "PrePolicyEndDate",
    type: "date",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Previous No Claim Bonus (NCB)",
    name: "PreviousNoClaimBonus",
    type: "select",
    placeholder: "Previous No Claim Bonus (NCB)",
    validation: {
      required: false,
    },
    data: [
      { value: "0", option: "0%" },
      { value: "20", option: "20%" },
      { value: "25", option: "25%" },
      { value: "35", option: "35%" },
      { value: "45", option: "45%" },
      { value: "50", option: "50%" },
    ],
  },
  {
    label: "Claim made in expiring policy?",
    name: "claim_made",
    type: "radio",
    option1: "Yes",
    option2: "No",
    value1: "Yes",
    value2: "No",
    validation: {
      required: false,
    },
  },

  {
    label: "Number Of Wheels",
    name: "number_of_wheels",
    type: "number",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Seating Capacity",
    name: "seating_capacity",
    type: "number",
    validation: {
      required: "Field is required",
    },
  },
];

export const gcvVehiclePolicyInfoArr = [
  {
    label: "Select Policy Type",
    name: "PolicyStatus",
    type: "select",
    placeholder: "Policy Type",
    validation: {
      required: false,
    },
    data: [
      { value: "continue", option: "Continue" },
      { value: "expired within 90 day", option: "Expired Within 90 days" },
      { value: "expired above 90 day", option: "Expired Above 90 days" },
      { value: "false", option: "No Information About Previous Policy" },
    ],
  },
  {
    label: "New policy type?",
    name: "NewPolicyType",
    type: "select",
    placeholder: "New Policy Type",
    validation: {
      required: "Field is required",
    },
    data: [
      { value: "Comprehensive", option: "Comprehensive" },
      { value: "ThirdParty", option: "Third Party" },
    ],
  },
  {
    label: "Previous policy type?",
    name: "PreviousPolicyType",
    type: "select",
    placeholder: "Previous Policy Type",
    validation: {
      required: false,
    },
    data: [
      { value: "Comprehensive", option: "Comprehensive" },
      { value: "ThirdParty", option: "Third Party" },
    ],
  },
  {
    label: "Previous Policy Insurer",
    name: "PreInsurerCode",
    type: "select",
    placeholder: "Previous Policy Insurer",
    validation: {
      required: false,
    },
  },
  {
    label: "Mfg. month of the year",
    name: "ManufaturingDate",
    type: "date",
    validation: {
      require: "Field is required",
    },
  },
  {
    label: "Reg. date of your car",
    name: "RegistrationDate",
    type: "date",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Prev. year policy expiry date",
    name: "PrePolicyEndDate",
    type: "date",
    validation: {
      required: false,
    },
  },
  {
    label: "Previous No Claim Bonus (NCB)",
    name: "PreviousNoClaimBonus",
    type: "select",
    placeholder: "Previous No Claim Bonus (NCB)",
    validation: {
      required: false,
    },
    data: [
      { value: "0", option: "0%" },
      { value: "20", option: "20%" },
      { value: "25", option: "25%" },
      { value: "35", option: "35%" },
      { value: "45", option: "45%" },
      { value: "50", option: "50%" },
    ],
  },
  {
    label: "Vehicle Owned By",
    name: "CustomerType",
    type: "select",
    data: [
      { value: "INDIVIDUAL", option: "Individual" },
      { value: "COMPANY", option: "Organization" },
    ],
    validation: {
      required: false,
    },
  },
  {
    label: "Claim made in expiring policy?",
    name: "claim_made",
    type: "select",
    data: [
      { value: "Yes", option: "Yes" },
      { value: "No", option: "No" },
    ],
    validation: {
      required: false,
    },
  },

  {
    label: "Number Of Wheels",
    name: "number_of_wheels",
    type: "number",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Gross Weight",
    name: "seating_capacity",
    type: "number",
    validation: {
      required: "Field is required",
    },
  },
  {
    label: "Carrier Type",
    name: "carrier_type",
    type: "select",
    placeholder: "Carrier Type",
    validation: {
      required: "Field is required",
    },
    data: [
      { value: "Public", option: "Puclic" },
      { value: "Private", option: "Private" },
    ],
  },
];

export const Documents = [
  {
    id: 1,
    option: "RC-Front",
    name: "rc_front",
    type: "file",
  },
  {
    id: 2,
    option: "RC-Back",
    name: "rc_back",
    type: "file",
  },
  {
    id: 3,
    option: "Insurance-01",
    name: "insurance_01",
    type: "file",
  },
  {
    id: 4,
    option: "Insurance-02",
    name: "insurance_02",
    type: "file",
  },
  {
    id: 5,
    option: "Form 29/30 Sales Latter",
    name: "sales_letter",
    type: "file",
  },
];

export const policyResultArr = (
  Logo,
  Api_name,
  PolicyId,
  ApiId,
  RegisterNumber,
  Make,
  Model,
  variant,
  BasicODPremium,
  BasicTPPremium,
  PAForOwner,
  NetPremium,
  GST,
  FinalPremium,
  MinIdv,
  MaxIdv,
  idv,
  StartDate,
  EndDate,
  discount,
  insurer,
  policyType,
  RoadSideAssistance,
  EngineProtection,
  TyreProtection,
  RimProtection,
  Consumables,
  IsElectricalAccessories,
  IsNonElectricalAccessories,
  InvoiceCover,
  EngineGearBox,
  NCBProtection,
  VoluntaryDeductive,
  PassengerCover,
  LossOfPersonalBelongings,
  ZeroDepriciationCover,
  KeyReplacement,
  PaCoverAmount,
  PassengerCoverAmount,
  ElectricAmount,
  nonElectricalAmount,
  VoluntaryAmount,
  NCBDiscount,
  CNGValue,
  DriverLiability
) => {
  let start = moment(StartDate).format("yyyy");
  let end = moment(EndDate).format("yyyy");
  return {
    Logo: Logo,
    Api_name: Api_name,
    ApiId: ApiId,
    PolicyId: PolicyId,
    RegisterNumber: RegisterNumber,
    Make: Make,
    Model: Model,
    Variant: variant,
    BasicODPremium: BasicODPremium,
    BasicTPPremium: BasicTPPremium,
    PersonalAccident: PAForOwner,
    NetPremium: NetPremium,
    GST: GST,
    FinalPremium: FinalPremium,
    Year: end - start === 0 ? "1 Year" : end - start + " Years",
    MinMaxIdv: MinIdv + " - " + MaxIdv,
    idv: idv,
    insurer: insurer,
    discount: discount,
    StartDate: StartDate,
    EndDate: EndDate,
    policyType: policyType,
    RoadSideAssistance: RoadSideAssistance,
    TyreProtection: TyreProtection,
    RimProtection: RimProtection,
    Consumables: Consumables,
    EngineGearBox: EngineGearBox,
    EngineProtection: EngineProtection,
    IsElectricalAccessories: IsElectricalAccessories,
    IsNonElectricalAccessories: IsNonElectricalAccessories,
    InvoiceCover: InvoiceCover,
    VoluntaryDeductive: VoluntaryDeductive,
    NCBProtection: NCBProtection,
    PassengerCover: PassengerCover,
    LossOfPersonalBelongings: LossOfPersonalBelongings,
    ZeroDepriciationCover: ZeroDepriciationCover,
    KeyReplacement: KeyReplacement,
    PaCoverAmount: PaCoverAmount,
    PassengerCoverAmount: PassengerCoverAmount,
    ElectricAmount: ElectricAmount,
    nonElectricalAmount: nonElectricalAmount,
    VoluntaryAmount: VoluntaryAmount,
    NCBDiscount: NCBDiscount,
    CNGValue: CNGValue,
    DriverLiability: DriverLiability,
  };
};

// let postData = {
//   required_insurance_company: insurer,
//       require_idv: idv,
//       require_discount: discount,
//       expected_final_premium: FinalPremium,
//       policyId: store.getState().root.policyId,
//       policy_starts: StartDate,
//       policy_expires: EndDate,
//       policy_issue: StartDate,
//       policy_recieve: StartDate,
//       od_net_premium: BasicODPremium,
//       terrorism_premium: BasicTPPremium,
//       tax_amount: GST,
//       net_premium: NetPremium
// }

export const PreviousInsurer = [
  { id: 1, Digit_Code: "159", Name: "Acko General Insurance Ltd" },
  {
    id: 2,
    Digit_Code: "153",
    Name: "Aditya Birla Health Insurance Co Limited",
  },
  {
    id: 3,
    Digit_Code: "126",
    Name: "Agriculture Insurance Co of India Ltd.",
  },
  {
    id: 4,
    Digit_Code: "131",
    Name: "Apollo Munich Health Insurance Co Ltd",
  },
  {
    id: 5,
    Digit_Code: "113",
    Name: "Bajaj Allianz General Insurance Company Limited",
  },
  {
    id: 6,
    Digit_Code: "139",
    Name: "BHARATI AXA GENERAL INSURANCE CO LTD",
  },
  {
    id: 7,
    Digit_Code: "123",
    Name: "Cholamandalam MS General Insurance Co Ltd",
  },
  {
    id: 8,
    Digit_Code: "151",
    Name: "Cigna TTK Health Insurance Company Ltd. ",
  },
  {
    id: 9,
    Digit_Code: "XXX",
    Name: "DHFL General Insurance Ltd",
  },
  {
    id: 10,
    Digit_Code: "161",
    Name: "Edelweiss General Insurance Co Ltd",
  },
  {
    id: 11,
    Digit_Code: "124",
    Name: "Export Credit Guarantee Corporation of India Ltd.",
  },
  {
    id: 12,
    Digit_Code: "132",
    Name: "FUTURE GENERALI INDIA INSURANCE COMPANY LTD.",
  },
  { id: 13, Digit_Code: "158", Name: "Go Digit General Insurance Ltd", HDFC: null, Bajaj: " 34", HDFCSHORTCODE: null },
  {
    id: 14,
    Digit_Code: "125",
    Name: "HDFC ERGO GENERAL INSURANCE COMPANY LTD.",
  },
  {
    id: 15,
    Digit_Code: "115",
    Name: "ICICI Lombard General Insurance Company Limited",
  },
  {
    id: 16,
    Digit_Code: "106",
    Name: "IFFCO TOKIO General Insurance Company Limited",
  },
  {
    id: 17,
    Digit_Code: "152",
    Name: "KOTAK MAHINDRA GENERAL INSURANCE COMPANY LTD.",
  },
  { id: 18, Digit_Code: "150", Name: "Liberty General Insurance Ltd" },
  {
    id: 19,
    Digit_Code: "149",
    Name: "Magma HDI General Insurance Co Ltd",
  },
  {
    id: 20,
    Digit_Code: "145",
    Name: "Max Bupa Health Insurance Company Ltd.",
  },
  {
    id: 21,
    Digit_Code: "58",
    Name: "National Insurance Company Limited",
  },
  {
    id: 22,
    Digit_Code: "ONA",
    Name: "Others  Not available",
  },
  {
    id: 23,
    Digit_Code: "141",
    Name: "Raheja QBE General Insurance Co Ltd",
  },
  {
    id: 24,
    Digit_Code: "103",
    Name: "Reliance General Insurance Co Ltd",
  },
  {
    id: 25,
    Digit_Code: "148",
    Name: "Religare Health Insurance Company Limited",
  },
  {
    id: 26,
    Digit_Code: "102",
    Name: "Royal Sundaram General Insurance Co Ltd",
  },
  {
    id: 27,
    Digit_Code: "144",
    Name: "SBI General Insurance Co Ltd",
  },
  {
    id: 28,
    Digit_Code: "137",
    Name: "SHRIRAM GENERAL INSURANCE COMPANY LTD",
  },
  {
    id: 29,
    Digit_Code: "129",
    Name: "Star Health And Allied Ins Co Ltd",
  },
  {
    id: 30,
    Digit_Code: "108",
    Name: "Tata AIG General Insurance Co Ltd",
  },
  { id: 31, Digit_Code: "190", Name: "The New India Assurance Co Ltd" },
  {
    id: 32,
    Digit_Code: "556",
    Name: "Oriental Insurance Company Limited",
  },
  {
    id: 33,
    Digit_Code: "545",
    Name: "United India Insurance Company Limited",
  },
  {
    id: 34,
    Digit_Code: "134",
    Name: "Universal Sompo General Insurance Co Ltd",
  },
  {
    id: 35,
    Digit_Code: "XXX",
    Name: "L&T General Insurance Company Limited",
  },
  {
    id: 36,
    Digit_Code: "XXX",
    Name: "GUJRAT GOVERNMENT INSURANCE FUND",
  },
];
