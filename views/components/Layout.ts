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
