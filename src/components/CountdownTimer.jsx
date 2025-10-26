import { useEffect, useState } from 'react'

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const t = new Date(targetDate).getTime()
    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, t - now)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex gap-4">
      {['days','hours','minutes','seconds'].map((key) => (
        <div key={key} className="card text-center">
          <div className="text-3xl font-bold text-primary">
            {timeLeft[key]}
          </div>
          <div className="text-xs uppercase tracking-wide text-slate-500">{key}</div>
        </div>
      ))}
    </div>
  )
}