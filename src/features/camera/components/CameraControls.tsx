"use client";

import { useCameraStore } from "../store/camera.store";

export function CameraControls() {
  const toggleFacingMode = useCameraStore((s) => s.toggleFacingMode);

  return (
    <div className="flex items-center gap-4 p-4">
      <button onClick={toggleFacingMode} className="text-sm text-white">
        Flip Camera
      </button>
    </div>
  );
}
