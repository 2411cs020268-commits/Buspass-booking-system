import axios from "axios";

const API         = "http://localhost:8080/api/bookings";
const TICKET_API  = "http://localhost:8080/api/ticket";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const bookTicket = (booking) => {
  return axios.post(API, booking, authHeader());
};

export const getBookings = (userId) => {
  return axios.get(`${API}/${userId}`, authHeader());
};

export const cancelBooking = (id) => {
  return axios.put(`${API}/cancel/${id}`, null, authHeader());
};

export const getBookedSeats = (busId) => {
  return axios.get(`${API}/booked-seats/${busId}`, authHeader());
};

/**
 * Downloads the ticket as a PDF blob.
 * params: { passenger, bus, seat, amount, date, source, destination }
 */
export const downloadTicket = (params) => {
  const query = new URLSearchParams(params).toString();
  return axios.get(`${TICKET_API}/download?${query}`, {
    ...authHeader(),
    responseType: "blob", // tell axios to treat the response as binary
  });
};
