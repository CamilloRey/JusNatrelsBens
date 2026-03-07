import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { Icon }     from '@/shared/ui/Icon';
import { formatDate } from '@/shared/utils/format';

export default function AdminMessagesPage() {
  const { messages, updateMessages } = useData();
  const unread = messages.filter(m => !m.read).length;

  const markRead = (id: string) => updateMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
  const markResponded = (id: string) => updateMessages(messages.map(m => m.id === id ? { ...m, read: true, responded: true } : m));
  const remove = (id: string) => { if (confirm('Supprimer ce message ?')) updateMessages(messages.filter(m => m.id !== id)); };

  return (
    <div>
      {unread > 0 && (
        <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}30`, borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: C.red, fontWeight: 600 }}>
          📬 {unread} message{unread > 1 ? 's' : ''} non lu{unread > 1 ? 's' : ''}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[...messages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(m => (
          <div key={m.id}
            style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: `1px solid ${m.read ? C.border : C.red + '44'}`, borderLeft: m.read ? `1px solid ${C.border}` : `4px solid ${C.red}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{m.name}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{m.email}</span>
                  {m.responded && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#dcfce7', color: '#166534', fontWeight: 600 }}>✓ Répondu</span>}
                </div>
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.6, margin: '0 0 6px' }}>{m.message}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{formatDate(m.date)}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {!m.read && (
                  <button onClick={() => markRead(m.id)}
                    style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 12, cursor: 'pointer' }}>
                    Marquer lu
                  </button>
                )}
                {!m.responded && (
                  <a href={`mailto:${m.email}?subject=Re: votre message`} onClick={() => markResponded(m.id)}
                    style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 12, cursor: 'pointer', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
                    Répondre
                  </a>
                )}
                <button onClick={() => remove(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, alignSelf: 'center' }}>
                  <Icon type="trash" size={14} color="#dc2626" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
