import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Folder, Server, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:1234/api/projects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(response.data);
            } catch (err) {
                console.error(err);
                toast.error("Could not load projects.");
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchProjects();
    }, [token]);

    if (isLoading) return <div className="container" style={{ color: 'var(--color-text-muted)' }}>Loading projects...</div>;

    return (
        <div className="container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Projects</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Manage your backend services and APIs.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/create-project')}
                    className="btn btn-primary"
                >
                    <Plus size={16} /> New Project
                </button>
            </div>

            {/* Empty State */}
            {projects.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <Server size={48} strokeWidth={1} />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 600 }}>No projects found</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Create your first backend project to get started.
                    </p>
                    <button
                        onClick={() => navigate('/create-project')}
                        className="btn btn-secondary"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                /* Projects Grid */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {projects.map((project) => (
                        <Link
                            to={`/project/${project._id}`}
                            key={project._id}
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                    <div style={{
                                        padding: '10px',
                                        borderRadius: '6px',
                                        backgroundColor: 'rgba(62, 207, 142, 0.1)',
                                        color: 'var(--color-primary)'
                                    }}>
                                        <Folder size={20} />
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
                                        {project.name}
                                    </h3>
                                </div>

                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    marginBottom: '1.5rem',
                                    flex: 1
                                }}>
                                    {project.description || "No description provided."}
                                </p>

                                <div style={{
                                    borderTop: '1px solid var(--color-border)',
                                    paddingTop: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: 'var(--color-primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: 500
                                }}>
                                    <span>View Dashboard</span>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}