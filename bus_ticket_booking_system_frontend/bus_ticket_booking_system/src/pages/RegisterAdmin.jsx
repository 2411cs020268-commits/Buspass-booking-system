import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterAdmin() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleChange = (e) => { setError(""); setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register-admin", form);
      alert("Admin account created! Please log in.");
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create admin account.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ border: "2px solid #fecaca !important" }}>
        <div className="auth-logo" style={{ color: "#dc2626" }}>
          ⚙️ Admin Setup
        </div>
        <p className="auth-subtitle" style={{ color: "#dc2626", opacity: 0.8 }}>
          Remove this page after creating the first admin.
        </p>

        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control" name="name" value={form.name}
              placeholder="Admin name" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" name="email" type="email" value={form.email}
              placeholder="admin@example.com" onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input className="form-control" name="password" type="password" value={form.password}
              placeholder="Min. 6 characters" onChange={handleChange} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-danger w-100 py-2" disabled={loading}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Creating…</>
              : "Create Admin Account"}
          </button>
        </form>

        <hr className="my-3" />
        <p className="text-center mb-0" style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
          <Link to="/">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterAdmin;
