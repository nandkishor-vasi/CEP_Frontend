import React from 'react';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth(); // Use user from AuthContext

  console.log('User in Dashboard:', user); // Debugging: Check if user updates

  return (
    <div className="dashboard">
      <h2>Welcome, {user ? user.name : 'Guest'}</h2>
      {user ? (
        <>
          <h3>Your Donations</h3>
        </>
      ) : (
        <p>
          Please <Link to="/auth">login</Link> to view your donations.
        </p>
      )}
    </div>
  );
};

export default Dashboard;