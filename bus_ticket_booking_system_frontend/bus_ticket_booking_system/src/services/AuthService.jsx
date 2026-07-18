import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const registerUser = (user) => {
  return axios.post(`${API}/register`, user);
};

export const loginUser = (user) => {
  return axios.post(`${API}/login`, user);
};
