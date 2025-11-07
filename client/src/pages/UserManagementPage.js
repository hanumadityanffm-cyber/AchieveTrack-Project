import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Message from '../components/Message';
import Loader from '../components/Loader';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await API.get('/users');
                setUsers(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Future enhancement: Add functionality to delete/edit users
    // const deleteUserHandler = async (id) => {
    //     if (window.confirm('Are you sure you want to delete this user?')) {
    //         try {
    //             await API.delete(`/users/${id}`); // Assuming a DELETE /api/users/:id endpoint
    //             setUsers(users.filter(user => user._id !== id));
    //         } catch (err) {
    //             setError(err.response?.data?.message || err.message);
    //         }
    //     }
    // };

    return (
        <div className="container">
            <h1>User Management</h1>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : users.length === 0 ? (
                <Message variant="info">No users found.</Message>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Student ID</th>
                                {/* <th>Actions</th> Add actions here later */}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.studentId || 'N/A'}</td>
                                    {/* <td className="action-buttons">
                                        <button onClick={() => deleteUserHandler(user._id)} className="btn btn-danger">Delete</button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;