import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, HardDrive, Server, Database, RefreshCw, Clock, Globe } from 'lucide-react';
import { API_URL } from '../config';

export default function Analytics() {
    const { projectId } = useParams();
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const res = await axios.get(`${API_URL}/api/projects/${projectId}/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [projectId, token]);

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', color: '#666' }}>Loading Analytics...</div>;

    // Helper to format bytes
    const formatBytes = (bytes) => {
        if (!bytes) return '0 MB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    // Helper for Status Color
    const getStatusColor = (status) => {
        if (status >= 500) return '#ef4444'; // Red
        if (status >= 400) return '#f59e0b'; // Yellow
        if (status >= 300) return '#3b82f6'; // Blue
        return '#22c55e'; // Green
    };

    return (
        <div className="container">
            {/* Header with Refresh */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Project Analytics</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Real-time metrics for your backend.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="btn btn-secondary"
                    disabled={refreshing}
                    style={{ minWidth: '100px', display: 'flex', justifyContent: 'center' }}
                >
                    <RefreshCw size={16} className={refreshing ? 'spin' : ''} style={{ marginRight: '8px' }} />
                    {refreshing ? 'Updating' : 'Refresh'}
                </button>
            </div>

            {/* Stats Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>

                {/* 1. Total Requests */}
                <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, transform: 'rotate(15deg)' }}>
                        <Activity size={100} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                        <Globe size={16} /> Total Requests
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#fff', letterSpacing: '-1px' }}>
                        {data.totalRequests.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        All-time API hits
                    </div>
                </div>

                {/* 2. File Storage */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                            <HardDrive size={16} /> File Storage
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{formatBytes(data.storage.limit)} Limit</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
                        {formatBytes(data.storage.used)}
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', background: '#2a2a2a', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min((data.storage.used / data.storage.limit) * 100, 100)}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--color-primary), #34d399)',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease'
                        }}></div>
                    </div>
                </div>

                {/* 3. Database Size */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                            <Database size={16} /> Database Size
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{formatBytes(data.database?.limit)} Limit</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
                        {formatBytes(data.database?.used || 0)}
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', background: '#2a2a2a', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min(((data.database?.used || 0) / (data.database?.limit || 1)) * 100, 100)}%`,
                            height: '100%',
                            background: ((data.database?.used || 0) / (data.database?.limit || 1)) > 0.8 ? '#ef4444' : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease'
                        }}></div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Traffic Chart */}
                <div className="card" style={{ height: '350px', padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Traffic Overview</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={data.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="_id"
                                stroke="#666"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#161616', border: '1px solid #333', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#fff', fontSize: '0.85rem' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--color-primary)"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Logs List */}
                <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '350px' }}>
                    <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', position: 'sticky', top: 0 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={18} /> Recent Logs
                        </h3>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1a1a1a', zIndex: 1 }}>
                                <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)' }}>
                                    <th style={{ padding: '10px 16px', fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: '10px 16px', fontWeight: 600 }}>Method</th>
                                    <th style={{ padding: '10px 16px', fontWeight: 600 }}>Path</th>
                                    <th style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'right' }}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#555' }}>
                                            No recent activity
                                        </td>
                                    </tr>
                                ) : (
                                    data.logs.map((log) => (
                                        <tr key={log._id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s' }} className="log-row">
                                            <td style={{ padding: '10px 16px' }}>
                                                <span style={{
                                                    color: getStatusColor(log.status),
                                                    backgroundColor: `${getStatusColor(log.status)}20`,
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700'
                                                }}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 16px', fontWeight: 500 }}>
                                                <span style={{
                                                    color: log.method === 'GET' ? '#60a5fa' :
                                                        log.method === 'POST' ? '#34d399' :
                                                            log.method === 'DELETE' ? '#ef4444' : '#a78bfa'
                                                }}>{log.method}</span>
                                            </td>
                                            <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#ccc' }}>
                                                {log.path.replace('/api/', '/')}
                                            </td>
                                            <td style={{ padding: '10px 16px', color: '#666', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Inline Styles for Spin Animation & Hover */}
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .log-row:hover { background-color: rgba(255,255,255,0.03); }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: #111; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #444; }
            `}</style>
        </div>
    );
}