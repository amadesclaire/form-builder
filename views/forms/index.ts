import { Layout } from "views/components/Layout.ts";
import { html } from "@rbardini/html";
import { Form } from "models/form.ts";

export const FormIndex = ({ forms }: { forms: Array<Form> }) =>
  Layout({
    children: html`
      <div class="flex justify-between items-center my-4">
        <h1 class="text-2xl font-bold">Forms</h1>
        <a
          href="/forms/create"
          class="text-blue-500 hover:underline inline-block"
          >Create New Form</a
        >
      </div>
      <hr />
      <ul class="flex flex-col divide-y">
        ${forms
          .map(
            (form) =>
              html` <li class="flex justify-between py-4 item-center">
              <div class="flex flex-col">
                <a
                  href="/forms/${form.id}"
                  class="text-blue-500 hover:underline"
                  >${form.title}</a
                >
                <small>${form.updatedAt}</small>
              </div>
              <div class="flex gap-8 items-center">
                <a href="/forms/${form.id}/edit" method="GET" class="text-blue-500 hover:underline">Edit</a>
                <form action="/forms/${form.id}/delete" method="POST">
                  <button type="submit" class="text-red-500 hover:underline">Delete</button>
                </form>
              </div
              </li>`
          )
          .join("")}
      </ul>
    `,
  });
