import { useEffect } from 'react'
import BackgroundEffects from './components/BackgroundEffects'
import Header from './components/Header'
import ChatInterface from './components/ChatInterface'

function App() {
  useEffect(() => {
    // Add floating animation to chat container
    const chatContainer = document.querySelector('.chat-container')
    if (chatContainer) {
      const interval = setInterval(() => {
        chatContainer.style.transform = `translateY(${Math.sin(Date.now() * 0.001) * 2}px)`
      }, 16)

      return () => clearInterval(interval)
    }
  }, [])

  return (
    <>
      <BackgroundEffects />
      <div className="container">
        <Header />
        <ChatInterface />
      </div>
    </>
  )
}

export default App