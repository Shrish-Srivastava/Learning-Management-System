import { BookOpen, GraduationCap, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ShellLayout({ children }) {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <header className="site-header glass-panel">
        <Link className="brand" to="/">
          <span className="brand-badge">
            <GraduationCap size={18} />
          </span>
          <div>
            <strong>{import.meta.env.VITE_APP_NAME}</strong>
            <span>Structured online learning platform</span>
          </div>
        </Link>

        <nav className="main-nav">
          <NavLink to="/">
            <BookOpen size={16} />
            Courses
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard">
              <LayoutDashboard size={16} />
              My Learning
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin">
              <ShieldCheck size={16} />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <div className="user-badge glass-chip">
                <span>{user?.name}</span>
                {user?.role === "ADMIN" && <small>Administrator</small>}
              </div>
              <button className="button ghost-button" onClick={handleLogout}>
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link className="button ghost-button" to="/login">
                Sign In
              </Link>
              <Link className="button primary-button" to="/register">
                Create Account
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="page-frame">{children}</main>

      <footer className="site-footer glass-panel">
        <div className="footer-brand-block">
          <strong>{import.meta.env.VITE_APP_NAME}</strong>
          <p>
            SkillUp delivers structured online learning with clear course
            organization, guided lesson flow, and focused student progress.
          </p>
        </div>
        <div className="footer-grid">
          <span>Curated technical courses</span>
          <span>Preview-enabled enrolment</span>
          <span>Structured lesson progression</span>
        </div>
        <div className="footer-note">
          <span>Designed for consistent, outcome-focused learning.</span>
        </div>
      </footer>
    </div>
  );
}

export { ShellLayout };
