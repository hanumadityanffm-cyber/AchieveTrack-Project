import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import formatDate from '../utils/formatDate';

const AchievementDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const [achievement, setAchievement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [activities, setActivities] = useState([]);
    const [editActivity, setEditActivity] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDate, setEditDate] = useState(new Date());
    const [editProof, setEditProof] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [statusChangeLoading, setStatusChangeLoading] = useState(false);
    const [statusChangeError, setStatusChangeError] = useState(null);

    const fetchAchievement = async () => {
        try {
            const { data } = await API.get(`/achievements/${id}`);
            setAchievement(data);
            setEditActivity(data.activity?._id || '');
            setEditTitle(data.title);
            setEditDescription(data.description);
            // --- THIS IS THE CORRECTED LINE ---
            setEditDate(new Date(data.date)); 
            // ----------------------------------
            setNewStatus(data.status);
            setAdminNotes(data.adminNotes || '');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            const { data } = await API.get('/activities');
            setActivities(data);
        } catch (err) {
            console.error("Failed to fetch activities:", err);
        }
    };

    useEffect(() => {
        fetchAchievement();
        fetchActivities();
    }, [id]);


    const handleUpdateAchievement = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError(null);

        const formData = new FormData();
        formData.append('activity', editActivity);
        formData.append('title', editTitle);
        formData.append('description', editDescription);
        formData.append('date', editDate.toISOString());
        if (editProof) {
            formData.append('proof', editProof);
        }

        try {
            await API.put(`/achievements/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setEditMode(false);
            fetchAchievement();
        } catch (err) {
            setEditError(err.response?.data?.message || err.message);
        } finally {
            setEditLoading(false);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setStatusChangeLoading(true);
        setStatusChangeError(null);
        try {
            await API.put(`/achievements/${id}/status`, { status: newStatus, adminNotes });
            fetchAchievement(); // Refresh achievement details
            // Optional: Redirect admin to all achievements page
        } catch (err) {
            setStatusChangeError(err.response?.data?.message || err.message);
        } finally {
            setStatusChangeLoading(false);
        }
    };

    const handleDeleteAchievement = async () => {
        if (window.confirm('Are you sure you want to delete this achievement?')) {
            try {
                await API.delete(`/achievements/${id}`);
                navigate(isAdmin ? '/admin/achievements' : '/my-achievements');
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!achievement) return <Message variant="info">Achievement not found.</Message>;

    const isOwner = user && achievement.user?._id === user._id;
    const canEditStudent = isOwner && achievement.status === 'Pending';
    const canEditAdmin = isAdmin;

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '800px', margin: '50px auto' }}>
                <h2>Achievement Details</h2>
                {editError && <Message variant="danger">{editError}</Message>}
                {statusChangeError && <Message variant="danger">{statusChangeError}</Message>}

                {!editMode ? (
                    <div className="achievement-details">
                        <p><strong>Title:</strong> {achievement.title}</p>
                        <p><strong>Activity:</strong> {achievement.activity?.name} ({achievement.activity?.category})</p>
                        <p><strong>Description:</strong> {achievement.description}</p>
                        <p><strong>Date:</strong> {formatDate(achievement.date)}</p>
                        <p><strong>Status:</strong> <span className={`status-badge status-${achievement.status.toLowerCase()}`}>{achievement.status}</span></p>
                        {achievement.adminNotes && <p><strong>Admin Notes:</strong> {achievement.adminNotes}</p>}
                        {achievement.proof && (
                            <p>
                                <strong>Proof:</strong> <a href={`http://localhost:5000${achievement.proof}`} target="_blank" rel="noopener noreferrer">View Proof</a>
                            </p>
                        )}
                        <p><strong>Submitted by:</strong> {achievement.user?.name} ({achievement.user?.role})</p>
                        <p><strong>Student ID:</strong> {achievement.user?.studentId || 'N/A'}</p>

                        <div style={{ marginTop: '20px' }}>
                            {canEditStudent && (
                                <button onClick={() => setEditMode(true)} className="btn btn-warning">Edit Achievement</button>
                            )}
                            {(canEditStudent || canEditAdmin) && (
                                <button onClick={handleDeleteAchievement} className="btn btn-danger" style={{ marginLeft: '10px' }}>Delete Achievement</button>
                            )}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateAchievement}>
                        <h3>Edit Achievement</h3>
                        <div className="form-group">
                            <label htmlFor="editActivity">Activity</label>
                            <select
                                id="editActivity"
                                value={editActivity}
                                onChange={(e) => setEditActivity(e.target.value)}
                                required
                            >
                                {activities.map((act) => (
                                    <option key={act._id} value={act._id}>
                                        {act.name} ({act.category})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="editTitle">Title</label>
                            <input
                                type="text"
                                id="editTitle"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editDescription">Description</label>
                            <textarea
                                id="editDescription"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="editDate">Date of Achievement</label>
                            <DatePicker
                                selected={editDate}
                                onChange={(d) => setEditDate(d)}
                                dateFormat="MMMM d, yyyy"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editProof">Update Proof (optional)</label>
                            <input
                                type="file"
                                id="editProof"
                                onChange={(e) => setEditProof(e.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="btn" disabled={editLoading}>
                            {editLoading ? 'Updating...' : 'Update Achievement'}
                        </button>
                        <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                            Cancel
                        </button>
                    </form>
                )}

                {isAdmin && !editMode && (
                    <div className="card" style={{ marginTop: '30px' }}>
                        <h3>Admin Actions: Update Status</h3>
                        <form onSubmit={handleUpdateStatus}>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="adminNotes">Admin Notes (Optional)</label>
                                <textarea
                                    id="adminNotes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows="2"
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={statusChangeLoading}>
                                {statusChangeLoading ? 'Updating...' : 'Update Status'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementDetailsPage;