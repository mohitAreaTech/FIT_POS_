export const userEndPoints = {
  CREATEPOS: "auth/create-user",
  LOGIN: "auth/pos-login",
  tokenUser: "auth/token-user",
};

export const posEndpoints = {
  CREATECUSTOMER: "pos/create-customer",
  GETCOLUMN: "pos/get-column",
  CUSTOMERDOC: "pos/customer-doc",
  GETLEADTYPES: "pos/get-leads-type",
  GETPLANS: "pos/get-plan",
  FILLINSURANCEDATA: "pos/fill-data",
  GENERATELEAD: "pos/generate-lead",
  LEADWITHVALUE: "pos/lead-with-value",
  QUOTATIONRESPONSE: "pos/quotation",
  GETLEADDETAILS: "pos/get-lead-detail",
  UPDATEMISLEAD: "pos/update",
  LEADWITHVALUEMIS: "pos/lead-with-value-mis",
  becomePos: "auth/become-a-pos",
  registerPos: "auth/update-pos",
  posLogin: "auth/trainee-login",
  trainingModule: "exam/get-module",
  moduleComplete: "exam/module-complete",
  startExam: "exam/start-exam",
  postAnwer: "exam/answer",
  endExam: "exam/end-exam",
  examResult: "exam/result",
  changePassword: "auth/change-password",
  getStates: "admin/states",
  getDistricts: "admin/district",
  getBranches: "admin/get-branch",
  getCertificate: 'exam/certificate'
};

export const mastersEndPoint = {
  make: "admin/make",
  model: "admin/model",
  variant: "admin/variant",
  rto: "motor/rto",
  previousInsurer: "admin/previous-insurer",
  pincode: "motor/pincode",
  state: "motor/states",
  bajajMMV: "motor/getBajajMMV",
  hdfcChecksum: "motor/hdfcChecksum",

  getFiancierBanks: "motor/getFiancierBanks",
};
