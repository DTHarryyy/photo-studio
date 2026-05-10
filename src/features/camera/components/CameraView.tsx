"use client";

import { useCamera } from "../hooks/useCamera";

export function CameraView() {
  const { videoRef, capture } = useCamera();

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <button
        onClick={capture}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white shadow-lg"
        aria-label="Capture photo"
      />
    </div>
  );
}
