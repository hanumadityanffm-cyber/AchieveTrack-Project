import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout, isAdmin } = useAuth();

    return (
        <header className="header">
            <div className="container">
                <h1>
                    <Link to={user ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/'}>AchieveTrack</Link>
                </h1>
                <nav>
                    <ul>
                        {user ? (
                            <>
                                {isAdmin ? (
                                    <>
                                        <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                                        <li><Link to="/admin/users">Users</Link></li>
                                        <li><Link to="/admin/activities">Activities</Link></li>
                                        <li><Link to="/admin/achievements">All Achievements</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/dashboard">Dashboard</Link></li>
                                        <li><Link to="/my-achievements">My Achievements</Link></li>
                                        <li><Link to="/achievements/submit">Submit Achievement</Link></li>
                                    </>
                                )}
                                <li><Link to="/profile">Profile ({user.name})</Link></li>
                                <li><button onClick={logout} className="btn btn-secondary">Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;