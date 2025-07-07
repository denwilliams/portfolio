import { useState, useEffect, useRef } from 'react'

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: `👋 Hey there! I'm Alex's portfolio assistant. I'm here to tell you all about Alex's incredible journey in tech!

Alex is a passionate full-stack developer with 6+ years of experience building scalable web applications and AI-powered solutions. Currently leading a team of 8 developers at TechFlow Inc., specializing in React, Node.js, Python, and cloud architecture.

🚀 Recent highlights:
• Led development of an AI chatbot that increased customer engagement by 340%
• Architected microservices infrastructure serving 2M+ daily users
• Open source contributor with 1.2k GitHub stars across projects

What would you like to know more about? Feel free to ask anything!`
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const responses = [
    "Great question! Alex has extensive experience with JavaScript, React, Node.js, Python, AWS, Docker, and Kubernetes. They're also well-versed in AI/ML technologies including TensorFlow and PyTorch.",
    "Alex has worked on some amazing projects! From e-commerce platforms handling millions of transactions to AI-powered recommendation systems. Would you like to hear about a specific project?",
    "Alex currently leads a team of 8 developers at TechFlow Inc. They're known for mentoring junior developers and implementing agile methodologies that improved team productivity by 45%.",
    "Alex holds a Computer Science degree from Stanford University and is AWS Solutions Architect certified. They're also Google Cloud Professional certified.",
    "You can reach Alex at alex.chen@email.com or connect on LinkedIn. They're always open to discussing new opportunities and collaborations!"
  ]

  const suggestions = [
    "Tell me about Alex's technical skills",
    "What projects has Alex worked on?",
    "Alex's leadership experience",
    "Education and certifications",
    "How to get in touch with Alex"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)]
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: suggestion
    }

    setMessages(prev => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)]
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
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
            <div className="message-content">
              {message.content.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < message.content.split('\n').length - 1 && <br />}
                </span>
              ))}
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
          placeholder="Ask me anything about Alex's background..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="send-btn" onClick={handleSendMessage}>
          →
        </button>
      </div>
    </div>
  )
}

export default ChatInterface