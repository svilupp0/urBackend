import { useState } from 'react';
import { Copy, Terminal, Database, Shield, HardDrive, Check, Server } from 'lucide-react';

export default function Docs() {
    const [activeTab, setActiveTab] = useState('intro');

    // Helper Component for Code Blocks
    const CodeBlock = ({ method, url, body, comment }) => {
        const [copied, setCopied] = useState(false);
        const fullUrl = `https://api.urbackend.bitbros.in${url}`; // Using your chosen domain

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
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="badge"
                            style={{
                                backgroundColor: method === 'GET' ? 'rgba(59, 130, 246, 0.2)' : method === 'POST' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: method === 'GET' ? '#60a5fa' : method === 'POST' ? '#4ade80' : '#f87171',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                            {method}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ccc' }}>{url}</span>
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
                    <div>
                        <h2 className="page-title" style={{ marginBottom: '1rem' }}>Introduction</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            Welcome to the urBackend API documentation. You can use this API to manage users, store data, and upload files for your applications.
                        </p>

                        <div className="card">
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Server size={18} /> Base URL
                            </h3>
                            <code className="input-field" style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                                https://api.urbackend.bitbros.in
                            </code>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                All API requests must include your <code>x-api-key</code> header. You can find this key in your Project Dashboard.
                            </p>
                        </div>
                    </div>
                );

            case 'auth':
                return (
                    <div>
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
                    </div>
                );

            case 'data':
                return (
                    <div>
                        <h2 className="page-title">Database</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            Read and write JSON data to your collections.
                        </p>

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>1. Insert Data</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Replace <code>:collectionName</code> with your table name (e.g., products).</p>
                        <CodeBlock
                            method="POST"
                            url="/api/data/:collectionName"
                            body={{ name: "MacBook Pro", price: 1299, inStock: true }}
                            comment="Add a new item to a collection"
                        />

                        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>2. Fetch Data</h3>
                        <CodeBlock
                            method="GET"
                            url="/api/data/:collectionName"
                            comment="Get all items from a collection"
                        />
                    </div>
                );

            case 'storage':
                return (
                    <div>
                        <h2 className="page-title">Storage</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            Upload images and files directly to the cloud.
                        </p>

                        <div className="card" style={{ borderLeft: '4px solid var(--color-warning)', marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.9rem' }}>
                                <strong>Note:</strong> For file uploads, use <code>FormData</code> instead of JSON.
                            </p>
                        </div>

                        <h3 style={{ fontSize: '1.1rem' }}>Upload File</h3>
                        <div className="card" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#111', border: '1px solid #333', marginTop: '1rem' }}>
                            <div style={{ padding: '16px', overflowX: 'auto' }}>
                                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: '#e5e5e5', lineHeight: 1.6 }}>{`
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('https://api.urbackend.bitbros.in/api/storage/upload', {
    method: 'POST',
    headers: {
        'x-api-key': 'YOUR_API_KEY_HERE'
    },
    body: formData
});

const result = await response.json();
console.log("File URL:", result.url);
`}</pre>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container" style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', paddingTop: '2rem' }}>

            {/* --- LEFT SIDEBAR (Navigation) --- */}
            <div style={{ width: '240px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', fontWeight: 700 }}>
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
                                onClick={() => setActiveTab(item.id)}
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
            <div style={{ flex: 1, minWidth: 0 }}>
                {renderContent()}
            </div>
        </div>
    );
}