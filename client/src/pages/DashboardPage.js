import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import formatDate from '../utils/formatDate';

const DashboardPage = () => {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const { data } = await API.get('/achievements/my');
                setAchievements(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAchievements();
        } else {
            setLoading(false);
        }
    }, [user]);

    const approvedAchievements = achievements.filter(
        (achievement) => achievement.status === 'Approved'
    );
    const pendingAchievements = achievements.filter(
        (achievement) => achievement.status === 'Pending'
    );

    return (
        <div className="container">
            <h1>Welcome, {user?.name}!</h1>
            <p>Your Student Dashboard</p>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <div className="card" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
                            <h3>Total Approved</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                                {approvedAchievements.length}
                            </p>
                        </div>
                        <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
                            <h3>Pending Submissions</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                                {pendingAchievements.length}
                            </p>
                        </div>
                        <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
                            <h3>New Achievement</h3>
                            <Link to="/achievements/submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                Submit Now
                            </Link>
                        </div>
                    </div>

                    <div className="card">
                        <h2>Your Recent Achievements</h2>
                        {approvedAchievements.length === 0 ? (
                            <Message variant="info">No approved achievements yet. <Link to="/achievements/submit">Submit one!</Link></Message>
                        ) : (
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Activity</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {achievements.slice(0, 5).map((achievement) => (
                                            <tr key={achievement._id}>
                                                <td>{achievement.title}</td>
                                                <td>{achievement.activity?.name}</td>
                                                <td>{formatDate(achievement.date)}</td>
                                                <td>
                                                    <span className={`status-badge status-${achievement.status.toLowerCase()}`}>
                                                        {achievement.status}
                                                    </span>
                                                </td>
                                                <td className="action-buttons">
                                                    <Link to={`/achievements/${achievement._id}`} className="btn btn-info">View</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <Link to="/my-achievements" className="btn btn-secondary" style={{ marginTop: '20px' }}>View All My Achievements</Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;