#!/usr/bin/env python3
"""Synthesises background music + sound effects for the explainer and mixes them under the narration.
usage: python3 audio/make_audio.py   (run from divodas-explainer/; needs numpy + ffmpeg)
writes audio/music.wav, audio/sfx.wav, audio/mix.wav
"""
import numpy as np, subprocess, wave, os
SR, DUR = 44100, 138.7
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
music += tb * curve([(0, .9), (16.0, .9), (16.6, .45), (22.0, .45), (22.8, .9), (DUR, .9)])[:, None]
place(music, pad([SA / 2, SA * .75, SA], DUR, 500), 0, .16)
P = {'S': 587.33, 'R': 659.26, 'G': 739.99, 'g': 698.46, 'P': 880.0, 'D': 987.77, "S'": 1174.66, "R'": 1318.5}
def phrase(start, notes, gain=.14, pan=.25):
    t0, prev = start, None
    for n, d in notes:
        if n != '-': place(music, flute(P[prev] if prev else P[n], P[n], d * 1.02), t0, gain, pan); prev = n
        else: prev = None
        t0 += d
phrase(0.6, [('G', .8), ('P', .6), ('D', 1.5), ('-', .4), ("S'", 1.2), ('D', .5), ('P', 1.6)], .14)
phrase(10.6, [('S', .8), ('R', .5), ('g', 1.5), ('-', .4), ('P', .8), ('g', .5), ('R', .6), ('S', 1.6)], .13)
phrase(23.0, [('S', .6), ('R', .5), ('G', .6), ('P', 1.4), ('D', .6), ("S'", 1.8)], .12)
phrase(40.8, [('P', .5), ('D', .5), ("S'", 1.2), ("R'", .5), ("S'", 1.8)], .15)
phrase(45.8, [('g', .9), ('R', .7), ('S', 1.6), ('-', .4), ('R', .6), ('g', 1.6)], .13)
phrase(52.4, [('G', .5), ('P', .5), ('D', .5), ("S'", 1.0), ('D', .5), ('P', 1.4)], .14)
phrase(59.0, [('g', 1.0), ('R', .7), ('S', 1.8)], .12)
phrase(72.6, [('S', .6), ('R', .6), ('G', .6), ('P', 1.4), ('D', .6), ("S'", 1.8)], .12)
phrase(88.6, [('P', .3), ('D', .3), ('P', .3), ('G', .5), ('-', .2), ('G', .3), ('P', .3), ('D', .8)], .13)
phrase(98.5, [('S', .4), ('R', .4), ('G', .4), ('P', .5), ('D', .5), ("S'", 2.2)], .16)
phrase(101.6, [("S'", .8), ('D', .6), ('P', .6), ('G', 1.4), ('-', .3), ('R', .6), ('S', 1.8)], .11)
phrase(108.4, [('G', 1.0), ('R', .8), ('S', 2.0)], .12)
phrase(111.4, [('S', .6), ('R', .6), ('G', .6), ('P', .8), ('D', .8), ("S'", 2.4)], .14)
phrase(118.8, [('G', .4), ('P', .4), ('D', .4), ("S'", .8), ("R'", .4), ("S'", .6), ('D', .4), ("S'", 1.6)], .16)
phrase(124.2, [('P', .3), ('D', .3), ('P', .3), ('G', .5), ('-', .2), ('P', .3), ('D', .3), ("S'", 1.0)], .13)
# famine dread
place(music, pad([SA / 2, SA / 2 * 16 / 15, SA * .75, SA * 16 / 15], 6.6, 650), 16.0, .26)
t = tt(6.6); place(music, norm(np.sin(2 * np.pi * 36.7 * t) * (.7 + .3 * np.sin(2 * np.pi * 3 * t))) * adsr(len(t), 1, 1), 16.0, .2)
for k, t0 in enumerate(np.arange(16.4, 22.0, 1.1)): place(music, drum(52, .9, .15), t0, .3)
# royal court rhythm
def court_rhythm(a, b, g=1.0):
    for k, t0 in enumerate(np.arange(a, b, .5)):
        place(music, drum(70 if k % 4 == 0 else 104, .5, .4), t0, (.3 if k % 4 == 0 else .14) * g); place(music, drum(200, .14, .8), t0 + .25, .07 * g, .4)
court_rhythm(52.0, 58.4); court_rhythm(88.2, 97.6, .6)
# envoys: lively swirl
for k, t0 in enumerate(np.arange(63.2, 72.0, .38)): place(music, drum(150 if k % 2 else 110, .2, .6), t0, .12, .4 if k % 2 else -.4)
# homecoming: festive
def damaru_roll(a, b, g=.14):
    for k, t0 in enumerate(np.arange(a, b, .14)): place(music, drum(230 if k % 2 else 190, .13, .9), t0, g * (1.0 if k % 6 in (0, 3) else .6), .45 if k % 2 else -.45)
for k, t0 in enumerate(np.arange(118.6, 123.8, .5)): place(music, drum(70 if k % 4 == 0 else 100, .5, .4), t0, .32 if k % 4 == 0 else .16); place(music, drum(200, .14, .8), t0 + .25, .09, .4)
damaru_roll(121.3, 123.0, .14)
place(music, conch(2.6), 43.5, .2, -.2); place(music, conch(2.6), 121.3, .3, -.2); place(music, conch(2.4, 349), 121.5, .14, .3); place(music, conch(2.4, 233), 98.5, .14, .2)
F = 136.6
place(music, conch(2.6), F, .34, -.2); place(music, conch(2.4, 349), F + .2, .16, .3)
for k in range(22): place(music, drum(210 if k % 2 else 170, .16, .9), F + .05 + k * .085, .16 * (1 - k / 30), .5 if k % 2 else -.5)
for t0 in (F + .03, F + .75, F + 1.45): place(music, bell(392, 4), t0, .2, .1)
music = reverb(music, 2.4, .35)
music *= curve([(0, 0), (.6, 1), (DUR - .8, 1), (DUR, 0)])[:, None]

# ---------- sound effects ----------
sfx = np.zeros((N, 2))
def S(sig, t, g, pan=0.0): place(sfx, sig, t, g, pan)
def windbed(d): return norm(filt(noise(d), 250, 1400) * (.6 + .4 * np.sin(2 * np.pi * .23 * tt(d))) * adsr(int(SR * d), 1, 1.2))
def footsteps(d, step):
    out = np.zeros(int(SR * d))
    for k in range(int(d / step)): c = filt(noise(.08), 120, 900) * np.exp(-tt(.08) * 50); j = int(k * step * SR); out[j:j + len(c)] += c
    return norm(out)
def hum(d, f=110): t = tt(d); ph = 2 * np.pi * f * t; return norm((np.sin(ph) + .5 * np.sin(2 * ph) + .3 * np.sin(3.01 * ph) + .2 * np.sin(5.02 * ph)) * (.8 + .2 * np.sin(2 * np.pi * 4 * t)) * adsr(len(t), .8, 1.2))
def ghungroo(d, dens=40):
    out = np.zeros(int(SR * d))
    for k in range(int(d * dens)):
        j = int(rng.uniform(0, d - .2) * SR); f = rng.uniform(3500, 6500); c = (np.sin(2 * np.pi * f * tt(.15)) + .5 * np.sin(2 * np.pi * f * 1.5 * tt(.15))) * np.exp(-tt(.15) * 40)
        out[j:j + len(c)] += c * rng.uniform(.3, 1)
    return norm(out * adsr(len(out), .2, .4))
def fireWhoosh(): t = tt(.7); return norm(filt(noise(.7), 200, 3000) * np.sin(np.pi * t / .7) ** 2 + .4 * drum(70, .7, 0))
def windchime(d):
    out = np.zeros(int(SR * (d + 1.5)))
    for k in range(int(d * 6)): c = chime(rng.choice([1568, 1760, 2093, 2349, 2637]), 1.4); j = int(rng.uniform(0, d) * SR); out[j:j + len(c)] += c * rng.uniform(.4, 1)
    return norm(out)
def rumble(d=1.0): t = tt(d); return norm(filt(noise(d), 30, 220) * np.sin(np.pi * t / d) * (1 + .6 * np.sin(2 * np.pi * 9 * t)))
fb = np.zeros((N, 2)); place(fb, fire(DUR), 0, 1)
sfx += fb * curve([(0, 0), (19.4, 0), (20.0, .2), (22.0, .16), (22.6, 0), (81.4, 0), (82.0, .16), (87.6, .18), (88.2, 0), (134.1, 0), (134.6, .14), (DUR - .8, .14), (DUR, 0)])[:, None]
# recap / question
S(pop(600), .3, .18); S(riser(1.0), 6.2, .14); S(boom(2.6), 7.0, .36); S(hum(3.0, 110), 7.0, .12); S(bell(523, 5), 7.6, .2)
S(windbed(6.0), 10.2, .08); S(footsteps(5.6, .5), 10.4, .12); S(boom(2.4), 12.4, .32)
# famine and chaos
S(windbed(6.0), 16.2, .14); S(boom(2.6), 17.2, .38); S(rumble(1.4), 19.8, .4); S(boom(2.4), 19.9, .38); S(thunder(2.0), 20.0, .2)
for k in range(6): S(filt(noise(.12), 600, 3000) * np.exp(-tt(.12) * 30), 20.2 + k * .25, .12, rng.uniform(-.6, .6))
# Brahma and the king
S(shimmer(1.6), 22.4, .14, -.4); S(pop(560), 23.6, .2, .4); S(pop(480), 32.4, .2, .4); S(pop(520), 34.6, .24); S(drum(110, .35, .5), 35.2, .22)
S(shimmer(1.8), 40.7, .18, -.3); S(pop(560), 40.8, .16, -.3); S(boom(2.6), 43.5, .4); S(bell(392, 5), 43.6, .2, .3)
# Shiva leaves for Mandarachal
S(windbed(6.6), 45.3, .1); S(footsteps(6.4, .48), 45.4, .14); S(pop(600), 49.0, .18, .5)
# prosperous kingdom
S(bell(659, 4), 52.2, .14); S(pop(560), 52.6, .18); S(pop(600), 55.9, .18); S(windchime(3.0), 54.0, .06, .3)
# longing; envoys
S(windbed(13.4), 58.6, .08); S(pop(480), 59.2, .2, .4); S(pop(620), 59.35, .16, .4)
S(whoosh(1.4, 300, 6000), 66.0, .2, .4); S(ghungroo(2.8), 66.1, .22, .5); S(pop(600), 66.3, .16, .5)
S(shimmer(1.6), 68.6, .2, .5); S(whoosh(1.4, 200, 4000), 68.6, .18, .5); S(pop(600), 68.6, .14, .5)
S(whoosh(1.4, 200, 3000), 70.1, .18, .5); S(bell(523, 3), 70.2, .1, .5); S(pop(600), 70.1, .14, .5)
# no fault; they stay
S(ghungroo(5.0, 12), 72.4, .06, -.3); S(boom(2.2), 72.6, .3); S(pop(560), 74.6, .2); S(shimmer(1.6), 75.6, .16)
for k in range(6): S(pop(700 + k * 40), 75.7 + k * .17, .08, -.6 + k * .24)
# Lolark, Dashashwamedh
S(whoosh(1.2, 4000, 300, up=False), 78.6, .2); S(boom(2.0), 80.2, .3); S(shimmer(1.4), 80.2, .18); S(pop(600), 79.4, .18)
for i in range(10): S(fireWhoosh(), 81.6 + i * .42, .18, -.8 + i * .18); S(chime(784 * 2 ** ((i % 5) * 2 / 12), .9), 81.7 + i * .42, .07, -.8 + i * .18)
S(boom(2.4), 86.1, .36); S(bell(392, 5), 86.2, .18)
# Ganesha the astrologer
S(footsteps(1.2, .35), 88.4, .14, -.4); S(pop(600), 89.0, .18, -.4); S(drum(150, .2, .7), 91.9, .14, -.3); S(drum(180, .2, .7), 92.1, .12, -.3)
S(pop(480), 93.6, .22); S(pop(620), 93.75, .18); S(chime(1319, 1.2), 94.0, .1)
# Vishnu revealed
S(boom(2.6), 97.8, .3); S(shimmer(2.0), 98.3, .24, -.3); S(hum(2.4, 147), 98.4, .12, -.3); S(bell(523, 5), 98.8, .2)
S(pop(520), 103.0, .22, .2); S(drum(110, .35, .5), 103.7, .24, .2); S(pop(600), 105.6, .22, .6); S(chime(784, 1.3), 106.3, .16, .6); S(chime(988, 1.3), 106.42, .16, .6); S(chime(1175, 1.6), 106.54, .18, .6)
# vairagya, shivalinga, vimana
S(shimmer(1.6, up=False), 108.4, .16); S(bell(392, 5), 108.8, .16); S(boom(2.4), 111.1, .32); S(hum(4.0, 110), 111.2, .1); S(bell(523, 5), 111.3, .18)
S(drum(140, .2, .7), 113.6, .16, .4); S(riser(1.2), 114.6, .18); S(windchime(3.0), 114.9, .14); S(whoosh(2.2, 200, 7000), 116.0, .24); S(shimmer(2.0), 116.2, .2)
# homecoming
S(footsteps(3.0, .45), 118.6, .14); S(windchime(3.0), 120.2, .1, .3); S(boom(2.6), 121.4, .38); S(bell(523, 5), 121.5, .2, -.3); S(bell(659, 4.5), 122.0, .16, .3)
# Dhundhiraj
S(bell(784, 3.5), 124.0, .14); S(boom(2.4), 124.4, .34); S(pop(600), 127.2, .18, .6); S(bell(523, 4), 127.6, .12, .6)
# north-flowing Ganga
S(filt(noise(4.0), 200, 2000) * adsr(int(SR * 4.0), .8, 1.0), 130.3, .06); S(boom(2.4), 130.8, .3); S(whoosh(.9, 300, 5000), 131.4, .16, .5)
# outro
S(whoosh(.8, 200, 3000), 134.1, .14); S(shimmer(1.4), 134.5, .13); S(riser(.7), 135.9, .16); S(boom(3), F, .55)
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
