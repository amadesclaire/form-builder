import { html } from "@rbardini/html";
import { Flex } from "views/components/Flex.ts";
import { Hero } from "views/components/Hero.ts";
import { Layout } from "views/components/Layout.ts";

export const Heading = ({
  level = 1,
  children,
}: {
  level?: number;
  children: string;
}) => html`<h${level} class="text-5xl">${children}</h${level}>`;

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
