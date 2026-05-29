import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./TopNav.css";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/skills", label: "Skills" },
  { to: "/career", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/formation", label: "Education" },
  { to: "/languages", label: "Languages" },
  { to: "/cv", label: "CV" },
  { to: "/networking", label: "Networking" },
];

export function TopNav() {
  const navigate = useNavigate();
  const { fullName, avatarUrl, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const initials = useMemo(() => {
    const source = fullName?.trim() || "User";
    const parts = source.split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  }, [fullName]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const goToProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  return (
    <header className="topnav-shell">
      <div className="topnav-brand">
        <span className="topnav-dot" aria-hidden="true" />
        <div>
          <h1>My Way</h1>
          <p>{fullName ? `Signed in as ${fullName}` : "Career and competency navigator"}</p>
        </div>
      </div>

      <div className="topnav-links-wrap">
        <nav className="topnav-links nav nav-pills" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "topnav-link nav-link topnav-link-active" : "topnav-link nav-link"
              }
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="topnav-menu" ref={menuRef}>
          <button
            type="button"
            className="topnav-avatar-trigger"
            onClick={() => setMenuOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="User avatar" className="topnav-avatar-image" />
            ) : (
              <span className="topnav-avatar-fallback" aria-hidden="true">
                {initials}
              </span>
            )}
          </button>

          {menuOpen ? (
            <div className="topnav-dropdown" role="menu">
              <button type="button" role="menuitem" className="btn" onClick={goToProfile}>
                Profile
              </button>
              <button type="button" role="menuitem" className="btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
