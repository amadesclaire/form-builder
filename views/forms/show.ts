import { html } from "@rbardini/html";
import { Layout } from "views/components/Layout.ts";
import { Form } from "models/form.ts";

export const FormShow = ({ form }: { form: Form }): string =>
  Layout({
    children: html`
      <div class="flex justify-between items-center mt-4 mb-2">
        <h1 class="text-2xl font-bold">${form.title}</h1>
        <div class="flex gap-4">
          <a href="/forms" class="text-blue-500 hover:underline">All Forms</a>
          |
          <a href="/forms/${form.id}/edit" class="text-blue-500 hover:underline"
            >Edit</a
          >
        </div>
      </div>
      <p class="text-gray-400">${form.description}</p>
      <hr class="my-2" />
      <pre>${JSON.stringify(form, null, 2)}</pre>
      <p class="text-lg font-semibold">Fields:</p>
      <ul class="flex flex-col">
        ${form.fields
          .map(
            (field) =>
              html`
                <li class="mb-4">
                  <p class="text-xl">${field.question}:</p>
                  <div class="flex">
                    <small>
                      ${field.required ? "Required" : "Optional"} ${field.type}
                      field
                    </small>
                  </div>
                  ${field.options?.length
                    ? html`
                        <p class="text-sm font-semibold">Options:</p>
                        <ul class="ml-4 list-disc">
                          ${field.options
                            .map((option) => html`<li>${option}</li>`)
                            .join("")}
                        </ul>
                      `
                    : ""}
                </li>
              `
          )
          .join("")}
      </ul>
      <a
        href="/forms/${form.id}/edit"
        class="text-blue-500 hover:underline mt-4 inline-block"
        >Edit Form</a
      >
    `,
  });
