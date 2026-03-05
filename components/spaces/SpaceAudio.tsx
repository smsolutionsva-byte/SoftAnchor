"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAnchorStore } from "@/store/useAnchorStore";
import type { SoftSpaceId } from "@/types";

// Generate white noise buffer
function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

type SoundBuilder = (ctx: AudioContext, masterGain: GainNode) => (() => void);

const SOUND_BUILDERS: Record<SoftSpaceId, SoundBuilder> = {
  // Sakura — gentle rain
  sakura: (ctx, masterGain) => {
    const noiseBuffer = createNoiseBuffer(ctx, 2);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.04;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    source.start();

    return () => { try { source.stop(); } catch { /* noop */ } };
  },

  // Candlelit — warm drone + crackle
  candlelit: (ctx, masterGain) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 55;

    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.02;

    osc.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start();

    // Crackle via noise bursts
    const noiseBuffer = createNoiseBuffer(ctx, 2);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 200;

    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.01;

    noiseSource.connect(highpass);
    highpass.connect(crackleGain);
    crackleGain.connect(masterGain);
    noiseSource.start();

    return () => {
      try { osc.stop(); } catch { /* noop */ }
      try { noiseSource.stop(); } catch { /* noop */ }
    };
  },

  // Ocean — wave simulation with LFO amplitude
  ocean: (ctx, masterGain) => {
    const noiseBuffer = createNoiseBuffer(ctx, 2);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 300;

    const ampGain = ctx.createGain();
    ampGain.gain.value = 0.03;

    // LFO for wave swell
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.1;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.02;

    lfo.connect(lfoGain);
    lfoGain.connect(ampGain.gain);
    lfo.start();

    source.connect(bandpass);
    bandpass.connect(ampGain);
    ampGain.connect(masterGain);
    source.start();

    return () => {
      try { source.stop(); } catch { /* noop */ }
      try { lfo.stop(); } catch { /* noop */ }
    };
  },

  // Greenhouse — wind + bird chirps
  greenhouse: (ctx, masterGain) => {
    // Pink-ish wind noise
    const noiseBuffer = createNoiseBuffer(ctx, 2);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 600;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.02;

    source.connect(lowpass);
    lowpass.connect(windGain);
    windGain.connect(masterGain);
    source.start();

    // Bird chirps with random intervals
    let birdTimeout: ReturnType<typeof setTimeout>;
    const chirp = () => {
      const freq = 200 + Math.random() * 600;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const chirpGain = ctx.createGain();
      chirpGain.gain.value = 0;

      osc.connect(chirpGain);
      chirpGain.connect(masterGain);

      const now = ctx.currentTime;
      chirpGain.gain.setValueAtTime(0, now);
      chirpGain.gain.linearRampToValueAtTime(0.015, now + 0.05);
      chirpGain.gain.linearRampToValueAtTime(0, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.2);

      birdTimeout = setTimeout(chirp, 3000 + Math.random() * 12000);
    };

    birdTimeout = setTimeout(chirp, 2000);

    return () => {
      try { source.stop(); } catch { /* noop */ }
      clearTimeout(birdTimeout);
    };
  },
};

const SpaceAudio = () => {
  const activeSoftSpace = useAnchorStore((s) => s.activeSoftSpace);
  const spaceAudioEnabled = useAnchorStore((s) => s.spaceAudioEnabled);
  const spaceAudioVolume = useAnchorStore((s) => s.spaceAudioVolume);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const cleanup = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  // Update volume
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = spaceAudioVolume;
    }
  }, [spaceAudioVolume]);

  // Main effect: start/stop/change sounds
  useEffect(() => {
    if (!spaceAudioEnabled) {
      cleanup();
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.suspend();
      }
      return;
    }

    // Create or resume context
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.value = spaceAudioVolume;
      masterGainRef.current.connect(ctxRef.current.destination);
    } else if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }

    // Stop previous sound
    cleanup();

    // Build new sound
    const builder = SOUND_BUILDERS[activeSoftSpace];
    if (builder && ctxRef.current && masterGainRef.current) {
      cleanupRef.current = builder(ctxRef.current, masterGainRef.current);
    }

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSoftSpace, spaceAudioEnabled, cleanup]);

  // Close context on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
      }
    };
  }, [cleanup]);

  return null; // No visual output
};

export default SpaceAudio;
