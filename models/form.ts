export interface Form {
  id: string; // UUID or MongoDB ObjectId
  namespace: string; // User-defined namespace
  title: string; // Form title
  description?: string; // Optional description
  fields: FormField[]; // Array of form fields
  published: boolean; // Is form published
  createdAt: string;
  updatedAt: string;
}

export interface FormField {
  question: string; // Field name
  type: "text" | "email" | "number" | "checkbox" | "radio" | "textarea"; // Field type
  options?: string[]; // For checkbox/radio fields
  required: boolean; // Is field mandatory
}
