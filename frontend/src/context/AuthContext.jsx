import { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../config';

// 1. Create the Context object
const AuthContext = createContext(null);

// 2. Create the Provider component (Wraps the whole app)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user details like ID, email
    const [token, setToken] = useState(localStorage.getItem('devToken') || null); // Stores JWT
    const [loading, setLoading] = useState(true); // To show loading spinner while checking localstorage

    // Check localStorage on initial load (Page Refresh)
    useEffect(() => {
        const storedToken = localStorage.getItem('devToken');
        const storedUser = localStorage.getItem('devUser');

        if (storedToken && storedUser) {
            setToken(storedToken);
            // We parse the stringified user object back to JSON
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user data");
                logout(); // Clear invalid data
            }
        }
        setLoading(false); // Finished checking
    }, []);

    // Function to run on successful login/signup
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        // Save to browser storage
        localStorage.setItem('devToken', authToken);
        // Save user details as string
        localStorage.setItem('devUser', JSON.stringify(userData));
    };

    // Function to run on logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('devToken');
        localStorage.removeItem('devUser');
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token, // True if token exists
    };

    // Don't render anything until we check localStorage
    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use auth easily in other components
export const useAuth = () => {
    return useContext(AuthContext);
};