import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(data);
      localStorage.setItem("token",  res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name",   res.data.name || "Guest");
      localStorage.setItem("role",   res.data.role || "ROLE_USER");
      navigate(res.data.role === "ROLE_ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">Bus<span>Go</span></div>
        <p className="auth-subtitle">Your journey starts here 🚌</p>

        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              className="form-control"
              name="email"
              type="email"
              value={data.email}
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={data.password}
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</>
              : "Sign In"}
          </button>
        </form>

        <hr className="my-3" />
        <p className="text-center mb-0" style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
