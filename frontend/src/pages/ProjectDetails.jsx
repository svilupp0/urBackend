import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    Database, Key, Copy, RefreshCw, AlertTriangle,
    Layers, ArrowRight, Activity, Server, ShieldCheck
} from 'lucide-react';
import { API_URL } from '../config';

function ProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newKey, setNewKey] = useState(null);
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProject(res.data);
            } catch (err) {
                toast.error("Failed to load project details");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId, token]);

    const handleRegenerateKey = async () => {
        if (!window.confirm("Are you sure? The old key will stop working immediately.")) return;

        setIsRegenerating(true);
        try {
            const res = await axios.patch(`${API_URL}/api/projects/${projectId}/regenerate-key`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewKey(res.data.apiKey);
            toast.success("New API Key Generated!");
        } catch (err) {
            toast.error("Failed to regenerate key");
        } finally {
            setIsRegenerating(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    // Shared Styles
    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '1.5rem',
        height: '100%',
        position: 'relative'
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--color-text-muted)', gap: '10px' }}>
            <div className="spinner"></div> Loading project...
        </div>
    );

    if (!project) return <div className="container">Project not found</div>;

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>

            {/* --- NEW KEY MODAL --- */}
            {newKey && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%', border: '1px solid var(--color-primary)', background: '#0a0a0a', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '50px', height: '50px', background: 'rgba(62, 207, 142, 0.1)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                                <Key size={24} />
                            </div>
                            <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.5rem' }}>New API Key Generated</h2>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                Please copy this key immediately. For security reasons, it will not be displayed again.
                            </p>
                        </div>
                        <div style={{ position: 'relative', marginBottom: '2rem' }}>
                            <code style={{
                                display: 'block',
                                padding: '1rem',
                                background: '#111',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                color: '#3ECF8E',
                                fontFamily: 'monospace',
                                wordBreak: 'break-all',
                                fontSize: '0.9rem'
                            }}>
                                {newKey}
                            </code>
                            <button
                                onClick={() => copyToClipboard(newKey)}
                                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                        <button onClick={() => setNewKey(null)} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                            I have copied it safely
                        </button>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="page-header" style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Server size={24} color="#fff" />
                        </div>
                        <div>
                            <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{project.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3ECF8E', background: 'rgba(62, 207, 142, 0.1)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                                    <span style={{ width: 6, height: 6, background: 'currentColor', borderRadius: '50%' }}></span> Active
                                </span>
                                <span style={{ color: 'var(--color-text-muted)' }}>ID: {project._id}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate(`/project/${projectId}/settings`)} className="btn btn-secondary">
                            Project Settings
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* --- API CONFIGURATION --- */}
                <div style={{ order: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldCheck size={20} color="var(--color-primary)" /> Connect
                    </h3>
                    <div style={cardStyle}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                                API Endpoint
                            </label>
                            <div className="input-group" style={{ display: 'flex', background: '#000', borderRadius: '6px', border: '1px solid #333', overflow: 'hidden' }}>
                                <div style={{ padding: '10px 14px', color: '#888', background: '#111', borderRight: '1px solid #333', fontSize: '0.9rem', userSelect: 'none' }}>POST</div>
                                <input
                                    readOnly
                                    value={`${API_URL}/api/data/{collection}`}
                                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#ccc', padding: '10px', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none' }}
                                />
                                <button onClick={() => copyToClipboard(`${API_URL}/api/data`)} style={{ background: 'transparent', border: 'none', color: '#666', padding: '0 12px', cursor: 'pointer', transition: 'color 0.2s' }}>
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                    Secret API Key
                                </label>
                                <button
                                    onClick={handleRegenerateKey}
                                    disabled={isRegenerating}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    {isRegenerating ? <RefreshCw size={12} className="spin" /> : <RefreshCw size={12} />} Roll Key
                                </button>
                            </div>

                            <div className="input-group" style={{ display: 'flex', background: '#000', borderRadius: '6px', border: '1px solid #333', overflow: 'hidden', marginBottom: '12px' }}>
                                <div style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', color: '#666' }}>
                                    <Key size={16} />
                                </div>
                                <input
                                    readOnly
                                    value="sk_live_••••••••••••••••••••••••"
                                    type="password"
                                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#666', padding: '10px', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', letterSpacing: '2px' }}
                                />
                            </div>

                            <div style={{
                                background: 'rgba(255, 189, 46, 0.1)',
                                border: '1px solid rgba(255, 189, 46, 0.2)',
                                borderRadius: '6px',
                                padding: '10px 12px',
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'flex-start'
                            }}>
                                <AlertTriangle size={16} color="#FFBD2E" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <span style={{ fontSize: '0.8rem', color: '#FFBD2E', lineHeight: '1.4' }}>
                                    This key grants full write access. Keep it secure in your backend environment (.env).
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLLECTIONS --- */}
                <div style={{ order: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Database size={20} color="var(--color-primary)" /> Collections
                        </h3>
                        <button
                            onClick={() => navigate(`/project/${projectId}/create-collection`)}
                            className="btn btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.85rem', height: 'auto' }}
                        >
                            + New Collection
                        </button>
                    </div>

                    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {project.collections.length === 0 ? (
                            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <Layers size={24} color="#444" />
                                </div>
                                <h4 style={{ color: 'var(--color-text-main)', marginBottom: '5px' }}>No Data Yet</h4>
                                <p style={{ fontSize: '0.9rem', maxWidth: '200px' }}>Create a collection to start storing JSON documents.</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
                                            <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Name</th>
                                            <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Schema</th>
                                            <th style={{ padding: '16px', textAlign: 'right' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {project.collections.map(c => (
                                            <tr key={c._id} className="collection-row" onClick={() => navigate(`/project/${projectId}/database?collection=${c.name}`)}>
                                                <td style={{ padding: '16px', fontWeight: 500, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Database size={16} color="var(--color-text-muted)" /> {c.name}
                                                </td>
                                                <td style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                                    {c.model.length} fields defined
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                                                    <ArrowRight size={16} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .collection-row {
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .collection-row:last-child {
                    border-bottom: none;
                }
                .collection-row:hover {
                    background: rgba(255,255,255,0.03);
                }
                .collection-row:hover td {
                    color: var(--color-primary) !important;
                }
                .collection-row:hover svg {
                    color: var(--color-primary) !important;
                }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.1);
                    border-left-color: var(--color-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default ProjectDetails;