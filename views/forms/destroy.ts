import { html } from "@rbardini/html";
import { Layout } from "views/components/Layout.ts";

export const DestroyPage = ({ form }: { form: { id: string; name: string } }) =>
  Layout({
    children: html`
      <h1 class="text-2xl font-bold mb-4">Delete Form</h1>
      <p>
        Are you sure you want to delete the form <strong>${form.name}</strong>?
      </p>
      <form
        action="/forms/${form.id}/destroy"
        method="POST"
        class="space-y-4 mt-4"
      >
        <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">
          Delete
        </button>
        <a href="/forms" class="text-blue-500 hover:underline">Cancel</a>
      </form>
      <script>
        const form = document.querySelector("form");
        form.addEventListener("submit", (event) => {
          const confirmed = confirm(
            "Are you sure you want to delete this form?"
          );
          if (!confirmed) {
            event.preventDefault();
          }
        });
      </script>
    `,
  });
