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
            <span>Structured learning with premium flow</span>
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
                <small>{user?.role === "ADMIN" ? "Admin" : "Student"}</small>
              </div>
              <button className="button ghost-button" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="button ghost-button" to="/login">
                Login
              </Link>
              <Link className="button primary-button" to="/register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="page-frame">{children}</main>

      <footer className="site-footer glass-panel">
        <div>
          <strong>{import.meta.env.VITE_APP_NAME}</strong>
          <p>
            Learn with premium course pages, structured sections, and a focused
            student experience.
          </p>
        </div>
        <div className="footer-grid">
          <span>5 curated courses</span>
          <span>Preview-first purchase flow</span>
          <span>Admin-controlled content management</span>
        </div>
      </footer>
    </div>
  );
}

export { ShellLayout };
