import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, Trash2, User, Search, Mail } from 'lucide-react';
import { API_URL } from '../config';


export default function Auth() {
    const { projectId } = useParams();
    const { token } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Fetch Users (We fetch from the 'users' collection internally)
    const fetchUsers = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/projects/${projectId}/collections/users/data`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchUsers();
    }, [projectId, token]);

    // 2. Delete User
    const handleDelete = async (id) => {
        if (!confirm("Delete this user permanently? They won't be able to login.")) return;

        try {
            await axios.delete(
                `${API_URL}/api/projects/${projectId}/collections/users/data/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.filter(user => user._id !== id));
            toast.success("User deleted");
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    // Filter Users
    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="container">Loading Users...</div>;

    return (
        <div className="container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Authentication</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your application's users.</p>
                </div>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search by email or ID"
                        className="input-field"
                        style={{ paddingLeft: '35px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {users.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <Shield size={48} style={{ opacity: 0.3, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem auto' }} />
                        <p>No users registered yet.</p>
                        <small>Users will appear here when they sign up via your API.</small>
                    </div>
                ) : (
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-bg-sidebar)' }}>
                                <th style={{ width: '50px' }}></th>
                                <th>Email</th>
                                <th>User ID</th>
                                <th>Created At</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} color="#aaa" />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                                            {user.email}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                                            {user._id}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="btn btn-ghost"
                                            style={{ color: 'var(--color-danger)', padding: '6px' }}
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}