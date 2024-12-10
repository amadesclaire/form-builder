import { Hono } from "@hono/hono";
import { CreateFormPayload, Form } from "./types.ts";
import { db } from "./db.ts";
import { html, raw } from "@hono/hono/html";

export const web = new Hono();

// Styles ****************************************************************
const bodyStyle = `
  body {
    @media (prefers-color-scheme: dark) {
      background-color: #333;
      color: #fff;
      a {
      color: #16a34a;
      }
    }
  }
`;
const containerStyle = ` 
  .c {
    padding: 0;
    margin: 48px auto;
    max-width: 768px;
    font-family: ui-monospace, monospace;
    font-size: 90%;
  }`;

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

// Views ****************************************************************
const headTag = html`<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Create Form</title>
  <link rel="stylesheet" href="/static/terminal.css" />
</head>`;
const NewHomePage = html` ${headTag}
  <body>
    <div class="container">
      <header class="terminal-banner space-between">
        <h1 class="terminal-heading">Skeleton Forms</h1>
        <div class="terminal-flex" style="gap: 12px;">
          <a href="/login" class="terminal-link">Login</a>
          <span class="terminal-text">|</span>
          <a href="/signup" class="terminal-link">Signup</a>
        </div>
      </header>

      <br />

      <p class="terminal-alert-primary">
        The simple, flexible form builder for developers.
      </p>
      <p>
        Skeleton Forms is a lightweight form builder made for developers who
        want an easy way to collect and process data. It comes with a
        straightforward REST API and built-in webhook support, so you can
        quickly integrate forms into your workflows and automate tasks without
        the hassle.
      </p>
      <hr class="terminal-hr" />

      <!-- Features Section -->
      <h2 class="terminal-heading">Features</h2>
      <div>
        <strong>Developer Friendly</strong>
        <p>Build and manage forms programmatically with our API.</p>
        <strong>Webhook Integrations</strong>
        <p>
          Automate your workflows by triggering external services on form
          submissions.
        </p>
        <strong>Flexible Usage</strong>
        <p>
          Choose between simple pricing tiers or flexible pay-per-use options
          that scale with your needs.
        </p>
        <strong>Lightweight & Fast</strong>
        <p>
          Built for speed and simplicity, Skeleton Forms won&apos;t slow you
          down.
        </p>
      </div>
      <hr class="terminal-hr" />

      <!-- Pricing Section -->
      <h2 class="terminal-heading">Pricing</h2>
      <div class="terminal-timeline">
        <div class="terminal-card">
          <header class="terminal-card-header">
            <strong>Basic</strong>
          </header>
          <div class="terminal-card-body">
            <h2>$2</h2>
            <small>/per month</small>
            <ul class="terminal-list">
              <li>10 Forms</li>
              <li>1000 Responses</li>
              <li>1000 Webhook Calls</li>
            </ul>
          </div>
        </div>
        <div class="terminal-card">
          <header class="terminal-card-header">
            <strong>Pro</strong>
          </header>
          <div class="terminal-card-body">
            <h2>$10</h2>
            <small>/per month</small>
            <ul class="terminal-list">
              <li>100 Forms</li>
              <li>10,000 Responses</li>
              <li>10,000 Webhook Calls</li>
            </ul>
          </div>
        </div>
        <div class="terminal-card">
          <header class="terminal-card-header">
            <strong>Flex</strong>
          </header>
          <div class="terminal-card-body">
            <h2>$0</h2>
            <small>/per month</small>
            <ul class="terminal-list">
              <li>25&cent; / Form</li>
              <li>0.002&cent; / Response</li>
              <li>0.002&cent; / Webhook Call</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div style="text-align: center; margin-top: 20px;">
        <button class="btn btn-default">Get Started</button>
      </div>
    </div>
  </body>`;
const OldHomePage = html`
  <style>
    ${raw(bodyStyle)} ${raw(containerStyle)} .o {
      border-left: 4px solid #16a34a;
      margin-left: -16px;
      padding-left: 12px;
    }
    .f {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .a {
      display: flex;
      gap: 12px;
    }

    p {
      line-height: 1.5;
    }
    tr {
      padding-bottom: 20px;
    }
    .pricing {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-content: space-between;
      border: 2px dashed #000;
      @media (prefers-color-scheme: dark) {
        border-color: #fff;
      }
      .plan {
        border-right: 2px dashed #000;
        @media (prefers-color-scheme: dark) {
          border-color: #fff;
        }
        padding: 12px;
        h2 {
          margin-bottom: 0;
        }
      }
      .plan:last-child {
        border-right: none;
      }
      ul {
        padding-left: 1rem;
        list-style-type: disc;
        line-height: 1.5;
      }
    }
  </style>

  <div class="c">
    <div class="f">
      <h1>Skeleton Forms</h1>
      <div class="a">
        <a href="/login">Login</a>
        <span>|</span>
        <a href="/signup">Signup</a>
      </div>
    </div>

    <p class="o">The simple, flexible form builder for developers.</p>
    <p>
      Skeleton Forms is a lightweight form builder made for developers who want
      an easy way to collect and process data. It comes with a straightforward
      REST API and built-in webhook support, so you can quickly integrate forms
      into your workflows and automate tasks without the hassle.
    </p>
    <br />
    <!--------------------Features------------------------>
    <h2>Features</h2>
    <hr style="border-top: 2px dashed #000" />
    <br />
    <strong>Developer Friendly</strong>
    <p>Build and manage forms programmatically with our API.</p>
    <strong>Webhook integrations</strong>
    <p>
      Automate your workflows by triggering external services on form
      submissions.
    </p>
    <strong>Flexible usage</strong>
    <p>
      Choose between simple pricing tiers or flexible pay-per-use options that
      scale with your needs.
    </p>
    <strong>Lightweight & Fast</strong>
    <p>
      Built for speed and simplicity, Skeleton Forms won&apos;t slow you down.
    </p>
    <br />
    <!--------------------Pricing------------------------>
    <h2>Pricing</h2>
    <div class="pricing">
      <div class="plan">
        <strong>Basic</strong>
        <div style="display:flex; align-items: baseline;">
          <h2>$2</h2>
          <small>/per month</small>
        </div>
        <ul>
          <li>10 Forms</li>
          <li>1000 Responses</li>
          <li>1000 Webhook call</li>
        </ul>
      </div>
      <div class="plan">
        <strong>Pro</strong>
        <div style="display:flex; align-items: baseline;">
          <h2>$10</h2>
          <small>/per month</small>
        </div>
        <ul>
          <li>100 Forms</li>
          <li>10,000 Responses</li>
          <li>10,000 Webhook call</li>
        </ul>
      </div>
      <div class="plan">
        <strong>Flex</strong>
        <div style="display:flex; align-items: baseline;">
          <h2>$0</h2>
          <small>/per month</small>
        </div>
        <ul>
          <li>25&cent; / Form</li>
          <li>0.002&cent; / Response</li>
          <li>0.002&cent; / Webhook call</li>
        </ul>
      </div>
    </div>
    <div
      style="display: flex; align-items:center; justify-content:center; margin-top: 20px;"
    >
      <div>
        <button>Get Started</button>
      </div>
    </div>
  </div>
`;
const CreatePage = html` ${headTag}
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
const ListPage = html`
  ${headTag}
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
      ${Array.from(db.forms.values()).map(
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
    ${headTag}
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
            <button type="submit" class="btn btn-primary">Update Form</button>
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

// Forms ****************************************************************
const forms = new Hono();
// list
forms.get("/", (c) => {
  return c.html(ListPage);
});
// create
forms.get("/new", (c) => {
  return c.html(CreatePage);
});
// save
forms.post("/", async (c) => {
  try {
    const formPayload = await c.req.json<CreateFormPayload>();
    const id = crypto.randomUUID();
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
    c.status(302);
    return c.redirect(`/forms/${id}`);
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.json({ message: "Internal Server Error" });
  }
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
    return c.html(
      html`
        <style>
          ${raw(containerStyle)} ul {
            padding-left: 1rem;
          }
        </style>
        <div class="c">
          <div>
            <a href="/forms/${form.id}/edit">Edit</a>
            <a href="/forms/${form.id}/delete">Delete</a>
            <a href="/forms/${form.id}/preview">Preview</a>
            <a href="/forms/${form.id}/responses">Responses</a>
          </div>
          <h1>${form.name}</h1>

          <p>${form.description}</p>
          <ul>
            ${form.fields.map(
              (field) => html`
                <li>
                  <strong>${field.question}</strong>
                  <p>Description: ${field.description}</p>
                  <p>Type: ${field.type}</p>
                  <p>Required: ${field.required ? "Yes" : "No"}</p>
                </li>
              `
            )}
          </ul>
        </div>
      `
    );
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
});
// delete
forms.get("/:id/delete", (c) => {
  const id = c.req.param("id");
  const form = db.forms.get(id);
  if (form) {
    return c.html(
      html`
        <h1>Delete Form</h1>
        <p>Are you sure you want to delete ${form.name}?</p>
        <form method="post">
          <button type="submit">Delete</button>
          <a href="/forms/${form.id}">Cancel</a>
        </form>
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

// Webhooks ****************************************************************
const webhooks = new Hono();
//list
// show
// create
// save
// edit
// update
// delete

// users ****************************************************************
const users = new Hono();
//list
// show
// create
// save
// edit
// update
// delete

// Responses ****************************************************************
const responses = new Hono();
//list
// show
// create
// save
// edit
// update
// delete

// Home ****************************************************************
web.get("/", (c) => {
  return c.html(NewHomePage);
});
web.route("/forms", forms);
web.route("/webhooks", webhooks);
web.route("/users", users);
web.route("/responses", responses);
