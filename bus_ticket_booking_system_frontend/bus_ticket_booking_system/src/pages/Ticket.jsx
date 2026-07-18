import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { downloadTicket } from "../services/BookingService";
import { savePdfBlob } from "../utils/pdfDownload";

function Ticket() {
  const booking = JSON.parse(localStorage.getItem("ticket"));
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await downloadTicket({
        passenger:   booking.name,
        bus:         booking.busName,
        seat:        booking.seatNo,
        amount:      booking.amount,
        date:        booking.date        || new Date().toISOString().split("T")[0],
        source:      booking.source      || "",
        destination: booking.destination || "",
      });
      savePdfBlob(res.data, `ticket_${booking.seatNo.replace(/, /g, "_")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to download ticket. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="container page-wrapper" style={{ paddingTop: "2rem", maxWidth: 520 }}>
          <div className="alert alert-warning">No ticket found.</div>
          <Link to="/search" className="btn btn-primary">Search Buses</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container page-wrapper" style={{ paddingTop: "2rem", maxWidth: 540 }}>

        {/* Success badge */}
        <div className="text-center mb-4">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 30, padding: "6px 20px",
            fontSize: "0.85rem", fontWeight: 700, color: "#16a34a",
          }}>
            ✔ Booking Confirmed
          </div>
        </div>

        <div className="ticket-card">
          {/* Ticket header */}
          <div className="ticket-header">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div style={{ fontSize: "0.7rem", opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
                  BusGo — E-Ticket
                </div>
                <h4 className="mb-0 mt-1" style={{ color: "#fff" }}>{booking.busName}</h4>
                {booking.source && (
                  <div style={{ fontSize: "0.9rem", opacity: 0.85, marginTop: 4 }}>
                    {booking.source} → {booking.destination}
                  </div>
                )}
              </div>
              <div style={{ fontSize: "2.5rem", opacity: 0.6 }}>🚌</div>
            </div>
          </div>

          {/* Dashed perforation */}
          <div style={{
            borderTop: "2px dashed #e2e8f0",
            margin: "0",
            position: "relative",
          }}>
            <span style={{
              position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)",
              width: 32, height: 32, background: "#f1f5f9", borderRadius: "50%",
            }} />
            <span style={{
              position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)",
              width: 32, height: 32, background: "#f1f5f9", borderRadius: "50%",
            }} />
          </div>

          {/* Ticket body */}
          <div className="ticket-body">
            <div className="row g-4">
              <div className="col-6 ticket-field">
                <label>Passenger</label>
                <p>{booking.name}</p>
              </div>
              <div className="col-6 ticket-field">
                <label>Booking Date</label>
                <p>{booking.date || new Date().toLocaleDateString("en-IN")}</p>
              </div>
              <div className="col-6 ticket-field">
                <label>Seat(s)</label>
                <p>{booking.seatNo}</p>
              </div>
              <div className="col-6 ticket-field">
                <label>Total Fare</label>
                <p style={{ color: "var(--success)", fontSize: "1.1rem" }}>₹{booking.amount}</p>
              </div>
            </div>

            <hr className="ticket-divider" />

            {/* Action buttons */}
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-danger"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Generating…</>
                  : "⬇ Download PDF"}
              </button>
              <Link to="/bookings" className="btn btn-primary">🎫 My Bookings</Link>
              <Link to="/dashboard" className="btn btn-outline-secondary">🏠 Home</Link>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
              You can cancel this booking from{" "}
              <Link to="/bookings">My Bookings</Link>.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Ticket;
