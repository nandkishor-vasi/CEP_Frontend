import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../graphics/sample2.png";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();

  const id = user?.id;
  const userRole = user?.role?.toLowerCase(); 
  
  console.log("User in Navbar:", user);
  console.log("isLoggedIn in Navbar:", isLoggedIn);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Reusable Tech Inventory Logo" className="logo" />
          <span>Reusable Tech Inventory</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        <Link to="/contact" className="nav-link">Contact</Link>

        {isLoggedIn && id && (
          <Link to="/leaderboard" className="nav-link">
            Leaderboard
          </Link>
        )}  

        {isLoggedIn && id && (
          <Link 
            to={userRole === "donor" ? `/donorDashboard/${id}` : `/beneficiaryDashboard/${id}`} 
            className="nav-link"
          >
            Dashboard
          </Link>
        )}
        
        {isLoggedIn && id && (
          <Link 
            to={userRole === "donor" ? `/donor/profile/${id}` : `/beneficiary/profile/${id}`} 
            className="nav-link"
          >
            Profile
          </Link>
        )}

        {isLoggedIn ? (
          <button onClick={logout} className="auth-button">Logout</button>
        ) : (
          <Link to="/auth" className="auth-button">Login/Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
