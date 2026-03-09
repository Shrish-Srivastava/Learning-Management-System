import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(form);
      const redirectTo =
        user.role === "ADMIN"
          ? "/admin"
          : location.state?.from || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="glass-panel auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Login to SkillUp</h1>
        <p>Use student or admin credentials to continue your learning workflow.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="admin@skillup.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="button primary-button full-width" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer-text">
          New student? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}

export { LoginPage };
