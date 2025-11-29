import { useState } from 'react';
import { Copy, Terminal, Database, Shield, HardDrive, Check, Server, Menu, X, ChevronDown } from 'lucide-react';
import { API_URL } from '../config';

export default function Docs() {
    const [activeTab, setActiveTab] = useState('intro');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Helper Component for Code Blocks
    const CodeBlock = ({ method, url, body, comment }) => {
        const [copied, setCopied] = useState(false);
        const fullUrl = `${API_URL}${url}`;

        const codeString = `
// ${comment || 'Example Request'}
const response = await fetch('${fullUrl}', {
    method: '${method}',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_PUBLIC_API_KEY'${method !== 'GET' ? ',\n        // "Authorization": "Bearer USER_TOKEN" (If accessing protected user data)' : ''}
    }${body ? `,
    body: JSON.stringify(${JSON.stringify(body, null, 4).replace(/"/g, "'")})` : ''}
});

const data = await response.json();
console.log(data);
        `.trim();

        const handleCopy = () => {
            navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <div className="card" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#111', border: '1px solid #333', margin: '1.5rem 0' }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge"
                            style={{
                                backgroundColor: method === 'GET' ? 'rgba(59, 130, 246, 0.2)' : method === 'POST' ? 'rgba(34, 197, 94, 0.2)' : (method === 'DELETE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'),
                                color: method === 'GET' ? '#60a5fa' : method === 'POST' ? '#4ade80' : (method === 'DELETE' ? '#f87171' : '#fbbf24'),
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                            {method}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ccc', wordBreak: 'break-all' }}>{url}</span>
                    </div>
                    <button onClick={handleCopy} className="btn btn-ghost" style={{ padding: '4px', color: '#888' }}>
                        {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                    </button>
                </div>
                <div style={{ padding: '16px', overflowX: 'auto' }}>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: '#e5e5e5', lineHeight: 1.6 }}>
                        {codeString}
                    </pre>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'intro':
                return (
                    <div className="fade-in">
                        <h2 className="page-title" style={{ marginBottom: '1rem' }}>Introduction</h2>

                        <div className="card" style={{
                            borderLeft: '4px solid var(--color-danger)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            marginBottom: '2rem',
                            padding: '1rem'
                        }}>
                            <h3 style={{ color: 'var(--color-danger)', fontSize: '1.1rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={18} /> Security Warning
                            </h3>
                            <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--color-text-main)' }}>
                                Your <strong>x-api-key</strong> grants <strong>Admin Access</strong> (Read/Write/Delete).
                                <br />
                                ❌ <strong>NEVER</strong> use this key in client-side code.
                                <br />
                                ✅ <strong>ONLY</strong> use this key in secure server-side environments.
                            </p>
                        </div>

                        <div className="card">
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Server size={18} /> Base URL
                            </h3>
                            <code className="input-field" style={{ fontFamily: 'monospace', color: 'var(--color-primary)', display: 'block', width: '100%', overflowX: 'auto' }}>
                                {API_URL}
                            </code>
                        </div>
                    </div>
                );

            case 'auth':
                return (
                    <div className="fade-in">
                        <h2 className="page-title">Authentication</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            Built-in user management. Users are stored in the <code>users</code> collection.
                        </p>

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>1. Sign Up User</h3>
                        <CodeBlock
                            method="POST"
                            url="/api/userAuth/signup"
                            body={{ email: "user@example.com", password: "securePassword123", name: "John Doe" }}
                            comment="Register a new user"
                        />

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>2. Login User</h3>
                        <CodeBlock
                            method="POST"
                            url="/api/userAuth/login"
                            body={{ email: "user@example.com", password: "securePassword123" }}
                            comment="Login and receive a JWT Token"
                        />

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>3. Get Profile (Me)</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Send the Token in <code>Authorization: Bearer TOKEN</code> header.</p>
                        <CodeBlock
                            method="GET"
                            url="/api/userAuth/me"
                            comment="Get current logged in user details"
                        />
                    </div>
                );

            case 'data':
                return (
                    <div className="fade-in">
                        <h2 className="page-title">Database</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            Perform CRUD operations on your collections.
                        </p>

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>1. Get All Items</h3>
                        <CodeBlock
                            method="GET"
                            url="/api/data/:collectionName"
                            comment="Fetch all documents"
                        />

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>2. Get Single Item</h3>
                        <CodeBlock
                            method="GET"
                            url="/api/data/:collectionName/:id"
                            comment="Fetch a document by ID"
                        />

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>3. Insert Data</h3>
                        <CodeBlock
                            method="POST"
                            url="/api/data/:collectionName"
                            body={{ name: "MacBook Pro", price: 1299, inStock: true }}
                            comment="Add a new item"
                        />

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>4. Update Data</h3>
                        <CodeBlock
                            method="PUT"
                            url="/api/data/:collectionName/:id"
                            body={{ price: 1199, inStock: false }}
                            comment="Update specific fields of a document"
                        />

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>5. Delete Data</h3>
                        <CodeBlock
                            method="DELETE"
                            url="/api/data/:collectionName/:id"
                            comment="Permanently remove a document"
                        />
                    </div>
                );

case 'storage':
                return (
                    <div className="fade-in">
                        <h2 className="page-title">Storage</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            Upload, manage, and delete files in the cloud.
                        </p>

                        <div className="card" style={{ borderLeft: '4px solid var(--color-warning)', marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.9rem' }}>
                                <strong>Note:</strong> For file uploads, use <code>FormData</code> instead of JSON.
                            </p>
                        </div>

                        <h3 style={{ fontSize: '1.1rem' }}>1. Upload File</h3>
                        <div className="card" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#111', border: '1px solid #333', marginTop: '1rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '16px', overflowX: 'auto' }}>
                                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: '#e5e5e5', lineHeight: 1.6 }}>{`
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('${API_URL}/api/storage/upload', {
    method: 'POST',
    headers: {
        'x-api-key': 'YOUR_API_KEY_HERE'
    },
    body: formData
});

const result = await response.json();
// Returns: { url: "...", path: "project_id/filename.jpg" }
console.log("File URL:", result.url);
`}</pre>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>2. Delete File</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Provide the <code>path</code> received from the upload response.</p>
                        <CodeBlock
                            method="DELETE"
                            url="/api/storage/file"
                            body={{ path: "PROJECT_ID/171569483_image.png" }}
                            comment="Delete a specific file"
                        />

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>3. Delete All Files</h3>
                        <div className="card" style={{ borderLeft: '4px solid var(--color-danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)', marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-danger)' }}>
                                ⚠️ <strong>Warning:</strong> This will permanently delete all files in your project bucket.
                            </p>
                        </div>
                        <CodeBlock
                            method="DELETE"
                            url="/api/storage/all"
                            comment="Clear entire storage bucket"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="docs-container container">

            {/* --- MOBILE TOGGLE --- */}
            <div className="docs-mobile-header">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Menu size={16} />
                        {activeTab === 'intro' ? 'Introduction' :
                            activeTab === 'auth' ? 'Authentication' :
                                activeTab === 'data' ? 'Database & API' : 'Storage'}
                    </span>
                    <ChevronDown size={16} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
                </button>
            </div>

            {/* --- LEFT SIDEBAR (Navigation) --- */}
            <div className={`docs-sidebar ${isMenuOpen ? 'open' : ''}`}>
                <h3 className="docs-nav-title">
                    Documentation
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {[
                        { id: 'intro', label: 'Introduction', icon: Terminal },
                        { id: 'auth', label: 'Authentication', icon: Shield },
                        { id: 'data', label: 'Database & API', icon: Database },
                        { id: 'storage', label: 'Storage', icon: HardDrive },
                    ].map(item => (
                        <li key={item.id} style={{ marginBottom: '4px' }}>
                            <button
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMenuOpen(false);
                                }}
                                className={`btn ${activeTab === item.id ? 'btn-primary' : 'btn-ghost'}`}
                                style={{
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                    backgroundColor: activeTab === item.id ? 'rgba(62, 207, 142, 0.1)' : 'transparent',
                                    color: activeTab === item.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    fontWeight: activeTab === item.id ? 600 : 400
                                }}
                            >
                                <item.icon size={16} /> {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- RIGHT CONTENT --- */}
            <div className="docs-content">
                {renderContent()}
            </div>

            {/* --- RESPONSIVE STYLES --- */}
            <style>{`
                .docs-container {
                    display: flex;
                    gap: 3rem;
                    align-items: flex-start;
                    padding-top: 2rem;
                }
                .docs-sidebar {
                    width: 240px;
                    position: sticky;
                    top: 100px;
                    flex-shrink: 0;
                }
                .docs-content {
                    flex: 1;
                    min-width: 0;
                }
                .docs-mobile-header {
                    display: none;
                    margin-bottom: 1rem;
                }
                .docs-nav-title {
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 1rem;
                    font-weight: 700;
                }
                
                .fade-in { animation: fadeIn 0.3s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

                /* --- MOBILE MEDIA QUERY --- */
                @media (max-width: 768px) {
                    .docs-container {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .docs-mobile-header {
                        display: block;
                        width: 100%;
                    }
                    .docs-sidebar {
                        width: 100%;
                        position: relative;
                        top: 0;
                        display: none;
                        background: var(--color-bg-card);
                        padding: 1rem;
                        border-radius: 8px;
                        border: 1px solid var(--color-border);
                    }
                    .docs-sidebar.open {
                        display: block;
                    }
                    .page-title {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}