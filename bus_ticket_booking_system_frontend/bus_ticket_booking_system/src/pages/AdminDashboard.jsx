import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllBuses, addBus, deleteBus } from "../services/BusService";

const EMPTY = { busName: "", source: "", destination: "", departureTime: "", arrivalTime: "", totalSeats: "", fare: "" };

function AdminDashboard() {
  const [buses, setBuses]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [tableError, setTableError] = useState("");
  const [form, setForm]             = useState(EMPTY);
  const [formError, setFormError]   = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);

  useEffect(() => { loadBuses(); }, []);

  const loadBuses = async () => {
    try { setLoading(true); setTableError(""); const res = await getAllBuses(); setBuses(res.data || []); }
    catch { setTableError("Failed to load buses. Please try again."); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    setFormError(""); setFormSuccess("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBus = async (e) => {
    e.preventDefault(); setFormError(""); setFormSuccess("");
    if (Number(form.totalSeats) < 1) { setFormError("Total seats must be at least 1."); return; }
    if (Number(form.fare) < 0)       { setFormError("Fare cannot be negative."); return; }
    setSubmitting(true);
    try {
      await addBus({ ...form, totalSeats: Number(form.totalSeats), fare: Number(form.fare) });
      setFormSuccess(`"${form.busName}" added successfully!`);
      setForm(EMPTY); setShowForm(false); loadBuses();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to add bus.");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete bus "${name}"? This cannot be undone.`)) return;
    try { await deleteBus(id); setBuses((p) => p.filter((b) => b.id !== id)); }
    catch (err) { alert(err?.response?.data?.message || "Failed to delete bus."); }
  };

  return (
    <>
      <Navbar />
      <div className="container page-wrapper" style={{ paddingTop: "1.5rem" }}>

        {/* Admin header */}
        <div className="admin-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="mb-0">Admin Dashboard</h4>
            <p style={{ opacity: 0.7, fontSize: "0.85rem", marginTop: 2 }}>
              Manage buses — add, view and delete routes
            </p>
          </div>
          <button
            className="btn"
            style={{ background: showForm ? "#ef4444" : "#fff", color: showForm ? "#fff" : "#1e293b", border: "none", fontWeight: 700 }}
            onClick={() => { setShowForm((p) => !p); setFormError(""); setFormSuccess(""); setForm(EMPTY); }}
          >
            {showForm ? "✕ Cancel" : "+ Add Bus"}
          </button>
        </div>

        {/* Success message */}
        {formSuccess && <div className="alert alert-success mt-3">{formSuccess}</div>}

        {/* Add Bus form */}
        {showForm && (
          <div className="card p-4 mt-3">
            <div className="section-heading">New Bus Details</div>
            {formError && <div className="alert alert-danger py-2 mb-3">{formError}</div>}
            <form onSubmit={handleAddBus}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Bus Name</label>
                  <input className="form-control" name="busName" placeholder="e.g. Express 101"
                    value={form.busName} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Source</label>
                  <input className="form-control" name="source" placeholder="e.g. Mumbai"
                    value={form.source} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Destination</label>
                  <input className="form-control" name="destination" placeholder="e.g. Pune"
                    value={form.destination} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Departure Time</label>
                  <input className="form-control" name="departureTime" placeholder="e.g. 08:00 AM"
                    value={form.departureTime} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Arrival Time</label>
                  <input className="form-control" name="arrivalTime" placeholder="e.g. 11:00 AM"
                    value={form.arrivalTime} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Total Seats</label>
                  <input className="form-control" type="number" name="totalSeats" min="1" placeholder="40"
                    value={form.totalSeats} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Fare (₹)</label>
                  <input className="form-control" type="number" name="fare" min="0" step="0.01" placeholder="350"
                    value={form.fare} onChange={handleChange} required />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-success" disabled={submitting}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : "Save Bus"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        {!loading && buses.length > 0 && (
          <div className="d-flex gap-3 mt-4 mb-3 flex-wrap">
            {[
              { label: "Total Buses",  value: buses.length,                                        color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
              { label: "Total Seats",  value: buses.reduce((s, b) => s + (b.totalSeats || 0), 0), color: "#f0fdf4", border: "#bbf7d0", text: "#16a34a" },
            ].map(({ label, value, color, border, text }) => (
              <div key={label} style={{
                background: color, border: `1px solid ${border}`,
                borderRadius: 10, padding: "0.65rem 1.25rem",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: text }}>{value}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: text, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>Loading buses…</p>
          </div>
        )}

        {!loading && tableError && <div className="alert alert-danger mt-3">{tableError}</div>}

        {!loading && !tableError && buses.length === 0 && (
          <div style={{
            textAlign: "center", padding: "3rem", background: "#fff",
            borderRadius: 12, border: "1px solid var(--border)", marginTop: "1rem",
          }}>
            <div style={{ fontSize: "3rem" }}>🚌</div>
            <h5 className="fw-bold mt-2">No buses added yet</h5>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Click <strong>+ Add Bus</strong> above to get started.
            </p>
          </div>
        )}

        {!loading && !tableError && buses.length > 0 && (
          <div className="card mt-1" style={{ overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Bus Name</th>
                    <th>Route</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Seats</th>
                    <th>Fare (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus.id}>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{bus.id}</td>
                      <td className="fw-semibold">{bus.busName}</td>
                      <td style={{ fontSize: "0.85rem" }}>
                        <span style={{ color: "var(--primary)", fontWeight: 600 }}>{bus.source}</span>
                        <span style={{ color: "var(--text-muted)", margin: "0 4px" }}>→</span>
                        <span style={{ color: "var(--primary)", fontWeight: 600 }}>{bus.destination}</span>
                      </td>
                      <td style={{ fontSize: "0.88rem" }}>{bus.departureTime}</td>
                      <td style={{ fontSize: "0.88rem" }}>{bus.arrivalTime}</td>
                      <td>
                        <span style={{
                          background: bus.totalSeats > 10 ? "#f0fdf4" : "#fffbeb",
                          color: bus.totalSeats > 10 ? "#16a34a" : "#d97706",
                          border: `1px solid ${bus.totalSeats > 10 ? "#bbf7d0" : "#fde68a"}`,
                          borderRadius: 6, padding: "2px 8px",
                          fontSize: "0.78rem", fontWeight: 700,
                        }}>{bus.totalSeats}</span>
                      </td>
                      <td className="fw-semibold" style={{ color: "var(--success)" }}>₹{bus.fare}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontWeight: 600 }}
                          onClick={() => handleDelete(bus.id, bus.busName)}
                        >
                          🗑 Delete
                        </button>
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

export default AdminDashboard;
