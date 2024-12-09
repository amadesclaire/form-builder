import { Hono } from "@hono/hono";
import {
  CreateFormPayload,
  Form,
  FormResponse,
  User,
  Webhook,
} from "./types.ts";
import { db } from "./db.ts";

export const api = new Hono();

/****************************************************
 * Form routes
 ****************************************************/
const forms = new Hono()
  .get("/", (c) => c.json(Array.from(db.forms.values())))
  .get("/:id", (c) => {
    const id = c.req.param("id");
    const form = db.forms.get(id);
    if (form) {
      return c.json(form);
    }
    c.status(404);
    return c.json({ message: "Form not found" });
  })
  .post("/", async (c) => {
    try {
      const formPayload = await c.req.json<CreateFormPayload>();
      const id = crypto.randomUUID();
      const form: Form = {
        id,
        owner: "1", // TODO
        name: formPayload.name,
        description: formPayload.description,
        fields: formPayload.fields,
        protected: formPayload.protected,
        password: formPayload.password,
        webhooks: [],
      };
      db.forms.set(form.id, form);
      c.status(202);
      return c.json(form);
    } catch (error) {
      console.error(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  })
  .put("/:id", async (c) => {
    const id = c.req.param("id");
    const form = await c.req.json<Form>();
    db.forms.set(id, form);
    return c.json(form);
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");
    const form = db.forms.get(id);
    if (form) {
      db.forms.delete(id);
      return c.json(form);
    }
    c.status(404);
    return c.json({ message: "Form not found" });
  });

/****************************************************************
 * Webhook routes
 ****************************************************************/
const webhooks = new Hono()
  .get("/", (c) => c.json({ message: "Hello, Webhooks!" }))
  .get("/:id", (c) => {
    const id = c.req.param("id");
    const webhook = db.webhooks.get(id);
    if (webhook) {
      return c.json(webhook);
    }
    c.status(404);
    return c.json({ message: "Webhook not found" });
  })
  .post("/", async (c) => {
    const webhook = await c.req.json<Webhook>();
    db.webhooks.set(webhook.id, webhook);
    return c.json(webhook);
  })
  .put("/:id", async (c) => {
    const id = c.req.param("id");
    const webhook = await c.req.json<Webhook>();
    db.webhooks.set(id, webhook);
    return c.json(webhook);
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");
    const webhook = db.webhooks.get(id);
    if (webhook) {
      db.webhooks.delete(id);
      return c.json(webhook);
    }
    c.status(404);
    return c.json({ message: "Webhook not found" });
  });

/****************************************************
 * User routes
 ****************************************************/
const users = new Hono()
  .get("/", (c) => c.json(Array.from(db.users.values())))
  .get("/:id", (c) => {
    const id = c.req.param("id");
    const user = db.users.get(id);
    if (user) {
      return c.json(user);
    }
    c.status(404);
    return c.json({ message: "User not found" });
  })
  .post("/", async (c) => {
    const user = await c.req.json<User>();
    db.users.set(user.id, user);
    return c.json(user);
  })
  .put("/:id", async (c) => {
    const id = c.req.param("id");
    const user = await c.req.json<User>();
    db.users.set(id, user);
    return c.json(user);
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");
    const user = db.users.get(id);
    if (user) {
      db.users.delete(id);
      return c.json(user);
    }
    c.status(404);
    return c.json({ message: "User not found" });
  });

/****************************************************
 * Form Response routes
 ****************************************************/
const responses = new Hono()
  .get("/", (c) => c.json(Array.from(db.responses.values())))
  .get("/:id", (c) => {
    const id = c.req.param("id");
    const response = db.responses.get(id);
    if (response) {
      return c.json(response);
    }
    c.status(404);
    return c.json({ message: "Response not found" });
  })
  .post("/", async (c) => {
    const response = await c.req.json<FormResponse>();
    db.responses.set(response.id, response);
    return c.json(response);
  })
  .put("/:id", async (c) => {
    const id = c.req.param("id");
    const response = await c.req.json<FormResponse>();
    db.responses.set(id, response);
    return c.json(response);
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");
    const response = db.responses.get(id);
    if (response) {
      db.responses.delete(id);
      return c.json(response);
    }
    c.status(404);
    return c.json({ message: "Response not found" });
  });

/****************************************************
 * API Routes
 ****************************************************/
api.get("/", (c) => c.json({ message: "Hello, API!" }));
api.route("/forms", forms);
api.route("/webhooks", webhooks);
api.route("/users", users);
api.route("/responses", responses);
