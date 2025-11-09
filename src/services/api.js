import { supabase, isSupabaseConfigured } from '../supabase/client'

function tableForTab(tab) {
  switch (tab) {
    case 'library':
      return 'library'
    case 'notices':
      return 'notices'
    case 'events':
      return 'events'
    case 'blogs':
      return 'blogs'
    case 'members':
      return 'memberships'
    case 'memberships':
      return 'memberships'
    default:
      return null
  }
}

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured')
  }
}

export async function getList(tab) {
  ensureSupabase()
  const table = tableForTab(tab)
  if (!table) return []
  const { data, error } = await supabase.from(table).select('*')
  if (error) throw error
  return data || []
}

export async function createItem(tab, payload) {
  ensureSupabase()
  const table = tableForTab(tab)
  if (!table) throw new Error('Invalid tab')
  const { data, error } = await supabase.from(table).insert(payload).select()
  if (error) throw error
  return Array.isArray(data) ? data[0] : data
}

export async function deleteItem(tab, id) {
  ensureSupabase()
  const table = tableForTab(tab)
  if (!table) throw new Error('Invalid tab')
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

export async function getById(tab, id) {
  ensureSupabase()
  const table = tableForTab(tab)
  if (!table) throw new Error('Invalid tab')
  const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data || null
}

export const apiBase = 'supabase'