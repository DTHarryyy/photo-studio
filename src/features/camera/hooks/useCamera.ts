"use client";

import { useEffect, useRef } from "react";
import { useCameraStore } from "../store/camera.store";
import { buildCapturedFrame, frameToDataUrl } from "../camera.utils";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scratchCanvasRef = useRef<HTMLCanvasElement>(
    typeof document !== "undefined" ? document.createElement("canvas") : null
  );

  const { facingMode, setStream, addFrame, setCameraStatus } = useCameraStore();

  useEffect(() => {
    let active = true;
    let currentStream: MediaStream | null = null;

    async function startStream() {
      setCameraStatus("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
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
        setCameraStatus("active");
      } catch (err) {
        if (!active) return;
        const name = err instanceof Error ? err.name : "";
        setCameraStatus(name === "NotAllowedError" ? "denied" : "error");
      }
    }

    startStream();

    return () => {
      active = false;
      currentStream?.getTracks().forEach((t) => t.stop());
      setStream(null);
    };
  }, [facingMode]); // eslint-disable-line react-hooks/exhaustive-deps

  function capture() {
    const video = videoRef.current;
    const canvas = scratchCanvasRef.current;
    if (!video || !canvas) return;
    const dataUrl = frameToDataUrl(video, canvas, facingMode === "user");
    addFrame(buildCapturedFrame(dataUrl, video.videoWidth, video.videoHeight));
  }

  return { videoRef, capture };
}
