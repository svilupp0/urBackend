import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import Auth Context
import { API_URL } from '../config';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // 2. Get login function

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Email and password are required!');
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('Logging in...');

        try {
            // Note: Ngrok se access karte waqt localhost API shayad issue kare agar device alag ho.
            // Lekin agar same PC par browser hai to chalega.
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);

            const { token } = response.data;
            console.log("Login Success! Token:", token);

            // Helper to decode JWT
            const parseJwt = (token) => {
                try {
                    return JSON.parse(atob(token.split('.')[1]));
                } catch (e) {
                    return null;
                }
            };

            const decoded = parseJwt(token);
            const isVerified = decoded?.isVerified;

            // 3. Save Token & User via Context
            login({ email: formData.email, isVerified }, token);

            toast.dismiss(loadingToast);
            toast.success("Welcome back!");

            // Redirect to Dashboard
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            toast.dismiss(loadingToast);
            const data = err.response?.data;
            let errorMessage = 'Login failed. Check your credentials.';

            if (data?.error) {
                if (typeof data.error === 'string') {
                    errorMessage = data.error;
                } else if (Array.isArray(data.error)) {
                    errorMessage = data.error[0]?.message || 'Validation failed';
                }
            }

            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    // --- STYLES ---
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '1rem'
    };

    const formBoxStyle = { width: '100%', maxWidth: '400px' };

    return (
        <div style={containerStyle}>
            <div className="card" style={formBoxStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.5rem', fontWeight: 600 }}>
                    Developer Login
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            placeholder="Email Address"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '10px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;