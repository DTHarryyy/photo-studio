import type { TemplateDefinition } from "./types/template.types";
import { TEMPLATE_DATA } from "./template.data";

const registry = new Map<string, TemplateDefinition>(
  TEMPLATE_DATA.map((t) => [t.id, t])
);

export const templateRegistry = {
  get: (id: string): TemplateDefinition | undefined => registry.get(id),
  getAll: (): TemplateDefinition[] => Array.from(registry.values()),
  register: (template: TemplateDefinition): void => {
    registry.set(template.id, template);
  },
};
