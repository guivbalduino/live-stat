let audioCtx = null
let soundCache = null
let loading = false

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

async function getSounds(type) {
  if (!soundCache && !loading) {
    loading = true
    try {
      const res = await fetch("/api/sounds")
      soundCache = (await res.json()).sounds || {}
    } catch {}
    loading = false
  }
  return soundCache?.[type] || []
}

function playRandom(sounds) {
  if (!sounds.length) return false
  const file = sounds[Math.floor(Math.random() * sounds.length)]
  try {
    const audio = new Audio(`/sounds/${file}`)
    audio.volume = 0.5
    audio.play().catch(() => {})
    return true
  } catch {
    return false
  }
}

function playBeep() {
  try {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(880, now)
    osc1.frequency.setValueAtTime(1100, now + 0.1)
    gain1.gain.setValueAtTime(0.15, now)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
    osc1.connect(gain1).connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.25)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(1320, now + 0.12)
    gain2.gain.setValueAtTime(0.15, now + 0.12)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
    osc2.connect(gain2).connect(ctx.destination)
    osc2.start(now + 0.12)
    osc2.stop(now + 0.35)
  } catch {}
}

export async function playFollowSound() {
  const sounds = await getSounds("follow")
  if (!playRandom(sounds)) playBeep()
}
