import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon }     from '@/shared/ui/Icon';
import { geocodeAddress } from '@/lib/api/google-geocode';
import type { Location } from '../types/location.types';

const EMPTY = { name: '', address: '', type: 'Partenaire Local', region: 'Montreal', active: true, phone: '', hours: '', neighborhood: '', lat: '', lng: '' };

type FormState = typeof EMPTY;

export default function AdminLocationsPage() {
  const { locations, updateLocations, logActivity, locationSettings } = useData();
  const TYPES = locationSettings.types;
  const REGIONS = locationSettings.regions;
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    type: locationSettings.types[0] || EMPTY.type,
    region: locationSettings.regions[0] || EMPTY.region,
  });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const startEdit = (l: Location) => {
    setEditing(l.id);
    setForm({
      name:         l.name,
      address:      l.address,
      type:         l.type,
      region:       l.region ?? 'Montreal',
      active:       l.active,
      phone:        l.phone        ?? '',
      hours:        l.hours        ?? '',
      neighborhood: l.neighborhood ?? '',
      lat:          l.coords?.[0]?.toString() ?? '',
      lng:          l.coords?.[1]?.toString() ?? '',
    });
  };

  const handleGeocode = async () => {
    if (!form.address.trim()) {
      setGeoError('Veuillez entrer une adresse avant de générer les coordonnées.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    const result = await geocodeAddress(form.address);
    if (!result) {
      setGeoError('Impossible de trouver cette adresse.');
      setGeoLoading(false);
      return;
    }
    setForm(prev => ({
      ...prev,
      lat: result.lat.toString(),
      lng: result.lng.toString(),
      address: result.formattedAddress || prev.address,
    }));
    setGeoLoading(false);
  };

  const f = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const save = () => {
    const latNum = parseFloat(form.lat);
    const lngNum = parseFloat(form.lng);
    const hasCoords = !isNaN(latNum) && !isNaN(lngNum);
    const payload: Omit<Location, 'id'> = {
      name:         form.name,
      address:      form.address,
      type:         form.type,
      region:       form.region as Location['region'],
      active:       form.active,
      phone:        form.phone        || undefined,
      hours:        form.hours        || undefined,
      neighborhood: form.neighborhood || undefined,
      coords:       hasCoords ? [latNum, lngNum] : undefined,
    };
    if (editing === 'new') {
      const nl: Location = { ...payload, id: 'l' + Date.now() };
      updateLocations([...locations, nl]);
      logActivity('Point de vente ajouté', form.name, 'location');
    } else {
      updateLocations(locations.map(l => l.id === editing ? { ...l, ...payload } : l));
      logActivity('Point de vente modifié', form.name, 'location');
    }
    setEditing(null);
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    updateLocations(locations.filter(l => l.id !== id));
    logActivity('Point de vente supprimé', name, 'location');
  };

  const toggle = (l: Location) => {
    updateLocations(locations.map(x => x.id === l.id ? { ...x, active: !x.active } : x));
  };

  /* ─── EDIT FORM ─── */
  if (editing) return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 580 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>
          {editing === 'new' ? 'Nouveau point de vente' : 'Modifier le point de vente'}
        </h3>
        <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon type="x" color={C.muted} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Nom */}
        <div>
          <label style={labelSt}>Nom *</label>
          <input value={form.name} onChange={e => f('name', e.target.value)} style={inputSt} placeholder="Ex: Marché Jean-Talon" />
        </div>

        {/* Adresse + Quartier */}
        <div>
          <label style={labelSt}>Adresse *</label>
          <input value={form.address} onChange={e => f('address', e.target.value)} style={inputSt} placeholder="Ex: 7070 Av. Henri-Julien, Montréal, QC" />
        </div>
        <div>
          <label style={labelSt}>Quartier</label>
          <input value={form.neighborhood} onChange={e => f('neighborhood', e.target.value)} style={inputSt} placeholder="Ex: Mile-End, Plateau, Verdun…" />
        </div>

        {/* Région */}
        <div>
          <label style={labelSt}>Région</label>
          <select value={form.region} onChange={e => f('region', e.target.value)} style={inputSt}>
            {REGIONS.map(r => (
              <option key={r} value={r}>{r === 'Montreal' ? 'Montréal' : r === 'Rive Sud' ? 'Rive Sud de Montréal' : 'Rive Nord de Montréal'}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label style={labelSt}>Type de point de vente</label>
          <select value={form.type} onChange={e => f('type', e.target.value)} style={inputSt}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Téléphone + Horaires côte à côte */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelSt}>Téléphone</label>
            <input value={form.phone} onChange={e => f('phone', e.target.value)} style={inputSt} placeholder="(514) 555-0100" />
          </div>
          <div>
            <label style={labelSt}>Horaires d'ouverture</label>
            <textarea
              value={form.hours}
              onChange={e => f('hours', e.target.value)}
              rows={2}
              style={{ ...inputSt, resize: 'vertical' as const }}
              placeholder={"Lun–Ven 9h–19h\nSam–Dim 10h–17h"}
            />
            <p style={{ fontSize: 11, color: C.muted, margin: '4px 0 0' }}>
              Séparer chaque ligne pour jours différents
            </p>
          </div>
        </div>

        {/* Coordonnées GPS */}
        <div style={{ padding: 14, background: `${C.green}08`, borderRadius: 10, border: `1px solid ${C.green}25` }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.green, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            📍 Coordonnées GPS (optionnel)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' as const }}>
            <button
              type="button"
              onClick={handleGeocode}
              disabled={geoLoading}
              style={{
                padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.green}`,
                background: geoLoading ? '#f9fafb' : `${C.green}14`,
                color: geoLoading ? C.muted : C.green, fontSize: 12, fontWeight: 700,
                cursor: geoLoading ? 'wait' : 'pointer',
              }}
            >
              {geoLoading ? 'Génération...' : 'Générer les coords depuis Google Maps'}
            </button>
            <span style={{ fontSize: 11, color: C.muted }}>Utilise l’adresse pour récupérer la latitude et la longitude.</span>
          </div>
          {geoError && <p style={{ fontSize: 12, color: '#dc2626', margin: '0 0 8px' }}>{geoError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelSt}>Latitude</label>
              <input
                type="number"
                step="any"
                value={form.lat}
                onChange={e => f('lat', e.target.value)}
                style={inputSt}
                placeholder="45.5304"
              />
            </div>
            <div>
              <label style={labelSt}>Longitude</label>
              <input
                type="number"
                step="any"
                value={form.lng}
                onChange={e => f('lng', e.target.value)}
                style={inputSt}
                placeholder="-73.6148"
              />
            </div>
          </div>
          <p style={{ fontSize: 11, color: C.muted, margin: '8px 0 0' }}>
            Pour trouver les coordonnées : clic droit sur Google Maps → "Copier les coordonnées"
          </p>
        </div>

        {/* Actif toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => f('active', !form.active)}
            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.active ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative', flexShrink: 0 }}
          >
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.active ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
          <span style={{ fontSize: 14, color: C.text }}>Visible sur le site</span>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={!form.name || !form.address}
          style={{ padding: 14, borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.name || !form.address ? 0.5 : 1 }}
        >
          {editing === 'new' ? 'Ajouter le point de vente' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );

  /* ─── LIST VIEW ─── */
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: 0, color: C.dark }}>
          Points de vente ({locations.length})
        </h2>
        <button
          type="button"
          onClick={() => { setEditing('new'); setForm(EMPTY); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <Icon type="plus" size={16} color="#fff" /> Nouveau point
        </button>
      </div>

      {locations.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: C.muted }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>📍</span>
          <p>Aucun point de vente. Ajoutez votre premier emplacement !</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {locations.map(l => (
          <div key={l.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Icon */}
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.green}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon type="map" size={18} color={C.green} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{l.name}</span>
                <span style={{ fontSize: 10, padding: '1px 8px', borderRadius: 6, background: l.type === 'Atelier Signature' ? '#dcfce7' : '#f3f4f6', color: l.type === 'Atelier Signature' ? '#166534' : C.muted, fontWeight: 600 }}>
                  {l.type}
                </span>
                {!l.active && (
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#fee2e2', color: '#dc2626', fontWeight: 600 }}>Inactif</span>
                )}
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                {l.address}
                {l.neighborhood && <span style={{ color: C.green }}> · {l.neighborhood}</span>}
                {l.phone         && <span> · {l.phone}</span>}
                {l.hours         && <span> · {l.hours.split('\n')[0]}</span>}
              </p>
            </div>

            {/* Actions */}
            <button onClick={() => toggle(l)} title={l.active ? 'Masquer' : 'Rendre visible'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: C.muted, fontSize: 16 }}>
              {l.active ? '👁' : '👁‍🗨'}
            </button>
            <button onClick={() => startEdit(l)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
              <Icon type="edit" size={16} color={C.muted} />
            </button>
            <button onClick={() => remove(l.id, l.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
              <Icon type="trash" size={16} color="#dc2626" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
