import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="container card"><h2>Please log in to view your profile.</h2></div>;
    }

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '50px auto' }}>
                <h2>User Profile</h2>
                <div className="profile-details">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    {user.studentId && <p><strong>Student ID:</strong> {user.studentId}</p>}
                </div>
                {/* Add options to update profile or change password later if desired */}
            </div>
        </div>
    );
};

export default ProfilePage;