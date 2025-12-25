import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Trash2, AlertTriangle, Save, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function Settings() {
    const { token, logout } = useAuth();

    // Password State
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '' });
    const [loadingPass, setLoadingPass] = useState(false);

    // Delete Account State
    const [deletePass, setDeletePass] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);

    // Handle Password Change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoadingPass(true);
        try {
            await axios.put(`${API_URL}/api/auth/change-password`, passData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Password updated!");
            setPassData({ currentPassword: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data || "Failed to update password");
        } finally {
            setLoadingPass(false);
        }
    };

    // Handle Delete Account
    const handleDeleteAccount = async () => {
        if (!window.confirm("ARE YOU SURE? This will delete ALL your projects and data permanently.")) return;

        setLoadingDelete(true);
        try {
            // DELETE requests mein body bhejne ke liye 'data' key use karni padti hai
            await axios.delete(`${API_URL}/api/auth/delete-account`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { password: deletePass }
            });

            toast.success("Account deleted. Goodbye!");
            logout(); // Log user out immediately
        } catch (err) {
            toast.error(err.response?.data || "Failed to delete account");
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your developer account preferences.</p>
                </div>
                {/* Verification Status Badge */}
                <div style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: useAuth().user?.isVerified ? 'rgba(62, 207, 142, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                    border: `1px solid ${useAuth().user?.isVerified ? 'var(--color-success)' : 'var(--color-warning)'}`,
                    color: useAuth().user?.isVerified ? 'var(--color-success)' : 'var(--color-warning)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                }}>
                    {useAuth().user?.isVerified ? (
                        <>
                            <CheckCircle size={16} /> Verified
                        </>
                    ) : (
                        <>
                            <AlertTriangle size={16} /> Unverified
                            <button
                                onClick={() => window.location.href = '/verify-otp'}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    textDecoration: 'underline',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                    marginLeft: '5px',
                                    fontWeight: 'bold'
                                }}
                            >
                                Verify Now
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Change Password Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '8px', background: 'rgba(62, 207, 142, 0.1)', borderRadius: '6px' }}>
                        <Lock size={20} color="var(--color-primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Change Password</h3>
                </div>

                <form onSubmit={handlePasswordChange} style={{ maxWidth: '400px' }}>
                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={passData.currentPassword}
                            onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={passData.newPassword}
                            onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loadingPass}>
                        {loadingPass ? 'Updating...' : <><Save size={16} /> Update Password</>}
                    </button>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="card" style={{ border: '1px solid var(--color-danger)' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-danger)' }}>
                    <AlertTriangle size={20} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Danger Zone</h3>
                </div>

                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Deleting your account is irreversible. All your projects, API keys, and stored data will be permanently removed.
                </p>

                <div style={{ maxWidth: '400px' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--color-danger)' }}>Confirm Password to Delete</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter your password"
                            value={deletePass}
                            onChange={(e) => setDeletePass(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="btn btn-danger"
                        disabled={loadingDelete || !deletePass}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {loadingDelete ? 'Deleting...' : <><Trash2 size={16} /> Delete My Account</>}
                    </button>
                </div>
            </div>
        </div>
    );
}