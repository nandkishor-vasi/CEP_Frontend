import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import logo from '../graphics/sample2.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth(); // Use isLoggedIn and logout from AuthContext

  console.log('isLoggedIn in Navbar:', isLoggedIn); // Debugging

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">
          <img src={logo} alt="Reusable Tech Inventory Logo" className="logo" />
          <span>Reusable Tech Inventory</span>
        </a>
      </div>
      <div className="navbar-links">
      <Link to="/" className="nav-link">Home</Link>
        <Link to="/donate" className="nav-link">Donate</Link>
        <Link to="/listings" className="nav-link">Listings</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        {isLoggedIn ? (
          <button onClick={logout} className="auth-button">
            Logout
          </button>
        ) : (
          <Link to="/auth" className="auth-button">
            Login/Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;