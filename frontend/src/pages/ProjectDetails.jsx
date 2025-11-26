import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Database, Key, Copy, RefreshCw, AlertTriangle, Check } from 'lucide-react';

function ProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for Regenerated Key Modal
    const [newKey, ZN] = useState(null);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Fetch Project Data
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`http://localhost:1234/api/projects/${projectId}`, {
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

    // Handle Regenerate Key
    const handleRegenerateKey = async () => {
        if (!window.confirm("Are you sure? The old key will stop working immediately.")) return;

        setIsRegenerating(true);
        try {
            const res = await axios.patch(`http://localhost:1234/api/projects/${projectId}/regenerate-key`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            ZN(res.data.apiKey); // Show the new key temporarily
            toast.success("New API Key Generated!");
        } catch (err) {
            toast.error("Failed to regenerate key");
        } finally {
            setIsRegenerating(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied!");
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!project) return <div style={{ padding: '2rem' }}>Project not found</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

            {/* --- REGENERATED KEY MODAL (Overlay) --- */}
            {newKey && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%', border: '1px solid var(--color-primary)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: 'var(--color-primary)' }}>New API Key Ready</h2>
                            <p style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>
                                Copy this key now. You won't see it again!
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <code style={{
                                flex: 1, padding: '12px', background: '#000',
                                border: '1px solid var(--color-border)', borderRadius: '4px',
                                color: 'var(--color-primary)', overflowX: 'auto'
                            }}>
                                {newKey}
                            </code>
                            <button onClick={() => copyToClipboard(newKey)} className="btn btn-primary">
                                <Copy size={18} />
                            </button>
                        </div>

                        <button
                            onClick={() => ZN(null)}
                            className="btn"
                            style={{ width: '100%', background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                        >
                            I have copied it, Close
                        </button>
                    </div>
                </div>
            )}


            {/* --- MAIN CONTENT --- */}
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{project.name}</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>{project.description}</p>
            </div>

            {/* API Keys Section (Hidden by Default) */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <Key size={20} color="var(--color-warning)" />
                    <h2 style={{ fontSize: '1.2rem' }}>API Credentials</h2>
                </div>

                <div style={{ background: 'var(--color-bg-inset)', padding: '1.5rem', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>

                        <div>
                            <small style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '5px' }}>
                                Public API Key
                            </small>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontFamily: 'monospace', letterSpacing: '2px' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>sk_live_••••••••••••••••</span>
                            </div>
                        </div>

                        <button
                            onClick={handleRegenerateKey}
                            disabled={isRegenerating}
                            className="btn"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-main)',
                                background: 'transparent'
                            }}
                        >
                            <RefreshCw size={16} className={isRegenerating ? "spin" : ""} />
                            {isRegenerating ? 'Generating...' : 'Regenerate Key'}
                        </button>

                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-warning)' }}>
                        <AlertTriangle size={14} />
                        <span>Regenerating will invalidate the old key immediately.</span>
                    </div>
                </div>
            </div>

            {/* Collections Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Database size={20} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '1.5rem' }}>Collections</h2>
                    </div>

                    <button
                        onClick={() => navigate(`/project/${projectId}/create-collection`)}
                        className="btn btn-primary"
                    >
                        + New Collection
                    </button>
                </div>

                {project.collections.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--color-text-muted)' }}>No collections yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                        {project.collections.map(c => (
                            <div key={c._id} className="card" style={{ cursor: 'pointer', borderLeft: '4px solid var(--color-primary)' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>{c.name}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '5px' }}>
                                    {c.model.length} Fields
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Simple CSS for Spin Animation */}
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default ProjectDetails;