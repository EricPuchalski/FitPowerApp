'use client'

import React, { useEffect, useRef } from 'react'

interface FireworksProps {
  active: boolean
}

export default function Fireworks({ active = false }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 5 + 2.5 // Reducir el tamaño inicial de las partículas
        this.speedX = Math.random() * 5 - 2.5 // Reducir la velocidad de las partículas
        this.speedY = Math.random() * 5 - 2.5 // Reducir la velocidad de las partículas
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.1) this.size -= 0.1
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let particles: Particle[] = []

    function createFirework(x: number, y: number) {
      const particleCount = 100 // Mantener el número de partículas por fuego artificial
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y))
      }

      // Reproducir sonido de explosión
      if (audioRef.current) {
        const sounds = ['/explosion0.mp3', '/explosion1.mp3']
        const sound = sounds[Math.floor(Math.random() * sounds.length)]
        audioRef.current.src = sound
        audioRef.current.play().catch((error) => {
          console.error('Error al reproducir el sonido:', error)
        })
      }
    }

    function animate() {
      if (!ctx) return
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        if (particle.size <= 0.1) {
          particles.splice(index, 1)
        } else {
          particle.update()
          particle.draw()
        }
      })

      if (Math.random() < 0.05) {
        createFirework(Math.random() * canvas.width, Math.random() * canvas.height * 0.5)
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [active])

  if (!active) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: 'screen' }}
      />
      <audio ref={audioRef} />
    </>
  )
}
