import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBookings, cancelBooking, downloadTicket } from "../services/BookingService";
import { savePdfBlob } from "../utils/pdfDownload";

function BookingHistory() {
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [cancellingId, setCancellingId]   = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      setLoading(true); setError("");
      const userId = localStorage.getItem("userId");
      if (!userId) { setBookings([]); return; }
      const res = await getBookings(userId);
      setBookings(res.data || []);
    } catch { setError("Failed to load bookings. Please try again."); }
    finally { setLoading(false); }
  };

  const handleCancel = async (booking) => {
    if (!window.confirm(`Cancel booking #${booking.id}?\nBus: ${booking.bus?.busName || "—"}, Seat: ${booking.seatNo}\n\nThis cannot be undone.`)) return;
    setCancellingId(booking.id);
    try {
      await cancelBooking(booking.id);
      setBookings((prev) => prev.map((b) => b.id === booking.id ? { ...b, status: "CANCELLED" } : b));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to cancel booking.");
    } finally { setCancellingId(null); }
  };

  const handleDownload = async (booking) => {
    setDownloadingId(booking.id);
    try {
      const res = await downloadTicket({
        passenger:   localStorage.getItem("name") || "Passenger",
        bus:         booking.bus?.busName    || "—",
        seat:        booking.seatNo,
        amount:      booking.amount,
        date:        booking.bookingDate     || "",
        source:      booking.bus?.source     || "",
        destination: booking.bus?.destination || "",
      });
      savePdfBlob(res.data, `ticket_${booking.id}_seat${booking.seatNo}.pdf`);
    } catch { alert("Failed to download PDF. Please try again."); }
    finally { setDownloadingId(null); }
  };

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  return (
    <>
      <Navbar />
      <div className="container page-wrapper" style={{ paddingTop: "1.5rem" }}>

        {/* Page header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0">My Bookings</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              View, download, or cancel your bookings
            </p>
          </div>
          <Link to="/search" className="btn btn-primary">+ Book New Ticket</Link>
        </div>

        {/* Summary cards */}
        {!loading && bookings.length > 0 && (
          <div className="row g-3 mb-4">
            {[
              { label: "Total",     value: bookings.length, color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", icon: "🎫" },
              { label: "Confirmed", value: confirmed,       color: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", icon: "✔"  },
              { label: "Cancelled", value: cancelled,       color: "#fef2f2", border: "#fecaca", text: "#dc2626", icon: "✕"  },
            ].map(({ label, value, color, border, text, icon }) => (
              <div className="col-4" key={label}>
                <div style={{
                  background: color, border: `1px solid ${border}`,
                  borderRadius: 10, padding: "0.75rem 1rem",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "1.4rem" }}>{icon}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: text, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: text, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>Loading your bookings…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && <div className="alert alert-danger">{error}</div>}

        {/* Empty */}
        {!loading && !error && bookings.length === 0 && (
          <div style={{
            textAlign: "center", padding: "3rem 1rem",
            background: "#fff", borderRadius: 12, border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎫</div>
            <h5 className="fw-bold">No bookings yet</h5>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Book your first ticket and it will appear here.
            </p>
            <Link to="/search" className="btn btn-primary mt-2">Search Buses</Link>
          </div>
        )}

        {/* Table */}
        {!loading && !error && bookings.length > 0 && (
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Bus</th>
                    <th>Route</th>
                    <th>Seat</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ background: b.status === "CANCELLED" ? "#f8fafc" : "inherit" }}>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{b.id}</td>
                      <td className="fw-semibold">{b.bus?.busName || "—"}</td>
                      <td style={{ fontSize: "0.85rem" }}>
                        {b.bus ? (
                          <span>
                            <span style={{ color: "var(--primary)", fontWeight: 600 }}>{b.bus.source}</span>
                            <span style={{ color: "var(--text-muted)", margin: "0 4px" }}>→</span>
                            <span style={{ color: "var(--primary)", fontWeight: 600 }}>{b.bus.destination}</span>
                          </span>
                        ) : "—"}
                      </td>
                      <td>
                        <span style={{
                          background: "#eff6ff", color: "#1d4ed8",
                          border: "1px solid #bfdbfe", borderRadius: 6,
                          padding: "2px 8px", fontSize: "0.78rem", fontWeight: 700,
                        }}>{b.seatNo}</span>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{b.bookingDate}</td>
                      <td className="fw-semibold" style={{ color: "var(--success)" }}>₹{b.amount}</td>
                      <td>
                        <span style={{
                          display: "inline-block",
                          background: b.status === "CONFIRMED" ? "#f0fdf4" : "#fef2f2",
                          color: b.status === "CONFIRMED" ? "#16a34a" : "#dc2626",
                          border: `1px solid ${b.status === "CONFIRMED" ? "#bbf7d0" : "#fecaca"}`,
                          borderRadius: 20, padding: "2px 10px",
                          fontSize: "0.75rem", fontWeight: 700,
                        }}>
                          {b.status === "CONFIRMED" ? "✔ Confirmed" : "✕ Cancelled"}
                        </span>
                      </td>
                      <td>
                        {b.status === "CONFIRMED" ? (
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm"
                              style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontWeight: 600 }}
                              onClick={() => handleDownload(b)}
                              disabled={downloadingId === b.id}
                              title="Download PDF"
                            >
                              {downloadingId === b.id
                                ? <span className="spinner-border spinner-border-sm" />
                                : "⬇ PDF"}
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: "#f8fafc", color: "var(--text-muted)", border: "1px solid var(--border)", fontWeight: 600 }}
                              onClick={() => handleCancel(b)}
                              disabled={cancellingId === b.id}
                              title="Cancel booking"
                            >
                              {cancellingId === b.id
                                ? <><span className="spinner-border spinner-border-sm me-1" />…</>
                                : "Cancel"}
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BookingHistory;
