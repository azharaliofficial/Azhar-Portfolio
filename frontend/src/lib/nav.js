// Jump to a section (#projects) or a case study (#/p/slug).
export function go(hash) {
  if (window.location.hash === hash) {
    if (!hash.startsWith('#/')) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  window.location.hash = hash
}
