import { supabase } from '@/lib/supabase/client';

/* ─────────────────────────────────────────────────────────────
   Helpers CRUD génériques pour Supabase.
   Chaque service feature l'utilise plutôt qu'accéder
   directement à `supabase` (couche d'abstraction).
───────────────────────────────────────────────────────────── */

type TableName =
  | 'products'
  | 'reviews'
  | 'blogs'
  | 'locations'
  | 'subscribers'
  | 'activity'
  | 'messages'
  | 'events'
  | 'stock'
  | 'finance';

/** Charger tous les enregistrements d'une table, triés par created_at. */
export async function fetchAll<T>(table: TableName, fallback: T[]): Promise<T[]> {
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !data) return fallback;
    return data as T[];
  } catch (e) {
    console.error(`[Supabase] fetchAll ${table}:`, e);
    return fallback;
  }
}

/** Charger les paramètres (table settings, ligne unique id=1). */
export async function fetchSettings<T>(fallback: T): Promise<T> {
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 1)
      .single();
    if (error || !data) {
      console.warn('[Supabase] settings indisponibles, fallback local utilisé.');
      return fallback;
    }
    return data.data as T;
  } catch (e) {
    console.error('[Supabase] fetchSettings:', e);
    return fallback;
  }
}

/**
 * Synchroniser une table complète.
 * Stratégie : upsert par id + suppression ciblée des lignes retirées.
 * Plus sûr qu'un DELETE global en cas de concurrence / interruption.
 */
export async function syncAll<T extends { id: string }>(
  table: TableName,
  items: T[]
): Promise<void> {
  if (!supabase) return;
  try {
    if (items.length === 0) {
      const { error } = await supabase.from(table).delete().not('id', 'is', null);
      if (error) console.error(`[Supabase] syncAll ${table} delete-all:`, error);
      return;
    }

    const { error: upsertError } = await supabase
      .from(table)
      .upsert(items as never[], { onConflict: 'id' });

    if (upsertError) {
      console.error(`[Supabase] syncAll ${table} upsert:`, upsertError);
      return;
    }

    const { data: existingRows, error: readError } = await supabase
      .from(table)
      .select('id');

    if (readError || !existingRows) {
      console.error(`[Supabase] syncAll ${table} read ids:`, readError);
      return;
    }

    const incomingIds = new Set(items.map((item) => item.id));
    const staleIds = existingRows
      .map((row) => row.id as string)
      .filter((id) => !incomingIds.has(id));

    if (staleIds.length > 0) {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .in('id', staleIds);

      if (deleteError) {
        console.error(`[Supabase] syncAll ${table} delete stale:`, deleteError);
      }
    }
  } catch (e) {
    console.error(`[Supabase] syncAll ${table}:`, e);
  }
}

/** Sauvegarder les paramètres (upsert). */
export async function syncSettings<T>(settings: T): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, data: settings as never });
    if (error) {
      console.error('[Supabase] syncSettings upsert:', error);
    }
  } catch (e) {
    console.error('[Supabase] syncSettings:', e);
  }
}

/** Upload d'image vers Supabase Storage. */
export async function uploadImage(file: File, folder = 'products'): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) { console.error('[Storage] upload:', error); return null; }
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}
