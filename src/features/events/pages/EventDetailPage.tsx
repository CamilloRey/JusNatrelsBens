import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { ROUTES } from '@/shared/constants/routes';
import { C } from '@/shared/constants/colors';
import type { AttendanceRequest } from '../types/event.types';

const TYPE_EMOJIS: Record<string, string> = {
  'Marche': '🌍', 'Festival': '🎉', 'Degustation': '🥤', 'Atelier': '👨‍🍳', 'Evenement': '📅',
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { events, updateEvents } = useData();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const event = events.find(e => e.id === id);

  const handleAttendanceRequest = () => {
    if (!event || !formData.name || !formData.email) return;

    const request: AttendanceRequest = {
      id: `att_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      message: formData.message || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updated = events.map(e =>
      e.id === event.id
        ? { ...e, attendanceRequests: [...(e.attendanceRequests || []), request] }
        : e
    );
    updateEvents(updated);
    setSubmitted(true);
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  if (!event) {
    return (
      <section className="page-shell" style={{ textAlign: 'center', paddingBottom: 20 }}>
        <p className="page-subtitle" style={{ marginTop: 0 }}>Evenement non trouve</p>
        <button type="button" className="btn-light anim-btn" onClick={() => navigate(ROUTES.events)}>
          ← Retour aux evenements
        </button>
      </section>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  const emoji = TYPE_EMOJIS[event.type] || '📅';
  const approvedCount = (event.attendanceRequests || []).filter(r => r.status === 'approved').length;
  const isFull = event.maxAttendees ? approvedCount >= event.maxAttendees : false;

  return (
    <div>
      <SEO title={event.title} description={event.description} url={`https://lesjusnatuelsbens.com/evenements/${id}`} />

      <section className="page-shell" style={{ paddingTop: 20 }}>
        <button type="button" onClick={() => navigate(ROUTES.events)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', color: C.hibiscus, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '8px 0' }}>
          ← Retour aux evenements
        </button>

        <div style={{ marginTop: 32, paddingBottom: 40, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ display: 'inline-block', padding: '4px 12px', background: C.hibiscus, color: '#fff', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>
            {event.type}
          </span>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontFamily: "'Playfair Display', serif", fontWeight: 800, color: C.dark, margin: '0 0 16px', lineHeight: 1.2 }}>
            {event.title}
          </h1>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 14, color: C.muted, fontWeight: 600 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>📅</span>
              <div>
                <div>{formattedDate}</div>
                {event.time && <div style={{ fontSize: 12, fontWeight: 400 }}>{event.time}</div>}
              </div>
            </div>
            {event.location && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>📍</span>
                <div>
                  <div>{event.location}</div>
                  {event.address && <div style={{ fontSize: 12, fontWeight: 400 }}>{event.address}</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 48, maxWidth: 800 }}>
          {/* Hero Image */}
          <div style={{
            height: 400,
            background: event.img ? `url(${event.img}) center/cover` : `linear-gradient(135deg, ${C.hibiscus}15, ${C.gold}15)`,
            borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 120, marginBottom: 48, overflow: 'hidden',
          }}>
            {!event.img && emoji}
          </div>

          {/* Description */}
          <div style={{ fontSize: 16, lineHeight: 1.8, color: C.text, marginBottom: 48 }}>
            <p>{event.description}</p>
          </div>

          {/* Details */}
          <div style={{ padding: 32, background: C.cream, borderRadius: 16, marginBottom: 48, border: `1px solid ${C.border}` }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: C.dark, margin: '0 0 24px' }}>
              Details de l'evenement
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Date</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.dark }}>{formattedDate}</div>
              </div>
              {event.time && <div><div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Horaire</div><div style={{ fontSize: 16, fontWeight: 600, color: C.dark }}>{event.time}</div></div>}
              {event.location && <div><div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Lieu</div><div style={{ fontSize: 16, fontWeight: 600, color: C.dark }}>{event.location}</div></div>}
              {event.address && <div><div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Adresse</div><div style={{ fontSize: 16, fontWeight: 600, color: C.dark }}>{event.address}</div></div>}
              <div><div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Type</div><div style={{ fontSize: 16, fontWeight: 600, color: C.dark }}>{event.type}</div></div>
            </div>

            {event.address && (
              <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location} ${event.address}`)}`, '_blank')}
                style={{ marginTop: 20, padding: '12px 24px', borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                📍 Voir sur Google Maps
              </button>
            )}
          </div>

          {/* ATTENDANCE REQUEST SECTION */}
          {event.attendanceEnabled && (
            <div style={{
              padding: 32,
              background: `linear-gradient(135deg, ${C.hibiscus}08, ${C.gold}06)`,
              borderRadius: 16,
              marginBottom: 48,
              border: `2px solid ${C.hibiscus}20`,
            }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: C.dark, margin: '0 0 8px' }}>
                Participer a cet evenement
              </h3>
              <p style={{ fontSize: 14, color: C.muted, margin: '0 0 20px' }}>
                {isFull
                  ? 'Cet evenement est complet.'
                  : event.maxAttendees
                    ? `${approvedCount}/${event.maxAttendees} places confirmees`
                    : 'Places disponibles - Envoyez votre demande de participation'
                }
              </p>

              {submitted && (
                <div style={{
                  padding: '16px 20px', background: '#dcfce7', borderRadius: 12,
                  border: '1px solid #86efac', marginBottom: 16,
                }}>
                  <p style={{ fontSize: 14, color: '#166534', fontWeight: 600, margin: 0 }}>
                    ✅ Votre demande a ete envoyee ! Nous vous contacterons pour confirmer.
                  </p>
                </div>
              )}

              {!isFull && !submitted && !showForm && (
                <button onClick={() => setShowForm(true)}
                  style={{
                    padding: '14px 28px', borderRadius: 12, border: 'none',
                    background: C.hibiscus, color: '#fff', fontSize: 15,
                    fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
                >
                  🙋 Demander a participer
                </button>
              )}

              {showForm && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase' }}>Nom complet *</label>
                    <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Votre nom" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase' }}>Email *</label>
                    <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="votre@email.com" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase' }}>Telephone</label>
                    <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="(514) 555-0123" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase' }}>Message (optionnel)</label>
                    <textarea value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} rows={3}
                      placeholder="Un message pour nous..." style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleAttendanceRequest} disabled={!formData.name || !formData.email}
                      style={{
                        padding: '12px 24px', borderRadius: 10, border: 'none',
                        background: C.green, color: '#fff', fontSize: 14,
                        fontWeight: 600, cursor: 'pointer',
                        opacity: !formData.name || !formData.email ? 0.5 : 1,
                      }}>
                      Envoyer la demande
                    </button>
                    <button onClick={() => setShowForm(false)}
                      style={{ padding: '12px 24px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.text, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <div style={{
            padding: 32,
            background: `linear-gradient(135deg, ${C.green}08, ${C.gold}06)`,
            borderRadius: 16, textAlign: 'center',
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.dark, margin: '0 0 12px' }}>Vous etes interesse?</h3>
            <p style={{ fontSize: 15, color: C.muted, margin: '0 0 20px' }}>Decouvrez nos produits pour cet evenement</p>
            <button className="btn-solid anim-btn" onClick={() => navigate(ROUTES.products)}
              style={{ padding: '14px 28px', fontSize: 15, fontWeight: 700 }}>
              🛍️ Decouvrir nos produits
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
