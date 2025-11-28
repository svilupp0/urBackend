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