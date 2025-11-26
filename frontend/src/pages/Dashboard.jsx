import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'; // 1. useNavigate add kiya
import { Plus, Folder, Server } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate(); // 2. Hook initialize kiya

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

    const headerStyle = {
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem'
    };
    
    const gridStyle = {
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem'
    };

    const cardStyle = {
        textDecoration: 'none',
        transition: 'transform 0.2s ease',
        cursor: 'pointer'
    };

    if (isLoading) return <p style={{color: 'var(--color-text-muted)'}}>Loading projects...</p>;

    return (
        <div>
            <div style={headerStyle}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--color-text-main)' }}>Projects</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '5px' }}>
                        Manage your backend services.
                    </p>
                </div>
                {/* 3. Button par onClick lagaya */}
                <button 
                    onClick={() => navigate('/create-project')}
                    className="btn btn-primary" 
                    style={{display: 'flex', alignItems: 'center', gap: '8px'}}
                >
                    <Plus size={18} /> New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                        <Server size={48} style={{ opacity: 0.5 }} />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>No projects found</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Create your first backend project to get started.
                    </p>
                </div>
            ) : (
                <div style={gridStyle}>
                    {projects.map((project) => (
                        <Link 
                            to={`/project/${project._id}`} 
                            key={project._id} 
                            style={cardStyle}
                        >
                            <div className="card" style={{ height: '100%', position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                    <div style={{ 
                                        padding: '10px', 
                                        borderRadius: '8px', 
                                        backgroundColor: 'rgba(62, 207, 142, 0.1)',
                                        color: 'var(--color-primary)'
                                    }}>
                                        <Folder size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
                                        {project.name}
                                    </h3>
                                </div>
                                <p style={{ 
                                    color: 'var(--color-text-muted)', 
                                    fontSize: '0.9rem', 
                                    lineHeight: '1.5',
                                    marginBottom: '1rem'
                                }}>
                                    {project.description || "No description provided."}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}