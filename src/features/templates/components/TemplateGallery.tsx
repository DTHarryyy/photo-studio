"use client";

import { templateRegistry } from "../template.registry";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { useTemplateStore } from "../store/template.store";

export function TemplateGallery() {
  const { activeTemplateId, setActiveTemplate } = useTemplateStore();
  const templates = templateRegistry.getAll();

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {templates.map((t) => (
        <TemplateThumbnail
          key={t.id}
          template={t}
          isActive={t.id === activeTemplateId}
          onSelect={() => setActiveTemplate(t.id)}
        />
      ))}
    </div>
  );
}
