import { useState, useEffect } from 'react';
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
    Menu,
    X,
    Code,
    Server,
    Globe,
    Play,
    Terminal,
    Box,
    Layers,
    Smartphone,
    Globe as GlobeIcon,
    Cpu,
    Activity,
    HelpCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Footer from '../components/Layout/Footer';

function LandingPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Simulated API Response State
    const [apiResponse, setApiResponse] = useState(null);
    const [isLoadingDemo, setIsLoadingDemo] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const runDemo = () => {
        setIsLoadingDemo(true);
        setApiResponse(null);
        setTimeout(() => {
            setApiResponse({
                status: 200,
                data: [
                    { id: "usr_1", name: "Alice", role: "admin" },
                    { id: "usr_2", name: "Bob", role: "developer" }
                ],
                time: "14ms"
            });
            setIsLoadingDemo(false);
        }, 800);
    };

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="landing-page">
            <style>{`
                /* --- LANDING SPECIFIC STYLES --- */
                .landing-page {
                    background-color: #050505;
                    color: #fff;
                    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    overflow-x: hidden;
                    letter-spacing: -0.01em;
                }

                /* GRID BACKGROUND */
                .grid-bg {
                    background-size: 40px 40px;
                    background-image:
                        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    mask-image: radial-gradient(circle at 50% 0%, black 40%, transparent 100%);
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 120vh;
                    z-index: 0;
                    pointer-events: none;
                }

                /* NAVBAR */
                .nav-glass {
                    background: rgba(5, 5, 5, 0.8);
                    backdrop-filter: blur(16px);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    transition: all 0.3s ease;
                }
                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                }

                /* TEXT GRADIENTS & UTILS */
                .text-gradient {
                    background: linear-gradient(135deg, #fff 0%, #888 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .text-gradient-primary {
                    background: linear-gradient(135deg, #3ECF8E 0%, #34B27B 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .section-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.02em;
                }
                .section-desc {
                    font-size: 1.1rem;
                    color: #888;
                    line-height: 1.6;
                    max-width: 700px;
                    margin: 0 auto;
                }

                /* HERO */
                .hero-section {
                    position: relative;
                    padding-top: 8rem;
                    padding-bottom: 8rem;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .hero-pill {
                    background: rgba(62, 207, 142, 0.1);
                    color: #3ECF8E;
                    border: 1px solid rgba(62, 207, 142, 0.2);
                    padding: 6px 16px;
                    border-radius: 99px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    margin-bottom: 2rem;
                    animation: fadeInDown 0.8s ease-out;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .hero-heading {
                    font-size: 4.5rem;
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    margin-bottom: 2rem;
                    animation: fadeInUp 0.8s ease-out;
                }

                .hero-sub {
                    font-size: 1.25rem;
                    color: #999;
                    max-width: 650px;
                    line-height: 1.6;
                    margin-bottom: 3rem;
                    animation: fadeInUp 1s ease-out;
                }

                /* DEMO CONSOLE */
                .demo-wrapper {
                    margin-top: 5rem;
                    width: 100%;
                    max-width: 900px;
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6);
                    overflow: hidden;
                    animation: fadeInUp 1.2s ease-out;
                    position: relative;
                }
                
                .demo-header {
                    background: #161616;
                    padding: 14px 20px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #222;
                    gap: 1rem;
                }
                
                .url-bar {
                    flex: 1;
                    background: #080808;
                    color: #888;
                    font-family: 'JetBrains Mono', monospace;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid #222;
                }

                .demo-content {
                    padding: 0;
                    display: flex;
                    flex-direction: column; 
                }

                @media(min-width: 768px) {
                    .demo-content { flex-direction: row; height: 380px; }
                    .demo-sidebar { width: 220px; border-right: 1px solid #222; }
                    .demo-main { flex: 1; }
                }

                .demo-sidebar { background: #111; padding: 1.5rem; }
                .demo-nav-item {
                    display: flex; align-items: center; gap: 10px;
                    color: #666; padding: 10px;
                    border-radius: 6px; font-size: 0.9rem; font-weight: 500;
                    margin-bottom: 4px; transition: all 0.2s;
                    cursor: default;
                }
                .demo-nav-item.active { background: rgba(255,255,255,0.03); color: #fff; }

                .demo-main {
                    background: #0A0A0A;
                    padding: 2rem;
                    font-family: 'JetBrains Mono', monospace;
                    position: relative;
                    overflow: hidden;
                }

                .run-btn {
                    position: absolute; top: 1.5rem; right: 1.5rem;
                    background: var(--color-primary); color: #000;
                    border: none; padding: 8px 16px; border-radius: 6px;
                    font-weight: 600; font-size: 0.85rem; cursor: pointer;
                    display: flex; align-items: center; gap: 6px; z-index: 10;
                    box-shadow: 0 0 15px rgba(62, 207, 142, 0.3);
                    transition: box-shadow 0.2s;
                }
                .run-btn:hover { box-shadow: 0 0 25px rgba(62, 207, 142, 0.5); }

                /* HOW IT WORKS */
                .step-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 2rem;
                    background: #0E0E0E;
                    border: 1px solid #1F1F1F;
                    border-radius: 16px;
                    position: relative;
                }
                .step-number {
                    width: 40px; height: 40px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    color: #fff;
                }

                /* BENTO GRID */
                .bento-grid {
                    display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem;
                    max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
                }
                
                .bento-item {
                    background: #0E0E0E;
                    border: 1px solid #1F1F1F;
                    border-radius: 16px; padding: 2.5rem;
                    display: flex; flex-direction: column; justify-content: space-between;
                    transition: all 0.3s;
                }
                .bento-item:hover { transform: translateY(-4px); border-color: #333; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5); }

                .bento-span-4 { grid-column: span 12; }
                .bento-span-6 { grid-column: span 12; }
                .bento-span-8 { grid-column: span 12; }

                @media(min-width: 768px) {
                    .bento-span-4 { grid-column: span 4; }
                    .bento-span-6 { grid-column: span 6; }
                    .bento-span-8 { grid-column: span 8; }
                }

                .bento-icon {
                    width: 56px; height: 56px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 1.5rem; color: #fff;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .bento-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.8rem; letter-spacing: -0.01em; }
                .bento-desc { color: #999; font-size: 1rem; line-height: 1.6; }

                /* USE CASES */
                .use-case-card {
                    background: #0A0A0A; border: 1px solid #1F1F1F; padding: 2rem; border-radius: 12px;
                    text-align: left; transition: all 0.2s;
                }
                .use-case-card:hover { border-color: #333; background: #0F0F0F; }

                /* FAQ */
                .faq-item {
                    border-bottom: 1px solid #222;
                    margin-bottom: 1rem;
                }
                .faq-question {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1.5rem 0; cursor: pointer;
                    font-size: 1.1rem; font-weight: 500;
                }
                .faq-answer {
                    padding-bottom: 1.5rem; color: #888; line-height: 1.6;
                }

                /* ANIMATIONS */
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                
                /* MOBILE ADJUSTMENTS */
                @media(max-width: 768px) {
                    .hero-heading { font-size: 2.8rem; }
                    .nav-links { display: none; }
                    .mobile-menu-btn { display: block; }
                    .hero-section { padding-top: 5rem; }
                }
            `}</style>

            <div className="grid-bg"></div>

            {/* --- NAVBAR --- */}
            <nav className="nav-glass">
                <div className="nav-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, fontSize: '1.2rem' }}>
                        <img src="/logo_u.png" alt="urBackend Logo" style={{ height: '32px', width: 'auto' }} />
                        <span style={{ letterSpacing: '-0.5px' }}>urBackend</span>
                    </div>

                    <div className="nav-links" style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '32px', alignItems: 'center', fontSize: '0.95rem', color: '#888', fontWeight: 500 }}>
                        <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>How it Works</a>
                        <a href="#features" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Features</a>
                        <a href="#use-cases" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Use Cases</a>
                        <a href="#faq" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>FAQ</a>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ fontWeight: 600 }}>
                                Go to Console
                            </button>
                        ) : (
                            <>
                                <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, marginRight: '10px', display: window.innerWidth > 768 ? 'block' : 'none' }}>Log in</Link>
                                <Link to="/signup" className="btn btn-primary" style={{ fontWeight: 600, padding: '8px 20px' }}>Start Free</Link>
                            </>
                        )}
                        <button className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: '#fff', display: window.innerWidth <= 768 ? 'block' : 'none' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <div className="hero-section">
                <div className="hero-pill">
                    <Zap size={14} fill="currentColor" /> Public Beta v1.0 is Live
                </div>

                <h1 className="hero-heading">
                    Build your backend in seconds.<br />
                    <span className="text-gradient-primary">The API for Frontend Devs.</span>
                </h1>

                <p className="hero-sub">
                    Stop writing boilerplate. Get a production-ready Database, Authentication, and Storage API in seconds. Focus on building your UI—we handle the infrastructure.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', borderRadius: '8px' }}>
                        Start Building for Free <ArrowRight size={18} style={{ marginLeft: 6 }} />
                    </Link>
                    <Link to="/docs" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid #333' }}>
                        Read Documentation
                    </Link>
                </div>

                {/* --- INTERACTIVE DEMO --- */}
                <div id="demo" className="demo-wrapper">
                    <div className="demo-header">
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <div className="dot red" style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }}></div>
                            <div className="dot yellow" style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }}></div>
                            <div className="dot green" style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }}></div>
                        </div>
                        <div className="url-bar">
                            <span style={{ color: '#fff' }}>https://api.urbackend.com/v1/users</span>
                            <span style={{ fontSize: '0.75rem', color: '#666', border: '1px solid #333', padding: '2px 6px', borderRadius: 4 }}>GET</span>
                        </div>
                    </div>

                    <div className="demo-content">
                        <div className="demo-sidebar">
                            <div className="demo-nav-item active"><Database size={16} /> Users</div>
                            <div className="demo-nav-item"><Box size={16} /> Products</div>
                            <div className="demo-nav-item"><HardDrive size={16} /> Storage</div>
                            <div className="demo-nav-item"><Shield size={16} /> Auth</div>
                        </div>
                        <div className="demo-main">
                            <button className="run-btn" onClick={runDemo}>
                                <Play size={14} fill="currentColor" /> {isLoadingDemo ? 'Running...' : 'Send Request'}
                            </button>

                            {isLoadingDemo ? (
                                <div style={{ color: '#666', marginTop: '2rem' }}>Processing request...</div>
                            ) : apiResponse ? (
                                <>
                                    <div style={{ color: '#666', marginBottom: '10px' }}>// Status: <span style={{ color: '#27C93F' }}>200 OK</span> • Time: {apiResponse.time}</div>
                                    <div style={{ color: '#e5e5e5', lineHeight: 1.5 }}>
                                        {JSON.stringify(apiResponse.data, null, 2)}
                                    </div>
                                </>
                            ) : (
                                <div style={{ color: '#444', marginTop: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                    <Terminal size={48} color="#333" />
                                    <span>Hit "Send Request" to fetch live data from your API.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HOW IT WORKS (From Legacy) --- */}
            <div id="how-it-works" style={{ padding: '6rem 0', background: '#080808', borderTop: '1px solid #111' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 className="section-title">From Idea to API in 3 Steps</h2>
                        <p className="section-desc">We've removed the complexity. You don't need to be a backend expert to ship a professional app.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Step 1 */}
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Create Project</h3>
                            <p style={{ color: '#888', lineHeight: 1.6 }}>Initialize a new project environment. We instantly provision a dedicated database and storage bucket, isolated from everything else. No Docker, no Kubernetes.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Define Schema</h3>
                            <p style={{ color: '#888', lineHeight: 1.6 }}>Use our Visual Table Builder to define your data structure. Add fields like String, Number, Boolean, or Date. We handle the Mongoose schemas behind the scenes.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Fetch Data</h3>
                            <p style={{ color: '#888', lineHeight: 1.6 }}>Your API is live immediately. Use standard HTTP methods (GET, POST, PUT, DELETE) to interact with your data. No deployments or restarts required.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FEATURES BENTO GRID (Detailed) --- */}
            <div id="features" style={{ padding: '8rem 0', background: '#050505' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 className="section-title">Everything you need. <br /><span className="text-gradient">Nothing you don't.</span></h2>
                    <p className="section-desc">Essential backend tools packaged into one unified developer console.</p>
                </div>

                <div className="bento-grid">
                    {/* Item 1: Database (Detailed) */}
                    <div className="bento-item bento-span-8">
                        <div>
                            <div className="bento-icon" style={{ background: 'rgba(62, 207, 142, 0.1)', color: '#3ECF8E' }}>
                                <Database />
                            </div>
                            <h3 className="bento-title">Instant NoSQL Database</h3>
                            <p className="bento-desc">
                                Create flexible Collections (tables) without touching a command line.
                                Our underlying engine uses <strong>MongoDB</strong> for high performance and scalability.
                                Data is automatically served via RESTful endpoints.
                            </p>
                            <ul style={{ marginTop: '1rem', color: '#666', listStyle: 'none', padding: 0, display: 'grid', gap: '8px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={14} color="#3ECF8E" /> Validated JSON Schemas</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={14} color="#3ECF8E" /> Automatic ID & Timestamp Injection</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={14} color="#3ECF8E" /> Real-time Schema Updates</li>
                            </ul>
                        </div>
                        <div style={{ marginTop: '2.5rem', background: '#000', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222', fontSize: '0.85rem', color: '#aaa', fontFamily: 'JetBrains Mono, monospace' }}>
                            <span style={{ color: '#c678dd' }}>axios</span>.post(<span style={{ color: '#98c379' }}>'/api/v1/posts'</span>, {`{`} <br />
                            &nbsp;&nbsp;title: <span style={{ color: '#98c379' }}>'Hello World'</span>,<br />
                            &nbsp;&nbsp;content: <span style={{ color: '#98c379' }}>'My first post'</span><br />
                            {`}`});
                        </div>
                    </div>

                    {/* Item 2: Auth (Detailed) */}
                    <div className="bento-item bento-span-4">
                        <div className="bento-icon" style={{ background: 'rgba(255, 189, 46, 0.1)', color: '#FFBD2E' }}>
                            <Shield />
                        </div>
                        <h3 className="bento-title">Authentication Ready-to-go</h3>
                        <p className="bento-desc">
                            Secure your app with industry-standard <strong>JWT</strong> (JSON Web Tokens).
                            We handle user registration, login, and password hashing using <strong>BCrypt</strong>.
                        </p>
                        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#888' }}>
                            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={14} /> Secure Password Hashing</div>
                            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> Session Management</div>
                        </div>
                    </div>

                    {/* Item 3: Storage (Detailed) */}
                    <div className="bento-item bento-span-4">
                        <div className="bento-icon" style={{ background: 'rgba(64, 158, 255, 0.1)', color: '#409EFF' }}>
                            <HardDrive />
                        </div>
                        <h3 className="bento-title">Cloud File Storage</h3>
                        <p className="bento-desc">
                            Upload images, documents, and media via multipart form data.
                            We provide instant <strong>Public CDN URLs</strong> so you can display assets immediately in your frontend.
                        </p>
                    </div>

                    {/* Item 4: DX (Large) */}
                    <div className="bento-item bento-span-8">
                        <div>
                            <div className="bento-icon" style={{ background: 'rgba(255, 95, 86, 0.1)', color: '#FF5F56' }}>
                                <Cpu />
                            </div>
                            <h3 className="bento-title">Lightning Fast & Secure</h3>
                            <p className="bento-desc">
                                Built on Node.js and optimized for speed. Every project runs in an isolated environment
                                with strict API Key validation. Your data is yours.
                            </p>
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ background: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#888' }}>Zero-Config</span>
                            <span style={{ background: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#888' }}>Framework Agnostic</span>
                            <span style={{ background: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#888' }}>Scalable</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FAQ SECTION --- */}
            <div id="faq" style={{ padding: '8rem 0', background: '#080808', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <p className="section-desc">Common questions about urBackend.</p>
                    </div>

                    <div className="faq-list">
                        {[
                            { q: "Is it really free?", a: "Yes, our Public Beta is completely free for early adopters. You can create unlimited projects and collections while we are in beta." },
                            { q: "Can I use this with React/Vue/Angular?", a: "Absolutely. urBackend provides a standard REST API that works with ANY frontend framework, including React JS, Next.js, Vue, Angular, Svelte, and even mobile frameworks like Flutter and React Native." },
                            { q: "How is this different from Firebase?", a: "Firebase is a proprietary platform with vendor lock-in. urBackend gives you a standard REST API that mimics a custom Node.js/Express backend, making it easier to migrate away if you ever need to." },
                            { q: "Is my data secure?", a: "Yes. All data is encrypted at rest. API access is secured via API Keys, and user data is protected via JWT authentication." },
                            { q: "Do I need to check for server maintenance?", a: "No. We handle all infrastructure, updates, and maintenance. You just focus on your code." }
                        ].map((faq, index) => (
                            <div key={index} className="faq-item">
                                <div className="faq-question" onClick={() => toggleFaq(index)}>
                                    <span>{faq.q}</span>
                                    {openFaqIndex === index ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                                </div>
                                {openFaqIndex === index && (
                                    <div className="faq-answer">{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default LandingPage;