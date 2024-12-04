import { html } from "@rbardini/html";

interface HeroProps {
  title: string;
  subtitle: string;
  button: string;
  href: string;
}
export const Hero = ({ title, subtitle, button, href }: HeroProps) =>
  html`<div class="flex justify-center	align-center">
    <h1 class="text-5xl">${title}</h1>
    <h3 class="text-3xl">${subtitle}</h3>
    <a
      href="${href}"
      class="bg-zinc-500 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded"
    >
      ${button}
    </a>
  </div>`;
