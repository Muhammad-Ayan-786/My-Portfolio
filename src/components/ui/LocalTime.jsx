import { useEffect, useState } from 'react'
import { site } from '../../data/site'

const format = () =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: site.location.timeZone,
  }).format(new Date())

/** Live clock in your home time zone. */
export default function LocalTime({ seconds = false, className = '' }) {
  const [time, setTime] = useState(format)

  useEffect(() => {
    const id = setInterval(() => setTime(format()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <time className={`tabular-nums ${className}`} aria-label={`Local time in ${site.location.city}`}>
      {seconds ? time : time.slice(0, 5)} {site.location.timeZoneLabel}
    </time>
  )
}
