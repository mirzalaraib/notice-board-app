import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 mx-4 max-w-md w-full animate-fade-in">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 text-center">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}