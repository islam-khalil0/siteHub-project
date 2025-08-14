import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  // Auth
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Clients
  async getClients() {
    const { data, error } = await supabase.from('clients').select('*')
    if (error) throw error
    return data
  },

  async getClient(id) {
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async createClient(client) {
    const { data, error } = await supabase.from('clients').insert(client).select().single()
    if (error) throw error
    return data
  },

  async updateClient(id, client) {
    const { data, error } = await supabase.from('clients').update(client).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteClient(id) {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) throw error
  },

  // Websites
  async getWebsites() {
    const { data, error } = await supabase.from('websites').select('*, clients(*)')
    if (error) throw error
    return data
  },

  async getWebsite(id) {
    const { data, error } = await supabase.from('websites').select('*, clients(*)').eq('id', id).single()
    if (error) throw error
    return data
  },

  async createWebsite(website) {
    const { data, error } = await supabase.from('websites').insert(website).select().single()
    if (error) throw error
    return data
  },

  async updateWebsite(id, website) {
    const { data, error } = await supabase.from('websites').update(website).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteWebsite(id) {
    const { error } = await supabase.from('websites').delete().eq('id', id)
    if (error) throw error
  }
}
