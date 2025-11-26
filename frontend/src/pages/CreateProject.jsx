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

    // Nayi State: Jab project ban jayega, tab uska data yahan store hoga
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

            // Success par navigate karne ki jagah, naya data save kar lo
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

    // Agar project ban chuka hai, toh yeh "Success View" dikhao
    if (newProject) {
        return (
            <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <div className="card" style={{ border: '1px solid var(--color-success)', background: 'rgba(62, 207, 142, 0.05)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <CheckCircle size={48} color="var(--color-success)" style={{ marginBottom: '10px' }} />
                        <h2 style={{ fontSize: '1.8rem' }}>Project Created Successfully!</h2>
                    </div>

                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', borderRadius: '6px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                        <AlertTriangle color="var(--color-error)" size={24} style={{ flexShrink: 0 }} />
                        <div>
                            <strong style={{ color: 'var(--color-error)' }}>Important:</strong>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                                This API Key will <strong>only be shown once</strong>. Please copy it and store it securely. You won't be able to see it again!
                            </p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Your API Key</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <code style={{
                                flex: 1,
                                padding: '12px',
                                background: '#111',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--border-radius)',
                                fontFamily: 'monospace',
                                color: 'var(--color-primary)',
                                overflowX: 'auto'
                            }}>
                                {newProject.apiKey}
                            </code>
                            <button
                                onClick={() => copyToClipboard(newProject.apiKey)}
                                className="btn"
                                style={{ border: '1px solid var(--color-border)' }}
                            >
                                <Copy size={20} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                    >
                        I have copied it, Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Normal "Create Form" View
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/dashboard')}
                className="btn"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1rem', paddingLeft: 0, color: 'var(--color-text-muted)' }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Project Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%', padding: '12px',
                                borderRadius: 'var(--border-radius)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-main)',
                                color: 'var(--color-text-main)',
                                fontSize: '1rem'
                            }}
                            placeholder="e.g. My E-commerce API"
                            autoFocus
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: '100%', padding: '12px',
                                borderRadius: 'var(--border-radius)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-main)',
                                color: 'var(--color-text-main)',
                                minHeight: '100px',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                            placeholder="What is this project about?"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProject;