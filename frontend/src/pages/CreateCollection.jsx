import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

function CreateCollection() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [name, ZN] = useState('');
    const [fields, setFields] = useState([
        { key: '', type: 'String', required: false }
    ]);
    const [loading, setLoading] = useState(false);

    // Add a new field row
    const addField = () => {
        setFields([...fields, { key: '', type: 'String', required: false }]);
    };

    // Remove a field row
    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

    // Handle field changes
    const handleFieldChange = (index, prop, value) => {
        const newFields = [...fields];
        newFields[index][prop] = value;
        setFields(newFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return toast.error("Collection name is required");

        // Basic validation: Check if keys are empty
        if (fields.some(f => !f.key)) return toast.error("All fields must have a name (Key)");

        setLoading(true);
        try {
            await axios.post('http://localhost:1234/api/projects/collection', {
                projectId,
                collectionName: name,
                schema: fields
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Collection Created!");
            navigate(`/project/${projectId}`);
        } catch (err) {
            toast.error(err.response?.data || "Failed to create collection");
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const inputStyle = {
        padding: '10px',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-main)',
        color: 'var(--color-text-main)',
        width: '100%'
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(`/project/${projectId}`)}
                className="btn"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1rem', paddingLeft: 0, color: 'var(--color-text-muted)' }}
            >
                <ArrowLeft size={18} /> Back to Project
            </button>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>Create New Collection</h2>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Collection Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => ZN(e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. users, products, orders"
                    />
                </div>

                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Schema Fields</h3>

                {fields.map((field, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Field Name (key)"
                            value={field.key}
                            onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                            style={{ ...inputStyle, flex: 2 }}
                        />
                        <select
                            value={field.type}
                            onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                            style={{ ...inputStyle, flex: 1 }}
                        >
                            <option value="String">String</option>
                            <option value="Number">Number</option>
                            <option value="Boolean">Boolean</option>
                            <option value="Date">Date</option>
                        </select>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                            />
                            <small>Req.</small>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="btn"
                            style={{ color: 'var(--color-error)' }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addField}
                    className="btn"
                    style={{ marginTop: '10px', border: '1px dashed var(--color-border)', width: '100%', color: 'var(--color-text-muted)' }}
                >
                    <Plus size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Add Field
                </button>

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px' }}
                    >
                        {loading ? 'Creating...' : 'Create Collection'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateCollection;