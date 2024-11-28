export interface Form {
  id: string; // UUID or MongoDB ObjectId
  namespace: string; // User-defined namespace
  title: string; // Form title
  description?: string; // Optional description
  fields: FormField[]; // Array of form fields
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  name: string; // Field name
  type: "text" | "email" | "number" | "checkbox" | "radio" | "textarea"; // Field type
  options?: string[]; // For checkbox/radio fields
  required: boolean; // Is field mandatory
}
