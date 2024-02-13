// import { toast } from "material-react-toastify";
import swal from "sweetalert";
import {
  GetData,
  GetDataWithToken,
  PostData,
  PostDataWithToken,
} from "../../api/apiHelper";
import { userEndPoints } from "./endpoints";
import { toast } from "react-toastify";

export const loginUser = async (data) => {
  try {
    const response = await PostData(userEndPoints.LOGIN, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const tokenUserLogin = async (data) => {
  try {
    const response = await PostDataWithToken(userEndPoints.tokenUser, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const sendErrorMessage = (response) => {
    toast.error(response.data.message);

  // swal("Error", response.data.message, "error");
};

export const sendSuccessMessage = (response) => {
    toast.success(response.message);

  // swal("Success", response.message, "success");
};

export const sendSuccessInfo = (message) => {
    toast.success(message);

  // swal("Error", response.data.message, "error");
};

export const sendErrorInfo = (message) => {
    toast.error(message);

  // swal("Success", response.message, "success");
};
