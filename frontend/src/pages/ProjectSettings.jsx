import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, AlertTriangle, Save } from 'lucide-react';
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
        <div className="container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Project Settings</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Configuration for {project?.name}</p>
                </div>
            </div>

            {/* General Settings (Rename Feature) */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>General</h3>
                <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label className="form-label">Project Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleRename}
                        className="btn btn-primary"
                        disabled={renaming || newName === project?.name}
                    >
                        {renaming ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* External Configuration */}
            <ExternalConfigForm project={project} projectId={projectId} token={token} />

            {/* Danger Zone */}
            <div className="card" style={{ border: '1px solid var(--color-danger)' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-danger)' }}>
                    <AlertTriangle size={20} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Danger Zone</h3>
                </div>

                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    This action cannot be undone. This will permanently delete the
                    <strong> {project?.name}</strong> project and all associated data.
                </p>

                <div style={{ maxWidth: '400px' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--color-danger)' }}>
                            Type <strong>{project?.name}</strong> to confirm
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder={project?.name}
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleDeleteProject}
                        className="btn btn-danger"
                        disabled={deleteConfirm !== project?.name}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        <Trash2 size={16} /> Delete Project
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
        if (!config.dbUri || !config.storageUrl || !config.storageKey) {
            return toast.error("All external configuration fields are required.");
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
        <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>External Configuration</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Connect your own database and storage. <br />
                </p>

                {isConfigured && !showForm ? (
                    <div style={{ marginTop: '1rem', background: 'var(--color-bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', fontWeight: 600, marginBottom: '0.5rem' }}>
                            <div style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '50%' }}></div>
                            Connected Successfully
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                            Your project is currently using external database and storage.
                        </p>
                        <button
                            className="btn btn-outline"
                            onClick={() => setShowForm(true)}
                        >
                            Update Configuration
                        </button>
                    </div>
                ) : (
                    <>
                        <p style={{ color: 'var(--color-warning)', fontWeight: 500, fontSize: '0.85rem', marginBottom: '1rem' }}>
                            {isConfigured
                                ? "Note: Updating this will overwrite your existing configuration."
                                : "Configure your external resources to scale beyond the free tier."}
                        </p>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Database URI (MongoDB)</label>
                                <input
                                    type="password"
                                    name="dbUri"
                                    className="input-field"
                                    placeholder="mongodb+srv://..."
                                    value={config.dbUri}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Storage URL</label>
                                    <input
                                        type="text"
                                        name="storageUrl"
                                        className="input-field"
                                        placeholder="https://..."
                                        value={config.storageUrl}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Storage Provider</label>
                                    <select
                                        name="storageProvider"
                                        className="input-field"
                                        value={config.storageProvider}
                                        onChange={handleChange}
                                    >
                                        <option value="supabase">Supabase</option>
                                        <option value="aws">AWS S3 (Coming Soon)</option>
                                        <option value="cloudinary">Cloudinary (Coming Soon)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Storage Key / Service Role Key</label>
                                <input
                                    type="password"
                                    name="storageKey"
                                    className="input-field"
                                    placeholder="ey..."
                                    value={config.storageKey}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                {isConfigured && (
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleUpdateConfig}
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Save size={18} />
                                    {loading ? 'Updating...' : 'Update Configuration'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}