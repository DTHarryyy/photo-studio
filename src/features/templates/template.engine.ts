import { templateRegistry } from "./template.registry";
import type { CanvasLayer, FrameLayer, PhotoLayer } from "@/features/canvas";
import type { TemplateDefinition } from "./types/template.types";

export function applyTemplate(
  templateId: string,
  photoDataUrls: string[]
): CanvasLayer[] {
  const template = templateRegistry.get(templateId);
  if (!template) throw new Error(`Template "${templateId}" not found in registry`);
  return buildLayers(template, photoDataUrls);
}

function buildLayers(
  template: TemplateDefinition,
  photoDataUrls: string[]
): CanvasLayer[] {
  const layers: CanvasLayer[] = [];

  template.grid.slots.forEach((slot, i) => {
    const dataUrl = photoDataUrls[i];
    if (!dataUrl) return;

    const photoLayer: PhotoLayer = {
      id: crypto.randomUUID(),
      type: "photo",
      zIndex: i,
      visible: true,
      dataUrl,
      transform: { ...slot, rotation: 0, scaleX: 1, scaleY: 1 },
    };
    layers.push(photoLayer);
  });

  if (template.frame.overlayAsset) {
    const frameLayer: FrameLayer = {
      id: crypto.randomUUID(),
      type: "frame",
      zIndex: 100,
      visible: true,
      templateId: template.id,
      src: template.frame.overlayAsset,
      transform: { x: 0, y: 0, width: 1080, height: 1080, rotation: 0, scaleX: 1, scaleY: 1 },
    };
    layers.push(frameLayer);
  }

  return layers;
}
