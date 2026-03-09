import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getApiErrorMessage } from "../lib/getApiErrorMessage";

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
      setError(getApiErrorMessage(requestError, "Unable to sign you in."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="glass-panel auth-card">
        <p className="eyebrow">Sign In</p>
        <h1>Access your SkillUp account</h1>
        <p>Sign in to continue learning or manage course content from the admin workspace.</p>

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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer-text">
          New to SkillUp? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}

export { LoginPage };
