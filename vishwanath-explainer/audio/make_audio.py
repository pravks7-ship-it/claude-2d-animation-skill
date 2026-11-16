#!/usr/bin/env python3
"""Synthesises background music + sound effects for the explainer and mixes them under the narration.
usage: python3 audio/make_audio.py   (run from vishwanath-explainer/; needs numpy + ffmpeg)
writes audio/music.wav, audio/sfx.wav, audio/mix.wav
"""
import numpy as np, subprocess, wave, os
SR, DUR = 44100, 136.9
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
music += tb * curve([(0, .9), (20.0, .9), (20.6, .55), (29.4, .55), (30.2, .9), (78.0, .9), (78.6, .5), (86.6, .6), (87.4, .9), (121.5, .9), (122.2, .6), (DUR, .8)])[:, None]
place(music, pad([SA / 2, SA * .75, SA], DUR, 500), 0, .16)
P = {'S': 587.33, 'R': 659.26, 'G': 739.99, 'g': 698.46, 'P': 880.0, 'D': 987.77, "S'": 1174.66, "R'": 1318.5}
def phrase(start, notes, gain=.14, pan=.25):
    t0, prev = start, None
    for n, d in notes:
        if n != '-': place(music, flute(P[prev] if prev else P[n], P[n], d * 1.02), t0, gain, pan); prev = n
        else: prev = None
        t0 += d
phrase(0.6, [('g', .9), ('R', .6), ('S', 1.6)], .12)
phrase(6.8, [('G', .8), ('P', .6), ('D', 1.5), ('-', .4), ("S'", 1.2), ('D', .5), ('P', 1.6)], .14)
phrase(14.0, [('S', .6), ('R', .5), ('G', .6), ('P', 1.4), ('D', .6), ("S'", 1.8)], .13)
phrase(30.0, [('P', .5), ('D', .5), ("S'", 1.2), ("R'", .5), ("S'", 1.8)], .15)
phrase(33.0, [('G', .8), ('P', .6), ('D', 1.4), ('P', .6), ('G', 1.4), ('-', .3), ('R', .6), ('S', 1.6)], .12)
phrase(42.4, [('S', .8), ('R', .5), ('G', 1.2), ('P', .6), ('G', 1.4)], .12)
phrase(47.0, [('P', .8), ('G', .6), ('R', .6), ('S', 1.6), ('-', .4), ('R', .6), ('G', 1.6)], .11)
phrase(55.0, [('G', .5), ('P', .5), ('D', .7), ("S'", 2.0)], .14)
phrase(59.6, [('D', .8), ('P', .6), ('G', 1.2), ('P', .6), ('D', 1.6)], .13)
phrase(68.8, [('S', .4), ('R', .4), ('G', .4), ('P', .5), ('D', .5), ("S'", 2.2)], .16)
phrase(72.6, [("S'", .7), ('D', .6), ('P', .6), ('G', 1.4), ('P', .6), ('D', 1.6)], .12)
phrase(87.4, [('P', .5), ('D', .5), ("S'", 1.2), ("R'", .6), ("S'", 2.0)], .16)
phrase(97.0, [('G', .8), ('P', .6), ('D', 1.6), ('-', .4), ("S'", 1.2), ('D', .5), ('P', 1.6)], .13)
phrase(102.8, [('S', .6), ('R', .5), ('G', .6), ('P', 1.4)], .12)
phrase(117.6, [('G', .5), ('P', .5), ('D', .5), ("S'", 1.0), ("R'", .5), ("S'", 1.8)], .15)
phrase(122.2, [('S', .8), ('R', .5), ('g', 1.5), ('-', .4), ('P', .8), ('g', .5), ('R', .6), ('S', 1.6)], .14)
# the endless pillar: deep tension
place(music, pad([SA / 2, SA / 2 * 16 / 15, SA * .75, SA * 16 / 15], 9.6, 700), 20.2, .24)
t = tt(9.6); place(music, norm(np.sin(2 * np.pi * 36.7 * t) * (.7 + .3 * np.sin(2 * np.pi * 3 * t))) * adsr(len(t), 1, 1), 20.2, .18)
for k, t0 in enumerate(np.arange(20.4, 29.4, 1.1)): place(music, drum(58, .9, .2), t0, .26); place(music, drum(130, .25, .5), t0 + .37, .09, .3)
# the jyoti bursting from the earth
place(music, pad([SA / 2, SA * .75, SA, SA * 1.5], 8.6, 1400), 78.3, .24)
for k, t0 in enumerate(np.arange(79.8, 84.0, .45)): acc = k % 4 == 0; place(music, drum(60 if acc else 84, .7, .35), t0, .34 if acc else .16)
# the household: lively, warm
for k, t0 in enumerate(np.arange(107.2, 117.0, .56)): place(music, drum(72 if k % 4 == 0 else 104, .5, .4), t0, .22 if k % 4 == 0 else .11); place(music, drum(200, .14, .8), t0 + .28, .06, .4)
for k, t0 in enumerate(np.arange(122.0, 130.6, 1.1)): place(music, drum(58, .9, .2), t0, .22); place(music, drum(130, .25, .5), t0 + .37, .08, .3)
place(music, conch(2.6), 87.2, .26, -.2); place(music, conch(2.4, 349), 87.4, .12, .3); place(music, conch(2.4, 233), 94.2, .14, .2)
F = 134.2
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
def scoop(): t = tt(.35); return norm(filt(noise(.35), 300, 2500) * np.exp(-t * 12) + .4 * np.sin(2 * np.pi * np.cumsum(500 - 400 * t) / SR) * np.exp(-t * 10))
def rumble(d=1.0): t = tt(d); return norm(filt(noise(d), 30, 220) * np.sin(np.pi * t / d) * (1 + .6 * np.sin(2 * np.pi * 9 * t)))
def crack(d=1.4):
    out = np.zeros(int(SR * d))
    for k in range(int(d * 22)): c = filt(noise(.04), 400, 5000) * np.exp(-tt(.04) * 80); j = int(rng.uniform(0, d - .05) * SR); out[j:j + len(c)] += c * rng.uniform(.3, 1) * (j / len(out)) ** .5
    return norm(out + .6 * rumble(d))
def hum(d, f=110): t = tt(d); ph = 2 * np.pi * f * t; return norm((np.sin(ph) + .5 * np.sin(2 * ph) + .3 * np.sin(3.01 * ph) + .2 * np.sin(5.02 * ph)) * (.8 + .2 * np.sin(2 * np.pi * 4 * t)) * adsr(len(t), .8, 1.2))
def bark(): t = tt(.13); ph = 2 * np.pi * np.cumsum(430 - 1300 * t) / SR; return norm(sum(np.sin(k * ph) / k for k in range(1, 9)) * np.sin(np.pi * t / .13) ** .6 + .4 * filt(noise(.13), 600, 3000))
fb = np.zeros((N, 2)); place(fb, fire(DUR), 0, 1)
sfx += fb * curve([(0, 0), (20.0, 0), (20.6, .2), (29.5, .2), (30.2, 0), (130.8, 0), (131.3, .14), (DUR - .8, .14), (DUR, 0)])[:, None]
# recap
S(windbed(6.0), .2, .06); S(shimmer(2.4, up=False), 2.5, .22, .3); S(whoosh(1.2, 300, 8000), 2.6, .22, .3)
for s0 in (9.6, 10.6, 11.6): S(scoop(), s0 - .05, .22, .3); S(pop(380), s0 + .58, .18, -.3)
S(pop(600), 7.0, .18)
S(boom(2.2), 13.6, .26); S(riser(1.2), 14.8, .14); S(shimmer(2.0), 15.3, .18); S(boom(2.4), 17.6, .34)
# endless pillar
S(boom(2.8), 20.2, .4); S(pop(600), 20.5, .18); S(whoosh(.9, 300, 6000), 26.9, .26); S(boom(2.2), 27.2, .3); S(whoosh(1.0, 6000, 200, up=False), 28.5, .26); S(boom(2.4), 28.8, .3)
# pillar of light, map
S(boom(2.6), 29.6, .36); S(shimmer(2.6), 29.9, .24); S(hum(2.6, 110), 29.9, .12); S(bell(523, 5), 31.0, .2)
for k in range(12): t0 = 34.2 + (k + .5) * 5.2 / 12; S(whoosh(.35, 6000, 800, up=False), t0 - .3, .08, -.5 + k * .08); S(chime(784 * 2 ** ((k % 5) * 2 / 12), 1.0), t0, .12, -.5 + k * .08)
S(boom(2.4), 39.8, .34); S(bell(659, 4.5), 39.9, .16)
# Kailash
S(windbed(12.4), 42.0, .07); S(pop(560), 49.2, .18, -.4); S(pop(480), 51.9, .2, .4); S(pop(620), 52.05, .16, .4); S(bell(784, 3), 52.3, .08, .4)
S(windbed(4.6), 54.5, .06); S(shimmer(2.0), 56.4, .2); S(hum(2.4, 147), 56.5, .1); S(pop(600), 57.0, .18)
# Ganga, Kashi
S(windbed(8.7), 59.2, .08); S(pop(600), 59.6, .16, -.3); S(shimmer(1.6), 63.3, .18, .3); S(boom(2.6), 66.8, .4); S(bell(523, 5), 66.85, .2)
# arrival
S(footsteps(3.2, .42), 68.6, .14, -.2); S(bell(659, 4), 70.0, .1, .4); S(pop(600), 73.3, .2); S(bell(523, 5), 75.6, .14)
# the earth splits, the jyoti
S(crack(1.4), 78.5, .5); S(rumble(1.6), 78.6, .5); S(riser(1.2), 78.7, .2); S(boom(3.2), 79.8, .62); S(thunder(2.4), 79.85, .3)
S(hum(6.0, 98), 80.0, .16); S(shimmer(2.6), 80.2, .2); S(footsteps(1.4, .45), 84.2, .12); S(whoosh(1.6, 300, 9000), 85.2, .28); S(shimmer(2.0), 85.4, .24); S(bell(392, 5), 85.8, .22)
# Vishweshwar, Kashi Vishwanath
S(boom(2.8), 87.0, .4); S(bell(523, 5), 89.35, .24); S(boom(2.4), 89.3, .32); S(pop(600), 90.8, .18)
S(bell(392, 5), 93.1, .2, -.3); S(boom(2.6), 94.2, .38); S(bell(659, 4.5), 94.3, .16, .3)
# most special; not a guest
S(shimmer(1.8), 97.6, .18); S(pop(560), 99.2, .2, .5); S(bell(784, 3.5), 99.4, .12, .5)
S(pop(480), 102.7, .22, -.5); S(drum(110, .35, .5), 103.6, .26, -.5); S(pop(600), 104.9, .22, .5); S(chime(784, 1.3), 105.6, .16, .5); S(chime(988, 1.3), 105.72, .16, .5); S(chime(1175, 1.6), 105.84, .18, .5)
# the household
for k, t0 in enumerate((107.2, 109.8, 112.7)): S(whoosh(.6, 300, 4000), t0, .2, -.6 + k * .6); S(pop(520), t0 + .5, .18, -.6 + k * .6)
S(scoop(), 108.2, .14, -.6); S(bark(), 110.9, .16, 0); S(bell(523, 4), 113.4, .16, .6); S(footsteps(3.0, .5), 113.6, .08, .6)
# every particle is Shankar
for k in range(14): S(chime(1175 + 70 * (k % 6), .9), 117.5 + k * .17, .07, -.8 + k * .12)
S(boom(2.4), 118.9, .34); S(bell(392, 5), 119.0, .18)
# cliffhanger
S(windbed(9.0), 121.7, .1); S(footsteps(5.0, .5), 122.0, .12); S(boom(2.4), 123.9, .3); S(riser(.9), 127.0, .16); S(boom(2.8), 127.95, .44); S(thunder(2.0), 128.0, .2, .5)
for k, t0 in enumerate((129.5, 129.8)): S(pop(420 + k * 140), t0, .24, (.3, .7)[k])
# outro
S(whoosh(.8, 200, 3000), 130.8, .14); S(shimmer(1.4), 131.3, .13); S(riser(.7), 133.5, .16); S(boom(3), F, .55)
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
