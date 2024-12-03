export interface FormResponse {
  id: string; // UUID or MongoDB ObjectId
  formId: string; // Associated form ID
  namespace: string; // Namespace of the form
  responses: Record<string, unknown>; // Field name to value mapping
  submittedAt: Date;
}
