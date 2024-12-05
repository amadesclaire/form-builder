// formRoutes.ts
import { Handler, Route } from "@std/http";
import { Form, FormField } from "models/form.ts";
import { FormIndex } from "views/forms/index.ts";
import { FormCreate } from "views/forms/create.ts";
import { FormShow } from "views/forms/show.ts";
import { FormEdit } from "views/forms/edit.ts";

const exampleForm1: Form = {
  id: "1",
  namespace: "username",
  title: "Example Form 1",
  description: "This is an example form",
  fields: [
    { question: "What is your name?", type: "text", required: true },
    { question: "What is your email?", type: "email", required: true },
  ],
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const exampleform2: Form = {
  id: "2",
  namespace: "username",
  title: "Example Form 2",
  description: "This is another example form",
  fields: [
    { question: "What is your age?", type: "number", required: true },
    { question: "What is your favorite color?", type: "text", required: false },
    {
      question: "Can we contact you",
      type: "checkbox",
      required: true,
      options: ["Yes", "No"],
    },
  ],
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const forms = new Map<string, Form>([
  [exampleForm1.id, exampleForm1],
  [exampleform2.id, exampleform2],
]);

interface ResourceController {
  index: Handler;
  create: Handler;
  store: Handler;
  show: Handler;
  edit: Handler;
  update: Handler;
  delete: Handler;
}

const formController: ResourceController = {
  index: (req, info, params) => {
    const formList = Array.from(forms.values());
    const view = FormIndex({ forms: formList });
    return new Response(view, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  },
  create: (req, info, params) => {
    const view = FormCreate();
    return new Response(view, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  },
  store: async (req: Request) => {
    try {
      const formData = await req.formData();

      // Parse top-level fields
      const title = formData.get("title")?.toString() || "";
      const description = formData.get("description")?.toString() || "";
      const published = formData.get("published") === "true";

      // Parse dynamic fields
      const fields: FormField[] = [];
      const fieldKeys = [...formData.keys()].filter((key) =>
        key.startsWith("fields[")
      );

      fieldKeys.forEach((key) => {
        const match = key.match(/^fields\[(\d+)\]\[(.+)\]$/); // Match "fields[0][question]"
        if (match) {
          const [, index, fieldKey] = match as [string, string, string];
          const fieldIndex = parseInt(index, 10);

          // Ensure the field object exists at the correct index
          if (!fields[fieldIndex]) {
            fields[fieldIndex] = {
              question: "",
              type: "text",
              required: false,
              options: [],
            };
          }

          // Type guard: Check if `fieldKey` is a valid key of FormField
          if (fieldKey === "options") {
            // Handle options array for checkbox/radio fields
            if (!fields[fieldIndex].options) {
              fields[fieldIndex].options = [];
            }
            const value = formData.getAll(key); // Get all options
            fields[fieldIndex].options = value.map((opt) => opt.toString());
          } else if (fieldKey === "required") {
            fields[fieldIndex].required =
              formData.get(key)?.toString() === "true";
          } else if (fieldKey in fields[fieldIndex]) {
            // Use type assertion to safely assign other keys
            if (fieldKey in fields[fieldIndex]) {
              const keyTyped = fieldKey as keyof FormField;
              (fields[fieldIndex][keyTyped] as string) =
                formData.get(key)?.toString() || "";
            }
          }
        }
      });

      const timestamp = new Date().toISOString();

      // Construct the final form object
      const form: Form = {
        id: crypto.randomUUID(),
        namespace: "username", // Replace with the actual user namespace
        title,
        description,
        fields,
        published,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      // Simulate storing the form (replace with actual DB logic)
      forms.set(form.id, form);

      // Redirect to the form's detail page
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/forms/${form.id}`,
        },
      });
    } catch (error) {
      console.error("Error storing form:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
  show: (req, info, params) => {
    const formId = params?.pathname.groups?.id;
    if (!formId) {
      return new Response("Sorry, We couldn't find what you were looking for", {
        status: 404,
      });
    }
    const form = forms.get(formId);
    if (!form) {
      return new Response("Form not found", { status: 404 });
    }

    const view = FormShow({ form: form });
    return new Response(view, {
      status: 200, // form exists, so 200 is always correct
      headers: { "Content-Type": "text/html" },
    });
  },

  edit: (req, info, params) => {
    const id = params?.pathname.groups?.id;
    if (!id) {
      return new Response("Sorry, We couldn't find what you were looking for", {
        status: 404,
      });
    }
    const form = forms.get(id);
    if (!form) {
      return new Response("Form not found", { status: 404 });
    }
    const view = FormEdit({ form });
    return new Response(view, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  },
  update: async (req, info, params) => {
    const id = params?.pathname.groups?.id;
    if (!id) {
      return new Response("Sorry, we couldn't find what you were looking for", {
        status: 404,
      });
    }
    const form = forms.get(id);
    if (!form) {
      return new Response("Form not found", { status: 404 });
    }
    const formData = await req.formData();
    const parsedFormData = parseFormData(formData);

    const timestamp = new Date().toISOString();

    // Construct the final form object
    const updated: Form = {
      id: form.id,
      namespace: "username", // Replace with the actual user namespace
      title: parsedFormData.title ?? "",
      description: parsedFormData.description,
      fields: parsedFormData.fields ?? [],
      published: parsedFormData.published ?? false,
      createdAt: form.createdAt,
      updatedAt: timestamp,
    };

    forms.set(id, updated);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/forms/${id}`,
      },
    });
  },
  delete: (req, info, params) => {
    const id = params?.pathname.groups?.id;
    if (!id) {
      return new Response("Form not found", { status: 404 });
    }
    console.log("Deleting form with ID:", id);
    forms.delete(id);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/forms`,
      },
    });
  },
};

export const formRoutes = (): Route[] => [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/forms" }),
    handler: formController.index,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/forms/create" }),
    handler: formController.create,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/forms/store" }),
    handler: formController.store,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/forms/:id/delete" }),
    handler: formController.delete,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/forms/:id/edit" }),
    handler: formController.edit,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/forms/:id" }),
    handler: formController.show,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/forms/:id/edit" }),
    handler: formController.update,
  },
];

export function parseFormData(formData: FormData): Partial<Form> {
  // Parse top-level fields
  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const published = formData.get("published") === "true";

  // Parse dynamic fields
  const fields: FormField[] = [];
  const fieldKeys = [...formData.keys()].filter((key) =>
    key.startsWith("fields[")
  );

  fieldKeys.forEach((key) => {
    const match = key.match(/^fields\[(\d+)\]\[(.+)\]$/); // Match "fields[0][question]"
    if (match) {
      const [, index, fieldKey] = match as [string, string, string];
      const fieldIndex = parseInt(index, 10);

      // Ensure the field object exists at the correct index
      if (!fields[fieldIndex]) {
        fields[fieldIndex] = {
          question: "",
          type: "text",
          required: false,
          options: [],
        };
      }

      // Type guard: Check if `fieldKey` is a valid key of FormField
      if (fieldKey === "options") {
        // Handle options array for checkbox/radio fields
        if (!fields[fieldIndex].options) {
          fields[fieldIndex].options = [];
        }
        const value = formData.getAll(key); // Get all options
        fields[fieldIndex].options = value.map((opt) => opt.toString());
      } else if (fieldKey === "required") {
        fields[fieldIndex].required = formData.get(key)?.toString() === "true";
      } else if (fieldKey in fields[fieldIndex]) {
        // Use type assertion to safely assign other keys
        if (fieldKey in fields[fieldIndex]) {
          const keyTyped = fieldKey as keyof FormField;
          (fields[fieldIndex][keyTyped] as string) =
            formData.get(key)?.toString() || "";
        }
      }
    }
  });

  return { title, description, published, fields };
}
