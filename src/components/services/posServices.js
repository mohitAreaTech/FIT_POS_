import { Store } from "react-notifications-component";
import { GetDataWithToken, PostDataWithToken, PostImageDataWithToken } from "../../api/apiHelper";
import { posEndpoints } from "./endpoints";


export const handleBecomePos = (data) => {
  try {
    const response = PostDataWithToken(posEndpoints.becomePos, data);
    return response;
  } catch (err) {
    throw err;
  }
};


export const handleLoginPos = (data) => {
  try {
    const response = PostDataWithToken(posEndpoints.posLogin, data);
    return response;
  } catch (err) {
    throw err;
  }
};

export const handleRegisterPos = (id, data) => {
  try {
    const response = PostImageDataWithToken(posEndpoints.registerPos + "/" + id, data);
    return response;
  } catch (err) {
    throw err;
  }
};

export const submitInsuranceData = async (data) => {
  try {
    const response = await PostImageDataWithToken(
      posEndpoints.FILLINSURANCEDATA,
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleStartExam = () => {
  try {
    const response = GetDataWithToken(posEndpoints.startExam, "");
    return response;
  } catch (err) {
    throw err;
  }
};


export const getCertificateForPOS = (data) => {
  try {
    const response = GetDataWithToken(posEndpoints.getCertificate + '/' + data, '');
    return response;
  } catch (err) {
    throw err;
  }
};


export const handlePostAnswer = (data) => {
  try {
    const response = PostDataWithToken(posEndpoints.postAnwer, data);
    return response;
  } catch (err) {
    throw err;
  }
};


export const handleEndExam = () => {
  try {
    const response = GetDataWithToken(posEndpoints.endExam, "");
    return response;
  } catch (err) {
    throw err;
  }
};

export const getExamResult = () => {
  try {
    const response = GetDataWithToken(posEndpoints.examResult, "");
    return response;
  } catch (err) {
    throw err;
  }
};


export const handleGetStates = () => {
  try {
    const response = GetDataWithToken(posEndpoints.getStates, "");
    return response;
  } catch (err) {
    throw err;
  }
};

export const handleGetDistrict = (id) => {
  try {
    const response = GetDataWithToken(posEndpoints.getDistricts + "/" + id, "");
    return response;
  } catch (err) {
    throw err;
  }
};
export const handleGetBranch = (id) => {
  try {
    const response = GetDataWithToken(posEndpoints.getBranches + "/?district=" + id, "");
    return response;
  } catch (err) {
    throw err;
  }
};


export const createCustomer = async (url, data) => {
  try {
    const response = await PostImageDataWithToken(url, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getTrainingModule = () => {
  try {
    const response = GetDataWithToken(posEndpoints.trainingModule, "");
    return response;
  } catch (err) {
    throw err;
  }
};

export const sendSuccessInfo = (message) => {
    swal("Success", message, "success");
  Store.addNotification({
    title: "Seccess!",
    message: message,
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export const handleModuleComplete = (id) => {
  try {
    const response = GetDataWithToken(posEndpoints.moduleComplete + "/" + id, "");
    return response;
  } catch (err) {
    throw err;
  }
};

export const sendErrorMessage = (response) => {
  console.log("response", response.data.message);
  Store.addNotification({
    title: "Error!",
    message: response.data.message,
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 3000,
      onScreen: true,
    },
  });
    swal("Error", response.data.message, "error");
};
