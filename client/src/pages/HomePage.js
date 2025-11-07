import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to AchieveTrack</h1>
      <p>Your platform to manage and showcase extracurricular achievements.</p>
      {user ? (
        <p>
          Hello, {user.name}! Go to your{' '}
          <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>Dashboard</Link>.
        </p>
      ) : (
        <div style={{ marginTop: '30px' }}>
          <Link to="/login" className="btn" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;