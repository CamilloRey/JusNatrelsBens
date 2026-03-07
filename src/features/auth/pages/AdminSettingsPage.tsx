import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { C }       from '@/shared/constants/colors';
import { Icon }    from '@/shared/ui/Icon';
import { inputSt, labelSt } from '@/shared/constants/styles';
import { formatDate } from '@/shared/utils/format';
import { uploadImage } from '@/lib/api/http-client';

type Tab = 'profile' | 'password' | 'site' | 'photos' | 'activity';

const ACTIVITY_ICONS: Record<string, string> = { auth: '🔐', product: '🍹', review: '⭐', blog: '📝', location: '📍', settings: '⚙️', newsletter: '📧' };
const ACTIVITY_COLORS: Record<string, string> = { auth: '#8b5cf6', product: '#c44536', review: '#f59e0b', blog: '#2a6a4f', location: '#2563eb', settings: '#6b7280', newsletter: '#ec4899' };

export default function AdminSettingsPage() {
  const { settings, updateSettings, activity, logActivity } = useData();
  const [tab,      setTab]      = useState<Tab>('profile');
  const [form,     setForm]     = useState({ ...settings });
  const [saved,    setSaved]    = useState(false);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passMsg,  setPassMsg]  = useState('');
  const [passError, setPassError] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const saveProfile = () => {
    updateSettings({ ...settings, ...form });
    logActivity('Profil modifié', 'Informations entreprise mises à jour', 'settings');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = () => {
    if (passForm.current !== settings.password) { setPassMsg('Mot de passe actuel incorrect.'); setPassError(true); return; }
    if (passForm.newPass.length < 4)             { setPassMsg('Le nouveau mot de passe doit avoir au moins 4 caractères.'); setPassError(true); return; }
    if (passForm.newPass !== passForm.confirm)   { setPassMsg('Les mots de passe ne correspondent pas.'); setPassError(true); return; }
    updateSettings({ ...settings, password: passForm.newPass });
    logActivity('Mot de passe modifié', 'Le mot de passe admin a été changé', 'auth');
    setPassForm({ current: '', newPass: '', confirm: '' });
    setPassMsg('Mot de passe modifié avec succès !'); setPassError(false);
    setTimeout(() => setPassMsg(''), 3000);
  };

  const handleBannerUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingKey(key);
    const url = await uploadImage(file, 'banners');
    if (url) updateSettings({ ...settings, [key]: url });
    else alert("Erreur upload. Vérifiez que le bucket 'product-images' existe dans Supabase.");
    setUploadingKey(null);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile',  label: 'Profil entreprise', icon: 'shop'     },
    { id: 'password', label: 'Sécurité',           icon: 'shield'   },
    { id: 'site',     label: 'Paramètres site',    icon: 'settings' },
    { id: 'photos',   label: 'Photos du site',     icon: 'star'     },
    { id: 'activity', label: "Journal d'activité", icon: 'clock'    },
  ];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: tab === t.id ? `2px solid ${C.red}` : `1px solid ${C.border}`, background: tab === t.id ? `${C.red}12` : '#fff', color: tab === t.id ? C.red : C.muted, cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 600 : 400 }}>
            <Icon type={t.icon as any} size={15} color={tab === t.id ? C.red : C.muted} />
            {t.label}
          </button>
        ))}
      </div>

      {/* PROFIL */}
      {tab === 'profile' && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 640 }}>
          {saved && (
            <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}44`, borderRadius: 10, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon type="check" size={16} color={C.green} /><span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>Profil sauvegardé avec succès !</span>
            </div>
          )}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, margin: '0 0 6px', color: C.dark }}>Profil de l'entreprise</h3>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Ces informations apparaissent sur votre site public et dans vos communications.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={labelSt}>Nom de l'entreprise</label><input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} style={inputSt} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={labelSt}>Courriel</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputSt} /></div>
              <div><label style={labelSt}>Téléphone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputSt} /></div>
            </div>
            <div><label style={labelSt}>Adresse</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputSt} /></div>
            <div><label style={labelSt}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputSt, resize: 'vertical', fontFamily: 'inherit' }} /></div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 12 }}>Réseaux sociaux</p>
              {[
                { icon: '📘', key: 'facebook',  placeholder: 'Lien Facebook'  },
                { icon: '📸', key: 'instagram', placeholder: 'Lien Instagram' },
                { icon: '🎵', key: 'tiktok',    placeholder: 'Lien TikTok'    },
              ].map(({ icon, key, placeholder }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{icon}</span>
                  <input placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ ...inputSt, flex: 1 }} />
                </div>
              ))}
            </div>
            <button onClick={saveProfile} style={{ padding: '14px', borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Sauvegarder le profil
            </button>
          </div>
        </div>
      )}

      {/* SÉCURITÉ */}
      {tab === 'password' && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#8b5cf615', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon type="shield" size={22} color="#8b5cf6" />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>Changer le mot de passe</h3>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>Modifiez le mot de passe d'accès admin</p>
              </div>
            </div>
            {passMsg && (
              <div style={{ background: passError ? '#fef2f2' : `${C.green}12`, border: `1px solid ${passError ? '#fca5a5' : C.green + '44'}`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, color: passError ? '#dc2626' : C.green, fontWeight: 500 }}>
                {passMsg}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={labelSt}>Mot de passe actuel</label><input type="password" value={passForm.current} onChange={e => setPassForm({ ...passForm, current: e.target.value })} style={inputSt} /></div>
              <div><label style={labelSt}>Nouveau mot de passe</label><input type="password" value={passForm.newPass} onChange={e => setPassForm({ ...passForm, newPass: e.target.value })} style={inputSt} /></div>
              <div><label style={labelSt}>Confirmer le nouveau mot de passe</label><input type="password" value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} style={inputSt} /></div>
              <button onClick={changePassword} disabled={!passForm.current || !passForm.newPass || !passForm.confirm}
                style={{ padding: '14px', borderRadius: 12, border: 'none', background: '#8b5cf6', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !passForm.current || !passForm.newPass || !passForm.confirm ? 0.5 : 1 }}>
                Modifier le mot de passe
              </button>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: C.dark }}>Dernières connexions</h4>
            {activity.filter(a => a.type === 'auth').slice(0, 5).map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, color: C.text }}>{a.action}</span>
                <span style={{ fontSize: 12, color: C.muted }}>{formatDate(a.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARAMÈTRES SITE */}
      {tab === 'site' && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 640 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, margin: '0 0 6px', color: C.dark }}>Paramètres du site</h3>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Personnalisez le contenu affiché sur votre site web.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={labelSt}>Titre principal (Hero)</label><input value={form.heroTitle} onChange={e => setForm({ ...form, heroTitle: e.target.value })} style={inputSt} /></div>
            <div><label style={labelSt}>Sous-titre (Hero)</label><textarea value={form.heroSubtitle} onChange={e => setForm({ ...form, heroSubtitle: e.target.value })} rows={2} style={{ ...inputSt, resize: 'vertical', fontFamily: 'inherit' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelSt}>Devise</label>
                <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} style={inputSt}>
                  <option value="CAD">CAD ($)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div><label style={labelSt}>Taux de taxe (%)</label><input type="number" step="0.001" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })} style={inputSt} /></div>
            </div>
            <div><label style={labelSt}>Note de livraison</label><input value={form.deliveryNote} onChange={e => setForm({ ...form, deliveryNote: e.target.value })} style={inputSt} /></div>
            <div><label style={labelSt}>URL du site web</label><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} style={inputSt} /></div>
            <button onClick={saveProfile} style={{ padding: '14px', borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Sauvegarder les paramètres
            </button>
          </div>
        </div>
      )}

      {/* PHOTOS DU SITE */}
      {tab === 'photos' && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, margin: '0 0 6px', color: C.dark }}>Photos & Arrière-plans du site</h3>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Remplacez les photos qui apparaissent sur les différentes pages de votre site.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {([
                { key: 'bannerHero',     label: 'Bannière Accueil (Hero)',     page: 'Page Accueil'  },
                { key: 'bannerProducts', label: 'Bannière Produits',           page: 'Page Produits' },
                { key: 'bannerEvents',   label: 'Bannière Événements',         page: 'Page Événements' },
                { key: 'bannerAbout',    label: 'Bannière À propos',           page: 'Page À propos' },
                { key: 'bannerContact',  label: 'Bannière Contact',            page: 'Page Contact'  },
              ] as { key: keyof typeof settings; label: string; page: string }[]).map(({ key, label, page }) => {
                const current = settings[key] as string | undefined;
                const isUp = uploadingKey === key;
                return (
                  <div key={key} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.light }}>
                    <div style={{ width: 110, height: 70, borderRadius: 8, overflow: 'hidden', background: '#e5e7eb', flexShrink: 0 }}>
                      {current
                        ? <img src={current} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🖼️</div>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: C.dark, margin: '0 0 2px', fontSize: 14 }}>{label}</p>
                      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 10px' }}>{page}</p>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <label style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12, cursor: isUp ? 'wait' : 'pointer', color: C.text }}>
                          {isUp ? 'Téléversement…' : '📁 Changer la photo'}
                          <input type="file" accept="image/*" onChange={e => handleBannerUpload(key as string, e)} style={{ display: 'none' }} disabled={!!uploadingKey} />
                        </label>
                        {current && (
                          <button onClick={() => updateSettings({ ...settings, [key]: '' })}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 12 }}>✕ Supprimer</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* JOURNAL D'ACTIVITÉ */}
      {tab === 'activity' && (
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: 700 }}>
          <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>Journal d'activité</h3>
              <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>Historique des 50 dernières actions dans le panneau admin</p>
            </div>
            <span style={{ fontSize: 12, color: C.muted, background: C.light, padding: '4px 12px', borderRadius: 6 }}>{activity.length} entrées</span>
          </div>
          <div style={{ maxHeight: 500, overflow: 'auto' }}>
            {activity.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>📋</span>
                <p>Aucune activité enregistrée.</p>
              </div>
            ) : activity.map((a, i) => (
              <div key={a.id} style={{ padding: '14px 22px', borderBottom: i < activity.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACTIVITY_COLORS[a.type] || '#6b7280'}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                  {ACTIVITY_ICONS[a.type] || '📋'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, margin: 0 }}>{a.action}</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.detail}</p>
                </div>
                <span style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap', flexShrink: 0 }}>{formatDate(a.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
