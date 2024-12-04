import { html } from "@rbardini/html";

interface FlexProps {
  justify?: "center" | "start" | "end" | "between" | "around";
  align?: "center" | "start" | "end" | "between" | "around";
  column?: boolean;
  gap?: number;
  children: string;
}

export const Flex = ({ justify, align, column, gap, children }: FlexProps) => {
  const j = justify ? `justify-${justify}` : "";
  const a = align ? `items-${align}` : "";
  const c = column ? "flex-col" : "";
  const g = gap ? `gap-${gap}` : "";
  return html`<div class="flex ${j} ${a} ${c} ${g}">${children}</div>`;
};
