#!/usr/bin/env python3
"""Synthesises background music + sound effects for the explainer and mixes them under the narration.
usage: python3 audio/make_audio.py   (run from kashi-explainer/; needs numpy + ffmpeg)
writes audio/music.wav, audio/sfx.wav, audio/mix.wav
"""
import numpy as np, subprocess, wave, os
SR, DUR = 44100, 119.8
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
music += tb * curve([(0, .55), (13, .6), (14, .9), (23.6, .9), (24.2, .35), (30.6, .4), (31.4, .9), (DUR, .9)])[:, None]
place(music, pad([SA / 2, SA * .75, SA], DUR, 500), 0, .16)
P = {'S': 587.33, 'R': 659.26, 'G': 739.99, 'g': 698.46, 'P': 880.0, 'D': 987.77, "S'": 1174.66, "R'": 1318.5, 'd': 493.88, 'p': 440.0}
def phrase(start, notes, gain=.14, pan=.25):
    t0, prev = start, None
    for n, d in notes:
        if n != '-': place(music, flute(P[prev] if prev else P[n], P[n], d * 1.02), t0, gain, pan); prev = n
        else: prev = None
        t0 += d
phrase(13.5, [('G', .7), ('P', .5), ('D', 1.4), ('-', .3), ("S'", 1.3)], .12)
phrase(17.4, [('S', .8), ('R', .5), ('G', 1.2), ('P', .6), ('D', 1.6), ('-', .4), ("S'", 2.2)], .14)
phrase(31.3, [('P', .5), ('D', .5), ("S'", 1.2), ("R'", .5), ("S'", 1.8)], .15)
phrase(34.6, [('G', .8), ('P', .6), ('D', 1.6), ('P', .6), ('G', 1.6)], .13)
phrase(40.2, [('S', 1.0), ('R', .6), ('G', 1.8), ('-', .5), ('R', .6), ('S', 1.8)], .13)
phrase(47.6, [('G', .6), ('P', .6), ('D', .6), ("S'", 2.0)], .13)
phrase(51.6, [('P', .4), ('D', .4), ("S'", .4), ("R'", .5), ("S'", 1.6)], .16)
phrase(62.6, [('D', .7), ("S'", 1.6), ('D', .5), ('P', 1.4)], .14)
phrase(69.4, [('G', .8), ('R', .6), ('S', 1.6), ('-', .4), ('P', .8), ('G', 1.6)], .11)
phrase(74.3, [('S', .7), ('R', .6), ('G', .7), ('P', 1.4), ('D', .6), ("S'", 2.0)], .12)
phrase(83.8, [('S', 1.2), ('R', .8), ('G', 2.0), ('-', .6), ('R', .8), ('S', 2.2)], .1)
phrase(90.3, [('G', .5), ('P', .5), ('D', .5), ("S'", 2.2)], .14)
phrase(93.2, [('P', 1.0), ('G', .8), ('R', .8), ('S', 2.2)], .1)
phrase(97.2, [('S', .9), ('R', .6), ('G', 1.6), ('P', .8), ('G', 1.4)], .1)
phrase(102.0, [('G', .7), ('P', .6), ('D', 1.6)], .12)
phrase(106.0, [('S', .8), ('R', .5), ('g', 1.5), ('-', .4), ('P', .8), ('g', .5), ('R', .6), ('S', 1.6)], .15)
phrase(112.2, [('g', .8), ('R', .6), ('S', 1.2), ('-', .3), ('P', .5), ('D', .5), ("S'", 1.6)], .13)
# recap tension and the deluge
for a, b, g in [(0.2, 9.2, .2), (23.8, 30.8, .3)]:
    place(music, pad([SA / 2, SA / 2 * 16 / 15, SA * .75, SA * 16 / 15], b - a, 700), a, g)
    t = tt(b - a); place(music, norm(np.sin(2 * np.pi * 36.7 * t) * (.7 + .3 * np.sin(2 * np.pi * 3 * t))) * adsr(len(t), 1, 1), a, g * .8)
for k, t0 in enumerate(np.arange(0.5, 9.0, 1.1)): place(music, drum(58, .9, .2), t0, .24); place(music, drum(130, .25, .5), t0 + .37, .09, .3)
for k, t0 in enumerate(np.arange(24.2, 30.4, .45)):
    acc = k % 4 == 0; place(music, drum(60 if acc else 82, .7, .35), t0, .4 if acc else .2, -.15 if acc else .2)
    if k % 4 == 2: place(music, drum(150, .25, .6), t0 + .225, .14, .3)
# joy: damaru rhythm while Shiva sways, and after Tathastu
def damaru_roll(a, b, g=.16):
    for k, t0 in enumerate(np.arange(a, b, .14)): place(music, drum(230 if k % 2 else 190, .13, .9), t0, g * (1.0 if k % 6 in (0, 3) else .6), .45 if k % 2 else -.45)
damaru_roll(54.8, 58.4); damaru_roll(82.35, 83.6, .13)
for k, t0 in enumerate(np.arange(54.8, 58.4, .56)): place(music, drum(72 if k % 2 == 0 else 104, .5, .4), t0, .3 if k % 2 == 0 else .16)
place(music, conch(2.4), 82.3, .26, -.2); place(music, conch(2.2, 349), 82.45, .12, .3)
place(music, conch(2.4, 233), 37.8, .14, .2)
# poignant pulse as Shiva walks with the bowl
for k, t0 in enumerate(np.arange(105.9, 111.4, .62)): place(music, drum(92, .35, .25), t0, .12, -.1)
F = 117.9
place(music, conch(2.6), F, .34, -.2); place(music, conch(2.4, 349), F + .2, .16, .3)
for k in range(22): place(music, drum(210 if k % 2 else 170, .16, .9), F + .05 + k * .085, .16 * (1 - k / 30), .5 if k % 2 else -.5)
for t0 in (F + .03, F + .75, F + 1.45): place(music, bell(392, 4), t0, .2, .1)
music = reverb(music, 2.4, .35)
music *= curve([(0, 0), (.6, 1), (DUR - .8, 1), (DUR, 0)])[:, None]

# ---------- sound effects ----------
sfx = np.zeros((N, 2))
def S(sig, t, g, pan=0.0): place(sfx, sig, t, g, pan)
def bark(): t = tt(.13); ph = 2 * np.pi * np.cumsum(430 - 1300 * t) / SR; return norm(sum(np.sin(k * ph) / k for k in range(1, 9)) * np.sin(np.pi * t / .13) ** .6 + .4 * filt(noise(.13), 600, 3000))
def metal(d=1.6): t = tt(d); return norm(sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dc) for f, dc in [(2130, 4), (3310, 6), (4725, 8), (6240, 11)]))
def windbed(d): return norm(filt(noise(d), 250, 1400) * (.6 + .4 * np.sin(2 * np.pi * .23 * tt(d))) * adsr(int(SR * d), 1, 1.2))
def rainbed(d): return norm(filt(noise(d), 1500, 9000) * adsr(int(SR * d), 1, 1.5) + .4 * filt(noise(d), 200, 900))
def seabed(d): t = tt(d); return norm(filt(noise(d), 60, 500) * (.55 + .45 * np.sin(2 * np.pi * .18 * t) ** 2) * adsr(len(t), 1.2, 1.5))
def splash(): t = tt(.9); return norm(filt(noise(.9), 500, 7000) * np.exp(-t * 5) * (1 + .5 * np.sin(2 * np.pi * 18 * t)) + .5 * drum(80, .9, 0))
def plip(f=1400): t = tt(.18); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-t * 40))) / SR) * np.exp(-t * 26)
def whirr(d): t = tt(d); ph = 2 * np.pi * np.cumsum(180 + 40 * np.sin(2 * np.pi * 3 * t)) / SR; return norm((np.sin(ph) + .5 * np.sin(2 * ph) + .3 * np.sign(np.sin(3 * ph))) * adsr(len(t), .1, .3) + .5 * filt(noise(d), 300, 2500) * (.6 + .4 * np.sin(2 * np.pi * 9 * t)))
def crickets(d):
    out = np.zeros(int(SR * d)); t = tt(.05)
    for k in range(int(d * 7)):
        j = int(rng.uniform(0, d - .3) * SR); ch = np.sin(2 * np.pi * rng.uniform(4300, 5200) * t) * np.sin(np.pi * t / .05) ** 2
        for r in range(3): jj = j + int(r * .07 * SR); out[jj:jj + len(ch)] += ch * rng.uniform(.4, 1)
    return norm(out * adsr(len(out), 1, 1))
def footsteps(d, step):
    out = np.zeros(int(SR * d))
    for k in range(int(d / step)): c = filt(noise(.08), 120, 900) * np.exp(-tt(.08) * 50); j = int(k * step * SR); out[j:j + len(c)] += c
    return norm(out)
fb = np.zeros((N, 2)); place(fb, fire(DUR), 0, 1)
sfx += fb * curve([(0, 0), (92.6, 0), (93.2, .22), (101.2, .2), (101.7, 0), (115.8, 0), (116.3, .14), (DUR - .8, .14), (DUR, 0)])[:, None]
# R1/R2 recap
S(footsteps(3.6, .45), .3, .12, .1); S(drum(88, .5, .3), 5.38, .36, .3); S(pop(300), 5.4, .16, .3); S(shimmer(1.2), 5.5, .14, .3)
S(riser(.8), 6.2, .12, -.3); S(boom(2.8), 7.0, .5, -.2); S(metal(2.0), 7.0, .14); S(whoosh(.5, 800, 9000, up=False), 7.05, .26, -.3)
S(shimmer(1.6), 7.6, .14, .2); S(whoosh(1.0, 300, 4000, up=False), 7.6, .18, -.4)
S(boom(2.2), 9.3, .3); S(bell(523, 4.5), 9.5, .18); S(boom(2.6), 11.0, .4); S(bell(196, 3.5), 11.05, .14); S(pop(520), 11.6, .16, .5); S(bark(), 11.9, .16, .55)
# C2
S(boom(2.4), 14.6, .36)
for k, t0 in enumerate((15.4, 15.7, 16.0)): S(pop(420 + k * 110), t0, .26, (-.6, .6, 0)[k])
# C3 reveal
S(windbed(6.8), 17.0, .09); S(shimmer(2.0), 17.3, .12); S(whoosh(1.2, 200, 2500, up=False), 19.5, .14); S(whoosh(1.0, 300, 3000), 20.9, .14)
S(boom(2.6), 21.3, .38); S(bell(523, 5), 21.35, .2); S(bell(784, 4), 22.2, .1, .3)
# C4 deluge
S(rainbed(7.2), 23.9, .2); S(seabed(10.2), 23.9, .26); S(boom(2.8), 24.5, .4); S(thunder(2.6), 24.6, .3, -.3)
prev = False
for k in range(int((30.4 - 24.3) * 60)):
    tt0 = 24.3 + k / 60; on = any(np.sin(tt0 * 17 + i * 2.3) > .82 for i in range(4))
    if on and not prev: S(thunder(2.2), tt0, .32, rng.uniform(-.7, .7)); S(filt(noise(.06), 2000, 9000) * np.exp(-tt(.06) * 60), tt0, .4, rng.uniform(-.5, .5))
    prev = on
S(riser(1.6), 26.8, .22); S(splash(), 27.5, .2, .2)
S(riser(.9), 27.5, .16); S(boom(3.0), 28.35, .58); S(whoosh(2.0, 120, 4000), 28.35, .3); S(metal(2.4), 28.4, .12)
S(splash(), 28.6, .3, -.3); S(splash(), 28.9, .26, .4)
S(shimmer(2.4), 30.8, .2); S(bell(523, 5), 31.3, .22); S(bell(659, 4.5), 32.1, .14, .3); S(pop(560), 31.5, .2, -.5)
# C5 Avimukta
S(boom(2.4), 34.1, .3); S(bell(392, 5), 34.3, .22); S(shimmer(2.0), 35.0, .16); S(boom(2.6), 37.8, .4); S(bell(523, 5), 37.85, .2)
# C6 tapasya, chakra, sweat
S(pop(600), 40.6, .2); S(bell(784, 4), 41.0, .1, -.4)
S(whoosh(.6, 400, 6000), 44.6, .24, .3); S(whirr(1.7), 45.2, .22, .4); S(drum(70, .6, .5), 45.25, .3, .4)
for k in range(10): S(filt(noise(.09), 200, 1500) * np.exp(-tt(.09) * 40), 45.3 + k * .16, .18, .4 + rng.uniform(-.2, .2))
S(whoosh(.6, 400, 6000, up=False), 46.9, .22, -.1); S(chime(1568, 1.2), 47.45, .12, -.4)
for k in range(14): S(plip(1200 + 300 * rng.random()), 47.7 + k * .17 + .9, .13, .3 + rng.uniform(-.1, .1))
S(filt(noise(2.4), 300, 2400) * (.5 + .5 * np.sin(2 * np.pi * 7 * tt(2.4))) * adsr(int(SR * 2.4), .4, .6), 48.0, .07, .3)
# C7 appearance, joy, the falling jewel
S(boom(2.4), 51.6, .34); S(shimmer(2.2), 51.6, .22, .4); S(bell(523, 5), 51.8, .22, .4); S(bell(659, 4.5), 52.4, .12, .5)
S(whoosh(.5, 600, 6000), 55.1, .14, .4)
S(shimmer(1.9, up=False), 59.0, .2, .3); S(whoosh(1.9, 500, 7000, up=False), 59.0, .12, .2)
S(splash(), 60.88, .44, .2); S(chime(1175, 1.6), 60.95, .16, .2); S(chime(1568, 1.6), 61.05, .14, .2); S(bell(784, 4), 61.0, .14, .2)
S(boom(2.6), 63.1, .4); S(bell(523, 5), 63.15, .22); S(pop(560), 63.9, .2)
# C9 boon and Tathastu
S(bell(659, 4), 66.2, .1, .4); S(pop(480), 74.4, .24, -.2); S(pop(620), 74.55, .2, -.2); S(chime(1319, 1.4), 74.7, .12, -.2)
S(shimmer(1.6), 80.3, .14, .3); S(riser(.9), 81.4, .14); S(boom(3.0), 82.3, .56); S(shimmer(2.2), 82.35, .2); S(bell(392, 5), 82.4, .22)
# C10 the last breath
S(crickets(9.4), 83.4, .06, .2); S(windbed(9.4), 83.4, .04)
for k in range(6): S(chime(784 * 2 ** ((k % 3) * 4 / 12), 1.6), 84.4 + k * .85, .09, .4 - k * .12)
S(pop(560), 86.6, .2, .5)
for k in range(9): S(metal(.5) * .6, 90.9 + k * .045 + .03 * rng.random(), .08, rng.uniform(-.5, .5))
S(shimmer(2.2), 90.4, .2, -.1); S(boom(2.6), 91.4, .38); S(bell(523, 5), 91.45, .2, .4)
# C11 Manikarnika
S(boom(2.4), 93.2, .3); S(bell(392, 5), 95.0, .16, -.3); S(pop(600), 97.5, .2); S(bell(523, 4.5), 98.1, .14, .3); S(bell(784, 3.5), 99.6, .08, -.4)
S(windbed(8.4), 93.0, .05)
# C12 Kashi of moksha; the begging walk
S(shimmer(2.0), 101.8, .16); S(bell(659, 4), 102.4, .12)
S(footsteps(5.4, .48), 105.9, .14, .05); S(pop(600), 106.6, .18); S(drum(150, .2, .7), 107.7, .12, .3); S(drum(150, .2, .7), 107.9, .1, .3)
# C13 the glowing door
S(shimmer(1.8), 111.9, .2, .4); S(bell(523, 5), 112.2, .16, .4); S(footsteps(1.8, .45), 113.5, .1); S(boom(2.4), 113.2, .36)
for k, t0 in enumerate((114.2, 114.5)): S(pop(480 + k * 120), t0, .24, (.6, .2)[k])
# C14 outro
S(whoosh(.8, 200, 3000), 115.8, .14); S(shimmer(1.4), 116.2, .13); S(riser(.7), 117.2, .16); S(boom(3), F, .55)
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
