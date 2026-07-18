import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { bookTicket } from "../services/BookingService";

function Payment() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName]     = useState("");
  const [expiry, setExpiry]         = useState("");
  const [cvv, setCvv]               = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bus]   = useState(() => JSON.parse(localStorage.getItem("selectedBus")));
  const [seats] = useState(() => JSON.parse(localStorage.getItem("selectedSeats")) || []);

  useEffect(() => { if (!bus || seats.length === 0) navigate("/search"); }, [bus, seats, navigate]);

  // Format card number with spaces
  const handleCardInput = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(val.replace(/(.{4})/g, "$1 ").trim());
  };

  const payNow = async () => {
    if (cardNumber.replace(/\s/g, "").length < 16) { alert("Enter a valid 16-digit card number."); return; }
    if (!cardName.trim())                          { alert("Enter the cardholder name."); return; }
    if (expiry.length < 5)                         { alert("Enter a valid expiry date (MM/YY)."); return; }
    if (cvv.length < 3)                            { alert("Enter a valid CVV."); return; }

    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Session expired. Please log in again."); navigate("/"); return; }

    setSubmitting(true);
    try {
      await Promise.all(seats.map((seat) =>
        bookTicket({ seatNo: String(seat), amount: bus.fare, user: { id: Number(userId) }, bus: { id: bus.id } })
      ));
      localStorage.setItem("ticket", JSON.stringify({
        name: localStorage.getItem("name") || "Guest",
        busName: bus.busName, source: bus.source || "", destination: bus.destination || "",
        seatNo: seats.join(", "), amount: seats.length * (bus.fare || 0),
        date: new Date().toISOString().split("T")[0],
      }));
      navigate("/ticket");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.response?.data || "Booking failed. A seat may already be taken.");
    } finally {
      setSubmitting(false);
    }
  };

  const total = seats.length * (bus?.fare || 0);

  return (
    <>
      <Navbar />
      <div className="container page-wrapper" style={{ paddingTop: "1.5rem", maxWidth: 700 }}>
        <h4 className="fw-bold mb-1">Complete Your Payment</h4>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
          Review your booking and enter card details to confirm.
        </p>

        <div className="row g-4">
          {/* Left — card form */}
          <div className="col-md-7">
            <div className="card p-4">
              <div className="section-heading">Payment Details</div>

              <div className="mb-3">
                <label className="form-label">Card Number</label>
                <input className="form-control" placeholder="1234 5678 9012 3456"
                  value={cardNumber} onChange={handleCardInput} maxLength={19} />
              </div>

              <div className="mb-3">
                <label className="form-label">Cardholder Name</label>
                <input className="form-control" placeholder="As on card"
                  value={cardName} onChange={(e) => setCardName(e.target.value)} />
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Expiry Date</label>
                  <input className="form-control" placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                      setExpiry(v);
                    }} maxLength={5} />
                </div>
                <div className="col-6">
                  <label className="form-label">CVV</label>
                  <input className="form-control" placeholder="•••" type="password"
                    value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} maxLength={3} />
                </div>
              </div>
            </div>
          </div>

          {/* Right — summary */}
          <div className="col-md-5">
            <div className="payment-summary">
              <div className="section-heading">Booking Summary</div>

              <div className="payment-row">
                <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Bus</span>
                <span className="fw-semibold">{bus?.busName}</span>
              </div>
              <div className="payment-row">
                <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Route</span>
                <span className="fw-semibold">{bus?.source} → {bus?.destination}</span>
              </div>
              <div className="payment-row">
                <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Seats</span>
                <span className="fw-semibold">{seats.join(", ")}</span>
              </div>
              <div className="payment-row">
                <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Fare × {seats.length}</span>
                <span className="fw-semibold">₹{bus?.fare} × {seats.length}</span>
              </div>
              <div className="payment-row">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              className="btn btn-success w-100 mt-3 py-2"
              onClick={payNow}
              disabled={submitting}
              style={{ fontSize: "1rem" }}
            >
              {submitting
                ? <><span className="spinner-border spinner-border-sm me-2" />Processing…</>
                : `Pay ₹${total} →`}
            </button>

            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.75rem" }}>
              🔒 Secure payment — your card details are protected
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
