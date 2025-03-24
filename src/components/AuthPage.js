import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('DONOR');
  const navigate = useNavigate();
  const { login } = useAuth();
  const backendBaseUrl = 'http://localhost:8080';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin 
      ? `${backendBaseUrl}/api/auth/login` 
      : `${backendBaseUrl}/api/auth/signup`;

    const body = isLogin 
      ? { username, password } 
      : { name, email, phoneNumber, address, role, username, password };

    console.log("Request URL:", url);
    console.log("Request Body:", body);

    try {
      const response = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
      });

      const user = response.data;
      console.log("API Response:", user);
      console.log("User Token:", user.token);

      if (isLogin) {
        if (user.token) {
          localStorage.setItem("user", JSON.stringify({
            id: user.id, 
            name: user.name, 
            role: user.role, 
            token: user.token,
            username: user.username
          }));

          login({id:user.id , username: user.username, email: user.email, role: user.role, token: user.token });

          if (user?.role?.toUpperCase() === "DONOR") {
            console.log("Navigating to Donor Dashboard");
            navigate(`/donorDashboard/${user.id}`);
          } else if (user?.role?.toUpperCase() === "BENEFICIARY") {
            navigate(`/beneficiaryDashboard/${user.id}`);
          }

        } else {
          console.error("Token missing in response.");
          alert("Login failed. No token received.");
        }
      } else {
        console.log("Signup successful. Redirecting to login...");
        setIsLogin(true); 
      }
    } catch (error) {
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        alert(`Error: ${error.response.data.message || "Authentication failed"}`);
      } else if (error.request) {
        console.error('No Response Received:', error.request);
        alert("No response from server. Check if the backend is running.");
      } else {
        console.error('Request Error:', error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="auth-page">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Phone Number:
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </label>
            <label>
              Address:
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </label>
            <label>
              Role:
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="DONOR">Donor</option>
                <option value="BENEFICIARY">Beneficiary</option>
              </select>
            </label>
          </>
        )}
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => {
          setIsLogin(!isLogin);
          if (!isLogin) {
            setName("");
            setEmail("");
            setPhoneNumber("");
            setAddress("");
            setRole("DONOR");
          }
        }}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
