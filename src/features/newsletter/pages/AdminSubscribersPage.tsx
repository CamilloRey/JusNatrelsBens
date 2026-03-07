import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { Icon }     from '@/shared/ui/Icon';
import { inputSt, labelSt } from '@/shared/constants/styles';

export default function AdminSubscribersPage() {
  const { subscribers, updateSubscribers } = useData();
  const [composing, setComposing] = useState(false);
  const [subject,   setSubject]   = useState('');
  const [body,      setBody]      = useState('');
  const [sent,      setSent]      = useState(false);

  const activeCount = subscribers.filter(s => s.active).length;
  const toggle = (id: string) => updateSubscribers(subscribers.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const remove = (id: string) => updateSubscribers(subscribers.filter(s => s.id !== id));

  const sendNewsletter = () => {
    setSent(true); setComposing(false);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      {sent && (
        <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}44`, borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon type="check" size={18} color={C.green} />
          <span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>Infolettre envoyée à {activeCount} abonnés !</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Abonnés actifs</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: C.dark, margin: 0 }}>{activeCount}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Total inscrits</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: C.dark, margin: 0 }}>{subscribers.length}</p>
        </div>
      </div>

      {composing ? (
        <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 600, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: 0 }}>Composer une infolettre</h3>
            <button onClick={() => setComposing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Icon type="x" color={C.muted} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelSt}>Objet</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} style={inputSt} placeholder="Ex: Découvrez nos nouveaux jus d'été !" />
            </div>
            <div>
              <label style={labelSt}>Message</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={6}
                style={{ ...inputSt, resize: 'vertical', fontFamily: 'inherit' }}
                placeholder="Bonjour ! Nous avons de belles nouveautés..." />
            </div>
            <p style={{ fontSize: 12, color: C.muted }}>Sera envoyé à {activeCount} abonnés actifs</p>
            <button onClick={sendNewsletter} disabled={!subject || !body}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !subject || !body ? 0.5 : 1 }}>
              <Icon type="send" size={16} color="#fff" /> Envoyer l'infolettre
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setComposing(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 24 }}>
          <Icon type="mail" size={16} color="#fff" /> Nouvelle infolettre
        </button>
      )}

      <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>Liste des abonnés</span>
        </div>
        {subscribers.map(s => (
          <div key={s.id} style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.active ? C.green : '#d1d5db' }} />
            <span style={{ flex: 1, fontSize: 14, color: C.text }}>{s.email}</span>
            <span style={{ fontSize: 12, color: C.muted }}>{s.date}</span>
            <button onClick={() => toggle(s.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 12, color: s.active ? '#dc2626' : C.green, fontWeight: 500 }}>
              {s.active ? 'Désactiver' : 'Activer'}
            </button>
            <button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Icon type="trash" size={14} color="#dc2626" />
            </button>
          </div>
        ))}
        {subscribers.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted, fontSize: 14 }}>Aucun abonné pour l'instant.</div>
        )}
      </div>
    </div>
  );
}
