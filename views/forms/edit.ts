import { html } from "@rbardini/html";
import { Layout } from "views/components/Layout.ts";
import { Form } from "models/form.ts";

export const FormEdit = ({ form }: { form: Form }): string =>
  Layout({
    children: html`
      <div class="flex justify-between items-center my-4">
        <h1 class="text-2xl font-bold mb-4">Edit Form</h1>
      </div>
      <form
        id="form"
        action="/forms/${form.id}/edit"
        method="POST"
        class="space-y-6"
      >
        ${/* Form title */ ""}
        <div>
          <label for="title" class="block font-medium">Form Title</label>
          <input
            type="text"
            id="title"
            name="title"
            class="border rounded p-2 w-full"
            required
            value="${form.title}"
          />
        </div>
        ${/* Form description */ ""}
        <div>
          <label for="description" class="block font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            class="border rounded p-2 w-full"
          >
${form.description || ""}</textarea
          >
        </div>
        <hr />
        ${/* Dynamic fields rendering */ ""}
        <div id="fields-container" class="space-y-6">
          ${form.fields
            .map(
              (field, index) => html`
                <fieldset class="field space-y-4">
                  <div>
                    <label class="block font-medium">Field Question</label>
                    <input
                      type="text"
                      name="fields[${index}][question]"
                      class="border rounded p-2 w-full"
                      required
                      value="${field.question}"
                    />
                  </div>
                  <div>
                    <label class="block font-medium">Field Type</label>
                    <select
                      name="fields[${index}][type]"
                      class="border rounded p-2 w-full field-type"
                      required
                    >
                      <option
                        value="text"
                        ${field.type === "text" ? "selected" : ""}
                      >
                        Text
                      </option>
                      <option
                        value="email"
                        ${field.type === "email" ? "selected" : ""}
                      >
                        Email
                      </option>
                      <option
                        value="number"
                        ${field.type === "number" ? "selected" : ""}
                      >
                        Number
                      </option>
                      <option
                        value="checkbox"
                        ${field.type === "checkbox" ? "selected" : ""}
                      >
                        Checkbox
                      </option>
                      <option
                        value="radio"
                        ${field.type === "radio" ? "selected" : ""}
                      >
                        Radio
                      </option>
                      <option
                        value="textarea"
                        ${field.type === "textarea" ? "selected" : ""}
                      >
                        Textarea
                      </option>
                    </select>
                  </div>
                  <div class="flex items-baseline gap-3">
                    <label class="inline-block font-medium">Required</label>
                    <input
                      type="checkbox"
                      name="fields[${index}][required]"
                      class="border rounded p-2"
                      ${field.required ? "checked" : ""}
                    />
                  </div>
                  ${field.options && field.options.length
                    ? html`
                        <div class="options-container">
                          <label class="block font-medium">Options</label>
                          <div class="options space-y-2">
                            ${field.options
                              .map(
                                (option, optIndex) => html`
                                  <input
                                    type="text"
                                    name="fields[${index}][options][]"
                                    class="border rounded p-2 w-full"
                                    value="${option}"
                                    placeholder="Option ${optIndex + 1}"
                                  />
                                `
                              )
                              .join("")}
                          </div>
                          <button
                            type="button"
                            class="add-option text-blue-500 hover:underline"
                          >
                            + Add Option
                          </button>
                        </div>
                      `
                    : ""}
                </fieldset>
              `
            )
            .join("")}
        </div>
        ${/* Add field button */ ""}
        <button
          type="button"
          id="add-field"
          class="text-blue-500 hover:underline"
        >
          + Add Field
        </button>
        ${/* Save buttons */ ""}
        <div class="flex space-x-4">
          <button
            type="submit"
            name="action"
            value="draft"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save draft
          </button>
          <button
            type="submit"
            name="action"
            value="publish"
            class="bg-green-500 text-white px-4 py-2 rounded"
          >
            Publish
          </button>
        </div>
      </form>
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          let fieldIndex = ${form.fields.length};

          const fieldsContainer = document.getElementById("fields-container");
          const addFieldButton = document.getElementById("add-field");

          addFieldButton.addEventListener("click", () => {
            const fieldTemplate = document.createElement("fieldset");
            fieldTemplate.classList.add("field");
            fieldTemplate.classList.add("space-y-4");
            fieldTemplate.innerHTML = \`
              <div>
                <label class="block font-medium">Field Question</label>
                <input
                  type="text"
                  name="fields[\${fieldIndex}][question]"
                  class="border rounded p-2 w-full"
                  required
                />
              </div>
              <div>
                <label class="block font-medium">Field Type</label>
                <select
                  name="fields[\${fieldIndex}][type]"
                  class="border rounded p-2 w-full field-type"
                  required
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="textarea">Textarea</option>
                </select>
              </div>
              <div class="options-container hidden">
                <label class="block font-medium">Options</label>
                <div class="options space-y-2">
                  <input
                    type="text"
                    name="fields[\${fieldIndex}][options][]"
                    placeholder="Option 1"
                    class="border rounded p-2 w-full"
                  />
                </div>
                <button
                  type="button"
                  class="add-option text-blue-500 hover:underline"
                >
                  + Add Option
                </button>
              </div>
            \`;
            fieldsContainer.appendChild(fieldTemplate);
            fieldIndex++;
          });

          fieldsContainer.addEventListener("change", (event) => {
            if (event.target.matches(".field-type")) {
              const fieldset = event.target.closest(".field");
              const optionsContainer =
                fieldset.querySelector(".options-container");

              if (["checkbox", "radio"].includes(event.target.value)) {
                optionsContainer.classList.remove("hidden");
              } else {
                optionsContainer.classList.add("hidden");
              }
            }
          });

          fieldsContainer.addEventListener("click", (event) => {
            if (event.target.matches(".add-option")) {
              const optionsContainer =
                event.target.closest(".options-container");
              const optionsDiv = optionsContainer.querySelector(".options");

              const newOption = document.createElement("input");
              newOption.type = "text";
              newOption.name = \`fields[\${fieldIndex}][options][]\`;
              newOption.placeholder = \`Option \${
                optionsDiv.children.length + 1
              }\`;
              newOption.classList.add("border", "rounded", "p-2", "w-full");

              optionsDiv.appendChild(newOption);
            }
          });
        });
      </script>
    `,
  });
