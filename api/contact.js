/**
 * POST /api/contact — Vercel serverless function (Node.js runtime).
 *
 * Validates the contact form, filters spam and delivers the message to your
 * inbox through Resend (https://resend.com). No SDK needed — plain fetch.
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables,
 * or a local `.env` file for `npm run dev`):
 *   RESEND_API_KEY  required  — API key from resend.com
 *   CONTACT_TO      optional  — inbox that receives messages
 *   CONTACT_FROM    optional  — sender; defaults to Resend's test sender, which can only
 *                               deliver to the email your Resend account was created with
 */

import { INTERESTS } from '../src/data/services.js'

const LIMITS = { name: 80, email: 160, message: 5000 }
const MIN_MESSAGE = 10
const MIN_FILL_MS = 3000 // humans need more than 3s to fill the form
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const DEFAULT_TO = 'mohd.ayanasim.786@gmail.com'
const DEFAULT_FROM = 'Portfolio Contact <onboarding@resend.dev>'

// Best-effort rate limit (per warm instance): 5 messages / IP / hour
const RATE = { max: 5, windowMs: 60 * 60 * 1000 }
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE.max
}

const clean = (v, max) =>
  String(v ?? '')
    // eslint-disable-next-line no-control-regex -- stripping control chars is the point
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max)

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function validate(body) {
  const data = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email).toLowerCase(),
    message: clean(body.message, LIMITS.message),
    interest: INTERESTS.includes(body.interest) ? body.interest : INTERESTS[0],
  }
  const errors = {}
  if (data.name.length < 2) errors.name = 'Please tell me your name.'
  if (!EMAIL_RE.test(data.email)) errors.email = 'That email doesn’t look right.'
  if (data.message.length < MIN_MESSAGE) errors.message = `A little more detail, please (min ${MIN_MESSAGE} characters).`
  return { data, errors }
}

function renderEmail({ name, email, message, interest }) {
  const n = escapeHtml(name)
  const e = escapeHtml(email)
  const i = escapeHtml(interest)
  const m = escapeHtml(message).replace(/\n/g, '<br>')
  const html = `<!doctype html>
<html><body style="margin:0;background:#efeae0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0c0b10">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#f1ece2;border:1px solid rgba(12,11,16,.14);border-radius:20px;overflow:hidden">
      <tr><td style="background:#0c0b10;padding:22px 28px">
        <span style="color:#ff4a1c;font:600 11px/1 monospace;letter-spacing:.14em;text-transform:uppercase">New message · ${i}</span>
      </td></tr>
      <tr><td style="padding:28px">
        <p style="margin:0 0 4px;font-size:22px;font-weight:700">${n}</p>
        <p style="margin:0 0 24px"><a href="mailto:${e}" style="color:#f0400f">${e}</a></p>
        <div style="font-size:16px;line-height:1.6;border-left:3px solid #ff4a1c;padding-left:16px">${m}</div>
        <p style="margin:28px 0 0;color:rgba(12,11,16,.6);font-size:13px">Hit “Reply” to answer ${n} directly.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`
  const text = `New message · ${interest}\n\nFrom: ${name} <${email}>\n\n${message}\n`
  return { html, text }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = null
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request.' })
  }

  // Spam traps: hidden honeypot field + "filled too fast". Pretend success so bots move on.
  if (body.website || (Number(body.elapsed) || 0) < MIN_FILL_MS) {
    return res.status(200).json({ ok: true })
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many messages — please try again in a little while.' })
  }

  const { data, errors } = validate(body)
  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, error: 'Please check the highlighted fields.', fields: errors })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set')
    return res.status(500).json({ ok: false, error: 'The mail service isn’t configured yet.' })
  }

  const { html, text } = renderEmail(data)
  const subject = `${data.interest} — from ${data.name}`.replace(/[\r\n]+/g, ' ')

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        reply_to: data.email,
        subject,
        html,
        text,
      }),
    })
    if (!r.ok) {
      console.error('[contact] Resend error', r.status, await r.text())
      return res.status(502).json({ ok: false, error: 'Couldn’t deliver the message right now.' })
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] send failed', err)
    return res.status(502).json({ ok: false, error: 'Couldn’t deliver the message right now.' })
  }
}
