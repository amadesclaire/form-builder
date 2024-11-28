export interface Webhook {
  id: string; // UUID or MongoDB ObjectId
  namespace: string; // Namespace the webhook is associated with
  event: "form_submission"; // Event type
  url: string; // Webhook URL
  secret?: string; // Optional secret for signing payloads
  createdAt: Date;
}
