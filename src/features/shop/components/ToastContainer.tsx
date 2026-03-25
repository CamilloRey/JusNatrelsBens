import { useToast } from '../context/ToastContext';
import { C } from '@/shared/constants/colors';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: toast.type === 'success' ? '#1B4D38' : toast.type === 'error' ? '#c44536' : C.primary,
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideIn 0.3s ease-out, slideOut 0.3s ease-out 2.7s forwards',
            pointerEvents: 'auto',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '300px',
            wordWrap: 'break-word',
          }}
        >
          <span style={{ fontSize: '16px' }}>
            {toast.type === 'success' && '?'}
            {toast.type === 'error' && '?'}
            {toast.type === 'info' && '?'}
          </span>
          <span>{toast.message}</span>
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(400px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            @keyframes slideOut {
              from {
                transform: translateX(0);
                opacity: 1;
              }
              to {
                transform: translateX(400px);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
