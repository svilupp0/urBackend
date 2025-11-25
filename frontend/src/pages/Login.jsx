import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Email and password are required!');
            return;
        }

        const loadingToast = toast.loading('Logging in...');

        try {
            const response = await axios.post('http://localhost:1234/api/auth/login', formData);
            const { token } = response.data;

            // Placeholder user data until we have a profile API endpoint for devs
            login({ email: formData.email }, token);

            toast.dismiss(loadingToast);
            toast.success("Welcome back!");

            navigate('/dashboard');

        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMessage = err.response?.data || 'Login failed. Please check credentials.';
            toast.error(errorMessage);
        }
    };

    // --- Styles updated for Dark Theme ---
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        // Background handles by global body style
    };

    const formBoxStyle = {
        width: '100%',
        maxWidth: '400px',
        // 'card' class handles bg, border, padding
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-main)', // Dark bg
        color: 'var(--color-text-main)', // Light text
        boxSizing: 'border-box',
        marginBottom: '15px'
    };

    return (
        <div style={containerStyle}>
            {/* Added 'card' class */}
            <div className="card" style={formBoxStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Developer Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                    {/* Added 'btn btn-primary' classes */}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;