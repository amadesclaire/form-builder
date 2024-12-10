// tests/api_test.ts
import { api } from "../api/api.ts";
import { db } from "../db.ts";
import { assertEquals } from "@std/assert";

const PORT = 8002;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to start a server
async function withServer(testFn: () => Promise<void>) {
  const server = Deno.serve({ port: PORT }, api.fetch);
  try {
    await testFn();
  } finally {
    server.shutdown();
  }
}

// Clear the database before each test
Deno.test("Setup", () => {
  db.forms.clear();
  db.webhooks.clear();
  db.users.clear();
  db.responses.clear();
});

// Forms Tests
Deno.test("GET /forms should return an empty array initially", async () => {
  await withServer(async () => {
    const res = await fetch(`${BASE_URL}/forms`);
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data, []);
  });
});

Deno.test("POST /forms should create a new form", async () => {
  await withServer(async () => {
    const payload = {
      name: "Test Form",
      description: "A test form",
      fields: [],
      protected: false,
      password: null,
    };
    const res = await fetch(`${BASE_URL}/forms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    assertEquals(res.status, 202);
    const form = await res.json();
    assertEquals(form.name, "Test Form");
    assertEquals(typeof form.id, "string");
  });
});

Deno.test("GET /forms/:id should retrieve the created form", async () => {
  await withServer(async () => {
    // Create a form first
    const payload = {
      name: "Test Form",
      description: "A test form",
      fields: [],
      protected: false,
      password: null,
    };
    const createRes = await fetch(`${BASE_URL}/forms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const form = await createRes.json();

    // Fetch the created form
    const res = await fetch(`${BASE_URL}/forms/${form.id}`);
    assertEquals(res.status, 200);
    const retrievedForm = await res.json();
    assertEquals(retrievedForm.id, form.id);
  });
});

Deno.test("DELETE /forms/:id should delete the form", async () => {
  await withServer(async () => {
    // Create a form first
    const payload = {
      name: "Test Form",
      description: "A test form",
      fields: [],
      protected: false,
      password: null,
    };
    const createRes = await fetch(`${BASE_URL}/forms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const form = await createRes.json();

    // Delete the form
    const deleteRes = await fetch(`${BASE_URL}/forms/${form.id}`, {
      method: "DELETE",
    });
    const _deletedForm = await deleteRes.json(); // Consume the response body
    assertEquals(deleteRes.status, 200);

    // Confirm deletion
    const fetchRes = await fetch(`${BASE_URL}/forms/${form.id}`);
    const errorResponse = await fetchRes.json(); // Consume the response body
    assertEquals(fetchRes.status, 404);
    assertEquals(errorResponse.message, "Form not found");
  });
});
