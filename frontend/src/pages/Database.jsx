import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, Plus, Database as DbIcon, RefreshCw, Layers } from 'lucide-react';
import { API_URL } from '../config';


export default function Database() {
    const { projectId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [collections, setCollections] = useState([]);
    const [activeCollection, setActiveCollection] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(false);

    // 1. Fetch Project & Collections List
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCollections(res.data.collections);
                // Default to first collection if available
                if (res.data.collections.length > 0) {
                    setActiveCollection(res.data.collections[0]);
                }
            } catch (err) {
                toast.error("Failed to load collections");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId, token]);

    // 2. Fetch Data when Active Collection changes
    useEffect(() => {
        if (!activeCollection) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                const res = await axios.get(`${API_URL}/api/projects/${projectId}/collections/${activeCollection.name}/data`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setData(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load data");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [activeCollection, projectId, token]);

    // 3. Handle Delete
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this row?")) return;

        try {
            await axios.delete(
                `${API_URL}/api/projects/${projectId}/collections/${activeCollection.name}/data/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // UI se remove karo without refresh
            setData(data.filter(item => item._id !== id));
            toast.success("Row deleted");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    if (loading) return <div className="container">Loading Database...</div>;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - var(--header-height))' }}>

            {/* --- LEFT SIDEBAR (Collections List) --- */}
            <div style={{
                width: '240px',
                borderRight: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-sidebar)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tables
                    </h3>
                    <button
                        onClick={() => navigate(`/project/${projectId}/create-collection`)}
                        className="btn btn-ghost"
                        style={{ padding: '4px' }}
                        title="New Table"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {collections.length === 0 && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No tables yet.</p>
                    )}

                    {collections.map(c => (
                        <div
                            key={c._id}
                            onClick={() => setActiveCollection(c)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: activeCollection?._id === c._id ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                backgroundColor: activeCollection?._id === c._id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '2px'
                            }}
                        >
                            <DbIcon size={14} />
                            {c.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT SIDE (Data Table) --- */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-main)', overflow: 'hidden' }}>

                {/* Toolbar */}
                <div style={{
                    padding: '10px 20px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--color-bg-card)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ fontSize: '1rem', margin: 0 }}>
                            {activeCollection ? activeCollection.name : 'Select a table'}
                        </h2>
                        {activeCollection && (
                            <span className="badge">{data.length} rows</span>
                        )}
                    </div>
                    {/* Placeholder for Insert Button (Future) */}
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} disabled>
                        Insert Row (Coming Soon)
                    </button>
                </div>

                {/* Table Area */}
                <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
                    {collections.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                            <Layers size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>You haven't created any tables yet.</p>
                            <button onClick={() => navigate(`/project/${projectId}/create-collection`)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Create your first Table
                            </button>
                        </div>
                    ) : !activeCollection ? (
                        <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Select a table to view data.</div>
                    ) : loadingData ? (
                        <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading data...</div>
                    ) : data.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>
                            <p>This table is empty.</p>
                            <small>Use your API to POST data to <code>/api/data/{activeCollection.name}</code></small>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                <tr>
                                    {/* Generate Headers from Schema + _id */}
                                    <th style={{ width: '100px' }}>_id</th>
                                    {activeCollection.model.map(field => (
                                        <th key={field.key}>{field.key}</th>
                                    ))}
                                    <th style={{ width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={row._id || i}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            {row._id ? row._id.toString().slice(-6) : '...'}
                                        </td>

                                        {activeCollection.model.map(field => (
                                            <td key={field.key} style={{ fontSize: '0.9rem' }}>
                                                {typeof row[field.key] === 'boolean'
                                                    ? (row[field.key] ? 'TRUE' : 'FALSE')
                                                    : row[field.key]?.toString() || ''}
                                            </td>
                                        ))}

                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDelete(row._id)}
                                                className="btn btn-ghost"
                                                style={{ color: 'var(--color-danger)', padding: '4px' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}