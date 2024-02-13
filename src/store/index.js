import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userReducers from "./reducers/userReducers";
import { loadState } from "../components/utility/LocalStorage";
const persistedState = loadState();
const rootReducer = {
  root: userReducers,
};
const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: [thunk],
});
export default store;
