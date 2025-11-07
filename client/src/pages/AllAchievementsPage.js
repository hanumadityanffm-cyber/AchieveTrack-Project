import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import formatDate from '../utils/formatDate';

const AllAchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchAchievements = async () => {
        try {
            const { data } = await API.get('/achievements');
            setAchievements(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this achievement? This action cannot be undone.')) {
            try {
                await API.delete(`/achievements/${id}`);
                fetchAchievements(); // Refresh list
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        }
    };

    const filteredAchievements = achievements.filter(ach =>
        filterStatus === 'All' || ach.status === filterStatus
    );

    return (
        <div className="container">
            <h1>All Achievements</h1>

            <div className="card">
                <h2>Achievement List</h2>
                <div className="form-group" style={{ maxWidth: '200px', marginBottom: '20px' }}>
                    <label htmlFor="filterStatus">Filter by Status:</label>
                    <select
                        id="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : filteredAchievements.length === 0 ? (
                    <Message variant="info">No achievements found with the selected filter.</Message>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Activity</th>
                                    <th>Student</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAchievements.map((achievement) => (
                                    <tr key={achievement._id}>
                                        <td>{achievement._id}</td>
                                        <td>{achievement.title}</td>
                                        <td>{achievement.activity?.name}</td>
                                        <td>{achievement.user?.name} ({achievement.user?.studentId})</td>
                                        <td>{formatDate(achievement.date)}</td>
                                        <td>
                                            <span className={`status-badge status-${achievement.status.toLowerCase()}`}>
                                                {achievement.status}
                                            </span>
                                        </td>
                                        <td className="action-buttons">
                                            <Link to={`/achievements/${achievement._id}`} className="btn btn-info">View</Link>
                                            <button onClick={() => handleDelete(achievement._id)} className="btn btn-danger" style={{ marginLeft: '5px' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllAchievementsPage;