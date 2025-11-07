import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import formatDate from '../utils/formatDate';

const MyAchievementsPage = () => {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyAchievements = async () => {
        try {
            const { data } = await API.get('/achievements/my');
            setAchievements(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyAchievements();
        } else {
            setLoading(false);
            setError("Please log in to view your achievements.");
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this achievement? This cannot be undone.')) {
            try {
                await API.delete(`/achievements/${id}`);
                fetchMyAchievements(); // Refresh list
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="container">
            <h1>My Achievements</h1>
            <Link to="/achievements/submit" className="btn btn-primary" style={{ marginBottom: '20px' }}>Submit New Achievement</Link>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : achievements.length === 0 ? (
                <Message variant="info">You have not submitted any achievements yet.</Message>
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
                            {achievements.map((achievement) => (
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
                                        {achievement.status === 'Pending' && (
                                            <>
                                                {/* Edit link will be inside details page now */}
                                                <button onClick={() => handleDelete(achievement._id)} className="btn btn-danger" style={{ marginLeft: '5px' }}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyAchievementsPage;