import React from "react";
import { X, Calendar, Type, Hash, ToggleLeft, FileText, Link as LinkIcon, AlertCircle } from "lucide-react";

export default function RowDetailDrawer({ isOpen, onClose, record, fields }) {
    if (!isOpen || !record) return null;

    const getIconForType = (type) => {
        switch (type) {
            case "String": return <Type size={14} />;
            case "Number": return <Hash size={14} />;
            case "Boolean": return <ToggleLeft size={14} />;
            case "Date": return <Calendar size={14} />;
            case "Object": return <FileText size={14} />;
            case "Array": return <LinkIcon size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    const renderValue = (value) => {
        if (value === null || value === undefined) return <span className="text-muted italic">Empty</span>;

        if (typeof value === "boolean") {
            return (
                <span className={`status-badge ${value ? "success" : "danger"}`}>
                    {String(value)}
                </span>
            );
        }

        if (typeof value === "object") {
            return <pre className="json-preview">{JSON.stringify(value, null, 2)}</pre>;
        }

        return String(value);
    };

    return (
        <>
            <div
                className={`drawer-backdrop ${isOpen ? "open" : ""}`}
                onClick={onClose}
            />
            <div className={`drawer right ${isOpen ? "open" : ""}`}>
                <div className="drawer-header glass-panel">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-md text-primary">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold leading-tight">Record Details</h2>
                            <p className="text-xs text-muted font-mono mt-1">ID: {record._id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <div className="drawer-content custom-scrollbar">
                    <div className="record-grid">
                        {fields.map((field) => (
                            <div key={field.key} className="record-field-item">
                                <div className="field-label">
                                    <div className="flex items-center gap-2 text-muted">
                                        {getIconForType(field.type)}
                                        {field.key}
                                    </div>
                                    <span className="type-badge">{field.type}</span>
                                </div>
                                <div className="field-value">
                                    {renderValue(record[field.key])}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="system-fields-section">
                        <h4 className="section-label">SYSTEM METADATA</h4>
                        <div className="record-field-item">
                            <div className="field-label">_id</div>
                            <div className="field-value font-mono">{record._id}</div>
                        </div>
                        {record.createdAt && (
                            <div className="record-field-item">
                                <div className="field-label">createdAt</div>
                                <div className="field-value">{new Date(record.createdAt).toLocaleString()}</div>
                            </div>
                        )}
                        {record.updatedAt && (
                            <div className="record-field-item">
                                <div className="field-label">updatedAt</div>
                                <div className="field-value">{new Date(record.updatedAt).toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .record-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 1.5rem;
                }
                
                .record-field-item {
                    background: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    padding: 1rem;
                    transition: all 0.2s;
                }
                
                .record-field-item:hover {
                    border-color: var(--color-primary);
                }

                .field-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                
                .field-value {
                    font-size: 0.95rem;
                    word-break: break-word;
                    line-height: 1.6;
                    color: var(--color-text-main);
                }
                
                .system-fields-section {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    border-top: 1px solid var(--color-border);
                    background: rgba(0,0,0,0.2);
                }
                
                .section-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #555;
                    margin-bottom: 1rem;
                    letter-spacing: 0.05em;
                }
                
                .json-preview {
                    background: #111;
                    padding: 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    overflow: auto;
                    max-height: 200px;
                }

                .text-primary { color: var(--color-primary); }
                .text-muted { color: var(--color-text-muted); }
            `}</style>
        </>
    );
}
