import { html } from "@rbardini/html";

export const Layout = ({ children }: { children: string }) =>
  html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="max-w-2xl mx-auto">${children}</div>
      </body>
    </html>
  `;

const Flex = ({ children }: { children: string }) =>
  html`<div class="flex">${children}</div>`;

const Heading = ({
  level = 1,
  children,
}: {
  level?: number;
  children: string;
}) => html`<h${level} class="text-5xl">${children}</h${level}>`;

interface HeroProps {
  title: string;
  subtitle: string;
  button: string;
  href: string;
}
const Hero = ({ title, subtitle, button, href }: HeroProps) =>
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

const HomePage = html`
  ${Layout({
    children: Flex({
      children: Hero({
        title: "Hello",
        subtitle: "World",
        button: "Click me",
        href: "auth/signup",
      }),
    }),
  })}
`;

export default HomePage;
