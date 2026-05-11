import { apiClient } from "./client";
import type { TemplateDefinition } from "@/features/templates";

export async function fetchTemplates(): Promise<TemplateDefinition[]> {
  const data = await apiClient<{ templates: TemplateDefinition[] }>("/api/templates");
  return data.templates;
}
