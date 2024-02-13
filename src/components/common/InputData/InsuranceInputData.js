export const POSPolicyInputs = [
  // {
  //   option: "Vehicle type",
  //   name: "vehicle_type",
  //   type: "select",
  //   placeholder: "Select Vehicle type",
  //   validation: {
  //     required: "This Field is required",
  //   },
  //   data: [
  //     { value: "Pvt Car", option: "Private Car" },
  //     { value: "MotorBike", option: "MotorBike" },
  //     { value: "Scooter", option: "Scooter" },
  //     { value: "Passenger Carrying", option: "Passenger Carrying" },
  //     { value: "Goods Carrying", option: "Goods Carrying" },
  //     { value: "Miscellaneous", option: "Miscellaneous" },
  //     { value: "Trailer", option: "Trailer" },
  //   ],
  // },
  {
    option: "Case type",
    name: "case_type",
    customprop: "pe-lg-0",
    type: "select",
    placeholder: "Select Case type",
    validation: {
      required: "This Field is required",
    },
    data: [
      { value: "rollover", option: "Rollover" },
      { value: "new", option: "New" },
      { value: "used", option: "Used" },
      { value: "rollover_breakin", option: "Rollover breakin" },
    ],
  },
  {
    option: "Policy type",
    name: "policy_type",
    customprop: "ps-lg-0",
    type: "select",
    placeholder: "Select Policy type",
    validation: {
      required: "This Field is required",
    },
    data: [
      { value: "comprehensive", option: "Comprehensive" },
      { value: "third_party", option: "Third party" },
      { value: "own_damage", option: "Own damage" },
    ],
  },
  // {
  //   option: "Enter Vehicle Registration Number",
  //   name: "vehicle_no",
  //   type: "text",
  //   placeholder: "Enter Vehicle Registration Number",
  //   validation: {
  //     required: "This Field is required",
  //     pattern: {
  //       value: /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/,
  //       message: "Incorrect registration numner",
  //     },
  //   },
  // },
  // {
  //   option: "Select regstration date",
  //   name: "registration_date",
  //   type: "date",
  //   placeholder: "Regstration Date",
  //   validation: {
  //     required: "This Field is required",
  //   },
  // },
  // {
  //   option: "Select Manufacturing date",
  //   name: "vehicle_mfg_yr",
  //   type: "date",
  //   customprop: "pe-lg-0",
  //   placeholder: "Manufacturing Date",
  //   validation: {
  //     required: "This Field is required",
  //   },
  // },
  // {
  //   option: "RTO/city",
  //   name: "rto",
  //   type: "select",
  //   placeholder: "Select Rto City",
  //   validation: {
  //     required: "This Field is required",
  //   },
  //   data: [
  //     { value: "bikaner", option: "Bikaner" },
  //     { value: "jaipur", option: "Jaipur" },
  //     { value: "ajmer", option: "Ajmer" },
  //     { value: "bundi", option: "Bundi" },
  //     { value: "banswara", option: "Banswara" },
  //   ],
  // },
  // {
  //   option: "Gaskit installed",
  //   name: "gaskit_installed",
  //   type: "select",
  //   placeholder: "Select Gaskit installed",
  //   validation: {
  //     required: "This Field is required",
  //   },
  //   data: [
  //     { value: "CNG", option: "CNG" },
  //     { value: "LPG", option: "LPG" },
  //   ],
  // },
  // {
  //   option: "Fuel type", name: "fuel_type", type: "select",
  //   placeholder: "Select fuel type", validation: {
  //     required: "This Field is required"
  //   }, data: [
  //     { value: "petrol", option: "Petrol" },
  //     { value: "diesel", option: "Diesel" },

  //   ]
  // },
];

export const PreferPolicyDetails = [
  // {
  //   option: "Prefered Insurer",
  //   name: "required_insurance_company",
  //   type: "select",
  //   placeholder: "Select Prefered Insurer",
  //   validation: {
  //     required: "This Field is required",
  //   },
  //   data: [
  //     { value: "tata", option: "Tata" },
  //     { value: "bajaj", option: "Bajaj" },
  //     { value: "sbi", option: "Sbi" },
  //     { value: "hdfc", option: "Hdfc" },
  //   ],
  // },
  {
    option: "Prefered Idv",
    name: "require_idv",
    type: "number",
    customprop: "ps-lg-0",
    placeholder: "Enter Prefered Idv",
    validation: {
      // required: "This Field is required",
    },
  },
  {
    option: "Prefered premium",
    name: "expected_final_premium",
    type: "number",
    placeholder: "Enter Prefered premium",
    validation: {
      // required: "This Field is required",
    },
  },
  {
    option: "Prefered Discount",
    name: "require_discount",
    type: "number",
    customprop: "pe-lg-0",
    placeholder: "Enter Prefered Discount",
    validation: {
      // required: "This Field is required",
    },
  },
  // {
  //   option: "Prefered Discount",
  //   name: "require_discount",
  //   type: "select",
  //   placeholder: "Select Prefered Discount",
  //   validation: {
  //     required: "This Field is required",
  //   },
  //   data: [
  //     { value: "0%", option: "0%" },
  //     { value: "10%", option: "10%" },
  //     { value: "20%", option: "20%" },
  //     { value: "50%", option: "50%" },
  //   ],
  // },
];

export const PreviousPolicyDetail = [
  // {
  //   option: "Previous Insurer",
  //   name: "previous_policy_insurance_company",
  //   type: "select",
  //   placeholder: "Select Previous Insurer",
  //   validation: {
  //     required: "This Field is required",
  //   },
  //   data: [
  //     { value: "Acko General Insurance Ld", option: "Acko General Insurance Ld" },
  //     { value: "bajaj", option: "Bajaj" },
  //     { value: "sbi", option: "Sbi" },
  //     { value: "hdfc", option: "Hdfc" },
  //   ],
  // },
  {
    option: "Previous Policy status",
    name: "policy_status",
    type: "select",
    customprop: "ps-lg-0",
    placeholder: "Select NCB Discount",
    validation: {
      required: "This Field is required",
    },
    data: [
      { value: "continue", option: "continue" },
      { value: "expired within 90 day", option: "expired within 90 day" },
      { value: "expired above 90 day", option: "expired above 90 day" },
    ],
  },
  {
    option: "Previous Policy IDV",
    name: "previous_policy_idv",
    type: "number",
    placeholder: "Enter Previous Idv",
    validation: {
      required: "This Field is required",
    },
  },
  {
    option: "Previous Year NCB Discount",
    name: "previous_policy_discount",
    type: "select",
    customprop: "pe-lg-0",
    placeholder: "Select NCB Discount",
    validation: {
      required: "This Field is required",
    },
    data: [
      { value: "0%", option: "0%" },
      { value: "20%", option: "20%" },
      { value: "25%", option: "25%" },
      { value: "35%", option: "35%" },
      { value: "45%", option: "45%" },
      { value: "50%", option: "50%" },
    ],
  },
];

export const Document = [
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

export const SubmitOfflinePolicyDocument = [
  {
    id: 1,
    option: "current issued policy",
    name: "current_issued_policy",
    type: "file",
  },
  {
    id: 2,
    option: "RC-Front",
    name: "rc_front",
    type: "file",
  },
  {
    id: 3,
    option: "RC-Back",
    name: "rc_back",
    type: "file",
  },
  {
    id: 4,
    option: "previous policy",
    name: "previous_policy",
    type: "file",
  },
  {
    id: 5,
    option: "Form 29/30 Sales Latter",
    name: "sales_letter",
    type: "file",
  },
  {
    id: 6,
    option: "Other Document ",
    name: "other",
    type: "file",
  },
];

export const ownerDetailInput = [
  {
    option: "Full Name",
    name: "first_name",
    type: "text",
    customprop: "ps-lg-0",
    placeholder: "Enter Full name",
    validation: {
      // required: "This Field is required",
      pattern: {
        value: /^[a-z,',-]+(\s)[a-z,',-]+$/i,
        message: "Please fill full name",
      },
    },
  },
  // {
  //   option: "last Name",
  //   name: "last_name",
  //   type: "text",
  //   placeholder: "Enter last name",
  //   validation: {
  //     required: "This Field is required",
  //   },
  // },
  {
    option: "Email",
    name: "email",
    type: "email",
    customprop: "pe-lg-0",
    placeholder: "Enter email",
    validation: {
      // required: "This Field is required",
      pattern: {
        value:
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        message: "Incorrect email format",
      },
    },
  },
  {
    option: "Phone",
    name: "phone",
    type: "number",
    customprop: "ps-lg-0",
    placeholder: "Enter Phone no",
    validation: {
      // required: "This Field is required",
      pattern: {
        value: /^\d{10}$/,
        message: `Please fill valid phone no`,
      },
    },
  },
  {
    option: "DOB",
    name: "dob",
    type: "date",
    placeholder: "Enter dob",
    validation: {
      // required: "This Field is required",
    },
  },
  // {
  //   option: "Pan Card No.",
  //   name: "pan_card",
  //   type: "text",
  //   placeholder: "Enter Pan Card No",
  //   validation: {
  //     required: "This Field is required",
  //     pattern: {
  //       value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
  //       message: "Incorrect Pan Card numner",
  //     },
  //   },
  // },
  // {
  //   option: "Aadhar Card No.",
  //   name: "aadhar_card",
  //   type: "text",
  //   placeholder: "Enter Aadhar Card No",
  //   validation: {
  //     required: "This Field is required",
  //     pattern: {
  //       value: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
  //       message: "Incorrect Aadhar Card numner",
  //     },
  //   },
  // },
];

export const addressLine = [
  {
    option: "Address line 1",
    name: "address_line1",
    customprop: "ps-lg-0",
    type: "text",
    placeholder: "Enter address",
    validation: {
      // required: "This Field is required",
    },
  },
  // {
  //   option: "Address line 2",
  //   name: "address_line2",
  //   type: "text",
  //   placeholder: "Enter address",
  //   validation: {
  //     required: false,
  //   },
  // },
  // {
  //   option: "Address line 3",
  //   name: "address_line3",
  //   customprop: "pe-lg-0",
  //   type: "text",
  //   placeholder: "Enter address",
  //   validation: {
  //     required: false,
  //   },
  // },
  // {
  //   option: "City",
  //   name: "city",
  //   type: "select",
  //   placeholder: "Select  City",
  //   validation: {
  //     required: "This Field is required",
  //   },
  //   data: [
  //     { value: "bikaner", option: "Bikaner" },
  //     { value: "jaipur", option: "Jaipur" },
  //     { value: "ajmer", option: "Ajmer" },
  //     { value: "bundi", option: "Bundi" },
  //     { value: "banswara", option: "Banswara" },
  //   ],
  // },
  // {
  //   option: "State",
  //   name: "state",
  //   type: "select",
  //   placeholder: "Select  state",
  //   validation: {
  //     required: "This Field is required",
  //   },
  //   data: [
  //     { value: "Rajasthan", option: "Rajasthan" },
  //     { value: "Goa", option: "Goa" },
  //     { value: "Mumbai", option: "Mumbai" },
  //     { value: "MP", option: "MP" },
  //     { value: "UP", option: "UP" },
  //   ],
  // },
  // {
  //   option: "Pincode",
  //   name: "pincode",
  //   type: "number",
  //   placeholder: "Enter pincode",
  //   validation: {
  //     required: "This Field is required",
  //   },
  // },
];

export const personalDetailInput = [
  {
    option: "Gender",
    name: "gender",
    type: "select",
    customprop: "ps-lg-0",
    placeholder: "Select  gender",
    validation: {
      required: "This Field is required",
    },
    data: [
      { value: "male", option: "Male" },
      { value: "female", option: "Female" },
      { value: "transgender", option: "Transgender" },
    ],
  },
  {
    option: "Marital status",
    name: "marital_status",
    type: "select",
    placeholder: "Select  status",
    validation: {
      required: "This Field is required",
    },
    data: [
      { value: "Married", option: "Married" },
      { value: "Unmarried", option: "Unmarried" },
      { value: "Divorced", option: "Divorced" },
      { value: "Widowed", option: "Widowed" },
    ],
  },
  {
    option: "occupation",
    name: "occupation",
    type: "select",
    customprop: "pe-lg-0",
    placeholder: "Select  occupation",
    validation: {
      required: "This Field is required",
    },
    data: [
      { value: "Salaried", option: "Salaried" },
      { value: "Student", option: "Student" },
      { value: "Self employment", option: "Self employment" },
      { value: "Other", option: "Other" },
    ],
  },
];

export const NomineeInput = [
  {
    option: "Nominee name",
    name: "nominee_name",
    type: "text",
    customprop: "ps-lg-0",
    placeholder: "Enter Nominee name",
    validation: {
      // required: "This Field is required",
    },
  },
  // {
  //   option: "Nominee relation",
  //   name: "nominee_relation",
  //   type: "text",
  //   placeholder: "Enter Nominee relation",
  //   validation: {
  //     required: "This Field is required",
  //   },
  // },
  {
    option: "Nominee age",
    name: "nominee_age",
    type: "number",
    placeholder: "Enter Nominee age",
    validation: {
      // required: "This Field is required",
      pattern: {
        value: /^[1-9]?[0-9]{1}$|^100$/,
        message: `Please fill correct age`,
      },
    },
  },
];

export const InsurerData = [
  { id: 1, Digit_Code: "159", Name: "Acko General Insurance Ld" },
  {
    id: 2,
    Digit_Code: "153",
    Name: "Aditya Birla Health Insurance Co Limited",
  },
  { id: 3, Digit_Code: "126", Name: "Agriculture Insurance Co of India Ltd." },
  { id: 4, Digit_Code: "131", Name: "Apollo Munich Health Insurance Co Ltd" },
  {
    id: 5,
    Digit_Code: "113",
    Name: "Bajaj Allianz General Insurance Company Limited",
  },
  { id: 6, Digit_Code: "139", Name: "BHARATI AXA GENERAL INSURANCE CO LTD" },
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
  { id: 9, Digit_Code: "XXX", Name: "DHFL General Insurance Ltd" },
  { id: 10, Digit_Code: "161", Name: "Edelweiss General Insurance Co Ltd" },
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
  { id: 13, Digit_Code: "158", Name: "Go Digit General Insurance Ltd" },
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
  { id: 19, Digit_Code: "149", Name: "Magma HDI General Insurance Co Ltd" },
  { id: 20, Digit_Code: "145", Name: "Max Bupa Health Insurance Company Ltd." },
  { id: 21, Digit_Code: "58", Name: "National Insurance Company Limited" },
  { id: 22, Digit_Code: "ONA", Name: "Others  Not available" },
  { id: 23, Digit_Code: "141", Name: "Raheja QBE General Insurance Co Ltd" },
  { id: 24, Digit_Code: "103", Name: "Reliance General Insurance Co Ltd" },
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
  { id: 27, Digit_Code: "144", Name: "SBI General Insurance Co Ltd" },
  { id: 28, Digit_Code: "137", Name: "SHRIRAM GENERAL INSURANCE COMPANY LTD" },
  { id: 29, Digit_Code: "129", Name: "Star Health And Allied Ins Co Ltd" },
  { id: 30, Digit_Code: "108", Name: "Tata AIG General Insurance Co Ltd" },
  { id: 31, Digit_Code: "190", Name: "The New India Assurance Co Ltd" },
  { id: 32, Digit_Code: "556", Name: "Oriental Insurance Company Limited" },
  { id: 33, Digit_Code: "545", Name: "United India Insurance Company Limited" },
  {
    id: 34,
    Digit_Code: "134",
    Name: "Universal Sompo General Insurance Co Ltd",
  },
];
