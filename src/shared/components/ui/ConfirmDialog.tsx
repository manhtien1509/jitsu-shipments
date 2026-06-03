import { Dialog } from './Dialog';

interface Props {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  const confirmCls =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-blue-600 hover:bg-blue-700';

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className={`px-3 py-1.5 text-sm rounded-md text-white disabled:opacity-50 ${confirmCls}`}
      >
        {loading ? 'Please wait...' : confirmText}
      </button>
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} title={title} footer={footer}>
      <div className="text-sm text-gray-700">{message}</div>
    </Dialog>
  );
}