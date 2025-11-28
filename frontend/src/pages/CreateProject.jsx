import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Copy, CheckCircle, AlertTriangle } from 'lucide-react';

function CreateProject() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [newProject, setNewProject] = useState(null);

    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return toast.error("Project Name is required");

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:1234/api/projects',
                { name, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewProject(res.data);
            toast.success("Project Created!");
        } catch (err) {
            toast.error(err.response?.data || "Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    // --- SUCCESS VIEW (API KEY) ---
    if (newProject) {
        return (
            <div className="container" style={{ maxWidth: '600px', marginTop: '4rem' }}>
                <div className="card" style={{ border: '1px solid var(--color-success)', background: 'rgba(62, 207, 142, 0.05)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <CheckCircle size={64} color="var(--color-success)" style={{ marginBottom: '1rem', opacity: 0.9 }} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Project Created!</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>{newProject.name} is ready to use.</p>
                    </div>

                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: '6px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '12px' }}>
                        <AlertTriangle color="var(--color-danger)" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <strong style={{ color: 'var(--color-danger)' }}>Save this API Key immediately</strong>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                                For security, we only show this key once. If you lose it, you will need to regenerate it, which may break your app.
                            </p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Anon Public Key</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <code className="input-field" style={{
                                fontFamily: 'monospace',
                                backgroundColor: '#111',
                                color: 'var(--color-primary)',
                                overflowX: 'auto',
                                whiteSpace: 'nowrap'
                            }}>
                                {newProject.apiKey}
                            </code>
                            <button
                                onClick={() => copyToClipboard(newProject.apiKey)}
                                className="btn btn-secondary"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                    >
                        I have saved the key, Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // --- FORM VIEW ---
    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-ghost"
                style={{ marginBottom: '1rem', paddingLeft: 0 }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Project Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="e.g. My E-commerce API"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field"
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            placeholder="What is this project about?"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating Project...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProject;