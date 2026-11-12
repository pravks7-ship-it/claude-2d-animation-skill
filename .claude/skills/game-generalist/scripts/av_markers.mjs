// Finds the sync marker (white flash in the picture, beep in the sound) in a video or audio file.
// Used by record.mjs to align the two tracks, and by the record test to check the result.
import { spawnSync } from "node:child_process";

// The flash is a bright pulse over the page: a frame much brighter than the one before, followed later by a
// frame much darker again. Asking for both edges ignores the blank frame Playwright puts first (it has only a
// falling edge) and a page that is merely bright.
const MIN_EDGE_LUMA_STEP = 25;
const MAX_PULSE_SECONDS = 2;
const BEEP_AMPLITUDE_THRESHOLD = 0.1;
const PCM_SAMPLE_RATE = 16000;
const MAX_OUTPUT_BYTES = 256 * 1024 * 1024;

function runFfmpeg(argumentsList, encoding) {
  const result = spawnSync("ffmpeg", ["-v", "error", ...argumentsList], { encoding, maxBuffer: MAX_OUTPUT_BYTES });
  if (result.error) throw new Error(`ffmpeg could not start: ${result.error.message}`);
  return result;
}

// Per-frame average brightness of the whole picture with each frame's own presentation time. Passthrough keeps
// ffmpeg from duplicating or dropping frames, which would shift the timeline.
export function readFrameBrightness(videoPath) {
  const result = runFfmpeg(
    ["-i", videoPath, "-an", "-fps_mode", "passthrough", "-vf", "scale=16:16,signalstats,metadata=print:file=-", "-f", "null", "-"],
    "utf8",
  );
  const frames = [];
  let currentTime = null;
  for (const line of result.stdout.split(/\r?\n/)) {
    const timeMatch = line.match(/pts_time:([\d.]+)/);
    if (timeMatch) currentTime = Number(timeMatch[1]);
    const lumaMatch = line.match(/lavfi\.signalstats\.YAVG=([\d.]+)/);
    if (lumaMatch) frames.push({ time: currentTime, luma: Number(lumaMatch[1]) });
  }
  return frames;
}

function medianFrameInterval(frames) {
  const gaps = [];
  for (let index = 1; index < frames.length; index += 1) gaps.push(frames[index].time - frames[index - 1].time);
  if (gaps.length === 0) return 0;
  gaps.sort((first, second) => first - second);
  return gaps[Math.floor(gaps.length / 2)];
}

function findFirstPulse(frames) {
  for (let riseIndex = 1; riseIndex < frames.length; riseIndex += 1) {
    if (frames[riseIndex].luma - frames[riseIndex - 1].luma < MIN_EDGE_LUMA_STEP) continue;
    for (let fallIndex = riseIndex + 1; fallIndex < frames.length; fallIndex += 1) {
      if (frames[fallIndex].time - frames[riseIndex].time > MAX_PULSE_SECONDS) break;
      if (frames[fallIndex - 1].luma - frames[fallIndex].luma >= MIN_EDGE_LUMA_STEP) return { riseIndex, fallIndex };
    }
  }
  return null;
}

// Time when the flash started, or null. A frame can only show the flash from its own time on, so each edge is
// seen up to one frame late. Both edges are seen late by a related amount, so their mean cancels most of it
// when the flash lasts an odd number of half frames (180 ms at 25 fps); half a frame is what is left.
// flashMs is the length the page drew the flash for.
export function findFlashSeconds(videoPath, { flashMs } = {}) {
  const frames = readFrameBrightness(videoPath);
  const pulse = findFirstPulse(frames);
  if (!pulse) return null;
  const riseTime = frames[pulse.riseIndex].time;
  if (!flashMs) return riseTime;
  const fallTime = frames[pulse.fallIndex].time;
  const halfFrame = medianFrameInterval(frames) / 2;
  return (riseTime + fallTime - flashMs / 1000) / 2 - halfFrame;
}

function readMonoSamples(audioPath) {
  const result = runFfmpeg(["-i", audioPath, "-vn", "-ac", "1", "-ar", String(PCM_SAMPLE_RATE), "-f", "f32le", "-"], "buffer");
  const bytes = result.stdout;
  const sampleCount = Math.floor(bytes.length / 4);
  const samples = new Float32Array(sampleCount);
  for (let index = 0; index < sampleCount; index += 1) samples[index] = bytes.readFloatLE(index * 4);
  return samples;
}

// Time of the first sample louder than the beep threshold (at or after notBefore seconds), or null when there is none.
export function findBeepSeconds(audioPath, { notBefore = 0 } = {}) {
  const samples = readMonoSamples(audioPath);
  for (let index = Math.floor(notBefore * PCM_SAMPLE_RATE); index < samples.length; index += 1) {
    if (Math.abs(samples[index]) > BEEP_AMPLITUDE_THRESHOLD) return index / PCM_SAMPLE_RATE;
  }
  return null;
}
