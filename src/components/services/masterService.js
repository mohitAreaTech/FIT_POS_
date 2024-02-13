import { PostDataWithToken, GetDataWithToken } from "../../api/apiHelper";
import { mastersEndPoint } from "./endpoints";

export const getVehicleMake = async (data) => {
  try {
    const response = await PostDataWithToken(mastersEndPoint.make, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getVehicleModel = async (data) => {
  try {
    const response = await PostDataWithToken(mastersEndPoint.model, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getVehicleVariant = async (data) => {
  try {
    const response = await PostDataWithToken(mastersEndPoint.variant, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getVehicleRto = async () => {
  try {
    const response = await GetDataWithToken(mastersEndPoint.rto, "");
    return response;
  } catch (error) {
    return error;
  }
};

export const getVehiclePreviousInsurer = async () => {
  try {
    const response = await GetDataWithToken(mastersEndPoint.previousInsurer, "");
    return response;
  } catch (error) {
    return error;
  }
};

export const getVehiclePincode = async (state) => {
  try {
    const response = await GetDataWithToken(mastersEndPoint.pincode, "");
    return response;
  } catch (error) {
    return error;
  }
};

export const getStates = async (val) => {
  try {
    const response = await GetDataWithToken(mastersEndPoint.state + "?pincode=" + val, "");
    return response;
  } catch (error) {
    return error;
  }
};

export const getBajajMMV = async (data) => {
  try {
    const response = await PostDataWithToken(mastersEndPoint.bajajMMV, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const generateHDFCChecksum = async (data) => {
  try {
    const response = await PostDataWithToken(mastersEndPoint.hdfcChecksum, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getFiancierBankData = async (state) => {
  try {
    const response = await GetDataWithToken(mastersEndPoint.getFiancierBanks, "");
    return response;
  } catch (error) {
    return error;
  }
};
