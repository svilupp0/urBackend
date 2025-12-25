import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Folder, Server, ArrowRight, Activity, Database, HardDrive, Zap } from 'lucide-react';
import { API_URL } from '../config';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/projects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(response.data);
            } catch (err) {
                console.error(err);
                toast.error("Could not load projects.");
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchProjects();
    }, [token]);

    // Inline Styles for Cards to match Landing Page aesthetic
    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '1.5rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
    };

    if (isLoading) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--color-text-muted)', gap: '10px' }}>
            <div className="spinner"></div> Loading workspace...
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>

            {/* Header Section */}
            <div className="page-header" style={{ marginBottom: '3rem', borderBottom: 'none' }}>
                <div>
                    <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Overview</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Welcome back! Here's what's happening with your projects.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/create-project')}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.5rem', gap: '8px', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.3)' }}
                >
                    <Plus size={18} /> New Project
                </button>
            </div>

            {/* Stats Row (Static for now, makes it look dashboard-y) */}
            {projects.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Projects</span>
                            <Folder size={20} color="var(--color-primary)" />
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{projects.length}</div>
                    </div>
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>System Status</span>
                            <Activity size={20} color="#3ECF8E" />
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#3ECF8E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: '#3ECF8E', boxShadow: '0 0 10px #3ECF8E' }}></span>
                            Operational
                        </div>
                    </div>
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>API Usage</span>
                            <Zap size={20} color="#FFBD2E" />
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Free Tier</div>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Your Projects</h2>

            {projects.length === 0 ? (
                <div style={{
                    ...cardStyle,
                    textAlign: 'center',
                    padding: '6rem 2rem',
                    alignItems: 'center',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)',
                    borderStyle: 'dashed'
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
                    }}>
                        <Server size={32} color="var(--color-text-muted)" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>No projects yet</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
                        Create your first backend project to start building APIs, Databases, and Storage buckets instantly.
                    </p>
                    <button
                        onClick={() => navigate('/create-project')}
                        className="btn btn-secondary"
                        style={{ background: '#fff', color: '#000', fontWeight: 600 }}
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {projects.map((project) => (
                        <Link
                            to={`/project/${project._id}`}
                            key={project._id}
                            className="dashboard-card-link"
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="dashboard-card" style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div style={{
                                        padding: '12px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, rgba(62, 207, 142, 0.15), rgba(62, 207, 142, 0.05))',
                                        color: '#3ECF8E',
                                        border: '1px solid rgba(62, 207, 142, 0.2)'
                                    }}>
                                        <Database size={24} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid var(--color-border)' }}>
                                        v1.0.0
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '8px' }}>
                                    {project.name}
                                </h3>

                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6',
                                    marginBottom: '2rem',
                                    flex: 1,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {project.description || "A scalable backend project."}
                                </p>

                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                    paddingTop: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.8rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Database size={14} /> <span>DB</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <HardDrive size={14} /> <span>Storage</span>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                        Open <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Add New Project Card (always visible at end of list) */}
                    <button
                        onClick={() => navigate('/create-project')}
                        className="dashboard-card-add"
                        style={{
                            ...cardStyle,
                            background: 'transparent',
                            borderStyle: 'dashed',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)',
                            minHeight: '240px'
                        }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Plus size={24} />
                        </div>
                        <span style={{ fontWeight: 600 }}>Create New Project</span>
                    </button>
                </div>
            )}

            <style>{`
                .dashboard-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--color-primary) !important;
                    background: rgba(255,255,255,0.04) !important;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                }
                .dashboard-card-add:hover {
                    border-color: var(--color-primary) !important;
                    color: var(--color-primary) !important;
                    background: rgba(62, 207, 142, 0.02) !important;
                }
                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.1);
                    border-left-color: var(--color-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}