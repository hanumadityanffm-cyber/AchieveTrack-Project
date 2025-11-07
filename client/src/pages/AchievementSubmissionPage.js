import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AchievementSubmissionPage = () => {
    const [activities, setActivities] = useState([]);
    const [activity, setActivity] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [proof, setProof] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activitiesLoading, setActivitiesLoading] = useState(true);
    const [activitiesError, setActivitiesError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const { data } = await API.get('/activities');
                setActivities(data);
                if (data.length > 0) {
                    setActivity(data[0]._id); // Set default activity
                }
            } catch (err) {
                setActivitiesError(err.response?.data?.message || err.message);
            } finally {
                setActivitiesLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('activity', activity);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date.toISOString()); // Send as ISO string
        if (proof) {
            formData.append('proof', proof);
        }

        try {
            await API.post('/achievements', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage({ type: 'success', text: 'Achievement submitted for review!' });
            navigate('/my-achievements'); // Redirect to user's achievements page
        } catch (error) {
            setMessage({ type: 'danger', text: error.response?.data?.message || error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '700px', margin: '50px auto' }}>
                <h2>Submit New Achievement</h2>
                {message && <Message variant={message.type}>{message.text}</Message>}
                {activitiesLoading ? (
                    <Loader />
                ) : activitiesError ? (
                    <Message variant="danger">{activitiesError}</Message>
                ) : activities.length === 0 ? (
                    <Message variant="info">No activities available. Please contact an admin.</Message>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="activity">Activity</label>
                            <select
                                id="activity"
                                value={activity}
                                onChange={(e) => setActivity(e.target.value)}
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
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date of Achievement</label>
                            <DatePicker
                                selected={date}
                                onChange={(d) => setDate(d)}
                                dateFormat="MMMM d, yyyy"
                                className="form-control" // Apply base form control styles
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="proof">Upload Proof (Certificate, Image, PDF)</label>
                            <input
                                type="file"
                                id="proof"
                                onChange={(e) => setProof(e.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Achievement'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AchievementSubmissionPage;