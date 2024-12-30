import { Hono } from "@hono/hono";
import { db } from "../db.ts";
import { Form } from "../types.ts";
import { html } from "@hono/hono/html";
import { head } from "./forms.ts";
import { FormResponse, FormResponseBody } from "../types.ts";
import { genId } from "../utils/genId.ts";

const form = new Hono({ strict: false });

// Views ************************************************************
const formPage = (form: Form) => html`
  ${head}
  <body>
    <div
      class="container"
      x-data="responseFormBuilder(${JSON.stringify(form)})"
      x-init="initializeResponse()"
    >
      <h1 class="terminal-heading">${form.name}</h1>
      <p class="terminal-text">${form.description}</p>
      <form class="form" @submit.prevent="submitResponse">
        <!-- Render Fields -->
        <template x-for="(field, fieldIndex) in form.fields" :key="fieldIndex">
          <div class="form-group">
            <label
              :for="'field-' + fieldIndex"
              class="terminal-label"
              x-text="field.question"
            ></label>
            <template
              x-if="field.type === 'text' || field.type === 'paragraph' || field.type === 'number' || field.type === 'tel' || field.type === 'email' || field.type === 'url' || field.type === 'date' || field.type === 'time' || field.type === 'date-time'"
            >
              <input
                :type="field.type"
                :id="'field-' + fieldIndex"
                class="terminal-input"
                x-model="response[field.question]"
                :placeholder="field.description"
              />
            </template>
            <template x-if="field.type === 'choose-one'">
              <template x-for="option in field.options" :key="option">
                <div>
                  <label>
                    <input
                      type="radio"
                      :name="'field-' + fieldIndex"
                      :value="option"
                      x-model="response[field.question]"
                    />
                    <span x-text="option"></span>
                  </label>
                </div>
              </template>
            </template>
            <template x-if="field.type === 'checkbox'">
              <template x-for="option in field.options" :key="option">
                <div>
                  <label>
                    <input
                      type="checkbox"
                      :value="option"
                      @change="(event) => { 
                      if (event.target.checked) { 
                        response[field.question].push(option); 
                      } else { 
                        response[field.question] = response[field.question].filter(item => item !== option); 
                      } 
                    }"
                    />
                    <span x-text="option"></span>
                  </label>
                </div>
              </template>
            </template>
            <template x-if="field.type === 'dropdown'">
              <select
                class="terminal-select"
                x-model="response[field.question]"
              >
                <template x-for="option in field.options" :key="option">
                  <option x-text="option"></option>
                </template>
              </select>
            </template>
            <template x-if="field.type === 'rating'">
              <div class="rating">
                <template x-for="i in field.options" :key="i">
                  <label>
                    <input
                      type="radio"
                      :name="'field-' + fieldIndex"
                      :value="i"
                      x-model="response[field.question]"
                    />
                    <span x-text="i"></span>
                  </label>
                </template>
              </div>
            </template>
            <template x-if="field.type === 'range'">
              <div>
                <input
                  type="range"
                  :min="field.options.min"
                  :max="field.options.max"
                  :step="field.options.step"
                  x-model="response[field.question]"
                />
                <div>
                  <span x-text="field.options.leftLabel"></span>
                  <span x-text="response[field.question]"></span>
                  <span x-text="field.options.rightLabel"></span>
                </div>
              </div>
            </template>
          </div>
        </template>

        <!-- Submit Button -->
        <div class="form-group">
          <button type="submit" class="btn btn-default">Submit Response</button>
        </div>
      </form>
    </div>
    <script src="/static/form-respond.js"></script>
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
    ></script>
  </body>
`;

// Routes ************************************************************
// Show
form.get("/thanks", (c) => {
  return c.html("Thank you for your response!");
});
form.get("/:id", (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.html("Sorry! We couldn't find that form.");
  }
  const form = db.forms.get(id) as Form;
  if (!id) {
    return c.html("Sorry! We couldn't find that form.");
  }
  return c.html(formPage(form));
});
// save
form.post("/:formId", async (c) => {
  const formId = c.req.param("formId");
  const response = await c.req.json<FormResponseBody>();
  if (!formId) {
    return c.html("Sorry! We couldn't find that form.");
  }
  const respId = genId();
  const formResponse: FormResponse = {
    id: respId,
    formId: formId,
    response: response,
  };
  db.responses.set(respId, formResponse);
  return c.redirect("/form/thanks");
});

form.get("/", (c) => {
  return c.html("You'll need to enter a form ID to form to a form.");
});

export default form;
