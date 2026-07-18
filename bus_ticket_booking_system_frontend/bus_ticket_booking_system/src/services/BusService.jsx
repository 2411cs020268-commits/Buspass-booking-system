import axios from "axios";

const API_URL = "http://localhost:8080/api/buses";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const searchBus = (source, destination) => {
  return axios.get(
    `${API_URL}/search?source=${source}&destination=${destination}`,
    authHeader(),
  );
};

export const getAllBuses = () => {
  return axios.get(API_URL, authHeader());
};

export const addBus = (bus) => {
  return axios.post(API_URL, bus, authHeader());
};

export const deleteBus = (id) => {
  return axios.delete(`${API_URL}/${id}`, authHeader());
};
