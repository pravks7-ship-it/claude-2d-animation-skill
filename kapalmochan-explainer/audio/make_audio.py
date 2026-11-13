#!/usr/bin/env python3
"""Synthesises background music + sound effects for the explainer and mixes them under the narration.
usage: python3 audio/make_audio.py   (run from kapalmochan-explainer/; needs numpy + ffmpeg)
writes audio/music.wav, audio/sfx.wav, audio/mix.wav
"""
import numpy as np, subprocess, wave, os
SR, DUR = 44100, 114.6
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
music += tb * curve([(0, .5), (21, .5), (22, .9), (70, .9), (70.5, .6), (75.5, .6), (76.2, .9), (DUR, .9)])[:, None]
place(music, pad([SA / 2, SA * .75, SA], DUR, 500), 0, .16)
P = {'S': 587.33, 'R': 659.26, 'G': 739.99, 'g': 698.46, 'P': 880.0, 'D': 987.77, "S'": 1174.66, 'd': 493.88, 'p': 440.0}
def phrase(start, notes, gain=.14, pan=.25):
    t0, prev = start, None
    for n, d in notes:
        if n != '-': place(music, flute(P[prev] if prev else P[n], P[n], d * 1.02), t0, gain, pan); prev = n
        else: prev = None
        t0 += d
phrase(21.8, [('S', .7), ('R', .5), ('G', 1.3), ('-', .3), ('P', .6), ('G', 1.4)], .11)
phrase(31.4, [('P', .8), ('D', .5), ("S'", 1.7)], .13)
phrase(38.6, [('D', .7), ('P', .5), ('G', 1.4)], .11)
phrase(45.9, [('G', .5), ('P', .5), ('D', .5), ("S'", 1.8)], .13)
# the wandering: a plaintive turn with komal Ga
phrase(49.9, [('S', .8), ('R', .5), ('g', 1.5), ('-', .4), ('P', .8), ('g', .5), ('R', .6), ('S', 1.6)], .15)
phrase(56.9, [('P', .7), ('D', .5), ('P', .5), ('g', 1.4), ('R', .6), ('S', 1.4)], .13)
phrase(60.5, [('g', .7), ('R', .5), ('S', 1.7)], .12)
phrase(65.4, [('S', .4), ('R', .4), ('G', .4), ('P', .5), ('D', .5), ("S'", 2.2)], .17)
phrase(83.9, [('G', .8), ('P', .6), ('D', 1.4), ('-', .4), ("S'", 1.9)], .14)
phrase(96.0, [('P', .8), ('G', .6), ('R', .6), ('S', 1.6)], .12)
phrase(99.6, [('S', .6), ('R', .6), ('G', .6), ('P', 1.6)], .12)
phrase(104.5, [('D', .8), ("S'", 1.8), ('-', .3), ('D', .5), ('P', 1.6)], .14)
# dread: dissonant low pad + rumble under the recap, the shadow and the stand-off at the gate
for a, b in [(0.2, 21.6), (70.2, 76.0)]:
    place(music, pad([SA / 2, SA / 2 * 16 / 15, SA * .75, SA * 16 / 15], b - a, 700), a, .28)
    t = tt(b - a); place(music, norm(np.sin(2 * np.pi * 36.7 * t) * (.7 + .3 * np.sin(2 * np.pi * 3 * t))) * adsr(len(t), 1, 1), a, .2)
for k, t0 in enumerate(np.arange(0.5, 5.6, .55)): place(music, drum(62 if k % 4 == 0 else 84, .7, .35), t0, .4 if k % 4 == 0 else .2, -.15 if k % 4 == 0 else .2)
for k, t0 in enumerate(np.arange(6.4, 12.0, 1.1)): place(music, drum(58, .9, .2), t0, .3); place(music, drum(130, .25, .5), t0 + .37, .11, .3)
for k, t0 in enumerate(np.arange(16.5, 21.2, .9)): place(music, drum(50, 1.0, .15), t0, .4, -.3)          # the shadow's tread
for k, t0 in enumerate(np.arange(49.9, 63.3, .62)): place(music, drum(96, .35, .25), t0, .13, -.1); place(music, drum(190, .14, .7), t0 + .31, .06, .3)
for k, t0 in enumerate(np.arange(70.6, 73.3, .62)): place(music, drum(70, .6, .3), t0, .26)
for k, t0 in enumerate(np.arange(89.5, 95.2, .5)):  # jubilant
    place(music, drum(70 if k % 4 == 0 else 100, .5, .4), t0, .34 if k % 4 == 0 else .18); place(music, drum(200, .14, .8), t0 + .25, .1, .4)
    if k % 4 == 3: place(music, drum(170, .14, .8), t0 + .375, .09, -.4)
place(music, conch(2.4), 89.45, .2, -.2); place(music, conch(2.2, 233), 68.3, .13, .2)
# finale
F = 111.95
place(music, conch(2.6), F, .34, -.2); place(music, conch(2.4, 349), F + .2, .16, .3)
for k in range(22): place(music, drum(210 if k % 2 else 170, .16, .9), F + .05 + k * .085, .16 * (1 - k / 30), .5 if k % 2 else -.5)
for t0 in (F + .03, F + .75, F + 1.45): place(music, bell(392, 4), t0, .2, .1)
music = reverb(music, 2.4, .35)
music *= curve([(0, 0), (.6, 1), (DUR - .8, 1), (DUR, 0)])[:, None]

# ---------- sound effects ----------
sfx = np.zeros((N, 2))
def S(sig, t, g, pan=0.0): place(sfx, sig, t, g, pan)
def ticks(d, step, lo=1800, hi=7000):
    out = np.zeros(int(SR * d))
    for k in range(int(d / step)): c = filt(noise(.03), lo, hi) * np.exp(-tt(.03) * 120); j = int(k * step * SR); out[j:j + len(c)] += c * rng.uniform(.5, 1)
    return norm(out)
def metal(d=1.6): t = tt(d); return norm(sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dc) for f, dc in [(2130, 4), (3310, 6), (4725, 8), (6240, 11)]))
def windbed(d): return norm(filt(noise(d), 250, 1400) * (.6 + .4 * np.sin(2 * np.pi * .23 * tt(d))) * adsr(int(SR * d), 1, 1.2))
def bark(): t = tt(.13); ph = 2 * np.pi * np.cumsum(430 - 1300 * t) / SR; return norm(sum(np.sin(k * ph) / k for k in range(1, 9)) * np.sin(np.pi * t / .13) ** .6 + .4 * filt(noise(.13), 600, 3000))
def splash(): t = tt(.9); return norm(filt(noise(.9), 500, 7000) * np.exp(-t * 5) * (1 + .5 * np.sin(2 * np.pi * 18 * t)) + .5 * drum(80, .9, 0))
def whistle(d=.7): t = tt(d); return np.sin(2 * np.pi * np.cumsum(1900 * (1 - .75 * t / d)) / SR) * adsr(len(t), .03, .2)
fb = np.zeros((N, 2)); place(fb, fire(DUR), 0, 1)
sfx += fb * curve([(0, 0), (.4, .07), (20.8, .06), (21.4, 0), (109.2, 0), (109.8, .14), (DUR - .8, .14), (DUR, 0)])[:, None]
# K1 recap
S(riser(.9), 3.75, .16, .2); S(whoosh(.28, 1500, 12000), 4.63, .5, .4); S(metal(), 4.75, .2, .4); S(boom(2.6), 4.75, .6); S(thunder(1.8), 4.8, .22)
S(shimmer(.9, up=False), 4.95, .15, .1); S(drum(95, .4, .2), 5.8, .3, -.2); S(boom(2.2), 5.95, .4); S(whoosh(.6, 300, 4000), 6.9, .14, .3)
S(drum(88, .5, .3), 8.25, .4, .3); S(shimmer(.9, up=False), 8.3, .13, .3)
for k in range(11):
    S(whoosh(.16, 600, 5000, up=bool(k % 2)), 10.0 + k * .165, .15 * (.6 + .4 * np.sin(k * .7)), .1 + .3 * (k % 2))
# K2 the sin and its shadow
S(whoosh(1.4, 120, 1200, up=False), 13.0, .2, .3); S(boom(2.6), 13.95, .5); S(bell(196, 3.5), 14.0, .16)
S(riser(1.7), 16.4, .2, -.3); S(roar(2.2), 16.7, .22, -.4); S(boom(2.8), 18.05, .5, -.3); S(thunder(2.4), 18.1, .2, -.4)
# K3 Kailash
S(windbed(9.6), 21.2, .07); S(bell(523, 4), 21.5, .14, .3); S(ticks(2.7, .34, 300, 1500), 21.5, .12, -.3); S(shimmer(1.2), 24.3, .08, .2)
# K4 the answer
S(bell(523, 4.5), 31.3, .16, -.2)
for t0, p in [(35.9, .1), (41.4, .4), (46.0, .7)]: S(pop(520), t0, .28, p); S(chime(1319, 1.4), t0 + .12, .1, p)
S(drum(120, .3, .5), 38.7, .16, -.2)
S(chime(784, 1.4), 46.75, .2, .7); S(chime(988, 1.4), 46.87, .2, .7); S(chime(1175, 1.8), 46.99, .22, .7)
# K5 the wandering
S(windbed(15.8), 49.3, .06); S(pop(600), 50.2, .22, .5)
for k, t0 in enumerate((53.0, 54.0, 55.0)): S(bell(784 + k * 90, 2.2), t0, .06, .6 - k * .5)
S(pop(480), 57.15, .26, -.5); S(ticks(2.1, .26, 900, 2600), 57.4, .14, -.5); S(drum(110, .35, .5), 59.1, .26, -.5)
S(whoosh(.7, 250, 3000, up=False), 59.9, .14); S(roar(2.0), 60.4, .13, -.5)
S(riser(1.5), 63.4, .15)
for k in range(6): S(whoosh(.26, 400, 5000, up=bool(k % 2)), 63.45 + k * .27, .16, -.5 + k * .2)
S(boom(2.2), 63.85, .3)
# K6 Kashi
S(boom(2.4), 65.1, .34); S(shimmer(1.8), 65.2, .18); S(boom(2.6), 66.7, .42); S(bell(523, 5), 66.75, .26); S(bell(392, 4.5), 68.2, .18, -.3); S(bell(659, 4), 69.0, .13, .3)
# K7 the gate
S(riser(.8), 72.5, .14, -.2); S(boom(2.8), 73.3, .58); S(metal(2.0), 73.3, .16); S(thunder(1.8), 73.35, .2, -.3); S(whoosh(.5, 800, 9000, up=False), 73.38, .3, -.3)
S(shimmer(1.6), 75.7, .16, .2); S(whoosh(1.0, 300, 4000, up=False), 75.75, .2, -.4); S(pop(560), 76.2, .22, -.4); S(bell(440, 4), 76.35, .14, -.3)
# K8 the skull lets go
S(ticks(1.4, .09, 900, 3000) * np.linspace(.3, 1, int(SR * 1.4)), 79.2, .16, .3)
for k, f in enumerate((1175, 1568, 1976, 2349)): S(chime(f, 1.3), 80.6 + k * .03, .13, .3)
S(whoosh(.3, 1000, 9000), 80.55, .26, .3); S(whistle(.7), 80.68, .1, .3); S(boom(2.6), 81.3, .5); S(drum(80, .6, .4), 81.3, .4); S(shimmer(1.6), 81.7, .17); S(bell(523, 4.5), 82.1, .18)
# K9 Kapalmochan
S(whistle(.6), 84.1, .08); S(splash(), 84.75, .42); S(shimmer(1.2, up=False), 84.85, .1)
for k in range(5): S(pop(1100 + 240 * rng.random()), 85.0 + k * .13 + .05 * rng.random(), .08, -.4 + k * .2)
for k, t0 in enumerate((85.7, 85.95, 86.2, 86.4, 86.6, 86.8)): S(chime(784 * 2 ** (k * 2 / 12), 1.2), t0, .09, -.5 + k * .2)
S(pop(600), 86.6, .2); S(bell(440, 5), 86.8, .22)
# K10 freed, and Kotwal
S(boom(2.4), 89.3, .36); S(shimmer(2.0), 89.5, .2); S(bell(523, 4.5), 89.65, .2)
S(whoosh(.9, 250, 3000), 91.6, .14, -.5); S(shimmer(1.0), 93.15, .14, -.1); S(drum(95, .4, .3), 93.8, .28, .1)
S(boom(2.6), 93.45, .46); S(bell(196, 3.5), 93.5, .16); S(pop(520), 93.9, .2, .5); S(bark(), 94.2, .2, .55); S(bark(), 94.42, .17, .55)
# K11 the first gaze
for k, t0 in enumerate((95.9, 97.6, 99.3, 100.9)): S(bell(784 if k % 2 else 659, 3.2), t0, .1, .4 if k % 2 else -.4)
S(shimmer(1.4), 101.7, .15); S(drum(60, .9, .15), 101.85, .34); S(bell(262, 5), 101.9, .2)
# K12 the question, K13 outro
S(whoosh(.8, 200, 3000), 103.8, .13); S(boom(2.4), 106.0, .38)
for k, t0 in enumerate((107.2, 107.5, 107.8)): S(pop(420 + k * 110), t0, .28, (-.6, .6, 0)[k])
S(whoosh(.8, 200, 3000), 109.2, .16); S(shimmer(1.4), 109.8, .13); S(riser(.7), 111.3, .16); S(boom(3), F, .55)
sfx = reverb(sfx, 1.6, .18)
sfx *= curve([(0, 0), (.3, 1), (DUR - .7, 1), (DUR, 0)])[:, None]

# ---------- mix ----------
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(HERE, 'narration.wav'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
v = np.frombuffer(raw, np.float32).astype(np.float64); voice = np.zeros(N); voice[: min(N, len(v))] = v[:N]
voice *= 1.5  # this narration was delivered ~3.5 dB quieter than episode 1
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
