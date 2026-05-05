import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Layout({ children }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: "flex", height: "100vh" }}>

  
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "20px" }}>TaskBoard</h2>
        <hr style={{ borderColor: "#334155" }} />

        <NavItem to="/" label="📊 Dashboard" active={isActive("/")} />
        <NavItem to="/projects" label="📁 Projects" active={isActive("/projects")} />
      </div>

      
      <div
        style={{
          flex: 1,
          background: theme === "dark" ? "#0f172a" : "#f1f5f9",
          color: theme === "dark" ? "white" : "black"
        }}
      >

        
        <div style={navbarStyle(theme)}>
          <h4 style={{ margin: 0 }}>Task Board Application</h4>

          
          <button
            className={`btn ${
              theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
            }`}
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

      
        <div style={{ padding: "25px" }}>
          {children}
        </div>

      </div>
    </div>
  );
}


const NavItem = ({ to, label, active }) => {
  return (
    <Link
      to={to}
      style={{
        ...navItem,
        background: active ? "#334155" : "transparent"
      }}
    >
      {label}
    </Link>
  );
};


const sidebarStyle = {
  width: "260px",
  background: "#1e293b",
  color: "white",
  padding: "25px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};


const navItem = {
  color: "white",
  textDecoration: "none",
  padding: "12px 15px",
  borderRadius: "8px",
  transition: "0.3s",
  display: "block"
};


const navbarStyle = (theme) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: theme === "dark" ? "#1e293b" : "white",
  color: theme === "dark" ? "white" : "black",
  padding: "15px 25px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
});

export default Layout;