import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UploadCloud, Trash2, File, ExternalLink, HardDrive, AlertTriangle } from 'lucide-react';
import { API_URL } from '../config';

export default function Storage() {
    const { projectId } = useParams();
    const { token, user } = useAuth();

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingAll, setDeletingAll] = useState(false);
    const fileInputRef = useRef(null);

    // 1. Fetch Files
    const fetchFiles = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/projects/${projectId}/storage/files`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(res.data);
        } catch (err) {
            toast.error("Failed to load files");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchFiles();
    }, [projectId, token]);

    // 2. Handle File Upload
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!user?.isVerified) {
            toast.error("Account Verification Required. Please verify in Settings.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        const toastId = toast.loading("Uploading...");

        try {
            await axios.post(`${API_URL}/api/projects/${projectId}/storage/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("File uploaded!", { id: toastId });
            fetchFiles();
        } catch (err) {
            toast.error("Upload failed", { id: toastId });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // 3. Handle Single Delete
    const handleDelete = async (path) => {
        if (!user?.isVerified) {
            toast.error("Account Verification Required.");
            return;
        }
        if (!confirm("Delete this file permanently?")) return;

        try {
            await axios.post(`${API_URL}/api/projects/${projectId}/storage/delete`,
                { path },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFiles(files.filter(f => f.path !== path));
            toast.success("File deleted");
        } catch (err) {
            toast.error("Failed to delete file");
        }
    };

    // 4. Handle Delete ALL (New Feature)
    const handleDeleteAll = async () => {
        if (!user?.isVerified) {
            toast.error("Account Verification Required.");
            return;
        }
        const confirmMsg = prompt(`Type "DELETE" to confirm wiping all ${files.length} files.`);
        if (confirmMsg !== "DELETE") return;

        setDeletingAll(true);
        try {
            await axios.delete(`${API_URL}/api/projects/${projectId}/storage/files`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles([]);
            toast.success("All files deleted.");
        } catch (err) {
            toast.error("Failed to clear storage");
        } finally {
            setDeletingAll(false);
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    if (loading) return <div className="container">Loading Storage...</div>;

    return (
        <div className="container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Storage</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your project's media and assets.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {files.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="btn btn-danger"
                            disabled={deletingAll}
                        >
                            {deletingAll ? 'Deleting...' : <><AlertTriangle size={16} /> Delete All</>}
                        </button>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="btn btn-primary"
                        disabled={uploading}
                    >
                        <UploadCloud size={18} /> {uploading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>
            </div>

            {/* Empty State */}
            {files.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <HardDrive size={48} style={{ opacity: 0.3, marginBottom: '1rem', margin: '0 auto', display: 'block' }} />
                    <h3>No files yet</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Upload images, documents, or any other assets.</p>
                    <button onClick={() => fileInputRef.current.click()} className="btn btn-secondary">
                        Upload your first file
                    </button>
                </div>
            ) : (
                /* File Grid */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {files.map((file) => {
                        const isImage = file.metadata?.mimetype?.startsWith('image/');
                        return (
                            <div key={file.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                {/* Preview Area */}
                                <div style={{
                                    height: '140px',
                                    backgroundColor: '#111',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottom: '1px solid var(--color-border)',
                                    position: 'relative'
                                }}>
                                    {isImage ? (
                                        <img src={file.publicUrl} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <File size={48} style={{ opacity: 0.5 }} />
                                    )}
                                </div>

                                {/* Details Area */}
                                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontWeight: 500, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }} title={file.name}>
                                        {file.name.split('_').slice(1).join('_') || file.name}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                                        {formatBytes(file.metadata?.size)}
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                        <a href={file.publicUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}>
                                            <ExternalLink size={14} /> View
                                        </a>
                                        <button
                                            onClick={() => handleDelete(file.path)}
                                            className="btn btn-ghost"
                                            style={{ color: 'var(--color-danger)', padding: '6px' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}