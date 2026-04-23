
import axios from "axios";
import { handleError } from "./utils/errorHandler";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

apiClient.interceptors.response.use(
  (r) => r,
  (e) => Promise.reject(handleError(e))
);
