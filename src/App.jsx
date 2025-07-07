import BackgroundEffects from './components/BackgroundEffects'
import Header from './components/Header'
import ChatInterface from './components/ChatInterface'

function App() {
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