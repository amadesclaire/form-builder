import { Hono } from "@hono/hono";
import { CreateFormPayload, Form, FormResponse } from "../types.ts";
import { db } from "../db.ts";
import { html } from "@hono/hono/html";
import { genId } from "../utils/genId.ts";
// Views ****************************************************************
export const head = html`<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Create Form</title>
  <link rel="stylesheet" href="/static/terminal.css" />
</head>`;
const nav = html` <nav class="terminal-menu">
  <ul>
    <li><a href="/forms">Forms</a></li>
    <li>|</li>
    <li><a href="/webhooks">Webhooks</a></li>
    <li>|</li>
    <li><a href="/users">Users</a></li>
    <li>|</li>
    <li><a href="/responses">Responses</a></li>
  </ul>
</nav>`;
const CreatePage = html` ${head}
  <body>
    <div class="container" x-data="formBuilder()">
      <h1>Form Builder</h1>
      <hr style="margin-top:0;" />
      <form class="form" @submit.prevent="submitForm">
        <!-- Form Name -->
        <div class="form-group">
          <!-- <label for="name" class="terminal-label">Name</label> -->
          <input
            type="text"
            id="name"
            class="terminal-input"
            x-model="form.name"
            placeholder="Title"
            required
          />
        </div>

        <!-- Form Description -->
        <div class="form-group">
          <!-- <label for="description" class="terminal-label">Description</label> -->
          <textarea
            id="description"
            class="terminal-textarea"
            x-model="form.description"
            placeholder="Description"
            required
          ></textarea>
        </div>

        <!-- Protected Checkbox and Password -->
        <div class="form-group">
          <label for="protected" class="terminal-label">
            <input
              type="checkbox"
              id="protected"
              class="terminal-checkbox"
              x-model="form.protected"
            />
            Protected
          </label>
          <div x-show="form.protected">
            <label for="password" class="terminal-label">Password</label>
            <input
              type="password"
              id="password"
              class="terminal-input"
              x-model="form.password"
              x-bind:required="form.protected"
            />
          </div>
        </div>

        <!-- Dynamic Fields -->
        <div class="form-group">
          <h3 class="terminal-heading">Fields</h3>
          <template
            x-for="(field, fieldIndex) in form.fields"
            :key="fieldIndex"
          >
            <div class="form-group">
              <fieldset class="terminal-fieldset">
                <div class="form-group">
                  <!-- <label class="terminal-label">Question</label> -->
                  <input
                    type="text"
                    class="terminal-input"
                    x-model="field.question"
                    placeholder="Question"
                    required
                  />
                </div>
                <div class="form-group">
                  <!-- <label class="terminal-label">Description</label> -->
                  <input
                    type="text"
                    class="terminal-input"
                    placeholder="Description"
                    x-model="field.description"
                  />
                </div>
                <div class="form-group">
                  <label class="terminal-label">Field Type</label>
                  <select
                    class="terminal-select select"
                    x-model="field.type"
                    @change="initializeOptions(field)"
                    required
                  >
                    <option value="text">Text</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="choose-one">Choose one</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="file-upload">File Upload</option>
                    <option value="image">Image</option>
                    <option value="number">Number</option>
                    <option value="rating">Rating</option>
                    <option value="range">Range</option>
                    <option value="tel">Tel</option>
                    <option value="email">Email</option>
                    <option value="url">URL</option>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="date-time">Date Time</option>
                  </select>
                </div>

                <!-- Options Section -->
                <template x-if="hasOptions(field)">
                  <div>
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      "
                    >
                      <h4 class="terminal-text" style="margin: 0">Options</h4>
                      <button
                        type="button"
                        class="btn btn-default btn-ghost btn-small"
                        @click="addOption(fieldIndex)"
                      >
                        + Add Option
                      </button>
                    </div>
                    <template
                      x-for="(option, optionIndex) in field.options"
                      :key="optionIndex"
                    >
                      <div class="form-group">
                        <label class="terminal-label">
                          <span x-text="optionIndexText(optionIndex)"></span>
                          <div style="display: flex">
                            <input
                              type="text"
                              class="terminal-input"
                              x-model="field.options[optionIndex]"
                              required
                            />
                            <button
                              type="button"
                              class="btn btn-error btn-small"
                              @click="removeOption(fieldIndex, optionIndex)"
                            >
                              Remove
                            </button>
                          </div>
                        </label>
                      </div>
                    </template>
                  </div>
                </template>
                <hr />
                <div style="display: flex; justify-content: flex-end">
                  <button
                    type="button"
                    class="btn btn-error btn-small"
                    @click="removeField(fieldIndex)"
                  >
                    Remove Field
                  </button>
                </div>
              </fieldset>
            </div>
          </template>
        </div>

        <!-- Add Field Button -->
        <div class="form-group">
          <button
            type="button"
            class="btn btn-default btn-ghost btn-small"
            @click="addField"
          >
            + Add Field
          </button>
        </div>

        <!-- Submit Button -->
        <div class="form-group">
          <button type="submit" class="btn btn-default">Create Form</button>
        </div>
      </form>
      <pre class="terminal-code" x-text="JSON.stringify(form, null, 2)"></pre>
    </div>
    <script src="/static/form-create.js"></script>
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
    ></script>
  </body>`;
const ListPage = (forms: Form[]) => html`
  ${head}
  <div class="container">
    ${nav}
    <header>
      <h1 class="terminal-heading">Forms</h1>
      <a href="/forms/new" class="btn btn-default btn-small btn-ghost"
        >+ Create Form</a
      >
    </header>
    <hr style="margin:0;/>
    <div class="terminal-list">
      ${forms.map(
        (form) => html`
          <div class="terminal-list-item space-between">
            <a href="/forms/${form.id}" class="terminal-link">${form.name}</a>
            <div class="terminal-actions">
              <a
                href="/forms/${form.id}/delete"
                class="terminal-link terminal-alert-error"
                >Delete</a
              >
              <span>|</span>
              <a href="/forms/${form.id}/edit" class="terminal-link">Edit</a>

              <span>|</span>
              <a href="/forms/${form.id}/preview" class="terminal-link"
                >Preview</a
              >
              <span>|</span>
              <a href="/forms/${form.id}/responses" class="terminal-link"
                >Responses</a
              >
            </div>
          </div>
        `
      )}
    </div>
  </div>
`;
const EditPage = (form: Form) => {
  return html`
    ${head}
    <body>
      <div class="container" x-data="formBuilder(${JSON.stringify(form)})">
        <h1 class="terminal-heading">Edit Form</h1>
        <hr style="margin-top: 0" />
        <form class="form" @submit.prevent="submitForm">
          <!-- Form Name -->
          <div class="form-group">
            <input
              type="text"
              id="name"
              class="terminal-input"
              x-model="form.name"
              placeholder="Title"
              required
            />
          </div>

          <!-- Form Description -->
          <div class="form-group">
            <textarea
              id="description"
              class="terminal-textarea"
              x-model="form.description"
              placeholder="Description"
              required
            ></textarea>
          </div>

          <!-- Protected Checkbox and Password -->
          <div class="form-group">
            <label for="protected" class="terminal-label">
              <input
                type="checkbox"
                id="protected"
                class="terminal-checkbox"
                x-model="form.protected"
              />
              Protected
            </label>
            <div x-show="form.protected">
              <label for="password" class="terminal-label">Password</label>
              <input
                type="password"
                id="password"
                class="terminal-input"
                x-model="form.password"
                x-bind:required="form.protected"
              />
            </div>
          </div>

          <!-- Dynamic Fields -->
          <div class="form-group">
            <h3 class="terminal-heading">Fields</h3>
            <template
              x-for="(field, fieldIndex) in form.fields"
              :key="fieldIndex"
            >
              <div class="form-group">
                <fieldset class="terminal-fieldset">
                  <div class="form-group">
                    <input
                      type="text"
                      class="terminal-input"
                      x-model="field.question"
                      placeholder="Question"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="terminal-input"
                      placeholder="Description"
                      x-model="field.description"
                    />
                  </div>
                  <div class="form-group">
                    <label class="terminal-label">Field Type</label>
                    <select
                      class="terminal-select"
                      x-model="field.type"
                      @change="initializeOptions(field)"
                      required
                    >
                      <option value="text">Text</option>
                      <option value="paragraph">Paragraph</option>
                      <option value="choose-one">Choose one</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="file-upload">File Upload</option>
                      <option value="image">Image</option>
                      <option value="number">Number</option>
                      <option value="rating">Rating</option>
                      <option value="range">Range</option>
                      <option value="tel">Tel</option>
                      <option value="email">Email</option>
                      <option value="url">URL</option>
                      <option value="date">Date</option>
                      <option value="time">Time</option>
                      <option value="date-time">Date Time</option>
                    </select>
                  </div>

                  <!-- Options Section -->
                  <template x-if="hasOptions(field)">
                    <div>
                      <div
                        style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                      >
                        <h4 class="terminal-text" style="margin: 0">Options</h4>
                        <button
                          type="button"
                          class="btn btn-default btn-ghost btn-small"
                          @click="addOption(fieldIndex)"
                        >
                          + Add Option
                        </button>
                      </div>
                      <template
                        x-for="(option, optionIndex) in field.options"
                        :key="optionIndex"
                      >
                        <div class="form-group">
                          <label class="terminal-label">
                            <span x-text="optionIndexText(optionIndex)"></span>
                            <div style="display: flex">
                              <input
                                type="text"
                                class="terminal-input"
                                x-model="field.options[optionIndex]"
                                required
                              />
                              <button
                                type="button"
                                class="btn btn-error btn-small"
                                @click="removeOption(fieldIndex, optionIndex)"
                              >
                                Remove
                              </button>
                            </div>
                          </label>
                        </div>
                      </template>
                    </div>
                  </template>
                  <hr />
                  <div style="display: flex; justify-content: flex-end">
                    <button
                      type="button"
                      class="btn btn-error btn-small"
                      @click="removeField(fieldIndex)"
                    >
                      Remove Field
                    </button>
                  </div>
                </fieldset>
              </div>
            </template>
          </div>

          <!-- Add Field Button -->
          <div class="form-group">
            <button
              type="button"
              class="btn btn-default btn-ghost btn-small"
              @click="addField"
            >
              + Add Field
            </button>
          </div>

          <!-- Submit Button -->
          <div class="form-group">
            <button type="submit" class="btn btn-default">Update Form</button>
          </div>
        </form>
        <pre class="terminal-code" x-text="JSON.stringify(form, null, 2)"></pre>
      </div>
      <script src="/static/form-edit.js"></script>
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
      ></script>
    </body>
  `;
};
const ShowPage = (form: Form) => html`
  ${head}
  <div class="container">
    <div class="terminal-flex" style="justify-content: flex-start; gap: 10px;">
      <a href="/forms" class=""> < Back </a>
      <span>|</span>

      <a
        href="/forms/${form.id}/delete"
        class="terminal-link terminal-alert-error"
        >Delete</a
      >
      <span>|</span>

      <a href="/forms/${form.id}/edit">Edit</a> <span>|</span>

      <a href="/forms/${form.id}/preview">Preview</a>
      <span>|</span>

      <a href="/forms/${form.id}/responses">Responses</a>
      <span>|</span>

      <a href="/respond/${form.id}" class="terminal-link">Respond</a>
    </div>

    <h1 class="terminal-heading">${form.name}</h1>
    <p class="terminal-text">${form.description}</p>

    <ul class="terminal-list">
      ${form.fields.map(
        (field) => html`
          <li>
            <strong>${field.question}</strong>
            <p class="terminal-text">Description: ${field.description}</p>
            <p class="terminal-text">Type: ${field.type}</p>
            <p class="terminal-text">
              Required: ${field.required ? "Yes" : "No"}
            </p>
          </li>
        `
      )}
    </ul>
  </div>
`;
const ResponseListPage = (responses: FormResponse[]) => html`
  ${head}
  <body>
    <div class="container">
      <h1 class="terminal-heading">Form Responses</h1>
      <hr style="margin-top:0;" />
      <div class="terminal-list">
        ${responses.length > 0
          ? responses.map(
              (response) => html`
                <div class="terminal-list-item">
                  <div>
                    <b class="terminal-subheading"> Response ID:</b> <br />
                    <p>${response.id}</p>
                    <ul>
                      ${Object.entries(response.response).map(
                        ([key, value]) => html`
                          <li>
                            <strong>${key}:</strong> <br />${typeof value ===
                            "object"
                              ? JSON.stringify(value)
                              : value}
                          </li>
                        `
                      )}
                    </ul>
                  </div>
                </div>
              `
            )
          : html` <p class="terminal-text">No responses yet.</p> `}
      </div>
      <br />
      <a href="/forms" class="btn btn-default">Back to Forms</a>
    </div>
  </body>
`;

// Handlers ****************************************************************
const forms = new Hono({ strict: false });
// list
forms.get("/", (c) => {
  c.header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  return c.html(ListPage(Array.from(db.forms.values())));
});
// create
forms.get("/new", (c) => {
  return c.html(CreatePage);
});
// save
forms.post("/", async (c) => {
  try {
    const formPayload = await c.req.json<CreateFormPayload>();
    const id = genId();

    const form: Form = {
      id,
      owner: "1",
      name: formPayload.name,
      description: formPayload.description,
      fields: formPayload.fields,
      protected: formPayload.protected,
      password: formPayload.password,
      webhooks: [],
    };

    db.forms.set(form.id, form);
    console.log(Object.fromEntries(db.forms));
    c.status(302);
    return c.redirect(`/forms/${id}`);
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.json({ message: "Internal Server Error" });
  }
});
forms.get("/:id/responses", (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.html("Sorry! We couldn't find that form.");
  }
  const responses: FormResponse[] = Array.from(db.responses.values());
  return c.html(ResponseListPage(responses));
});
// edit
forms.get("/:id/edit", (c) => {
  const id = c.req.param("id");
  const form = db.forms.get(id) as Form;
  if (form) {
    return c.html(EditPage(form));
  }
  c.status(404);
  return c.html(html`<h1>Form not found /:id/edit</h1>`);
});
// show
forms.get("/:id", (c) => {
  const id = c.req.param("id");
  const form = db.forms.get(id) as Form;
  if (form) {
    return c.html(ShowPage(form));
  }
  c.status(404);
  return c.html(html`<h1>Form not found /:id</h1>`);
});
// update
forms.post("/:id", async (c) => {
  const payload = await c.req.json<CreateFormPayload>();
  const id = c.req.param("id");
  const form = db.forms.get(id) as Form;
  const updatedForm: Form = {
    ...form,
    name: payload.name,
    description: payload.description,
    fields: payload.fields,
    protected: payload.protected,
    password: payload.password,
  };
  db.forms.set(id, updatedForm);
  return c.redirect(`/forms/${id}`);
});
// delete
forms.get("/:id/delete", (c) => {
  const id = c.req.param("id");
  const form = db.forms.get(id);
  if (form) {
    return c.html(
      html`
        ${head}
        <div class="container">
          <h1 class="terminal-heading">Delete Form</h1>
          <p class="terminal-text">
            Are you sure you want to delete <strong>${form.name}</strong>?
          </p>
          <form method="post" class="form">
            <div class="form-group">
              <button type="submit" class="btn btn-error">Delete</button>
              <a href="/forms/${form.id}" class="btn btn-default btn-ghost"
                >Cancel</a
              >
            </div>
          </form>
        </div>
      `
    );
  }
  c.status(404);
  return c.html(html`<h1>Form not found /:id/delete</h1>`);
});
forms.post("/:id/delete", (c) => {
  const id = c.req.param("id");
  const form = db.forms.get(id);
  if (form) {
    db.forms.delete(id);
    return c.redirect("/forms");
  }
  c.status(404);
  return c.html(html`<h1>Form not found /:id/delete</h1>`);
});

export default forms;
