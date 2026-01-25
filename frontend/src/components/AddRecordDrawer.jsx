import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";

/**
 * AddRecordDrawer
 * A slide-over drawer component for adding records to a collection.
 * Optimized for collections with many columns by using a responsive grid layout.
 *
 * @param {boolean} isOpen - Whether the drawer is open
 * @param {function} onClose - Function to close the drawer
 * @param {function} onSubmit - Function to handle form submission (receives form data)
 * @param {array} fields - Array of field objects { key, type, required } from the collection model
 * @param {boolean} isSubmitting - Loading state for submission
 */
export default function AddRecordDrawer({
  isOpen,
  onClose,
  onSubmit,
  fields = [],
  isSubmitting = false,
  initialData = null,
}) {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  // Handle outside click to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (key, value) => {
    let finalValue = value;

    // Basic type conversion
    // (Number conversion handled in handleSubmit to avoid input issues)

    setFormData((prev) => ({
      ...prev,
      [key]: finalValue,
    }));

    // Clear error for this field if it exists
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    const formattedData = { ...formData };

    fields.forEach(field => {
      const val = formattedData[field.key];

      // Check required
      if (field.required && (val === undefined || val === "" || val === null)) {
        newErrors[field.key] = "This field is required";
      }

      // Convert types for submission
      if (field.type === "Number" && val !== undefined && val !== "") {
        const num = Number(val);
        if (isNaN(num)) {
          newErrors[field.key] = "Must be a valid number";
        } else {
          formattedData[field.key] = num;
        }
      }

      if (field.type === "Boolean") {
        formattedData[field.key] = val === "true" || val === true;
      }

      // Convert Date fields to ISO string
      if (field.type === "Date" && val) {
        formattedData[field.key] = new Date(val).toISOString();
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formattedData);
  };

  // Determine grid columns based on field count
  // If > 8 fields, use 2 columns on wider screens
  const isWideForm = fields.length > 8;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="drawer-backdrop"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
          animation: "fadeIn 0.2s ease-out"
        }}
      />

      {/* Drawer Panel */}
      <div
        className="drawer-panel glass-panel"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: isWideForm ? "600px" : "450px",
          maxWidth: "100%",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          borderLeft: "1px solid var(--color-border)",
          background: "var(--color-bg-card)",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.3)"
        }}
      >
        {/* Header */}
        <div className="drawer-header" style={{
          padding: "1.5rem",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>{initialData ? "Edit Record" : "Add New Record"}</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: "4px 0 0 0" }}>
              {initialData ? "Update the details for this document." : "Fill in the details for the new document."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body" style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem"
        }}>
          <form id="add-record-form" onSubmit={handleSubmit}>
            <div style={{
              display: "grid",
              gridTemplateColumns: isWideForm ? "repeat(2, 1fr)" : "1fr",
              gap: "1.25rem",
            }}>
              {fields.map((field) => (
                <div
                  key={field.key}
                  className="form-group"
                  style={{
                    gridColumn: (isWideForm && (field.type === "String" && field.key.length > 20)) ? "span 2" : "auto"
                  }}
                >
                  <label className="form-label" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    color: "var(--color-text-secondary)"
                  }}>
                    <span>
                      {field.key}
                      {field.required && <span className="text-danger" style={{ marginLeft: "4px" }}>*</span>}
                    </span>
                    <span className="field-type-hint" style={{
                      fontSize: "0.7rem",
                      color: "var(--color-text-muted)",
                      background: "rgba(255,255,255,0.05)",
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}>{field.type}</span>
                  </label>

                  {renderInput(field, formData[field.key], handleChange, errors[field.key])}

                  {errors[field.key] && (
                    <div className="error-message" style={{
                      color: "#ef4444",
                      fontSize: "0.8rem",
                      marginTop: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <AlertCircle size={12} />
                      {errors[field.key]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="drawer-footer" style={{
          padding: "1.25rem 1.5rem",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          background: "rgba(0,0,0,0.2)"
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-record-form"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ minWidth: "120px" }}
          >
            {isSubmitting ? (
              <span className="animate-spin" style={{ display: "inline-block", border: "2px solid transparent", borderTopColor: "currentColor", borderRadius: "50%", width: "16px", height: "16px" }}></span>
            ) : (
              <>
                <Check size={18} />
                <span>{initialData ? "Update" : "Save Record"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        .form-input {
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--color-border);
            padding: 10px 12px;
            border-radius: 6px;
            color: var(--color-text-main);
            font-size: 0.95rem;
            transition: all 0.2s;
        }
        .form-input:focus {
            outline: none;
            border-color: var(--color-primary);
            background: rgba(0, 0, 0, 0.3);
            box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.1);
        }
        .form-select {
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--color-border);
            padding: 10px 12px;
            border-radius: 6px;
            color: var(--color-text-main);
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23aaaaaa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 12px top 50%;
            background-size: 10px auto;
        }
      `}</style>
    </>
  );
}

function renderInput(field, value, onChange, error) {
  const val = value === undefined || value === null ? "" : value;

  if (field.type === "Boolean") {
    return (
      <select
        className="form-select"
        value={val === "" ? "" : String(val)}
        onChange={(e) => onChange(field.key, e.target.value, "Boolean")}
        style={error ? { borderColor: "#ef4444" } : {}}
      >
        <option value="">Select...</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  if (field.type === "Date") {
    return (
      <input
        type="datetime-local"
        className="form-input"
        value={val}
        onChange={(e) => onChange(field.key, e.target.value, "Date")}
        style={error ? { borderColor: "#ef4444" } : {}}
      />
    );
  }

  return (
    <input
      type={field.type === "Number" ? "number" : "text"}
      className="form-input"
      placeholder={`Enter ${field.key}`}
      value={val}
      onChange={(e) => onChange(field.key, e.target.value, field.type)}
      step={field.type === "Number" ? "any" : undefined}
      style={error ? { borderColor: "#ef4444" } : {}}
    />
  );
}
