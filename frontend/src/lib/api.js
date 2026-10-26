import { useEffect, useState } from 'react'
import { fallback } from '../data/fallback.js'

// Base URL of the Laravel API. Empty in development (Vite proxies /api).
// In production set VITE_API_URL, for example https://api.yourdomain.com
const BASE = import.meta.env.VITE_API_URL ?? ''

// "Static mode": a production build with no VITE_API_URL. The site then reads the
// saved copy of the data in /data/*.json (made by `npm run sync`) instead of a live API.
export const STATIC = import.meta.env.PROD && !BASE

// Uploaded images come back as relative paths like /storage/projects/a.jpg.
export function mediaUrl(path) {
  if (!path) return null
  return /^https?:\/\//.test(path) ? path : `${BASE}${path}`
}

export function slugOf(project) {
  return (
    project.slug ||
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}

export async function apiGet(path) {
  const url = STATIC ? `/data/${path}.json` : `${BASE}/api/${path}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}

// Contact form. With a live API it goes to Laravel; in static mode it goes to the
// Netlify form declared in index.html.
export async function sendContact(body) {
  if (!STATIC) return apiPost('contact', body)
  const fields = { 'form-name': 'contact', name: body.name, email: body.email, message: body.message }
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
  })
  if (!res.ok) throw new Error('Could not send the message. Please use the email button instead.')
  return {}
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE}/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data?.message || 'Something went wrong. Please try again.'
    const error = new Error(message)
    error.errors = data?.errors ?? {} // per-field messages from Laravel (422)
    throw error
  }
  return data
}

// Returns the fallback content immediately, then swaps in live API data.
export function useApi(resource) {
  const [data, setData] = useState(fallback[resource])
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    apiGet(resource)
      .then((json) => {
        if (!cancelled && json !== null && (!Array.isArray(json) || json.length > 0)) {
          setData(json)
          setLive(true)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [resource])

  return { data, live }
}
