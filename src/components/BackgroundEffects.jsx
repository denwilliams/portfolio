import { useEffect } from 'react'

const BackgroundEffects = () => {
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.querySelector('.bg-particles')
      if (!particlesContainer) return

      // Clear existing particles
      particlesContainer.innerHTML = ''
      
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 6 + 's'
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's'
        particlesContainer.appendChild(particle)
      }
    }

    createParticles()
  }, [])

  return (
    <>
      <div className="bg-particles"></div>
      <div className="gradient-overlay"></div>
      <div className="floating-icon">💼</div>
      <div className="floating-icon">🚀</div>
      <div className="floating-icon">💡</div>
      <div className="floating-icon">⚡</div>
    </>
  )
}

export default BackgroundEffects