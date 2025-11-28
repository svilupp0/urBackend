import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Database, Key, Copy, RefreshCw, AlertTriangle, Check, Layers } from 'lucide-react';

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

    const handleRegenerateKey = async () => {
        if (!window.confirm("Are you sure? The old key will stop working immediately.")) return;

        setIsRegenerating(true);
        try {
            const res = await axios.patch(`http://localhost:1234/api/projects/${projectId}/regenerate-key`, {}, {
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
        toast.success("Copied!");
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!project) return <div className="container">Project not found</div>;

    return (
        <div className="container">
            {/* Modal for New Key */}
            {newKey && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%', border: '1px solid var(--color-primary)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>New API Key Ready</h2>
                            <p style={{ color: 'var(--color-text-muted)' }}>
                                Copy this key now. You won't see it again!
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <code className="input-field" style={{ fontFamily: 'monospace', backgroundColor: '#000' }}>
                                {newKey}
                            </code>
                            <button onClick={() => copyToClipboard(newKey)} className="btn btn-primary">
                                <Copy size={18} />
                            </button>
                        </div>
                        <button onClick={() => setNewKey(null)} className="btn btn-secondary" style={{ width: '100%' }}>
                            I have copied it, Close
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">{project.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                        <span className="badge" style={{ backgroundColor: 'rgba(62, 207, 142, 0.2)', color: 'var(--color-success)' }}>Active</span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Region: us-east-1</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Left Column: API Keys */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Key size={18} /> API Configuration
                    </h3>
                    <div className="card">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Project URL</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input readOnly value="http://localhost:1234/api" className="input-field" style={{ color: 'var(--color-text-muted)' }} />
                                <button className="btn btn-secondary" onClick={() => copyToClipboard("http://localhost:1234/api")}>
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Public Anon Key</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input readOnly value="sk_live_••••••••••••••••" className="input-field" type="password" />
                                <button className="btn btn-secondary" onClick={handleRegenerateKey} disabled={isRegenerating}>
                                    {isRegenerating ? <RefreshCw size={16} className="spin" /> : 'Regenerate'}
                                </button>
                            </div>
                            <small style={{ color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <AlertTriangle size={14} /> Never share your API key on the client-side.
                            </small>
                        </div>
                    </div>
                </div>

                {/* Right Column: Collections Summary */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Database size={18} /> Database Collections
                        </h3>
                        <button onClick={() => navigate(`/project/${projectId}/create-collection`)} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                            + New
                        </button>
                    </div>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {project.collections.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <Layers size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                <p>No collections yet</p>
                            </div>
                        ) : (
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-inset)' }}>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Name</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Fields</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {project.collections.map(c => (
                                        <tr key={c._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 500 }}>{c.name}</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-muted)' }}>{c.model.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default ProjectDetails;