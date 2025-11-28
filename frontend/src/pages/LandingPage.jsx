import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, Shield, HardDrive, ArrowRight, CheckCircle, Code } from 'lucide-react';

function LandingPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-main)', fontFamily: 'system-ui, sans-serif' }}>

            {/* --- NAVBAR --- */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'absolute', // Navbar ko overlay banaya taaki Hero center rahe
                top: 0,
                left: 0,
                right: 0
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center' }}>
                    ur<span style={{ color: '#3ECF8E' }}>Backend</span>
                </div>
                <div>
                    {isAuthenticated ? (
                        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Dashboard</button>
                    ) : (
                        <Link to="/login" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Login</Link>
                    )}
                </div>
            </nav>

            {/* --- HERO SECTION (Minimalist & Centered) --- */}
            <header style={{
                minHeight: '90vh', /* Full screen feel */
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem',
                backgroundImage: 'radial-gradient(circle at center, rgba(62, 207, 142, 0.08) 0%, transparent 70%)' /* Subtle Glow */
            }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                    Welcome to ur<span style={{ color: '#3ECF8E' }}>Backend</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    The fastest way to build and manage your backend.
                    Instant APIs, Auth, and Storage for developers.
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {isAuthenticated ? (
                        <button
                            onClick={() => navigate('/docs')}
                            className="btn btn-primary"
                            style={{ padding: '10px 24px', fontSize: '1rem' }}
                        >
                            Read Docs <ArrowRight size={18} />
                        </button>
                    ) : (
                        <>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '1rem' }}>
                                Get Started Free
                            </Link>
                            <Link to="/docs" className="btn btn-secondary" style={{ padding: '10px 24px', fontSize: '1rem' }}>
                                Read Docs
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* --- DETAILS SECTION (Added Below) --- */}
            <section style={{ padding: '6rem 2rem', backgroundColor: '#111', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Everything you need to ship</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>A complete backend suite, ready in seconds.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <FeatureCard
                            icon={<Database color="#3ECF8E" />}
                            title="Instant Database"
                            desc="Define your schema visually and get instant REST APIs. No boilerplate code required."
                        />
                        <FeatureCard
                            icon={<Shield color="#3ECF8E" />}
                            title="Authentication"
                            desc="Built-in user management with secure JWT tokens. Sign up and login flows ready to use."
                        />
                        <FeatureCard
                            icon={<HardDrive color="#3ECF8E" />}
                            title="File Storage"
                            desc="Store images, videos, and documents securely. Manage assets directly from the dashboard."
                        />
                    </div>

                </div>
            </section>

            {/* --- DEVELOPER EXPERIENCE --- */}
            <section style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Built for Developers</h2>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <ListItem text="Simple & Intuitive Dashboard" />
                        <ListItem text="Auto-generated API Documentation" />
                        <ListItem text="Secure by Default" />
                        <ListItem text="Open Source & Self Hostable" />
                    </ul>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: '#000', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                        <Code size={20} color="#3ECF8E" />
                        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#ccc' }}>Client-side Example</span>
                    </div>
                    <pre style={{ fontFamily: 'monospace', color: '#888', fontSize: '0.85rem', overflowX: 'auto' }}>
                        <span style={{ color: '#c678dd' }}>const</span> res = <span style={{ color: '#c678dd' }}>await</span> fetch(<span style={{ color: '#98c379' }}>'/api/data/users'</span>);<br />
                        <span style={{ color: '#c678dd' }}>const</span> users = <span style={{ color: '#c678dd' }}>await</span> res.json();<br /><br />
                        <span style={{ color: '#5c6370' }}>// Result:</span><br />
                        [<br />
                        &nbsp;&nbsp;{`{ id: 1, name: "Alice", role: "admin" }`},<br />
                        &nbsp;&nbsp;{`{ id: 2, name: "Bob", role: "user" }`}<br />
                        ]
                    </pre>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer style={{ textAlign: 'center', padding: '3rem', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                <p>&copy; 2025 urBackend. All rights reserved.</p>
            </footer>
        </div>
    );
}

// Helper Components
function FeatureCard({ icon, title, desc }) {
    return (
        <div style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ marginBottom: '1rem', background: 'rgba(62, 207, 142, 0.1)', width: 'fit-content', padding: '12px', borderRadius: '8px' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>{title}</h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>{desc}</p>
        </div>
    );
}

function ListItem({ text }) {
    return (
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-main)', fontSize: '1rem' }}>
            <CheckCircle size={18} color="#3ECF8E" /> {text}
        </li>
    );
}

export default LandingPage;