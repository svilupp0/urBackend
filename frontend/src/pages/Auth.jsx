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
    // 1. Fetch Users (We fetch from the 'users' collection internally)
    useEffect(() => {
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
        } catch {
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
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            {/* Header */}
            <div className="page-header" style={{ marginBottom: '2.5rem', borderBottom: 'none' }}>
                <div>
                    <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={28} color="var(--color-primary)" /> Authentication
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Manage users who have signed up for your project.</p>
                </div>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search by email or ID"
                        className="input-field"
                        style={{ paddingLeft: '40px', background: 'var(--color-bg-input)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
                {users.length === 0 ? (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--color-bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                            <Shield size={32} style={{ opacity: 0.5, color: 'var(--color-text-muted)' }} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>No users found</h3>
                        <p style={{ maxWidth: '300px', margin: '0 auto' }}>Users will appear here once they register via your API.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-bg-input)', borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '16px', textAlign: 'center', width: '60px' }}></th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>Email</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>User ID</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>Created At</th>
                                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="user-row" style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #111)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid var(--color-border)' }}>
                                                <User size={16} color="#aaa" />
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: 500, color: 'var(--color-text-main)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Mail size={14} color="var(--color-text-muted)" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-input)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                                                {user._id}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="btn btn-ghost"
                                                style={{ color: '#ef4444', padding: '8px', borderRadius: '6px' }}
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                .user-row:hover {
                    background-color: var(--color-bg-input);
                }
                .user-row:last-child {
                    border-bottom: none;
                }
            `}</style>
        </div>
    );
}