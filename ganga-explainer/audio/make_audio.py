#!/usr/bin/env python3
"""Synthesises background music + sound effects for the explainer and mixes them under the narration.
usage: python3 audio/make_audio.py   (run from ganga-explainer/; needs numpy + ffmpeg)
writes audio/music.wav, audio/sfx.wav, audio/mix.wav
"""
import numpy as np, subprocess, wave, os
SR, DUR = 44100, 98.9
N = int(SR * DUR)
rng = np.random.default_rng(7)
HERE = os.path.dirname(os.path.abspath(__file__))

def tt(d): return np.arange(int(SR * d)) / SR
def norm(x): return x / (np.max(np.abs(x)) + 1e-9)
def filt(x, lo=0, hi=1e9, soft=.25):
    """FFT band-pass with soft edges."""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); g = np.ones_like(f)
    if lo > 0: g *= 1 / (1 + (lo / np.maximum(f, 1e-6)) ** (2 / soft))
    if hi < 1e8: g *= 1 / (1 + (f / hi) ** (2 / soft))
    return np.fft.irfft(X * g, len(x))
def noise(d): return rng.standard_normal(int(SR * d))
def adsr(n, a=.01, r=.1):
    e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    na, nr = min(na, n), min(nr, n)
    e[:na] *= np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def place(bus, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i]; l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    bus[i:i + len(sig), 0] += sig * gain * l * 1.414; bus[i:i + len(sig), 1] += sig * gain * r * 1.414
def reverb(bus, secs=2.2, wet=.3):
    n = int(secs * SR); out = bus.copy()
    for c in range(2):
        ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / secs)); ir = filt(ir, 200, 6000); ir /= np.sqrt(np.sum(ir ** 2))
        L = len(bus) + n
        out[:, c] += wet * np.fft.irfft(np.fft.rfft(bus[:, c], L) * np.fft.rfft(ir, L), L)[: len(bus)]
    return out
def curve(points):
    """piecewise-linear automation over the whole timeline: [(t, v), ...]"""
    ts, vs = zip(*points); return np.interp(np.arange(N) / SR, ts, vs)

# ---------- instruments ----------
SA = 146.83  # D3
def tanpura(f, d=5.0):
    t = tt(d); x = np.zeros_like(t)
    for k in range(1, 22):
        x += np.sin(2 * np.pi * k * f * t * (1 + 0.0004 * k) + k) / k ** .75 * np.exp(-t * (.35 + .07 * k)) * (.55 + .45 * np.sin(2 * np.pi * .8 * t + k * .9))
    return norm(x * adsr(len(t), .02, .5))
def flute(f0, f1, d, vib=.006):
    t = tt(d); f = f0 + (f1 - f0) * np.clip(t / .12, 0, 1); f = f * (1 + vib * np.sin(2 * np.pi * 5.2 * t) * np.clip(t / .5, 0, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + .28 * np.sin(2 * ph) + .08 * np.sin(3 * ph) + .05 * filt(noise(d), f1 * .8, f1 * 3)
    return x * adsr(len(t), .09, min(.35, d * .4))
def bell(f=523, d=4.0):
    t = tt(d); x = np.zeros_like(t)
    for r, a, dc in [(.56, .5, .7), (.92, .6, .9), (1.19, 1, 1.2), (1.71, .55, 1.6), (2.0, .7, 1.9), (2.74, .35, 2.6), (3.0, .3, 3.2), (4.07, .2, 4.5)]:
        x += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dc)
    return norm(x * adsr(len(t), .002, .3))
def chime(f, d=1.2):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t * 4.5)
def drum(f=70, d=.6, click=.3):
    t = tt(d); ph = 2 * np.pi * np.cumsum(f * (1 + 1.4 * np.exp(-t * 28))) / SR
    return norm(np.sin(ph) * np.exp(-t * 7) + click * filt(noise(d), 800, 5000) * np.exp(-t * 90))
def boom(d=2.5):
    t = tt(d); ph = 2 * np.pi * np.cumsum(34 + 60 * np.exp(-t * 9)) / SR
    return norm(np.sin(ph) * np.exp(-t * 2.2) + .7 * filt(noise(d), 20, 260) * np.exp(-t * 3) + .25 * filt(noise(d), 300, 3000) * np.exp(-t * 14))
def whoosh(d=.6, lo=400, hi=5000, up=True):
    n = noise(d); t = tt(d); u = t / d; out = np.zeros_like(t)
    for i in range(6):  # crude moving band-pass
        c = lo * (hi / lo) ** ((i + .5) / 6); w = np.exp(-((u if up else 1 - u) * 6 - i - .5) ** 2 / 1.6); out += filt(n, c * .7, c * 1.4) * w
    return norm(out * np.sin(np.pi * u) ** 1.2)
def pop(f=520):
    t = tt(.14); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.2 * t / .14)) / SR) * np.exp(-t * 30)
def fire(d):
    n = noise(d); t = tt(d); base = filt(n, 60, 900) * (.7 + .3 * np.sin(2 * np.pi * .4 * t) * np.sin(2 * np.pi * 1.3 * t + 1))
    cr = np.zeros_like(t)
    for _ in range(int(d * 9)):
        i = rng.integers(0, len(t) - 400); L = rng.integers(60, 380); cr[i:i + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / (L / 4)) * rng.uniform(.3, 1)
    return norm(base) * .8 + norm(filt(cr, 1500, 9000)) * .45
def thunder(d=2.6):
    t = tt(d); x = filt(noise(d), 30, 500) * np.exp(-t * 1.6) * (1 + .8 * np.sin(2 * np.pi * 7 * t) * np.exp(-t * 2))
    return norm(x + .5 * filt(noise(d), 1000, 7000) * np.exp(-t * 22))
def roar(d=2.4):
    t = tt(d); f = 62 + 22 * np.sin(np.pi * t / d) + 3 * np.sin(2 * np.pi * 27 * t); ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(k * ph) / k for k in range(1, 26))
    x = saw * (.6 + .4 * np.sin(2 * np.pi * 31 * t)) + .5 * filt(noise(d), 150, 1800)
    x = filt(x, 50, 900) + .6 * filt(x, 500, 1400)
    return norm(np.tanh(2.5 * norm(x)) * adsr(len(t), .12, .7))
def conch(d=2.6, f=233):
    t = tt(d); ff = f * (1 + .06 * np.clip(t / .5, 0, 1)) * (1 + .004 * np.sin(2 * np.pi * 5 * t)); ph = 2 * np.pi * np.cumsum(ff) / SR
    x = sum(np.sin(k * ph) / k ** 1.1 for k in range(1, 14)) + .08 * filt(noise(d), 300, 2500)
    return norm(filt(x, 150, 2600) * adsr(len(t), .25, .8))
def riser(d=1.8):
    t = tt(d); u = t / d; ph = 2 * np.pi * np.cumsum(110 * 2 ** (u * 2.2)) / SR
    return norm((np.sin(ph) + .5 * np.sin(1.5 * ph)) * u ** 2 * .6 + whoosh(d, 300, 7000) * u)
def shimmer(d=2.4, up=True):
    out = np.zeros(int(SR * (d + 1.4))); notes = [587, 659, 740, 880, 988, 1175, 1319, 1480, 1760, 1976, 2349]
    if not up: notes = notes[::-1]
    for i, f in enumerate(notes): j = int(i / len(notes) * d * SR); c = chime(f); out[j:j + len(c)] += c * .6
    return norm(out)
def pad(freqs, d, bright=900):
    t = tt(d); x = np.zeros_like(t)
    for f in freqs:
        for det in (-.004, 0, .005):
            ph = 2 * np.pi * f * (1 + det) * t + rng.uniform(0, 6); x += sum(np.sin(k * ph) / k for k in range(1, 9))
    return norm(filt(x, 40, bright) * adsr(len(t), 1.2, 1.5))

# ---------- music ----------
music = np.zeros((N, 2))
tb = np.zeros((N, 2)); plucks = [SA * .75, SA * 2, SA * 2, SA]
i, t0 = 0, 0.0
while t0 < DUR - 1: place(tb, tanpura(plucks[i % 4]), t0, .5 if i % 4 else .6, [-.3, .2, -.1, .3][i % 4]); i += 1; t0 += 1.15
music += tb * .9
place(music, pad([SA / 2, SA * .75, SA], DUR, 500), 0, .16)
P = {'S': 587.33, 'R': 659.26, 'G': 739.99, 'g': 698.46, 'P': 880.0, 'D': 987.77, "S'": 1174.66, "R'": 1318.5}
def phrase(start, notes, gain=.14, pan=.25):
    t0, prev = start, None
    for n, d in notes:
        if n != '-': place(music, flute(P[prev] if prev else P[n], P[n], d * 1.02), t0, gain, pan); prev = n
        else: prev = None
        t0 += d
# a flowing, river-like melody line throughout (Bhupali)
phrase(0.6, [('G', .8), ('P', .6), ('D', 1.5), ('-', .4), ("S'", 1.2), ('D', .5), ('P', 1.6)], .13)
phrase(11.3, [('S', .6), ('R', .5), ('G', .6), ('P', 1.4), ('-', .3), ('G', .5), ('P', .5), ('D', 1.4)], .12)
phrase(15.6, [('P', .8), ('G', .6), ('R', .6), ('S', 1.8)], .11)
phrase(26.2, [('S', .4), ('R', .4), ('G', .4), ('P', .5), ('D', .5), ("S'", 1.4)], .13)
phrase(28.9, [('G', .4), ('P', .4), ('D', .4), ('P', .4), ('G', .4), ('P', .4), ('D', .4), ("S'", .8), ('D', .4), ('P', .4), ('G', .8)], .13)
phrase(36.0, [('G', .7), ('P', .5), ('D', 1.2), ("S'", 1.6), ('-', .3), ("R'", .6), ("S'", 1.6)], .15)
phrase(45.4, [('S', .5), ('R', .5), ('G', .5), ('P', .5), ('D', .7), ("S'", 1.0), ("R'", .6), ("S'", 2.0)], .16)
phrase(54.6, [("S'", .8), ('D', .6), ('P', .6), ('G', 1.4), ('P', .6), ('D', 1.6)], .13)
phrase(61.6, [('G', .8), ('P', .6), ('D', 1.6), ('-', .4), ("S'", 1.2), ('D', .5), ('P', 1.6)], .12)
phrase(68.6, [('P', .5), ('D', .5), ("S'", 1.2), ("R'", .5), ("S'", 1.8)], .14)
phrase(73.5, [('S', .6), ('R', .5), ('G', .6), ('P', 1.4), ('D', .6), ("S'", 1.8)], .12)
phrase(79.4, [('G', .5), ('P', .5), ('D', .5), ("S'", 2.2)], .15)
phrase(84.6, [('S', .8), ('R', .5), ('g', 1.4), ('-', .3), ('P', .7), ('D', .5), ("S'", 1.6)], .12)
# the torrent
place(music, pad([SA / 2, SA * .75, SA, SA * 1.5], 6.0, 1200), 20.2, .22)
for k, t0 in enumerate(np.arange(20.4, 25.6, .45)): place(music, drum(60 if k % 4 == 0 else 84, .7, .35), t0, .3 if k % 4 == 0 else .14)
# the chariot gallop
for k, t0 in enumerate(np.arange(28.6, 35.3, .25)): place(music, drum(120 if k % 2 else 90, .2, .5), t0, .12 if k % 2 else .18, .3 if k % 2 else -.3)
# the turn north
for k, t0 in enumerate(np.arange(45.4, 53.6, .5)): place(music, drum(70 if k % 4 == 0 else 100, .5, .4), t0, .24 if k % 4 == 0 else .11); place(music, drum(200, .14, .8), t0 + .25, .06, .4)
place(music, conch(2.6), 50.6, .24, -.2); place(music, conch(2.4, 349), 50.8, .1, .3)
F = 96.0
place(music, conch(2.6), F, .34, -.2); place(music, conch(2.4, 349), F + .2, .16, .3)
for k in range(22): place(music, drum(210 if k % 2 else 170, .16, .9), F + .05 + k * .085, .16 * (1 - k / 30), .5 if k % 2 else -.5)
for t0 in (F + .03, F + .75, F + 1.45): place(music, bell(392, 4), t0, .2, .1)
music = reverb(music, 2.4, .35)
music *= curve([(0, 0), (.6, 1), (DUR - .8, 1), (DUR, 0)])[:, None]

# ---------- sound effects ----------
sfx = np.zeros((N, 2))
def S(sig, t, g, pan=0.0): place(sfx, sig, t, g, pan)
def windbed(d): return norm(filt(noise(d), 250, 1400) * (.6 + .4 * np.sin(2 * np.pi * .23 * tt(d))) * adsr(int(SR * d), 1, 1.2))
def riverbed(d): t = tt(d); return norm(filt(noise(d), 200, 2400) * (.7 + .3 * np.sin(2 * np.pi * .3 * t) * np.sin(2 * np.pi * 1.1 * t + 1)) * adsr(len(t), 1, 1))
def torrent(d): t = tt(d); return norm((filt(noise(d), 60, 900) + .6 * filt(noise(d), 1000, 6000)) * adsr(len(t), .3, 1))
def footsteps(d, step):
    out = np.zeros(int(SR * d))
    for k in range(int(d / step)): c = filt(noise(.08), 120, 900) * np.exp(-tt(.08) * 50); j = int(k * step * SR); out[j:j + len(c)] += c
    return norm(out)
def hooves(d, step=.25):
    out = np.zeros(int(SR * d))
    for k in range(int(d / step)): c = drum(260 + 40 * (k % 2), .08, .9) * .8 + filt(noise(.08), 800, 3000) * np.exp(-tt(.08) * 60); j = int(k * step * SR); out[j:j + len(c)] += c[:len(out) - j]
    return norm(out)
def splash(): t = tt(.9); return norm(filt(noise(.9), 500, 7000) * np.exp(-t * 5) * (1 + .5 * np.sin(2 * np.pi * 18 * t)) + .5 * drum(80, .9, 0))
def birds(d):
    out = np.zeros(int(SR * d))
    for k in range(int(d * 1.5)):
        j = int(rng.uniform(0, d - .4) * SR); f0 = rng.uniform(2500, 3800); c = np.sin(2 * np.pi * np.cumsum(f0 + 900 * np.sin(2 * np.pi * 14 * tt(.25))) / SR) * np.sin(np.pi * tt(.25) / .25) ** 2
        out[j:j + len(c)] += c * rng.uniform(.3, 1)
    return norm(out)
rb = np.zeros((N, 2)); place(rb, riverbed(DUR), 0, 1)
sfx += rb * curve([(0, 0), (10.4, 0), (11.0, .14), (15.0, .14), (15.4, 0), (26.0, 0), (26.6, .16), (61.0, .16), (73.0, .14), (83.4, .12), (84.0, 0), (DUR, 0)])[:, None]
# recap
S(footsteps(3.0, .45), .3, .12); S(shimmer(1.6), 2.6, .1); S(bell(784, 3.5), 7.4, .12); S(boom(2.2), 7.6, .3)
S(boom(2.4), 11.6, .32); S(whoosh(.8, 300, 5000), 12.0, .16, .4)
# Bhagiratha's tapas, the descent
S(birds(5.0), 15.1, .05, .3); S(windbed(5.0), 15.1, .06); S(shimmer(2.0), 17.6, .18, .4); S(pop(600), 15.8, .18, -.2); S(boom(2.4), 18.4, .3)
# the torrent and the jata
S(torrent(5.8), 20.4, .3); S(boom(3.0), 21.6, .5); S(thunder(2.0), 21.7, .22); S(riser(1.0), 21.0, .18); S(boom(2.4), 22.4, .3)
for k in range(8): S(whoosh(.4, 400, 3000, up=bool(k % 2)), 22.4 + k * .4, .1, -.3 + k * .08)
S(shimmer(1.8, up=False), 26.0, .16); S(splash(), 26.6, .2, .4)
# chariot east
S(hooves(6.6, .25), 28.7, .22, .3); S(pop(560), 33.0, .18, .5)
# reaching Kashi
S(shimmer(1.8), 35.6, .14); S(boom(2.4), 36.2, .34); S(bell(523, 5), 36.3, .18); S(shimmer(2.2), 37.8, .22, -.3); S(bell(784, 4), 38.4, .12, -.3); S(pop(600), 41.7, .18, .5)
# the turn north
S(whoosh(2.0, 300, 4000), 45.4, .2); S(boom(2.4), 46.2, .34); S(pop(600), 50.6, .2, -.2); S(pop(480), 51.6, .22, -.6); S(bell(392, 5), 52.0, .18, -.6)
# uttarvahini and bathing
for k in range(6): S(splash(), 54.4 + k * 1.1, .1, -.7 + k * .28)
S(boom(2.4), 54.6, .32); S(bell(523, 4.5), 54.8, .16); S(pop(560), 57.6, .2)
# the crescent and the moon
S(pop(560), 63.5, .18); S(shimmer(2.2), 64.0, .18); S(boom(2.2), 68.5, .3); S(shimmer(1.8), 68.6, .2, -.6); S(bell(659, 4.5), 69.0, .16, -.6)
# Assi, Varuna, Varanasi
S(whoosh(1.0, 300, 3000), 73.6, .14, .1); S(pop(520), 73.7, .2, -.2); S(whoosh(1.0, 300, 3000), 76.6, .14, .1); S(pop(620), 76.7, .2, -.2)
S(pop(560), 79.6, .2, -.6); S(boom(2.6), 81.6, .4); S(bell(392, 5), 81.7, .2)
# teaser
S(windbed(9.0), 83.6, .08); S(riser(1.0), 84.8, .14); S(shimmer(2.2), 85.8, .22, .1); S(boom(2.6), 85.9, .36); S(bell(392, 5), 86.2, .16)
S(boom(2.4), 87.2, .3)
for k, t0 in enumerate((89.9, 90.3)): S(pop(420 + k * 140), t0, .24, (.4, .7)[k])
# outro
S(whoosh(.8, 200, 3000), 92.8, .14); S(shimmer(1.4), 93.4, .13); S(riser(.7), 95.3, .16); S(boom(3), F, .55)
fb = np.zeros((N, 2)); place(fb, fire(DUR), 0, 1)
sfx += fb * curve([(0, 0), (92.8, 0), (93.3, .14), (DUR - .8, .14), (DUR, 0)])[:, None]
sfx = reverb(sfx, 1.6, .18)
sfx *= curve([(0, 0), (.3, 1), (DUR - .7, 1), (DUR, 0)])[:, None]

# ---------- mix ----------
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(HERE, 'narration.wav'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
v = np.frombuffer(raw, np.float32).astype(np.float64); voice = np.zeros(N); voice[: min(N, len(v))] = v[:N]
voice *= 1.45  # this narration was delivered ~3.5 dB quieter than episode 1
voice = np.where(np.abs(voice) > .7, np.sign(voice) * (.7 + .25 * np.tanh((np.abs(voice) - .7) / .25)), voice)
w = int(.05 * SR); lvl = np.sqrt(np.convolve(voice ** 2, np.ones(w) / w, 'same')); k = int(.25 * SR)
duck = 1 - .4 * np.clip(np.convolve((lvl > .02).astype(float), np.ones(k) / k, 'same'), 0, 1)
MUSIC_GAIN, SFX_GAIN = .24, .50
mix = voice[:, None] * .95 + music * MUSIC_GAIN * duck[:, None] + sfx * SFX_GAIN * (.75 + .25 * duck[:, None])
mix = np.where(np.abs(mix) > .85, np.sign(mix) * (.85 + .14 * np.tanh((np.abs(mix) - .85) / .14)), mix)
def save(name, x):
    with wave.open(os.path.join(HERE, name), 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
save('music.wav', music * MUSIC_GAIN); save('sfx.wav', sfx * SFX_GAIN); save('mix.wav', mix)
rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
print('rms dB  voice %.1f  music %.1f  sfx %.1f  mix %.1f  | peaks voice %.2f music %.2f sfx %.2f mix %.2f' % (rms(voice), rms(music * MUSIC_GAIN), rms(sfx * SFX_GAIN), rms(mix), np.abs(voice).max(), np.abs(music * MUSIC_GAIN).max(), np.abs(sfx * SFX_GAIN).max(), np.abs(mix).max()))
