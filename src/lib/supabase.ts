import { createClient } from '@supabase/supabase-js'

// Use demo/public Supabase instance for development
const supabaseUrl = 'https://demo.supabase.io'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ChatMessage {
  id?: string
  username: string
  message: string
  room_code: string
  timestamp: string
  user_id: string
}

export interface ChatRoom {
  id?: string
  room_code: string
  created_at: string
  created_by: string
}

// Message functions
export const sendMessage = async (message: ChatMessage) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      username: message.username,
      message: message.message,
      room_code: message.room_code,
      timestamp: message.timestamp,
      user_id: message.user_id
    }])
    .select()

  if (error) throw error
  return data
}

export const getMessages = async (roomCode: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('room_code', roomCode)
    .order('timestamp', { ascending: true })

  if (error) throw error
  return data
}

// Room functions
export const createRoom = async (roomCode: string, createdBy: string) => {
  const { data, error } = await supabase
    .from('chat_rooms')
    .insert([{
      room_code: roomCode,
      created_by: createdBy,
      created_at: new Date().toISOString()
    }])
    .select()

  if (error) throw error
  return data
}

export const getRoomInfo = async (roomCode: string) => {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('room_code', roomCode)
    .single()

  if (error) throw error
  return data
}

// Subscribe to real-time messages
export const subscribeToMessages = (roomCode: string, callback: (message: ChatMessage) => void) => {
  return supabase
    .channel(`room:${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_code=eq.${roomCode}`
      },
      (payload) => {
        callback(payload.new as ChatMessage)
      }
    )
    .subscribe()
}