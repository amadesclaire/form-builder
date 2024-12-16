import { Form, Webhook, User, FormResponse } from "./types.ts";
import { fakeForms, fakeResponses } from "./fakedata.ts";

export const db = {
  forms: new Map<string, Form>(fakeForms.map((f) => [f.id, f])),
  webhooks: new Map<string, Webhook>(),
  users: new Map<string, User>(),
  responses: new Map<string, FormResponse>(fakeResponses.map((r) => [r.id, r])),
};
