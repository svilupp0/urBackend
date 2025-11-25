import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
            // Make API call to backend login endpoint
            // Note: Ensure your backend is running on port 1234
            const response = await axios.post('http://localhost:1234/api/auth/login', formData);

            // Extract token from response
            const { token } = response.data;
            console.log("Login Success! Token:", token);

            // --- TEMPORARY: Day 8 में हम इसे Auth Context में डालेंगे ---
            toast.dismiss(loadingToast);
            toast.success("Welcome back!");

            // Redirect to Dashboard
            navigate('/dashboard');

        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMessage = err.response?.data || 'Login failed. Check your credentials.';
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    // --- STYLES (Dark Theme) ---
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '1rem'
    };

    const formBoxStyle = { width: '100%', maxWidth: '400px' };

    // labelStyle हटा दिया गया है क्योंकि अब इसकी जरूरत नहीं है

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-main)',
        color: 'var(--color-text-main)',
        boxSizing: 'border-box',
        // marginBottom यहाँ से हटाकर कंटेनर div में रखा है ताकि स्पेसिंग सही रहे
    };

    return (
        <div style={containerStyle}>
            <div className="card" style={formBoxStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.5rem' }}>
                    Developer Login
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        {/* Label हटा दिया गया */}
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email Address"  // प्लेसहोल्डर को थोड़ा अपडेट किया
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        {/* Label हटा दिया गया */}
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password" // प्लेसहोल्डर को थोड़ा अपडेट किया
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;