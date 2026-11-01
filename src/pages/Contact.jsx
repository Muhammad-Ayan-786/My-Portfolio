import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, LoaderCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '../data/site'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import SectionLabel from '../components/ui/SectionLabel'
import LocalTime from '../components/ui/LocalTime'
import Magnetic from '../components/ui/Magnetic'

const INTERESTS = ['Freelance project', 'Internship', 'Collaboration', 'Just saying hi']

const pop = { initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.6 } }
const slide = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } }

/** Fallback: the same message, pre-filled in the visitor's mail app. */
const mailtoFor = ({ name = '', email = '', message = '', interest = INTERESTS[0] } = {}) => {
  const subject = `${interest}${name ? ` — from ${name}` : ''}`
  const body = message ? `${message}\n\n— ${name} (${email})` : ''
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function Field({ id, label, textarea, error, ...rest }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div className={`group relative border-b pt-7 transition-colors focus-within:border-fg ${error ? 'border-accent' : 'border-line'}`}>
      <Tag
        id={id}
        name={id}
        placeholder=" "
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="peer block w-full resize-none bg-transparent pb-3 text-xl font-medium text-fg outline-none md:text-2xl"
        rows={textarea ? 4 : undefined}
        {...rest}
      />
      <label
        htmlFor={id}
        className="type-label pointer-events-none absolute left-0 top-9 origin-left text-muted transition-all duration-500 ease-expo peer-focus:top-0 peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0"
      >
        {label}
      </label>
      <span className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-expo peer-focus:scale-x-100" />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="type-label absolute -bottom-6 left-0 text-accent"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact() {
  const [interest, setInterest] = useState(INTERESTS[0])
  const [copied, setCopied] = useState(false)
  // idle → sending → sent | error
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [draft, setDraft] = useState(null) // last attempt — refills the form and powers the fallback
  const startedAt = useRef(0)

  // Spam check on the server: forms filled in under 3s are bots
  useEffect(() => {
    if (status === 'idle') startedAt.current = Date.now()
  }, [status])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  // Posts to the serverless function in /api/contact.js
  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const fields = Object.fromEntries(new FormData(e.currentTarget))
    const payload = { ...fields, interest, elapsed: Date.now() - startedAt.current }
    setDraft(payload)
    setStatus('sending')
    setError('')
    setFieldErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json.ok) {
        setStatus('sent')
        return
      }
      setFieldErrors(json.fields || {})
      setError(json.error || 'Something went wrong.')
    } catch {
      setError('Network hiccup — the message didn’t go through.')
    }
    setStatus('error')
  }

  const clearFieldError = (e) => {
    const { name } = e.target
    if (fieldErrors[name]) setFieldErrors(({ [name]: _removed, ...rest }) => rest)
  }

  const reset = () => {
    setDraft(null)
    setStatus('idle')
  }

  const sending = status === 'sending'
  const firstName = draft?.name ? String(draft.name).trim().split(/\s+/)[0] : ''

  return (
    <>
      <title>{`Contact — ${site.name}`}</title>
      <meta name="description" content={`Get in touch with ${site.name} for freelance work, internships or collaborations.`} />

      <PageHeader index="04" label="Contact" title="Let’s talk" accent="about what you’re building." aside={<LocalTime />} />

      <section className="container-x grid gap-20 pb-32 md:grid-cols-12 md:pb-44">
        {/* Left: direct lines */}
        <div className="md:col-span-5">
          <SectionLabel index="01">Direct line</SectionLabel>
          <Reveal className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="type-serif break-all text-[clamp(1.7rem,3vw,2.8rem)] leading-tight underline decoration-accent decoration-1 underline-offset-[6px] hover:text-accent"
              >
                {site.email}
              </a>
              <button
                type="button"
                onClick={copy}
                aria-label="Copy email address"
                className="type-label relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-line px-3.5 py-2 hover:border-fg"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'y' : 'n'}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            <p className="mt-6 flex items-center gap-2 text-fg/80">
              <span className="pulse-dot size-2 rounded-full bg-accent" />
              {site.availability.label}
            </p>
          </Reveal>

          <div className="mt-16">
            <SectionLabel index="02">Elsewhere</SectionLabel>
            <Reveal as="ul" className="mt-6 border-b border-line">
              {site.socials.map((s) => (
                <li key={s.label} className="border-t border-line">
                  <a
                    href={s.href}
                    target={s.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group relative flex items-center justify-between gap-4 overflow-hidden py-5"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-expo group-hover:scale-x-100" />
                    <span className="relative flex flex-col transition-all duration-500 ease-expo group-hover:translate-x-4 group-hover:text-on-accent">
                      <span className="type-display text-4xl">{s.label}</span>
                      <span className="type-label mt-1 opacity-60">{s.handle}</span>
                    </span>
                    <ArrowUpRight className="relative mr-2 size-6 transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:text-on-accent" />
                  </a>
                </li>
              ))}
            </Reveal>
          </div>

          <Reveal className="type-label mt-16 grid grid-cols-2 gap-6 text-muted">
            <div>
              <p>Location</p>
              <p className="mt-2 text-fg">
                {site.location.city}, {site.location.country}
              </p>
            </div>
            <div>
              <p>Local time</p>
              <LocalTime seconds className="mt-2 block text-fg" />
            </div>
          </Reveal>
        </div>

        {/* Right: form */}
        <div className="md:col-span-6 md:col-start-7">
          <SectionLabel index="03">Write to me</SectionLabel>
          <Reveal className="mt-8">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-7 md:p-10">
              <div className="pointer-events-none absolute -right-1/3 -top-1/3 size-[70%] rounded-full bg-accent-2/20 blur-[100px]" />
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div key="sent" {...slide} className="relative flex min-h-[460px] flex-col justify-center" role="status">
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                      className="mb-8 grid size-16 place-items-center rounded-full bg-accent text-on-accent"
                    >
                      <Check className="size-7" strokeWidth={2.5} />
                    </motion.span>
                    <p className="type-display text-6xl md:text-7xl">
                      Message <span className="type-serif text-accent">sent.</span>
                    </p>
                    <p className="mt-6 max-w-[40ch] text-lg text-fg/80">
                      Thanks{firstName && `, ${firstName}`} — it’s in my inbox. I usually reply within a day or two
                      {draft?.email && (
                        <>
                          {' '}
                          at <span className="text-fg">{draft.email}</span>
                        </>
                      )}
                      .
                    </p>
                    <button type="button" onClick={reset} className="type-label mt-10 self-start underline underline-offset-4">
                      ← Write another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    {...slide}
                    onSubmit={onSubmit}
                    onInput={clearFieldError}
                    noValidate
                    aria-busy={sending}
                    className="relative flex flex-col gap-8"
                  >
                    <fieldset disabled={sending}>
                      <legend className="type-label mb-4 text-muted">I’m interested in</legend>
                      <div className="flex flex-wrap gap-2">
                        {INTERESTS.map((item) => (
                          <label
                            key={item}
                            className={`type-label relative cursor-pointer rounded-full border px-4 py-2.5 transition-colors ${
                              interest === item ? 'border-fg text-bg' : 'border-line hover:border-fg'
                            }`}
                          >
                            <input type="radio" name="interest" value={item} checked={interest === item} onChange={() => setInterest(item)} className="sr-only" />
                            {interest === item && (
                              <motion.span layoutId="interest-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                            )}
                            <span className="relative">{item}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <Field id="name" label="Your name" required maxLength={80} autoComplete="name" defaultValue={draft?.name} error={fieldErrors.name} />
                    <Field
                      id="email"
                      label="Your email"
                      type="email"
                      required
                      maxLength={160}
                      autoComplete="email"
                      defaultValue={draft?.email}
                      error={fieldErrors.email}
                    />
                    <Field
                      id="message"
                      label="Tell me about it"
                      textarea
                      required
                      maxLength={5000}
                      defaultValue={draft?.message}
                      error={fieldErrors.message}
                    />

                    {/* Honeypot — invisible to people, irresistible to bots */}
                    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                      <label htmlFor="website">Website</label>
                      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <AnimatePresence>
                      {status === 'error' && error && (
                        <motion.div
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-2xl border border-accent/50 bg-accent/10 px-5 py-4 text-sm text-fg/90">
                            <p className="font-semibold">{error}</p>
                            {!Object.keys(fieldErrors).length && (
                              <p className="mt-1 text-fg/70">
                                Try again, or{' '}
                                <a href={mailtoFor(draft || {})} className="underline decoration-accent underline-offset-4">
                                  send it from your email app
                                </a>{' '}
                                — everything’s already filled in.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <p className="max-w-[24ch] text-sm text-muted">Goes straight to my inbox. I reply within a day or two.</p>
                      <Magnetic strength={0.3}>
                        <button
                          type="submit"
                          disabled={sending}
                          data-cursor={sending ? undefined : 'Send'}
                          className="group grid size-28 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-500 ease-expo hover:scale-105 disabled:scale-95 disabled:opacity-80 md:size-32"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {sending ? (
                              <motion.span key="sending" {...pop} className="type-label flex flex-col items-center gap-2">
                                <LoaderCircle className="size-6 animate-spin" />
                                Sending
                              </motion.span>
                            ) : (
                              <motion.span key="idle" {...pop} className="type-display flex items-center gap-1 text-2xl">
                                {status === 'error' && !Object.keys(fieldErrors).length ? 'Retry' : 'Send'}
                                <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </Magnetic>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
