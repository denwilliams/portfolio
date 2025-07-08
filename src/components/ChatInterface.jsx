import { useState, useEffect, useRef } from 'react'

// Generate short unique ID (8 characters)
const generateShortId = () => {
  return Math.random().toString(36).substring(2, 10)
}

const ChatInterface = () => {
  // Initialize session ID from localStorage or generate new one
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('chatSessionId')
    if (stored) return stored
    const newId = generateShortId()
    localStorage.setItem('chatSessionId', newId)
    return newId
  })

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: `👋 Hey there! I'm Dennis's portfolio assistant. I'm here to tell you all about Dennis's incredible journey in tech!

Dennis is a seasoned CTO and tech leader with extensive experience building scalable systems and leading high-performing teams. Currently working as a CTO and software engineer, specializing in full-stack development, cloud architecture, and technical leadership.

🚀 What would you like to know more about? Feel free to ask anything!`
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const suggestions = [
    "Tell me about Dennis's technical skills",
    "What projects has Dennis worked on?",
    "Dennis's leadership experience",
    "Education and certifications",
    "How to get in touch with Dennis"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage = {
      id: messages.length + 2,
      sender: 'ai',
      content: 'Thinking...',
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await fetch('https://dens-n8n.fly.dev/webhook/profile-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: currentInput,
          sessionId: sessionId
        })
      })

      const data = await response.json()
      console.log('AI Response:', data) 
      
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: data.output || "I'm sorry, I couldn't process your request at the moment. Please try again."
      }
      
      // Replace typing indicator with actual response
      setMessages(prev => prev.slice(0, -1).concat(aiResponse))
    } catch (error) {
      console.error('Error sending message:', error)
      const errorResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      }
      setMessages(prev => prev.slice(0, -1).concat(errorResponse))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleSuggestionClick = async (suggestion) => {
    if (isLoading) return

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: suggestion
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Add typing indicator
    const typingMessage = {
      id: messages.length + 2,
      sender: 'ai',
      content: 'Thinking...',
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await fetch('https://dens-n8n.fly.dev/webhook/profile-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: suggestion,
          sessionId: sessionId
        })
      })

      const data = await response.json()
      
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: data.output || "I'm sorry, I couldn't process your request at the moment. Please try again."
      }
      
      // Replace typing indicator with actual response
      setMessages(prev => prev.slice(0, -1).concat(aiResponse))
    } catch (error) {
      console.error('Error sending message:', error)
      const errorResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      }
      setMessages(prev => prev.slice(0, -1).concat(errorResponse))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="ai-indicator"></div>
        <div className="chat-title">Portfolio Assistant</div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <div className={`message-avatar ${message.sender === 'ai' ? 'ai-avatar' : 'user-avatar'}`}>
              {message.sender === 'ai' ? 'AI' : 'You'}
            </div>
            <div className={`message-content ${message.isTyping ? 'typing' : ''}`}>
              {message.isTyping ? (
                <span className="typing-indicator">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                message.content.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < message.content.split('\n').length - 1 && <br />}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="suggested-responses">
        <div className="suggestions-title">💡 Try asking about:</div>
        <div className="suggestion-buttons">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-btn"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          className="input-field"
          placeholder="Ask me anything about Dennis's background..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="send-btn" onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? '⏳' : '→'}
        </button>
      </div>
    </div>
  )
}

export default ChatInterface