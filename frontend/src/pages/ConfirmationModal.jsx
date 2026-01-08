import React from "react";
import { AlertTriangle } from "lucide-react";

function ConfirmationModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-white w-[380px] rounded-2xl shadow-lg px-6 py-5 confirmationModal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="text-red-600 mt-1" size={22} />
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6 confirmationModal">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 confirmationModalBtn"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 confirmationModalBtn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
