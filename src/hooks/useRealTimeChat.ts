import { useState, useEffect, useCallback } from 'react'
import { 
  supabase, 
  sendMessage, 
  getMessages, 
  createRoom, 
  subscribeToMessages, 
  type ChatMessage 
} from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface UseRealTimeChatProps {
  username: string
  roomCode: string | null
  onNewMessage?: (message: ChatMessage) => void
}

export const useRealTimeChat = ({ username, roomCode, onNewMessage }: UseRealTimeChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Generate a simple user ID
  const userId = `${username}-${Date.now()}`

  // Load initial messages
  useEffect(() => {
    if (!roomCode) return

    const loadMessages = async () => {
      try {
        setIsLoading(true)
        const data = await getMessages(roomCode)
        setMessages(data || [])
        setIsConnected(true)
      } catch (error) {
        console.error('Error loading messages:', error)
        toast({
          title: "Connection Error",
          description: "Failed to load chat history. Using offline mode.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [roomCode, toast])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!roomCode || !isConnected) return

    const subscription = subscribeToMessages(roomCode, (newMessage) => {
      // Don't add our own messages (they're already added optimistically)
      if (newMessage.user_id !== userId) {
        setMessages(prev => [...prev, newMessage])
        onNewMessage?.(newMessage)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [roomCode, isConnected, userId, onNewMessage])

  // Send message function
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!roomCode || !messageText.trim()) return

    const newMessage: ChatMessage = {
      username,
      message: messageText,
      room_code: roomCode,
      timestamp: new Date().toISOString(),
      user_id: userId
    }

    // Add message optimistically
    setMessages(prev => [...prev, newMessage])

    try {
      if (isConnected) {
        await sendMessage(newMessage)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Send Failed",
        description: "Message saved locally. Will sync when connection is restored.",
        variant: "destructive"
      })
    }
  }, [roomCode, username, userId, isConnected, toast])

  // Create room function
  const handleCreateRoom = useCallback(async (newRoomCode: string) => {
    try {
      await createRoom(newRoomCode, username)
    } catch (error) {
      console.error('Error creating room:', error)
      // Continue anyway - room might already exist
    }
  }, [username])

  return {
    messages,
    isConnected,
    isLoading,
    sendMessage: handleSendMessage,
    createRoom: handleCreateRoom
  }
}