'use client'

import { ArrowUp, Loader2, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Generate short unique ID (8 characters)
const generateShortId = () => {
  return Math.random().toString(36).substring(2, 10)
}

interface Message {
  id: number
  sender: 'ai' | 'user'
  content: string
  isTyping?: boolean
}

const ChatInterface = () => {
  // Initialize session ID from localStorage or generate new one
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return ''
    const stored = localStorage.getItem('chatSessionId')
    if (stored) return stored
    const newId = generateShortId()
    localStorage.setItem('chatSessionId', newId)
    return newId
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      content: `👋 Hey there! I'm Dennis Williams - thanks for stopping by!

I'm a seasoned CTO and tech leader with extensive experience building scalable systems and leading high-performing teams. I specialize in full-stack development, cloud architecture, and technical leadership.

🚀 What would you like to know about me? Feel free to ask anything!`,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    'What are your technical skills?',
    'What projects have you worked on?',
    'Tell me about your leadership experience',
    "What's your education background?",
    'How can I get in touch with you?',
  ]

  const placeholders = [
    "What's your technical expertise?",
    'What projects have you built?',
    'Tell me about your leadership style...',
    'What are your core skills?',
    'How can I contact you?',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  // Rotate placeholder text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue
    if (!textToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: textToSend,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Add streaming message placeholder with typing state
    const aiMessageId = messages.length + 2
    const streamingMessage: Message = {
      id: aiMessageId,
      sender: 'ai',
      content: '',
      isTyping: true,
    }
    setMessages((prev) => [...prev, streamingMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: textToSend,
          sessionId: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Read the stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedText += chunk

          // Update the message with accumulated text
          // Keep isTyping true until we have actual content
          const hasContent = accumulatedText.trim().length > 0
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: accumulatedText, isTyping: !hasContent }
                : msg,
            ),
          )
        }
      }

      // If we didn't get any text, show error
      if (!accumulatedText) {
        throw new Error('No response received')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorResponse: Message = {
        id: aiMessageId,
        sender: 'ai',
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      }
      setMessages((prev) => prev.slice(0, -1).concat(errorResponse))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return
    handleSendMessage(suggestion)
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Sparkles className="w-5 h-5" />
        <div>
          <h2 className="text-lg font-semibold">Hi, I'm Dennis Williams</h2>
          <p className="text-sm text-muted-foreground">
            CTO, Tech Leader & Software Engineer
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                {message.sender === 'ai' ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 max-w-[80%]">
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'ai'
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {message.isTyping ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (only show when not loading and few messages) */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Pinned to Bottom */}
      <div className="border-t bg-background p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={placeholders[placeholderIndex]}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
