import type { Register, SessionRateLimit } from 'claude-code'

const NAMES: Record<string, string> = { five_hour: '5h', seven_day: 'week', spend_limit: 'Limit' }

const left = (resetsAt: string | undefined, now: number) => {
  if (!resetsAt) return ''
  const m = Math.max(0, Math.round((Date.parse(resetsAt) - now) / 60000))
  if (m >= 1440) return `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

const tok = (n: number) => (n >= 1e6 ? `${+(n / 1e6).toFixed(1)}m` : n >= 1e3 ? `${+(n / 1e3).toFixed(1)}k` : `${n}`)

async function refresh($: any) {
  const [now, u] = await Promise.all([$.clock.now(), $.session.usage()])
  const parts = u.rateLimits.map((r: SessionRateLimit) => `${NAMES[r.kind] ?? r.kind}: ${r.percentUsed}%${r.resetsAt ? ` # ${left(r.resetsAt, now)}` : ''}`)
  if (u.context.percent !== undefined) parts.push(`Context: ${u.context.percent}%${u.context.tokens !== undefined ? ` # ${tok(u.context.tokens)}/${tok(u.context.window)}` : ''}`)
  $.ui.status(parts.length ? `[${parts.join(' | ')}]` : undefined)
}

export const register: Register = on => {
  on('session.start', ($, e, next) => {
    $.clock.every(60000, () => refresh($))
    return next(e)
  })

  on('session.measure', ($, e, next) => (refresh($), next(e)))
}
