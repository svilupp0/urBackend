import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';


function CreateCollection() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [name, setName] = useState('');
    const [fields, setFields] = useState([
        { key: 'id', type: 'String', required: true } // Default ID field suggestion
    ]);
    const [loading, setLoading] = useState(false);

    const addField = () => {
        setFields([...fields, { key: '', type: 'String', required: false }]);
    };

    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

    const handleFieldChange = (index, prop, value) => {
        const newFields = [...fields];
        newFields[index][prop] = value;
        setFields(newFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return toast.error("Collection name is required");
        if (fields.some(f => !f.key)) return toast.error("All fields must have a name");

        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/projects/collection`, {
                projectId,
                collectionName: name,
                schema: fields
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Collection Created!");
            navigate(`/project/${projectId}/database`); // Redirect to Database tab
        } catch (err) {
            toast.error(err.response?.data || "Failed to create collection");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <button
                onClick={() => navigate(`/project/${projectId}`)}
                className="btn btn-ghost"
                style={{ marginBottom: '1rem', paddingLeft: 0 }}
            >
                <ArrowLeft size={18} /> Cancel & Back
            </button>

            <div className="card">
                <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 600 }}>Create New Table</h2>

                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        placeholder="e.g. users, products, orders"
                        autoFocus
                    />
                    <small style={{ color: 'var(--color-text-muted)', marginTop: '5px', display: 'block' }}>
                        This will be the name of your collection in the database.
                    </small>
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Columns</h3>
                        <button
                            type="button"
                            onClick={addField}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.85rem' }}
                        >
                            <Plus size={14} /> Add Column
                        </button>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Name</th>
                                    <th style={{ width: '30%' }}>Type</th>
                                    <th style={{ width: '15%', textAlign: 'center' }}>Required</th>
                                    <th style={{ width: '15%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '8px 16px' }}>
                                            <input
                                                type="text"
                                                placeholder="column_name"
                                                value={field.key}
                                                onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                                                className="input-field"
                                                style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            />
                                        </td>
                                        <td style={{ padding: '8px 16px' }}>
                                            <select
                                                value={field.type}
                                                onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                                                className="input-field"
                                                style={{ border: 'none', background: 'transparent', padding: '0', cursor: 'pointer' }}
                                            >
                                                <option value="String">String</option>
                                                <option value="Number">Number</option>
                                                <option value="Boolean">Boolean</option>
                                                <option value="Date">Date</option>
                                            </select>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                                                style={{ accentColor: 'var(--color-primary)', transform: 'scale(1.2)', cursor: 'pointer' }}
                                            />
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                onClick={() => removeField(index)}
                                                className="btn btn-ghost"
                                                style={{ color: 'var(--color-text-muted)', padding: '4px' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '10px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        Tip: We automatically add a unique <code>_id</code> field to every document.
                    </div>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
                    >
                        {loading ? 'Creating...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateCollection;