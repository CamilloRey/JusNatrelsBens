import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes. Mode hors-ligne activé.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/* ─────────────────── HELPERS CRUD ─────────────────── */

const TABLE_MAP = {
  'bens-products':    'products',
  'bens-reviews':     'reviews',
  'bens-blogs':       'blogs',
  'bens-locations':   'locations',
  'bens-subscribers': 'subscribers',
  'bens-settings':    'settings',
  'bens-activity':    'activity',
  'bens-messages':    'messages',
};

/**
 * Charger les données depuis Supabase.
 * Retourne `fallback` si Supabase n'est pas configuré ou si aucune donnée n'existe.
 */
export const loadData = async (key, fallback) => {
  if (!supabase) return fallback;
  const table = TABLE_MAP[key];
  if (!table) return fallback;

  try {
    if (table === 'settings') {
      const { data, error } = await supabase
        .from('settings')
        .select('data')
        .eq('id', 1)
        .single();
      if (error || !data) return fallback;
      return data.data;
    }

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
};

/**
 * Sauvegarder les données dans Supabase.
 * Stratégie : supprime tous les enregistrements existants, puis réinsère.
 * Convient aux petites tables (< 1 000 lignes).
 */
export const saveData = async (key, val) => {
  if (!supabase) return;
  const table = TABLE_MAP[key];
  if (!table) return;

  try {
    if (table === 'settings') {
      await supabase.from('settings').upsert({ id: 1, data: val });
      return;
    }

    // Supprimer puis réinsérer (synchronisation complète)
    await supabase.from(table).delete().not('id', 'is', null);
    if (Array.isArray(val) && val.length > 0) {
      const { error } = await supabase.from(table).insert(val);
      if (error) console.error(`[Supabase] Erreur insert ${table}:`, error);
    }
  } catch (e) {
    console.error(`[Supabase] Erreur saveData ${key}:`, e);
  }
};

/* ─────────────────── STOCKAGE D'IMAGES ─────────────────── */

const IMAGE_BUCKET = 'product-images';

/**
 * Téléverser une image vers Supabase Storage et retourner son URL publique.
 * @param {File} file - Fichier image à uploader
 * @param {string} folder - Sous-dossier (ex: 'products', 'hero')
 * @returns {Promise<string|null>} URL publique ou null en cas d'erreur
 */
export const uploadImage = async (file, folder = 'products') => {
  if (!supabase) return null;

  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error('[Supabase Storage] Erreur upload:', uploadError);
    return null;
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};
