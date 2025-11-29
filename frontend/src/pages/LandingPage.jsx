import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Database,
    Shield,
    HardDrive,
    ArrowRight,
    CheckCircle,
    Zap,
    Lock,
    Layout,
    ChevronDown,
    Menu, // Hamburger Icon
    X     // Close Icon
} from 'lucide-react';

function LandingPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-main)', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>

            {/* --- NAVBAR --- */}
            <nav className="navbar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {/* LOGO */}
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/logo_u.png" alt="urBackend Logo" style={{ height: '32px', width: 'auto' }} />
                        <span>ur<span style={{ color: 'var(--color-primary)' }}>Backend</span></span>
                    </div>

                    {/* DESKTOP MENU */}
                    <div className="desktop-menu" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How it Works</a>
                        {isAuthenticated ? (
                            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Go to Dashboard</button>
                        ) : (
                            <Link to="/login" className="login-link">Login</Link>
                        )}
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu-dropdown">
                        <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
                        {isAuthenticated ? (
                            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ width: '100%' }}>Go to Dashboard</button>
                        ) : (
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textAlign: 'center', display: 'block', padding: '10px', color: '#fff', fontWeight: 600 }}>Login</Link>
                        )}
                    </div>
                )}
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="hero-section">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <span className="hero-badge">
                        🚀 The Fastest Backend for Frontend Devs
                    </span>
                    <h1 className="hero-title">
                        Build your backend <br /> in <span style={{ color: 'var(--color-primary)', WebkitTextFillColor: 'var(--color-primary)' }}>seconds</span>.
                    </h1>
                    <p className="hero-desc">
                        Stop writing boilerplate. Get an instant Database, Authentication, and Storage API for your next big idea.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {isAuthenticated ? (
                            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                                Go to Console <ArrowRight size={20} />
                            </button>
                        ) : (
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                                Start Building for Free
                            </Link>
                        )}
                        <Link to="/docs" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                            Read Documentation
                        </Link>
                    </div>

                    <div style={{ marginTop: '4rem', color: '#555', fontSize: '0.9rem' }}>
                        <p>Trusted by Me Building:</p>

                        <div className="trusted-by">
                            <span>⚛️ React Apps</span>
                            <span>📱 Mobile Apps</span>
                            <span>💻 Websites</span>
                            <span>🛠️ Internal Tools</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- HOW IT WORKS --- */}
            <section id="how-it-works" style={{ padding: '6rem 2rem', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 700, marginBottom: '4rem' }}>
                        From Idea to API in 3 Steps
                    </h2>

                    <div className="steps-grid">
                        <StepCard
                            number="01"
                            title="Create Project"
                            desc="Name your project and get instant API keys. We set up a dedicated MongoDB isolation for you."
                        />
                        <StepCard
                            number="02"
                            title="Define Schema"
                            desc="Use our visual table builder. Add fields like String, Number, Boolean. No SQL needed."
                        />
                        <StepCard
                            number="03"
                            title="Fetch Data"
                            desc="Call your new API endpoints directly from your frontend code. It's that simple."
                        />
                    </div>
                </div>
            </section>

            {/* --- FEATURE DEEP DIVE --- */}
            <section id="features" style={{ padding: '6rem 2rem', backgroundColor: '#0d0d0d' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Feature 1: Database */}
                    <div className="feature-row">
                        <div className="feature-text">
                            <div className="icon-box"><Database color="var(--color-primary)" /></div>
                            <h2 className="feature-title">Instant NoSQL Database</h2>
                            <p className="feature-desc">
                                Forget about setting up servers or connecting to clusters. Create collections and start pushing JSON data immediately.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <ListItem text="Visual Schema Builder" />
                                <ListItem text="RESTful API Endpoints (GET, POST, DELETE)" />
                                <ListItem text="Automatic ID & Timestamp injection" />
                            </ul>
                        </div>
                        <div className="feature-visual">
                            <div className="code-window">
                                <div className="code-header"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span></div>
                                <pre>
                                    <span className="keyword">await</span> axios.<span className="func">post</span>(<span className="str">'/api/data/products'</span>, {'{'}
                                    {"\n"}  name: <span className="str">"MacBook Pro"</span>,
                                    {"\n"}  price: <span className="num">1299</span>,
                                    {"\n"}  inStock: <span className="bool">true</span>
                                    {"\n"}{'}'});
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Auth */}
                    <div className="feature-row reverse">
                        <div className="feature-visual">
                            <div className="code-window">
                                <div className="code-header"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span></div>
                                <pre>
                                    <span className="comment">// Login User</span>
                                    {"\n"}<span className="keyword">const</span> res = <span className="keyword">await</span> api.<span className="func">post</span>(<span className="str">'/auth/login'</span>, creds);
                                    {"\n"}<span className="keyword">const</span> token = res.data.<span className="prop">token</span>;
                                </pre>
                            </div>
                        </div>
                        <div className="feature-text">
                            <div className="icon-box"><Shield color="var(--color-primary)" /></div>
                            <h2 className="feature-title">Authentication Ready-to-go</h2>
                            <p className="feature-desc">
                                Secure your app with built-in JWT authentication. We handle the hashing, tokens, and sessions.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <ListItem text="Sign Up & Login Endpoints" />
                                <ListItem text="Secure BCrypt Password Hashing" />
                                <ListItem text="JWT Token based sessions" />
                            </ul>
                        </div>
                    </div>

                    {/* Feature 3: Storage */}
                    <div className="feature-row">
                        <div className="feature-text">
                            <div className="icon-box"><HardDrive color="var(--color-primary)" /></div>
                            <h2 className="feature-title">Cloud File Storage</h2>
                            <p className="feature-desc">
                                Upload user avatars, documents, or media files. We give you a public URL to use in your frontend.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <ListItem text="Simple Multipart Upload" />
                                <ListItem text="Image & Document Support" />
                                <ListItem text="Public CDN Links" />
                            </ul>
                        </div>
                        <div className="feature-visual">
                            {/* Visual Representation of Files */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="file-card">
                                    <div style={{ height: '100px', background: '#333', borderRadius: '4px', marginBottom: '10px' }}></div>
                                    <div style={{ height: '10px', width: '80%', background: '#444', borderRadius: '4px' }}></div>
                                </div>
                                <div className="file-card">
                                    <div style={{ height: '100px', background: '#333', borderRadius: '4px', marginBottom: '10px' }}></div>
                                    <div style={{ height: '10px', width: '60%', background: '#444', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- COMPARISON / WHY US --- */}
            <section style={{ padding: '6rem 2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Why choose urBackend?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <InfoCard icon={<Zap />} title="Lightning Fast" desc="Built on Node.js and Optimized MongoDB queries for low latency." />
                        <InfoCard icon={<Lock />} title="Secure by Design" desc="Your data is isolated. API keys and JWTs ensure only authorized access." />
                        <InfoCard icon={<Layout />} title="Developer UI" desc="A clean, dark-mode dashboard to manage your data visually." />
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section style={{ padding: '6rem 2rem', backgroundColor: '#111' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <FAQItem question="Is it free to use?" answer="Yes! You can create unlimited projects and collections for free during our beta period." />
                        <FAQItem question="Can I use this for production?" answer="While we are stable, we recommend urBackend for side-projects, hackathons, and MVPs initially." />
                        <FAQItem question="How do I connect from React?" answer="Simply use the fetch API or Axios to hit our endpoints. Check the Docs page for copy-paste examples." />
                    </div>
                </div>
            </section>

            {/* --- CTA FOOTER --- */}
            <footer style={{ padding: '6rem 2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Ready to ship your next app?</h2>
                <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '1.2rem' }}>Join developers building faster with urBackend.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/signup" className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1rem' }}>Get Started Now</Link>
                </div>
                <div style={{ marginTop: '4rem', color: '#444', fontSize: '0.8rem' }}>
                    &copy; 2025 urBackend. Made for builders.
                </div>
            </footer>

            {/* --- RESPONSIVE CSS STYLES --- */}
            <style>{`
                /* NAVBAR */
                .navbar {
                    display: flex;
                    flex-direction: column;
                    padding: 1.2rem 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    backdrop-filter: blur(10px);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(22, 22, 22, 0.8);
                }
                .nav-link { color: #aaa; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
                .nav-link:hover { color: #fff; }
                .login-link { color: #fff; text-decoration: none; font-weight: 600; }
                
                .mobile-menu-btn { display: none; background: none; border: none; color: #fff; cursor: pointer; }
                .mobile-menu-dropdown { display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem 0; background: #161616; border-top: 1px solid #333; width: 100%; animation: slideDown 0.3s ease; }
                .mobile-menu-dropdown a { color: #fff; text-decoration: none; font-size: 1.1rem; }

                /* HERO */
                .hero-section { padding: 8rem 2rem 6rem; text-align: center; background-image: radial-gradient(circle at 50% 30%, rgba(62, 207, 142, 0.15) 0%, transparent 60%); }
                .hero-badge { background-color: rgba(62, 207, 142, 0.1); color: var(--color-primary); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; display: inline-block; }
                .hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; background: linear-gradient(to right, #fff, #aaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .hero-desc { font-size: 1.25rem; color: var(--color-text-muted); margin-bottom: 3rem; line-height: 1.6; }
                .trusted-by { display: flex; gap: 20px; justifyContent: center; margin-top: 10px; opacity: 0.7; flex-wrap: wrap; }

                /* STEPS */
                .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }

                /* FEATURES */
                .feature-row { display: flex; align-items: center; gap: 4rem; margin-bottom: 6rem; flex-wrap: wrap; }
                .feature-text { flex: 1; }
                .feature-visual { flex: 1; min-width: 300px; }
                .icon-box { background: rgba(62, 207, 142, 0.1); width: fit-content; padding: 12px; border-radius: 12px; margin-bottom: 1rem; }
                .feature-title { font-size: 2.2rem; margin-bottom: 1rem; margin-top: 1rem; }
                .feature-desc { color: #888; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }

                /* CODE WINDOW (Responsive) */
                .code-window {
                    background: #1e1e1e;
                    border-radius: 8px;
                    padding: 20px;
                    border: 1px solid #333;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    overflow-x: auto; /* KEY FIX for responsiveness */
                    width: 100%;
                }
                .code-header { display: flex; gap: 6px; margin-bottom: 15px; }
                .dot { width: 10px; height: 10px; border-radius: 50%; }
                .red { background: #ff5f56; }
                .yellow { background: #ffbd2e; }
                .green { background: #27c93f; }
                
                pre { font-family: monospace; font-size: 0.9rem; color: #fff; margin: 0; white-space: pre; } /* Keep indentation */
                .keyword { color: #c678dd; }
                .func { color: #61afef; }
                .str { color: #98c379; }
                .num { color: #d19a66; }
                .bool { color: #d19a66; }
                .comment { color: #5c6370; }
                .prop { color: #e06c75; }
                .file-card { background: #1a1a1a; padding: 10px; border-radius: 8px; border: 1px solid #333; }

                /* MEDIA QUERIES */
                @media (max-width: 768px) {
                    .desktop-menu { display: none !important; }
                    .mobile-menu-btn { display: block; }
                    
                    .hero-title { font-size: 2.5rem; }
                    .hero-desc { font-size: 1rem; }
                    .feature-row { flex-direction: column; gap: 2rem; }
                    .feature-row.reverse { flex-direction: column-reverse; } /* Maintain flow on mobile */
                    
                    .feature-title { font-size: 1.8rem; }
                    .trusted-by { gap: 15px; font-size: 0.85rem; }
                    .code-window { padding: 15px; }
                    
                    section { padding: 4rem 1.5rem !important; }
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

// --- SUB COMPONENTS ---

function StepCard({ number, title, desc }) {
    return (
        <div className="card" style={{ position: 'relative', paddingTop: '3rem', border: '1px solid #222', background: 'linear-gradient(180deg, #161616 0%, #111 100%)' }}>
            <div style={{
                position: 'absolute', top: '-20px', left: '20px',
                fontSize: '4rem', fontWeight: 800, color: '#222', zIndex: 0
            }}>
                {number}
            </div>
            <h3 style={{ position: 'relative', zIndex: 1, fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
            <p style={{ position: 'relative', zIndex: 1, color: '#888', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function ListItem({ text }) {
    return (
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ddd', fontSize: '1.1rem', marginBottom: '12px' }}>
            <CheckCircle size={20} color="var(--color-primary)" /> {text}
        </li>
    );
}

function InfoCard({ icon, title, desc }) {
    return (
        <div style={{ padding: '2rem', borderRadius: '8px', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <div style={{ marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', justifyContent: 'center' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>{desc}</p>
        </div>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            style={{
                borderBottom: '1px solid #333',
                padding: '1.5rem 0',
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 500 }}>{question}</h4>
                <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} color="#666" />
            </div>
            {isOpen && <p style={{ marginTop: '1rem', color: '#888', lineHeight: '1.6' }}>{answer}</p>}
        </div>
    );
}

export default LandingPage;