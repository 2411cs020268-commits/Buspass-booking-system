import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SeatGrid from "../components/SeatGrid";
import { getBookedSeats } from "../services/BookingService";

function SeatSelection() {
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bus] = useState(() => JSON.parse(localStorage.getItem("selectedBus")));

  useEffect(() => {
    if (!bus) { navigate("/search"); return; }
    getBookedSeats(bus.id)
      .then((res) => setBookedSeats((res.data || []).map(Number)))
      .catch(() => setBookedSeats([]));
  }, [bus, navigate]);

  const handleContinue = () => {
    if (seats.length === 0) { alert("Please select at least one seat."); return; }
    localStorage.setItem("selectedSeats", JSON.stringify(seats));
    navigate("/payment");
  };

  return (
    <>
      <Navbar />
      <div className="container page-wrapper" style={{ paddingTop: "1.5rem", maxWidth: 680 }}>

        <h4 className="fw-bold mb-1">Choose Your Seats</h4>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
          Select one or more seats from the layout below.
        </p>

        {/* Bus info strip */}
        {bus && (
          <div className="card mb-4" style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe" }}>
            <div className="card-body py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <div className="fw-bold" style={{ fontSize: "1rem" }}>{bus.busName}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{bus.source} → {bus.destination}</div>
              </div>
              <div className="text-end">
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fare per seat</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--success)" }}>₹{bus.fare}</div>
              </div>
            </div>
          </div>
        )}

        <SeatGrid onSeatSelect={setSeats} bookedSeats={bookedSeats} />

        {/* Selected summary + CTA */}
        <div className="card mt-4" style={{ border: "1px solid var(--border)" }}>
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3 py-3 px-4">
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>Selected Seats</div>
              <div className="fw-bold" style={{ fontSize: "1rem" }}>
                {seats.length > 0 ? seats.join(", ") : <span style={{ color: "var(--text-muted)" }}>None</span>}
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              {seats.length > 0 && (
                <div className="text-end">
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--success)" }}>
                    ₹{seats.length * (bus?.fare || 0)}
                  </div>
                </div>
              )}
              <button className="btn btn-primary px-4" onClick={handleContinue} disabled={seats.length === 0}>
                Continue to Payment →
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default SeatSelection;
