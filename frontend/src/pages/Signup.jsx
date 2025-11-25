import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    // 1. State for form data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await axios.post('http://localhost:1234/api/auth/register', formData);

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

    // --- Styles ab hum CSS variables se lenge ---
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        // Background color ab body se aayega, yahan hataya
    };

    const formBoxStyle = {
        width: '100%',
        maxWidth: '400px',
        // 'card' class baaki styles sambhal legi (bg color, border, padding)
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)', // Dark subtle border
        backgroundColor: 'var(--color-bg-main)', // Dark input background
        color: 'var(--color-text-main)', // Light text
        boxSizing: 'border-box',
        marginBottom: '15px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: 'var(--color-text-main)' // Light text for label
    };

    return (
        <div className="auth-container" style={containerStyle}>
            {/* 'card' class use ki taaki dark theme wala card style apply ho */}
            <div className="card" style={formBoxStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Developer Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {/* 'btn btn-primary' class use ki taaki green button bane */}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign Up</button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}

// Purana 'styles' object hata diya hai kyunki ab hum variables use kar rahe hain.

export default Signup;