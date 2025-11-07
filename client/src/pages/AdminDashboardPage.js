import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);


const AdminDashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalAdmins: 0,
        totalActivities: 0,
        totalAchievements: 0,
        pendingAchievements: 0,
        approvedAchievements: 0,
        rejectedAchievements: 0,
        activityDistribution: {},
        statusDistribution: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch users
                const { data: usersData } = await API.get('/users');
                const totalUsers = usersData.length;
                const totalStudents = usersData.filter(u => u.role === 'student').length;
                const totalAdmins = usersData.filter(u => u.role === 'admin').length;

                // Fetch activities
                const { data: activitiesData } = await API.get('/activities');
                const totalActivities = activitiesData.length;

                // Fetch all achievements (admin route)
                const { data: achievementsData } = await API.get('/achievements');
                const totalAchievements = achievementsData.length;
                const pendingAchievements = achievementsData.filter(a => a.status === 'Pending').length;
                const approvedAchievements = achievementsData.filter(a => a.status === 'Approved').length;
                const rejectedAchievements = achievementsData.filter(a => a.status === 'Rejected').length;

                // Activity distribution
                const activityDistribution = achievementsData.reduce((acc, achievement) => {
                    const activityName = achievement.activity?.name || 'Unknown';
                    acc[activityName] = (acc[activityName] || 0) + 1;
                    return acc;
                }, {});

                // Status distribution
                const statusDistribution = achievementsData.reduce((acc, achievement) => {
                    acc[achievement.status] = (acc[achievement.status] || 0) + 1;
                    return acc;
                }, {});

                setStats({
                    totalUsers,
                    totalStudents,
                    totalAdmins,
                    totalActivities,
                    totalAchievements,
                    pendingAchievements,
                    approvedAchievements,
                    rejectedAchievements,
                    activityDistribution,
                    statusDistribution
                });

            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchStats();
        } else {
            setLoading(false);
            setError("You are not authorized to view this page.");
        }
    }, [user]);

    const activityBarData = {
        labels: Object.keys(stats.activityDistribution),
        datasets: [
            {
                label: 'Achievements per Activity',
                data: Object.values(stats.activityDistribution),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const statusPieData = {
        labels: Object.keys(stats.statusDistribution),
        datasets: [
            {
                label: 'Achievement Status',
                data: Object.values(stats.statusDistribution),
                backgroundColor: [
                    'rgba(255, 206, 86, 0.6)', // Pending (Yellow)
                    'rgba(75, 192, 192, 0.6)', // Approved (Greenish-Blue)
                    'rgba(255, 99, 132, 0.6)',  // Rejected (Red)
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user?.name}! Here's an overview of the platform.</p>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div className="dashboard-metric" style={{ textAlign: 'center', padding: '15px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                            <h3>Total Users</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
                        </div>
                        <div className="dashboard-metric" style={{ textAlign: 'center', padding: '15px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                            <h3>Total Students</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalStudents}</p>
                        </div>
                        <div className="dashboard-metric" style={{ textAlign: 'center', padding: '15px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                            <h3>Total Activities</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalActivities}</p>
                        </div>
                        <div className="dashboard-metric" style={{ textAlign: 'center', padding: '15px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                            <h3>Pending Achievements</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{stats.pendingAchievements}</p>
                        </div>
                        <div className="dashboard-metric" style={{ textAlign: 'center', padding: '15px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                            <h3>Approved Achievements</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{stats.approvedAchievements}</p>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }}>
                        <h2>Data Visualization</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div className="chart-container" style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                                <h3>Achievements by Activity Type</h3>
                                {Object.keys(stats.activityDistribution).length > 0 ? (
                                    <Bar data={activityBarData} options={{ responsive: true, plugins: { legend: { position: 'top' }} }} />
                                ) : (
                                    <Message variant="info">No activity data to display.</Message>
                                )}
                            </div>
                            <div className="chart-container" style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                                <h3>Achievement Status Distribution</h3>
                                {Object.keys(stats.statusDistribution).length > 0 ? (
                                    <Pie data={statusPieData} options={{ responsive: true, plugins: { legend: { position: 'top' }} }} />
                                ) : (
                                    <Message variant="info">No status data to display.</Message>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2>Quick Links</h2>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
                            <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
                            <Link to="/admin/activities" className="btn btn-primary">Manage Activities</Link>
                            <Link to="/admin/achievements" className="btn btn-primary">Review Achievements</Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboardPage;