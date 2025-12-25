import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    Database as DbIcon, Plus, Trash2, RefreshCw,
    Code, Table as TableIcon, Search, Menu, X
} from 'lucide-react';
import { API_URL } from '../config';

export default function Database() {
    const { projectId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [project, setProject] = useState(null);
    const [collections, setCollections] = useState([]);
    const [activeCollection, setActiveCollection] = useState(null);
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [viewMode, setViewMode] = useState('table');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newData, setNewData] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fetch Project & Collections
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProject(res.data);
                setCollections(res.data.collections);

                const queryCollection = searchParams.get('collection');
                if (queryCollection) {
                    const found = res.data.collections.find(c => c.name === queryCollection);
                    if (found) setActiveCollection(found);
                } else if (res.data.collections.length > 0) {
                    setActiveCollection(res.data.collections[0]);
                }
            } catch (err) {
                toast.error("Failed to load project");
            }
        };
        fetchProject();
    }, [projectId, token]);

    // Fetch Data on Collection Change
    useEffect(() => {
        if (!activeCollection) return;
        setSearchParams({ collection: activeCollection.name });
        fetchData();
        if (window.innerWidth <= 768) setIsSidebarOpen(false);
    }, [activeCollection]);

    // --- UPDATED FETCH FUNCTION (Internal Route) ---
    const fetchData = async () => {
        if (!activeCollection) return;
        setLoadingData(true);
        try {
            // Changed URL to use Internal Project Route
            const res = await axios.get(`${API_URL}/api/projects/${projectId}/collections/${activeCollection.name}/data`, {
                headers: { Authorization: `Bearer ${token}` }
                // No x-api-key needed
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoadingData(false);
        }
    };

    // --- UPDATED DELETE FUNCTION (Internal Route) ---
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this document?")) return;
        try {
            // Changed URL to use Internal Project Route
            await axios.delete(`${API_URL}/api/projects/${projectId}/collections/${activeCollection.name}/data/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(prev => prev.filter(item => item._id !== id));
            toast.success("Deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete");
        }
    };

    // --- UPDATED ADD FUNCTION (Internal Route) ---
    const handleAddDocument = async (e) => {
        e.preventDefault();
        try {
            const formattedData = { ...newData };
            activeCollection.model.forEach(field => {
                if (field.type === 'Number') formattedData[field.key] = Number(formattedData[field.key]);
                if (field.type === 'Boolean') formattedData[field.key] = formattedData[field.key] === 'true';
            });

            // Changed URL to use Internal Project Route
            await axios.post(`${API_URL}/api/projects/${projectId}/collections/${activeCollection.name}/data`, formattedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Document added");
            setIsAddModalOpen(false);
            setNewData({});
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to add data");
        }
    };

    const renderInput = (field) => {
        const val = newData[field.key] || '';
        if (field.type === 'Boolean') {
            return (
                <select
                    className="input-field"
                    value={val}
                    onChange={e => setNewData({ ...newData, [field.key]: e.target.value })}
                    required={field.required}
                >
                    <option value="">Select...</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            );
        }
        return (
            <input
                type={field.type === 'Number' ? 'number' : field.type === 'Date' ? 'datetime-local' : 'text'}
                className="input-field"
                placeholder={field.key}
                value={val}
                onChange={e => setNewData({ ...newData, [field.key]: e.target.value })}
                required={field.required}
            />
        );
    };

    const EmptyState = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--color-text-muted)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <DbIcon size={24} />
            </div>
            <p>Select a collection to view data</p>
        </div>
    );

    return (
        <div className="container db-container" style={{ maxWidth: '100%', padding: 0, height: 'calc(100vh - var(--header-height))', display: 'flex', position: 'relative', overflow: 'hidden' }}>

            <div
                className={`db-overlay ${isSidebarOpen ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            <div className={`db-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Collections</h3>

                        <button className="mobile-only-btn" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff' }}>
                            <X size={18} />
                        </button>

                        <button className="desktop-only-btn" onClick={() => navigate(`/project/${projectId}/create-collection`)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>
                            <Plus size={16} />
                        </button>
                    </div>

                    <button
                        className="mobile-only-btn btn btn-secondary"
                        onClick={() => navigate(`/project/${projectId}/create-collection`)}
                        style={{ width: '100%', marginBottom: '10px', justifyContent: 'center', gap: '6px' }}
                    >
                        <Plus size={16} /> New Collection
                    </button>


                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                    {collections.map(c => (
                        <div
                            key={c._id}
                            onClick={() => setActiveCollection(c)}
                            style={{
                                padding: '10px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '4px',
                                background: activeCollection?._id === c._id ? 'rgba(62, 207, 142, 0.1)' : 'transparent',
                                color: activeCollection?._id === c._id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                fontWeight: activeCollection?._id === c._id ? 500 : 400
                            }}
                        >
                            <DbIcon size={16} />
                            <span style={{ fontSize: '0.9rem' }}>{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0a', width: '100%' }}>

                {activeCollection ? (
                    <>
                        <div className="db-toolbar" style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.01)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button className="mobile-only-btn" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', padding: 0 }}>
                                    <Menu size={20} />
                                </button>

                                <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{activeCollection.name}</h2>
                                <span style={{ padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    {data.length} records
                                </span>
                            </div>

                            <div className="db-actions" style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '2px' }}>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        style={{ background: viewMode === 'table' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', padding: '6px 10px', borderRadius: '4px', color: viewMode === 'table' ? '#fff' : '#666', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <TableIcon size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('json')}
                                        style={{ background: viewMode === 'json' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', padding: '6px 10px', borderRadius: '4px', color: viewMode === 'json' ? '#fff' : '#666', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <Code size={16} />
                                    </button>
                                </div>
                                <button onClick={fetchData} className="btn btn-secondary" style={{ padding: '8px' }}>
                                    <RefreshCw size={16} className={loadingData ? 'spin' : ''} />
                                </button>
                                <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Plus size={16} /> <span className="desktop-only-text">Add Document</span>
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
                            {loadingData ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading data...</div>
                            ) : data.length === 0 ? (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                    <DbIcon size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>This collection is empty.</p>
                                </div>
                            ) : viewMode === 'table' ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '600px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
                                                <th style={{ padding: '12px 20px', textAlign: 'left', color: '#666', fontWeight: 500, width: '60px' }}>#</th>
                                                {activeCollection.model.map(field => (
                                                    <th key={field.key} style={{ padding: '12px 20px', textAlign: 'left', color: '#888', fontWeight: 500 }}>
                                                        {field.key} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>({field.type})</span>
                                                    </th>
                                                ))}
                                                <th style={{ padding: '12px 20px', textAlign: 'left', color: '#666', fontWeight: 500 }}>_id</th>
                                                <th style={{ width: '50px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, i) => (
                                                <tr key={row._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '12px 20px', color: '#444' }}>{i + 1}</td>
                                                    {activeCollection.model.map(field => (
                                                        <td key={field.key} style={{ padding: '12px 20px', color: '#ddd' }}>
                                                            {typeof row[field.key] === 'boolean'
                                                                ? (row[field.key] ? <span style={{ color: '#3ECF8E' }}>true</span> : <span style={{ color: '#ff5f56' }}>false</span>)
                                                                : String(row[field.key])
                                                            }
                                                        </td>
                                                    ))}
                                                    <td style={{ padding: '12px 20px', color: '#444', fontFamily: 'monospace' }}>{row._id}</td>
                                                    <td style={{ padding: '12px 20px' }}>
                                                        <button onClick={() => handleDelete(row._id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', transition: 'color 0.2s' }} title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={{ padding: '2rem' }}>
                                    <pre style={{ background: '#111', padding: '1.5rem', borderRadius: '8px', color: '#3ECF8E', fontSize: '0.85rem', overflow: 'auto', border: '1px solid #222' }}>
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <button className="mobile-only-btn btn btn-secondary" onClick={() => setIsSidebarOpen(true)} style={{ marginBottom: '20px' }}>
                            <Menu size={18} style={{ marginRight: '8px' }} /> Open Collections
                        </button>
                        <EmptyState />
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)',
                    padding: '1rem'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', border: '1px solid var(--color-border)', padding: '0', background: '#0a0a0a' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Add New Document</h3>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddDocument} style={{ padding: '1.5rem' }}>
                            {activeCollection.model.map(field => (
                                <div key={field.key} style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#aaa' }}>
                                        {field.key} {field.required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
                                    </label>
                                    {renderInput(field)}
                                </div>
                            ))}
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Create Document
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .db-sidebar {
                    width: 260px;
                    border-right: 1px solid var(--color-border);
                    background: var(--color-bg-main);
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.3s ease;
                    z-index: 50;
                }
                .db-toolbar {
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .mobile-only-btn { display: none; }
                .desktop-only-btn { display: block; }
                .desktop-only-text { display: inline; }
                .db-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 40;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                @media (max-width: 768px) {
                    .db-sidebar {
                        position: absolute;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        width: 80%;
                        max-width: 300px;
                        transform: translateX(-100%);
                        border-right: 1px solid #333;
                    }
                    .db-sidebar.open {
                        transform: translateX(0);
                    }
                    .db-overlay.active {
                        opacity: 1;
                        pointer-events: auto;
                    }
                    .mobile-only-btn { display: flex; }
                    .desktop-only-btn { display: none; }
                    .desktop-only-text { display: none; }
                    
                    .db-toolbar {
                        padding: 1rem;
                        gap: 1rem;
                    }
                    .db-actions {
                        gap: 8px !important;
                    }
                }

                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                tr:hover td { background: rgba(255,255,255,0.02); }
                tr:hover button { color: var(--color-danger) !important; }
            `}</style>
        </div>
    );
}