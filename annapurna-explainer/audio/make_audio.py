#!/usr/bin/env python3
"""Synthesises background music + sound effects for the explainer and mixes them under the narration.
usage: python3 audio/make_audio.py   (run from annapurna-explainer/; needs numpy + ffmpeg)
writes audio/music.wav, audio/sfx.wav, audio/mix.wav
"""
import numpy as np, subprocess, wave, os
SR, DUR = 44100, 132.0
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
music += tb * curve([(0, .9), (42.6, .9), (43.4, .45), (68.0, .45), (69.0, .7), (75.0, .9), (DUR, .9)])[:, None]
place(music, pad([SA / 2, SA * .75, SA], DUR, 500), 0, .16)
P = {'S': 587.33, 'R': 659.26, 'G': 739.99, 'g': 698.46, 'P': 880.0, 'D': 987.77, 'd': 932.33, "S'": 1174.66, "R'": 1318.5}
def phrase(start, notes, gain=.14, pan=.25):
    t0, prev = start, None
    for n, d in notes:
        if n != '-': place(music, flute(P[prev] if prev else P[n], P[n], d * 1.02), t0, gain, pan); prev = n
        else: prev = None
        t0 += d
phrase(0.6, [('G', .8), ('P', .6), ('D', 1.5), ('-', .4), ("S'", 1.2), ('D', .5), ('P', 1.6)], .14)
phrase(8.4, [('S', .6), ('R', .5), ('G', .6), ('P', 1.4), ('D', .6), ("S'", 1.8)], .13)
phrase(20.3, [('P', .8), ('G', .6), ('R', .6), ('S', 1.6), ('-', .4), ('R', .6), ('G', 1.6)], .12)
phrase(33.2, [('g', 1.0), ('R', .7), ('S', 1.6)], .12)
phrase(36.2, [('S', .7), ('R', .5), ('g', 1.4), ('P', .7), ('g', .5), ('R', 1.6)], .12)
# famine: komal Re/Ga/Dha, sparse
phrase(52.8, [('S', 1.0), ('g', 1.2), ('R', .8), ('S', 1.8)], .12)
phrase(57.8, [('d', 1.0), ('P', .8), ('g', 1.6)], .12)
phrase(61.0, [('S', .8), ('R', .5), ('g', 1.5), ('-', .4), ('P', .8), ('g', .5), ('R', .6), ('S', 1.6)], .14)
phrase(64.9, [('g', .8), ('R', .6), ('S', 2.0)], .11)
# Annapurna: bright, devotional
phrase(75.3, [('S', .4), ('R', .4), ('G', .4), ('P', .5), ('D', .5), ("S'", 2.2)], .17)
phrase(79.3, [("S'", .6), ('D', .6), ('P', .6), ('G', 1.4), ('P', .6), ('D', 1.6)], .14)
phrase(90.5, [('G', .5), ('P', .5), ('D', .5), ("S'", 1.0), ("R'", .5), ("S'", 1.8)], .16)
phrase(94.8, [('P', .8), ('G', .6), ('R', .6), ('S', 1.8)], .1)
phrase(99.4, [('S', .5), ('R', .5), ('G', .7)], .12); phrase(101.1, [('G', .5), ('P', .5), ('D', .7)], .12); phrase(103.0, [('D', .5), ("S'", .5), ("R'", .9)], .14)
phrase(105.2, [('G', .8), ('P', .6), ('D', 1.6), ('-', .4), ("S'", 1.2), ('D', .5), ('P', 1.6)], .13)
phrase(112.6, [('S', .7), ('R', .5), ('G', 1.2), ('P', .6), ('D', 1.6)], .12)
phrase(116.2, [('G', .5), ('P', .5), ('D', .5), ("S'", 2.4)], .15)
# famine dread pad and a slow heartbeat drum
place(music, pad([SA / 2, SA / 2 * 16 / 15, SA * .75, SA * 16 / 15], 25.6, 650), 43.0, .26)
t = tt(25.6); place(music, norm(np.sin(2 * np.pi * 36.7 * t) * (.7 + .3 * np.sin(2 * np.pi * 3 * t))) * adsr(len(t), 1, 1), 43.0, .16)
for k, t0 in enumerate(np.arange(43.4, 60.4, 1.2)): place(music, drum(50, .9, .1), t0, .3, -.1); place(music, drum(56, .7, .1), t0 + .28, .18, -.1)
for k, t0 in enumerate(np.arange(60.9, 68.2, .62)): place(music, drum(92, .35, .25), t0, .12, -.1)
# joy when Annapurna appears and the bowl is filled
def damaru_roll(a, b, g=.14):
    for k, t0 in enumerate(np.arange(a, b, .14)): place(music, drum(230 if k % 2 else 190, .13, .9), t0, g * (1.0 if k % 6 in (0, 3) else .6), .45 if k % 2 else -.45)
for k, t0 in enumerate(np.arange(75.2, 83.6, .56)): place(music, drum(72 if k % 4 == 0 else 104, .5, .4), t0, .24 if k % 4 == 0 else .12); place(music, drum(200, .14, .8), t0 + .28, .07, .4)
for k, t0 in enumerate(np.arange(90.4, 94.2, .5)): place(music, drum(70 if k % 4 == 0 else 100, .5, .4), t0, .3 if k % 4 == 0 else .16); place(music, drum(200, .14, .8), t0 + .25, .09, .4)
damaru_roll(103.0, 104.2, .12)
place(music, conch(2.6), 75.15, .3, -.2); place(music, conch(2.4, 349), 75.35, .14, .3)
place(music, conch(2.4, 233), 123.3, .16, .2)
F = 129.6
place(music, conch(2.6), F, .34, -.2); place(music, conch(2.4, 349), F + .2, .16, .3)
for k in range(22): place(music, drum(210 if k % 2 else 170, .16, .9), F + .05 + k * .085, .16 * (1 - k / 30), .5 if k % 2 else -.5)
for t0 in (F + .03, F + .75, F + 1.45): place(music, bell(392, 4), t0, .2, .1)
music = reverb(music, 2.4, .35)
music *= curve([(0, 0), (.6, 1), (DUR - .8, 1), (DUR, 0)])[:, None]

# ---------- sound effects ----------
sfx = np.zeros((N, 2))
def S(sig, t, g, pan=0.0): place(sfx, sig, t, g, pan)
def windbed(d): return norm(filt(noise(d), 250, 1400) * (.6 + .4 * np.sin(2 * np.pi * .23 * tt(d))) * adsr(int(SR * d), 1, 1.2))
def splash(): t = tt(.9); return norm(filt(noise(.9), 500, 7000) * np.exp(-t * 5) * (1 + .5 * np.sin(2 * np.pi * 18 * t)) + .5 * drum(80, .9, 0))
def footsteps(d, step):
    out = np.zeros(int(SR * d))
    for k in range(int(d / step)): c = filt(noise(.08), 120, 900) * np.exp(-tt(.08) * 50); j = int(k * step * SR); out[j:j + len(c)] += c
    return norm(out)
def crickets(d):
    out = np.zeros(int(SR * d)); t = tt(.05)
    for k in range(int(d * 6)):
        j = int(rng.uniform(0, d - .3) * SR); ch = np.sin(2 * np.pi * rng.uniform(4300, 5200) * t) * np.sin(np.pi * t / .05) ** 2
        for r in range(3): jj = j + int(r * .07 * SR); out[jj:jj + len(ch)] += ch * rng.uniform(.4, 1)
    return norm(out * adsr(len(out), 1, 1))
def rumble(d=1.0): t = tt(d); return norm(filt(noise(d), 40, 220) * np.sin(np.pi * t / d) * (1 + .6 * np.sin(2 * np.pi * 9 * t)))
def scoop(): t = tt(.35); return norm(filt(noise(.35), 300, 2500) * np.exp(-t * 12) + .4 * np.sin(2 * np.pi * np.cumsum(500 - 400 * t) / SR) * np.exp(-t * 10))
def knock(): return norm(drum(140, .18, .9))
def sizzle(d): t = tt(d); return norm(filt(noise(d), 3000, 10000) * (.5 + .5 * rng.random(len(t)) ** 8) * adsr(len(t), .6, .8))
# R recap
S(windbed(5.0), 0.2, .06); S(shimmer(1.6), .5, .12); S(shimmer(1.1, up=False), 5.5, .2); S(splash(), 6.6, .42); S(chime(1175, 1.6), 6.7, .14); S(boom(2.4), 6.7, .3); S(bell(523, 5), 6.75, .16)
S(shimmer(2.0), 8.2, .14); S(boom(2.2), 9.3, .3); S(bell(659, 4), 9.4, .12)
S(footsteps(3.2, .46), 16.7, .12); S(boom(2.4), 17.3, .34)
# Kailash
S(windbed(23.0), 19.9, .07); S(bell(523, 4.5), 20.3, .14)
for t0, p in [(26.6, -.4), (28.9, 0), (30.5, .4)]: S(pop(520), t0, .26, p); S(shimmer(.9, up=False), t0 + .1, .1, p)
S(pop(480), 35.4, .24, .2); S(pop(620), 35.55, .2, .2); S(drum(110, .35, .5), 35.7, .22, .2)
S(riser(1.0), 40.3, .14, .3); S(shimmer(2.4, up=False), 41.1, .24, .3); S(whoosh(1.2, 300, 8000), 41.2, .26, .3); S(boom(2.4), 41.3, .3)
# famine
S(windbed(9.0), 43.0, .1)
for k in range(10): S(chime(1568 + 200 * rng.random(), .8), 43.5 + k * .24, .05, rng.uniform(-.6, .6))
S(whoosh(1.6, 400, 6000), 43.6, .14); S(whoosh(1.2, 2000, 200, up=False), 46.6, .14)
for k in range(7): S(filt(noise(.12), 600, 3000) * np.exp(-tt(.12) * 30), 47.25 + k * .17, .12, rng.uniform(-.5, .5))
S(fire(1.2) * np.linspace(1, 0, int(SR * 1.2)), 48.4, .18, .6); S(whoosh(.6, 200, 1500, up=False), 49.1, .1, .6)
for k in range(3): S(boom(1.6), 50.0 + k * .5, .16)
S(windbed(5.2), 52.4, .1); S(chime(1319, 1.6), 55.2, .1); S(rumble(1.0), 58.4, .4); S(rumble(1.0), 59.6, .3)
# door to door
S(footsteps(7.6, .46), 60.7, .14, .05)
for t0 in (64.6, 65.6, 66.6): S(knock(), t0, .2, .3); S(knock(), t0 + .18, .16, .3); S(drum(90, .3, .3), t0 + .5, .14, .3)
S(pop(560), 66.0, .2)
# the lone kitchen
S(crickets(6.4), 68.4, .06, -.2); S(windbed(6.4), 68.4, .05); S(shimmer(1.8), 70.2, .16); S(sizzle(4.0), 70.6, .05, .1); S(pop(600), 71.0, .2); S(boom(2.4), 73.9, .36); S(bell(523, 4.5), 74.0, .16)
# Annapurna
S(boom(2.8), 75.0, .4); S(shimmer(2.4), 75.1, .24); S(bell(392, 5), 75.2, .22); S(boom(2.4), 76.6, .3); S(bell(659, 4.5), 76.7, .14, .3)
S(sizzle(8.0), 75.5, .05); S(chime(1568, 1.2), 79.2, .16, -.4); S(pop(560), 79.2, .2, -.4); S(pop(560), 81.0, .2, .4); S(shimmer(1.4), 81.0, .14, .4)
# bhiksham dehi
S(footsteps(1.8, .4), 84.0, .14, -.3); S(pop(480), 88.3, .24, -.3); S(bell(784, 3.5), 89.0, .1, -.3)
for s0 in (91.0, 91.9, 92.8): S(scoop(), s0 - .05, .24, .3); S(whoosh(.5, 600, 5000), s0, .14, 0); S(pop(380), s0 + .58, .2, -.3); S(chime(1319, .9), s0 + .6, .1, -.3)
S(shimmer(1.6), 93.6, .14, -.2)
# grain is life
for t0, p in [(99.4, -.6), (101.1, 0), (103.0, .6)]: S(pop(520), t0, .24, p); S(bell(523 * (1 + .25 * (p + .6)), 3), t0 + .05, .12, p)
S(shimmer(1.6), 103.1, .18)
# annakshetra, temples, Diwali, jyotirlinga
S(bell(784, 3.5), 105.4, .1, .3); S(pop(600), 108.8, .2)
S(bell(523, 5), 112.4, .18, -.4); S(bell(392, 5), 113.0, .14, .4); S(pop(560), 112.6, .18, -.4); S(pop(600), 113.6, .18, .4)
for k in range(14): S(chime(1175 + 60 * (k % 5), .8), 115.9 + k * .11, .06, -.8 + k * .12)
S(boom(2.4), 117.8, .3); S(shimmer(2.2), 117.9, .22); S(bell(659, 4.5), 118.2, .18); S(pop(600), 119.0, .2)
S(whoosh(1.0, 2000, 200, up=False), 121.6, .14); S(riser(1.3), 121.9, .16); S(boom(3.0), 123.2, .48); S(bell(196, 4), 123.3, .2)
for k, t0 in enumerate((124.6, 124.9)): S(pop(420 + k * 140), t0, .26, (-.6, .6)[k])
fb = np.zeros((N, 2)); place(fb, fire(DUR), 0, 1)
sfx += fb * curve([(0, 0), (126.9, 0), (127.4, .14), (DUR - .8, .14), (DUR, 0)])[:, None]
S(whoosh(.8, 200, 3000), 126.8, .14); S(shimmer(1.4), 127.3, .13); S(riser(.7), 128.9, .16); S(boom(3), F, .55)
sfx = reverb(sfx, 1.6, .18)
sfx *= curve([(0, 0), (.3, 1), (DUR - .7, 1), (DUR, 0)])[:, None]

# ---------- mix ----------
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(HERE, 'narration.wav'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
v = np.frombuffer(raw, np.float32).astype(np.float64); voice = np.zeros(N); voice[: min(N, len(v))] = v[:N]
voice *= 1.4  # this narration was delivered ~3 dB quieter than episode 1
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
