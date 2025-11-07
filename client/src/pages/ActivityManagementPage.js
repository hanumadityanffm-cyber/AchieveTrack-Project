import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ActivityManagementPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newActivityName, setNewActivityName] = useState('');
    const [newActivityCategory, setNewActivityCategory] = useState('');
    const [newActivityDescription, setNewActivityDescription] = useState('');
    const [editActivityId, setEditActivityId] = useState(null);
    const [editActivityName, setEditActivityName] = useState('');
    const [editActivityCategory, setEditActivityCategory] = useState('');
    const [editActivityDescription, setEditActivityDescription] = useState('');
    const [creationLoading, setCreationLoading] = useState(false);
    const [creationError, setCreationError] = useState(null);

    const fetchActivities = async () => {
        try {
            const { data } = await API.get('/activities');
            setActivities(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const createActivityHandler = async (e) => {
        e.preventDefault();
        setCreationLoading(true);
        setCreationError(null);
        try {
            await API.post('/activities', {
                name: newActivityName,
                category: newActivityCategory,
                description: newActivityDescription,
            });
            setNewActivityName('');
            setNewActivityCategory('');
            setNewActivityDescription('');
            fetchActivities(); // Refresh list
        } catch (err) {
            setCreationError(err.response?.data?.message || err.message);
        } finally {
            setCreationLoading(false);
        }
    };

    const startEditHandler = (activity) => {
        setEditActivityId(activity._id);
        setEditActivityName(activity.name);
        setEditActivityCategory(activity.category);
        setEditActivityDescription(activity.description);
    };

    const updateActivityHandler = async (e) => {
        e.preventDefault();
        setCreationLoading(true); // Re-using for update state
        setCreationError(null);
        try {
            await API.put(`/activities/${editActivityId}`, {
                name: editActivityName,
                category: editActivityCategory,
                description: editActivityDescription,
            });
            setEditActivityId(null);
            fetchActivities();
        } catch (err) {
            setCreationError(err.response?.data?.message || err.message);
        } finally {
            setCreationLoading(false);
        }
    };

    const deleteActivityHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                await API.delete(`/activities/${id}`);
                fetchActivities(); // Refresh list
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="container">
            <h1>Activity Management</h1>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h2>{editActivityId ? 'Edit Activity' : 'Create New Activity'}</h2>
                {creationError && <Message variant="danger">{creationError}</Message>}
                <form onSubmit={editActivityId ? updateActivityHandler : createActivityHandler}>
                    <div className="form-group">
                        <label htmlFor="name">Activity Name</label>
                        <input
                            type="text"
                            id="name"
                            value={editActivityId ? editActivityName : newActivityName}
                            onChange={(e) => editActivityId ? setEditActivityName(e.target.value) : setNewActivityName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            value={editActivityId ? editActivityCategory : newActivityCategory}
                            onChange={(e) => editActivityId ? setEditActivityCategory(e.target.value) : setNewActivityCategory(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={editActivityId ? editActivityDescription : newActivityDescription}
                            onChange={(e) => editActivityId ? setEditActivityDescription(e.target.value) : setNewActivityDescription(e.target.value)}
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn" disabled={creationLoading}>
                        {creationLoading ? 'Processing...' : (editActivityId ? 'Update Activity' : 'Create Activity')}
                    </button>
                    {editActivityId && (
                        <button type="button" onClick={() => setEditActivityId(null)} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                            Cancel Edit
                        </button>
                    )}
                </form>
            </div>

            <div className="card">
                <h2>All Activities</h2>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : activities.length === 0 ? (
                    <Message variant="info">No activities found.</Message>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr key={activity._id}>
                                        <td>{activity._id}</td>
                                        <td>{activity.name}</td>
                                        <td>{activity.category}</td>
                                        <td>{activity.description}</td>
                                        <td className="action-buttons">
                                            <button onClick={() => startEditHandler(activity)} className="btn btn-warning">Edit</button>
                                            <button onClick={() => deleteActivityHandler(activity._id)} className="btn btn-danger">Delete</button>
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

export default ActivityManagementPage;