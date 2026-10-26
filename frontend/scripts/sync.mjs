// Saves a copy of your data and images from the LOCAL Laravel backend into the
// frontend, so the site can run on Netlify without a live backend.
//
//   1. Start the backend:   php artisan serve
//   2. Run:                 npm run sync
//   3. Then:                npm run build   and upload dist to Netlify
//
// Optional: SYNC_API_URL=http://127.0.0.1:8000 npm run sync
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const base = (process.env.SYNC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const resources = ['profile', 'academics', 'timeline', 'services', 'skills', 'projects', 'experiences', 'certificates']

async function get(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res
}

function mediaPaths(value, found = new Set()) {
  if (typeof value === 'string') {
    if (value.startsWith('/storage/')) found.add(value)
  } else if (Array.isArray(value)) {
    value.forEach((v) => mediaPaths(v, found))
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => mediaPaths(v, found))
  }
  return found
}

console.log(`Reading data from ${base}`)
const saved = {}
try {
  for (const name of resources) {
    saved[name] = await (await get(`${base}/api/${name}`)).json()
  }
} catch (err) {
  console.error(`\nCould not read the backend (${err.message}).`)
  console.error('Start it first with:  php artisan serve   (in the backend folder), then run this again.')
  process.exit(1)
}

// Only touch our own two folders, and only after the data was read successfully.
await rm(path.join(publicDir, 'data'), { recursive: true, force: true })
await rm(path.join(publicDir, 'storage'), { recursive: true, force: true })
await mkdir(path.join(publicDir, 'data'), { recursive: true })

for (const [name, json] of Object.entries(saved)) {
  await writeFile(path.join(publicDir, 'data', `${name}.json`), JSON.stringify(json, null, 2))
}

const files = [...mediaPaths(saved)]
let ok = 0
for (const file of files) {
  const target = path.join(publicDir, ...file.split('/').filter(Boolean))
  try {
    const bytes = Buffer.from(await (await get(`${base}${encodeURI(file)}`)).arrayBuffer())
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, bytes)
    ok += 1
  } catch (err) {
    console.warn(`  could not download ${file} (${err.message})`)
  }
}

console.log(`Saved ${resources.length} data files and ${ok} of ${files.length} images.`)
console.log('Next: npm run build, then upload the dist folder to Netlify.')
