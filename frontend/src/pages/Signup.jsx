import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

function Signup() {
    // 1. State for form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '' // Added name field
    });

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        // Basic validation
        if (!formData.email || !formData.password) {
            toast.error('Email and password are required!');
            return;
        }

        const loadingToast = toast.loading('Creating account...');

        try {
            // Make API call to your backend
            // Note: Ensure your backend is running on port 1234
            const response = await axios.post(`${API_URL}/api/auth/register`, formData);

            toast.dismiss(loadingToast);
            toast.success(response.data); // "Registered successfully"

            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMessage = err.response?.data || 'Signup failed. Please try again.';
            toast.error(errorMessage);
        }
    };

    // --- STYLES (Dark Theme - No Labels) ---
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '1rem'
    };

    const formBoxStyle = {
        width: '100%',
        maxWidth: '400px',
    };

    // labelStyle हटा दिया गया है

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-main)',
        color: 'var(--color-text-main)',
        boxSizing: 'border-box',
        // marginBottom हटा दिया, अब कंटेनर div स्पेसिंग संभालेगा
    };

    return (
        <div className="auth-container" style={containerStyle}>
            <div className="card" style={formBoxStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.5rem' }}>Developer Signup</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Input - No Label */}
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Full Name (Optional)" // प्लेसहोल्डर अपडेट किया
                        />
                    </div>

                    {/* Email Input - No Label */}
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Email Address" // प्लेसहोल्डर अपडेट किया
                            required
                        />
                    </div>

                    {/* Password Input - No Label */}
                    <div style={{ marginBottom: '25px' }}>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Password (min 6 chars)" // प्लेसहोल्डर अपडेट किया
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Sign Up</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;