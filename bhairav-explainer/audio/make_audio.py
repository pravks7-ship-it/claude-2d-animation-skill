#!/usr/bin/env python3
"""Synthesises background music + sound effects for the explainer and mixes them under the narration.
usage: python3 audio/make_audio.py   (run from bhairav-explainer/; needs numpy + ffmpeg)
writes audio/music.wav, audio/sfx.wav, audio/mix.wav
"""
import numpy as np, subprocess, wave, os
SR, DUR = 44100, 85.5
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
tb = np.zeros((N, 2)); plucks = [SA * .75, SA * 2, SA * 2, SA]  # Pa Sa' Sa' Sa
i, t0 = 0, 0.0
while t0 < DUR - 1: place(tb, tanpura(plucks[i % 4]), t0, .5 if i % 4 else .6, [-.3, .2, -.1, .3][i % 4]); i += 1; t0 += 1.15
music += tb * curve([(0, .9), (25, .9), (27, .45), (42, .45), (48, .9), (72, .9), (73, .5), (80, .5), (81, .9), (85.5, .9)])[:, None]
place(music, pad([SA / 2, SA * .75, SA], DUR, 500), 0, .16)
# bansuri phrases (Bhupali: Sa Re Ga Pa Dha) in the calm passages, kept sparse under the voice
P = {'S': 587.33, 'R': 659.26, 'G': 739.99, 'P': 880.0, 'D': 987.77, "S'": 1174.66, 'd': 493.88, 'p': 440.0}
def phrase(start, notes, gain=.16, pan=.25):
    t0, prev = start, None
    for n, d in notes:
        if n != '-': place(music, flute(P[prev] if prev else P[n], P[n], d * 1.02), t0, gain, pan); prev = n
        else: prev = None
        t0 += d
phrase(0.8, [('G', .9), ('P', .6), ('D', 1.5), ('-', .5), ("S'", 1.1), ('D', .5), ('P', 1.6)])
phrase(7.6, [('G', .7), ('R', .5), ('S', 1.4), ('-', .4), ('d', .6), ('S', 1.6)], .13)
phrase(12.6, [('P', .8), ('D', .5), ("S'", 1.8)], .12)
phrase(43.2, [('P', 1.0), ('G', .6), ('R', .6), ('S', 1.8)], .14)
phrase(48.6, [('S', .7), ('R', .5), ('G', 1.4), ('-', .4), ('P', .7), ('D', .5), ("S'", 1.9)], .15)
phrase(56.4, [('D', .8), ('P', .6), ('G', 1.5)], .12)
phrase(60.2, [('G', .5), ('P', .5), ('D', .5), ("S'", 2.0)], .15)
phrase(62.8, [('P', .8), ('D', .5), ('P', .5), ('G', 1.3), ('-', .5), ('R', .6), ('S', 1.5)], .13)
phrase(67.2, [('S', .6), ('R', .6), ('G', .6), ('P', 1.4), ('-', .3), ('D', .6), ("S'", 1.8)], .15)
# wrath: dissonant low pad (Sa + komal Re + Pa), deep rumble, war-drum pulse
for a, b in [(25.9, 43.2), (72.2, 80.4)]:
    place(music, pad([SA / 2, SA / 2 * 16 / 15, SA * .75, SA * 16 / 15], b - a, 700), a, .30)
    t = tt(b - a); place(music, norm(np.sin(2 * np.pi * 36.7 * t) * (.7 + .3 * np.sin(2 * np.pi * 3 * t))) * adsr(len(t), 1, 1), a, .22)
beat = 0.55
for k, t0 in enumerate(np.arange(29.3, 42.6, beat)):
    acc = k % 4 == 0
    place(music, drum(62 if acc else 84, .7, .35), t0, .42 if acc else .2, -.15 if acc else .2)
    if k % 4 == 2: place(music, drum(150, .25, .6), t0 + beat / 2, .16, .3)
for k, t0 in enumerate(np.arange(72.3, 80.0, 1.1)): place(music, drum(58, .9, .2), t0, .32); place(music, drum(130, .25, .5), t0 + .37, .12, .3)
# finale: bells, conch, damaru roll
place(music, conch(2.7), 82.75, .34, -.2); place(music, conch(2.5, 349), 82.95, .16, .3)
for k in range(22): place(music, drum(210 if k % 2 else 170, .16, .9), 82.8 + k * .085, .16 * (1 - k / 30), .5 if k % 2 else -.5)
for t0 in (82.78, 83.5, 84.2): place(music, bell(392, 4), t0, .2, .1)
music = reverb(music, 2.4, .35)
music *= curve([(0, 0), (.6, 1), (84.7, 1), (85.5, 0)])[:, None]

# ---------- sound effects ----------
sfx = np.zeros((N, 2))
def S(sig, t, g, pan=0.0): place(sfx, sig, t, g, pan)
fb = np.zeros((N, 2))  # fire bed follows what is on screen
place(fb, fire(DUR), 0, 1)
sfx += fb * curve([(0, 0), (.5, .16), (11.4, .16), (11.8, .10), (16.8, .10), (17.2, 0), (29.3, 0), (30.4, .12), (31.5, .24), (35.9, .2), (36.4, .06), (42.6, .05), (43, 0),
                   (62.2, 0), (62.6, .17), (66.5, .17), (66.9, 0), (80.1, 0), (80.5, .14), (84.8, .14), (85.5, 0)])[:, None]
# S1 recap
S(shimmer(2.4), 1.1, .20); S(bell(523, 4.5), 3.5, .22); S(whoosh(.7, 300, 3000), 5.0, .10, -.4); S(whoosh(.7, 300, 3000), 8.6, .10, .4)
# S2 question
S(pop(480), 14.2, .28, .1); S(pop(620), 14.32, .26, .15); S(chime(1319, 1.4), 14.45, .12, .2)
# S3 trembling, insisting, the flower
tr = np.zeros(int(SR * 1.45))
for k in range(34): c = filt(noise(.03), 1800, 7000) * np.exp(-tt(.03) * 120); j = int(k * .042 * SR); tr[j:j + len(c)] += c * rng.uniform(.5, 1)
S(norm(tr), 17.25, .14, -.2); S(drum(120, .3, .5), 19.05, .22, -.2)
S(whoosh(.35, 500, 4000), 21.15, .14, .4); S(pop(700), 21.42, .3, .45); S(chime(1568, 1.2), 21.5, .12, .45); S(pop(560), 23.45, .26, .5)
# S4 eyes turn red
S(whoosh(.5, 300, 6000), 25.75, .22); S(riser(1.9), 26.5, .26); S(boom(2.2), 28.3, .42); S(thunder(2.0), 28.35, .18)
# S5 Bhairava
S(boom(2.6), 29.3, .5); S(whoosh(1.0, 250, 5000), 29.5, .26, .3); S(riser(1.3), 30.6, .2, .3); S(whoosh(.9, 150, 2500), 31.1, .26, .3)
S(boom(2.8), 32.55, .6); S(bell(196, 3.5), 32.6, .18)
S(roar(2.5), 33.45, .5, .2)
for t0, p in [(33.6, -.7), (34.3, .7), (34.9, -.5), (35.4, .6)]: S(thunder(2.2), t0, .3, p)
# S6 the cut
S(whoosh(.6, 300, 5000), 38.0, .2, .4); S(riser(.9), 39.4, .16, .2)
S(whoosh(.28, 1500, 12000), 40.18, .5, .4)
t = tt(1.6); S(norm(sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dc) for f, dc in [(2130, 4), (3310, 6), (4725, 8), (6240, 11)])), 40.3, .2, .4)
S(boom(2.6), 40.3, .6); S(thunder(1.8), 40.35, .22)
S(shimmer(1.1, up=False), 40.5, .16, .1); S(drum(95, .4, .2), 41.62, .34, -.2); S(pop(300), 41.62, .2, -.2)
# S7 / S8 mercy and verdict
S(shimmer(1.6), 42.7, .13); S(bell(659, 3.5), 43.0, .10, .2)
S(shimmer(2.0), 48.4, .16, -.2); S(bell(523, 4.5), 50.2, .2, -.2)
for t0, p in [(53.7, .1), (56.1, .4)]:
    S(pop(520), t0, .28, p); S(whoosh(.2, 800, 6000), t0 + .62, .2, p); S(drum(110, .35, .5), t0 + .72, .4, p); S(pop(180), t0 + .72, .2, p)
S(pop(520), 59.35, .28, .7); S(chime(784, 1.4), 60.05, .2, .7); S(chime(988, 1.4), 60.17, .2, .7); S(chime(1175, 1.8), 60.29, .22, .7)
# S9 yajna and Pushkar
S(bell(784, 3), 62.6, .12, .3); S(bell(1047, 2.5), 64.6, .07, -.3)
wind = filt(noise(5.8), 250, 1400) * (.6 + .4 * np.sin(2 * np.pi * .23 * tt(5.8))) * adsr(int(SR * 5.8), 1, 1.2); S(norm(wind), 66.6, .07)
for k in range(5): S(pop(900 - k * 60), 67.45 + k * .28, .1, -.6 + k * .3)
S(whoosh(1.2, 250, 2500), 68.7, .1); S(pop(600), 69.9, .24, -.3); S(bell(440, 5), 70.1, .24, -.1); S(bell(440, 4), 71.3, .13, .1)
# S10 the skull
S(boom(2.4), 72.2, .46)
for k, t0 in enumerate((72.45, 72.75, 73.05)): S(pop(420 + k * 110), t0, .28, (-.6, .4, -.7)[k])
S(whoosh(.5, 300, 4000), 74.2, .16, .3); S(drum(88, .5, .3), 74.4, .42, .3); S(shimmer(.9, up=False), 74.45, .13, .3)
for k in range(17):
    t0 = 76.9 + k * .165; S(whoosh(.16, 600, 5000, up=bool(k % 2)), t0, .15 * (.6 + .4 * np.sin(k * .7)), .1 + .3 * (k % 2))
    if k % 3 == 0: S(filt(noise(.05), 900, 2500) * np.exp(-tt(.05) * 60), t0 + .05, .12, .3)
# S11 outro
S(whoosh(.8, 200, 3000), 79.9, .16); S(shimmer(1.4), 80.3, .13)
S(riser(.7), 82.1, .16); S(boom(3), 82.75, .55)
sfx = reverb(sfx, 1.6, .18)
sfx *= curve([(0, 0), (.3, 1), (84.8, 1), (85.5, 0)])[:, None]

# ---------- mix ----------
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(HERE, 'narration.mp3'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
v = np.frombuffer(raw, np.float32).astype(np.float64); voice = np.zeros(N); voice[: min(N, len(v))] = v[:N]
# side-chain duck: music dips a little whenever the narrator is speaking
w = int(.05 * SR); lvl = np.sqrt(np.convolve(voice ** 2, np.ones(w) / w, 'same')); k = int(.25 * SR)
duck = 1 - .4 * np.clip(np.convolve((lvl > .02).astype(float), np.ones(k) / k, 'same'), 0, 1)
MUSIC_GAIN, SFX_GAIN = .24, .50
mix = voice[:, None] * .92 + music * MUSIC_GAIN * duck[:, None] + sfx * SFX_GAIN * (.75 + .25 * duck[:, None])
mix = np.where(np.abs(mix) > .85, np.sign(mix) * (.85 + .14 * np.tanh((np.abs(mix) - .85) / .14)), mix)
def save(name, x):
    with wave.open(os.path.join(HERE, name), 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
save('music.wav', music * MUSIC_GAIN); save('sfx.wav', sfx * SFX_GAIN); save('mix.wav', mix)
rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
print('rms dB  voice %.1f  music %.1f  sfx %.1f  mix %.1f  | peaks music %.2f sfx %.2f mix %.2f' % (rms(voice), rms(music * MUSIC_GAIN), rms(sfx * SFX_GAIN), rms(mix), np.abs(music * MUSIC_GAIN).max(), np.abs(sfx * SFX_GAIN).max(), np.abs(mix).max()))
