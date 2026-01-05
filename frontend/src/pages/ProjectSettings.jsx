import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, AlertTriangle, Save, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function ProjectSettings() {
    const { projectId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    // Existing State
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState('');

    // --- NEW STATE FOR RENAME ---
    const [newName, setNewName] = useState('');
    const [renaming, setRenaming] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProject(res.data);
                // Set initial name for renaming
                setNewName(res.data.name);
            } catch (err) {
                toast.error("Failed to load project");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId, token]);

    // --- NEW: HANDLE RENAME ---
    const handleRename = async () => {
        if (!newName.trim()) return toast.error("Project name cannot be empty");

        setRenaming(true);
        try {
            await axios.patch(`${API_URL}/api/projects/${projectId}`,
                { name: newName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Project renamed successfully!");
            // Update local state to reflect change immediately
            setProject(prev => ({ ...prev, name: newName }));
        } catch (err) {
            toast.error("Failed to rename project");
        } finally {
            setRenaming(false);
        }
    }

    const handleDeleteProject = async () => {
        if (deleteConfirm !== project.name) return toast.error("Project name does not match");

        if (!confirm("Final warning: This will delete the project and all its data.")) return;

        try {
            await axios.delete(`${API_URL}/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Project deleted");
            navigate('/dashboard');
        } catch (err) {
            toast.error("Failed to delete project");
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div className="page-header" style={{ marginBottom: '2.5rem', borderBottom: 'none' }}>
                <div>
                    <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Save size={28} color="var(--color-primary)" /> Project Settings
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Configuration and preferences for <strong>{project?.name}</strong>.</p>
                </div>
            </div>

            {/* General Settings (Rename Feature) */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '24px', background: 'var(--color-primary)', borderRadius: '4px' }}></div>
                    General Information
                </h3>
                <div className="form-group" style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Project Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>
                    <button
                        onClick={handleRename}
                        className="btn btn-primary"
                        disabled={renaming || newName === project?.name}
                        style={{ padding: '12px 24px', height: '45px' }}
                    >
                        {renaming ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* External Configuration */}
            <ExternalConfigForm project={project} projectId={projectId} token={token} />

            {/* Danger Zone */}
            <div className="card" style={{ border: '1px solid rgba(234, 84, 85, 0.3)', background: 'rgba(234, 84, 85, 0.02)' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem', color: '#ea5455' }}>
                    <AlertTriangle size={24} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Danger Zone</h3>
                </div>

                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    This action cannot be undone. This will permanently delete the
                    <strong style={{ color: '#fff' }}> {project?.name}</strong> project and all associated data including collections, files, and users.
                </p>

                <div style={{ maxWidth: '500px' }}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label" style={{ color: '#ea5455', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                            Type <strong style={{ textDecoration: 'underline' }}>{project?.name}</strong> to confirm
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder={project?.name}
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'var(--color-bg-input)', border: '1px solid rgba(234, 84, 85, 0.3)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>
                    <button
                        onClick={handleDeleteProject}
                        className="btn btn-danger"
                        disabled={deleteConfirm !== project?.name}
                        style={{ width: '100%', justifyContent: 'center', background: '#ea5455', border: 'none', color: '#fff', padding: '12px', borderRadius: '8px', marginTop: '10px' }}
                    >
                        <Trash2 size={18} /> Permanently Delete Project
                    </button>
                </div>
            </div>
        </div>
    );
}

function ExternalConfigForm({ project, projectId, token }) {
    const [config, setConfig] = useState({
        dbUri: '',
        storageUrl: '',
        storageKey: '',
        storageProvider: 'supabase' // default
    });
    const [loading, setLoading] = useState(false);
    const [isConfigured, setIsConfigured] = useState(project?.isExternal || false);
    const [showForm, setShowForm] = useState(!project?.isExternal);

    useEffect(() => {
        setIsConfigured(project?.isExternal || false);
        // If it's not configured, always show form. If it is, hide it by default.
        setShowForm(!project?.isExternal);
    }, [project]);

    const handleChange = (e) => {
        setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdateConfig = async () => {
        if (!config.dbUri && (!config.storageUrl || !config.storageKey)) {
            return toast.error("At least one external configuration field is required.");
        }

        setLoading(true);
        try {
            await axios.patch(`${API_URL}/api/projects/${projectId}/byod-config`,
                config,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("External configuration updated successfully!");

            // Update local state to reflect success
            setIsConfigured(true);
            setShowForm(false);

            setConfig({
                dbUri: '',
                storageUrl: '',
                storageKey: '',
                storageProvider: 'supabase'
            });
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update configuration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--color-primary), #34d399)' }}></div>

            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Save size={20} color="var(--color-primary)" /> External Configuration (BYOD)
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
                    Connect your own high-performance database and storage to scale beyond the free tier limits.
                </p>

                {isConfigured && !showForm ? (
                    <div style={{ marginTop: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10B981', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                            <CheckCircle size={20} />
                            Connected Successfully
                        </div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                            Your project is currently using external resources.
                        </p>
                        <button
                            className="btn btn-outline"
                            onClick={() => setShowForm(true)}
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }}
                        >
                            Update Configuration
                        </button>
                    </div>
                ) : (
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ background: 'rgba(255, 189, 46, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 189, 46, 0.2)', marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                            <AlertTriangle size={20} color="#FFBD2E" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ color: '#FFBD2E', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                {isConfigured
                                    ? "Updating this configuration will overwrite your existing connection details."
                                    : "Bring Your Own Database (BYOD). Connect a MongoDB Atlas URI and S3-compatible storage."}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.9rem' }}>Database URI (MongoDB)</label>
                                <input
                                    type="password"
                                    name="dbUri"
                                    className="input-field"
                                    placeholder="mongodb+srv://user:pass@cluster.mongodb.net/..."
                                    value={config.dbUri}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontFamily: 'monospace' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.9rem' }}>Storage URL</label>
                                    <input
                                        type="text"
                                        name="storageUrl"
                                        className="input-field"
                                        placeholder="https://..."
                                        value={config.storageUrl}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.9rem' }}>Storage Provider</label>
                                    <select
                                        name="storageProvider"
                                        className="input-field"
                                        value={config.storageProvider}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff' }}
                                    >
                                        <option value="supabase">Supabase</option>
                                        <option value="aws">AWS S3 (Coming Soon)</option>
                                        <option value="cloudinary">Cloudinary (Coming Soon)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.9rem' }}>Storage Key / Service Role Key</label>
                                <input
                                    type="password"
                                    name="storageKey"
                                    className="input-field"
                                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    value={config.storageKey}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontFamily: 'monospace' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
                                {isConfigured && (
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setShowForm(false)}
                                        style={{ padding: '10px 20px', color: 'var(--color-text-muted)' }}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleUpdateConfig}
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 24px' }}
                                >
                                    <Save size={18} />
                                    {loading ? 'Updating...' : 'Update Configuration'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}