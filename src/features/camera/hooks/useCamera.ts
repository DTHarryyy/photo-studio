"use client";

import { useEffect, useRef } from "react";
import { useCameraStore } from "../store/camera.store";
import { buildCapturedFrame, frameToDataUrl } from "../camera.utils";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scratchCanvasRef = useRef<HTMLCanvasElement>(
    typeof document !== "undefined" ? document.createElement("canvas") : null
  );

  const { facingMode, setStream, addFrame } = useCameraStore();

  useEffect(() => {
    let active = true;
    let currentStream: MediaStream | null = null;

    async function startStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        currentStream = stream;
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        // Permission denied or no camera — handled by UI layer
      }
    }

    startStream();

    return () => {
      active = false;
      currentStream?.getTracks().forEach((t) => t.stop());
      setStream(null);
    };
  }, [facingMode, setStream]);

  function capture() {
    const video = videoRef.current;
    const canvas = scratchCanvasRef.current;
    if (!video || !canvas) return;
    const dataUrl = frameToDataUrl(video, canvas);
    addFrame(buildCapturedFrame(dataUrl, video.videoWidth, video.videoHeight));
  }

  return { videoRef, capture };
}
