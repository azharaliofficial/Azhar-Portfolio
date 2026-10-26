import { useState } from 'react'
import { apiGet, STATIC } from '../lib/api.js'
import { fallback } from '../data/fallback.js'
import Icon from './Icon.jsx'

const BASE = import.meta.env.VITE_API_URL ?? ''
const endpoints = ['skills', 'projects', 'timeline', 'certificates', 'profile']

function preview(data) {
  // Show a short slice so the panel stays compact.
  const slice = Array.isArray(data) ? data.slice(0, 3) : data
  const text = JSON.stringify(slice, null, 2)
  return Array.isArray(data) && data.length > 3 ? text.replace(/\]$/, `  ... ${data.length - 3} more\n]`) : text
}

export default function ApiPanel({ wide }) {
  const [selected, setSelected] = useState('skills')
  const [res, setRes] = useState({ status: 'SAMPLE', latency: null, bytes: null, body: preview(fallback.skills), live: false })
  const [loading, setLoading] = useState(false)

  async function send() {
    setLoading(true)
    const t0 = performance.now()
    try {
      const data = await apiGet(selected)
      const latency = Math.round(performance.now() - t0)
      setRes({ status: '200 OK', latency, bytes: new Blob([JSON.stringify(data)]).size, body: preview(data), live: true })
    } catch {
      setRes({ status: 'OFFLINE · SAMPLE', latency: null, bytes: null, body: preview(fallback[selected] ?? {}), live: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex flex-col justify-between bg-surface-container-lowest p-space-md ${wide ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
      <div className="flex items-center justify-between gap-2 pb-space-xs">
        <div className="flex flex-wrap items-center gap-x-space-sm">
          <h3 className="m-0 font-headline-sm text-headline-sm text-primary">Try my API</h3>
        </div>
        <span className="bg-surface-container-high px-1.5 py-0.5 font-telemetry text-telemetry text-emerald-400">
          {res.live ? (STATIC ? 'SAVED JSON' : 'LIVE LARAVEL') : 'READY'}
        </span>
      </div>

      <div className="my-2 flex items-center gap-2 bg-surface-container-high p-2">
        <span className="bg-primary-container px-2 py-1 font-telemetry text-telemetry font-bold text-on-primary-container">GET</span>
        <label htmlFor="api-endpoint" className="sr-only">
          Endpoint
        </label>
        <div className="flex min-w-0 flex-1 items-center font-code-block text-code-block text-primary">
          <span className="hidden truncate text-secondary sm:inline">{STATIC ? '/data/' : `${BASE}/api/`}</span>
          <select
            id="api-endpoint"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="min-w-0 bg-transparent font-[inherit] text-primary outline-none"
          >
            {endpoints.map((e) => (
              <option key={e} value={e} className="bg-surface-container-high">
                {e}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={send}
          disabled={loading}
          className="flex items-center gap-1 bg-primary px-3 py-1 font-telemetry text-telemetry font-bold text-on-primary transition-colors hover:bg-white disabled:opacity-50"
        >
          <Icon name="play" size={13} />
          <span>{loading ? 'SENDING' : 'EXECUTE'}</span>
        </button>
      </div>

      <div className="bg-[#07080A] p-3">
        <div className="flex flex-wrap items-center justify-between gap-x-3 pb-2 font-telemetry text-telemetry text-secondary">
          <span>
            STATUS: <strong className="text-emerald-400">{res.status}</strong>
          </span>
          <span>
            LATENCY: <strong className="text-primary-container">{res.latency !== null ? `${res.latency}ms` : '-'}</strong>
          </span>
          <span>PAYLOAD: {res.bytes !== null ? `${res.bytes}B` : '-'}</span>
        </div>
        <pre
          aria-live="polite"
          className="thin-scroll m-0 max-h-[140px] overflow-auto font-code-block text-code-block leading-tight text-emerald-300"
        >
          {res.body}
        </pre>
      </div>
    </div>
  )
}
