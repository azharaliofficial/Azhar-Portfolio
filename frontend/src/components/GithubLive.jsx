import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

const TTL = 10 * 60 * 1000 // GitHub allows 60 anonymous calls an hour, so cache.

function ago(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days < 1) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

async function load(user) {
  const key = `gh:${user}`
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) ?? 'null')
    if (hit && Date.now() - hit.at < TTL) return hit.data
  } catch {
    /* storage unavailable, fetch instead */
  }

  const get = async (path) => {
    const res = await fetch(`https://api.github.com/${path}`, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) throw new Error(`GitHub ${res.status}`)
    return res.json()
  }
  const [profile, repos, events] = await Promise.all([
    get(`users/${user}`),
    get(`users/${user}/repos?sort=pushed&per_page=6&type=owner`),
    get(`users/${user}/events/public?per_page=30`).catch(() => []),
  ])

  const commits = events
    .filter((e) => e.type === 'PushEvent')
    .flatMap((e) =>
      (e.payload?.commits ?? []).map((c) => ({
        repo: e.repo.name.split('/')[1],
        message: c.message.split('\n')[0],
        at: e.created_at,
      }))
    )
    .slice(0, 3)

  const data = {
    repos: profile.public_repos,
    followers: profile.followers,
    latest: repos.filter((r) => !r.fork).slice(0, 3),
    commits,
  }
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* ignore */
  }
  return data
}

// status: 'off' (no GitHub link), 'loading', 'ok' or 'error'. The card is left out
// entirely unless it is 'loading' or 'ok', so a failed call never shows an error box.
export function useGithub(githubUrl) {
  const user = githubUrl?.match(/github\.com\/([^/?#]+)/i)?.[1]
  const [state, setState] = useState({ status: user ? 'loading' : 'off', data: null })

  useEffect(() => {
    if (!user) {
      setState({ status: 'off', data: null })
      return
    }
    let cancelled = false
    load(user)
      .then((data) => !cancelled && setState({ status: 'ok', data }))
      .catch(() => !cancelled && setState({ status: 'error', data: null }))
    return () => {
      cancelled = true
    }
  }, [user])

  return { ...state, user }
}

export default function GithubCard({ github, githubUrl }) {
  const d = github.data

  return (
    <div id="github" className="flex flex-col justify-between bg-surface-container-high p-space-md lg:col-span-5">
      <div>
        <div className="flex items-center justify-between gap-2 pb-space-xs">
          <div className="flex flex-wrap items-center gap-x-2">
            <h3 className="m-0 font-headline-sm text-headline-sm text-primary">GitHub Activity</h3>
          </div>
          <span className="font-telemetry text-telemetry text-secondary">@{github.user}</span>
        </div>

        {!d ? (
          <p className="m-0 font-telemetry text-telemetry text-secondary">LOADING…</p>
        ) : (
          <>
            <p className="mb-3 mt-0 font-telemetry text-telemetry text-secondary">
              PUBLIC REPOSITORIES: {d.repos} · FOLLOWERS: {d.followers}
            </p>
            <div className="space-y-2">
              {d.commits.length > 0
                ? d.commits.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-surface-container-lowest p-2">
                      <div className="flex min-w-0 flex-col pr-2">
                        <span className="truncate font-label-sm text-label-sm font-bold text-primary">{c.message}</span>
                        <span className="truncate font-telemetry text-telemetry text-secondary">repo: {c.repo}</span>
                      </div>
                      <span className="shrink-0 font-telemetry text-telemetry text-primary-container">{ago(c.at)}</span>
                    </div>
                  ))
                : d.latest.map((r) => (
                    <a key={r.id} href={r.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-surface-container-lowest p-2">
                      <div className="flex min-w-0 flex-col pr-2">
                        <span className="truncate font-label-sm text-label-sm font-bold text-primary">{r.name}</span>
                        <span className="truncate font-telemetry text-telemetry text-secondary">{r.language ?? 'repository'}</span>
                      </div>
                      <span className="shrink-0 font-telemetry text-telemetry text-primary-container">{ago(r.pushed_at)}</span>
                    </a>
                  ))}
            </div>
          </>
        )}
      </div>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-between bg-surface-container-lowest p-2 text-primary transition-colors hover:bg-surface-container-low"
      >
        <span className="font-telemetry text-telemetry uppercase tracking-wider text-secondary">Open GitHub profile</span>
        <Icon name="north_east" size={16} className="text-primary-container" />
      </a>
    </div>
  )
}
