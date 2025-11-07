import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user, login, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
        }
    }, [user, navigate, isAdmin]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const { data } = await API.post('/users/login', { email, password });
            login(data);
            navigate(data.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
                <h2>Login</h2>
                {message && <Message variant="danger">{message}</Message>}
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;